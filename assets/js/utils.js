// ===============================
// FORMAT RUPIAH
// ===============================
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
}

// ===============================
// FORMAT TANGGAL (YYYY-MM-DD -> DD/MM/YYYY)
// ===============================
function formatTanggal(tanggal) {
  // ✅ Parse manual supaya tidak terkena shift timezone
  // (new Date("YYYY-MM-DD") dianggap UTC tengah malam, sehingga di
  // zona waktu sebelah barat UTC, tanggalnya bisa mundur 1 hari).
  if (typeof tanggal === "string" && /^\d{4}-\d{2}-\d{2}/.test(tanggal)) {
    const [tahun, bulan, hari] = tanggal.split("-");
    return `${hari}/${bulan}/${tahun}`;
  }
  const date = new Date(tanggal);
  return date.toLocaleDateString("id-ID");
}

// ===============================
// GENERATE ID TRANSAKSI
// ===============================
function generateId(prefix) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}`;
}

// ===============================
// VALIDASI WAJIB ISI
// ===============================
function isNotEmpty(value) {
  return value !== null && value !== undefined && value !== "";
}

// ===============================
// VALIDASI ANGKA
// ===============================
function isNumber(value) {
  return !isNaN(value) && value !== "";
}
