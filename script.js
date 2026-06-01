/* ============================================================
   রসুলপুর ইসলাম নিসা মহিলা মাদ্রাসা
   Main Script - script.js
   Author: Senior Full-Stack Engineer
   Version: 1.0.0
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════
   FIREBASE CONFIGURATION & INITIALIZATION
══════════════════════════════════════════ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyAxjoCkMIGukH3jV8wbhxXDxcT4YGl9L2A",
  authDomain: "rasulpur-madrasa.firebaseapp.com",
  projectId: "rasulpur-madrasa",
  storageBucket: "rasulpur-madrasa.firebasestorage.app",
  messagingSenderId: "778934188368",
  appId: "1:778934188368:web:5cb2ec111a4dde331b5455",
  measurementId: "G-BTMYN9PXFK"
};

/* Initialize Firebase */
const app        = initializeApp(firebaseConfig);
const auth       = getAuth(app);
const db         = getFirestore(app);
const provider   = new GoogleAuthProvider();

/* ══════════════════════════════════════════
   APP STATE
══════════════════════════════════════════ */
const State = {
  currentUser:    null,
  currentPage:    'dashboard',
  sidebarCollapsed: false,
  students:       [],
  teachers:       [],
  routines:       [],
  editingId:      null,
  deleteTarget:   { collection: null, id: null, name: '' },
  studentPage:    1,
  teacherPage:    1,
  itemsPerPage:   10,
  searchQuery:    '',
  unsubscribers:  []
};

