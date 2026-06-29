function hitungNeracaSaldo() {
  const transaksi = getInputTransaksi();
  const neraca = {};

  transaksi.forEach(t => {
    const { debit, kredit } = tentukanDebitKredit(t);

    // Debit
    if (!neraca[debit.kode]) {
      neraca[debit.kode] = {
        kode: debit.kode,
        nama: debit.nama,
        saldoNormal: debit.saldoNormal,
        debit: 0,
        kredit: 0
      };
    }
    neraca[debit.kode].debit += t.jumlah;

    // Kredit
    if (!neraca[kredit.kode]) {
      neraca[kredit.kode] = {
        kode: kredit.kode,
        nama: kredit.nama,
        saldoNormal: kredit.saldoNormal,
        debit: 0,
        kredit: 0
      };
    }
    neraca[kredit.kode].kredit += t.jumlah;
  });

  return Object.values(neraca);
}

function renderNeracaSaldo() {
  const app = document.getElementById("app");
  const data = hitungNeracaSaldo();

  let totalDebit = 0;
  let totalKredit = 0;

  app.innerHTML = `
    <section class="card neraca-saldo-card">
      <h2>Neraca Saldo</h2>

      <table class="table neraca-saldo-table">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Akun</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Kredit</th>
          </tr>
        </thead>
        <tbody id="neracaSaldoList"></tbody>
        <tfoot>
          <tr>
            <th colspan="2">Total</th>
            <th class="text-right" id="totalDebit"></th>
            <th class="text-right" id="totalKredit"></th>
          </tr>
        </tfoot>
      </table>
    </section>

  `;

  const tbody = document.getElementById("neracaSaldoList");

  data.forEach(a => {
    let d = 0;
    let k = 0;

    if (a.saldoNormal === "debit") {
      d = a.debit - a.kredit;
      totalDebit += d;
    } else {
      k = a.kredit - a.debit;
      totalKredit += k;
    }

    tbody.innerHTML += `
      <tr>
        <td>${a.kode}</td>
        <td>${capitalize(a.nama)}</td>
        <td class="text-right">${d ? formatRupiah(d) : ""}</td>
        <td class="text-right">${k ? formatRupiah(k) : ""}</td>
      </tr>
    `;
  });

  document.getElementById("totalDebit").textContent = formatRupiah(totalDebit);
  document.getElementById("totalKredit").textContent = formatRupiah(totalKredit);
}
window.renderNeracaSaldo = renderNeracaSaldo;
