// Firebase Storage Manager - إدارة التخزين المختلط
// يعمل مع Firebase Firestore أو LocalStorage كبديل

// Configuration constants
const CONFIG = {
  STORAGE_KEYS: {
    PHONES: 'phones',
    ACCESSORIES: 'accessories',
    SALES: 'sales',
    PHONE_TYPES: 'phone_types',
    ACCESSORY_CATEGORIES: 'accessory_categories',
    CURRENT_USER: 'current_user'
  }
};

// Default data
const DEFAULT_PHONE_TYPES = {
  "Apple": [
    "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17",
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 16e",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
    "iPhone SE 3", "iPhone SE 2", "iPhone 8 Plus", "iPhone 8"
  ],
  "Samsung": [
    "Galaxy S26 Ultra", "Galaxy S26+", "Galaxy S26",
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
    "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
    "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20",
    "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10",
    "Galaxy Z Fold 7", "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4",
    "Galaxy Z Flip 7", "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4",
    "Galaxy A56", "Galaxy A55", "Galaxy A54", "Galaxy A36", "Galaxy A35", "Galaxy A34",
    "Galaxy A26", "Galaxy A25", "Galaxy A24", "Galaxy A16", "Galaxy A15", "Galaxy A14",
    "Galaxy M55", "Galaxy M35", "Galaxy M15"
  ],
  "Huawei": [
    "Pura 70 Ultra", "Pura 70 Pro", "Pura 70",
    "P60 Pro", "P60", "P50 Pro", "P50", "P40 Pro+", "P40 Pro", "P40",
    "Mate 70 Pro", "Mate 70", "Mate 60 Pro", "Mate 60", "Mate 50 Pro", "Mate 40 Pro",
    "Nova 13 Pro", "Nova 13", "Nova 12 Pro", "Nova 12", "Nova 11", "Nova 10"
  ],
  "Xiaomi": [
    "15 Ultra", "15 Pro", "15", "14 Ultra", "14 Pro", "14",
    "13 Ultra", "13 Pro", "13", "13T Pro", "13T", "12S Ultra", "12 Pro", "12",
    "Redmi Note 15 Pro+", "Redmi Note 15 Pro", "Redmi Note 15",
    "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14",
    "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
    "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
    "Poco F7 Ultra", "Poco F7 Pro", "Poco F6 Pro", "Poco F6",
    "Poco X7 Pro", "Poco X7", "Poco X6 Pro", "Poco X6",
    "Poco M7 Pro", "Poco M6 Pro"
  ],
  "OnePlus": [
    "13", "13R", "12", "12R", "11", "10 Pro", "10T", "10", "9 Pro", "9", "8 Pro", "8",
    "Nord 5", "Nord 4", "Nord 3", "Nord 2T", "Nord 2", "Nord CE 4", "Nord CE 3"
  ],
  "Google": [
    "Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10",
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 9a",
    "Pixel 8 Pro", "Pixel 8", "Pixel 8a", "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
    "Pixel 6 Pro", "Pixel 6", "Pixel 5", "Pixel 4 XL", "Pixel 4", "Pixel 3 XL", "Pixel 3"
  ],
  "Oppo": [
    "Find X8 Ultra", "Find X8 Pro", "Find X8", "Find X7 Ultra", "Find X7",
    "Find X6 Pro", "Find X6", "Find X5 Pro", "Find X5", "Find X3 Pro", "Find X3",
    "Reno 14 Pro", "Reno 14", "Reno 13 Pro", "Reno 13", "Reno 12 Pro", "Reno 12",
    "Reno 11 Pro", "Reno 11", "Reno 10 Pro+", "Reno 10 Pro", "Reno 10",
    "A98", "A78", "A58", "A38", "A18"
  ],
  "Vivo": [
    "X200 Pro", "X200", "X100 Pro", "X100", "X90 Pro+", "X90 Pro", "X90",
    "V50", "V40 Pro", "V40", "V30 Pro", "V30", "V29 Pro", "V29", "V27 Pro", "V27",
    "Y39", "Y29", "Y28", "Y27", "Y17s"
  ],
  "Realme": [
    "GT 7 Pro", "GT 7", "GT 6", "GT 5 Pro", "GT 5", "GT Neo 6", "GT Neo 5",
    "14 Pro+", "14 Pro", "14", "13 Pro+", "13 Pro", "13", "12 Pro+", "12 Pro", "12",
    "C75", "C67", "C65", "C55", "Narzo 70 Pro", "Narzo 70", "Narzo 60"
  ],
  "Honor": [
    "Magic 7 Pro", "Magic 7", "Magic 6 Pro", "Magic 6", "Magic 5 Pro", "Magic 5",
    "Magic V3", "Magic V2", "Magic Vs", "400 Pro", "400", "200 Pro", "200",
    "90 Pro", "90", "70 Pro", "70", "X9c", "X9b", "X9a", "X8c", "X8b", "X8a",
    "Play 9T", "Play 8T", "Play 7T"
  ],
  "Infinix": [
    "Zero 40 Pro", "Zero 40", "Zero 30 Pro", "Zero 30",
    "Note 40 Pro", "Note 40", "Note 30 Pro", "Note 30",
    "Hot 50 Pro", "Hot 50", "Hot 40 Pro", "Hot 40", "Hot 30", "Hot 20",
    "Smart 9", "Smart 8", "Smart 7"
  ],
  "Tecno": [
    "Phantom V Fold 2", "Phantom V Fold", "Phantom V Flip 2", "Phantom V Flip",
    "Phantom X2 Pro", "Phantom X2", "Camon 30 Pro", "Camon 30", "Camon 20 Pro", "Camon 20",
    "Spark 30 Pro", "Spark 30", "Spark 20 Pro", "Spark 20", "Spark 10 Pro", "Spark 10",
    "Pova 6 Pro", "Pova 6", "Pova 5 Pro", "Pova 5"
  ],
  "Nothing": ["Phone 3", "Phone 3a Pro", "Phone 3a", "Phone 2a Plus", "Phone 2a", "Phone 2", "Phone 1"],
  "Motorola": ["Razr 60 Ultra", "Razr 60", "Razr 50 Ultra", "Razr 50", "Edge 60 Pro", "Edge 60", "Edge 50 Ultra", "Edge 50 Pro", "Edge 50", "Moto G85", "Moto G75", "Moto G55", "Moto G35", "Moto E15"],
  "Nokia": ["G60", "G42", "G22", "G21", "X30", "X20", "C32", "C22", "C12"],
  "Sony": ["Xperia 1 VII", "Xperia 1 VI", "Xperia 1 V", "Xperia 1 IV", "Xperia 5 V", "Xperia 5 IV", "Xperia 10 VI", "Xperia 10 V"],
  "Asus": ["ROG Phone 9 Pro", "ROG Phone 9", "ROG Phone 8 Pro", "ROG Phone 8", "Zenfone 12 Ultra", "Zenfone 11 Ultra", "Zenfone 10", "Zenfone 9"],
  "ZTE": ["Nubia Z70 Ultra", "Nubia Z60 Ultra", "Nubia RedMagic 10 Pro", "Nubia RedMagic 9 Pro", "Blade V50", "Blade A75", "Blade A55"],
  "TCL": ["50 Pro NXTPAPER", "50 NXTPAPER", "40 NXTPAPER", "40 SE", "30 SE", "20 Pro"]
};

