// Firebase Database Manager - CDN version
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

class FirebaseDatabase {
  constructor() {
    this.db = window.firebaseDB || null;
    this.auth = window.firebaseAuth || null;
  }

  getDb() {
    if (!this.db && window.firebaseDB) {
      this.db = window.firebaseDB;
    }
    if (!this.db) {
      throw new Error('Firebase DB is not initialized. Load firebase-config-cdn.js first.');
    }
    return this.db;
  }

  collectionRef(name) {
    return collection(this.getDb(), name);
  }

  docRef(collectionName, id) {
    return doc(this.getDb(), collectionName, String(id));
  }

  toArray(snapshot) {
    const rows = [];
    snapshot.forEach((item) => rows.push({ id: item.id, ...item.data() }));
    return rows;
  }

  async getCollectionRows(collectionName) {
    const snapshot = await getDocs(this.collectionRef(collectionName));
    return this.toArray(snapshot);
  }

  toDate(value, endOfDay = false) {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00'}`);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  getTimestamp(row) {
    return (
      this.toDate(row.createdAt) ||
      this.toDate(row.updatedAt) ||
      this.toDate(row.date_created) ||
      this.toDate(row.date_added) ||
      this.toDate(row.paymentDate) ||
      this.toDate(row.visitDate) ||
      new Date(0)
    );
  }

  inDateRange(rowDate, dateFrom, dateTo) {
    const date = this.toDate(rowDate);
    if (!date) return !(dateFrom || dateTo);

    const from = this.toDate(dateFrom);
    const to = this.toDate(dateTo, true);
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  }

