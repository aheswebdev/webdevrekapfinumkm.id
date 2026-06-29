// ===============================
// RENDER BUKU BESAR
// ===============================
function renderBukuBesar() {
  const app = document.getElementById("app");
  const jurnal = getInputTransaksi();

  // SORT BERDASARKAN TANGGAL (ASC)
  jurnal.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  
  const bukuBesar = buildBukuBesar(jurnal);

  let html = `<section class="card">
    <h2>Buku Besar</h2>
  `;

  Object.keys(bukuBesar).forEach(akun => {
    html += renderAkunLedger(akun, bukuBesar[akun]);
  });

  html += `</section>`;
  app.innerHTML = html;
}

function buildBukuBesar(jurnal) {
  const ledger = {};

  jurnal.forEach(item => {
    const { tanggal, keterangan, jumlah } = item;

    // pakai logika jurnal
    const { debit, kredit } = tentukanDebitKredit(item);

    // pastikan akun ada di ledger
    [debit, kredit].forEach(akun => {
      if (!ledger[akun.nama]) {
        ledger[akun.nama] = {
          saldoNormal: akun.saldoNormal,
          rows: [],
          saldo: 0
        };
      }
    });

    // DEBIT
    ledger[debit.nama].rows.push({
      tanggal,
      keterangan,
      debit: jumlah,
      kredit: 0
    });

    // KREDIT
    ledger[kredit.nama].rows.push({
      tanggal,
      keterangan,
      debit: 0,
      kredit: jumlah
    });
  });

  return ledger;
}

function renderAkunLedger(namaAkun, akunData) {
  let saldo = 0;

  const rows = akunData.rows.map(item => {
    if (akunData.saldoNormal === "debit") {
      saldo += item.debit - item.kredit;
    } else {
      saldo += item.kredit - item.debit;
    }

    return `
      <tr>
        <td>${formatTanggal(item.tanggal)}</td>
        <td>${item.keterangan}</td>
        <td class="text-right">${item.debit ? formatRupiah(item.debit) : "-"}</td>
        <td class="text-right">${item.kredit ? formatRupiah(item.kredit) : "-"}</td>
        <td class="text-right">${formatRupiah(saldo)}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="cardbukubesar">
      <h3>${namaAkun}</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th>Debit</th>
            <th>Kredit</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
