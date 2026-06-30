# 📊 Aplikasi Laporan Keuangan UMKM ( HISNA UMKM )

> Aplikasi web berbasis client-side untuk pencatatan dan pelaporan keuangan UMKM secara otomatis, menerapkan prinsip akuntansi dasar (double-entry bookkeeping) dengan **deteksi akun otomatis berbasis kata kunci** dari kalimat keterangan transaksi.

**Versi:** 3.0.0.6.2.6
**Tipe Aplikasi:** Single Page Application (SPA) — HTML, CSS, JavaScript (Vanilla JS, tanpa framework)
**Penyimpanan Data:** Browser `localStorage` (client-side storage)
**Dibuat oleh:** M. Zaqi Mubarok & Al-Hisna Esya Sabila

---

## 📑 Daftar Isi

1. [Latar Belakang](#1-latar-belakang)
2. [Tujuan Aplikasi](#2-tujuan-aplikasi)
3. [Ruang Lingkup & Fitur](#3-ruang-lingkup--fitur)
4. [Teknologi yang Digunakan](#4-teknologi-yang-digunakan)
5. [Struktur Folder & File](#5-struktur-folder--file)
6. [Arsitektur Aplikasi](#6-arsitektur-aplikasi)
7. [Konsep Akuntansi yang Diterapkan](#7-konsep-akuntansi-yang-diterapkan)
8. [Algoritma Deteksi Akun Otomatis](#8-algoritma-deteksi-akun-otomatis)
9. [Struktur & Skema Data (localStorage)](#9-struktur--skema-data-localstorage)
10. [Penjelasan Detail Setiap File](#10-penjelasan-detail-setiap-file)
11. [Alur Kerja Sistem (Flow Aplikasi)](#11-alur-kerja-sistem-flow-aplikasi)
12. [Modul Laporan Keuangan](#12-modul-laporan-keuangan)
13. [Fitur Export PDF (Mutasi Transaksi)](#13-fitur-export-pdf-mutasi-transaksi)
14. [Cara Instalasi & Menjalankan Aplikasi](#14-cara-instalasi--menjalankan-aplikasi)
15. [Cara Penggunaan Aplikasi](#15-cara-penggunaan-aplikasi)
16. [Keamanan & Autentikasi](#16-keamanan--autentikasi)
17. [Keterbatasan Aplikasi](#17-keterbatasan-aplikasi)
18. [Rencana Pengembangan Selanjutnya](#18-rencana-pengembangan-selanjutnya)
19. [Daftar Pustaka / Referensi Teknis](#19-daftar-pustaka--referensi-teknis)
20. [Lampiran: Daftar Kode Akun (Chart of Accounts)](#20-lampiran-daftar-kode-akun-chart-of-accounts)
21. [Tools, Aplikasi, dan Alur Kerja Pengembangan (Development Workflow)](#21-tools-aplikasi-dan-alur-kerja-pengembangan-development-workflow)
22. [Panduan Setup Repository GitHub](#22-panduan-setup-repository-github)
23. [Dokumentasi Prototipe untuk Laporan Skripsi](#23-dokumentasi-prototipe-untuk-laporan-skripsi)

---

## 1. Latar Belakang

Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia umumnya masih melakukan pencatatan keuangan secara manual (buku tulis) atau menggunakan aplikasi pencatatan kas yang sederhana tanpa memperhatikan prinsip akuntansi yang baku (debit/kredit, akun, jurnal, buku besar). Hal ini menyebabkan pelaku UMKM kesulitan untuk:

- Mengetahui posisi keuangan usaha secara akurat (laba/rugi, arus kas, perubahan modal).
- Menyusun laporan keuangan sesuai standar akuntansi dasar.
- Melacak riwayat transaksi yang sudah dilakukan.

Aplikasi **Laporan Keuangan UMKM** ini dibangun untuk menjawab permasalahan tersebut dengan menyediakan sistem pencatatan transaksi berbasis **jurnal umum** yang otomatis menghasilkan **buku besar**, **neraca saldo**, **laporan laba rugi**, **laporan arus kas**, dan **laporan perubahan modal**, hanya dari satu input: *tanggal, keterangan, dan jumlah transaksi*.

Keunikan aplikasi ini terletak pada mekanisme **deteksi otomatis akun debit dan kredit** berdasarkan kata kunci yang terdapat pada kalimat "keterangan" transaksi (lihat [Bab 8](#8-algoritma-deteksi-akun-otomatis)), sehingga pengguna (UMKM) yang tidak memiliki latar belakang akuntansi tetap dapat menghasilkan jurnal yang valid secara prinsip *double-entry bookkeeping*.

---

## 2. Tujuan Aplikasi

1. Memudahkan pelaku UMKM dalam mencatat transaksi keuangan harian tanpa harus memahami istilah debit/kredit secara teknis.
2. Mengotomatisasi proses penjurnalan (jurnal umum) menjadi laporan keuangan turunan (buku besar, neraca saldo, laba rugi, arus kas, perubahan modal).
3. Menyediakan riwayat (histori) transaksi yang dapat diekspor menjadi dokumen PDF profesional menyerupai mutasi rekening/bank statement, untuk keperluan pelaporan/arsip.
4. Menjadi studi kasus implementasi logika akuntansi sederhana (rule-based detection) ke dalam sistem informasi berbasis web.

---

## 3. Ruang Lingkup & Fitur

### 3.1 Fitur Autentikasi
- Registrasi akun baru (username & password).
- Login akun.
- Lupa password / reset password.
- Logout.
- Setiap akun memiliki data transaksi yang terpisah (data terisolasi per-username di `localStorage`).

### 3.2 Fitur Pencatatan Transaksi
- Input transaksi (tanggal, keterangan, jumlah).
- Deteksi otomatis akun utama dan akun lawan dari kalimat keterangan.
- Validasi keterangan transaksi (mencegah kalimat yang tidak dikenali sistem).
- Filter jurnal umum berdasarkan kategori akun (aset, liabilitas, ekuitas, pendapatan, beban).

### 3.3 Fitur Laporan (Otomatis dari Data Jurnal)
| No | Laporan | Modul |
|----|---------|-------|
| 1 | Dashboard ringkasan (saldo kas, laba bersih, jumlah transaksi) | `Dashboard.js` |
| 2 | Jurnal Umum | `inputTransaksi.js` |
| 3 | Buku Besar (per akun) | `bukuBesar.js` |
| 4 | Neraca Saldo | `neracaSaldo.js` |
| 5 | Laporan Laba Rugi | `labaRugi.js` |
| 6 | Laporan Arus Kas | `arusKas.js` |
| 7 | Laporan Perubahan Modal | `perubahanModal.js` |
| 8 | Jurnal Penyesuaian (Persediaan, Peralatan, HPP) | `jurnalPenyesuaian.js` |
| 9 | Database/Histori Transaksi + Export PDF | `Database.js` |

### 3.4 Fitur Manajemen Data
- Hapus 1 transaksi (dengan konfirmasi password).
- Hapus semua transaksi (dengan konfirmasi password).
- Export riwayat transaksi ke **PDF** bergaya mutasi rekening bank/e-statement (kop laporan, info pemilik, ringkasan saldo, tabel rincian, rekap kategori akun, tanda tangan, watermark, nomor halaman).

---

## 4. Teknologi yang Digunakan

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

---

## 5. Struktur Folder & File

```
HISNA UMKM FIX ZQ V.3.0.0.6.2.6/
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
            ├── jurnalPenyesuaian.js     # Jurnal penyesuaian (persediaan/peralatan/HPP)
            └── Database.js              # Histori transaksi + export PDF mutasi
```

**Total modul JavaScript:** 11 file (3 file inti + 9 modul halaman/laporan)

---

## 6. Arsitektur Aplikasi

Aplikasi ini menggunakan pola **SPA sederhana berbasis vanilla JavaScript** dengan konsep *client-side rendering* — seluruh tampilan dirender ulang ke dalam satu kontainer (`<main id="app">`) tergantung menu yang dipilih pengguna, **tanpa reload halaman** dan **tanpa backend/server**.

### 6.1 Diagram Lapisan Aplikasi

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

### 6.2 Pola Routing (Single Page Application)

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

## 7. Konsep Akuntansi yang Diterapkan

Aplikasi ini menerapkan prinsip **akuntansi berpasangan (double-entry bookkeeping)**: setiap transaksi selalu memengaruhi dua sisi akun — **Debit** dan **Kredit** — dengan nilai yang sama besar.

### 7.1 Lima Kategori Akun

| Kategori | Saldo Normal | Contoh Akun |
|----------|--------------|-------------|
| **Aset** | Debit | Kas, Kas Bank, Piutang, Persediaan, Peralatan |
| **Liabilitas** | Kredit | Utang Usaha, Utang Bank |
| **Ekuitas** | Kredit | Modal, Prive, Laba Ditahan |
| **Pendapatan** | Kredit | Penjualan, Penjualan Lainnya |
| **Beban** | Debit | Beban Gaji, Listrik, Air, Internet, Sewa |

### 7.2 Prinsip Dasar yang Digunakan

> "Uang masuk ke akun **MANA** (Debit), dan sumbernya dari akun **MANA** (Kredit)."
> - **Debit** = kemana uang/nilai bertambah
> - **Kredit** = dari mana sumber/nilai berkurang

### 7.3 Contoh Penjurnalan

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

### 7.4 Catatan Penting (Diambil dari Hasil Riset Pengembang)

- ❗ **Bayar piutang ≠ beban** — pelunasan piutang bukan pengeluaran beban, melainkan perubahan bentuk aset (dari Piutang menjadi Kas).
- ❗ **Bayar piutang ≠ pendapatan** — pendapatan sudah dicatat saat penjualan terjadi (baik tunai maupun piutang), bukan saat piutang dilunasi.

---

## 8. Algoritma Deteksi Akun Otomatis

Inti dari aplikasi ini adalah mesin deteksi otomatis di `assets/js/modules/inputTransaksi.js` yang mengubah kalimat bebas (*natural language sederhana*) menjadi pasangan akun Debit-Kredit. Proses ini terdiri dari **3 tahap fungsi**:

### 8.1 Master Data Akun — `AKUN_RULES`

Daftar akun didefinisikan sebagai array objek dengan struktur:

```javascript
{ kode: "101", nama: "Kas", kategori: "aset", saldoNormal: "debit", idnama: "kas" }
```

- `kode` — kode akun (mengikuti pola kode akun akuntansi: 1xx = Aset, 2xx = Liabilitas, 3xx = Ekuitas, 4xx = Pendapatan, 5xx = Beban).
- `kategori` — salah satu dari: `aset`, `liabilitas`, `ekuitas`, `pendapatan`, `beban`.
- `saldoNormal` — posisi saldo normal akun (`debit` atau `kredit`).
- `idnama` — kata kunci (keyword) yang dicari di dalam kalimat keterangan transaksi (huruf kecil).

### 8.2 Tahap 1 — `detectAkunUtama(keterangan)`

Menentukan **akun utama** (akun yang paling relevan/spesifik) dari kalimat keterangan, dengan urutan aturan (rule) prioritas:

1. Jika kalimat mengandung "piutang" **dan** ("penjualan" atau "jual") → akun utama = **Piutang**.
2. Jika kalimat mengandung "beli"/"membeli"/"pembelian" **dan** menyebut aset selain kas → akun utama = aset tersebut (misal **Peralatan**).
3. Jika mengandung "bayar utang bank" → akun utama = **Utang Bank**.
4. Jika mengandung "bayar utang" (umum) → akun utama = **Utang Usaha**.
5. Jika mengandung "bayar piutang"/"terima piutang"/"pelunasan piutang" → akun utama = **Piutang**.
6. Default: cari semua akun yang `idnama`-nya cocok dengan kalimat, lalu urutkan berdasarkan **prioritas kategori** (`PRIORITAS_KATEGORI = ["pendapatan", "beban", "liabilitas", "ekuitas", "aset"]`) dan ambil kandidat pertama.

> Jika tidak ada satu pun akun yang cocok, sistem akan menolak transaksi dan menampilkan pesan validasi (lihat `isKeteranganValid`).

### 8.3 Tahap 2 — `detectAkunLawan(akunUtama, keterangan)`

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

### 8.4 Tahap 3 — `tentukanDebitKredit(transaksi)`

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

### 8.5 Diagram Alur Deteksi Akun

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

## 9. Struktur & Skema Data (localStorage)

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

### 9.1 Struktur Objek Transaksi (Jurnal Umum)

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

### 9.2 Isolasi Data per Pengguna

Fungsi `getUserStorageKey(baseKey)` pada `storage.js` membuat key unik berdasarkan username yang sedang login, sehingga setiap pengguna memiliki ruang data transaksi yang terpisah:

```javascript
function getUserStorageKey(baseKey) {
