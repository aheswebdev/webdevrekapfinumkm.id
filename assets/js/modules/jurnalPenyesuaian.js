function renderJurnalPenyesuaianPersediaan() {
  const app = document.getElementById("app");
  const transaksi = getInputTransaksi();

  // ===============================
  // 1. DATA OTOMATIS DARI TRANSAKSI
  // ===============================

  // Filter transaksi persediaan
  const dataPersediaan = transaksi.filter(t => {
    const { debit, kredit } = tentukanDebitKredit(t);
    return (
      debit.nama.toLowerCase() === "persediaan" ||
      kredit.nama.toLowerCase() === "persediaan"
    );
  });

  // Filter transaksi peralatan
  const dataPeralatan = transaksi.filter(t => {
    const { debit, kredit } = tentukanDebitKredit(t);
    return (
      debit.nama.toLowerCase() === "peralatan" ||
      kredit.nama.toLowerCase() === "peralatan"
    );
  });

  // Filter transaksi perlengkapan
  const dataPerlengkapan = transaksi.filter(t => {
    const { debit, kredit } = tentukanDebitKredit(t);
    return (
      debit.nama.toLowerCase() === "perlengkapan" ||
      kredit.nama.toLowerCase() === "perlengkapan"
    );
  });

  // Filter transaksi HPP (otomatis dari kata kunci di keterangan)
  const dataHPPOtomatis = transaksi.filter(t => {
    const text = t.keterangan.toLowerCase();
    return text.includes("hpp") || text.includes("pemakaian") || text.includes("penyusutan");
  });

  // Data HPP manual dari localStorage (tetap dipertahankan untuk kompatibilitas)
  const dataHPPManual = JSON.parse(
    localStorage.getItem("penyesuaian_hpp") || "[]"
  );

  // Gabungkan data HPP otomatis + manual
  const dataHPPGabungan = [
    ...dataHPPOtomatis.map(t => ({
      id: t.id || Date.now() + Math.random(),
      tanggal: t.tanggal,
      keterangan: t.keterangan,
      total: t.jumlah,
      akunTarget: t.akunTarget || "Persediaan",
      sumber: "otomatis"
    })),
    ...dataHPPManual.map(t => ({
      ...t,
      sumber: "manual"
    }))
  ];

  // Hapus duplikat berdasarkan id
  const dataHPP = [];
  const seenIds = new Set();
  dataHPPGabungan.forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      dataHPP.push(item);
    }
  });

  // ===============================
  // 2. RENDER TABEL PERSEDIAAN
  // ===============================
  let rowsPersediaan = "";
  let totalPersediaan = 0;

  if (dataPersediaan.length === 0) {
    rowsPersediaan = `<tr><td colspan="7" style="text-align:center;">Belum ada data persediaan</td></tr>`;
  } else {
    dataPersediaan.forEach((t, index) => {
      const { debit, kredit } = tentukanDebitKredit(t);

      if (debit.nama.toLowerCase() === "persediaan") {
        totalPersediaan += t.jumlah;
      }
      if (kredit.nama.toLowerCase() === "persediaan") {
        totalPersediaan -= t.jumlah;
      }

      rowsPersediaan += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>${debit.kode}</td>
          <td rowspan="2">${t.keterangan}</td>
          <td>${capitalize(debit.nama)}</td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
          <td></td>
        </tr>
        <tr>
          <td>${kredit.kode}</td>
          <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 3. RENDER TABEL PERALATAN
  // ===============================
  let rowsPeralatan = "";
  let totalPeralatan = 0;

  if (dataPeralatan.length === 0) {
    rowsPeralatan = `<tr><td colspan="7" style="text-align:center;">Belum ada data peralatan</td></tr>`;
  } else {
    dataPeralatan.forEach((t, index) => {
      const { debit, kredit } = tentukanDebitKredit(t);

      if (debit.nama.toLowerCase() === "peralatan") {
        totalPeralatan += t.jumlah;
      }
      if (kredit.nama.toLowerCase() === "peralatan") {
        totalPeralatan -= t.jumlah;
      }

      rowsPeralatan += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>${debit.kode}</td>
          <td rowspan="2">${t.keterangan}</td>
          <td>${capitalize(debit.nama)}</td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
          <td></td>
        </tr>
        <tr>
          <td>${kredit.kode}</td>
          <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 3b. RENDER TABEL PERLENGKAPAN
  // ===============================
  let rowsPerlengkapan = "";
  let totalPerlengkapan = 0;

  if (dataPerlengkapan.length === 0) {
    rowsPerlengkapan = `<tr><td colspan="7" style="text-align:center;">Belum ada data perlengkapan</td></tr>`;
  } else {
    dataPerlengkapan.forEach((t, index) => {
      const { debit, kredit } = tentukanDebitKredit(t);

      if (debit.nama.toLowerCase() === "perlengkapan") {
        totalPerlengkapan += t.jumlah;
      }
      if (kredit.nama.toLowerCase() === "perlengkapan") {
        totalPerlengkapan -= t.jumlah;
      }

      rowsPerlengkapan += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>${debit.kode}</td>
          <td rowspan="2">${t.keterangan}</td>
          <td>${capitalize(debit.nama)}</td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
          <td></td>
        </tr>
        <tr>
          <td>${kredit.kode}</td>
          <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 4. RENDER TABEL HPP BULANAN (OTOMATIS + MANUAL)
  // ===============================
  let rowsInputHPP = "";
  if (dataHPP.length === 0) {
    rowsInputHPP = `<tr><td colspan="8" style="text-align:center;">Belum ada penyesuaian HPP</td></tr>`;
  } else {
    dataHPP.forEach((t, index) => {
      const akunTarget = t.akunTarget || "Persediaan";
      const kodeAkun = akunTarget === "Peralatan" ? "105" : "113";
      const labelSumber = t.sumber === "otomatis" ? "🔄 Otomatis" : "✏️ Manual";
      rowsInputHPP += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>511</td>
          <td rowspan="2">${t.keterangan} <small>(${labelSumber})</small></td>
          <td>Harga Pokok Penjualan</td>
          <td class="text-right">${formatRupiah(t.total)}</td>
          <td></td>
          <td rowspan="2" class="delete-cell"
            onclick="deleteInputHPP('${t.id}')"
            title="Hapus">
            🗑️
          </td>
        </tr>
        <tr>
          <td>${kodeAkun}</td>
          <td style="padding-left:20px">${akunTarget}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.total)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 5. HITUNG TOTAL
  // ===============================
  const totalAset = totalPeralatan + totalPersediaan + totalPerlengkapan;
  const totalHPP = dataHPP.reduce((sum, item) => sum + item.total, 0);
  const totalPenyesuaian = totalHPP; // sesuai screenshot

  // Simpan total penyesuaian untuk Laba Rugi
  localStorage.setItem("total_penyesuaian", JSON.stringify(totalAset - totalHPP));

  // ===============================
  // 6. RENDER UI
  // ===============================
  app.innerHTML = `
    <section class="card">
      <div class="dashboard-sesuaikan">
        <h3>Total Penyesuaian</h3>
        <p class="amount">${formatRupiah(totalPenyesuaian)}</p>
        <small style="color: #666;">Total HPP</small>
      </div>
    </section>

    <section class="card">
      <h2>Input HPP Manual</h2>
      <form id="inputTransaksiForm" class="form">
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="tanggal" required />
        </div>
        <div class="form-group">
          <label>Keterangan</label>
          <input type="text" id="keterangan" placeholder="Contoh: pemakaian persediaan 1 bulan" required />
          <small style="color: #666;">Masukkan kata "persediaan" atau "peralatan" untuk menentukan akun target.</small>
        </div>
        <div class="form-group">
          <label>Jumlah (Rp)</label>
          <input type="number" id="jumlah" required />
        </div>
        <button type="submit">Simpan</button>
      </form>
      <small style="color: #2563eb;">💡 Atau masukkan transaksi biasa dengan kata "HPP" atau "pemakaian" di keterangan untuk otomatis.</small>
    </section>

    <section class="cardHPP">
      <h2>Jurnal Penyesuaian - Persediaan <small></small></h2>
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Keterangan</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
          </tr>
        </thead>
        <tbody>${rowsPersediaan}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total Persediaan</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalPersediaan)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="cardHPP">
      <h2>Jurnal Penyesuaian - Peralatan <small></small></h2>
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Keterangan</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
          </tr>
        </thead>
        <tbody>${rowsPeralatan}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total Peralatan</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalPeralatan)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="cardHPP">
      <h2>Jurnal Penyesuaian - Perlengkapan <small></small></h2>
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Keterangan</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
          </tr>
        </thead>
        <tbody>${rowsPerlengkapan}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total Perlengkapan</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalPerlengkapan)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="cardTotalAset">
      <h3>Total Aset</h3>
      <p class="amount">${formatRupiah(totalAset)}</p>
    </section>

    <section class="cardHPP">
      <h2>Penyesuaian HPP Bulanan <small></small></h2>
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Keterangan</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>${rowsInputHPP}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total HPP</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalHPP)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>
  `;

  // ===============================
    // ===============================
  // 7. EVENT SUBMIT FORM HPP MANUAL
  // ===============================
  const form = document.getElementById("inputTransaksiForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value.trim();
    const jumlah = Number(document.getElementById("jumlah").value);

    // Tentukan akun target berdasarkan kata kunci di keterangan
    let akunTarget = "Persediaan"; // default
    if (keterangan.toLowerCase().includes("peralatan")) {
      akunTarget = "Peralatan";
    }

    const penyesuaianBaru = {
      id: Date.now().toString(),
      tanggal,
      keterangan,
      total: jumlah,
      akunTarget: akunTarget,
      sumber: "manual"
    };

    // Ambil data lama, tambah baru, dan simpan
    const dataLama = JSON.parse(localStorage.getItem("penyesuaian_hpp") || "[]");
    dataLama.push(penyesuaianBaru);
    localStorage.setItem("penyesuaian_hpp", JSON.stringify(dataLama));

    // Alert dan Refresh UI
    alert("Data penyesuaian HPP berhasil disimpan!");
    renderJurnalPenyesuaianPersediaan(); 
  });
}

// Tambahkan fungsi delete yang dipanggil di baris 150
function deleteInputHPP(id) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    let dataHPP = JSON.parse(localStorage.getItem("penyesuaian_hpp") || "[]");
    dataHPP = dataHPP.filter(item => item.id !== id);
    localStorage.setItem("penyesuaian_hpp", JSON.stringify(dataHPP));
    renderJurnalPenyesuaianPersediaan();
  }
}