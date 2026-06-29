document.addEventListener("DOMContentLoaded", function () {
  if (typeof initStorage === "function") initStorage();
  bindLogin();
  checkAuth();
});

// ===============================
// USER STORAGE
// ===============================
const USER_STORE_KEY = "keuanganUMKM_users";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USER_STORE_KEY)) || {}; }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

// ===============================
// BIND SEMUA EVENT LOGIN
// ===============================
function bindLogin() {
  const loginForm    = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotForm   = document.getElementById("forgotForm");

  if (loginForm)    loginForm.addEventListener("submit",    handleLoginSubmit);
  if (registerForm) registerForm.addEventListener("submit", handleRegisterSubmit);
  if (forgotForm)   forgotForm.addEventListener("submit",   handleForgotPasswordSubmit);

  const showRegisterLink = document.getElementById("showRegisterLink");
  const showForgotLink   = document.getElementById("showForgotLink");

  if (showRegisterLink) showRegisterLink.addEventListener("click", function (e) {
    e.preventDefault(); showAuthSection("register");
  });
  if (showForgotLink) showForgotLink.addEventListener("click", function (e) {
    e.preventDefault(); showAuthSection("forgot");
  });

  document.querySelectorAll(".show-login-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault(); showAuthSection("login");
    });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
}

// ===============================
// LOGIN
// ===============================
function handleLoginSubmit(e) {
  e.preventDefault();
  clearAuthMessage();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    setAuthMessage("Username dan password harus diisi.");
    return;
  }

  const users = getUsers();
  const user  = users[username];

  if (!user) {
    setAuthMessage("Username belum terdaftar. Silakan daftar terlebih dahulu.");
    return;
  }

  if (user.password !== password) {
    setAuthMessage("Username atau password salah!");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", username);
  clearAuthMessage();
  showMainContent();
}

// ===============================
// REGISTER
// ===============================
function handleRegisterSubmit(e) {
  e.preventDefault();
  clearAuthMessage();

  const username        = document.getElementById("registerUsername").value.trim();
  const password        = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();

  if (!username || !password || !confirmPassword) {
    setAuthMessage("Semua kolom harus diisi.");
    return;
  }
  if (password !== confirmPassword) {
    setAuthMessage("Password dan konfirmasi password tidak cocok.");
    return;
  }

  const users = getUsers();
  if (users[username]) {
    setAuthMessage("Username sudah terdaftar. Silakan masuk.");
    return;
  }

  users[username] = { password, createdAt: Date.now(), updatedAt: Date.now() };
  saveUsers(users);

  setAuthMessage("Pendaftaran berhasil! Silakan masuk dengan akun baru.", "success");

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.reset();

  // Kembali ke login setelah 1.8 detik
  setTimeout(function () {
    showAuthSection("login");
  }, 1800);
}

// ===============================
// LUPA PASSWORD
// ===============================
function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  clearAuthMessage();

  const username        = document.getElementById("forgotUsername").value.trim();
  const password        = document.getElementById("forgotPassword").value.trim();
  const confirmPassword = document.getElementById("forgotConfirmPassword").value.trim();

  if (!username || !password || !confirmPassword) {
    setAuthMessage("Semua kolom harus diisi.");
    return;
  }
  if (password !== confirmPassword) {
    setAuthMessage("Password baru dan konfirmasi password tidak cocok.");
    return;
  }

  const users = getUsers();
  if (!users[username]) {
    setAuthMessage("Username tidak ditemukan.");
    return;
  }

  users[username].password  = password;
  users[username].updatedAt = Date.now();
  saveUsers(users);

  setAuthMessage("Password berhasil direset! Silakan login dengan password baru.", "success");

  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) forgotForm.reset();

  setTimeout(function () {
    showAuthSection("login");
  }, 1800);
}

// ===============================
// PESAN AUTH
// ===============================
function setAuthMessage(text, type) {
  type = type || "error";
  const el = document.getElementById("authMessage");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("hidden", "success", "error");
  el.classList.add(type);
}

function clearAuthMessage() {
  const el = document.getElementById("authMessage");
  if (!el) return;
  el.textContent = "";
  el.classList.remove("success", "error");
  el.classList.add("hidden");
}

