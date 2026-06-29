function renderDashboard(isActive = false) {
  const app = document.getElementById("app");
  const data = getInputTransaksi();

  let kasMasuk = 0;
  let kasKeluar = 0;
  let pendapatan = 0;
  let beban = 0;

  data.forEach(t => {
    const { debit, kredit } = tentukanDebitKredit(t);

    // ===============================
    // KAS
    // ===============================
    if (debit.nama === "Kas") {
      kasMasuk += t.jumlah;
    }

    if (kredit.nama === "Kas") {
      kasKeluar += t.jumlah;
    }

    // ===============================
    // LABA RUGI
    // ===============================
    if (kredit.kategori === "pendapatan") {
      pendapatan += t.jumlah;
    }

    if (debit.kategori === "beban") {
      beban += t.jumlah;
    }
  });

  const saldoKas = kasMasuk - kasKeluar;
  const labaBersih = pendapatan - beban;

  app.innerHTML = `
    <section class="card">
      <h2>Dashboard</h2>

      <div class="dashboard-grid">

        <div class="dashboard-item">
          <h3>Saldo Kas</h3>
          <p class="amount">${formatRupiah(saldoKas)}</p>
        </div>

        <div class="dashboard-item">
          <h3>Laba Bersih</h3>
          <p class="amount ${labaBersih >= 0 ? "text-green" : "text-red"}">
            ${formatRupiah(labaBersih)}
          </p>
        </div>

        <div class="dashboard-item ${isActive ? "dashboard-active" : ""}">
          <h3>Jumlah Transaksi</h3>
          <p class="amount">${data.length}</p>
        </div>

      </div>
    </section>
  `;
}