/* ══════════════════════════════════════════
   DOM REFERENCES
══════════════════════════════════════════ */
const DOM = {
  /* Screens */
  loadingScreen:  () => document.getElementById('loading-screen'),
  authPage:       () => document.getElementById('auth-page'),
  appPage:        () => document.getElementById('app-page'),

  /* Auth */
  loginTab:       () => document.getElementById('login-tab'),
  emailTab:       () => document.getElementById('email-tab'),
  adminForm:      () => document.getElementById('admin-login-form'),
  emailForm:      () => document.getElementById('email-login-form'),
  authAlert:      () => document.getElementById('auth-alert'),
  authAlertMsg:   () => document.getElementById('auth-alert-msg'),

  /* Admin Login */
  adminEmail:     () => document.getElementById('admin-email'),
  adminPass:      () => document.getElementById('admin-password'),
  adminLoginBtn:  () => document.getElementById('admin-login-btn'),

  /* Email Login */
  userEmail:      () => document.getElementById('user-email'),
  userPass:       () => document.getElementById('user-password'),
  emailLoginBtn:  () => document.getElementById('email-login-btn'),

  /* Google */
  googleBtn:      () => document.getElementById('google-login-btn'),
  googleBtn2:     () => document.getElementById('google-login-btn2'),

  /* Sidebar */
  sidebar:        () => document.getElementById('sidebar'),
  sidebarOverlay: () => document.getElementById('sidebar-overlay'),
  sidebarToggle:  () => document.getElementById('sidebar-toggle'),
  navItems:       () => document.querySelectorAll('.nav-item[data-page]'),

  /* User Info */
  userAvatar:     () => document.getElementById('user-avatar'),
  userName:       () => document.getElementById('user-name'),
  userRole:       () => document.getElementById('user-role'),
  headerAvatar:   () => document.getElementById('header-avatar'),

  /* Header */
  headerSearch:   () => document.getElementById('header-search'),
  pageTitle:      () => document.getElementById('page-title'),

  /* Pages */
  pageSections:   () => document.querySelectorAll('.page-section'),

  /* Dashboard */
  statStudents:   () => document.getElementById('stat-students'),
  statTeachers:   () => document.getElementById('stat-teachers'),
  statClasses:    () => document.getElementById('stat-classes'),
  statRoutines:   () => document.getElementById('stat-routines'),
  recentActivity: () => document.getElementById('recent-activity'),

  /* Student */
  studentSearch:  () => document.getElementById('student-search'),
  studentClass:   () => document.getElementById('student-class-filter'),
  studentTableBody:() => document.getElementById('student-table-body'),
  studentCount:   () => document.getElementById('student-count'),
  studentInfo:    () => document.getElementById('student-info'),
  studentPagination:() => document.getElementById('student-pagination'),
  addStudentBtn:  () => document.getElementById('add-student-btn'),

  /* Teacher */
  teacherSearch:  () => document.getElementById('teacher-search'),
  teacherDept:    () => document.getElementById('teacher-dept-filter'),
  teacherTableBody:() => document.getElementById('teacher-table-body'),
  teacherCount:   () => document.getElementById('teacher-count'),
  teacherInfo:    () => document.getElementById('teacher-info'),
  teacherPagination:() => document.getElementById('teacher-pagination'),
  addTeacherBtn:  () => document.getElementById('add-teacher-btn'),

  /* Routine */
  routineClass:   () => document.getElementById('routine-class-filter'),
  routineDay:     () => document.getElementById('routine-day-filter'),
  routineTableBody:() => document.getElementById('routine-table-body'),
  addRoutineBtn:  () => document.getElementById('add-routine-btn'),

  /* Search Page */
  searchInput:    () => document.getElementById('search-input'),
  searchBtn:      () => document.getElementById('search-btn'),
  searchResults:  () => document.getElementById('search-results'),

  /* Modals */
  studentModal:   () => document.getElementById('student-modal'),
  teacherModal:   () => document.getElementById('teacher-modal'),
  routineModal:   () => document.getElementById('routine-modal'),
  viewModal:      () => document.getElementById('view-modal'),
  confirmModal:   () => document.getElementById('confirm-modal'),

  /* Student Modal Form */
  studentModalTitle: () => document.getElementById('student-modal-title'),
  sName:          () => document.getElementById('s-name'),
  sId:            () => document.getElementById('s-id'),
  sClass:         () => document.getElementById('s-class'),
  sSection:       () => document.getElementById('s-section'),
  sRoll:          () => document.getElementById('s-roll'),
  sPhone:         () => document.getElementById('s-phone'),
  sGuardian:      () => document.getElementById('s-guardian'),
  sAddress:       () => document.getElementById('s-address'),
  sStatus:        () => document.getElementById('s-status'),
  studentSaveBtn: () => document.getElementById('student-save-btn'),

  /* Teacher Modal Form */
  teacherModalTitle: () => document.getElementById('teacher-modal-title'),
  tName:          () => document.getElementById('t-name'),
  tDesignation:   () => document.getElementById('t-designation'),
  tDept:          () => document.getElementById('t-dept'),
  tPhone:         () => document.getElementById('t-phone'),
  tEmail:         () => document.getElementById('t-email'),
  tSubject:       () => document.getElementById('t-subject'),
  tJoining:       () => document.getElementById('t-joining'),
  tStatus:        () => document.getElementById('t-status'),
  teacherSaveBtn: () => document.getElementById('teacher-save-btn'),

  /* Routine Modal Form */
  routineModalTitle: () => document.getElementById('routine-modal-title'),
  rClass:         () => document.getElementById('r-class'),
  rDay:           () => document.getElementById('r-day'),
  rPeriod:        () => document.getElementById('r-period'),
  rSubject:       () => document.getElementById('r-subject'),
  rTeacher:       () => document.getElementById('r-teacher'),
  rTime:          () => document.getElementById('r-time'),
  routineSaveBtn: () => document.getElementById('routine-save-btn'),

  /* View Modal */
  viewModalTitle: () => document.getElementById('view-modal-title'),
  viewContent:    () => document.getElementById('view-content'),

  /* Confirm Modal */
  confirmName:    () => document.getElementById('confirm-name'),
  confirmYesBtn:  () => document.getElementById('confirm-yes-btn'),

  /* Logout */
  logoutBtn:      () => document.getElementById('logout-btn'),

  /* Toast */
  toastContainer: () => document.getElementById('toast-container'),
};

/* ══════════════════════════════════════════
   UTILITY FUNCTIONS
══════════════════════════════════════════ */

/**
 * বাংলা অক্ষরে তারিখ ফরম্যাট
 */
function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * নামের প্রথম অক্ষর থেকে Avatar তৈরি
 */
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

/**
 * Badge HTML তৈরি
 */
