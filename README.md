# 🎬 FilmAI — Aplikasi Rekomendasi Film

FilmAI adalah aplikasi single-page (SPA) berbasis **Laravel + Inertia.js (React)** yang menyediakan rekomendasi film dengan mengombinasikan metadata dari **TMDB** dan layanan **AI free-text (DeepSeek)**. Antarmuka pengguna dibangun menggunakan **Tailwind CSS** dan dibundel dengan **Vite**.

Aplikasi ini dirancang sebagai front-end rekomendasi film yang ringan, interaktif, dan responsif.

---

## ✨ Fitur Utama

- **Rekomendasi berbasis mood**
  Rekomendasi berdasarkan mood pengguna menggunakan algoritma ringan di sisi klien.

- **Penjelajahan berdasarkan genre**
  Navigasi genre menggunakan kontrol pil horizontal.

- **Film AI (AI Free-text Recommendation)**
  Input teks bebas untuk mendapatkan rekomendasi film dari layanan DeepSeek.

- **Pencarian cepat & detail film**
  Modal pencarian cepat dan tampilan detail film tanpa berpindah halaman.

---

## 🖼️ Screenshot

### Dashboard

![Dashboard](resources/UI/Halaman_Dashboard.png)

### Rekomendasi Utama

![Rekomendasi Utama](resources/UI/Halaman_RekomendasiUtama.png)

### Berdasarkan Genre

![Berdasarkan Genre](resources/UI/Halaman_BerdasarkanGenre.png)

### Film AI

![Film AI](resources/UI/Halaman_FilmAI.png)

---

## 🛠️ Teknologi yang Digunakan

**Backend**

- PHP 8.x
- Laravel

**Frontend**

- Inertia.js
- React
- Vite
- Tailwind CSS

**Integrasi Eksternal**

- TMDB API (metadata film)
- DeepSeek API (AI free-text)

---

## 📁 Struktur Proyek (Ringkas)

resources/
├── js/
│ ├── Pages/ # Halaman utama (Dashboard, FilmAI, dll.)
│ ├── Components/ # Komponen reusable
│ └── utils/ # Utilitas (mood recommender)
├── UI/ # Screenshot dokumentasi
app/
├── Http/Controllers/ # Controller Laravel
└── Services/
└── TMDBService.php

---

## 🚀 Menjalankan Proyek Secara Lokal

### Prasyarat

- PHP 8.x
- Composer
- Node.js 16+ (npm atau yarn)
- Database (opsional, MySQL)

---

### Langkah singkat

1. Install dependensi backend

```bash
composer install
```

2. Install dependensi frontend dan jalankan build

```bash
npm install
npm run dev
```

3. Konfigurasi environment

Salin `.env.example` menjadi `.env` dan tambahkan variabel yang diperlukan, misalnya:

```dotenv
TMDB_API_KEY=your_tmdb_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/query
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

Catatan:

- Pastikan `DEEPSEEK_API_URL` mengarah ke endpoint lengkap (bukan hanya domain root). Jika salah, proxy dapat mengembalikan 404 atau respon kosong.
- Jangan pernah meng-commit API key ke repository publik.

4. (Opsional) Generate application key & jalankan migrasi

```bash
php artisan key:generate
php artisan migrate
```

5. Jalankan server lokal

```bash
php artisan serve
```

Buka aplikasi di: http://127.0.0.1:8000 dan buka halaman Film AI untuk menguji input teks bebas.

---

## 🤖 Film AI — Alur Kerja

- Pada halaman Film AI, `SearchInput` mengirimkan kueri teks ke endpoint proxy server:

```
POST /api/recommendations/deepseek
```

- Endpoint proxy (`RecommendationController::deepseekQuery`) meneruskan permintaan ke `DEEPSEEK_API_URL` menggunakan header `Authorization: Bearer <DEEPSEEK_API_KEY>` sehingga kunci tetap aman di sisi server.

---

## 🧪 Troubleshooting

- Jika hasil AI kosong atau terjadi error:
    - Pastikan `DEEPSEEK_API_URL` sudah benar dan lengkap.
    - Pastikan `DEEPSEEK_API_KEY` valid.

- Uji endpoint proxy secara manual (contoh):

```bash
curl -i -X POST http://127.0.0.1:8000/api/recommendations/deepseek \
  -H "Content-Type: application/json" \
  -d '{"q":"cari film komedi romantis terbaru"}'
```

---

## 🧩 Catatan Pengembang

- Logika rekomendasi berbasis mood: `resources/js/utils/moodRecommender.js`
- Animasi UI dan logic mount ada di: `resources/js/Pages`

---

## 🤝 Kontribusi

- Buka issue terlebih dahulu untuk mendiskusikan perubahan.
- Sertakan screenshot jika perubahan berkaitan dengan UI.
- Gunakan commit kecil dan deskriptif.

---

## 📄 Lisensi

Proyek ini mengikuti lisensi paket yang digunakan dan ketentuan layanan API pihak ketiga (TMDB dan DeepSeek).

---

```

```
