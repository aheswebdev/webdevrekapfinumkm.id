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
  const username = getCurrentUsername();
  if (!username) return baseKey;
  const sanitized = username.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return `${baseKey}_${sanitized}`;
}
```

Contoh: jika username adalah `"Toko Hisna"`, maka key transaksinya menjadi `input_transaksi_toko_hisna`.

---

## 10. Penjelasan Detail Setiap File

### 10.1 `index.html`
Halaman tunggal (SPA) yang berisi:
- **Form Login / Register / Lupa Password** (`#loginContainer`) — ditampilkan jika pengguna belum login.
- **Konten utama aplikasi** (`#mainContent`) — berisi header, navigasi (`<nav>`), dan kontainer dinamis `<main id="app">` tempat seluruh modul merender tampilannya.
- **Modal konfirmasi password** (`#passwordModal`) — dipakai saat menghapus transaksi.
- Memuat seluruh skrip CDN (Font Awesome, Google Fonts, jsPDF, jsPDF-AutoTable) dan seluruh file JavaScript aplikasi secara berurutan di akhir `<body>`.

### 10.2 `assets/js/utils.js`
Kumpulan fungsi utilitas murni (*pure function*) yang dipakai di seluruh modul:

| Fungsi | Kegunaan |
|--------|----------|
| `formatRupiah(angka)` | Format angka menjadi mata uang Rupiah (`Intl.NumberFormat`) |
| `formatTanggal(tanggal)` | Format tanggal `YYYY-MM-DD` → `DD/MM/YYYY`, dengan parsing manual untuk menghindari pergeseran zona waktu |
| `generateId(prefix)` | Membuat ID unik berbasis `Date.now()` |
| `isNotEmpty(value)` | Validasi nilai tidak kosong |
| `isNumber(value)` | Validasi nilai berupa angka |

### 10.3 `assets/js/storage.js`
Lapisan abstraksi akses `localStorage`:
- `initStorage()` — inisialisasi struktur data awal jika belum ada.
- `getAllData()` / `saveAllData()` — akses storage umum (legacy).
- `getCurrentUsername()` — ambil username dari sesi aktif.
- `getUserStorageKey(baseKey)` — bangun key storage unik per-user.
- `getInputTransaksiForUser()` / `saveInputTransaksiForUser()` / `clearInputTransaksiForUser()` — CRUD data transaksi per pengguna, termasuk migrasi otomatis dari key lama (`input_transaksi` tanpa suffix username) ke key baru per-user.

