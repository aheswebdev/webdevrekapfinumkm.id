function renderInputTransaksi() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="card">
      <h2>Input Transaksi</h2>

      <form id="inputTransaksiForm" class="form">
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="tanggal" required />
        </div>

        <div class="form-group">
          <label>Metode</label>
          <select id="metode">
            <option value="tunai">Tunai</option>
            <option value="non-tunai">Non Tunai</option>
          </select>
        </div>

        <div class="form-group">
          <label>Keterangan</label>
          <input type="text" id="keterangan" required />
        </div>

        <div class="form-group">
          <label>Jumlah (Rp)</label>
          <input type="number" id="jumlah" required />
        </div>

        <button type="submit">Simpan</button>
      </form>
    </section>

    <section class="card">
      <h3>Jurnal Umum</h3>

      <div class="form-group">
        <label>Filter Kategori</label>
        <select id="filterKategori">
          <option value="">Semua</option>
          <option value="aset">Aset</option>
          <option value="liabilitas">Liabilitas</option>
          <option value="ekuitas">Ekuitas</option>
          <option value="pendapatan">Pendapatan</option>
          <option value="beban">Beban</option>
        </select>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
          </tr>
        </thead>
        <tbody id="inputTransaksiList"></tbody>
      </table>
    </section>
  `;

  document
    .getElementById("inputTransaksiForm")
    .addEventListener("submit", handleInputTransaksiSubmit);

  document
    .getElementById("filterKategori")
    .addEventListener("change", renderInputTransaksiList);

  renderInputTransaksiList();
}

// ===============================
// MASTER AKUN
// ===============================
const AKUN_RULES = [
  { kode: "101", nama: "Kas", kategori: "aset", saldoNormal: "debit", idnama: "kas" },
  { kode: "102", nama: "Kas Bank", kategori: "aset", saldoNormal: "debit", idnama: "kas bank" },
  { kode: "103", nama: "Piutang", kategori: "aset", saldoNormal: "debit", idnama: "piutang" },
  { kode: "104", nama: "Persediaan", kategori: "aset", saldoNormal: "debit", idnama: "persediaan" },
  { kode: "105", nama: "Peralatan", kategori: "aset", saldoNormal: "debit", idnama: "peralatan" },

  { kode: "201", nama: "Utang Usaha", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang usaha" },
  { kode: "202", nama: "Utang Bank", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang bank" },

  { kode: "301", nama: "Modal", kategori: "ekuitas", saldoNormal: "kredit", idnama: "modal" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "prive" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "ambil kas" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "pribadi" },
  { kode: "303", nama: "Laba Ditahan", kategori: "ekuitas", saldoNormal: "kredit", idnama: "laba ditahan" },

  { kode: "401", nama: "Pendapatan", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan" },
  { kode: "402", nama: "Pendapatan Lainnya", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan lainnya" },

  { kode: "501", nama: "Beban Gaji", kategori: "beban", saldoNormal: "debit", idnama: "bayar gaji" },
  { kode: "502", nama: "Beban Listrik", kategori: "beban", saldoNormal: "debit", idnama: "bayar listrik" },
  { kode: "503", nama: "Beban Air", kategori: "beban", saldoNormal: "debit", idnama: "bayar air" },
  { kode: "504", nama: "Beban Internet", kategori: "beban", saldoNormal: "debit", idnama: "bayar internet" },
  { kode: "505", nama: "Beban Sewa", kategori: "beban", saldoNormal: "debit", idnama: "bayar sewa" },
];

// prioritas kategori akun deteksi
const PRIORITAS_KATEGORI = [
  "pendapatan",
  "beban",
  "liabilitas",
  "ekuitas",
  "aset"
];

// ===============================
// DETEKSI AKUN

function detectAkunUtama(keterangan) {
  const text = keterangan.toLowerCase();

  // ✅ PENJUALAN PIUTANG → AKUN UTAMA = PIUTANG
  if (
    text.includes("piutang") &&
    (text.includes("penjualan") || text.includes("jual"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Piutang");
  }

  // 🔥 RULE KHUSUS PEMBELIAN ASET
  if (
    text.includes("beli") ||
    text.includes("membeli") ||
    text.includes("pembelian")
  ) {
    const asetSelainKas = AKUN_RULES.find(a =>
      a.kategori === "aset" &&
      a.nama !== "Kas" &&
      text.includes(a.idnama)
    );

    if (asetSelainKas) return asetSelainKas;
  }

  // 🔴 BAYAR UTANG
  if (text.includes("bayar utang bank")) {
    return AKUN_RULES.find(a => a.nama === "Utang Bank");
  }

  if (text.includes("bayar utang")) {
    return AKUN_RULES.find(a => a.nama === "Utang Usaha");
  }

  if (
    text.includes("bayar piutang") ||
    text.includes("terima piutang") ||
    text.includes("pelunasan piutang")
  ) {
    return AKUN_RULES.find(a => a.nama === "Piutang");
  }

  // 🔵 DEFAULT DETEKSI
  const kandidat = AKUN_RULES.filter(a =>
    text.includes(a.idnama)
  );

  if (kandidat.length === 0) return null;

  kandidat.sort(
    (a, b) =>
      PRIORITAS_KATEGORI.indexOf(a.kategori) -
      PRIORITAS_KATEGORI.indexOf(b.kategori)
  );

  return kandidat[0];
}


function detectAkunLawan(akunUtama, keterangan) {
  const text = keterangan.toLowerCase();

  // 🔥🔥 1. PENJUALAN PIUTANG (PALING ATAS)
  if (
    akunUtama.nama === "Piutang" &&
    (text.includes("penjualan") || text.includes("jual"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Pendapatan");
  }

  // 🔥 2. PEMBELIAN ASET SECARA UTANG (BUKAN PIUTANG)
  if (
    akunUtama.kategori === "aset" &&
    akunUtama.nama !== "Kas" &&
    akunUtama.nama !== "Piutang" && // ⬅️ INI PENTING
    (text.includes("utang usaha") || text.includes("utang"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Utang Usaha");
  }

  // 🔴 3. SETOR MODAL
  if (
    akunUtama.nama === "Kas" &&
    (text.includes("setor") || text.includes("modal"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Modal");
  }

  // 🔴 4. BAYAR UTANG
  if (akunUtama.nama === "Utang Usaha" || akunUtama.nama === "Utang Bank") {
    return AKUN_RULES.find(a => a.nama === "Kas");
  }

  // 🔵 5. TERIMA PIUTANG
  if (akunUtama.nama === "Piutang") {
    return AKUN_RULES.find(a => a.nama === "Kas");
  }

  // 🔵 6. PENDAPATAN & BEBAN
  if (akunUtama.kategori === "pendapatan" || akunUtama.kategori === "beban") {
    return AKUN_RULES.find(a => a.nama === "Kas");
  }

  // 🟢 7. ASET SELAIN KAS
  if (akunUtama.kategori === "aset" && akunUtama.nama !== "Kas") {
    return AKUN_RULES.find(a => a.nama === "Kas");
  }

  // 🟣 8. EKUITAS
  if (akunUtama.kategori === "ekuitas") {
    return AKUN_RULES.find(a => a.nama === "Kas");
  }

  // 🟡 DEFAULT
  return AKUN_RULES.find(a => a.nama === "Kas");
}

function isKeteranganValid(keterangan) {
  const text = keterangan.toLowerCase();

  return AKUN_RULES.some(a => text.includes(a.idnama)) ||
    text.includes("bayar utang") ||
    text.includes("bayar piutang") ||
    text.includes("terima piutang") ||
    text.includes("pelunasan");
}

function getAkunTerdeteksi(keterangan) {
  const text = keterangan.toLowerCase();
  return AKUN_RULES.filter(a => text.includes(a.idnama));
}

// ===============================
// SUBMIT TRANSAKSI
function handleInputTransaksiSubmit(e) {
  e.preventDefault();

  // confirmasi submit
  const konfirmasi = confirm(
    "Yakin ingin menyimpan transaksi ini?\n\n" +
    "Tanggal : " + tanggal.value + "\n" +
    "Keterangan : " + keterangan.value + "\n" +
    "Jumlah : Rp " + Number(jumlah.value).toLocaleString("id-ID")
  );

  if (!konfirmasi) return;

  const akunTerdeteksi = getAkunTerdeteksi(keterangan.value);

  // 🚨 KAS TIDAK BOLEH SENDIRI
  if (
    akunTerdeteksi.length === 1 &&
    akunTerdeteksi[0].nama === "Kas"
  ) {
    alert(
      "Transaksi tidak valid.\n\n" +
      "Kas tidak boleh berdiri sendiri.\n" +
      "Contoh yang benar:\n" +
      "- Kas modal masuk\n" +
      "- Kas penjualan\n" +
      "- Kas bayar utang"
    );
    return;
  }

  // 🚨 VALIDASI KETERANGAN
  if (!isKeteranganValid(keterangan.value)) {
    alert(
      "Keterangan tidak dikenali.\n\n" +
      "Gunakan nama akun seperti:\n" +
      "- kas\n- piutang\n- utang usaha\n- utang bank\n- beban gaji\n\n" +
      "Contoh: 'Bayar utang usaha'"
    );
    return;
  }

  const akunUtama = detectAkunUtama(keterangan.value);

  if (!akunUtama) {
    alert("Input Keterangan Tidak Valid.");
    return;
  }

  const pengurangan = isPenguranganAkun(keterangan.value);

  const transaksi = {
    id: generateTransaksiId(),
    tanggal: tanggal.value,
    keterangan: keterangan.value,
    akunUtama,
    akunLawan: detectAkunLawan(akunUtama, keterangan.value),
    jumlah: Number(jumlah.value),
    pengurangan,
  };

  const data = getInputTransaksi();
  data.push(transaksi);
  saveInputTransaksiForUser(data);

  e.target.reset();
  renderInputTransaksiList();
}


// ===============================
// RENDER JURNAL
// ===============================
function renderInputTransaksiList() {
  const list = document.getElementById("inputTransaksiList");
  const data = getInputTransaksi();
  const filter = document.getElementById("filterKategori").value;

  list.innerHTML = "";

  data
  .slice() 
  .sort((a, b) => Number(b.id.split("-")[1]) - Number(a.id.split("-")[1]))
  .filter(t => !filter || t.akunUtama.kategori === filter)
  .forEach(t => {

    const { debit, kredit } = tentukanDebitKredit(t);

    list.innerHTML += `
      <tr>
        <td>${formatTanggal(t.tanggal)}</td>
        <td>${debit.kode}</td>
        <td>${capitalize(debit.nama)}</td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>${kredit.kode}</td>
        <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
        <td></td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
      </tr>
    `;
  });

}

// ===============================
// STORAGE & UTIL
// ===============================
function getInputTransaksi() {
  return getInputTransaksiForUser();
}

function generateTransaksiId() {
  return "JU-" + Date.now();
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function isPenguranganAkun(keterangan) {
  const text = keterangan.toLowerCase();
  return (
    text.includes("bayar piutang") ||
    text.includes("bayar utang") ||
    text.includes("pelunasan") ||
    text.includes("pembayaran")
  );
}
function tentukanDebitKredit(transaksi) {
  const { akunUtama, akunLawan, pengurangan, keterangan } = transaksi;

  const text = keterangan.toLowerCase();

  // ⚡ RULE KHUSUS PRIVE
  if (akunUtama.nama.toLowerCase() === "prive") {
    if (text.includes("kembalikan") || text.includes("setor")) {
      // kembalikan prive → Kas Debit, Prive Kredit
      return { debit: akunLawan, kredit: akunUtama };
    } else {
      // ambil prive → Prive Debit, Kas Kredit
      return { debit: akunUtama, kredit: akunLawan };
    }
  }

  // saldo normal
  let debit = akunUtama.saldoNormal === "debit" ? akunUtama : akunLawan;
  let kredit = debit === akunUtama ? akunLawan : akunUtama;

  // 🔥 JIKA PENGURANGAN → DIBALIK
  if (pengurangan) {
    [debit, kredit] = [kredit, debit];
  }

  return { debit, kredit };
}

