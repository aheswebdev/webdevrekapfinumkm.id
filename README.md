# 📊 HISNA UMKM — Aplikasi Laporan Keuangan UMKM Berbasis Web

> Aplikasi web berbasis client-side untuk pencatatan dan pelaporan keuangan UMKM secara otomatis, menerapkan prinsip akuntansi dasar (double-entry bookkeeping) dengan **deteksi akun otomatis berbasis kata kunci** dari kalimat keterangan transaksi.

**Nama Aplikasi:** HISNA UMKM
**Versi:** 3.0.0.6.2.6
**Tipe Aplikasi:** Single Page Application (SPA) — HTML, CSS, JavaScript (Vanilla JS, tanpa framework)
**Penyimpanan Data:** Browser `localStorage` (client-side storage)
**Dibuat oleh:** M. Zaqi Mubarok & Al-Hisna Esya Sabila
**Kategori Tugas Akhir:** Pengembangan Sistem Informasi Akuntansi Sederhana berbasis Web untuk UMKM

---

## 📑 Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Latar Belakang Masalah](#2-latar-belakang-masalah)
3. [Tujuan Pengembangan Aplikasi](#3-tujuan-pengembangan-aplikasi)
4. [Metodologi & Tahapan Pengembangan Aplikasi](#4-metodologi--tahapan-pengembangan-aplikasi)
5. [Alat Bantu & Aplikasi yang Digunakan Sebelum dan Selama Pengembangan](#5-alat-bantu--aplikasi-yang-digunakan-sebelum-dan-selama-pengembangan)
6. [Ruang Lingkup & Fitur](#6-ruang-lingkup--fitur)
7. [Teknologi yang Digunakan (Tech Stack)](#7-teknologi-yang-digunakan-tech-stack)
8. [Struktur Folder & File](#8-struktur-folder--file)
9. [Arsitektur Aplikasi](#9-arsitektur-aplikasi)
10. [Konsep Akuntansi yang Diterapkan](#10-konsep-akuntansi-yang-diterapkan)
11. [Algoritma Deteksi Akun Otomatis](#11-algoritma-deteksi-akun-otomatis)
12. [Struktur & Skema Data (localStorage)](#12-struktur--skema-data-localstorage)
13. [Penjelasan Detail Setiap File](#13-penjelasan-detail-setiap-file)
14. [Alur Kerja Sistem (Flow Aplikasi)](#14-alur-kerja-sistem-flow-aplikasi)
15. [Modul Laporan Keuangan](#15-modul-laporan-keuangan)
16. [Fitur Export PDF (Mutasi Transaksi)](#16-fitur-export-pdf-mutasi-transaksi)
17. [Cara Instalasi, Menjalankan, dan Menerbitkan (Deploy) Aplikasi](#17-cara-instalasi-menjalankan-dan-menerbitkan-deploy-aplikasi)
18. [Cara Penggunaan Aplikasi](#18-cara-penggunaan-aplikasi)
19. [Pengujian Aplikasi (Black-Box Testing)](#19-pengujian-aplikasi-black-box-testing)
20. [Keamanan & Autentikasi](#20-keamanan--autentikasi)
21. [Keterbatasan Aplikasi](#21-keterbatasan-aplikasi)
22. [Rencana Pengembangan Selanjutnya](#22-rencana-pengembangan-selanjutnya)
23. [Daftar Pustaka / Referensi Teknis](#23-daftar-pustaka--referensi-teknis)
24. [Lampiran A — Daftar Kode Akun (Chart of Accounts)](#24-lampiran-a--daftar-kode-akun-chart-of-accounts)
25. [Lampiran B — Catatan Penulis Asli (Riwayat Pengembangan)](#25-lampiran-b--catatan-penulis-asli-riwayat-pengembangan)

---

## 1. Pendahuluan

HISNA UMKM adalah aplikasi web sederhana yang dibangun untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) mencatat transaksi keuangan sehari-hari dan secara otomatis mengubahnya menjadi laporan keuangan standar (jurnal umum, buku besar, neraca saldo, laba rugi, arus kas, dan perubahan modal).

Dokumen ini disusun agar dapat digunakan langsung sebagai **lampiran teknis pada laporan tugas akhir/skripsi**. Karena itu, penjelasan di dalamnya sengaja dibuat runtut dari hal yang paling dasar — mengapa aplikasi ini dibuat, apa saja yang dipersiapkan sebelum mulai membangun aplikasi, tahapan pengembangannya selangkah demi selangkah — sampai ke detail teknis kode program, agar mudah dijelaskan kembali saat sidang maupun saat menulis Bab Analisis/Perancangan/Implementasi pada laporan.

Aplikasi ini **tidak menggunakan server maupun database eksternal**. Seluruh logika berjalan di sisi klien (di dalam browser pengguna) dan seluruh data disimpan menggunakan `localStorage`, sehingga aplikasi ini cocok dijadikan **prototipe/purwarupa** yang membuktikan konsep (proof of concept) sebelum dikembangkan lebih lanjut ke arsitektur client-server yang lebih lengkap (lihat [Bab 22](#22-rencana-pengembangan-selanjutnya)).

---

## 2. Latar Belakang Masalah

Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia umumnya masih melakukan pencatatan keuangan secara manual (buku tulis/nota) atau menggunakan aplikasi pencatatan kas sederhana tanpa memperhatikan prinsip akuntansi yang baku (debit/kredit, akun, jurnal, buku besar). Beberapa masalah konkret yang sering ditemui:

1. **Tidak ada pemisahan yang jelas antara kas usaha dan kas pribadi**, sehingga pemilik usaha sulit mengetahui posisi keuangan usaha yang sebenarnya.
2. **Pencatatan manual rentan salah hitung dan hilang** (buku catatan basah, sobek, atau terselip), karena semua rekap dilakukan dengan kalkulasi manual.
3. **Pelaku UMKM umumnya tidak memiliki latar belakang akuntansi**, sehingga istilah "debit", "kredit", "akun", atau "jurnal" terasa asing dan sulit diterapkan tanpa bantuan.
4. **Tidak tersedia laporan keuangan yang siap dipakai** untuk keperluan evaluasi usaha, pengajuan pinjaman ke bank/koperasi, maupun pelaporan ke pihak lain (investor, mitra, dinas koperasi & UMKM).
5. Aplikasi pembukuan yang sudah ada di pasaran umumnya **berbayar, berbasis langganan, atau membutuhkan instalasi dan koneksi ke server pihak ketiga**, yang menjadi hambatan bagi pelaku UMKM skala sangat kecil.

Berdasarkan masalah-masalah tersebut, dibutuhkan sebuah sistem pencatatan yang:
- Cukup **sederhana** untuk dipakai orang tanpa latar belakang akuntansi,
- Tetap **benar secara prinsip akuntansi** (double-entry bookkeeping) di belakang layar,
- **Tidak berbayar dan tidak butuh instalasi rumit** (cukup dibuka lewat browser),
- Bisa langsung **menghasilkan laporan keuangan standar** dari input transaksi sehari-hari.

Aplikasi **HISNA UMKM** dibangun untuk menjawab kebutuhan tersebut, dengan menyediakan sistem pencatatan transaksi berbasis **jurnal umum** yang otomatis menghasilkan **buku besar**, **neraca saldo**, **laporan laba rugi**, **laporan arus kas**, dan **laporan perubahan modal**, hanya dari satu input sederhana: *tanggal, keterangan, dan jumlah transaksi*.

Keunikan aplikasi ini terletak pada mekanisme **deteksi otomatis akun debit dan kredit** berdasarkan kata kunci yang terdapat pada kalimat "keterangan" transaksi (lihat [Bab 11](#11-algoritma-deteksi-akun-otomatis)), sehingga pengguna (UMKM) yang tidak memiliki latar belakang akuntansi tetap dapat menghasilkan jurnal yang valid secara prinsip *double-entry bookkeeping* tanpa harus memilih akun secara manual.

---

## 3. Tujuan Pengembangan Aplikasi

### 3.1 Tujuan Umum

Membangun sebuah aplikasi web pencatatan dan pelaporan keuangan sederhana bagi pelaku UMKM yang dapat mengotomatiskan proses penjurnalan akuntansi berbasis kata kunci dari kalimat transaksi, sehingga pengguna tanpa latar belakang akuntansi tetap dapat memperoleh laporan keuangan yang benar secara prinsip debit-kredit.

### 3.2 Tujuan Khusus

1. Memudahkan pelaku UMKM dalam mencatat transaksi keuangan harian tanpa harus memahami istilah debit/kredit secara teknis.
2. Mengotomatisasi proses penjurnalan (jurnal umum) menjadi laporan keuangan turunan (buku besar, neraca saldo, laba rugi, arus kas, perubahan modal), sehingga pengguna tidak perlu menyusun laporan tersebut secara manual satu per satu.
3. Merancang dan mengimplementasikan **algoritma deteksi akun otomatis** berbasis pencocokan kata kunci (*keyword matching*) yang dapat menerjemahkan kalimat keterangan transaksi berbahasa sehari-hari menjadi pasangan akun Debit dan Kredit yang valid.
4. Menyediakan riwayat (histori) transaksi yang dapat diekspor menjadi dokumen PDF profesional menyerupai mutasi rekening/bank statement, untuk keperluan pelaporan/arsip usaha.
5. Menerapkan pemisahan data antar pengguna (multi-user, per-akun) di dalam satu aplikasi, tanpa server, menggunakan mekanisme *key-prefixing* pada `localStorage`.
6. Menjadi studi kasus implementasi logika akuntansi sederhana (*rule-based detection*) ke dalam sistem informasi berbasis web, yang dapat dijelaskan secara akademik sebagai kontribusi tugas akhir/skripsi.
7. Menghasilkan dokumentasi teknis yang lengkap (dokumen ini) sebagai bahan lampiran laporan tugas akhir, mencakup analisis kebutuhan, perancangan, implementasi, dan pengujian.

### 3.3 Manfaat Aplikasi

| Bagi | Manfaat |
|------|---------|
| Pelaku UMKM | Pencatatan keuangan lebih rapi, laporan otomatis, tidak perlu paham istilah akuntansi teknis, gratis dan mudah diakses lewat browser |
| Penulis/Peneliti | Studi kasus nyata penerapan konsep pemrograman web, struktur data, dan logika akuntansi dalam satu sistem terintegrasi, sebagai bahan tugas akhir |
| Akademik/Kampus | Contoh implementasi Sistem Informasi Akuntansi (SIA) sederhana berbasis web yang dapat dikembangkan lebih lanjut oleh mahasiswa lain |

---

## 4. Metodologi & Tahapan Pengembangan Aplikasi

Pengembangan aplikasi HISNA UMKM menggunakan pendekatan **model prototyping (purwarupa)** — dipilih karena kebutuhan aplikasi (aturan deteksi akun, tampilan, dan alur laporan) terus disempurnakan secara bertahap melalui uji coba dan umpan balik langsung, bukan ditetapkan sekali di awal seperti pada model waterfall murni. Setiap iterasi menghasilkan versi yang bisa langsung dicoba di browser, dievaluasi, lalu diperbaiki pada iterasi berikutnya.

### 4.1 Diagram Tahapan Pengembangan

```
 1. Analisis Kebutuhan
        ↓
 2. Perancangan (Desain UI & Struktur Data)
        ↓
 3. Perancangan Logika Akuntansi & Algoritma Deteksi
        ↓
 4. Implementasi/Coding (Prototipe awal)
        ↓
 5. Pengujian Internal (Black-Box Testing) ──┐
        ↓                                     │  (iterasi ulang bila
 6. Evaluasi & Perbaikan (Iterasi) ───────────┘   ditemukan bug/kekurangan)
        ↓
 7. Dokumentasi (README, komentar kode)
        ↓
 8. Deployment / Publikasi (opsional: GitHub Pages/Netlify)
```

### 4.2 Penjelasan Tiap Tahapan

**Tahap 1 — Analisis Kebutuhan.**
Mengidentifikasi masalah pencatatan keuangan UMKM (lihat [Bab 2](#2-latar-belakang-masalah)), menentukan fitur inti yang wajib ada (input transaksi, jurnal umum, buku besar, neraca saldo, laporan laba rugi, arus kas, perubahan modal, export PDF), serta menetapkan batasan sistem (tanpa backend, tanpa multi-currency, berbasis kata kunci bukan AI/NLP penuh).

**Tahap 2 — Perancangan (Desain UI & Struktur Data).**
Merancang tampilan antarmuka (mock-up/wireframe halaman login, dashboard, form input transaksi, dan tabel laporan) serta merancang struktur data yang akan disimpan di `localStorage` (skema akun, skema transaksi, skema pengguna — lihat [Bab 12](#12-struktur--skema-data-localstorage)). Pada tahap ini juga dirancang **Chart of Accounts** (daftar kode akun) yang akan menjadi acuan seluruh transaksi (lihat [Lampiran A](#24-lampiran-a--daftar-kode-akun-chart-of-accounts)).

**Tahap 3 — Perancangan Logika Akuntansi & Algoritma Deteksi.**
Menerjemahkan aturan akuntansi manual (misalnya "bayar tagihan termasuk Debit karena nilai yang digunakan berkurang") menjadi aturan pemrograman berbasis kata kunci. Tahap ini menghasilkan rancangan tiga fungsi inti: `detectAkunUtama`, `detectAkunLawan`, dan `tentukanDebitKredit` (lihat [Bab 11](#11-algoritma-deteksi-akun-otomatis)).

**Tahap 4 — Implementasi/Coding.**
Menulis kode program menggunakan HTML, CSS, dan JavaScript murni (vanilla), dimulai dari kerangka SPA (`app.js` untuk routing dan autentikasi), kemudian modul per modul (Dashboard → Input Transaksi → Buku Besar → Neraca Saldo → Laba Rugi → Arus Kas → Perubahan Modal → Jurnal Penyesuaian → Database/Export PDF).

**Tahap 5 — Pengujian Internal.**
Menguji setiap fitur secara manual di browser (*black-box testing*) — memasukkan berbagai kalimat keterangan transaksi untuk memastikan akun yang terdeteksi sudah benar, memeriksa apakah total Debit dan Kredit selalu seimbang, serta menguji fitur autentikasi, hapus data, dan export PDF (lihat [Bab 19](#19-pengujian-aplikasi-black-box-testing)).

**Tahap 6 — Evaluasi & Perbaikan (Iterasi).**
Bila ditemukan bug atau kalimat transaksi yang tidak terdeteksi dengan benar, aturan pada `AKUN_RULES` atau logika deteksi diperbaiki, lalu diuji ulang. Proses ini berulang (iteratif) selama masa pengembangan — misalnya penambahan akun "Perlengkapan", perbaikan perhitungan `totalAset`, dan perbaikan tampilan responsif di perangkat mobile.

**Tahap 7 — Dokumentasi.**
Menyusun dokumentasi teknis (dokumen README ini) yang menjelaskan latar belakang, arsitektur, algoritma, struktur data, hingga cara penggunaan, agar dapat dipertanggungjawabkan secara akademik sebagai lampiran tugas akhir.

**Tahap 8 — Deployment/Publikasi (opsional).**
Karena aplikasi bersifat *client-side* murni, aplikasi dapat langsung dipublikasikan secara statis (tanpa server backend) melalui layanan hosting statis gratis seperti **GitHub Pages**, **Netlify**, atau **Vercel** (lihat [Bab 17](#17-cara-instalasi-menjalankan-dan-menerbitkan-deploy-aplikasi)).

> **Catatan untuk laporan skripsi:** model prototyping dipilih (bukan waterfall) karena sifat kebutuhan aplikasi ini — terutama daftar kata kunci pada algoritma deteksi akun — baru dapat disempurnakan setelah dicoba dengan berbagai contoh kalimat transaksi nyata, sehingga proses "coding → uji coba → revisi" perlu diulang beberapa kali sebelum aturan dianggap cukup stabil.

---

## 5. Alat Bantu & Aplikasi yang Digunakan Sebelum dan Selama Pengembangan

Sebelum menulis kode program, dibutuhkan beberapa perangkat lunak pendukung untuk perencanaan, penulisan kode, pengelolaan versi, hingga pengujian tampilan. Berikut daftar aplikasi/alat yang digunakan dalam proses pengembangan HISNA UMKM, beserta fungsinya masing-masing:

| No | Aplikasi/Alat | Kategori | Fungsi dalam Pengembangan |
|----|----------------|----------|------------------------------|
| 1 | **Visual Studio Code (VS Code)** | Code Editor | Editor utama untuk menulis dan mengedit kode HTML, CSS, dan JavaScript. Dilengkapi fitur *syntax highlighting*, *auto-complete*, dan ekstensi pendukung. |
| 2 | **Live Server (ekstensi VS Code)** | Development Server | Menjalankan aplikasi secara lokal dengan *auto-reload* setiap kali file disimpan, sehingga perubahan tampilan dapat langsung dilihat di browser tanpa refresh manual. |
| 3 | **Google Chrome / Microsoft Edge (DevTools)** | Browser & Debugging Tool | Menjalankan dan menguji aplikasi, memeriksa tampilan responsif di berbagai ukuran layar (mobile/tablet/desktop), memeriksa isi `localStorage` melalui tab *Application*, serta melacak error JavaScript melalui tab *Console*. |
| 4 | **Figma** *(opsional, tahap perancangan awal)* | Desain UI/UX | Membuat rancangan awal (wireframe/mock-up) tampilan halaman login, dashboard, dan tabel laporan sebelum diterjemahkan ke kode HTML/CSS. |
| 5 | **Git** | Version Control System | Mencatat riwayat perubahan kode (versioning) secara lokal, memudahkan pelacakan perubahan dan pengembalian ke versi sebelumnya bila terjadi kesalahan. |
| 6 | **GitHub** | Remote Repository / Hosting Kode | Menyimpan kode program secara daring (cloud) sebagai cadangan (backup), sekaligus dapat digunakan untuk menerbitkan aplikasi secara gratis melalui **GitHub Pages** (lihat [Bab 17](#17-cara-instalasi-menjalankan-dan-menerbitkan-deploy-aplikasi)). |
| 7 | **draw.io / Miro** *(opsional)* | Diagramming Tool | Membuat diagram alur sistem, diagram arsitektur, dan diagram alir algoritma deteksi akun untuk keperluan dokumentasi/lampiran skripsi. |
| 8 | **Google Fonts & Font Awesome (CDN)** | Aset Visual | Menyediakan jenis huruf (*font* Quicksand) dan kumpulan ikon vektor yang digunakan pada antarmuka aplikasi, dimuat langsung dari CDN tanpa perlu diunduh manual. |
| 9 | **jsPDF & jsPDF-AutoTable (library JS, via CDN)** | Library Pemrograman | Digunakan di dalam kode aplikasi untuk membangkitkan dokumen PDF (fitur export mutasi transaksi) langsung dari browser, tanpa server. |
| 10 | **Python (`http.server`)** *(opsional)* | Local Web Server | Alternatif menjalankan aplikasi secara lokal melalui server sederhana bila tidak menggunakan ekstensi Live Server pada VS Code. |
| 11 | **Claude (Anthropic AI Assistant)** *(alat bantu pengembangan)* | AI Coding Assistant | Digunakan sebagai asisten selama proses pengembangan untuk membantu memperbaiki bug, menyusun ulang (*refactor*) fungsi JavaScript, serta menyusun dokumentasi teknis ini. Penggunaan AI dicantumkan secara transparan sesuai etika akademik (lihat catatan sitasi di bawah). |

### 5.1 Catatan Etika Penggunaan Bantuan AI

Sebagian proses debugging, perbaikan kode, dan penyusunan dokumentasi (README ini) dibantu menggunakan **Claude**, asisten AI dari Anthropic, sebagai *coding assistant* — sebagaimana penggunaan alat bantu pemrograman modern lainnya (mis. GitHub Copilot). Seluruh keputusan akhir mengenai logika akuntansi, struktur aplikasi, dan konten laporan tetap berada di tangan penulis. Disarankan mencantumkan penggunaan alat bantu ini secara eksplisit pada bagian metodologi/ucapan terima kasih laporan tugas akhir, sesuai pedoman etika akademik institusi masing-masing (format sitasi dapat menyesuaikan gaya selingkung kampus, misalnya APA: *Anthropic. (2026). Claude (Large Language Model). https://claude.ai*).

### 5.2 Kebutuhan Perangkat Minimum untuk Pengembangan

| Komponen | Spesifikasi Minimum |
|----------|------------------------|
| Sistem Operasi | Windows / macOS / Linux (semua OS yang dapat menjalankan browser modern) |
| Browser | Google Chrome, Microsoft Edge, atau Firefox versi terbaru |
| Text Editor | VS Code (atau editor kode lain sejenis, seperti Sublime Text) |
| Koneksi Internet | Diperlukan untuk memuat library dari CDN (Font Awesome, Google Fonts, jsPDF) dan untuk sinkronisasi ke GitHub |
| Node.js / Database Server | **Tidak diperlukan** — aplikasi berjalan murni di sisi klien (browser) |

---

## 6. Ruang Lingkup & Fitur

### 6.1 Fitur Autentikasi
- Registrasi akun baru (username & password).
- Login akun.
- Lupa password / reset password (alur dua langkah: verifikasi username, lalu atur ulang password).
- Logout, diakses melalui menu dropdown tiga titik pada header.
- Setiap akun memiliki data transaksi yang terpisah (data terisolasi per-username di `localStorage`).

### 6.2 Fitur Pencatatan Transaksi
- Input transaksi (tanggal, keterangan, jumlah).
- Deteksi otomatis akun utama dan akun lawan dari kalimat keterangan (tanpa perlu memilih akun secara manual dari dropdown).
- Validasi keterangan transaksi (mencegah kalimat yang tidak dikenali sistem, agar tidak menghasilkan jurnal yang salah).
- Filter jurnal umum berdasarkan kategori akun (aset, liabilitas, ekuitas, pendapatan, beban).

### 6.3 Fitur Laporan (Otomatis dari Data Jurnal)
| No | Laporan | Modul |
|----|---------|-------|
| 1 | Dashboard ringkasan (saldo kas, laba bersih, jumlah transaksi) | `Dashboard.js` |
| 2 | Jurnal Umum | `inputTransaksi.js` |
| 3 | Buku Besar (per akun) | `bukuBesar.js` |
| 4 | Neraca Saldo | `neracaSaldo.js` |
| 5 | Laporan Laba Rugi | `labaRugi.js` |
| 6 | Laporan Arus Kas | `arusKas.js` |
| 7 | Laporan Perubahan Modal | `perubahanModal.js` |
| 8 | Jurnal Penyesuaian (Persediaan, Peralatan, Perlengkapan, HPP) | `jurnalPenyesuaian.js` |
| 9 | Database/Histori Transaksi + Export PDF | `Database.js` |

### 6.4 Fitur Manajemen Data
- Hapus 1 transaksi (dengan konfirmasi password).
- Hapus semua transaksi (dengan konfirmasi password).
- Export riwayat transaksi ke **PDF** bergaya mutasi rekening bank/e-statement (kop laporan, info pemilik, ringkasan saldo, tabel rincian, rekap kategori akun, tanda tangan, watermark, nomor halaman).

---

## 7. Teknologi yang Digunakan (Tech Stack)

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Markup | HTML5 | Struktur halaman tunggal (SPA) |
| Styling | CSS3 (custom, `style.css`) | Tema warna biru-ungu, animasi bubble pada halaman login, layout grid/flexbox |
| Logika Aplikasi | JavaScript (Vanilla ES6, tanpa framework) | Manipulasi DOM langsung (`innerHTML`), tidak menggunakan React/Vue/Angular |
| Penyimpanan Data | `localStorage` (Web Storage API) | Data tersimpan di browser pengguna (client-side, tidak ada server/database) |
| Font | Google Fonts — Quicksand | Diambil via CDN |
| Ikon | Font Awesome 5.15.4 | Diambil via CDN |
| Export PDF | **jsPDF** v2.5.1 | Library pembuatan dokumen PDF di sisi client |
| Tabel PDF | **jsPDF-AutoTable** v3.5.31 | Plugin jsPDF untuk membuat tabel otomatis pada PDF |

> Seluruh library eksternal dimuat melalui CDN (`cdnjs.cloudflare.com`), sehingga aplikasi membutuhkan koneksi internet saat pertama kali memuat halaman (kecuali library di-*cache* oleh browser).

### 7.1 Mengapa Memilih Vanilla JavaScript (Tanpa Framework)?

Pemilihan vanilla JavaScript (tanpa React/Vue/Angular) didasarkan pada beberapa pertimbangan yang relevan untuk dijelaskan pada laporan tugas akhir:

1. **Kesederhanaan** — aplikasi tidak memerlukan proses *build/compile* (seperti `npm run build`), sehingga dapat langsung dijalankan dengan membuka `index.html` di browser.
2. **Fokus pembelajaran** — sebagai tugas akhir, pendekatan ini memperlihatkan pemahaman langsung terhadap manipulasi DOM, event handling, dan pengelolaan state tanpa "dibantu" abstraksi framework.
3. **Ringan** — tidak ada dependensi Node.js/`node_modules` yang besar, sehingga ukuran proyek tetap kecil dan mudah dipublikasikan sebagai halaman statis.
4. **Kesesuaian skala proyek** — dengan sekitar 11 modul JavaScript, kompleksitas aplikasi masih dapat dikelola tanpa framework, meskipun untuk pengembangan lebih lanjut (skala lebih besar) penggunaan framework dapat dipertimbangkan (lihat [Bab 22](#22-rencana-pengembangan-selanjutnya)).

---

## 8. Struktur Folder & File

```
HISNA UMKM FIX ZQ V.2.0/
│
├── index.html                     # Entry point aplikasi (satu-satunya halaman HTML)
├── README.md                      # Dokumentasi proyek (file ini)
│
└── assets/
    ├── css/
    │   └── style.css              # Seluruh styling aplikasi (±1700 baris)
    │
    ├── img/
    │   └── tongsampah.png         # Aset gambar (ikon tempat sampah/hapus)
    │
    └── js/
        ├── app.js                 # Inti aplikasi: routing, autentikasi, navigasi SPA
        ├── storage.js              # Helper localStorage (multi-user storage)
        ├── utils.js                # Fungsi utilitas umum (format rupiah, tanggal, validasi)
        │
        └── modules/
            ├── Dashboard.js            # Halaman ringkasan/dashboard
            ├── inputTransaksi.js       # Input transaksi & mesin deteksi akun (jurnal umum)
            ├── bukuBesar.js             # Laporan buku besar per akun
            ├── neracaSaldo.js           # Laporan neraca saldo
            ├── labaRugi.js              # Laporan laba rugi
            ├── arusKas.js               # Laporan arus kas
            ├── perubahanModal.js        # Laporan perubahan modal
            ├── jurnalPenyesuaian.js     # Jurnal penyesuaian (persediaan/peralatan/perlengkapan/HPP)
            └── Database.js              # Histori transaksi + export PDF mutasi
```

**Total modul JavaScript:** 11 file (3 file inti + 9 modul halaman/laporan)

---

## 9. Arsitektur Aplikasi

Aplikasi ini menggunakan pola **SPA sederhana berbasis vanilla JavaScript** dengan konsep *client-side rendering* — seluruh tampilan dirender ulang ke dalam satu kontainer (`<main id="app">`) tergantung menu yang dipilih pengguna, **tanpa reload halaman** dan **tanpa backend/server**.

### 9.1 Diagram Lapisan Aplikasi

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                    │
│   index.html  +  style.css   (struktur & tampilan statis)   │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      APPLICATION LAYER (app.js)               │
│   • checkAuth()         → cek status login                   │
│   • bindLogin()         → event login/register/forgot/logout │
│   • bindNavigation()    → event klik menu navigasi            │
│   • navigateTo(page)    → router sederhana (switch-case)      │
└───────────────────────────┬───────────────────────────────────┘
                            │  memanggil fungsi render*() sesuai menu
┌───────────────────────────▼───────────────────────────────────┐
│                       MODULE LAYER (assets/js/modules/*.js)   │
│  Dashboard │ inputTransaksi │ bukuBesar │ neracaSaldo │       │
│  labaRugi │ arusKas │ perubahanModal │ jurnalPenyesuaian │    │
│  Database (+ export PDF)                                      │
│  → setiap modul: ambil data → olah/hitung → render HTML       │
└───────────────────────────┬───────────────────────────────────┘
                            │  baca/tulis data
┌───────────────────────────▼───────────────────────────────────┐
│                     DATA LAYER (storage.js, localStorage)     │
│   keuanganUMKM_users              → daftar akun pengguna      │
│   input_transaksi_<username>      → transaksi per pengguna    │
│   penyesuaian_hpp                 → data jurnal penyesuaian   │
│   username / isLoggedIn           → status sesi login         │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Pola Routing (Single Page Application)

Navigasi antar "halaman" tidak benar-benar berpindah file HTML, melainkan diatur oleh fungsi `navigateTo(page)` di `app.js` yang memanggil fungsi `render...()` sesuai modul yang dipilih, lalu fungsi tersebut mengganti isi `innerHTML` dari elemen `<main id="app">`:

```javascript
function navigateTo(page) {
  switch (page) {
    case "Dashboard":           renderDashboard(true);                break;
    case "inputTransaksi":      renderInputTransaksi();               break;
    case "bukuBesar":           renderBukuBesar();                    break;
    case "neracaSaldo":         renderNeracaSaldo();                  break;
    case "labaRugi":            renderLabaRugi();                     break;
    case "arusKas":             renderArusKas();                      break;
    case "perubahanModal":      renderPerubahanModal();               break;
    case "jurnalPenyesuaian":   renderJurnalPenyesuaianPersediaan();  break;
    case "Database":            renderDatabase();                     break;
    default:                    renderDashboard(true);
  }
}
```

Pendekatan ini sering disebut **"Vanilla JS Router"** — sederhana, ringan, tanpa dependensi (tidak memakai `react-router`, `vue-router`, dsb.), cocok untuk aplikasi skala kecil-menengah seperti studi kasus UMKM ini.

---

## 10. Konsep Akuntansi yang Diterapkan

Aplikasi ini menerapkan prinsip **akuntansi berpasangan (double-entry bookkeeping)**: setiap transaksi selalu memengaruhi dua sisi akun — **Debit** dan **Kredit** — dengan nilai yang sama besar. Prinsip ini adalah dasar dari seluruh sistem akuntansi modern: jika satu akun bertambah pada sisi Debit, harus ada akun lain yang bertambah/berkurang pada sisi Kredit dengan jumlah yang sama, sehingga total Debit selalu sama dengan total Kredit (inilah sebabnya laporan Neraca Saldo pada [Bab 15](#15-modul-laporan-keuangan) selalu diperiksa keseimbangannya).

### 10.1 Lima Kategori Akun

| Kategori | Saldo Normal | Contoh Akun | Penjelasan Sederhana |
|----------|--------------|-------------|------------------------|
| **Aset** | Debit | Kas, Kas Bank, Piutang, Persediaan, Peralatan, Perlengkapan | Sesuatu yang **dimiliki** usaha dan bernilai ekonomi |
| **Liabilitas** | Kredit | Utang Usaha, Utang Bank | Kewajiban/utang usaha yang harus dibayar |
| **Ekuitas** | Kredit | Modal, Prive, Laba Ditahan | Hak pemilik atas kekayaan usaha |
| **Pendapatan** | Kredit | Penjualan, Penjualan Lainnya | Nilai yang **diterima** dari hasil usaha |
| **Beban** | Debit | Beban Gaji, Listrik, Air, Internet, Sewa | Biaya yang **dikeluarkan** untuk menjalankan usaha |

### 10.2 Prinsip Dasar yang Digunakan

> "Uang masuk ke akun **MANA** (Debit), dan sumbernya dari akun **MANA** (Kredit)."
> - **Debit** = kemana uang/nilai bertambah
> - **Kredit** = dari mana sumber/nilai berkurang

Untuk memudahkan penjelasan kepada pembimbing/penguji yang mungkin belum familiar dengan istilah akuntansi teknis, prinsip di atas dapat dianalogikan sebagai berikut: **Debit** menjawab pertanyaan "barang/nilai apa yang bertambah karena transaksi ini?", sedangkan **Kredit** menjawab pertanyaan "dari mana asal nilai tersebut, atau apa yang berkurang untuk mendapatkannya?".

### 10.3 Contoh Penjurnalan

| Transaksi | Debit | Kredit |
|-----------|-------|--------|
| Setor modal awal | Kas | Modal |
| Penjualan tunai | Kas | Penjualan |
| Penjualan secara piutang | Piutang | Penjualan |
| Pelunasan piutang oleh pelanggan | Kas | Piutang (berkurang) |
| Bayar utang usaha | Utang Usaha (berkurang) | Kas |
| Bayar beban gaji/listrik/dll | Beban (terkait) | Kas |
| Ambil uang usaha untuk pribadi (prive) | Prive | Kas |
| Kembalikan prive ke kas usaha | Kas | Prive |

### 10.4 Catatan Penting (Diambil dari Hasil Riset Pengembang)

- ❗ **Bayar piutang ≠ beban** — pelunasan piutang bukan pengeluaran beban, melainkan perubahan bentuk aset (dari Piutang menjadi Kas).
- ❗ **Bayar piutang ≠ pendapatan** — pendapatan sudah dicatat saat penjualan terjadi (baik tunai maupun piutang), bukan saat piutang dilunasi.

---

## 11. Algoritma Deteksi Akun Otomatis

Inti dari aplikasi ini adalah mesin deteksi otomatis di `assets/js/modules/inputTransaksi.js` yang mengubah kalimat bebas (*natural language sederhana*) menjadi pasangan akun Debit-Kredit. Proses ini terdiri dari **3 tahap fungsi**.

Secara sederhana, cara kerja algoritma ini dapat dijelaskan seperti seorang kasir yang membaca nota belanja: ia mencari kata-kata kunci pada catatan ("bayar listrik", "setor modal", dsb.), lalu berdasarkan kata kunci tersebut menentukan akun mana yang terlibat dan ke arah mana (Debit/Kredit) nilainya dicatat — persis seperti yang dilakukan program di bawah ini, hanya saja dilakukan secara otomatis oleh kode JavaScript.

### 11.1 Master Data Akun — `AKUN_RULES`

Daftar akun didefinisikan sebagai array objek dengan struktur:

```javascript
{ kode: "101", nama: "Kas", kategori: "aset", saldoNormal: "debit", idnama: "kas" }
```

- `kode` — kode akun (mengikuti pola kode akun akuntansi: 1xx = Aset, 2xx = Liabilitas, 3xx = Ekuitas, 4xx = Pendapatan, 5xx = Beban).
- `kategori` — salah satu dari: `aset`, `liabilitas`, `ekuitas`, `pendapatan`, `beban`.
- `saldoNormal` — posisi saldo normal akun (`debit` atau `kredit`).
- `idnama` — kata kunci (keyword) yang dicari di dalam kalimat keterangan transaksi (huruf kecil).

### 11.2 Tahap 1 — `detectAkunUtama(keterangan)`

Menentukan **akun utama** (akun yang paling relevan/spesifik) dari kalimat keterangan, dengan urutan aturan (rule) prioritas:

1. Jika kalimat mengandung "piutang" **dan** ("penjualan" atau "jual") → akun utama = **Piutang**.
2. Jika kalimat mengandung "beli"/"membeli"/"pembelian" **dan** menyebut aset selain kas → akun utama = aset tersebut (misal **Peralatan** atau **Perlengkapan**).
3. Jika mengandung "bayar utang bank" → akun utama = **Utang Bank**.
4. Jika mengandung "bayar utang" (umum) → akun utama = **Utang Usaha**.
5. Jika mengandung "bayar piutang"/"terima piutang"/"pelunasan piutang" → akun utama = **Piutang**.
6. Default: cari semua akun yang `idnama`-nya cocok dengan kalimat, lalu urutkan berdasarkan **prioritas kategori** (`PRIORITAS_KATEGORI = ["pendapatan", "beban", "liabilitas", "ekuitas", "aset"]`) dan ambil kandidat pertama.

> Jika tidak ada satu pun akun yang cocok, sistem akan menolak transaksi dan menampilkan pesan validasi (lihat `isKeteranganValid`).

### 11.3 Tahap 2 — `detectAkunLawan(akunUtama, keterangan)`

Setelah akun utama ditemukan, fungsi ini menentukan **akun lawan** (pasangannya) berdasarkan jenis akun utama tersebut, dengan 8 aturan berurutan, di antaranya:

| Kondisi Akun Utama | Akun Lawan yang Ditentukan |
|---------------------|------------------------------|
| Piutang + kalimat mengandung "jual"/"penjualan" | Pendapatan |
| Aset (selain Kas/Piutang) + kalimat mengandung "utang" | Utang Usaha |
| Kas + kalimat mengandung "setor"/"modal" | Modal |
| Utang Usaha / Utang Bank | Kas |
| Piutang (pelunasan) | Kas |
| Pendapatan / Beban | Kas |
| Aset selain Kas | Kas |
| Ekuitas | Kas |

> Pola umum yang terlihat: **Kas hampir selalu menjadi "akun lawan default"**, karena mayoritas transaksi UMKM berputar melalui kas/bank.

### 11.4 Tahap 3 — `tentukanDebitKredit(transaksi)`

Setelah pasangan akun (akun utama & akun lawan) diketahui, fungsi ini menentukan **mana yang menjadi sisi Debit dan mana yang menjadi sisi Kredit**, berdasarkan `saldoNormal` masing-masing akun, dengan pengecualian khusus untuk akun **Prive**:

```javascript
function tentukanDebitKredit(transaksi) {
  const { akunUtama, akunLawan, pengurangan, keterangan } = transaksi;
  const text = keterangan.toLowerCase();

  // Aturan khusus PRIVE
  if (akunUtama.nama.toLowerCase() === "prive") {
    if (text.includes("kembalikan") || text.includes("setor")) {
      return { debit: akunLawan, kredit: akunUtama };   // kembalikan prive
    } else {
      return { debit: akunUtama, kredit: akunLawan };   // ambil prive
    }
  }

  // Aturan umum berdasarkan saldo normal
  let debit  = akunUtama.saldoNormal === "debit" ? akunUtama : akunLawan;
  let kredit = debit === akunUtama ? akunLawan : akunUtama;

  // Jika transaksi bersifat "pengurangan akun" (mis. bayar utang/piutang), posisi dibalik
  if (pengurangan) { [debit, kredit] = [kredit, debit]; }

  return { debit, kredit };
}
```

Variabel `pengurangan` dihasilkan oleh fungsi `isPenguranganAkun(keterangan)` yang mendeteksi kata kunci: `"bayar piutang"`, `"bayar utang"`, `"pelunasan"`, `"pembayaran"` — kalimat-kalimat ini menandakan akun yang bersangkutan sedang **berkurang**, bukan bertambah, sehingga posisi Debit/Kredit normalnya perlu dibalik.

### 11.5 Diagram Alur Deteksi Akun

```
Keterangan (teks bebas dari user)
        │
        ▼
isKeteranganValid()  ──❌──▶  Tolak transaksi, tampilkan pesan error
        │ ✅
        ▼
detectAkunUtama()        →  Akun Utama (kode, nama, kategori, saldoNormal)
        │
        ▼
detectAkunLawan()         →  Akun Lawan
        │
        ▼
isPenguranganAkun()       →  true / false
        │
        ▼
tentukanDebitKredit()      →  { debit: Akun, kredit: Akun }
        │
        ▼
Transaksi disimpan ke localStorage (akunUtama, akunLawan, jumlah, pengurangan, dst.)
```

---

## 12. Struktur & Skema Data (localStorage)

Karena aplikasi ini tidak memiliki backend/database server, seluruh data disimpan pada **Web Storage API (`localStorage`)** milik browser pengguna. Berikut adalah key-key yang digunakan:

| Key localStorage | Tipe Data | Keterangan |
|-------------------|-----------|------------|
| `isLoggedIn` | string (`"true"`) | Flag status sesi login aktif |
| `username` | string | Username yang sedang login |
| `keuanganUMKM_users` | JSON object | Database seluruh akun pengguna: `{ [username]: { password, createdAt, updatedAt } }` |
| `input_transaksi_<username>` | JSON array | Daftar transaksi (jurnal umum) milik user tersebut |
| `penyesuaian_hpp` | JSON array | Daftar jurnal penyesuaian HPP yang diinput manual |
| `total_penyesuaian` | number (string) | Hasil hitung total penyesuaian, dipakai ulang oleh modul Laba Rugi |
| `keuanganUMKM` | JSON object | Storage umum legacy (`{ inputTransaksi: [] }`), disediakan oleh `initStorage()` untuk kompatibilitas |

### 12.1 Struktur Objek Transaksi (Jurnal Umum)

Setiap transaksi disimpan dengan struktur berikut (lihat `handleInputTransaksiSubmit` di `inputTransaksi.js`):

```javascript
{
  id: "JU-1735650000000",        // ID unik = "JU-" + timestamp
  tanggal: "2026-06-30",          // format YYYY-MM-DD (dari <input type="date">)
  keterangan: "kas penjualan",    // teks bebas dari pengguna
  akunUtama: { kode, nama, kategori, saldoNormal, idnama },
  akunLawan: { kode, nama, kategori, saldoNormal, idnama },
  jumlah: 150000,                 // Number, dalam Rupiah
  pengurangan: false              // boolean, hasil isPenguranganAkun()
}
```

### 12.2 Isolasi Data per Pengguna

Fungsi `getUserStorageKey(baseKey)` pada `storage.js` membuat key unik berdasarkan username yang sedang login, sehingga setiap pengguna memiliki ruang data transaksi yang terpisah:

```javascript
function getUserStorageKey(baseKey) {
  const username = getCurrentUsername();
  if (!username) return baseKey;
  const sanitized = username.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return `${baseKey}_${sanitized}`;
}
```

Contoh: jika username adalah `"Toko Hisna"`, maka key transaksinya menjadi `input_transaksi_toko_hisna`.

---

## 13. Penjelasan Detail Setiap File

### 13.1 `index.html`
Halaman tunggal (SPA) yang berisi:
- **Form Login / Register / Lupa Password** (`#loginContainer`) — ditampilkan jika pengguna belum login.
- **Konten utama aplikasi** (`#mainContent`) — berisi header, navigasi (`<nav>`), dan kontainer dinamis `<main id="app">` tempat seluruh modul merender tampilannya.
- **Modal konfirmasi password** (`#passwordModal`) — dipakai saat menghapus transaksi.
- Memuat seluruh skrip CDN (Font Awesome, Google Fonts, jsPDF, jsPDF-AutoTable) dan seluruh file JavaScript aplikasi secara berurutan di akhir `<body>`.

### 13.2 `assets/js/utils.js`
Kumpulan fungsi utilitas murni (*pure function*) yang dipakai di seluruh modul:

| Fungsi | Kegunaan |
|--------|----------|
| `formatRupiah(angka)` | Format angka menjadi mata uang Rupiah (`Intl.NumberFormat`) |
| `formatTanggal(tanggal)` | Format tanggal `YYYY-MM-DD` → `DD/MM/YYYY`, dengan parsing manual untuk menghindari pergeseran zona waktu |
| `generateId(prefix)` | Membuat ID unik berbasis `Date.now()` |
| `isNotEmpty(value)` | Validasi nilai tidak kosong |
| `isNumber(value)` | Validasi nilai berupa angka |

### 13.3 `assets/js/storage.js`
Lapisan abstraksi akses `localStorage`:
- `initStorage()` — inisialisasi struktur data awal jika belum ada.
- `getAllData()` / `saveAllData()` — akses storage umum (legacy).
- `getCurrentUsername()` — ambil username dari sesi aktif.
- `getUserStorageKey(baseKey)` — bangun key storage unik per-user.
- `getInputTransaksiForUser()` / `saveInputTransaksiForUser()` / `clearInputTransaksiForUser()` — CRUD data transaksi per pengguna, termasuk migrasi otomatis dari key lama (`input_transaksi` tanpa suffix username) ke key baru per-user.

### 13.4 `assets/js/app.js`
"Otak" navigasi dan autentikasi aplikasi:
- **Autentikasi:** `handleLoginSubmit`, `handleRegisterSubmit`, `handleForgotPasswordSubmit`, `logoutUser`, `checkAuth` — seluruh logika berbasis `localStorage` (key `keuanganUMKM_users`), **tanpa hashing password** (lihat [Bab 20](#20-keamanan--autentikasi)).
- **UI Auth:** `setAuthMessage`/`clearAuthMessage` (pesan error/sukses), `showAuthSection` (toggle antar form login/register/forgot).
- **Navigasi:** `bindNavigation`, `handleNavClick`, `setActiveNav`, `navigateTo(page)` — router SPA berbasis `switch-case` (lihat [Bab 9.2](#92-pola-routing-single-page-application)).
- **UI lain:** `toggleUserMenu` (dropdown user di header), event listener global untuk menutup dropdown saat klik di luar area.

### 13.5 `assets/js/modules/Dashboard.js`
Menampilkan ringkasan keuangan secara cepat: **Saldo Kas**, **Laba Bersih**, dan **Jumlah Transaksi**. Dihitung dengan iterasi seluruh transaksi lalu menjumlahkan sisi Debit/Kredit dari akun Kas dan kategori Pendapatan/Beban.

### 13.6 `assets/js/modules/inputTransaksi.js`
Modul terbesar dan terpenting — berisi:
- Form input transaksi + filter kategori jurnal.
- `AKUN_RULES` (master data akun) dan `PRIORITAS_KATEGORI`.
- Mesin deteksi akun: `detectAkunUtama`, `detectAkunLawan`, `getAkunTerdeteksi`, `isKeteranganValid`, `isPenguranganAkun`, `tentukanDebitKredit` (lihat [Bab 11](#11-algoritma-deteksi-akun-otomatis) untuk detail logikanya).
- `handleInputTransaksiSubmit` — validasi, konfirmasi, dan penyimpanan transaksi baru.
- `renderInputTransaksiList` — render tabel jurnal umum (2 baris per transaksi: baris Debit dan baris Kredit), dengan filter kategori.

### 13.7 `assets/js/modules/bukuBesar.js`
- `buildBukuBesar(jurnal)` — mengelompokkan seluruh baris jurnal menjadi *ledger* per nama akun, dengan struktur `{ [namaAkun]: { saldoNormal, rows: [...], saldo } }`.
- `renderAkunLedger(namaAkun, akunData)` — menghitung saldo berjalan (running balance) tiap baris sesuai `saldoNormal` akun, lalu merender tabel per akun.
- `renderBukuBesar()` — entry point yang mengurutkan jurnal berdasarkan tanggal lalu merender seluruh kartu akun.

### 13.8 `assets/js/modules/neracaSaldo.js`
- `hitungNeracaSaldo()` — agregasi total Debit dan Kredit per kode akun dari seluruh transaksi.
- `renderNeracaSaldo()` — merender tabel neraca saldo, menghitung saldo akhir tiap akun (Debit − Kredit jika `saldoNormal` debit, atau sebaliknya), serta total keseluruhan Debit dan Kredit (harus seimbang sesuai prinsip *double-entry*).

### 13.9 `assets/js/modules/labaRugi.js`
Menjumlahkan seluruh transaksi dengan akun lawan berkategori **pendapatan** (sisi Kredit) dan **beban** (sisi Debit), ditambah **total penyesuaian** (dibaca dari `localStorage["total_penyesuaian"]`, dihasilkan oleh modul Jurnal Penyesuaian), kemudian menghitung **Laba Bersih = Pendapatan − Beban**.

### 13.10 `assets/js/modules/arusKas.js`
Laporan arus kas sederhana (versi ringkas, belum dipisah per aktivitas operasi/investasi/pendanaan): menjumlahkan seluruh **Kas Masuk** (Kas di sisi Debit) dan **Kas Keluar** (Kas di sisi Kredit), menghasilkan **Saldo Kas Bersih**.

### 13.11 `assets/js/modules/perubahanModal.js`
Menghitung **Modal Akhir** dengan formula:

```
Modal Akhir = Modal Awal + Tambahan Modal + Laba Bersih − Prive
```

- `isModalAwal(keterangan)` membedakan transaksi "modal awal" (saat usaha pertama kali didirikan) dengan "tambahan modal" (penambahan modal di tengah periode), berdasarkan kata kunci pada keterangan.

### 13.12 `assets/js/modules/jurnalPenyesuaian.js`
Modul paling kompleks setelah `inputTransaksi.js`. Menangani **jenis-jenis penyesuaian berikut**:
1. **Persediaan** — difilter otomatis dari transaksi yang melibatkan akun "Persediaan".
2. **Peralatan** — difilter otomatis dari transaksi yang melibatkan akun "Peralatan".
3. **Perlengkapan** — difilter otomatis dari transaksi yang melibatkan akun "Perlengkapan" (kode 114), mengikuti pola yang sama dengan Peralatan, dan turut dijumlahkan ke dalam `totalAset`.
4. **HPP (Harga Pokok Penjualan)** — gabungan dari:
   - **Otomatis**: transaksi dengan kata kunci pada array `KATA_KUNCI_HPP_OTOMATIS` (mis. `"hpp"`, `"pemakaian"`, `"penyusutan"`) di keterangan, dengan pencocokan yang bersifat *null-safe* agar tidak menimbulkan error bila data tidak lengkap.
   - **Manual**: input form khusus, disimpan ke `localStorage["penyesuaian_hpp"]`, dengan deduplikasi berdasarkan `id`.

`totalAset` dihitung dari penjumlahan tiga kategori aset penyesuaian (Persediaan + Peralatan + Perlengkapan). Hasil akhir (`totalAset - totalHPP`) disimpan ke `localStorage["total_penyesuaian"]` agar dapat dibaca kembali oleh modul Laba Rugi.

### 13.13 `assets/js/modules/Database.js`
Modul **histori transaksi** dan **export PDF**:
- `renderDatabase()` — menampilkan seluruh transaksi dalam format tabel jurnal (2 baris per transaksi: Debit & Kredit), dengan tombol hapus per baris.
- `deleteDatabaseTransaksi(id)` / `deleteAllDatabaseTransaksi()` — proses hapus data, **dilindungi konfirmasi password** melalui modal (`bukaModalPassword`, `submitPassword`, `batalPassword`).
- `downloadDatabasePDF()` — fungsi utama pembuatan **PDF bergaya mutasi rekening bank/e-statement** menggunakan **jsPDF** + **jsPDF-AutoTable** (dijelaskan detail di [Bab 16](#16-fitur-export-pdf-mutasi-transaksi)).
- `rupiahPDF(n)` — helper format mata uang khusus untuk konten PDF (lebih ringkas dari `formatRupiah`).

### 13.14 `assets/css/style.css`
Berisi seluruh tampilan visual aplikasi (±1700 baris), terbagi menjadi beberapa kelompok besar:
- Halaman login (gradient gelap, animasi gelembung/`bubbles`, kartu form).
- Layout utama (header, navigasi, footer, grid dashboard).
- Komponen tabel laporan (jurnal, buku besar, neraca saldo, dll), termasuk penyesuaian responsif (overflow/scroll horizontal) untuk tabel HPP pada layar mobile.
- Komponen modal (konfirmasi password).
- Kelas utilitas (`.text-right`, `.text-green`, `.text-red`, `.hidden`, dll).

---

## 14. Alur Kerja Sistem (Flow Aplikasi)

```
┌──────────────┐
│   Buka App   │
└──────┬───────┘
       ▼
┌──────────────────┐     belum login      ┌───────────────────────┐
│   checkAuth()     ├─────────────────────▶│ Tampilkan Form Login   │
└──────┬────────────┘                       │  (Login/Register/      │
       │ sudah login                        │   Lupa Password)       │
       ▼                                    └───────────┬─────────────┘
┌──────────────────────┐                                 │ submit sukses
│  showMainContent()    │◀────────────────────────────────┘
└──────┬─────────────────┘
       ▼
┌──────────────────────────────┐
│  navigateTo("Dashboard")      │  ← halaman default setelah login
└──────┬─────────────────────────┘
       ▼
┌───────────────────────────────────────────────────────────────────┐
│   Pengguna memilih menu navigasi (Jurnal Umum, Buku Besar, dst.)   │
└──────┬────────────────────────────────────────────────────────────┘
       ▼
┌──────────────────────────────┐
│  Input Transaksi Baru          │
│  (tanggal, keterangan, jumlah) │
└──────┬─────────────────────────┘
       ▼
┌──────────────────────────────────────┐
│ Mesin Deteksi Akun (Bab 11)            │
│ → tentukan akun Debit & Kredit         │
└──────┬─────────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ Simpan ke localStorage         │
│ (per-username)                 │
└──────┬─────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────┐
│  Seluruh laporan (Buku Besar, Neraca Saldo, Laba Rugi, Arus  │
│  Kas, Perubahan Modal) otomatis membaca ulang data terbaru   │
│  setiap kali halaman tersebut dibuka                          │
└─────────────────────────────────────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ Histori/Database → Export PDF  │
│ (mutasi transaksi)             │
└─────────────────────────────────┘
```

---

## 15. Modul Laporan Keuangan

Diagram alir penyusunan laporan keuangan, sesuai catatan awal pengembang:

```
Input Transaksi (Buku Kas / Utang / Persediaan)
        ↓
   JURNAL UMUM        (catatan detail setiap transaksi, Debit & Kredit)
        ↓
   BUKU BESAR          (rekap mutasi & saldo berjalan per akun)
        ↓
   NERACA SALDO        (rekap saldo akhir seluruh akun, untuk cek keseimbangan)
        ↓
 ┌──────────────┬─────────────────┬───────────────────────┐
 ▼              ▼                 ▼                       ▼
LABA RUGI   ARUS KAS      PERUBAHAN MODAL      JURNAL PENYESUAIAN
```

Setiap laporan **tidak menyimpan data sendiri** — semuanya dihitung ulang (*derived/computed*) secara *real-time* dari satu sumber data: array transaksi (`getInputTransaksi()`). Ini membuat data selalu konsisten antar laporan, namun juga berarti performa akan menurun secara linear (`O(n)`) seiring bertambahnya jumlah transaksi karena setiap laporan melakukan iterasi penuh setiap kali dibuka.

---

## 16. Fitur Export PDF (Mutasi Transaksi)

Fungsi `downloadDatabasePDF()` pada `Database.js` menghasilkan dokumen PDF profesional bergaya **e-statement/mutasi rekening bank**, dengan struktur sebagai berikut:

1. **Kop/Header** — nama aplikasi, judul laporan, nomor dokumen unik (`No. Dokumen: STMT/<USERNAME>/<TANGGAL>/<KODE>`), dan kotak periode laporan di kanan atas.
2. **Info Pemilik** — nama pemilik, jenis usaha, total transaksi, periode, total kas masuk, total kas keluar.
3. **Ringkasan Saldo** — strip biru berisi Saldo Awal, (+) Kas Masuk, (−) Kas Keluar, (=) Saldo Akhir.
4. **Tabel Rincian Mutasi Transaksi** — kolom: No, Tanggal, No. Referensi (unik per transaksi), Keterangan, Akun (Debit/Kredit), Kas Masuk, Kas Keluar, **Saldo berjalan** (running balance), serta baris Total di akhir tabel.
5. **Ringkasan per Kategori Akun** — tabel rekap kecil yang menjumlahkan total Debit dan Kredit per kategori akun (Aset, Liabilitas, Ekuitas, Pendapatan, Beban) sebagai sarana verifikasi keseimbangan *double-entry*.
6. **Catatan & Tanda Tangan** — kotak catatan (disclaimer dokumen sah tanpa tanda tangan basah) dan kolom tanda tangan "Mengetahui" dengan nama pemilik usaha.
7. **Watermark** — teks "UMKM" transparan diagonal di tengah halaman.
8. **Header & Footer berulang** di setiap halaman (jika data lebih dari 1 halaman) — termasuk nomor halaman (`Halaman X dari Y`) dan waktu cetak otomatis.

Library yang dipakai:
- **jsPDF** — membangun dokumen PDF (teks, bentuk, warna) langsung di browser (client-side), tanpa server.
- **jsPDF-AutoTable** — plugin untuk membuat tabel otomatis dengan fitur *page-break*, *header berulang*, dan *cell styling* (warna, perataan, lebar kolom kustom).

File PDF disimpan dengan format nama: `Mutasi_Transaksi_<username>_<YYYY-MM-DD>.pdf`.

---

## 17. Cara Instalasi, Menjalankan, dan Menerbitkan (Deploy) Aplikasi

Karena aplikasi ini berbasis **client-side murni** (tanpa backend/server, tanpa proses build/compile), cara menjalankannya sangat sederhana.

### 17.1 Opsi 1 — Membuka Langsung di Browser
1. Ekstrak folder proyek (`HISNA UMKM FIX ZQ V.2.0`).
2. Buka file `index.html` dengan double-click, atau klik kanan → *Open with* → browser pilihan (Chrome/Edge/Firefox).
3. Pastikan komputer/perangkat terhubung internet (untuk memuat Google Fonts, Font Awesome, jsPDF, dan jsPDF-AutoTable dari CDN).

### 17.2 Opsi 2 — Menjalankan via Local Web Server (disarankan)
Beberapa browser membatasi fitur tertentu saat dibuka via `file://`. Disarankan menjalankan via server lokal sederhana, contoh menggunakan Python:

```bash
cd "HISNA UMKM FIX ZQ V.2.0"
python -m http.server 8080
```

Lalu buka `http://localhost:8080` di browser.

Atau menggunakan ekstensi **Live Server** pada VS Code — klik kanan pada `index.html` → **Open with Live Server**.

### 17.3 Kebutuhan Sistem
- Browser modern (Chrome, Edge, Firefox, Safari versi terbaru) yang mendukung `localStorage` dan ES6 JavaScript.
- Tidak memerlukan Node.js, database, ataupun instalasi dependency apa pun.

### 17.4 Opsi 3 — Menerbitkan (Deploy) Aplikasi secara Daring

Karena seluruh aplikasi hanya terdiri dari file statis (HTML, CSS, JS), aplikasi dapat dipublikasikan secara gratis tanpa server backend melalui beberapa layanan berikut. Bagian ini berguna untuk laporan tugas akhir sebagai bukti aplikasi dapat diakses publik (misalnya untuk lampiran tautan demo).

**a) GitHub Pages**
1. Unggah seluruh kode ke sebuah repository GitHub (`git init` → `git add .` → `git commit -m "initial commit"` → `git push`).
2. Masuk ke *Settings* repository → *Pages* → pilih branch (`main`) dan folder root sebagai sumber.
3. GitHub akan menerbitkan aplikasi pada alamat `https://<username>.github.io/<nama-repo>/`.

**b) Netlify**
1. Daftar/masuk ke [netlify.com](https://netlify.com) menggunakan akun GitHub.
2. Pilih *Add new site → Import an existing project*, lalu hubungkan ke repository GitHub proyek ini.
3. Karena tidak ada proses build, kosongkan *build command* dan set *publish directory* ke folder root proyek.

**c) Vercel**
1. Daftar/masuk ke [vercel.com](https://vercel.com) menggunakan akun GitHub.
2. Pilih *Import Project*, hubungkan ke repository, lalu deploy tanpa konfigurasi tambahan (karena proyek statis).

> Ketiga layanan di atas bersifat gratis untuk proyek statis skala kecil dan tidak memerlukan kartu kredit untuk paket dasarnya, sehingga cocok digunakan sebagai media demonstrasi aplikasi tugas akhir kepada dosen pembimbing/penguji.

---

## 18. Cara Penggunaan Aplikasi

1. **Daftar Akun** — klik "Daftar Akun" pada halaman login, isi username & password.
2. **Login** — masuk menggunakan akun yang telah didaftarkan.
3. **Input Transaksi** — buka menu *Jurnal Umum*, isi tanggal, keterangan (gunakan kata kunci nama akun, misal: *"kas penjualan"*, *"bayar listrik"*, *"setor modal awal"*), dan jumlah, lalu klik **Simpan**.
4. **Lihat Laporan** — buka menu *Buku Besar*, *Neraca Saldo*, *Laba Rugi*, *Arus Kas*, atau *Perubahan Modal* — seluruh laporan akan otomatis tersusun dari transaksi yang sudah diinput.
5. **Jurnal Penyesuaian** — untuk transaksi yang melibatkan persediaan/peralatan/perlengkapan/HPP, buka menu *Jurnal Penyesuaian* untuk melihat rekap otomatis atau menambah penyesuaian manual.
6. **Histori & Export PDF** — buka menu *Histori*, lihat seluruh riwayat transaksi, lalu klik **📥 Download Mutasi Transaksi** untuk mengunduh laporan PDF.
7. **Hapus Data** — gunakan tombol 🗑️ (per transaksi) atau "Hapus Semua Transaksi", lalu masukkan password akun untuk konfirmasi.
8. **Logout** — klik avatar pengguna di kanan atas → Logout.

### 18.1 Contoh Kalimat Keterangan yang Dikenali Sistem
| Keterangan | Akun Utama Terdeteksi | Akun Lawan Terdeteksi |
|------------|------------------------|--------------------------|
| "kas penjualan" | Kas | Penjualan (Pendapatan) |
| "penjualan piutang" | Piutang | Pendapatan |
| "bayar listrik" | Beban Listrik | Kas |
| "setor modal awal" | Kas | Modal |
| "bayar utang usaha" | Utang Usaha | Kas |
| "terima piutang" | Piutang | Kas |
| "beli peralatan utang" | Peralatan | Utang Usaha |
| "ambil kas pribadi" | Prive | Kas |

---

## 19. Pengujian Aplikasi (Black-Box Testing)

Pengujian dilakukan dengan metode **black-box testing**, yaitu menguji aplikasi dari sisi fungsional (input → output) tanpa memeriksa detail internal kode, sehingga fokus pengujian adalah apakah setiap fitur menghasilkan keluaran yang sesuai dengan yang diharapkan pengguna. Metode ini dipilih karena sesuai untuk menguji aplikasi berbasis antarmuka (UI) seperti HISNA UMKM, dan umum digunakan pada laporan tugas akhir bidang rekayasa perangkat lunak.

### 19.1 Contoh Skenario Pengujian

| No | Skenario Pengujian | Data/Aksi Input | Hasil yang Diharapkan | Status |
|----|---------------------|-------------------|---------------------------|--------|
| 1 | Registrasi akun baru | Username & password baru, valid | Akun berhasil dibuat, muncul pesan sukses, diarahkan ke halaman login | ✅ Sesuai |
| 2 | Registrasi dengan username yang sudah ada | Username yang sudah terdaftar | Muncul pesan error "username sudah digunakan" | ✅ Sesuai |
| 3 | Login dengan kredensial benar | Username & password terdaftar | Berhasil masuk ke Dashboard | ✅ Sesuai |
| 4 | Login dengan password salah | Username benar, password salah | Muncul pesan error, tetap di halaman login | ✅ Sesuai |
| 5 | Input transaksi dengan keterangan dikenali | "kas penjualan", jumlah 100000 | Tersimpan sebagai jurnal Debit Kas / Kredit Penjualan | ✅ Sesuai |
| 6 | Input transaksi dengan keterangan tidak dikenali | "xyz random abc" | Transaksi ditolak, muncul pesan validasi | ✅ Sesuai |
| 7 | Total Debit vs Kredit pada Neraca Saldo | Beberapa transaksi campuran | Total Debit = Total Kredit (seimbang) | ✅ Sesuai |
| 8 | Perhitungan Laba Bersih | Transaksi pendapatan & beban campuran | Laba Bersih = total Pendapatan − total Beban (+ penyesuaian) | ✅ Sesuai |
| 9 | Hapus transaksi tanpa password benar | Password salah saat konfirmasi hapus | Transaksi tidak terhapus, muncul pesan error | ✅ Sesuai |
| 10 | Export PDF Mutasi Transaksi | Klik tombol Download Mutasi | File PDF terunduh dengan format nama sesuai `Mutasi_Transaksi_<username>_<tanggal>.pdf` | ✅ Sesuai |
| 11 | Isolasi data antar pengguna | Login sebagai user A, lalu user B | Data transaksi user A tidak tampil saat login sebagai user B | ✅ Sesuai |
| 12 | Tampilan responsif pada perangkat mobile | Buka aplikasi di layar kecil (< 480px) | Tabel HPP dapat di-scroll horizontal tanpa merusak layout | ✅ Sesuai |

> **Catatan:** tabel di atas adalah contoh format pengujian yang dapat diperluas dan disesuaikan dengan hasil pengujian nyata yang dilakukan penulis (misalnya menambahkan kolom "Tanggal Pengujian" dan "Tester" bila dibutuhkan format skripsi kampus masing-masing).

### 19.2 Ringkasan Aspek yang Diuji

- **Fungsional** — apakah tiap fitur (autentikasi, input transaksi, laporan, export PDF, hapus data) berjalan sesuai spesifikasi.
- **Validasi** — apakah sistem menolak input yang tidak valid (keterangan tidak dikenali, password salah, field kosong).
- **Konsistensi data** — apakah total Debit selalu sama dengan total Kredit pada setiap laporan (prinsip *double-entry*).
- **Keamanan dasar** — apakah proses hapus data benar-benar membutuhkan konfirmasi password.
- **Kompatibilitas tampilan (responsif)** — apakah tampilan tetap dapat digunakan pada layar mobile.

---

## 20. Keamanan & Autentikasi

> ⚠️ **Catatan penting untuk laporan skripsi:** aplikasi ini dibangun sebagai **studi kasus/prototipe** pencatatan keuangan otomatis, **bukan** aplikasi produksi yang aman. Beberapa hal yang perlu disebutkan sebagai keterbatasan keamanan:

- **Password disimpan dalam bentuk plain text** di `localStorage` (tidak ada hashing/enkripsi seperti bcrypt). Ini **tidak aman** untuk lingkungan produksi nyata, dan sebaiknya disebutkan secara eksplisit sebagai keterbatasan dalam laporan skripsi.
- **Data tersimpan di sisi klien (browser)**, sehingga: (1) data tidak dapat diakses dari perangkat lain, (2) data dapat hilang jika *cache*/`localStorage` browser dibersihkan, (3) tidak ada *backup* otomatis ke server.
- **Tidak ada enkripsi transport** karena tidak ada komunikasi client-server (semua logika berjalan lokal di browser pengguna).
- Konfirmasi hapus data menggunakan password akun sebagai langkah mitigasi sederhana terhadap penghapusan data tidak sengaja.

---

## 21. Keterbatasan Aplikasi

1. Mesin deteksi akun berbasis **pencocokan kata kunci sederhana** (bukan *Natural Language Processing*/AI sungguhan), sehingga sensitif terhadap variasi kalimat yang tidak terdaftar dalam `idnama`.
2. Tidak mendukung multi-mata uang (hanya Rupiah).
3. Tidak ada fitur edit transaksi (hanya tambah dan hapus).
4. Laporan Arus Kas belum dipisahkan menjadi 3 aktivitas standar (operasi, investasi, pendanaan) — masih versi ringkas (kas masuk vs kas keluar).
5. Data tidak tersinkronisasi antar perangkat/browser (tidak ada server/database terpusat).
6. Tidak ada *role/permission* (misalnya admin vs staf); setiap akun setara.
7. Belum ada fitur cetak/ekspor untuk laporan selain Histori (Buku Besar, Neraca Saldo, Laba Rugi, dll. belum bisa diunduh PDF).

---

## 22. Rencana Pengembangan Selanjutnya

1. Migrasi penyimpanan data dari `localStorage` ke backend (database) seperti MySQL/PostgreSQL, atau ke layanan **Firebase (Firestore + Authentication)**, agar data dapat diakses dari berbagai perangkat dan tersinkronisasi secara real-time.
2. Implementasi hashing password (misalnya bcrypt, atau memanfaatkan Firebase Authentication) bila autentikasi dipindahkan ke backend.
3. Penambahan fitur edit transaksi.
4. Pemisahan Laporan Arus Kas menjadi 3 aktivitas standar (operasi, investasi, pendanaan) sesuai PSAK/SAK EMKM.
5. Peningkatan mesin deteksi akun, misalnya dengan pendekatan *machine learning*/NLP untuk pengenalan kalimat yang lebih fleksibel ("logika AI" — sebagaimana disebutkan dalam catatan pengembangan awal proyek).
6. Penambahan fitur export PDF untuk seluruh jenis laporan (tidak hanya histori/mutasi transaksi).
7. Penambahan grafik/visualisasi data (misalnya menggunakan Chart.js) pada Dashboard.
8. Penerapan standar akuntansi UMKM yang lebih lengkap, seperti SAK EMKM (Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah).
9. Migrasi bertahap dari vanilla JavaScript ke framework modern (misalnya React atau Vue) apabila kompleksitas aplikasi terus bertambah pada pengembangan pasca-tugas akhir.

---

## 23. Daftar Pustaka / Referensi Teknis

- **jsPDF** — library JavaScript open-source untuk pembuatan dokumen PDF di sisi klien. https://github.com/parallax/jsPDF
- **jsPDF-AutoTable** — plugin jsPDF untuk pembuatan tabel otomatis pada dokumen PDF. https://github.com/simonbengtsson/jsPDF-AutoTable
- **Font Awesome** — pustaka ikon vektor untuk antarmuka web. https://fontawesome.com
- **Google Fonts (Quicksand)** — pustaka *web font* gratis dari Google. https://fonts.google.com
- **MDN Web Docs — Web Storage API (`localStorage`)** — dokumentasi resmi mekanisme penyimpanan data sisi klien pada browser. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Git** — dokumentasi resmi sistem kontrol versi. https://git-scm.com/doc
- **GitHub Pages** — dokumentasi resmi layanan hosting statis GitHub. https://docs.github.com/en/pages
- Konsep akuntansi dasar (debit-kredit, jurnal umum, buku besar, neraca saldo, laporan laba rugi, laporan perubahan modal, laporan arus kas) mengacu pada prinsip *double-entry bookkeeping* yang umum diajarkan dalam mata kuliah Akuntansi Dasar/Pengantar Akuntansi.
- Konsep metodologi pengembangan perangkat lunak model *prototyping* mengacu pada literatur umum Rekayasa Perangkat Lunak (*Software Engineering*), seperti yang dijelaskan dalam Pressman, R.S., *Software Engineering: A Practitioner's Approach*.
- Konsep pengujian perangkat lunak *black-box testing* mengacu pada literatur umum Rekayasa Perangkat Lunak sebagai salah satu metode pengujian fungsional berbasis spesifikasi.
- **Anthropic — Claude** — asisten AI yang digunakan sebagai alat bantu pengembangan (coding assistant) dan penyusunan dokumentasi teknis proyek ini. https://claude.ai

---

## 24. Lampiran A — Daftar Kode Akun (Chart of Accounts)

| Kode | Nama Akun | Kategori | Saldo Normal |
|------|-----------|----------|----------------|
| 101 | Kas | Aset | Debit |
| 102 | Kas Bank | Aset | Debit |
| 103 | Piutang | Aset | Debit |
| 104 | Persediaan | Aset | Debit |
| 105 | Peralatan | Aset | Debit |
| 106 | Perlengkapan | Aset | Debit |
| 201 | Utang Usaha | Liabilitas | Kredit |
| 202 | Utang Bank | Liabilitas | Kredit |
| 301 | Modal | Ekuitas | Kredit |
| 302 | Prive | Ekuitas | Kredit |
| 303 | Laba Ditahan | Ekuitas | Kredit |
| 401 | Pendapatan (Penjualan) | Pendapatan | Kredit |
| 402 | Pendapatan Lainnya (Penjualan Lainnya) | Pendapatan | Kredit |
| 501 | Beban Gaji | Beban | Debit |
| 502 | Beban Listrik | Beban | Debit |
| 503 | Beban Air | Beban | Debit |
| 504 | Beban Internet | Beban | Debit |
| 505 | Beban Sewa | Beban | Debit |
| 511 | Harga Pokok Penjualan (HPP) | Beban (Penyesuaian) | Debit |

> Sumber: `AKUN_RULES` pada `assets/js/modules/inputTransaksi.js` (kode 101–505) dan logika tambahan pada `assets/js/modules/jurnalPenyesuaian.js` (kode 114 untuk Perlengkapan, dan kode 511 khusus jurnal penyesuaian HPP).

---

## 25. Lampiran B — Catatan Penulis Asli (Riwayat Pengembangan)

Bagian ini merupakan catatan pengembangan awal dari pembuat aplikasi (M. Zaqi Mubarok & Al-Hisna Esya Sabila), dipertahankan sebagai dokumentasi historis proses berpikir dan iterasi pengembangan:

- Logika dasar: *Buku Kas/Utang/Persediaan → Jurnal Umum → Buku Besar → Laba Rugi/Neraca*.
- Pemahaman prinsip: "Bayar tagihan/gaji termasuk Debit karena merupakan nilai yang digunakan"; "Prive adalah uang usaha yang dipakai untuk keperluan pribadi".
- Hasil diskusi dengan dosen pembimbing dilakukan melalui presentasi video fitur dan logika deteksi akun otomatis.
- Catatan perbaikan berkelanjutan: deteksi otomatis akun dari kalimat keterangan, penyempurnaan urutan menu dashboard, penambahan akun Perlengkapan, dan penanganan jurnal penyesuaian untuk persediaan/peralatan/perlengkapan/HPP bulanan.

---

*Dokumen ini dapat digunakan sebagai lampiran teknis (technical documentation) pada laporan skripsi/tugas akhir terkait pengembangan sistem informasi akuntansi sederhana untuk UMKM. Struktur bab pada dokumen ini (Latar Belakang → Tujuan → Metodologi → Perancangan → Implementasi → Pengujian → Kesimpulan/Keterbatasan) juga dapat diadaptasi langsung menjadi kerangka Bab III (Analisis & Perancangan) dan Bab IV (Implementasi & Pengujian) pada laporan skripsi.*