### 10.4 `assets/js/app.js`
"Otak" navigasi dan autentikasi aplikasi:
- **Autentikasi:** `handleLoginSubmit`, `handleRegisterSubmit`, `handleForgotPasswordSubmit`, `logoutUser`, `checkAuth` — seluruh logika berbasis `localStorage` (key `keuanganUMKM_users`), **tanpa hashing password** (lihat [Bab 16](#16-keamanan--autentikasi)).
- **UI Auth:** `setAuthMessage`/`clearAuthMessage` (pesan error/sukses), `showAuthSection` (toggle antar form login/register/forgot).
- **Navigasi:** `bindNavigation`, `handleNavClick`, `setActiveNav`, `navigateTo(page)` — router SPA berbasis `switch-case` (lihat [Bab 6.2](#62-pola-routing-single-page-application)).
- **UI lain:** `toggleUserMenu` (dropdown user di header), event listener global untuk menutup dropdown saat klik di luar area.

### 10.5 `assets/js/modules/Dashboard.js`
Menampilkan ringkasan keuangan secara cepat: **Saldo Kas**, **Laba Bersih**, dan **Jumlah Transaksi**. Dihitung dengan iterasi seluruh transaksi lalu menjumlahkan sisi Debit/Kredit dari akun Kas dan kategori Pendapatan/Beban.

### 10.6 `assets/js/modules/inputTransaksi.js`
Modul terbesar dan terpenting — berisi:
- Form input transaksi + filter kategori jurnal.
- `AKUN_RULES` (master data akun) dan `PRIORITAS_KATEGORI`.
- Mesin deteksi akun: `detectAkunUtama`, `detectAkunLawan`, `getAkunTerdeteksi`, `isKeteranganValid`, `isPenguranganAkun`, `tentukanDebitKredit` (lihat [Bab 8](#8-algoritma-deteksi-akun-otomatis) untuk detail logikanya).
- `handleInputTransaksiSubmit` — validasi, konfirmasi, dan penyimpanan transaksi baru.
- `renderInputTransaksiList` — render tabel jurnal umum (2 baris per transaksi: baris Debit dan baris Kredit), dengan filter kategori.

### 10.7 `assets/js/modules/bukuBesar.js`
- `buildBukuBesar(jurnal)` — mengelompokkan seluruh baris jurnal menjadi *ledger* per nama akun, dengan struktur `{ [namaAkun]: { saldoNormal, rows: [...], saldo } }`.
- `renderAkunLedger(namaAkun, akunData)` — menghitung saldo berjalan (running balance) tiap baris sesuai `saldoNormal` akun, lalu merender tabel per akun.
- `renderBukuBesar()` — entry point yang mengurutkan jurnal berdasarkan tanggal lalu merender seluruh kartu akun.

### 10.8 `assets/js/modules/neracaSaldo.js`
- `hitungNeracaSaldo()` — agregasi total Debit dan Kredit per kode akun dari seluruh transaksi.
- `renderNeracaSaldo()` — merender tabel neraca saldo, menghitung saldo akhir tiap akun (Debit − Kredit jika `saldoNormal` debit, atau sebaliknya), serta total keseluruhan Debit dan Kredit (harus seimbang sesuai prinsip *double-entry*).

### 10.9 `assets/js/modules/labaRugi.js`
Menjumlahkan seluruh transaksi dengan akun lawan berkategori **pendapatan** (sisi Kredit) dan **beban** (sisi Debit), ditambah **total penyesuaian** (dibaca dari `localStorage["total_penyesuaian"]`, dihasilkan oleh modul Jurnal Penyesuaian), kemudian menghitung **Laba Bersih = Pendapatan − Beban**.

### 10.10 `assets/js/modules/arusKas.js`
Laporan arus kas sederhana (versi ringkas, belum dipisah per aktivitas operasi/investasi/pendanaan): menjumlahkan seluruh **Kas Masuk** (Kas di sisi Debit) dan **Kas Keluar** (Kas di sisi Kredit), menghasilkan **Saldo Kas Bersih**.

### 10.11 `assets/js/modules/perubahanModal.js`
Menghitung **Modal Akhir** dengan formula:

```
Modal Akhir = Modal Awal + Tambahan Modal + Laba Bersih − Prive
```

- `isModalAwal(keterangan)` membedakan transaksi "modal awal" (saat usaha pertama kali didirikan) dengan "tambahan modal" (penambahan modal di tengah periode), berdasarkan kata kunci pada keterangan.

### 10.12 `assets/js/modules/jurnalPenyesuaian.js`
Modul paling kompleks setelah `inputTransaksi.js`. Menangani **3 jenis penyesuaian**:
1. **Persediaan** — difilter otomatis dari transaksi yang melibatkan akun "Persediaan".
2. **Peralatan** — difilter otomatis dari transaksi yang melibatkan akun "Peralatan".
3. **HPP (Harga Pokok Penjualan)** — gabungan dari:
   - **Otomatis**: transaksi dengan kata kunci `"hpp"`, `"pemakaian"`, atau `"penyusutan"` di keterangan.
   - **Manual**: input form khusus, disimpan ke `localStorage["penyesuaian_hpp"]`, dengan deduplikasi berdasarkan `id`.

Hasil akhir (`totalAset - totalHPP`) disimpan ke `localStorage["total_penyesuaian"]` agar dapat dibaca kembali oleh modul Laba Rugi.

### 10.13 `assets/js/modules/Database.js`
Modul **histori transaksi** dan **export PDF**:
- `renderDatabase()` — menampilkan seluruh transaksi dalam format tabel jurnal (2 baris per transaksi: Debit & Kredit), dengan tombol hapus per baris.
- `deleteDatabaseTransaksi(id)` / `deleteAllDatabaseTransaksi()` — proses hapus data, **dilindungi konfirmasi password** melalui modal (`bukaModalPassword`, `submitPassword`, `batalPassword`).
- `downloadDatabasePDF()` — fungsi utama pembuatan **PDF bergaya mutasi rekening bank/e-statement** menggunakan **jsPDF** + **jsPDF-AutoTable** (dijelaskan detail di [Bab 13](#13-fitur-export-pdf-mutasi-transaksi)).
- `rupiahPDF(n)` — helper format mata uang khusus untuk konten PDF (lebih ringkas dari `formatRupiah`).

### 10.14 `assets/css/style.css`
Berisi seluruh tampilan visual aplikasi (±1700 baris), terbagi menjadi beberapa kelompok besar:
- Halaman login (gradient gelap, animasi gelembung/`bubbles`, kartu form).
- Layout utama (header, navigasi, footer, grid dashboard).
- Komponen tabel laporan (jurnal, buku besar, neraca saldo, dll).
- Komponen modal (konfirmasi password).
- Kelas utilitas (`.text-right`, `.text-green`, `.text-red`, `.hidden`, dll).

---

## 11. Alur Kerja Sistem (Flow Aplikasi)

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
│ Mesin Deteksi Akun (Bab 8)            │
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

## 12. Modul Laporan Keuangan

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

## 13. Fitur Export PDF (Mutasi Transaksi)

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

## 14. Cara Instalasi & Menjalankan Aplikasi

Karena aplikasi ini berbasis **client-side murni** (tanpa backend/server, tanpa proses build/compile), cara menjalankannya sangat sederhana:

### Opsi 1 — Membuka Langsung di Browser
1. Ekstrak folder proyek (`HISNA UMKM FIX ZQ V.3.0.0.6.2.6`).
2. Buka file `index.html` dengan double-click, atau klik kanan → *Open with* → browser pilihan (Chrome/Edge/Firefox).
3. Pastikan komputer/perangkat terhubung internet (untuk memuat Google Fonts, Font Awesome, jsPDF, dan jsPDF-AutoTable dari CDN).

### Opsi 2 — Menjalankan via Local Web Server (disarankan)
Beberapa browser membatasi fitur tertentu saat dibuka via `file://`. Disarankan menjalankan via server lokal sederhana, contoh menggunakan Python:

```bash
cd "HISNA UMKM FIX ZQ V.3.0.0.6.2.6"
python -m http.server 8080
```

Lalu buka `http://localhost:8080` di browser.

Atau menggunakan ekstensi **Live Server** pada VS Code.

### Kebutuhan Sistem
- Browser modern (Chrome, Edge, Firefox, Safari versi terbaru) yang mendukung `localStorage` dan ES6 JavaScript.
- Tidak memerlukan Node.js, database, ataupun instalasi dependency apa pun.

---

## 15. Cara Penggunaan Aplikasi

1. **Daftar Akun** — klik "Daftar Akun" pada halaman login, isi username & password.
2. **Login** — masuk menggunakan akun yang telah didaftarkan.
3. **Input Transaksi** — buka menu *Jurnal Umum*, isi tanggal, keterangan (gunakan kata kunci nama akun, misal: *"kas penjualan"*, *"bayar listrik"*, *"setor modal awal"*), dan jumlah, lalu klik **Simpan**.
4. **Lihat Laporan** — buka menu *Buku Besar*, *Neraca Saldo*, *Laba Rugi*, *Arus Kas*, atau *Perubahan Modal* — seluruh laporan akan otomatis tersusun dari transaksi yang sudah diinput.
5. **Jurnal Penyesuaian** — untuk transaksi yang melibatkan persediaan/peralatan/HPP, buka menu *Jurnal Penyesuaian* untuk melihat rekap otomatis atau menambah penyesuaian manual.
6. **Histori & Export PDF** — buka menu *Histori*, lihat seluruh riwayat transaksi, lalu klik **📥 Download Mutasi Transaksi** untuk mengunduh laporan PDF.
7. **Hapus Data** — gunakan tombol 🗑️ (per transaksi) atau "Hapus Semua Transaksi", lalu masukkan password akun untuk konfirmasi.
8. **Logout** — klik avatar pengguna di kanan atas → Logout.

### Contoh Kalimat Keterangan yang Dikenali Sistem
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

## 16. Keamanan & Autentikasi

> ⚠️ **Catatan penting untuk laporan skripsi:** aplikasi ini dibangun sebagai **studi kasus/prototipe** pencatatan keuangan otomatis, **bukan** aplikasi produksi yang aman. Beberapa hal yang perlu disebutkan sebagai keterbatasan keamanan:

- **Password disimpan dalam bentuk plain text** di `localStorage` (tidak ada hashing/enkripsi seperti bcrypt). Ini **tidak aman** untuk lingkungan produksi nyata, dan sebaiknya disebutkan secara eksplisit sebagai keterbatasan dalam laporan skripsi.
- **Data tersimpan di sisi klien (browser)**, sehingga: (1) data tidak dapat diakses dari perangkat lain, (2) data dapat hilang jika *cache*/`localStorage` browser dibersihkan, (3) tidak ada *backup* otomatis ke server.
- **Tidak ada enkripsi transport** karena tidak ada komunikasi client-server (semua logika berjalan lokal di browser pengguna).
- Konfirmasi hapus data menggunakan password akun sebagai langkah mitigasi sederhana terhadap penghapusan data tidak sengaja.

---

## 17. Keterbatasan Aplikasi

1. Mesin deteksi akun berbasis **pencocokan kata kunci sederhana** (bukan *Natural Language Processing*/AI sungguhan), sehingga sensitif terhadap variasi kalimat yang tidak terdaftar dalam `idnama`.
2. Tidak mendukung multi-mata uang (hanya Rupiah).
3. Tidak ada fitur edit transaksi (hanya tambah dan hapus).
4. Laporan Arus Kas belum dipisahkan menjadi 3 aktivitas standar (operasi, investasi, pendanaan) — masih versi ringkas (kas masuk vs kas keluar).
5. Data tidak tersinkronisasi antar perangkat/browser (tidak ada server/database terpusat).
6. Tidak ada *role/permission* (misalnya admin vs staf); setiap akun setara.
7. Belum ada fitur cetak/ekspor untuk laporan selain Histori (Buku Besar, Neraca Saldo, Laba Rugi, dll. belum bisa diunduh PDF).

---

## 18. Rencana Pengembangan Selanjutnya

1. Migrasi penyimpanan data dari `localStorage` ke backend (database) seperti MySQL/PostgreSQL + REST API, agar data dapat diakses dari berbagai perangkat.
2. Implementasi hashing password (misalnya bcrypt) bila autentikasi dipindahkan ke backend.
3. Penambahan fitur edit transaksi.
4. Pemisahan Laporan Arus Kas menjadi 3 aktivitas standar (operasi, investasi, pendanaan) sesuai PSAK/SAK EMKM.
5. Peningkatan mesin deteksi akun, misalnya dengan pendekatan *machine learning*/NLP untuk pengenalan kalimat yang lebih fleksibel ("logika AI" — sebagaimana disebutkan dalam catatan pengembangan awal proyek).
6. Penambahan fitur export PDF untuk seluruh jenis laporan (tidak hanya histori/mutasi transaksi).
7. Penambahan grafik/visualisasi data (misalnya menggunakan Chart.js) pada Dashboard.
8. Penerapan standar akuntansi UMKM yang lebih lengkap, seperti SAK EMKM (Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah).

---

## 19. Daftar Pustaka / Referensi Teknis

- **jsPDF** — library JavaScript open-source untuk pembuatan dokumen PDF di sisi klien. https://github.com/parallax/jsPDF
- **jsPDF-AutoTable** — plugin jsPDF untuk pembuatan tabel otomatis pada dokumen PDF. https://github.com/simonbengtsson/jsPDF-AutoTable
- **Font Awesome** — pustaka ikon vektor untuk antarmuka web. https://fontawesome.com
- **Google Fonts (Quicksand)** — pustaka *web font* gratis dari Google. https://fonts.google.com
- **MDN Web Docs — Web Storage API (`localStorage`)** — dokumentasi resmi mekanisme penyimpanan data sisi klien pada browser. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Konsep akuntansi dasar (debit-kredit, jurnal umum, buku besar, neraca saldo, laporan laba rugi, laporan perubahan modal, laporan arus kas) mengacu pada prinsip *double-entry bookkeeping* yang umum diajarkan dalam mata kuliah Akuntansi Dasar/Pengantar Akuntansi.

---

## 20. Lampiran: Daftar Kode Akun (Chart of Accounts)

| Kode | Nama Akun | Kategori | Saldo Normal |
|------|-----------|----------|----------------|
| 101 | Kas | Aset | Debit |
| 102 | Kas Bank | Aset | Debit |
| 103 | Piutang | Aset | Debit |
| 104 | Persediaan | Aset | Debit |
| 105 | Peralatan | Aset | Debit |
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

> Sumber: `AKUN_RULES` pada `assets/js/modules/inputTransaksi.js` (kode 101–505) dan logika tambahan pada `assets/js/modules/jurnalPenyesuaian.js` (kode 511, khusus jurnal penyesuaian HPP).

---

## 21. Tools, Aplikasi, dan Alur Kerja Pengembangan (Development Workflow)

Bagian ini menjelaskan perangkat lunak dan alur kerja yang digunakan selama proses pengembangan aplikasi, yang relevan untuk dicantumkan pada bab Metodologi Penelitian/Pengembangan Sistem pada laporan skripsi.

### 21.1 Code Editor / IDE
| Aplikasi | Fungsi dalam Proyek |
|----------|----------------------|
| **Visual Studio Code (VS Code)** | Code editor utama untuk menulis dan mengedit seluruh file HTML, CSS, dan JavaScript proyek. |
| Ekstensi **Live Server** (VS Code) | Menjalankan aplikasi pada server lokal (`localhost`) secara real-time saat pengembangan, dengan auto-reload setiap file disimpan. |
| Ekstensi **Prettier** / **ESLint** *(opsional)* | Merapikan format kode dan mendeteksi potensi kesalahan penulisan JavaScript. |
| **Chrome DevTools** / **Edge DevTools** | Debugging JavaScript (console, breakpoint), inspeksi elemen HTML/CSS, serta pengecekan isi `localStorage` melalui tab *Application*. |

### 21.2 Version Control & Kolaborasi
| Aplikasi | Fungsi dalam Proyek |
|----------|----------------------|
| **Git** | Sistem version control untuk melacak setiap perubahan kode (commit history) selama proses pengembangan. |
| **GitHub** | Platform hosting repository online, sebagai tempat penyimpanan kode sumber (source code) sekaligus bukti riwayat pengembangan (commit log) yang dapat dilampirkan pada laporan skripsi. |
| **GitHub Desktop** *(opsional)* | Alternatif antarmuka grafis (GUI) untuk Git bagi yang tidak terbiasa menggunakan command line. |

### 21.3 Desain & Perancangan Antarmuka
| Aplikasi | Fungsi dalam Proyek |
|----------|----------------------|
| **Figma** *(opsional, jika digunakan)* | Merancang wireframe/mockup tampilan antarmuka sebelum diimplementasikan ke kode HTML/CSS. |
| **Draw.io / Lucidchart / Figma** | Membuat diagram pendukung skripsi seperti *flowchart* alur sistem, ERD/skema data, dan use case diagram. |
| Sketsa manual (kertas/Notes) | Tahap awal perancangan alur deteksi akun otomatis dan struktur menu sebelum dituangkan ke kode. |

### 21.4 Asisten Pengembangan Berbasis AI
| Aplikasi | Fungsi dalam Proyek |
|----------|----------------------|
| **Claude (Anthropic)** | Digunakan sebagai asisten pemrograman (*pair-programming assistant*) untuk membantu memperbaiki bug, merefactor kode, menyusun dokumentasi teknis, serta menyusun README ini. Penggunaan AI sebagai alat bantu pengembangan dapat disebutkan secara transparan pada bab Metodologi sebagai bagian dari pendekatan pengembangan modern (AI-assisted development). |

> 💡 **Catatan untuk laporan skripsi:** Penggunaan tools AI sebagai asisten coding sah untuk disebutkan pada bagian metodologi, sepanjang logika inti aplikasi (algoritma deteksi akun, struktur data, alur akuntansi) dipahami dan dapat dijelaskan sendiri oleh penulis saat sidang.

### 21.5 Pengujian Aplikasi
| Metode | Keterangan |
|--------|------------|
| **Manual Testing (Black-box)** | Pengujian dilakukan dengan mencoba berbagai skenario input transaksi dan memeriksa apakah laporan yang dihasilkan (jurnal, buku besar, neraca saldo, dst.) sudah benar secara akuntansi. |
| **Cross-browser Testing** | Aplikasi diuji pada beberapa browser (Chrome, Edge, Firefox) untuk memastikan tampilan dan fungsi `localStorage` berjalan konsisten. |
| **Device Testing (Responsif)** | Pengecekan tampilan pada ukuran layar berbeda (desktop, tablet, mobile) menggunakan fitur *Device Toolbar* pada Chrome DevTools. |

---

## 22. Panduan Setup Repository GitHub

Bagian ini berguna sebagai lampiran teknis cara mempublikasikan dan menjalankan proyek dari GitHub, sekaligus dapat dijadikan bukti dokumentasi proses pengembangan pada skripsi.

### 22.1 Mengunggah Proyek ke GitHub (Pertama Kali)
```bash
# 1. Masuk ke folder proyek
cd "HISNA UMKM FIX ZQ V.3.0.0.6.2.6"

# 2. Inisialisasi git
git init

# 3. Tambahkan seluruh file ke staging area
git add .

# 4. Buat commit pertama
git commit -m "Initial commit: HISNA UMKM v2.0"

# 5. Hubungkan ke repository GitHub (buat repo baru di github.com terlebih dahulu)
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git

# 6. Push ke GitHub
git push -u origin main
```

### 22.2 Struktur `.gitignore` yang Disarankan
```
# Tidak ada dependency/node_modules karena tanpa framework,
# namun jika menambahkan tools build di masa depan:
node_modules/
.DS_Store
*.log
.vscode/
```

### 22.3 Konvensi Commit (disarankan untuk riwayat pengembangan yang rapi)
| Prefix | Contoh | Keterangan |
|--------|--------|------------|
| `feat:` | `feat: tambah deteksi otomatis jurnal penyesuaian` | Penambahan fitur baru |
| `fix:` | `fix: perbaiki klasifikasi modal awal di perubahanModal.js` | Perbaikan bug |
| `refactor:` | `refactor: rapikan struktur Dashboard.js` | Perubahan kode tanpa mengubah fungsi |
| `docs:` | `docs: lengkapi README untuk laporan skripsi` | Perubahan dokumentasi |
| `style:` | `style: perbaiki tampilan UI dashboard` | Perubahan tampilan/CSS |

### 22.4 Mengkloning Ulang Proyek (di Perangkat Lain)
```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
# Buka index.html langsung, atau jalankan via Live Server / python -m http.server
```

### 22.5 Deploy Online *(opsional, untuk demo saat sidang)*
Karena aplikasi 100% client-side (tanpa backend), proyek ini dapat di-*deploy* gratis tanpa konfigurasi rumit:

| Platform | Cara Singkat |
|----------|--------------|
| **GitHub Pages** | Repository → *Settings* → *Pages* → pilih branch `main` dan folder root → simpan. Aplikasi otomatis dapat diakses via `https://USERNAME.github.io/NAMA-REPO/`. |
| **Netlify** | Drag-and-drop folder proyek ke dashboard Netlify, atau hubungkan langsung ke repository GitHub untuk auto-deploy setiap kali push. |
| **Vercel** | Import repository GitHub melalui dashboard Vercel, deploy otomatis tanpa konfigurasi build khusus. |

> Deploy online sangat berguna untuk demo aplikasi saat sidang skripsi karena penguji dapat mengakses aplikasi langsung lewat link tanpa perlu instalasi.

---

## 23. Dokumentasi Prototipe untuk Laporan Skripsi

Bagian ini merupakan panduan singkat menyusun bukti prototipe pada laporan/dokumen skripsi, sesuai kebutuhan umum format Bab III/IV (Implementasi & Pengujian).

### 23.1 Tahapan Prototipe yang Dapat Dilaporkan
1. **Analisis Kebutuhan** — identifikasi masalah pencatatan keuangan manual UMKM (lihat [Bab 1](#1-latar-belakang)).
2. **Perancangan (Design)** — wireframe/mockup alur menu, perancangan skema data `localStorage` (lihat [Bab 9](#9-struktur--skema-data-localstorage)), perancangan algoritma deteksi akun (lihat [Bab 8](#8-algoritma-deteksi-akun-otomatis)).
3. **Implementasi (Coding)** — penulisan kode menggunakan VS Code, diuji secara bertahap per modul (lihat [Bab 21.1](#21-tools-aplikasi-dan-alur-kerja-pengembangan-development-workflow)).
4. **Pengujian (Testing)** — black-box testing per fitur, cross-browser testing (lihat [Bab 21.5](#21-tools-aplikasi-dan-alur-kerja-pengembangan-development-workflow)).
5. **Evaluasi & Iterasi** — perbaikan bug dan penyempurnaan UI berdasarkan hasil pengujian dan diskusi dengan dosen pembimbing.

### 23.2 Saran Tangkapan Layar (Screenshot) untuk Lampiran
Untuk melengkapi bukti prototipe pada dokumen skripsi, disarankan menyertakan tangkapan layar berikut:
- Halaman Login & Registrasi.
- Dashboard ringkasan.
- Form Input Transaksi (Jurnal Umum) beserta contoh kalimat keterangan.
- Tabel Buku Besar (per akun).
- Tabel Neraca Saldo.
- Laporan Laba Rugi.
- Laporan Arus Kas.
- Laporan Perubahan Modal.
- Halaman Jurnal Penyesuaian.
- Halaman Histori Transaksi.
- Contoh hasil **Export PDF** (mutasi transaksi).
- Tampilan responsif pada perangkat mobile (opsional, untuk menunjukkan aplikasi mobile-friendly).

### 23.3 Tabel Pengujian (Contoh Format Black-box Testing)
| No | Skenario Pengujian | Input | Hasil yang Diharapkan | Status |
|----|---------------------|-------|------------------------|--------|
| 1 | Registrasi akun baru | Username & password valid | Akun tersimpan, redirect ke login | ✅ Sesuai |
| 2 | Login dengan password salah | Username benar, password salah | Muncul pesan error | ✅ Sesuai |
| 3 | Input transaksi "kas penjualan" | Tanggal, "kas penjualan", nominal | Debit: Kas, Kredit: Penjualan | ✅ Sesuai |
| 4 | Input transaksi tidak dikenali | Tanggal, kalimat acak, nominal | Muncul peringatan keterangan tidak dikenali | ✅ Sesuai |
| 5 | Export PDF histori transaksi | Klik tombol Download | File PDF mutasi transaksi terunduh | ✅ Sesuai |
| 6 | Hapus transaksi tanpa password benar | Password salah saat konfirmasi | Penghapusan dibatalkan | ✅ Sesuai |

> Tabel di atas hanya contoh format; lengkapi dengan skenario pengujian aktual sesuai hasil uji coba pribadi sebelum dilampirkan ke laporan skripsi.

---

## 📝 Catatan Penulis Asli ( Riwayat Pengembangan )

Bagian ini merupakan catatan pengembangan awal dari pembuat aplikasi ( M.Zaqi Mubarok & Al-Hisna Esya Sabila ), dipertahankan sebagai dokumentasi historis proses berpikir dan iterasi pengembangan:

- Logika dasar: *Buku Kas/Utang/Persediaan → Jurnal Umum → Buku Besar → Laba Rugi/Neraca*.
- Pemahaman prinsip: "Bayar tagihan/gaji termasuk Debit karena merupakan nilai yang digunakan"; "Prive adalah uang usaha yang dipakai untuk keperluan pribadi".
- Hasil diskusi dengan dosen pembimbing dilakukan melalui presentasi video fitur dan logika deteksi akun otomatis.
- Catatan perbaikan berkelanjutan: deteksi otomatis akun dari kalimat keterangan, penyempurnaan urutan menu dashboard, dan penanganan jurnal penyesuaian untuk persediaan/peralatan/HPP bulanan.

---

*Dokumen ini dapat digunakan sebagai lampiran teknis ( technical documentation ) pada laporan skripsi/tugas akhir terkait pengembangan sistem informasi akuntansi sederhana untuk UMKM.*