const DEFAULT_ACCESSORY_CATEGORIES = [
  { name: 'accessory', arabic_name: 'إكسسوار', description: 'إكسسوارات عامة' },
  { name: 'charger', arabic_name: 'شاحن', description: 'شواحن الهواتف' },
  { name: 'case', arabic_name: 'غلاف', description: 'أغلفة الهواتف' },
  { name: 'screen_protector', arabic_name: 'حماية الشاشة', description: 'حماية شاشة الهاتف' },
  { name: 'cable', arabic_name: 'كابل', description: 'كابلات البيانات والشحن' },
  { name: 'headphone', arabic_name: 'سماعات', description: 'سماعات الهواتف' },
  { name: 'other', arabic_name: 'أخرى', description: 'فئات أخرى' }
];

class FirebaseStorageManager {
  constructor() {
    this.firebaseDB = window.firebaseDatabase;
    this.isFirebaseAvailable = this.refreshFirebaseAvailability();
    this.phoneTypeSeedPromise = null;
    
    if (this.refreshFirebaseAvailability()) {
      console.log('🔥 Firebase Storage Manager initialized with Firebase');
      this.seedDefaultPhoneTypesIfEmpty();
    } else {
      console.log('💾 Firebase not available, using LocalStorage fallback');
      this.initializeLocalStorage();
    }
  }

