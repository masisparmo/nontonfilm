# 🎬 YukNonton - Platform Streaming Film & Serial TV (Sub Indo)

Kloning lengkap dari [https://streaming-project-eta.vercel.app/](https://streaming-project-eta.vercel.app/) dengan arsitektur modern bernuansa Netflix.

---

## ✨ Fitur Utama

- 🍿 **Tampilan Desain Netflix Premium**:
  - Dark mode dengan gradien sinematik vignette.
  - Billboard Hero film unggulan dilengkapi badge kualitas 4K & nomor ranking.
  - **Top 10 Tayangan Hari Ini** dengan tipografi angka raksasa khas Netflix beraksen merah saat di-hover.
  - Efek hover zoom 3D dan bayangan glow pada setiap kartu film/series.
- 📺 **Dukungan Film & Serial TV (Full Season & Episode)**:
  - Modal detail komprehensif (sinopsis, tahun, rating usia, durasi, genres, cast).
  - Navigasi pemilih musim (Season selector) dan daftar episode lengkap dengan thumbnail & deskripsi per episode.
- ⚡ **Multi-Server Streaming Switcher**:
  - **Server HD 1 (VidLink Full HD)**: Pemutar film/serial kualitas 1080p/4K bebas buffering.
  - **Server HD 2 (MultiEmbed VIP)**: Server alternatif cadangan.
  - **Server HD 3 (AutoEmbed Ultra)**: Server streaming berkecepatan tinggi.
  - **Stremio Desktop**: Tautan langsung ke aplikasi Stremio.
  - **Demo HLS Player**: Player kustom internal dengan progress scrubber, kontrol volume, subtitle multi-bahasa (ID & EN), dan full-screen.
- 🔍 **Live Instant Search**:
  - Pencarian debounced instan untuk mencari judul, orang, atau genre.
- 📑 **Kategori & Genre Filter**:
  - Navigasi cepat: Home, TV Shows, Movies, New & Popular, My List.
  - Dropdown genre lengkap: Adventure, Action, Animation, Comedy, Drama, Thriller, Romance, Science Fiction, Crime, Horror.
- 💖 **My List (Daftar Saya)**:
  - Menyimpan film favorit ke local storage browser secara realtime.
  - Counter badge pada navbar & mobile subnav.
  - Kemudahan menghapus atau memutar film langsung dari daftar.

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Pastikan Node.js terpasang** (disarankan Node 18+ atau lebih baru).
2. **Instal dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan server**:
   ```bash
   npm start
   ```
   Atau mode development dengan auto-reload:
   ```bash
   npm run dev
   ```
4. **Buka di browser**:
   ```
   http://localhost:3000
   ```

---

## 🌐 Cara Deploy ke Vercel

Proyek ini sudah dilengkapi file konfigurasi `vercel.json`. Untuk mendeploy ke Vercel:
1. Pastikan Anda telah memasang Vercel CLI (`npm i -g vercel`) atau import repositori ke akun dashboard [Vercel](https://vercel.com/).
2. Jalankan perintah:
   ```bash
   vercel
   ```
3. Ikuti instruksi di terminal hingga selesai.

---

## 📂 Struktur Proyek

```
.
├── public/
│   ├── css/
│   │   └── style.css       # Sistem desain Netflix, tipografi, & animasi
│   ├── js/
│   │   └── app.js          # Client-side controller (NetflixApp)
│   └── index.html          # Antarmuka web YukNonton
├── catalog-seed.json       # Cache offline katalog film & serial
├── package.json            # Dependensi Express & script runner
├── server.js               # Express API backend & static file server
├── vercel.json             # Konfigurasi deploy serverless Vercel
└── README.md               # Dokumentasi proyek
```
