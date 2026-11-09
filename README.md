# StudySpace — Implementasi Komponen Dasar Antarmuka (Tugas 2)

Repositori ini berisi implementasi komponen dasar antarmuka pengguna (UI) dari wireframe **StudySpace** (Halaman **Hasil Pencarian & Filter Pencarian Aktif**) menggunakan **HTML5 Semantik**, **CSS3 (Custom Properties)**, dan **Vanilla JavaScript** murni tanpa *framework*.

## Deskripsi Proyek
**StudySpace** adalah prototipe aplikasi web yang membantu mahasiswa menemukan tempat belajar di luar kelas berdasarkan ketersediaan fasilitas (Wi-Fi, Stopkontak, Meja, Kursi) dan estimasi suasana belajar (Tenang, Sedang, Ramai) agar waktu tidak habis hanya untuk mencari tempat yang cocok.

## Komponen Utama yang Diimplementasikan
1. **Header & Navigasi Responsif (`<header class="site-header">`)**: Memuat identitas StudySpace, menu navigasi, tombol *hamburger* untuk layar ponsel, dan lencana penghitung (*counter badge*) tempat favorit.
2. **Form Pencarian Tempat (`<form id="search-form">`)**: Input pencarian kata kunci nama tempat atau alamat lengkap dengan validasi panjang karakter dan umpan balik status.
3. **Panel Filter Fasilitas & Suasana (`<section class="filter-panel">`)**: Kumpulan *chip checkbox* fasilitas dan *chip radio* estimasi suasana beserta tombol aksi **Terapkan Filter** dan **Reset Filter**.
4. **Grid Kartu Tempat Belajar & Bar Status Hasil (`<section class="results-section">`)**: Menampilkan ringkasan dinamis jumlah tempat yang cocok dan kartu informasi tempat belajar (`<article class="place-card">`) dengan fitur tombol *toggle* **Simpan ke Favorit** dan pratinjau **Lihat Detail**.
5. **Footer Situs (`<footer class="site-footer">`)**: Informasi identitas singkat aplikasi dan keterangan prototipe data contoh.

## Struktur Proyek
```text
.
├── index.html   # Struktur dokumen utama dengan tag HTML5 semantik
├── styles.css   # Styling visual menggunakan CSS Custom Properties (:root), Flexbox, & Grid
├── script.js    # Logika interaktivitas DOM, filter pencarian, validasi, & counter favorit
└── README.md    # Dokumentasi deskripsi, struktur, dan panduan menjalankan proyek
