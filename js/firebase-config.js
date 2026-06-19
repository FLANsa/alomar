// Firebase Configuration for Phone Store Demo
// إعدادات Firebase للمستودع الجديد

const firebaseConfig = {
  apiKey: "AIzaSyCgxnJrx47TyjynhvFib5GlWscctUlMeGI",
  authDomain: "alomar-51a84.firebaseapp.com",
  projectId: "alomar-51a84",
  storageBucket: "alomar-51a84.firebasestorage.app",
  messagingSenderId: "494676328578",
  appId: "1:494676328578:web:f747b5e0ab4ea3591f749b",
  measurementId: "G-1EB4LL9V8J"
};

// تهيئة Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// تصدير الخدمات للاستخدام في الملفات الأخرى
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseAnalytics = analytics;

console.log('🔥 Firebase initialized successfully!');
console.log('📊 Firestore Database:', db);
console.log('🔐 Authentication:', auth);
console.log('📈 Analytics:', analytics);