  async findFirstByField(collectionName, field, values) {
    for (const value of values) {
      if (value === undefined || value === null || value === '') continue;
      const q = query(this.collectionRef(collectionName), where(field, '==', value));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0];
      }
    }
    return null;
  }

  async resolveDocRef(collectionName, id, fallbackFields = []) {
    if (id === undefined || id === null || id === '') {
      throw new Error(`Missing document id for ${collectionName}`);
    }

    const directRef = this.docRef(collectionName, id);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return directRef;
    }

    for (const fallback of fallbackFields) {
      const found = await this.findFirstByField(collectionName, fallback.field, fallback.values);
      if (found) return found.ref;
    }

    throw new Error(`Document not found in ${collectionName}: ${id}`);
  }

  isQuotaError(error) {
    const message = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();
    return (
      message.includes('resource-exhausted') ||
      message.includes('quota') ||
      message.includes('quota exceeded')
    );
  }

  getMaxPhoneNumber(phones) {
    return phones.reduce((max, phone) => {
      const value = parseInt(String(phone.phone_number || '').trim(), 10);
      return Number.isNaN(value) ? max : Math.max(max, value);
    }, 0);
  }

  formatPhoneNumber(value) {
    return String(value).padStart(6, '0');
  }

  async getHighestPhoneNumberFromFirestore() {
    try {
      const snapshot = await getDocs(
        query(this.collectionRef('phones'), orderBy('phone_number', 'desc'), firestoreLimit(50))
      );
      const maxFromOrderedQuery = this.getMaxPhoneNumber(this.toArray(snapshot));
      if (maxFromOrderedQuery > 0) {
        return maxFromOrderedQuery;
      }
    } catch (error) {
      console.warn('⚠️ Ordered phone_number lookup failed; falling back to a full phones scan.', error);
    }

    const phones = await this.getPhones();
    return this.getMaxPhoneNumber(phones);
  }

  async getNextPhoneNumber() {
    let highestExistingPhoneNumber = 0;
    let highestLookupError = null;

    try {
      highestExistingPhoneNumber = await this.getHighestPhoneNumberFromFirestore();
    } catch (error) {
      highestLookupError = error;
      console.warn('⚠️ Could not read the highest phone_number from phones collection.', error);
    }

    try {
      const counterRef = this.docRef('counters', 'phoneNumber');
      const nextNumber = await runTransaction(this.getDb(), async (transaction) => {
        const counterSnap = await transaction.get(counterRef);
        const counterValue = counterSnap.exists()
          ? Number(
              counterSnap.data().lastPhoneNumber ||
              counterSnap.data().lastNumber ||
              counterSnap.data().value ||
              0
            )
          : 0;
        const next = highestExistingPhoneNumber > 0
          ? highestExistingPhoneNumber + 1
          : counterValue + 1;
        transaction.set(counterRef, {
          lastPhoneNumber: next,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return next;
      });

      return this.formatPhoneNumber(nextNumber);
    } catch (error) {
      const reason = this.isQuotaError(error) ? 'quota/resource-exhausted' : 'counter update failed';
      console.warn(`⚠️ Barcode counter unavailable (${reason}); using next number from phones collection.`, error);
      if (highestExistingPhoneNumber > 0 || !highestLookupError) {
        return this.formatPhoneNumber(highestExistingPhoneNumber + 1);
      }
      throw highestLookupError;
    }
  }

  async phoneNumberExists(phoneNumber) {
    const normalized = String(phoneNumber || '').trim();
    if (!normalized) return false;

    const values = [normalized];
    const numericValue = parseInt(normalized, 10);
    if (!Number.isNaN(numericValue)) values.push(numericValue);

    return !!(await this.findFirstByField('phones', 'phone_number', values));
  }

  async addPhone(phoneData) {
    const phoneNumber = phoneData.phone_number != null ? String(phoneData.phone_number).trim() : '';
    if (!phoneNumber) {
      throw new Error('رقم الباركود مطلوب');
    }
    if (await this.phoneNumberExists(phoneNumber)) {
      throw new Error('رقم الباركود مستخدم مسبقاً');
    }

    const docRef = await addDoc(this.collectionRef('phones'), {
      ...phoneData,
      phone_number: phoneNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Phone saved to Firestore phones collection:', docRef.id, 'phone_number:', phoneNumber);
    return docRef.id;
  }

  async getPhones() {
    const phones = await this.getCollectionRows('phones');
    phones.sort((a, b) => this.getTimestamp(b) - this.getTimestamp(a));
    console.log('📱 Retrieved phones:', phones.length);
    return phones;
  }

  async getPhoneByNumber(phoneNumber) {
    const normalized = String(phoneNumber || '').trim();
    if (!normalized) return null;

    const values = [normalized];
    const numericValue = parseInt(normalized, 10);
    if (!Number.isNaN(numericValue)) values.push(numericValue);

    const found = await this.findFirstByField('phones', 'phone_number', values);
    return found ? { id: found.id, ...found.data() } : null;
  }

  async updatePhone(phoneId, phoneData) {
    const ref = await this.resolveDocRef('phones', phoneId, [
      { field: 'phone_number', values: [String(phoneId), parseInt(String(phoneId), 10)] }
    ]);
    await updateDoc(ref, { ...phoneData, updatedAt: serverTimestamp() });
    return true;
  }

  async deletePhone(phoneId) {
    const ref = await this.resolveDocRef('phones', phoneId, [
      { field: 'phone_number', values: [String(phoneId), parseInt(String(phoneId), 10)] }
    ]);
    await deleteDoc(ref);
    return true;
  }

  async addAccessory(accessoryData) {
    const docRef = await addDoc(this.collectionRef('accessories'), {
      ...accessoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getAccessories() {
    const accessories = await this.getCollectionRows('accessories');
    accessories.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
    console.log('🛍️ Retrieved accessories:', accessories.length);
    return accessories;
  }

  async getAccessoryByBarcode(barcode) {
    const normalized = String(barcode || '').trim();
    if (!normalized) return null;

    const values = [normalized];
    const numericValue = parseInt(normalized, 10);
    if (!Number.isNaN(numericValue)) values.push(numericValue);

    const found =
      (await this.findFirstByField('accessories', 'barcode', values)) ||
      (await this.findFirstByField('accessories', 'accessory_number', values));

    return found ? { id: found.id, ...found.data() } : null;
  }

  async updateAccessory(accessoryId, accessoryData) {
    const ref = await this.resolveDocRef('accessories', accessoryId, [
      { field: 'barcode', values: [String(accessoryId), parseInt(String(accessoryId), 10)] },
      { field: 'accessory_number', values: [String(accessoryId), parseInt(String(accessoryId), 10)] }
    ]);
    await updateDoc(ref, { ...accessoryData, updatedAt: serverTimestamp() });
    return true;
  }

  async deleteAccessory(accessoryId) {
    const ref = await this.resolveDocRef('accessories', accessoryId, [
      { field: 'barcode', values: [String(accessoryId), parseInt(String(accessoryId), 10)] },
      { field: 'accessory_number', values: [String(accessoryId), parseInt(String(accessoryId), 10)] }
    ]);
    await deleteDoc(ref);
    return true;
  }

  async addSale(saleData) {
    const docRef = await addDoc(this.collectionRef('sales'), {
      ...saleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getSales() {
    try {
      const snapshot = await getDocs(query(this.collectionRef('sales'), orderBy('createdAt', 'desc')));
      const sales = this.toArray(snapshot);
      console.log('💰 Retrieved sales:', sales.length);
      return sales;
    } catch (error) {
      console.warn('⚠️ Falling back to manual sales sorting:', error);
      const sales = await this.getCollectionRows('sales');
      sales.sort((a, b) => this.getTimestamp(b) - this.getTimestamp(a));
      return sales;
    }
  }

  async getSale(saleId) {
    const saleDoc = await getDoc(this.docRef('sales', saleId));
    return saleDoc.exists() ? { id: saleDoc.id, ...saleDoc.data() } : null;
  }

  async updateSale(saleId, saleData) {
    await updateDoc(this.docRef('sales', saleId), { ...saleData, updatedAt: serverTimestamp() });
    return true;
  }

  async deleteSale(saleId) {
    await deleteDoc(this.docRef('sales', saleId));
    return true;
  }

  async addAccessoryCategory(categoryData) {
    const docRef = await addDoc(this.collectionRef('accessory_categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getAccessoryCategories() {
    const categories = await this.getCollectionRows('accessory_categories');
    categories.sort((a, b) => String(a.arabic_name || a.name || '').localeCompare(String(b.arabic_name || b.name || ''), 'ar'));
    return categories;
  }

  async deleteAccessoryCategory(categoryName) {
    const snapshot = await getDocs(
      query(this.collectionRef('accessory_categories'), where('arabic_name', '==', categoryName))
    );
    await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
    return true;
  }

  async addPhoneType(phoneTypeData) {
    const docRef = await addDoc(this.collectionRef('phone_types'), {
      ...phoneTypeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getPhoneTypes() {
    const phoneTypes = await this.getCollectionRows('phone_types');
    phoneTypes.sort((a, b) => `${a.brand || a.manufacturer || ''} ${a.model || ''}`.localeCompare(`${b.brand || b.manufacturer || ''} ${b.model || ''}`, 'ar'));
    return phoneTypes;
  }

  async deletePhoneType(brand, model) {
    const snapshot = await getDocs(
      query(this.collectionRef('phone_types'), where('brand', '==', brand), where('model', '==', model))
    );
    await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
    return true;
  }

  async searchPhones(searchTerm) {
    const value = String(searchTerm || '').toLowerCase();
    const phones = await this.getPhones();
    return phones.filter((phone) => [
      phone.phone_number,
      phone.serial_number,
      phone.brand,
      phone.model,
      phone.phone_color,
      phone.phone_memory,
      phone.description,
      phone.customer_name,
      phone.customer_id
    ].some((field) => field && String(field).toLowerCase().includes(value)));
  }

  async searchAccessories(searchTerm) {
    const value = String(searchTerm || '').toLowerCase();
    const accessories = await this.getAccessories();
    return accessories.filter((accessory) => [
      accessory.name,
      accessory.category,
      accessory.description,
      accessory.supplier,
      accessory.notes
    ].some((field) => field && String(field).toLowerCase().includes(value)));
  }

  onPhonesChange(callback) {
    return onSnapshot(this.collectionRef('phones'), (snapshot) => callback(this.toArray(snapshot)));
  }

  onAccessoriesChange(callback) {
    return onSnapshot(this.collectionRef('accessories'), (snapshot) => callback(this.toArray(snapshot)));
  }

  onSalesChange(callback) {
    return onSnapshot(query(this.collectionRef('sales'), orderBy('createdAt', 'desc')), (snapshot) => callback(this.toArray(snapshot)));
  }

  async addRep(repData) {
    const docRef = await addDoc(this.collectionRef('reps'), {
      ...repData,
      active: repData.active !== false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getReps() {
    const reps = await this.getCollectionRows('reps');
    reps.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
    return reps;
  }

  async updateRep(repId, repData) {
    await updateDoc(this.docRef('reps', repId), { ...repData, updatedAt: serverTimestamp() });
    return true;
  }

  async deleteRep(repId) {
    await deleteDoc(this.docRef('reps', repId));
    return true;
  }

  async addTechnician(techData) {
    const docRef = await addDoc(this.collectionRef('technicians'), {
      ...techData,
      active: techData.active !== false,
      defaultCommissionPercent: techData.defaultCommissionPercent || 0.5,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getTechnicians() {
    const technicians = await this.getCollectionRows('technicians');
    technicians.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
    return technicians;
  }

  async updateTechnician(techId, techData) {
    await updateDoc(this.docRef('technicians', techId), { ...techData, updatedAt: serverTimestamp() });
    return true;
  }

  async deleteTechnician(techId) {
    await deleteDoc(this.docRef('technicians', techId));
    return true;
  }

  computeDerived(partCost, amountCharged, techPercent) {
    const pc = Number(partCost) || 0;
    const ac = Number(amountCharged) || 0;
    const tp = Number(techPercent) || 0;
    const profit = ac - pc;
    const techCommission = Math.max(0, profit * tp);
    const shopProfit = profit - techCommission;
    return { profit, techCommission, shopProfit };
  }

  calcProfit(partCost, amountCharged) {
    return Math.max(0, Number((Number(amountCharged || 0) - Number(partCost || 0)).toFixed(2)));
  }

  calcTechCommission(profit, percent) {
    return Number((Number(profit || 0) * Number(percent || 0)).toFixed(2));
  }

  calcShopProfit(profit, techCommission) {
    return Number((Number(profit || 0) - Number(techCommission || 0)).toFixed(2));
  }

  getTotalPartCost(jobData) {
    if (Array.isArray(jobData.parts) && jobData.parts.length > 0) {
      return jobData.parts.reduce((sum, part) => sum + (Number(part.partCost) || 0), 0);
    }
    if (jobData.totalPartCost !== undefined && jobData.totalPartCost !== null) {
      return Number(jobData.totalPartCost) || 0;
    }
    return Number(jobData.partCost) || 0;
  }

  async addMaintenanceJob(jobData) {
    const totalPartCost = this.getTotalPartCost(jobData);
    const derived = this.computeDerived(totalPartCost, jobData.amountCharged, jobData.techPercent);
    const docRef = await addDoc(this.collectionRef('maintenanceJobs'), {
      ...jobData,
      totalPartCost,
      ...derived,
      status: jobData.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getMaintenanceJobs(filters = {}) {
    let jobs;
    try {
      if (filters.status) {
        const snapshot = await getDocs(query(this.collectionRef('maintenanceJobs'), where('status', '==', filters.status)));
        jobs = this.toArray(snapshot);
      } else if (filters.techId) {
        const snapshot = await getDocs(query(this.collectionRef('maintenanceJobs'), where('techId', '==', filters.techId)));
        jobs = this.toArray(snapshot);
      } else {
        jobs = await this.getCollectionRows('maintenanceJobs');
      }
    } catch (error) {
      console.warn('⚠️ Falling back to full maintenanceJobs read:', error);
      jobs = await this.getCollectionRows('maintenanceJobs');
    }

    jobs = jobs.filter((job) => {
      if (filters.status && job.status !== filters.status) return false;
      if (filters.techId && job.techId !== filters.techId) return false;
      if (!this.inDateRange(job.visitDate, filters.dateFrom, filters.dateTo)) return false;

      if (filters.repId) {
        if (Array.isArray(job.parts) && job.parts.length > 0) {
          return job.parts.some((part) => part.repId === filters.repId);
        }
        return job.repId === filters.repId;
      }

      return true;
    });

    jobs.sort((a, b) => {
      const dateA = this.toDate(a.visitDate) || this.getTimestamp(a);
      const dateB = this.toDate(b.visitDate) || this.getTimestamp(b);
      return dateB - dateA;
    });

    console.log('✅ Maintenance jobs loaded:', jobs.length);
    return jobs;
  }

  async getMaintenanceJob(jobId) {
    const jobSnap = await getDoc(this.docRef('maintenanceJobs', jobId));
    if (!jobSnap.exists()) {
      throw new Error('Job not found');
    }
    return { id: jobSnap.id, ...jobSnap.data() };
  }

  async updateMaintenanceJob(jobId, jobData) {
    const nextData = { ...jobData };
    if (
      nextData.profit === undefined ||
      nextData.techCommission === undefined ||
      nextData.shopProfit === undefined
    ) {
      const currentJob = await this.getMaintenanceJob(jobId);
      const merged = { ...currentJob, ...nextData };
      const totalPartCost = this.getTotalPartCost(merged);
      const derived = this.computeDerived(totalPartCost, merged.amountCharged, merged.techPercent);
      Object.assign(nextData, { totalPartCost, ...derived });
    }

    await updateDoc(this.docRef('maintenanceJobs', jobId), {
      ...nextData,
      updatedAt: serverTimestamp()
    });
    return true;
  }

  async deleteMaintenanceJob(jobId) {
    await deleteDoc(this.docRef('maintenanceJobs', jobId));
    return true;
  }

  async createSettlement(settlementData) {
    const docRef = await addDoc(this.collectionRef('settlements'), {
      ...settlementData,
      status: settlementData.status || 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getSettlements(filters = {}) {
    let settlements = await this.getCollectionRows('settlements');
    settlements = settlements.filter((settlement) => {
      if (filters.type && settlement.type !== filters.type) return false;
      if (filters.status && settlement.status !== filters.status) return false;
      return true;
    });
    settlements.sort((a, b) => this.getTimestamp(b) - this.getTimestamp(a));
    return settlements;
  }

  async markSettlementPaid(settlementId, notes = '') {
    await updateDoc(this.docRef('settlements', settlementId), {
      status: 'paid',
      paidAt: serverTimestamp(),
      notes,
      updatedAt: serverTimestamp()
    });
    return true;
  }

  async addPayment(paymentData) {
    const docRef = await addDoc(this.collectionRef('payments'), {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getPayments(filters = {}) {
    let payments;
    try {
      if (filters.entityId) {
        const snapshot = await getDocs(query(this.collectionRef('payments'), where('entityId', '==', filters.entityId)));
        payments = this.toArray(snapshot);
      } else if (filters.entityType) {
        const snapshot = await getDocs(query(this.collectionRef('payments'), where('entityType', '==', filters.entityType)));
        payments = this.toArray(snapshot);
      } else {
        payments = await this.getCollectionRows('payments');
      }
    } catch (error) {
      console.warn('⚠️ Falling back to full payments read:', error);
      payments = await this.getCollectionRows('payments');
    }

    payments = payments.filter((payment) => {
      if (filters.entityType && payment.entityType !== filters.entityType) return false;
      if (filters.entityId && payment.entityId !== filters.entityId) return false;
      return this.inDateRange(payment.paymentDate, filters.dateFrom, filters.dateTo);
    });

    payments.sort((a, b) => (this.toDate(b.paymentDate) || this.getTimestamp(b)) - (this.toDate(a.paymentDate) || this.getTimestamp(a)));
    return payments;
  }

  async updatePayment(paymentId, paymentData) {
    await updateDoc(this.docRef('payments', paymentId), {
      ...paymentData,
      updatedAt: serverTimestamp()
    });
    return true;
  }

  async deletePayment(paymentId) {
    await deleteDoc(this.docRef('payments', paymentId));
    return true;
  }

  async getRepSettlements(dateFrom, dateTo) {
    const jobs = await this.getMaintenanceJobs({ status: 'done', dateFrom, dateTo });
    const totals = {};

    jobs.forEach((job) => {
      if (Array.isArray(job.parts) && job.parts.length > 0) {
        job.parts.forEach((part, index) => {
          if (!part.repId) return;
          if (!totals[part.repId]) {
            totals[part.repId] = {
              repId: part.repId,
              repName: part.repName || 'غير محدد',
              jobsCount: 0,
              partCostSum: 0,
              profitSum: 0,
              techCommissionSum: 0,
              shopProfitSum: 0,
              revenueSum: 0
            };
          }

          totals[part.repId].partCostSum += Number(part.partCost) || 0;
          if (index === 0) {
            totals[part.repId].jobsCount += 1;
            totals[part.repId].profitSum += Number(job.profit) || 0;
            totals[part.repId].techCommissionSum += Number(job.techCommission) || 0;
            totals[part.repId].shopProfitSum += Number(job.shopProfit) || 0;
            totals[part.repId].revenueSum += Number(job.amountCharged) || 0;
          }
        });
        return;
      }

      if (!job.repId) return;
      if (!totals[job.repId]) {
        totals[job.repId] = {
          repId: job.repId,
          repName: job.repName || 'غير محدد',
          jobsCount: 0,
          partCostSum: 0,
          profitSum: 0,
          techCommissionSum: 0,
          shopProfitSum: 0,
          revenueSum: 0
        };
      }

      totals[job.repId].jobsCount += 1;
      totals[job.repId].partCostSum += this.getTotalPartCost(job);
      totals[job.repId].profitSum += Number(job.profit) || 0;
      totals[job.repId].techCommissionSum += Number(job.techCommission) || 0;
      totals[job.repId].shopProfitSum += Number(job.shopProfit) || 0;
      totals[job.repId].revenueSum += Number(job.amountCharged) || 0;
    });

    return Object.values(totals);
  }

  async getTechSettlements(dateFrom, dateTo) {
    const jobs = await this.getMaintenanceJobs({ status: 'done', dateFrom, dateTo });
    const totals = {};

    jobs.forEach((job) => {
      if (!job.techId) return;
      if (!totals[job.techId]) {
        totals[job.techId] = {
          techId: job.techId,
          techName: job.techName || 'غير محدد',
          jobsCount: 0,
          partCostSum: 0,
          profitSum: 0,
          techCommissionSum: 0,
          shopProfitSum: 0,
          revenueSum: 0
        };
      }

      totals[job.techId].jobsCount += 1;
      totals[job.techId].partCostSum += this.getTotalPartCost(job);
      totals[job.techId].profitSum += Number(job.profit) || 0;
      totals[job.techId].techCommissionSum += Number(job.techCommission) || 0;
      totals[job.techId].shopProfitSum += Number(job.shopProfit) || 0;
      totals[job.techId].revenueSum += Number(job.amountCharged) || 0;
    });

    return Object.values(totals);
  }

  async initializeDefaultData() {
    const defaultCategories = [
      { name: 'accessory', arabic_name: 'إكسسوار', description: 'إكسسوارات عامة' },
      { name: 'charger', arabic_name: 'شاحن', description: 'شواحن الهواتف' },
      { name: 'case', arabic_name: 'غلاف', description: 'أغلفة الهواتف' },
      { name: 'screen_protector', arabic_name: 'حماية الشاشة', description: 'حماية شاشة الهاتف' },
      { name: 'cable', arabic_name: 'كابل', description: 'كابلات البيانات والشحن' },
      { name: 'headphone', arabic_name: 'سماعات', description: 'سماعات الهواتف' },
      { name: 'other', arabic_name: 'أخرى', description: 'فئات أخرى' }
    ];

    try {
      const existingCategories = await this.getAccessoryCategories();
      if (existingCategories.length === 0) {
        await Promise.all(defaultCategories.map((category) => this.addAccessoryCategory(category)));
      }
      console.log('🔥 Firebase Database Manager initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing Firebase Database:', error);
    }
  }
}

window.FirebaseDatabase = FirebaseDatabase;
window.firebaseDatabase = new FirebaseDatabase();
window.firebaseDatabase.initializeDefaultData();
