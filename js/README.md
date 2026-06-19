# JavaScript Architecture - العمر للاتصالات

## 📁 File Structure

```
js/
├── config.js              # Configuration and constants
├── utils.js               # Utility functions
├── storage.js             # Local storage management
├── auth.js                # Authentication management
├── barcode.js             # Barcode generation and processing
├── phone-manager.js       # Phone inventory management
├── accessory-manager.js   # Accessory inventory management
├── sales-manager.js       # Sales and transactions management
├── main.js                # Main application entry point
└── README.md              # This file
```

## 🚀 How to Use

### 1. Include Scripts in HTML

Add these script tags to your HTML templates **in this order**:

```html
<!-- Core Dependencies (already included) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Phone Store JavaScript Modules -->
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/storage.js"></script>
<script src="js/barcode.js"></script>
<script src="js/auth.js"></script>
<script src="js/phone-manager.js"></script>
<script src="js/accessory-manager.js"></script>
<script src="js/sales-manager.js"></script>
<script src="js/main.js"></script>
```

### 2. Remove Existing Inline JavaScript

Replace the existing inline JavaScript in your HTML templates with the new modular system.

**Example - Before (add_accessory.html):**
```html
<script>
  function demoSave() {
    // inline code...
  }
</script>
```

**Example - After (add_accessory.html):**
```html
<!-- Scripts already included above -->
<script>
  // Page-specific code only
  function demoSave() {
    const formData = new FormData(document.querySelector('form'));
    const accessoryData = Object.fromEntries(formData.entries());
    
    accessoryManager.addAccessory(accessoryData).then(result => {
      if (result.success) {
        UIUtils.showAlert('success', result.message);
        setTimeout(() => window.location.href = 'list_accessories_simple.html', 1500);
      } else {
        UIUtils.showAlert('error', result.error);
      }
    });
  }
</script>
```

## 🏗️ Architecture Overview

### Core Modules

#### 1. **config.js** - Configuration
- VAT rates and calculations
- Company information
- Storage keys
- Default data (phone types, categories)
- Constants (colors, memory options, etc.)

#### 2. **utils.js** - Utility Functions
- `VATUtils`: VAT calculations
- `FormatUtils`: Money and date formatting
- `IDUtils`: ID generation (invoice numbers, phone numbers)
- `ValidationUtils`: Form validation and barcode processing
- `SearchUtils`: Search and filtering
- `DateUtils`: Date comparisons
- `UIUtils`: UI helpers (alerts, loading states)

#### 3. **storage.js** - Data Management
- Local storage abstraction
- CRUD operations for all entities
- Data export/import
- Storage statistics

#### 4. **auth.js** - Authentication
- User login/logout
- Session management
- Role-based access control
- User management (admin only)

#### 5. **barcode.js** - Barcode System
- SVG barcode generation
- Battery age encoding for used phones
- Barcode validation and processing
- Print functionality

### Business Logic Modules

#### 6. **phone-manager.js** - Phone Inventory
- Add/edit/delete phones
- Phone type management
- Barcode integration
- Inventory statistics
- Search and filtering

#### 7. **accessory-manager.js** - Accessory Inventory
- Add/edit/delete accessories
- Category management
- Stock management
- Low stock alerts
- Bulk operations

#### 8. **sales-manager.js** - Sales Management
- Create sales with multiple items
- Update inventory automatically
- Receipt generation and printing
- Sales statistics and reporting
- Payment processing

#### 9. **main.js** - Application Controller
- Application initialization
- Page-specific setup
- Global event handling
- Auto-save functionality
- Error handling

## 💡 Usage Examples

### Adding a Phone
```javascript
const phoneData = {
  brand: 'Apple',
  model: 'iPhone 15',
  condition: 'new',
  purchase_price: 3000,
  selling_price: 3500,
  serial_number: 'ABC123456',
  warranty: 12
};

const result = await phoneManager.addPhone(phoneData);
if (result.success) {
  console.log('Phone added:', result.phone);
} else {
  console.error('Error:', result.error);
}
```

