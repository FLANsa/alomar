# Aldhahbi - Environment Variables
# متغيرات البيئة لنظام إدارة متجر الجوالات

# Firebase Configuration
FIREBASE_API_KEY=AIzaSyCOxP_fOupA-OAyO4oxYe54ohZ8_YzS7zc
FIREBASE_AUTH_DOMAIN=aldhahbi-7a93b.firebaseapp.com
FIREBASE_PROJECT_ID=aldhahbi-7a93b
FIREBASE_STORAGE_BUCKET=aldhahbi-7a93b.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=392213757842
FIREBASE_APP_ID=1:392213757842:web:510288ddc8ccd5d7e48b4b
FIREBASE_MEASUREMENT_ID=G-77EPVYFWPB

# Application Settings
NODE_ENV=production
APP_NAME=Aldhahbi
APP_VERSION=2.0.0
APP_DESCRIPTION=نظام إدارة متجر الجوالات

# Company Information
COMPANY_NAME=الركبي للاتصالات
COMPANY_NAME_EN=Al-Rakbi for Communications
COMPANY_ADDRESS=الرياض، المملكة العربية السعودية
COMPANY_PHONE=0599254441
COMPANY_EMAIL=support@aldhahbi.com

# Database Settings
DATABASE_TYPE=firestore
DATABASE_COLLECTION_PHONES=phones
DATABASE_COLLECTION_ACCESSORIES=accessories
DATABASE_COLLECTION_SALES=sales
DATABASE_COLLECTION_PHONE_TYPES=phone_types

# Security Settings
JWT_SECRET=aldhahbi-secret-key-2025
SESSION_SECRET=aldhahbi-session-secret
ENCRYPTION_KEY=aldhahbi-encryption-key

# VAT Settings (Saudi Arabia)
VAT_RATE=0.15
VAT_RATE_PERCENTAGE=15

# File Upload Settings
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf
UPLOAD_PATH=uploads/

# Email Settings (if needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging Settings
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Cache Settings
CACHE_TTL=3600
CACHE_MAX_SIZE=100

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Development Settings
DEBUG=false
HOT_RELOAD=false