// ===============================
// NAVIGASI ANTAR SECTION AUTH
// ===============================
function showAuthSection(section) {
  ["loginSection", "registerSection", "forgotSection"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === section + "Section") {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
  clearAuthMessage();
}

// Expose ke global (dipanggil dari onclick HTML)
window.showAuthSection            = showAuthSection;
window.handleLoginSubmit          = handleLoginSubmit;
window.handleRegisterSubmit       = handleRegisterSubmit;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
window.toggleUserMenu             = toggleUserMenu;

// ===============================
// LOGOUT
// ===============================
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  showLoginForm();
}

// ===============================
// CEK SESSION
// ===============================
function checkAuth() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showMainContent();
  } else {
    showLoginForm();
  }
}

// ===============================
// TAMPILKAN MAIN APP
// ===============================
function showMainContent() {
  document.getElementById("loginContainer").classList.add("hidden");
  document.getElementById("mainContent").classList.remove("hidden");
  updateHeaderUserInfo();
  bindNavigation();
  navigateTo("Dashboard");
  const dashboardLink = document.querySelector('.nav a[data-page="Dashboard"]');
  if (dashboardLink) setActiveNav(dashboardLink);
}

// ===============================
// TAMPILKAN HALAMAN LOGIN
// ===============================
function showLoginForm() {
  document.getElementById("loginContainer").classList.remove("hidden");
  document.getElementById("mainContent").classList.add("hidden");

  ["loginForm", "registerForm", "forgotForm"].forEach(function (id) {
    const form = document.getElementById(id);
    if (form) form.reset();
  });

  showAuthSection("login");

  const headerUsername = document.getElementById("headerUsername");
  if (headerUsername) headerUsername.textContent = "";
}

function updateHeaderUserInfo() {
  const username = localStorage.getItem("username");
  const el1 = document.getElementById("headerUsername");
  const el2 = document.getElementById("headerUsernameDrop");
  if (el1) el1.textContent = username || "";
  if (el2) el2.textContent = username || "";
}

// ===============================
// USER DROPDOWN TOGGLE
// ===============================
function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown");
  const arrow    = document.getElementById("userMenuArrow");
  if (!dropdown) return;
  const isOpen = dropdown.classList.toggle("open");
  if (arrow) arrow.classList.toggle("open", isOpen);
}

// Tutup dropdown jika klik di luar
document.addEventListener("click", function (e) {
  const menu = document.getElementById("userMenu");
  if (menu && !menu.contains(e.target)) {
    const dropdown = document.getElementById("userDropdown");
    const arrow    = document.getElementById("userMenuArrow");
    if (dropdown) dropdown.classList.remove("open");
    if (arrow)    arrow.classList.remove("open");
  }
});

// ===============================
// NAVIGASI HALAMAN
// ===============================
function bindNavigation() {
  document.querySelectorAll(".nav a").forEach(function (link) {
    link.removeEventListener("click", handleNavClick);
    link.addEventListener("click", handleNavClick);
  });
}

function handleNavClick(e) {
  e.preventDefault();
  const link = e.currentTarget;
  setActiveNav(link);
  navigateTo(link.dataset.page);
}

function setActiveNav(activeLink) {
  document.querySelectorAll(".nav a").forEach(function (link) {
    link.classList.remove("active");
  });
  if (activeLink) activeLink.classList.add("active");
}

function navigateTo(page) {
  switch (page) {
    case "Dashboard":           renderDashboard(true);                    break;
    case "inputTransaksi":      renderInputTransaksi();                   break;
    case "bukuBesar":           renderBukuBesar();                        break;
    case "neracaSaldo":         renderNeracaSaldo();                      break;
    case "labaRugi":            renderLabaRugi();                         break;
    case "arusKas":             renderArusKas();                          break;
    case "perubahanModal":      renderPerubahanModal();                   break;
    case "jurnalPenyesuaian":   renderJurnalPenyesuaianPersediaan();      break;
    case "Database":            renderDatabase();                         break;
    default:                    renderDashboard(true);
  }
}