### Creating a Sale
```javascript
const saleData = {
  customer_name: 'أحمد علي',
  customer_phone: '0555555555',
  payment_method: 'نقدي',
  items: [
    {
      id: 'phone_1',
      type: 'phone',
      name: 'iPhone 15',
      unitPrice: 3500,
      quantity: 1
    },
    {
      id: 'acc_1',
      type: 'accessory',
      name: 'غطاء شفاف',
      unitPrice: 50,
      quantity: 2
    }
  ]
};

const result = await salesManager.createSale(saleData);
if (result.success) {
  console.log('Sale created:', result.sale);
  salesManager.printReceipt(result.sale);
}
```

### Searching Products
```javascript
// Search phones
const phones = phoneManager.searchPhones('iPhone', 'new');

// Search accessories
const accessories = accessoryManager.searchAccessories('غطاء');

// Universal search
const searchResults = {
  phones: SearchUtils.filterPhones(allPhones, 'iPhone'),
  accessories: SearchUtils.filterAccessories(allAccessories, 'شاحن')
};
```

### Working with Barcodes
```javascript
// Generate barcode
const barcode = barcodeGenerator.generateSVGBarcode('123456');

// Process scanned barcode
const result = barcodeGenerator.processScannedBarcode('123456');
if (result.valid) {
  console.log('Phone number:', result.phoneNumber);
}

// Print barcode
BarcodeUtils.printBarcode(phoneObject);
```

## 🔧 Customization

### Adding New Features

1. **Add to appropriate manager class**
2. **Update main.js for page integration**
3. **Add UI handlers in HTML templates**

### Configuration Changes

Edit `config.js` to modify:
- VAT rates
- Company information
- Default categories
- Storage keys

### Adding New Data Types

1. **Add storage methods in storage.js**
2. **Create new manager class**
3. **Add to main.js initialization**

## 🚨 Migration Guide

### From Inline JavaScript

1. **Identify functionality** in existing templates
2. **Map to appropriate manager** (phone/accessory/sales)
3. **Replace inline code** with manager calls
4. **Test thoroughly**

### Example Migration

**Before:**
```html
<script>
  function addAccessory() {
    const data = {
      name: document.getElementById('name').value,
      // ... more fields
    };
    console.log('Demo data:', data);
    alert('واجهة فقط');
  }
</script>
```

**After:**
```html
<script>
  async function addAccessory() {
    const formData = new FormData(document.querySelector('form'));
    const data = Object.fromEntries(formData.entries());
    
    const result = await accessoryManager.addAccessory(data);
    if (result.success) {
      UIUtils.showAlert('success', result.message);
      window.location.href = 'list_accessories_simple.html';
    } else {
      UIUtils.showAlert('error', result.error);
    }
  }
</script>
```

## 📊 Data Flow

```
User Input → Form Handler → Manager Class → Storage → UI Update
                ↓
         Validation & Business Logic
                ↓
         Success/Error Response
```

## 🔒 Security Considerations

- All data stored in localStorage (client-side only)
- Basic authentication (upgrade for production)
- Input validation on all forms
- XSS protection through proper escaping

## 🧪 Testing

Each manager class includes validation and error handling. Test by:

1. **Valid data inputs**
2. **Invalid data inputs**
3. **Edge cases** (empty storage, large datasets)
4. **Cross-browser compatibility**

## 📱 Mobile Support

The system is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablet devices

## 🚀 Production Deployment

For production use:

1. **Minify JavaScript files**
2. **Implement proper authentication**
3. **Add server-side validation**
4. **Use HTTPS**
5. **Implement proper error logging**

## 🤝 Contributing

To extend the system:

1. **Follow existing patterns**
2. **Add proper error handling**
3. **Include Arabic translations**
4. **Test thoroughly**
5. **Document changes**

---

**العمر للاتصالات - Phone Store Management System**
*Modular JavaScript Architecture v1.0*
