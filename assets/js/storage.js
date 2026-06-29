// ===============================
// STORAGE KEY
// ===============================
// CATATAN: Sumber data transaksi sebenar yang dipakai seluruh aplikasi
// adalah localStorage key "input_transaksi" (lihat inputTransaksi.js).
// Fungsi-fungsi di bawah ini disimpan untuk keperluan storage lain
// (bukan transaksi jurnal) dan SENGAJA tidak lagi mentakrifkan
// getInputTransaksi() supaya tidak menimpa fungsi sebenar.
const STORAGE_KEY = "keuanganUMKM";

// ===============================
// INIT STORAGE
// ===============================
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        inputTransaksi: []
      })
    );
  }
}

// ===============================
// GET & SAVE (untuk keperluan storage umum lain, bukan transaksi jurnal)
// ===============================
function getAllData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveAllData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getCurrentUsername() {
  return localStorage.getItem("username");
}

function getUserStorageKey(baseKey) {
  const username = getCurrentUsername();
  if (!username) return baseKey;
  const sanitized = username.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return `${baseKey}_${sanitized}`;
}

function getInputTransaksiForUser() {
  const userKey = getUserStorageKey("input_transaksi");
  const stored = localStorage.getItem(userKey);

  if (stored) {
    return JSON.parse(stored) || [];
  }

  const legacy = localStorage.getItem("input_transaksi");
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) || [];
      saveInputTransaksiForUser(parsed);
      return parsed;
    } catch (error) {
      console.warn("Legacy transaksi tidak bisa dibaca:", error);
    }
  }

  return [];
}

function saveInputTransaksiForUser(data) {
  localStorage.setItem(getUserStorageKey("input_transaksi"), JSON.stringify(data));
}

function clearInputTransaksiForUser() {
  localStorage.removeItem(getUserStorageKey("input_transaksi"));
}
