# 🎬 YukNonton - Platform Streaming Film & Serial TV (Sub Indo)

> Kloning antarmuka web streaming modern bertema Netflix dengan arsitektur responsif, pemutar multi-server, navigasi musim/episode lengkap, dan sistem pencarian instan.

---

> [!CAUTION]
> ### ⚠️ PERINGATAN KERAS & DISCLAIMER HUKUM (EDUCATIONAL PURPOSES ONLY)
> **PROYEK INI DIBUAT SEMATA-MATA UNTUK TUJUAN PENDIDIKAN, RISET ARSITEKTUR WEB, DAN PEMBELAJARAN PEMROGRAMAN.**
>
> 1. **DILARANG KERAS** menggunakan repositori ini untuk tujuan komersial, kegiatan pembajakan film (*digital movie piracy*), distribusi materi ilegal, atau tindakan apa pun yang melanggar **HAK CIPTA (COPYRIGHT INFRINGEMENT)**.
> 2. **TIDAK ADA KONTEN YANG DI-HOST**: Repositori ini **TIDAK MENYIMPAN, MENGUNGGAH, ATAU MENDISTRIBUSIKAN** berkas video film atau serial TV apa pun di server. Seluruh konten media, gambar, dan tautan streaming berasal dari penyedia pihak ketiga publik (*third-party embed/API services*).
> 3. Segala bentuk penggunaan materi berhak cipta tanpa izin dari pemegang hak cipta yang sah adalah tindakan melanggar hukum di berbagai yurisdiksi. Pembuat repositori dan kontributor **TIDAK BERTANGGUNG JAWAB** atas penyalahgunaan kode program ini oleh pihak mana pun.
> 4. Dukung selalu industri perfilman resmi dengan menonton karya para kreator melalui platform legal berlisensi (Netflix, Disney+, Prime Video, HBO, bioskop resmi, dll).

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Panduan Menjalankan Secara Lokal](#-panduan-menjalankan-secara-lokal)
- [Panduan Deployment](#-panduan-deployment)
  - [1. Deploy ke GitHub Pages (Statis)](#1-deploy-ke-github-pages-statis)
  - [2. Deploy ke Vercel (Serverless / Full API)](#2-deploy-ke-vercel-serverless--full-api)
- [Dokumentasi API Endpoints](#-dokumentasi-api-endpoints)
- [Navigasi & Pintasan Keyboard](#-navigasi--pintasan-keyboard)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

- 🍿 **Tampilan Desain Netflix Premium**:
  - Tampilan *Dark Mode* elegan dengan efek gradien sinematik *hero vignette*.
  - Billboard Hero film pilihan beresolusi tinggi dengan indikator kualitas *4K Ultra HD* dan ranking harian.
  - **Top 10 Tayangan Hari Ini di Indonesia** dengan tipografi angka raksasa khas Netflix yang berubah aksen merah saat disorot kursor (*hover*).
  - Efek hover kartu 3D zoom dan bayangan *red glow* interaktif pada setiap judul tayangan.

- 📺 **Serial TV Lengkap dengan Musim & Episode**:
  - Modal detail komprehensif menampilkan ringkasan cerita (sinopsis), tahun rilis, rating usia, durasi, genre, dan daftar aktor/aktris (*cast*).
  - **Season Selector**: Pemilih musim dinamis untuk serial TV dengan daftar episode lengkap (thumbnail adegan, nomor episode, judul, dan durasi).
  - Rekomendasi tayangan terkait (*More Like This*).

- ⚡ **Multi-Server Streaming Player Overlay**:
  - **Server HD 1 (VidLink Full HD)**: Resolusi 1080p/4K tanpa lag.
  - **Server HD 2 (MultiEmbed VIP)**: Jalur alternatif cadangan bebas buffering.
  - **Server HD 3 (AutoEmbed Ultra)**: Jalur streaming berkecepatan tinggi.
  - **Stremio Desktop Integration**: Dukungan pembukaan tautan langsung ke pemutar aplikasi Stremio Desktop.
  - **Demo HLS Player**: Pemutar video kustom internal HLS (`.m3u8`) dengan *progress scrubber*, pengatur volume presisi, tombol layar penuh (*fullscreen*), dan opsi subtitle multi-bahasa (Bahasa Indonesia & English).

- 🔍 **Pencarian Live Instan**:
  - Fitur pencarian *debounced* tanpa perlu me-refresh halaman untuk mencari judul film, serial, maupun genre favorit.

- 🏷️ **Kategori & Filter Genre Dinamis**:
  - Navigasi cepat: **Home**, **TV Shows**, **Movies**, **New & Popular**, dan **My List**.
  - Dropdown genre lengkap: *Adventure, Action, Animation, Comedy, Drama, Thriller, Romance, Science Fiction, Crime, Horror*.

- 💖 **My List (Daftar Saya)**:
  - Menyimpan film favorit ke penyimpanan lokal (*browser localStorage*) secara instan dan permanen.
  - Indikator *badge counter* realtime di navbar desktop maupun bilah subnavigasi mobile.
  - Fitur hapus satu per satu atau kosongkan seluruh daftar secara praktis.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Struktur Web** | HTML5 Semantik | Struktur antarmuka SPA (*Single Page Application*) yang ringan dan cepat. |
| **Styling & Desain** | Tailwind CSS + Vanilla CSS | Menggunakan Tailwind CSS CDN dan `style.css` untuk desain sistem Netflix kustom. |
| **Ikon Antarmuka** | Lucide Icons | Kumpulan ikon vektor modern yang tajam dan responsif. |
| **Pemutar Video** | Hls.js | Pustaka pemutar streaming HTTP Live Streaming (HLS) berbasis JavaScript murni. |
| **Logika Klien** | Vanilla JavaScript (ES6+) | Pengontrol aplikasi `NetflixApp` modular tanpa ketergantungan framework berat. |
| **Backend & API** | Node.js & Express.js | Server penyuplai RESTful API, penyedia metadata, dan resolver multi-server. |

---

## 📂 Struktur Direktori

```
nontonfilm/
├── css/
│   └── style.css            # Desain sistem Netflix, efek angka Top 10, & animasi slider
├── js/
│   └── app.js               # Logika klien (kategori, filter genre, modal, player, My List)
├── public/                  # Salinan aset statis untuk mode Express/Vercel
│   ├── css/style.css
│   ├── js/app.js
│   └── index.html
├── catalog-seed.json        # Data cache offline katalog film & serial unggulan
├── index.html               # Halaman utama aplikasi (berada di root untuk GitHub Pages)
├── package.json             # Manifes dependensi Node.js (express, cors)
├── server.js                # Server backend Express & API resolvers
├── vercel.json              # Konfigurasi deployment serverless ke Vercel
├── LICENSE                  # Lisensi kode sumber
└── README.md                # Dokumentasi lengkap & pernyataan disclaimer
```

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- Pastikan komputer Anda telah terpasang **Node.js** (versi 18 ke atas) dan **npm**.

### Langkah-langkah:
1. **Clone repositori**:
   ```bash
   git clone https://github.com/masisparmo/nontonfilm.git
   cd nontonfilm
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server aplikasi**:
   ```bash
   npm start
   ```
   Atau untuk mode pengembangan (*auto-restart* saat berkas diubah):
   ```bash
   npm run dev
   ```

4. **Buka di peramban (browser)**:
   Akses alamat berikut di browser Anda:
   👉 **`http://localhost:3000`**

---

## 🌐 Panduan Deployment

Repositori ini telah dikonfigurasi secara fleksibel agar dapat dijalankan baik di **GitHub Pages** (gratis tanpa server) maupun di **Vercel** (serverless Node.js).

### 1. Deploy ke GitHub Pages (Statis)
Aplikasi ini sudah mendukung eksekusi statis dengan berkas `index.html` yang terletak di root dan deteksi *smart API fallback* di `app.js`.

1. Masuk ke halaman repositori Anda di GitHub: `https://github.com/masisparmo/nontonfilm`.
2. Klik tab **Settings** > pilih menu **Pages** di sebelah kiri.
3. Di bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`.
   - **Branch**: Pilih `main` dan folder `/ (root)`.
4. Klik tombol **Save**.
5. Situs Anda akan live di:
   👉 `https://masisparmo.github.io/nontonfilm/`

---

### 2. Deploy ke Vercel (Serverless / Full API)
Repositori ini menyertakan berkas konfigurasi [vercel.json](file:///d:/Aplikasi/Nonton%20Film/vercel.json) bawaan.

1. Buka dashboard [Vercel](https://vercel.com/) dan lakukan **Import Git Repository**.
2. Pilih repositori `masisparmo/nontonfilm`.
3. Klik **Deploy** (konfigurasi build akan terdeteksi otomatis melalui `@vercel/node`).
4. Situs Anda akan online dengan serverless API backend penuh.

---

## 🔌 Dokumentasi API Endpoints

Server Express menyediakan rute REST API berikut:

| Metode | Rute Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/catalog` | Mengambil seluruh katalog beranda (Hero, Top 10, Trending, Series, Kategori). Mendukung parameter `?refresh=true` untuk sinkronisasi paksa. |
| `GET` | `/api/genre/:genre` | Mengambil daftar film dan serial berdasarkan genre tertentu (*Adventure, Action, Animation, Comedy, dll*). |
| `GET` | `/api/search?q=:query` | Melakukan pencarian live berdasarkan kata kunci judul. |
| `GET` | `/api/detail/:id?type=:type` | Mengambil detail sinopsis lengkap, rating, cast, musim, dan daftar episode. |
| `GET` | `/api/stream/:type/:id` | Menghasilkan tautan multi-server streaming (*VidLink, MultiEmbed, AutoEmbed, Stremio, HLS*). Mendukung parameter `?season=1&episode=1`. |
| `GET` | `/api/subtitles/:lang` | Menyajikan berkas trek teks WebVTT untuk subtitle Bahasa Indonesia (`/id`) dan English (`/en`). |

---

## ⌨️ Navigasi & Pintasan Keyboard

Saat pemutar video overlay aktif:
- <kbd>Spasi</kbd> (`Space`) : Memutar (*Play*) atau Menjeda (*Pause*) tayangan video.
- <kbd>Esc</kbd> : Menutup pemutar video atau menutup modal detail tayangan.
- <kbd>F</kbd> : Masuk atau keluar dari mode Layar Penuh (*Fullscreen*).

---

## 📄 Lisensi

Kode sumber proyek ini dilisensikan di bawah lisensi [GNU General Public License v3.0](LICENSE).  
Ingat: Proyek ini didistribusikan untuk **tujuan pembelajaran dan studi semata**. Dilarang keras melanggar hak cipta.
