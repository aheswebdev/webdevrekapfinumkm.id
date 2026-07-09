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
          <input type="text" id="keterangan" placeholder="Contoh: Kas penjualan, Bayar beban listrik, Penjualan kredit" required />
          <small class="form-hint">
            Tulis keterangan yang memuat <b>nama akun</b> yang terlibat, contoh: "kas", "piutang",
            "utang usaha", "modal", "penjualan", "beban gaji". Kas tidak boleh berdiri sendiri,
            selalu sertai dengan akun lawan (mis. "Kas modal masuk", "Kas penjualan", "Kas bayar utang").
          </small>
        </div>

        <div class="form-group">
          <label>Jumlah (Rp)</label>
          <input type="number" id="jumlah" required />
        </div>

        <button type="submit">Simpan</button>
      </form>

      <div class="petunjuk-box" style="margin-top:16px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:0.9em;">
        <strong>📌 Petunjuk Pengisian Keterangan Jurnal Umum</strong>
        <p style="margin:6px 0;">
          <b>Metode</b> menentukan akun kas lawan yang dipakai sistem: pilih <b>Tunai</b>
          jika uang masuk/keluar lewat kas fisik (akun "Kas"), atau <b>Non Tunai</b> jika
          lewat transfer/bank (akun "Kas Bank"). Field ini otomatis dipakai selama Keterangan
          tidak menyebut kata "kas bank" secara eksplisit.
        </p>
        <ul style="margin:8px 0 0 18px;padding:0;">
          <li><b>Modal masuk:</b> "Kas setor modal" → Debit Kas, Kredit Modal</li>
          <li><b>Penjualan tunai:</b> "Kas penjualan" → Debit Kas, Kredit Penjualan</li>
          <li><b>Penjualan kredit (piutang):</b> "Penjualan kredit" / "Penjualan piutang" / "Jual barang kredit" → Debit Piutang Usaha, Kredit Penjualan</li>
          <li><b>Terima pelunasan piutang:</b> "Terima piutang" / "Bayar piutang" → Debit Kas, Kredit Piutang Usaha</li>
          <li><b>Bayar utang usaha:</b> "Bayar utang usaha" → Debit Utang Usaha, Kredit Kas</li>
          <li><b>Bayar utang bank:</b> "Bayar utang bank" → Debit Utang Bank, Kredit Kas</li>
          <li><b>Beban belum dibayar (akrual):</b> "Utang sewa" / "Utang listrik" → Debit Beban Sewa/Listrik, Kredit Utang Sewa/Listrik</li>
          <li><b>Lunasi utang beban:</b> "Bayar utang sewa" / "Bayar utang listrik" → Debit Utang Sewa/Listrik, Kredit Kas</li>
          <li><b>Beli aset tunai:</b> "Beli peralatan" → Debit Peralatan, Kredit Kas</li>
          <li><b>Beli aset kredit:</b> "Beli peralatan utang usaha" → Debit Peralatan, Kredit Utang Usaha</li>
          <li><b>Bayar beban:</b> "Bayar beban listrik" / "Beban gaji karyawan" → Debit Beban terkait, Kredit Kas</li>
          <li><b>Ambil prive:</b> "Ambil kas pribadi" → Debit Prive, Kredit Kas</li>
        </ul>
      </div>
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
  { kode: "103", nama: "Piutang Usaha", kategori: "aset", saldoNormal: "debit", idnama: "piutang" },
  { kode: "104", nama: "Persediaan", kategori: "aset", saldoNormal: "debit", idnama: "persediaan" },
  { kode: "105", nama: "Peralatan", kategori: "aset", saldoNormal: "debit", idnama: "peralatan" },
 { kode: "106", nama: "Perlengkapan", kategori: "aset", saldoNormal: "debit", idnama: "perlengkapan" },

  { kode: "201", nama: "Utang Usaha", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang usaha" },
  { kode: "202", nama: "Utang Bank", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang bank" },
  { kode: "203", nama: "Utang Sewa", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang sewa" },
  { kode: "204", nama: "Utang Listrik", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang listrik" },
  { kode: "205", nama: "Utang Gaji", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang gaji" },
  { kode: "206", nama: "Utang Air", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang air" },
  { kode: "207", nama: "Utang Internet", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang internet" },
  { kode: "208", nama: "Utang Telepon", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang telepon" },

  { kode: "301", nama: "Modal", kategori: "ekuitas", saldoNormal: "kredit", idnama: "modal" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "prive" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "ambil kas" },
  { kode: "302", nama: "Prive", kategori: "ekuitas", saldoNormal: "kredit", idnama: "pribadi" },
  { kode: "303", nama: "Laba Ditahan", kategori: "ekuitas", saldoNormal: "kredit", idnama: "laba ditahan" },

  { kode: "401", nama: "Penjualan", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan" },
  { kode: "402", nama: "Pendapatan Lainnya", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan lainnya" },

  { kode: "501", nama: "Beban Gaji", kategori: "beban", saldoNormal: "debit", idnama: "bayar gaji" },
  { kode: "501", nama: "Beban Gaji", kategori: "beban", saldoNormal: "debit", idnama: "beban gaji" },

  { kode: "502", nama: "Beban Listrik", kategori: "beban", saldoNormal: "debit", idnama: "bayar listrik" },
  { kode: "502", nama: "Beban Listrik", kategori: "beban", saldoNormal: "debit", idnama: "beban listrik" },

  { kode: "503", nama: "Beban Air", kategori: "beban", saldoNormal: "debit", idnama: "bayar air" },
  { kode: "503", nama: "Beban Air", kategori: "beban", saldoNormal: "debit", idnama: "beban air" },

  { kode: "504", nama: "Beban Internet", kategori: "beban", saldoNormal: "debit", idnama: "bayar internet" },
  { kode: "504", nama: "Beban Internet", kategori: "beban", saldoNormal: "debit", idnama: "beban internet" },

  { kode: "505", nama: "Beban Sewa", kategori: "beban", saldoNormal: "debit", idnama: "bayar sewa" },
  { kode: "505", nama: "Beban Sewa", kategori: "beban", saldoNormal: "debit", idnama: "beban sewa" },

  { kode: "506", nama: "Beban Telepon", kategori: "beban", saldoNormal: "debit", idnama: "bayar telepon" },
  { kode: "506", nama: "Beban Telepon", kategori: "beban", saldoNormal: "debit", idnama: "beban telepon" },

  { kode: "507", nama: "Beban Transportasi", kategori: "beban", saldoNormal: "debit", idnama: "bayar transportasi" },
  { kode: "507", nama: "Beban Transportasi", kategori: "beban", saldoNormal: "debit", idnama: "beban transportasi" },

  { kode: "508", nama: "Beban Perlengkapan", kategori: "beban", saldoNormal: "debit", idnama: "beban perlengkapan" },
  { kode: "508", nama: "Beban Perlengkapan", kategori: "beban", saldoNormal: "debit", idnama: "pemakaian perlengkapan" },

  { kode: "509", nama: "Beban Iklan", kategori: "beban", saldoNormal: "debit", idnama: "bayar iklan" },
  { kode: "509", nama: "Beban Iklan", kategori: "beban", saldoNormal: "debit", idnama: "beban iklan" },

  { kode: "510", nama: "Beban Perawatan", kategori: "beban", saldoNormal: "debit", idnama: "bayar perawatan" },
  { kode: "510", nama: "Beban Perawatan", kategori: "beban", saldoNormal: "debit", idnama: "beban perawatan" },

  { kode: "511", nama: "Beban Penyusutan", kategori: "beban", saldoNormal: "debit", idnama: "beban penyusutan" },

  { kode: "512", nama: "Beban Asuransi", kategori: "beban", saldoNormal: "debit", idnama: "bayar asuransi" },
  { kode: "512", nama: "Beban Asuransi", kategori: "beban", saldoNormal: "debit", idnama: "beban asuransi" },

  { kode: "513", nama: "Beban Lain-lain", kategori: "beban", saldoNormal: "debit", idnama: "beban lain-lain" },
];

// ===============================
// UTANG BEBAN (BEBAN AKRUAL - BELUM DIBAYAR)
// Contoh: "utang sewa" → Debit Beban Sewa, Kredit Utang Sewa
// ===============================
const UTANG_BEBAN_RULES = [
  { key: "utang sewa", beban: "Beban Sewa", utang: "Utang Sewa" },
  { key: "utang listrik", beban: "Beban Listrik", utang: "Utang Listrik" },
  { key: "utang gaji", beban: "Beban Gaji", utang: "Utang Gaji" },
  { key: "utang air", beban: "Beban Air", utang: "Utang Air" },
  { key: "utang internet", beban: "Beban Internet", utang: "Utang Internet" },
  { key: "utang telepon", beban: "Beban Telepon", utang: "Utang Telepon" },
];

function detectUtangBeban(text) {
  return UTANG_BEBAN_RULES.find(r => text.includes(r.key)) || null;
}

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

  // ✅ PENJUALAN PIUTANG / KREDIT → AKUN UTAMA = PIUTANG USAHA
  if (
    (text.includes("piutang") || text.includes("kredit")) &&
    (text.includes("penjualan") || text.includes("jual"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Piutang Usaha");
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

  // 🔴 BAYAR UTANG (pelunasan utang)
  if (text.includes("bayar utang bank")) {
    return AKUN_RULES.find(a => a.nama === "Utang Bank");
  }

  const bayarUtangBeban = UTANG_BEBAN_RULES.find(r => text.includes("bayar " + r.key));
  if (bayarUtangBeban) {
    return AKUN_RULES.find(a => a.nama === bayarUtangBeban.utang);
  }

  if (text.includes("bayar utang")) {
    return AKUN_RULES.find(a => a.nama === "Utang Usaha");
  }

  // 🟠 UTANG BEBAN (AKRUAL - BEBAN BELUM DIBAYAR)
  // Contoh: "utang sewa", "utang listrik" → akun utama = Beban terkait
  const utangBeban = detectUtangBeban(text);
  if (utangBeban) {
    return AKUN_RULES.find(a => a.nama === utangBeban.beban);
  }

  if (
    text.includes("bayar piutang") ||
    text.includes("terima piutang") ||
    text.includes("pelunasan piutang")
  ) {
    return AKUN_RULES.find(a => a.nama === "Piutang Usaha");
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


// Menentukan akun kas yang dipakai berdasarkan pilihan Metode (Tunai / Non Tunai)
function getKasAccount(metode) {
  return metode === "non-tunai"
    ? AKUN_RULES.find(a => a.nama === "Kas Bank")
    : AKUN_RULES.find(a => a.nama === "Kas");
}

function detectAkunLawan(akunUtama, keterangan, metode = "tunai") {
  const text = keterangan.toLowerCase();
  const kas = getKasAccount(metode);

  // 🔥🔥 1. PENJUALAN PIUTANG (PALING ATAS)
  if (
    akunUtama.nama === "Piutang Usaha" &&
    (text.includes("penjualan") || text.includes("jual"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Penjualan");
  }

  // 🔥 2. PEMBELIAN ASET SECARA UTANG (BUKAN PIUTANG)
  if (
    akunUtama.kategori === "aset" &&
    akunUtama.nama !== "Kas" &&
    akunUtama.nama !== "Kas Bank" &&
    akunUtama.nama !== "Piutang Usaha" && // ⬅️ INI PENTING
    (text.includes("utang usaha") || text.includes("utang"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Utang Usaha");
  }

  // 🔴 3. SETOR MODAL
  if (
    (akunUtama.nama === "Kas" || akunUtama.nama === "Kas Bank") &&
    (text.includes("setor") || text.includes("modal"))
  ) {
    return AKUN_RULES.find(a => a.nama === "Modal");
  }

  // 🔴 4. BAYAR UTANG (semua jenis liabilitas yang dilunasi)
  if (akunUtama.kategori === "liabilitas") {
    return kas;
  }

  // 🟠 4b. UTANG BEBAN (AKRUAL - BEBAN BELUM DIBAYAR)
  // Contoh: "utang sewa" → akunUtama = Beban Sewa, akunLawan = Utang Sewa
  const utangBeban = detectUtangBeban(text);
  if (utangBeban && akunUtama.nama === utangBeban.beban) {
    return AKUN_RULES.find(a => a.nama === utangBeban.utang);
  }

  // 🔵 5. TERIMA PIUTANG
  if (akunUtama.nama === "Piutang Usaha") {
    return kas;
  }

  // 🔵 6. PENDAPATAN & BEBAN
  if (akunUtama.kategori === "pendapatan" || akunUtama.kategori === "beban") {
    return kas;
  }

  // 🟢 7. ASET SELAIN KAS
  if (akunUtama.kategori === "aset" && akunUtama.nama !== "Kas" && akunUtama.nama !== "Kas Bank") {
    return kas;
  }

  // 🟣 8. EKUITAS
  if (akunUtama.kategori === "ekuitas") {
    return kas;
  }

  // 🟡 DEFAULT
  return kas;
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
      "Gunakan kata kunci akun seperti:\n" +
      "- kas, kas bank, piutang, persediaan, peralatan, perlengkapan\n" +
      "- utang usaha, utang bank, utang sewa, utang listrik, utang gaji, utang air, utang internet, utang telepon\n" +
      "- modal, prive\n" +
      "- penjualan\n" +
      "- beban gaji, beban listrik, beban air, beban internet, beban sewa,\n" +
      "  beban telepon, beban transportasi, beban perlengkapan, beban iklan,\n" +
      "  beban perawatan, beban penyusutan, beban asuransi, beban lain-lain\n\n" +
      "Contoh: 'Bayar utang usaha', 'Bayar beban listrik', 'Penjualan piutang'"
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
    akunLawan: detectAkunLawan(akunUtama, keterangan.value, metode.value),
    metode: metode.value,
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

