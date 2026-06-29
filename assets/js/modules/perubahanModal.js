// ===============================
// LAPORAN PERUBAHAN MODAL
// ===============================
function renderPerubahanModal() {
  const app = document.getElementById("app");
  const data = getInputTransaksi();

  let totalPendapatan = 0;
  let totalBeban = 0;
  let modalAwal = 0;
  let tambahanModal = 0;
  let prive = 0;

  data.forEach(transaksi => {
    const { debit, kredit } = tentukanDebitKredit(transaksi);

    // LABA RUGI
    if (kredit.kategori === "pendapatan") {
      totalPendapatan += transaksi.jumlah;
    }

    if (debit.kategori === "beban") {
      totalBeban += transaksi.jumlah;
    }

    // MODAL AWAL atau MODAL BERTAMBAH → Modal di Kredit
    if (kredit.nama === "Modal") {
      if (isModalAwal(transaksi.keterangan)) {
        modalAwal += transaksi.jumlah;
      } else {
        tambahanModal += transaksi.jumlah;
      }
    }

    // PRIVE → Prive di Debit
    if (debit.nama === "Prive") {
      prive += transaksi.jumlah;
    }
  });

  const labaBersih = totalPendapatan - totalBeban;
  const modalAkhir = modalAwal + tambahanModal + labaBersih - prive;

  app.innerHTML = `
    <section class="card perubahan-modal-card">
      <h2>Laporan Perubahan Modal</h2>

      <table class="table perubahan-modal-table">
        <tr>
          <td>Modal Awal</td>
          <td class="text-right">${formatRupiah(modalAwal)}</td>
        </tr>

        <tr>
          <td>Tambahan Modal</td>
          <td class="text-right">${formatRupiah(tambahanModal)}</td>
        </tr>

        <tr>
          <td>Laba Bersih</td>
          <td class="text-right">${formatRupiah(labaBersih)}</td>
        </tr>

        <tr>
          <td>Prive</td>
          <td class="text-right">(${formatRupiah(prive)})</td>
        </tr>

        <tr>
          <th>Modal Akhir</th>
          <th class="text-right">${formatRupiah(modalAkhir)}</th>
        </tr>
      </table>
    </section>
  `;
}

function isModalAwal(keterangan) {
  const text = keterangan.toLowerCase();
  return (
    text.includes("modal awal") ||
    text.includes("awal modal") ||
    text.includes("modalawal") ||
    text.includes("setor modal awal") ||
    text.includes("modal awal masuk")
  );
}
