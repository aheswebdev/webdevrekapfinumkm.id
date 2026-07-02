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
    var ml        = 14; // margin left
    var mr        = 14; // margin right
    var cw        = pw - ml - mr; // content width
    var username  = localStorage.getItem("username") || "-";
    var now       = new Date();

    // No. dokumen unik, seperti referensi pada e-statement bank
    var noDokumen = "STMT/" + username.toUpperCase().replace(/\s+/g, "") + "/" +
      now.toISOString().slice(0, 10).replace(/-/g, "") + "/" +
      String(now.getTime()).slice(-5);

    var fmtTgl = function(d) {
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
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
    var BIRU   = [0, 68, 148];   // biru ala rekening koran
    var BIRU2  = [0, 102, 204];
    var ABU    = [245, 247, 250];
    var ABU2   = [230, 234, 240];
    var HITAM  = [30, 30, 30];
    var PUTIH  = [255, 255, 255];
    var HIJAU  = [0, 130, 70];
    var MERAH  = [200, 30, 30];

    // ──────────────────────────────────────────────────────────
    // HEADER — KOP REKENING KORAN
    // ──────────────────────────────────────────────────────────
    doc.setFillColor.apply(doc, BIRU);
    doc.rect(0, 0, pw, 38, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, PUTIH);
    doc.text("APLIKASI KEUANGAN UMKM", ml, 13);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Laporan Mutasi Rekening / Buku Kas", ml, 20);

    doc.setFontSize(7);
    doc.setTextColor(210, 222, 245);
    doc.text("No. Dokumen: " + noDokumen, ml, 26);

    // Kotak kanan atas — info periode
    doc.setFillColor(0, 50, 120);
    doc.roundedRect(pw - mr - 68, 5, 68, 28, 3, 3, "F");
    doc.setFontSize(7);
    doc.setTextColor.apply(doc, PUTIH);
    doc.setFont("helvetica", "bold");
    doc.text("PERIODE LAPORAN", pw - mr - 64, 12);
    doc.setFont("helvetica", "normal");
    doc.text(fmtTgl(tglAwal) + " – " + fmtTgl(tglAkhir), pw - mr - 64, 18);
    doc.setFont("helvetica", "bold");
    doc.text("Dicetak: " + fmtTgl(now), pw - mr - 64, 25);

    // Garis bawah header
    doc.setDrawColor.apply(doc, BIRU2);
    doc.setLineWidth(0.8);
    doc.line(0, 38, pw, 38);

    // ──────────────────────────────────────────────────────────
    // INFO NASABAH / PEMILIK
    // ──────────────────────────────────────────────────────────
    var y = 44;
    var cardH = 32; // ditambah dari 26 → 32 supaya baris bawah tidak terpotong
    doc.setFillColor.apply(doc, ABU);
    doc.roundedRect(ml, y, cw, cardH, 2, 2, "F");
    doc.setDrawColor.apply(doc, ABU2);
    doc.setLineWidth(0.4);
    doc.roundedRect(ml, y, cw, cardH, 2, 2, "S");

    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");

    // Kolom kiri
    doc.text("Nama Pemilik", ml + 4, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.text(username.toUpperCase(), ml + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Jenis Usaha", ml + 4, y + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.text("UMKM", ml + 4, y + 28);

    // Kolom tengah
    var cx = ml + cw * 0.38;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Total Transaksi", cx, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.text(transaksi.length + " transaksi", cx, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Periode", cx, y + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HITAM);
    doc.text(fmtTgl(tglAwal) + " s.d. " + fmtTgl(tglAkhir), cx, y + 28);

    // Kolom kanan — saldo
    var rx = ml + cw * 0.73;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Total Kas Masuk", rx, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, HIJAU);
    doc.text(rupiahPDF(kasIn), rx, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Total Kas Keluar", rx, y + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, MERAH);
    doc.text(rupiahPDF(kasOut), rx, y + 28);

    // ──────────────────────────────────────────────────────────
    // RINGKASAN SALDO — strip biru
    // ──────────────────────────────────────────────────────────
    y += cardH + 4; // ikut tinggi card + gap 4mm
    doc.setFillColor.apply(doc, BIRU);
    doc.roundedRect(ml, y, cw, 14, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor.apply(doc, PUTIH);
    doc.text("Saldo Awal", ml + 4, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(rupiahPDF(saldoAwal), ml + 4, y + 11);

    doc.setFont("helvetica", "normal");
    doc.text("+ Kas Masuk", ml + cw * 0.28, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(rupiahPDF(kasIn), ml + cw * 0.28, y + 11);

    doc.setFont("helvetica", "normal");
    doc.text("- Kas Keluar", ml + cw * 0.54, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(rupiahPDF(kasOut), ml + cw * 0.54, y + 11);

    doc.setFont("helvetica", "normal");
    doc.text("= Saldo Akhir", ml + cw * 0.78, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 230, 100);
    doc.text(rupiahPDF(saldoAkhir), ml + cw * 0.78, y + 11);

    // ──────────────────────────────────────────────────────────
    // TABEL MUTASI
    // ──────────────────────────────────────────────────────────
    y += 18;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("RINCIAN MUTASI TRANSAKSI", ml, y + 5);
    doc.setLineWidth(0.5);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(ml, y + 7, ml + 72, y + 7);
    y += 11;

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
      var ref    = "RF" + refRaw.slice(-6);

      // Label jenis akun
      var akunLabel = capitalize(dk.debit.nama) + " / " + capitalize(dk.kredit.nama);

      tableRows.push([
        (i + 1).toString(),
        formatTanggal(t.tanggal),
        ref,
        t.keterangan,
        akunLabel,
        debitCell,
        kreditCell,
        rupiahPDF(saldoBerjalan)
      ]);
    });

    // Baris total
    tableRows.push([
      { content: "TOTAL", colSpan: 5, styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240] } },
      { content: rupiahPDF(kasIn),  styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240], textColor: [0, 130, 70] } },
      { content: rupiahPDF(kasOut), styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240], textColor: [200, 30, 30] } },
      { content: rupiahPDF(saldoAkhir), styles: { halign: "right", fontStyle: "bold", fillColor: [0, 68, 148], textColor: [255, 230, 100] } }
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: ml, right: mr, bottom: 14 },
      head: [[
        { content: "No",          styles: { halign: "center" } },
        { content: "Tanggal",     styles: { halign: "center" } },
        { content: "No. Ref",     styles: { halign: "center" } },
        { content: "Keterangan",  styles: { halign: "left"   } },
        { content: "Akun (Debit/Kredit)", styles: { halign: "left" } },
        { content: "Kas Masuk",   styles: { halign: "right"  } },
        { content: "Kas Keluar",  styles: { halign: "right"  } },
        { content: "Saldo",       styles: { halign: "right"  } }
      ]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: BIRU,
        textColor: PUTIH,
        fontStyle: "bold",
        fontSize: 7.5,
        cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
        halign: "center"
      },
      bodyStyles: {
        fontSize: 7.5,
        valign: "middle",
        cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
        textColor: HITAM,
        overflow: "linebreak"
      },
      alternateRowStyles: { fillColor: [249, 251, 255] },
      columnStyles: {
        0: { cellWidth: 7,  halign: "center" },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 18, halign: "center", fontSize: 6.5, textColor: [110, 110, 110] },
        3: { cellWidth: 38 },
        4: { cellWidth: 28, fontSize: 7 },
        5: { cellWidth: 24, halign: "right" },
        6: { cellWidth: 24, halign: "right" },
        7: { cellWidth: 25, halign: "right", fontStyle: "bold" }
      },
      didParseCell: function(data) {
        // Warnai kas masuk hijau, kas keluar merah
        if (data.section === "body" && data.column.index === 5 && data.cell.text[0]) {
          data.cell.styles.textColor = HIJAU;
        }
        if (data.section === "body" && data.column.index === 6 && data.cell.text[0]) {
          data.cell.styles.textColor = MERAH;
        }
      },
      didDrawPage: function(data) {
        // Header di setiap halaman baru (selain halaman pertama)
        if (data.pageNumber > 1) {
          doc.setFillColor.apply(doc, BIRU);
          doc.rect(0, 0, pw, 12, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor.apply(doc, PUTIH);
          doc.text("LAPORAN MUTASI TRANSAKSI — " + username.toUpperCase(), ml, 8);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.text(noDokumen, pw - mr, 8, { align: "right" });
        }
        // Footer setiap halaman
        var totalPages = doc.internal.getNumberOfPages();
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(ml, ph - 9, pw - mr, ph - 9);
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Dicetak otomatis oleh sistem: " + now.toLocaleString("id-ID"), ml, ph - 6);
        doc.text("Halaman " + data.pageNumber + " dari " + totalPages, pw - mr, ph - 6, { align: "right" });
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
      { content: "TOTAL", styles: { fontStyle: "bold", fillColor: [230, 234, 240] } },
      { content: rupiahPDF(grandTotal), styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240] } },
      { content: rupiahPDF(grandTotal), styles: { halign: "right", fontStyle: "bold", fillColor: [230, 234, 240] } }
    ]);

    var ry = doc.lastAutoTable.finalY + 9;
    var recapEstHeight = 12 + recapRows.length * 6.5;
    if (ry + recapEstHeight > ph - 55) { doc.addPage(); ry = 20; }

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("RINGKASAN PER KATEGORI AKUN", ml, ry + 5);
    doc.setLineWidth(0.5);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(ml, ry + 7, ml + 72, ry + 7);

    doc.autoTable({
      startY: ry + 10,
      margin: { left: ml, right: mr, bottom: 14 },
      head: [[
        { content: "Kategori Akun", styles: { halign: "left"  } },
        { content: "Total Debit",   styles: { halign: "right" } },
        { content: "Total Kredit",  styles: { halign: "right" } }
      ]],
      body: recapRows,
      theme: "grid",
      headStyles: {
        fillColor: ABU2, textColor: HITAM, fontStyle: "bold",
        fontSize: 7.5, cellPadding: { top: 3, bottom: 3, left: 3, right: 3 }
      },
      bodyStyles: {
        fontSize: 7.5, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, textColor: HITAM
      },
      columnStyles: {
        0: { cellWidth: cw * 0.4 },
        1: { cellWidth: cw * 0.3, halign: "right" },
        2: { cellWidth: cw * 0.3, halign: "right" }
      }
    });

    // ──────────────────────────────────────────────────────────
    // FOOTER — CATATAN & TANDA TANGAN
    // ──────────────────────────────────────────────────────────
    var fy = doc.lastAutoTable.finalY + 10;
    if (fy > ph - 55) { doc.addPage(); fy = 20; }

    // Kotak catatan & tanda tangan — tinggi 52 supaya TTD muat penuh
    var footerH = 52;
    doc.setDrawColor.apply(doc, ABU2);
    doc.setLineWidth(0.4);
    doc.setFillColor.apply(doc, ABU);
    doc.roundedRect(ml, fy, cw, footerH, 2, 2, "FD");

    // Kiri — catatan
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor.apply(doc, BIRU);
    doc.text("CATATAN", ml + 4, fy + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor.apply(doc, HITAM);
    var notes = [
      "• Laporan ini dicetak dari Aplikasi Keuangan UMKM.",
      "• Saldo mencerminkan posisi Kas dan Kas Bank.",
      "• Total Debit dan Kredit harus selalu seimbang.",
      "• Dokumen sah tanpa tanda tangan basah (cetak otomatis sistem)."
    ];
    notes.forEach(function(n, i) {
      doc.text(n, ml + 4, fy + 16 + i * 7, { maxWidth: cw * 0.55 });
    });

    // Kanan — tanda tangan
    var sigW  = 52;
    var sigX  = pw - mr - sigW - 2; // rata kanan dengan margin
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor.apply(doc, HITAM);
    doc.text("Mengetahui,", sigX, fy + 8);
    doc.text(fmtTgl(now), sigX, fy + 14);
    // Kotak TTD — mulai y+17, tinggi 20
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.rect(sigX, fy + 17, sigW, 20, "S");
    // Garis nama bawah kotak
    doc.setLineWidth(0.5);
    doc.setDrawColor.apply(doc, BIRU);
    doc.line(sigX, fy + 39, sigX + sigW, fy + 39);
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text("( " + username.toUpperCase() + " )", sigX + sigW / 2, fy + 44, { align: "center" });
    doc.text("Pimpinan / Pemilik UMKM",           sigX + sigW / 2, fy + 49, { align: "center" });

    // ── simpan ────────────────────────────────────────────────
    var nama = "Mutasi_Transaksi_" + username + "_" + now.toISOString().slice(0, 10) + ".pdf";
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
