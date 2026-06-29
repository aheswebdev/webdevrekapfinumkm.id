// ===============================
// LAPORAN ARUS KAS
// ===============================
function renderArusKas() {
  const app = document.getElementById("app");
  const data = getInputTransaksi();

  let kasMasuk = 0;
  let kasKeluar = 0;

  data.forEach(transaksi => {
    const { debit, kredit } = tentukanDebitKredit(transaksi);

    // KAS MASUK → Kas di Debit
    if (debit.nama === "Kas") {
      kasMasuk += transaksi.jumlah;
    }

    // KAS KELUAR → Kas di Kredit
    if (kredit.nama === "Kas") {
      kasKeluar += transaksi.jumlah;
    }
  });

  const saldoKas = kasMasuk - kasKeluar;

  app.innerHTML = `
    <section class="card arus-kas-card">
      <h2>Laporan Arus Kas</h2>

      <table class="table arus-kas-table">
        <tr>
          <th>Kas Masuk</th>
          <th class="text-right">${formatRupiah(kasMasuk)}</th>
        </tr>
        <tr>
          <th>Kas Keluar</th>
          <th class="text-right">${formatRupiah(kasKeluar)}</th>
        </tr>
        <tr>
          <th>Saldo Kas Bersih</th>
          <th class="text-right">${formatRupiah(saldoKas)}</th>
        </tr>
      </table>
    </section>
  `;
}