function badgeHTML(status) {
  const map = {
    'active':   ['badge-green',  '✅ সক্রিয়'],
    'inactive': ['badge-red',    '❌ নিষ্ক্রিয়'],
    'on-leave': ['badge-amber',  '⏸ ছুটিতে'],
    'passed':   ['badge-blue',   '🎓 পাস'],
    'dropped':  ['badge-gray',   '🚫 বাদ'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

/**
 * Page Title Map
 */
const pageTitles = {
  dashboard:  '📊 ড্যাশবোর্ড',
  students:   '👩‍🎓 শিক্ষার্থী ব্যবস্থাপনা',
  teachers:   '👩‍🏫 শিক্ষক ব্যবস্থাপনা',
  routine:    '📅 রুটিন ব্যবস্থাপনা',
  search:     '🔍 সার্চ সিস্টেম',
};

/* ══════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
══════════════════════════════════════════ */
function showToast(message, type = 'success', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
  `;
  DOM.toastContainer().appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ══════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════ */
function hideLoading() {
  const el = DOM.loadingScreen();
  if (el) {
    el.classList.add('fade-out');
    setTimeout(() => el.style.display = 'none', 500);
  }
}

function showLoading() {
  const el = DOM.loadingScreen();
  if (el) {
    el.style.display = 'flex';
    el.classList.remove('fade-out');
  }
}

/* ══════════════════════════════════════════
   AUTH SYSTEM
══════════════════════════════════════════ */

/* Auth Tab Switching */
function initAuthTabs() {
  const loginTab = DOM.loginTab();
  const emailTab = DOM.emailTab();
  const adminForm = DOM.adminForm();
  const emailForm = DOM.emailForm();

  if (!loginTab || !emailTab) return;

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    emailTab.classList.remove('active');
    adminForm.classList.remove('hidden');
    emailForm.classList.add('hidden');
    clearAuthAlert();
  });

  emailTab.addEventListener('click', () => {
    emailTab.classList.add('active');
    loginTab.classList.remove('active');
    emailForm.classList.remove('hidden');
    adminForm.classList.add('hidden');
    clearAuthAlert();
  });
}

/* Show Auth Error */
function showAuthAlert(message) {
  const alert = DOM.authAlert();
  const msg   = DOM.authAlertMsg();
  if (alert && msg) {
    msg.textContent = message;
    alert.classList.remove('hidden');
  }
}

function clearAuthAlert() {
  const alert = DOM.authAlert();
  if (alert) alert.classList.add('hidden');
}

/* Password Toggle */
function initPasswordToggles() {
  document.querySelectorAll('.input-toggle[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.textContent = isPass ? '🙈' : '👁️';
    });
  });
}

/* Admin (Email/Password) Login */
async function handleAdminLogin(e) {
  e.preventDefault();
  clearAuthAlert();

  const email    = DOM.adminEmail()?.value?.trim();
  const password = DOM.adminPass()?.value;
  const btn      = DOM.adminLoginBtn();

  if (!email || !password) {
    showAuthAlert('ইমেইল ও পাসওয়ার্ড দিন।');
    return;
  }

  setButtonLoading(btn, true, 'লগইন হচ্ছে...');

  try {
    await signInWithEmailAndPassword(auth, email, password);
    /* onAuthStateChanged handles the rest */
  } catch (err) {
    setButtonLoading(btn, false, '🔐 অ্যাডমিন লগইন');
    showAuthAlert(getAuthError(err.code));
  }
}

/* Email Login */
async function handleEmailLogin(e) {
  e.preventDefault();
  clearAuthAlert();

  const email    = DOM.userEmail()?.value?.trim();
  const password = DOM.userPass()?.value;
  const btn      = DOM.emailLoginBtn();

  if (!email || !password) {
    showAuthAlert('ইমেইল ও পাসওয়ার্ড দিন।');
    return;
  }

  setButtonLoading(btn, true, 'লগইন হচ্ছে...');

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    setButtonLoading(btn, false, '📧 ইমেইল লগইন');
    showAuthAlert(getAuthError(err.code));
  }
}

/* Google Login */
async function handleGoogleLogin() {
  clearAuthAlert();
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showAuthAlert(getAuthError(err.code));
    }
  }
}

/* Logout */
async function handleLogout() {
  try {
    /* Unsubscribe all Firestore listeners */
    State.unsubscribers.forEach(fn => fn());
    State.unsubscribers = [];
    await signOut(auth);
    showToast('সফলভাবে লগআউট হয়েছে।', 'info');
  } catch (err) {
    showToast('লগআউট ব্যর্থ হয়েছে।', 'error');
  }
}

/* Firebase Auth Error Messages in Bengali */
function getAuthError(code) {
  const errors = {
    'auth/invalid-email':          'ইমেইল ঠিকানা সঠিক নয়।',
    'auth/user-disabled':          'এই অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।',
    'auth/user-not-found':         'ব্যবহারকারী পাওয়া যায়নি।',
    'auth/wrong-password':         'পাসওয়ার্ড সঠিক নয়।',
    'auth/invalid-credential':     'ইমেইল বা পাসওয়ার্ড ভুল।',
    'auth/too-many-requests':      'অনেক বার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
    'auth/network-request-failed': 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ চেক করুন।',
    'auth/popup-blocked':          'Popup ব্লক হয়েছে। Browser সেটিং চেক করুন।',
    'auth/cancelled-popup-request':'Google লগইন বাতিল হয়েছে।',
  };
  return errors[code] || `লগইন ব্যর্থ হয়েছে। (${code})`;
}

/* Button Loading State */
function setButtonLoading(btn, loading, originalText) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.original = btn.textContent;
    btn.innerHTML = `<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;"></span> ${originalText || 'অপেক্ষা করুন...'}`;
  } else {
    btn.disabled = false;
    btn.textContent = originalText || btn.dataset.original || 'Submit';
  }
}

/* Auth State Observer */
function initAuthObserver() {
  onAuthStateChanged(auth, (user) => {
    hideLoading();
    if (user) {
      State.currentUser = user;
      showApp(user);
    } else {
      State.currentUser = null;
      showAuth();
    }
  });
}

/* Show Auth Page */
function showAuth() {
  DOM.authPage()?.classList.remove('hidden');
  DOM.appPage()?.classList.add('hidden');
  /* Reset forms */
  DOM.adminForm()?.reset();
  DOM.emailForm()?.reset();
  clearAuthAlert();
}

/* Show App */
function showApp(user) {
  DOM.authPage()?.classList.add('hidden');
  DOM.appPage()?.classList.remove('hidden');
  updateUserUI(user);
  loadPage('dashboard');
  initRealtimeListeners();
}

/* Update User Info in UI */
function updateUserUI(user) {
  const name   = user.displayName || user.email?.split('@')[0] || 'Admin';
  const initials = getInitials(name);

  /* Sidebar */
  const nameEl = DOM.userName();
  const roleEl = DOM.userRole();
  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.textContent = 'অ্যাডমিন';

  /* Avatar */
  [DOM.userAvatar(), DOM.headerAvatar()].forEach(el => {
    if (!el) return;
    if (user.photoURL) {
      el.innerHTML = `<img src="${user.photoURL}" alt="${name}">`;
    } else {
      el.textContent = initials;
    }
  });
}

/* ══════════════════════════════════════════
   SIDEBAR & NAVIGATION
══════════════════════════════════════════ */
function initSidebar() {
  const sidebar  = DOM.sidebar();
  const overlay  = DOM.sidebarOverlay();
  const toggle   = DOM.sidebarToggle();
  const main     = document.querySelector('.main-content');

  if (!sidebar || !toggle) return;

  toggle.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      sidebar.classList.toggle('mobile-open');
      overlay?.classList.toggle('show');
    } else {
      State.sidebarCollapsed = !State.sidebarCollapsed;
      sidebar.classList.toggle('collapsed', State.sidebarCollapsed);
      main?.classList.toggle('expanded', State.sidebarCollapsed);
    }
  });

  overlay?.addEventListener('click', closeMobileSidebar);

  /* Nav Items */
  DOM.navItems().forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page) {
        loadPage(page);
        if (window.innerWidth <= 768) closeMobileSidebar();
      }
    });
  });

  /* Quick Links in Dashboard */
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => loadPage(el.dataset.goto));
  });

  /* Logout */
  DOM.logoutBtn()?.addEventListener('click', handleLogout);
}