  refreshFirebaseAvailability() {
    if (!this.firebaseDB && window.firebaseDatabase) {
      this.firebaseDB = window.firebaseDatabase;
    }

    this.isFirebaseAvailable = !!(
      this.firebaseDB &&
      (this.firebaseDB.db || window.firebaseDB)
    );

    return this.isFirebaseAvailable;
  }

  /**
   * Initialize localStorage fallback
   */
  initializeLocalStorage() {
    // Initialize default data if not exists
    if (!this.getPhoneTypes()) {
      this.setPhoneTypes(DEFAULT_PHONE_TYPES);
    }

    if (!this.getAccessoryCategories()) {
      this.setAccessoryCategories(DEFAULT_ACCESSORY_CATEGORIES);
    }

    if (!this.getPhones()) {
      this.setPhones([]);
    }

    if (!this.getAccessories()) {
      this.setAccessories([]);
    }

    if (!this.getSales()) {
      this.setSales([]);
    }
  }

  /**
   * Generic storage methods
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Phone management
   */
  async getPhones() {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.getPhones();
      } catch (error) {
        console.error('Error getting phones from Firebase:', error);
        return this.getItem(CONFIG.STORAGE_KEYS.PHONES, []);
      }
    }
    return this.getItem(CONFIG.STORAGE_KEYS.PHONES, []);
  }

  async setPhones(phones) {
    if (this.refreshFirebaseAvailability()) {
      console.log('Firebase mode: phones are managed individually');
      return true;
    }
    return this.setItem(CONFIG.STORAGE_KEYS.PHONES, phones);
  }

  async addPhone(phone) {
    if (this.refreshFirebaseAvailability()) {
      try {
        phone.date_added = new Date();
        const phoneId = await this.firebaseDB.addPhone(phone);
        console.log('✅ Storage Manager: phone saved to Firestore ID:', phoneId);
        return phoneId;
      } catch (error) {
        console.error('Error adding phone to Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const phones = await this.getPhones();
    phone.id = this.generateId();
    phone.date_added = new Date().toISOString();
    phones.push(phone);
    return this.setPhones(phones);
  }

  async updatePhone(phoneId, updatedPhone) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.updatePhone(phoneId, updatedPhone);
        return true;
      } catch (error) {
        console.error('Error updating phone in Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const phones = await this.getPhones();
    const index = phones.findIndex(p => p.id === phoneId);
    if (index !== -1) {
      phones[index] = { ...phones[index], ...updatedPhone };
      return this.setPhones(phones);
    }
    return false;
  }

  async deletePhone(phoneId) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.deletePhone(phoneId);
        return true;
      } catch (error) {
        console.error('Error deleting phone from Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const phones = await this.getPhones();
    const filteredPhones = phones.filter(p => p.id !== phoneId);
    return this.setPhones(filteredPhones);
  }

  async getPhoneByNumber(phoneNumber) {
    const phones = await this.getPhones();
    return phones.find(p => p.phone_number === phoneNumber);
  }

  async getPhoneBySerial(serialNumber) {
    const phones = await this.getPhones();
    return phones.find(p => p.serial_number === serialNumber);
  }

  /**
   * Accessory management
   */
  async getAccessories() {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.getAccessories();
      } catch (error) {
        console.error('Error getting accessories from Firebase:', error);
        return this.getItem(CONFIG.STORAGE_KEYS.ACCESSORIES, []);
      }
    }
    return this.getItem(CONFIG.STORAGE_KEYS.ACCESSORIES, []);
  }

  async setAccessories(accessories) {
    if (this.refreshFirebaseAvailability()) {
      console.log('Firebase mode: accessories are managed individually');
      return true;
    }
    return this.setItem(CONFIG.STORAGE_KEYS.ACCESSORIES, accessories);
  }

  async addAccessory(accessory) {
    console.log('📦 Storage Manager: محاولة إضافة أكسسوار:', accessory);
    
    if (this.refreshFirebaseAvailability()) {
      try {
        console.log('🔥 Storage Manager: Firebase متاح، إرسال إلى Firebase...');
        accessory.date_added = new Date();
        const accessoryId = await this.firebaseDB.addAccessory(accessory);
        console.log('✅ Storage Manager: تم إضافة الأكسسوار في Firebase، ID:', accessoryId);
        return accessoryId;
      } catch (error) {
        console.error('❌ Storage Manager: خطأ في إضافة الأكسسوار إلى Firebase:', error);
        return false;
      }
    }
    
    console.log('💾 Storage Manager: Firebase غير متاح، حفظ في localStorage...');
    // LocalStorage fallback
    const accessories = this.getAccessories();
    accessory.id = this.generateId();
    accessory.date_added = new Date().toISOString();
    accessories.push(accessory);
    const result = this.setAccessories(accessories);
    console.log('✅ Storage Manager: تم حفظ الأكسسوار في localStorage');
    return result;
  }

  async updateAccessory(accessoryId, updatedAccessory) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.updateAccessory(accessoryId, updatedAccessory);
        return true;
      } catch (error) {
        console.error('Error updating accessory in Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const accessories = this.getAccessories();
    const index = accessories.findIndex(a => a.id === accessoryId);
    if (index !== -1) {
      accessories[index] = { ...accessories[index], ...updatedAccessory };
      return this.setAccessories(accessories);
    }
    return false;
  }

  async deleteAccessory(accessoryId) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.deleteAccessory(accessoryId);
        return true;
      } catch (error) {
        console.error('Error deleting accessory from Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const accessories = this.getAccessories();
    const filteredAccessories = accessories.filter(a => a.id !== accessoryId);
    return this.setAccessories(filteredAccessories);
  }

  /**
   * Sales management
   */
  async getSales() {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.getSales();
      } catch (error) {
        console.error('Error getting sales from Firebase:', error);
        return this.getItem(CONFIG.STORAGE_KEYS.SALES, []);
      }
    }
    return this.getItem(CONFIG.STORAGE_KEYS.SALES, []);
  }

  async setSales(sales) {
    if (this.refreshFirebaseAvailability()) {
      console.log('Firebase mode: sales are managed individually');
      return true;
    }
    return this.setItem(CONFIG.STORAGE_KEYS.SALES, sales);
  }

  async addSale(sale) {
    if (this.refreshFirebaseAvailability()) {
      try {
        sale.date_created = new Date();
        const saleId = await this.firebaseDB.addSale(sale);
        return saleId;
      } catch (error) {
        console.error('Error adding sale to Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const sales = this.getSales();
    sale.id = this.generateId();
    sale.date_created = new Date().toISOString();
    sales.push(sale);
    return this.setSales(sales);
  }

  async updateSale(saleId, updatedSale) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.updateSale(saleId, updatedSale);
        return true;
      } catch (error) {
        console.error('Error updating sale in Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const sales = this.getSales();
    const index = sales.findIndex(s => s.id === saleId);
    if (index !== -1) {
      sales[index] = { ...sales[index], ...updatedSale };
      return this.setSales(sales);
    }
    return false;
  }

  async deleteSale(saleId) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.deleteSale(saleId);
        return true;
      } catch (error) {
        console.error('Error deleting sale from Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const sales = this.getSales();
    const filteredSales = sales.filter(s => s.id !== saleId);
    return this.setSales(filteredSales);
  }

  async getSaleById(saleId) {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.getSale(saleId);
      } catch (error) {
        console.error('Error getting sale from Firebase:', error);
        return null;
      }
    }
    
    const sales = this.getSales();
    return sales.find(s => s.id === saleId);
  }

  /**
   * Phone Types management
   */
  async seedDefaultPhoneTypesIfEmpty() {
    if (!this.refreshFirebaseAvailability() || this.phoneTypeSeedPromise) {
      return this.phoneTypeSeedPromise || false;
    }

    this.phoneTypeSeedPromise = (async () => {
      try {
        const existingPhoneTypes = await this.firebaseDB.getPhoneTypes();
        if (existingPhoneTypes.length > 0) {
          return false;
        }

        const defaultRows = Object.entries(DEFAULT_PHONE_TYPES).flatMap(([brand, models]) =>
          models.map((model) => ({ brand, manufacturer: brand, model }))
        );

        for (const phoneType of defaultRows) {
          await this.firebaseDB.addPhoneType(phoneType);
        }

        console.log(`✅ تمت إضافة ${defaultRows.length} نوع جوال افتراضي إلى Firebase`);
        return true;
      } catch (error) {
        console.error('❌ تعذر إضافة أنواع الجوالات الافتراضية إلى Firebase:', error);
        return false;
      } finally {
        this.phoneTypeSeedPromise = null;
      }
    })();

    return this.phoneTypeSeedPromise;
  }

  async getPhoneTypes() {
    if (this.refreshFirebaseAvailability()) {
      try {
        console.log('🔄 Storage Manager: تحميل أنواع الهواتف من Firebase...');
        let phoneTypes = await this.firebaseDB.getPhoneTypes();
        if (phoneTypes.length === 0) {
          await this.seedDefaultPhoneTypesIfEmpty();
          phoneTypes = await this.firebaseDB.getPhoneTypes();
        }
        console.log('📱 Storage Manager: أنواع الهواتف المحملة:', phoneTypes);
        
        // Convert array to object format for compatibility with existing code
        const phoneTypesObj = {};
        phoneTypes.forEach(type => {
          const manufacturer = type.manufacturer || type.brand; // Support both field names
          if (!manufacturer || !type.model) return;
          if (!phoneTypesObj[manufacturer]) {
            phoneTypesObj[manufacturer] = [];
          }
          if (!phoneTypesObj[manufacturer].includes(type.model)) {
            phoneTypesObj[manufacturer].push(type.model);
          }
        });
        Object.keys(phoneTypesObj).forEach((brand) => phoneTypesObj[brand].sort((a, b) => a.localeCompare(b, 'ar')));
        console.log('🏭 Storage Manager: البيانات المحولة:', phoneTypesObj);
        return phoneTypesObj;
      } catch (error) {
        console.error('❌ Storage Manager: خطأ في تحميل أنواع الهواتف من Firebase:', error);
        return this.getItem(CONFIG.STORAGE_KEYS.PHONE_TYPES);
      }
    }
    console.log('💾 Storage Manager: Firebase غير متاح، تحميل من localStorage...');
    return this.getItem(CONFIG.STORAGE_KEYS.PHONE_TYPES);
  }

  async setPhoneTypes(phoneTypes) {
    if (this.refreshFirebaseAvailability()) {
      console.log('Firebase mode: phone types are managed individually');
      return true;
    }
    return this.setItem(CONFIG.STORAGE_KEYS.PHONE_TYPES, phoneTypes);
  }

  async addPhoneType(brand, model) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.addPhoneType({ brand, model });
        return true;
      } catch (error) {
        console.error('Error adding phone type to Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const phoneTypes = this.getPhoneTypes() || {};
    if (!phoneTypes[brand]) {
      phoneTypes[brand] = [];
    }
    if (!phoneTypes[brand].includes(model)) {
      phoneTypes[brand].push(model);
      return this.setPhoneTypes(phoneTypes);
    }
    return false;
  }

  async deletePhoneType(brand, model) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.deletePhoneType(brand, model);
        return true;
      } catch (error) {
        console.error('Error deleting phone type from Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const phoneTypes = this.getPhoneTypes() || {};
    if (phoneTypes[brand]) {
      phoneTypes[brand] = phoneTypes[brand].filter(m => m !== model);
      if (phoneTypes[brand].length === 0) {
        delete phoneTypes[brand];
      }
      return this.setPhoneTypes(phoneTypes);
    }
    return false;
  }

  /**
   * Accessory Categories management
   */
  async getAccessoryCategories() {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.getAccessoryCategories();
      } catch (error) {
        console.error('Error getting accessory categories from Firebase:', error);
        return this.getItem(CONFIG.STORAGE_KEYS.ACCESSORY_CATEGORIES);
      }
    }
    return this.getItem(CONFIG.STORAGE_KEYS.ACCESSORY_CATEGORIES);
  }

  async setAccessoryCategories(categories) {
    if (this.refreshFirebaseAvailability()) {
      console.log('Firebase mode: accessory categories are managed individually');
      return true;
    }
    return this.setItem(CONFIG.STORAGE_KEYS.ACCESSORY_CATEGORIES, categories);
  }

  async addAccessoryCategory(category) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.addAccessoryCategory(category);
        return true;
      } catch (error) {
        console.error('Error adding accessory category to Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const categories = this.getAccessoryCategories() || [];
    const exists = categories.find(c => c.name === category.name || c.arabic_name === category.arabic_name);
    if (!exists) {
      categories.push(category);
      return this.setAccessoryCategories(categories);
    }
    return false;
  }

  async deleteAccessoryCategory(categoryName) {
    if (this.refreshFirebaseAvailability()) {
      try {
        await this.firebaseDB.deleteAccessoryCategory(categoryName);
        return true;
      } catch (error) {
        console.error('Error deleting accessory category from Firebase:', error);
        return false;
      }
    }
    
    // LocalStorage fallback
    const categories = this.getAccessoryCategories() || [];
    const filteredCategories = categories.filter(c => c.arabic_name !== categoryName);
    return this.setAccessoryCategories(filteredCategories);
  }

  /**
   * User management
   */
  getCurrentUser() {
    return this.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user) {
    return this.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, user);
  }

  logout() {
    return this.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  /**
   * Search functionality
   */
  async searchPhones(searchTerm) {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.searchPhones(searchTerm);
      } catch (error) {
        console.error('Error searching phones in Firebase:', error);
        return [];
      }
    }
    
    // LocalStorage fallback
    const phones = await this.getPhones();
    return phones.filter(phone => {
      const searchFields = [
        phone.phone_number,
        phone.serial_number,
        phone.brand,
        phone.model,
        phone.phone_color,
        phone.phone_memory,
        phone.description,
        phone.customer_name,
        phone.customer_id
      ];
      
      return searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  async searchAccessories(searchTerm) {
    if (this.refreshFirebaseAvailability()) {
      try {
        return await this.firebaseDB.searchAccessories(searchTerm);
      } catch (error) {
        console.error('Error searching accessories in Firebase:', error);
        return [];
      }
    }
    
    // LocalStorage fallback
    const accessories = await this.getAccessories();
    return accessories.filter(accessory => {
      const searchFields = [
        accessory.name,
        accessory.category,
        accessory.description,
        accessory.supplier,
        accessory.notes
      ];
      
      return searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  /**
   * Real-time listeners (Firebase only)
   */
  onPhonesChange(callback) {
    if (this.refreshFirebaseAvailability()) {
      return this.firebaseDB.onPhonesChange(callback);
    }
    console.log('Real-time listeners only available with Firebase');
    return null;
  }

  onAccessoriesChange(callback) {
    if (this.refreshFirebaseAvailability()) {
      return this.firebaseDB.onAccessoriesChange(callback);
    }
    console.log('Real-time listeners only available with Firebase');
    return null;
  }

  onSalesChange(callback) {
    if (this.refreshFirebaseAvailability()) {
      return this.firebaseDB.onSalesChange(callback);
    }
    console.log('Real-time listeners only available with Firebase');
    return null;
  }

  /**
   * Utility methods
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Export/Import functionality
   */
  async exportData() {
    const data = {
      phones: await this.getPhones(),
      accessories: await this.getAccessories(),
      sales: await this.getSales(),
      phoneTypes: await this.getPhoneTypes(),
      accessoryCategories: await this.getAccessoryCategories(),
      exportDate: new Date().toISOString(),
      version: '2.0',
      firebaseEnabled: this.isFirebaseAvailable
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.phones) {
        for (const phone of data.phones) {
          await this.addPhone(phone);
        }
      }
      if (data.accessories) {
        for (const accessory of data.accessories) {
          await this.addAccessory(accessory);
        }
      }
      if (data.sales) {
        for (const sale of data.sales) {
          await this.addSale(sale);
        }
      }
      if (data.phoneTypes) {
        for (const [brand, models] of Object.entries(data.phoneTypes)) {
          for (const model of models) {
            await this.addPhoneType(brand, model);
          }
        }
      }
      if (data.accessoryCategories) {
        for (const category of data.accessoryCategories) {
          await this.addAccessoryCategory(category);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    const phones = await this.getPhones();
    const accessories = await this.getAccessories();
    const sales = await this.getSales();
    const phoneTypes = await this.getPhoneTypes();
    const accessoryCategories = await this.getAccessoryCategories();

    return {
      phones: phones.length,
      accessories: accessories.length,
      sales: sales.length,
      phoneTypes: Object.keys(phoneTypes || {}).length,
      accessoryCategories: (accessoryCategories || []).length,
      firebaseEnabled: this.isFirebaseAvailable
    };
  }
}

// إنشاء instance واحد للاستخدام في جميع أنحاء التطبيق
const storage = new FirebaseStorageManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.storage = storage;
  window.FirebaseStorageManager = FirebaseStorageManager;
}

// Make available globally for non-module usage
window.FirebaseStorageManager = FirebaseStorageManager;
window.storage = storage;

// Also export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FirebaseStorageManager, storage };
}
