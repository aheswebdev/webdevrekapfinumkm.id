function renderDatabase() {
  const app = document.getElementById("app");
  const transaksi = getInputTransaksi();

  if (transaksi.length === 0) {
    app.innerHTML = `
      <section class="card">
        <h2>Database Transaksi</h2>
        <p>Belum ada data transaksi.</p>
      </section>
    `;
    return;
  }

  let rows = "";
  transaksi.forEach(function(t, index) {
    const { debit, kredit } = tentukanDebitKredit(t);
    rows += `
      <tr>
        <td rowspan="2">${index + 1}</td>
        <td rowspan="2">${formatTanggal(t.tanggal)}</td>
        <td>${debit.kode}</td>
        <td rowspan="2">${t.keterangan}</td>
        <td>${capitalize(debit.nama)}</td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
        <td></td>
        <td rowspan="2" class="delete-cell"
            onclick="deleteDatabaseTransaksi('${t.id}')"
            title="Hapus">
          🗑️
        </td>
      </tr>
      <tr>
        <td>${kredit.kode}</td>
        <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
        <td></td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
      </tr>
    `;
  });

  app.innerHTML = `
    <section class="cardDatabase">
      <h2>Database Transaksi</h2>
      <div class="database-actions">
        <button class="btn-delete-all" onclick="deleteAllDatabaseTransaksi()">
          🗑️ Hapus Semua Transaksi
        </button>
        <button class="btn-download" onclick="downloadDatabasePDF()">
          📥 Download Mutasi Transaksi
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>No</th><th>Tanggal</th><th>Kode</th><th>Keterangan</th>
            <th>Akun</th><th class="text-right">Debit</th>
            <th class="text-right">Kredit</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

// ===============================
// STATE HAPUS
// ===============================
var transaksiYangDihapus = null;
var modeDelete = "single";

function deleteDatabaseTransaksi(id) {
  var data = getInputTransaksi();
  var transaksi = data.find(function(t) { return t.id === id; });
  if (!transaksi) return;

  var yakin = confirm(
    "Yakin ingin menghapus transaksi ini?\n\n" +
    "Tanggal    : " + formatTanggal(transaksi.tanggal) + "\n" +
    "Keterangan : " + transaksi.keterangan + "\n" +
    "Jumlah     : " + formatRupiah(transaksi.jumlah)
  );
  if (!yakin) return;

  modeDelete = "single";
  transaksiYangDihapus = transaksi;
  bukaModalPassword();
}

function deleteAllDatabaseTransaksi() {
  var data = getInputTransaksi();
  if (data.length === 0) { alert("Tidak ada transaksi untuk dihapus."); return; }

  var yakin = confirm(
    "⚠️ PERINGATAN!\n\nAnda akan menghapus SEMUA transaksi.\n" +
    "Jumlah data: " + data.length + "\n\nTindakan ini tidak dapat dibatalkan.\n\nLanjutkan?"
  );
  if (!yakin) return;

  modeDelete = "all";
  transaksiYangDihapus = null;
  bukaModalPassword();
}

function bukaModalPassword() {
  var input = document.getElementById("passwordInput");
  var modal = document.getElementById("passwordModal");
  if (!input || !modal) return;
  input.value = "";
  modal.classList.remove("hidden");
  input.focus();
}

function batalPassword() {
  transaksiYangDihapus = null;
  modeDelete = "single";
  var modal = document.getElementById("passwordModal");
  if (modal) modal.classList.add("hidden");
}

function submitPassword() {
  var inputEl  = document.getElementById("passwordInput");
  var password = inputEl ? inputEl.value.trim() : "";

  var username = localStorage.getItem("username");
  var savedPassword = "";
  try {
    var users = JSON.parse(localStorage.getItem("keuanganUMKM_users")) || {};
    if (users[username] && users[username].password) {
      savedPassword = users[username].password;
    }
  } catch(e) { savedPassword = ""; }

  if (!password) { alert("Password tidak boleh kosong."); return; }

  if (password !== savedPassword) {
    alert("❌ Password salah. Data tidak dihapus.");
    if (inputEl) { inputEl.value = ""; inputEl.focus(); }
    return;
  }

  if (modeDelete === "single" && transaksiYangDihapus) {
    var filtered = getInputTransaksi().filter(function(t) {
      return t.id !== transaksiYangDihapus.id;
    });
    saveInputTransaksiForUser(filtered);
    batalPassword();
    renderDatabase();
    alert("✅ Transaksi berhasil dihapus.");
  } else if (modeDelete === "all") {
    saveInputTransaksiForUser([]);
    batalPassword();
    renderDatabase();
    alert("✅ Semua transaksi berhasil dihapus.");
  }
}

// ===============================
// DOWNLOAD PDF — GAYA MUTASI BANK / E-STATEMENT
// ===============================
function downloadDatabasePDF() {
  try {
    var transaksi = getInputTransaksi();
    if (transaksi.length === 0) { alert("Tidak ada data untuk di-download."); return; }
    if (typeof window.jspdf === "undefined") { alert("Library PDF tidak ditemukan. Silakan refresh halaman."); return; }

    var { jsPDF } = window.jspdf;
    var doc       = new jsPDF("portrait", "mm", "a4");
    var pw        = doc.internal.pageSize.getWidth();   // 210
    var ph        = doc.internal.pageSize.getHeight();  // 297
    var ml        = 12; // margin left
    var mr        = 12; // margin right
    var cw        = pw - ml - mr; // content width
    var username  = localStorage.getItem("username") || "-";
    var now       = new Date();

    // No. dokumen unik, seperti referensi pada e-statement bank
    var noDokumen = "STMT/" + username.toUpperCase().replace(/\s+/g, "") + "/" +
      now.toISOString().slice(0, 10).replace(/-/g, "") + "/" +
      String(now.getTime()).slice(-5);
    
    // Nomor nasabah
    var noNasabah = "ACC" + String(now.getTime()).slice(-8);

    var fmtTgl = function(d) {
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    };
    
    var fmtTglFull = function(d) {
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    };

    // ── urutkan transaksi berdasarkan tanggal (ascending) ─────
    var sorted = transaksi.slice().sort(function(a, b) {
      return new Date(a.tanggal) - new Date(b.tanggal);
    });

    var tsList  = transaksi.map(function(t){ return new Date(t.tanggal).getTime(); });
    var tglAwal  = new Date(Math.min.apply(null, tsList));
    var tglAkhir = new Date(Math.max.apply(null, tsList));

    // ── hitung kas masuk / kas keluar & saldo berjalan ────────
    var saldoAwal = 0;
    var kasIn = 0, kasOut = 0;
    var kategoriMap = {}; // rekap per kategori akun (untuk ringkasan double-entry)

    sorted.forEach(function(t) {
      var dk = tentukanDebitKredit(t);
      var isKasMasuk  = dk.debit.nama  === "Kas" || dk.debit.nama  === "Kas Bank";
      var isKasKeluar = dk.kredit.nama === "Kas" || dk.kredit.nama === "Kas Bank";
      if (isKasMasuk)  kasIn  += t.jumlah;
      if (isKasKeluar) kasOut += t.jumlah;

      if (!kategoriMap[dk.debit.kategori])  kategoriMap[dk.debit.kategori]  = { debit: 0, kredit: 0 };
      if (!kategoriMap[dk.kredit.kategori]) kategoriMap[dk.kredit.kategori] = { debit: 0, kredit: 0 };
      kategoriMap[dk.debit.kategori].debit   += t.jumlah;
      kategoriMap[dk.kredit.kategori].kredit += t.jumlah;
    });
    var saldoAkhir = saldoAwal + kasIn - kasOut;

    // ── warna tema ────────────────────────────────────────────
    var BIRU   = [0, 51, 102];   // biru gelap ala mutasi bank
    var BIRU_MUDA = [0, 102, 204];
    var BIRU_CERAH = [25, 118, 210];
    var ABU    = [245, 247, 250];
    var ABU2   = [230, 234, 240];
    var ABU3   = [220, 225, 235];
    var HITAM  = [30, 30, 30];
    var PUTIH  = [255, 255, 255];
    var HIJAU  = [0, 130, 70];
    var MERAH  = [200, 30, 30];
    var ORANGE = [255, 140, 0];

    // ──────────────────────────────────────────────────────────
    // HEADER — KOP BANK STYLE
    // ──────────────────────────────────────────────────────────
    doc.setFillColor.apply(doc, BIRU);
    doc.rect(0, 0, pw, 50, "F");

    // Judul utama
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, PUTIH);
    doc.text("LAPORAN MUTASI REKENING", ml, 16);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 220, 255);
    doc.text("APLIKASI KEUANGAN UMKM — Sistem Manajemen Kas dan Keuangan", ml, 23);

    // Informasi dokumen mini (kiri bawah)
    doc.setFontSize(7);
    doc.setTextColor(180, 200, 240);
    doc.setFont("helvetica", "normal");
    doc.text("No. Dokumen: " + noDokumen, ml, 31);
    doc.text("Dicetak: " + fmtTglFull(now), ml, 36);
    
    // Info di sebelah kanan header
    var infoRx = pw - mr - 60;
    doc.setFontSize(7);
    doc.setTextColor(180, 200, 240);
    doc.setFont("helvetica", "normal");
    doc.text("No. Nasabah / Pemilik:", infoRx, 31);
    doc.setFont("helvetica", "bold");
    doc.text(noNasabah, infoRx, 36);
    
    // Garis tebal bawah header
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.2);
    doc.line(0, 50, pw, 50);

    // ──────────────────────────────────────────────────────────
    // IDENTITAS PEMILIK & REKENING (lebih lengkap)
    // ──────────────────────────────────────────────────────────
    var y = 56;
    
    // Box info pemilik
    doc.setFillColor.apply(doc, ABU);
    doc.roundedRect(ml, y, cw, 24, 2, 2, "F");
    doc.setDrawColor(180, 185, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(ml, y, cw, 24, 2, 2, "S");

    var colW = cw / 4;
    
    // Kolom 1 — Nama Pemilik
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("NAMA PEMILIK / NASABAH", ml + 3, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.setFontSize(8);
    doc.text(username.toUpperCase(), ml + 3, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("(UMKM)", ml + 3, y + 16);
    doc.text("Mata Uang: IDR (Rupiah)", ml + 3, y + 21);

    // Kolom 2 — Tipe Rekening & Status
    var col2X = ml + colW + 3;
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("TIPE REKENING", col2X, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.setFontSize(8);
    doc.text("Buku Kas / Mutasi", col2X, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("Status: AKTIF", col2X, y + 16);
    doc.text("Jenis: Laporan Keuangan", col2X, y + 21);

    // Kolom 3 — Periode & Jumlah Transaksi
    var col3X = ml + colW * 2 + 3;
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("PERIODE LAPORAN", col3X, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.setFontSize(8);
    doc.text(fmtTgl(tglAwal), col3X, y + 11);
    doc.text("s.d.", col3X, y + 14.5);
    doc.text(fmtTgl(tglAkhir), col3X, y + 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("Total: " + transaksi.length + " transaksi", col3X, y + 21);

    // Kolom 4 — Total Debit/Kredit
    var col4X = ml + colW * 3 + 3;
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("TOTAL PERIODE", col4X, y + 5);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 130, 70);
    doc.text("Masuk: " + rupiahPDF(kasIn), col4X, y + 11);
    
    doc.setTextColor(200, 30, 30);
    doc.text("Keluar: " + rupiahPDF(kasOut), col4X, y + 16);
    
    doc.setTextColor(0, 68, 148);
    doc.setFont("helvetica", "bold");
    doc.text("Bersih: " + rupiahPDF(saldoAkhir), col4X, y + 21);

    // ──────────────────────────────────────────────────────────
    // RINGKASAN SALDO — DESTAK UTAMA BANK STYLE
    // ──────────────────────────────────────────────────────────
    y += 28;
    
    // Background box
    doc.setFillColor.apply(doc, BIRU_CERAH);
    doc.roundedRect(ml, y, cw, 22, 2, 2, "F");
    doc.setFillColor(210, 235, 255);
    doc.roundedRect(ml + 1, y + 1, cw - 2, 20, 1, 1, "F");

    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("RINGKASAN POSISI SALDO", ml + 4, y + 4);

    // Saldo Awal
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Saldo Awal", ml + 4, y + 10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 148);
    doc.text(rupiahPDF(saldoAwal), ml + 4, y + 16);

    // Kas Masuk
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("+ Kas Masuk", ml + cw * 0.27, y + 10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 130, 70);
    doc.text(rupiahPDF(kasIn), ml + cw * 0.27, y + 16);

    // Kas Keluar
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("- Kas Keluar", ml + cw * 0.52, y + 10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 30, 30);
    doc.text(rupiahPDF(kasOut), ml + cw * 0.52, y + 16);

    // Saldo Akhir (MENONJOL)
    doc.setFillColor(0, 68, 148);
    doc.roundedRect(ml + cw * 0.72, y + 7, cw * 0.24, 12, 2, 2, "F");
    
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 255);
    doc.text("SALDO AKHIR", ml + cw * 0.73, y + 10);
    doc.setFontSize(8.8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    var saldoAkhirX = ml + cw * 0.72 + (cw * 0.24) / 2;
    doc.text(rupiahPDF(saldoAkhir), saldoAkhirX, y + 16.5, { align: "center", maxWidth: cw * 0.22 });

    // ──────────────────────────────────────────────────────────
    // TABEL MUTASI DETAIL
    // ──────────────────────────────────────────────────────────
    y += 28;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("RINCIAN MUTASI TRANSAKSI", ml, y + 3);
    doc.setLineWidth(0.8);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(ml, y + 5, ml + 70, y + 5);
    y += 8;

    // Buat data tabel — satu baris per transaksi (ringkas seperti mutasi bank)
    var saldoBerjalan = saldoAwal;
    var tableRows = [];

    sorted.forEach(function(t, i) {
      var dk = tentukanDebitKredit(t);
      var isKasMasuk  = dk.debit.nama  === "Kas" || dk.debit.nama  === "Kas Bank";
      var isKasKeluar = dk.kredit.nama === "Kas" || dk.kredit.nama === "Kas Bank";
      var debitCell   = isKasMasuk  ? rupiahPDF(t.jumlah) : "";
      var kreditCell  = isKasKeluar ? rupiahPDF(t.jumlah) : "";
      var netKas      = isKasMasuk ? t.jumlah : isKasKeluar ? -t.jumlah : 0;
      saldoBerjalan  += netKas;

      // Nomor referensi unik per transaksi (mirip kode referensi mutasi bank)
      var refRaw = (t.id || "").split("-")[1] || String(i + 1);
      var ref    = "REF" + refRaw.slice(-5);

      // Jenis transaksi untuk info
      var jenisTxn = isKasMasuk ? "DEBIT" : isKasKeluar ? "KREDIT" : "TF";
      var akunLabel = capitalize(dk.debit.nama) + " / " + capitalize(dk.kredit.nama);

      tableRows.push([
        (i + 1).toString(),
        formatTanggal(t.tanggal),
        ref,
        jenisTxn,
        t.keterangan,
        akunLabel,
        debitCell,
        kreditCell,
        rupiahPDF(saldoBerjalan)
      ]);
    });

    // Baris total
    tableRows.push([
      { content: "", colSpan: 6, styles: { fillColor: [230, 234, 240] } },
      { content: rupiahPDF(kasIn),  styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240], textColor: [0, 130, 70] } },
      { content: rupiahPDF(kasOut), styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240], textColor: [200, 30, 30] } },
      { content: "TOTAL", styles: { halign: "right", fontStyle: "bold", fillColor: [0, 68, 148], textColor: [255, 255, 255] } }
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: ml, right: mr, bottom: 16 },
      head: [[
        { content: "No",        styles: { halign: "center", fontSize: 7 } },
        { content: "Tanggal",   styles: { halign: "center", fontSize: 7 } },
        { content: "Ref",       styles: { halign: "center", fontSize: 7 } },
        { content: "Jenis",     styles: { halign: "center", fontSize: 7 } },
        { content: "Keterangan",styles: { halign: "left",   fontSize: 7 } },
        { content: "Akun",      styles: { halign: "left",   fontSize: 7 } },
        { content: "Debit",     styles: { halign: "right",  fontSize: 7 } },
        { content: "Kredit",    styles: { halign: "right",  fontSize: 7 } },
        { content: "Saldo",     styles: { halign: "right",  fontSize: 7 } }
      ]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: BIRU,
        textColor: PUTIH,
        fontStyle: "bold",
        fontSize: 7.2,
        cellPadding: { top: 3.2, bottom: 3.2, left: 1.8, right: 1.8 },
        halign: "center"
      },
      bodyStyles: {
        fontSize: 6.4,
        valign: "middle",
        cellPadding: { top: 2.2, bottom: 2.2, left: 1.8, right: 1.8 },
        textColor: HITAM,
        overflow: "linebreak"
      },
      alternateRowStyles: { fillColor: [249, 251, 255] },
      columnStyles: {
        0: { cellWidth: 7, halign: "center" },
        1: { cellWidth: 15, halign: "center" },
        2: { cellWidth: 13, halign: "center", fontSize: 6.2, textColor: [110, 110, 110] },
        3: { cellWidth: 10, halign: "center", fontSize: 6.2 },
        4: { cellWidth: 34, halign: "left", fontSize: 6.2 },
        5: { cellWidth: 28, halign: "left", fontSize: 6.2 },
        6: { cellWidth: 18, halign: "right" },
        7: { cellWidth: 18, halign: "right" },
        8: { cellWidth: 22, halign: "right", fontStyle: "bold" }
      },
      didParseCell: function(data) {
        // Warnai kas masuk hijau, kas keluar merah
        if (data.section === "body" && data.column.index === 6 && data.cell.text[0]) {
          data.cell.styles.textColor = HIJAU;
        }
        if (data.section === "body" && data.column.index === 7 && data.cell.text[0]) {
          data.cell.styles.textColor = MERAH;
        }
        // Warnai jenis transaksi
        if (data.section === "body" && data.column.index === 3) {
          var jenis = data.cell.text[0];
          if (jenis === "DEBIT") {
            data.cell.styles.textColor = [0, 130, 70];
            data.cell.styles.fontStyle = "bold";
          } else if (jenis === "KREDIT") {
            data.cell.styles.textColor = [200, 30, 30];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
      didDrawPage: function(data) {
        // Header di setiap halaman baru (selain halaman pertama)
        if (data.pageNumber > 1) {
          doc.setFillColor.apply(doc, BIRU);
          doc.rect(0, 0, pw, 14, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor.apply(doc, PUTIH);
          doc.text("LAPORAN MUTASI REKENING — " + username.toUpperCase(), ml, 9);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(180, 200, 240);
          doc.text("No. Dokumen: " + noDokumen + " | Halaman " + data.pageNumber, pw - mr, 9, { align: "right" });
        }
        // Footer setiap halaman
        var totalPages = doc.internal.getNumberOfPages();
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.3);
        doc.line(ml, ph - 11, pw - mr, ph - 11);
        doc.setFontSize(6);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(120, 120, 120);
        doc.text("Laporan ini dicetak oleh Sistem Keuangan UMKM | " + now.toLocaleString("id-ID"), ml, ph - 8);
        doc.text("Halaman " + data.pageNumber + " dari " + totalPages + " | Berlaku untuk pengarsipan dan referensi internal", ml, ph - 4);
      }
    });

    // ──────────────────────────────────────────────────────────
    // RINGKASAN PER KATEGORI AKUN (rekap mini double-entry)
    // ──────────────────────────────────────────────────────────
    var labelKategori = {
      aset: "Aset", liabilitas: "Liabilitas", ekuitas: "Ekuitas",
      pendapatan: "Pendapatan", beban: "Beban"
    };
    var urutanKategori = ["aset", "liabilitas", "ekuitas", "pendapatan", "beban"];
    var recapRows = urutanKategori
      .filter(function(k) { return kategoriMap[k]; })
      .map(function(k) {
        return [labelKategori[k], rupiahPDF(kategoriMap[k].debit), rupiahPDF(kategoriMap[k].kredit)];
      });
    var grandTotal = transaksi.reduce(function(s, t) { return s + t.jumlah; }, 0);
    recapRows.push([
      { content: "TOTAL AKHIR", styles: { fontStyle: "bold", fillColor: [200, 220, 255], textColor: [0, 68, 148] } },
      { content: rupiahPDF(grandTotal), styles: { halign: "right", fontStyle: "bold", fillColor: [200, 220, 255], textColor: [0, 68, 148] } },
      { content: rupiahPDF(grandTotal), styles: { halign: "right", fontStyle: "bold", fillColor: [200, 220, 255], textColor: [0, 68, 148] } }
    ]);

    var ry = doc.lastAutoTable.finalY + 8;
    var recapEstHeight = 12 + recapRows.length * 7;
    if (ry + recapEstHeight > ph - 65) { doc.addPage(); ry = 18; }

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("RINGKASAN REKAP PER KATEGORI AKUN", ml, ry + 3);
    doc.setLineWidth(0.8);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(ml, ry + 5, ml + 70, ry + 5);

    doc.autoTable({
      startY: ry + 7,
      margin: { left: ml, right: mr, bottom: 16 },
      head: [[
        { content: "Kategori Akun", styles: { halign: "left", fontSize: 7  } },
        { content: "Total Debit",   styles: { halign: "right", fontSize: 7 } },
        { content: "Total Kredit",  styles: { halign: "right", fontSize: 7 } }
      ]],
      body: recapRows,
      theme: "grid",
      headStyles: {
        fillColor: ABU2, textColor: HITAM, fontStyle: "bold",
        fontSize: 7.2, cellPadding: { top: 2.8, bottom: 2.8, left: 2.8, right: 2.8 }
      },
      bodyStyles: {
        fontSize: 6.6, cellPadding: { top: 2.3, bottom: 2.3, left: 2.8, right: 2.8 }, textColor: HITAM
      },
      columnStyles: {
        0: { cellWidth: cw * 0.44, halign: "left" },
        1: { cellWidth: cw * 0.28, halign: "right" },
        2: { cellWidth: cw * 0.28, halign: "right" }
      }
    });

    // ──────────────────────────────────────────────────────────
    // FOOTER — CATATAN, VALIDASI & TANDA TANGAN
    // ──────────────────────────────────────────────────────────
    var fy = doc.lastAutoTable.finalY + 8;
    if (fy > ph - 60) { doc.addPage(); fy = 18; }

    // Informasi validasi
    doc.setFillColor(245, 250, 255);
    doc.roundedRect(ml, fy, cw, 18, 2, 2, "F");
    doc.setDrawColor(150, 180, 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(ml, fy, cw, 18, 2, 2, "S");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("INFORMASI VALIDASI DOKUMEN", ml + 3, fy + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.text("✓ Dokumen ini dicetak otomatis dari Sistem Aplikasi Keuangan UMKM", ml + 3, fy + 9);
    doc.text("✓ Saldo mencerminkan posisi Kas dan Kas Bank pada periode laporan", ml + 3, fy + 12);
    doc.text("✓ Laporan sah tanpa tanda tangan basah (e-statement elektronik)", ml + 3, fy + 15);

    // Kotak catatan & tanda tangan
    fy += 22;
    doc.setDrawColor.apply(doc, ABU2);
    doc.setLineWidth(0.4);
    doc.setFillColor.apply(doc, ABU);
    doc.roundedRect(ml, fy, cw, 38, 2, 2, "FD");

    // Kiri — catatan
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("KETERANGAN", ml + 4, fy + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor.apply(doc, HITAM);
    doc.setFontSize(6.5);
    var notes = [
      "• Laporan Mutasi menunjukkan setiap transaksi kas masuk dan kas keluar.",
      "• Kolom Saldo menampilkan posisi kas setelah setiap transaksi tercatat.",
      "• Perpaduan Debit-Kredit harus seimbang sesuai prinsip akuntansi ganda.",
      "• Ringkasan per kategori akun menunjukkan distribusi transaksi ke masing-masing akun."
    ];
    notes.forEach(function(n, i) {
      doc.text(n, ml + 4, fy + 13 + i * 5, { maxWidth: cw * 0.55 });
    });

    // Kanan — tanda tangan & cap
    var sigX = pw - mr - 52;
    doc.setFontSize(7.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor.apply(doc, HITAM);
    doc.text("Menyetujui,", sigX, fy + 6.5);
    doc.setFontSize(6.3);
    doc.setTextColor(80, 80, 80);
    doc.text(fmtTglFull(now), sigX, fy + 10.5);
    
    // Kotak TTD
    doc.setDrawColor(0, 68, 148);
    doc.setLineWidth(0.6);
    doc.rect(sigX, fy + 12, 50, 14, "S");
    doc.setLineWidth(0.5);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(sigX, fy + 27, sigX + 50, fy + 27);
    doc.setFontSize(6.8);
    doc.setTextColor(0, 68, 148);
    doc.setFont("helvetica", "bold");
    doc.text("( " + username.toUpperCase() + " )", sigX + 25, fy + 30.2, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Pimpinan / Pemilik UMKM", sigX + 25, fy + 34.0, { align: "center" });

    // ── simpan ────────────────────────────────────────────────
    var nama = "Mutasi_Rekening_" + username + "_" + now.toISOString().slice(0, 10) + ".pdf";
    doc.save(nama);

  } catch (err) {
    console.error("PDF error:", err);
    alert("Gagal membuat PDF.\nError: " + err.message);
  }
}

// helper format rupiah singkat untuk PDF
function rupiahPDF(n) {
  if (!n && n !== 0) return "-";
  return "Rp " + Math.abs(n).toLocaleString("id-ID");
}
