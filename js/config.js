/**
 * Configuration and Constants
 * طلال للاتصالات - Phone Store Management System
 */

// VAT Configuration for Saudi Arabia
const CONFIG = {
    VAT_RATE: 0.15, // 15% VAT rate
    COMPANY_INFO: {
        name: "طلال للاتصالات",
        vatNumber: "7034630488",
        address: "الرياض، المملكة العربية السعودية",
        phone: "0599254441"
    },
    STORAGE_KEYS: {
        PHONES: 'phone_store_phones',
        ACCESSORIES: 'phone_store_accessories',
        SALES: 'phone_store_sales',
        PHONE_TYPES: 'phone_store_phone_types',
        ACCESSORY_CATEGORIES: 'phone_store_accessory_categories',
        CURRENT_USER: 'phone_store_current_user',
        SETTINGS: 'phone_store_settings'
    },
    PHONE_CONDITIONS: {
        excellent: "ممتازة",
        very_good: "جيدة جداً", 
        good: "جيدة",
        fair: "متوسطة"
    },
    PAYMENT_METHODS: [
        "نقدي",
        "بطاقة ائتمان",
        "تحويل بنكي",
        "شيك",
        "تابي",
        "تمارا"
    ],
    PHONE_COLORS: [
        "أسود", "أبيض", "أزرق", "أحمر", "أخضر", 
        "أصفر", "رمادي", "ذهبي", "فضي", "وردي", 
        "بنفسجي", "برتقالي", "أخرى"
    ],
    PHONE_MEMORY: [
        "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "أخرى"
    ]
};

// Default phone types data
const DEFAULT_PHONE_TYPES = {
    "Apple": [
        "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17",
        "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
        "iPhone 16e",
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
        "15 Ultra", "15 Pro", "15",
        "14 Ultra", "14 Pro", "14",
        "13 Ultra", "13 Pro", "13", "13T Pro", "13T",
        "12S Ultra", "12 Pro", "12",
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
        "Pixel 6 Pro", "Pixel 6", "Pixel 5",
        "Pixel 4 XL", "Pixel 4", "Pixel 3 XL", "Pixel 3"
    ],
    "Oppo": [
        "Find X8 Ultra", "Find X8 Pro", "Find X8",
        "Find X7 Ultra", "Find X7", "Find X6 Pro", "Find X6",
        "Find X5 Pro", "Find X5", "Find X3 Pro", "Find X3",
        "Reno 14 Pro", "Reno 14", "Reno 13 Pro", "Reno 13",
        "Reno 12 Pro", "Reno 12", "Reno 11 Pro", "Reno 11", "Reno 10 Pro+", "Reno 10 Pro", "Reno 10",
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
        "Magic V3", "Magic V2", "Magic Vs",
        "400 Pro", "400", "200 Pro", "200", "90 Pro", "90", "70 Pro", "70",
        "X9c", "X9b", "X9a", "X8c", "X8b", "X8a",
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
        "Phantom X2 Pro", "Phantom X2",
        "Camon 30 Pro", "Camon 30", "Camon 20 Pro", "Camon 20",
        "Spark 30 Pro", "Spark 30", "Spark 20 Pro", "Spark 20", "Spark 10 Pro", "Spark 10",
        "Pova 6 Pro", "Pova 6", "Pova 5 Pro", "Pova 5"
    ],
    "Nothing": [
        "Phone 3", "Phone 3a Pro", "Phone 3a", "Phone 2a Plus", "Phone 2a", "Phone 2", "Phone 1"
    ],
    "Motorola": [
        "Razr 60 Ultra", "Razr 60", "Razr 50 Ultra", "Razr 50",
        "Edge 60 Pro", "Edge 60", "Edge 50 Ultra", "Edge 50 Pro", "Edge 50",
        "Moto G85", "Moto G75", "Moto G55", "Moto G35", "Moto E15"
    ],
    "Nokia": [
        "G60", "G42", "G22", "G21", "X30", "X20", "C32", "C22", "C12"
    ],
    "Sony": [
        "Xperia 1 VII", "Xperia 1 VI", "Xperia 1 V", "Xperia 1 IV",
        "Xperia 5 V", "Xperia 5 IV", "Xperia 10 VI", "Xperia 10 V"
    ],
    "Asus": [
        "ROG Phone 9 Pro", "ROG Phone 9", "ROG Phone 8 Pro", "ROG Phone 8",
        "Zenfone 12 Ultra", "Zenfone 11 Ultra", "Zenfone 10", "Zenfone 9"
    ],
    "ZTE": [
        "Nubia Z70 Ultra", "Nubia Z60 Ultra", "Nubia RedMagic 10 Pro", "Nubia RedMagic 9 Pro",
        "Blade V50", "Blade A75", "Blade A55"
    ],
    "TCL": [
        "50 Pro NXTPAPER", "50 NXTPAPER", "40 NXTPAPER", "40 SE", "30 SE", "20 Pro"
    ]
};

// Default accessory categories
const DEFAULT_ACCESSORY_CATEGORIES = [
    { name: 'accessory', arabic_name: 'إكسسوار', description: 'إكسسوارات عامة' },
    { name: 'charger', arabic_name: 'شاحن', description: 'شواحن الهواتف' },
    { name: 'case', arabic_name: 'غلاف', description: 'أغلفة الهواتف' },
    { name: 'screen_protector', arabic_name: 'حماية الشاشة', description: 'حماية شاشة الهاتف' },
    { name: 'cable', arabic_name: 'كابل', description: 'كابلات البيانات والشحن' },
    { name: 'headphone', arabic_name: 'سماعات', description: 'سماعات الهواتف' },
    { name: 'other', arabic_name: 'أخرى', description: 'فئات أخرى' }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, DEFAULT_PHONE_TYPES, DEFAULT_ACCESSORY_CATEGORIES };
}