function closeMobileSidebar() {
  DOM.sidebar()?.classList.remove('mobile-open');
  DOM.sidebarOverlay()?.classList.remove('show');
}

/* Load Page */
function loadPage(page) {
  State.currentPage = page;

  /* Update nav active state */
  DOM.navItems().forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  /* Update page title */
  const titleEl = DOM.pageTitle();
  if (titleEl) titleEl.textContent = pageTitles[page] || page;

  /* Show/hide sections */
  DOM.pageSections().forEach(section => {
    section.classList.toggle('active', section.id === `page-${page}`);
  });

  /* Page-specific loading */
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'students':  renderStudents();  break;
    case 'teachers':  renderTeachers();  break;
    case 'routine':   renderRoutine();   break;
    case 'search':    /* search is interactive */ break;
  }
}

/* ══════════════════════════════════════════
   FIRESTORE REALTIME LISTENERS
══════════════════════════════════════════ */
function initRealtimeListeners() {
  /* Students listener */
  const studentUnsub = onSnapshot(
    query(collection(db, 'students'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      State.students = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (State.currentPage === 'students')  renderStudents();
      if (State.currentPage === 'dashboard') renderDashboard();
      updateNavBadge('students', State.students.filter(s => s.status === 'active').length);
    },
    (err) => console.error('Students listener error:', err)
  );

  /* Teachers listener */
  const teacherUnsub = onSnapshot(
    query(collection(db, 'teachers'), orderBy('createdAt', 'desc')),
    (snapshot)
