// Firebase Configuration for Phone Store Demo
// إعدادات Firebase للمستودع الجديد

const firebaseConfig = {
  apiKey: "AIzaSyCOxP_fOupA-OAyO4oxYe54ohZ8_YzS7zc",
  authDomain: "aldhahbi-7a93b.firebaseapp.com",
  projectId: "aldhahbi-7a93b",
  storageBucket: "aldhahbi-7a93b.firebasestorage.app",
  messagingSenderId: "392213757842",
  appId: "1:392213757842:web:510288ddc8ccd5d7e48b4b",
  measurementId: "G-77EPVYFWPB"
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
