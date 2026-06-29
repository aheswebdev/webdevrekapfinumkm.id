// ===============================
// LAPORAN LABA RUGI
// ===============================
function renderLabaRugi() {
  const app = document.getElementById("app");

  // ===============================
  // DATA TRANSAKSI UMUM
  // ===============================
  const data = getInputTransaksi();

  let totalPendapatan = 0;
  let totalBeban = 0;

  data.forEach(transaksi => {
    const { debit, kredit } = tentukanDebitKredit(transaksi);

    // Pendapatan → saldo normal kredit
    if (kredit.kategori === "pendapatan") {
      totalPendapatan += transaksi.jumlah;
    }

    // Beban → saldo normal debit
    if (debit.kategori === "beban") {
      totalBeban += transaksi.jumlah;
    }
  });

  // ===============================
  // HITUNG PENYESUAIAN LANGSUNG
  // ===============================
  const totalPenyesuaian = Number(
    localStorage.getItem("total_penyesuaian") || 0
  );
  

  // gabungkan ke pendapatan
  totalPendapatan += totalPenyesuaian;


  // ===============================
  // HITUNG LABA BERSIH
  // ===============================
  const labaBersih = totalPendapatan - totalBeban;

  // ===============================
  // RENDER UI
  // ===============================
  app.innerHTML = `
    <section class="card laba-rugi-card">
      <h2>Laporan Laba Rugi</h2>

      <table class="table laba-rugi-table">
        <tr>
          <th>Penyesuaian</th>
          <th class="text-right">${formatRupiah(totalPenyesuaian)}</th>
        </tr>

        <tr>
          <th>Total Pendapatan</th>
          <th class="text-right">${formatRupiah(totalPendapatan)}</th>
        </tr>

        <tr>
          <th>Total Beban</th>
          <th class="text-right">${formatRupiah(totalBeban)}</th>
        </tr>

        <tr class="highlight">
          <th>Laba Bersih</th>
          <th class="text-right">${formatRupiah(labaBersih)}</th>
        </tr>

        

      </table>
    </section>
  `;
}
