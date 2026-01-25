# 🎬 Moodflix — Dokumentasi Proyek

Dokumentasi ini menjelaskan struktur, arsitektur, alur kerja, dan instruksi menjalankan proyek berdasarkan analisis kode sumber yang ada. Semua informasi ditulis sesuai kode di repository — tidak menambahkan fitur yang tidak ada.

---

## Deskripsi Singkat

Moodflix adalah aplikasi single-page (SPA) front-end untuk rekomendasi film. Aplikasi menggabungkan metadata dari TMDB dan rekomendasi berbasis teks bebas melalui layanan AI eksternal (DeepSeek), dengan fokus pada UX interaktif: rekomendasi berdasarkan mood, penjelajahan genre, halaman Film AI untuk kueri teks, serta modal pencarian dan detail film.

---

## Latar Belakang / Tujuan

Tujuan proyek ini adalah menyediakan antarmuka yang memungkinkan pengguna menemukan film sesuai preferensi (mood/genre/teks) dengan cara yang mudah dan interaktif. Proyek juga berfungsi sebagai demonstrasi integrasi beberapa API eksternal (TMDB dan layanan AI), serta teknik caching dan client-side scoring sederhana untuk rekomendasi.

---

## Fitur Utama (sesuai kode)

- Rekomendasi berbasis mood (client-side scoring) — implemented di `resources/js/utils/moodRecommender.js` dan dipakai di `resources/js/Pages/RekomendasiUtama.jsx`.
- Penjelajahan berdasarkan genre dengan pil horizontal (`resources/js/Pages/BerdasarkanGenre.jsx`).
- Film AI: halaman input teks bebas yang memanggil endpoint proxy server (`POST /api/recommendations/deepseek`) untuk mendapatkan saran dari DeepSeek (`resources/js/Pages/FilmAI.jsx`).
- Dashboard: kumpulan film unggulan (pilihan berdasarkan genre/popularitas) (`resources/js/Pages/Dashboard.jsx`).
- Pencarian cepat dan tampilan detail film melalui modal (`resources/js/Components/SearchInput.jsx`, `MovieModal.jsx`).
- Perekaman interaksi pengguna (model `UserMovieInteraction`) melalui API `POST /api/recommendations/interaction`.
- Animasi/transition UI berbasis Tailwind (mount flags seperti `initialMounted` dan `cardsMounted`).

> Catatan: tidak ada implementasi server-side rendering yang khusus—front-end berjalan sebagai SPA React (lihat `resources/js/app.jsx` yang memakai `react-router`).

---

## Tampilan Aplikasi (Screenshots)

Gambar disimpan di `resources/UI`. Berikut daftar gambar sesuai fungsinya:

- **Dashboard** — `resources/UI/Halaman_Dashboard.png`
    - Tampilan kartu film unggulan (4 kartu), dipakai sebagai ringkasan pilihan.

- **Rekomendasi Utama** — `resources/UI/Halaman_RekomendasiUtama.png`
    - Baris horizontal kartu film yang diprioritaskan berdasarkan mood terpilih; ada pil mood di atas untuk memilih kategori mood.

- **Berdasarkan Genre** — `resources/UI/Halaman_BerdasarkanGenre.png`
    - Pil genre horizontal dengan kontrol scroll kiri/kanan; daftar film muncul di area bawah.

- **Film AI** — `resources/UI/Halaman_FilmAI.png`
    - Halaman dengan area input teks besar (textarea) untuk kueri free-text; hasil (output AI) muncul di bawah input.

Gunakan gambar-gambar ini untuk verifikasi tampilan saat menjalankan aplikasi secara lokal.

---

## Teknologi yang Digunakan

- Backend: PHP 8.x, Laravel 10
- Frontend: React 18, React Router (SPA), Vite
- Styling: Tailwind CSS
- HTTP: `fetch` dan `axios` (axios diinisialisasi di `resources/js/bootstrap.js`)
- Dependency management: Composer (PHP), npm (JS)
- Integrasi eksternal:
    - TMDB (metadata film) — helper `app/Services/TMDBService.php` melakukan panggilan ke TMDB.
    - DeepSeek (AI free-text) — dipanggil melalui proxy server di `RecommendationController::deepseekQuery()`.

---

## Struktur Folder (ringkas & relevan)

- `app/`
    - `Http/Controllers/RecommendationController.php` — endpoint rekomendasi, proxy DeepSeek, record interaction.
    - `Services/TMDBService.php` — helper untuk memanggil TMDB (popular, genres, search, details).
    - `Models/Genre.php`, `Models/UserMovieInteraction.php` — model data.

- `routes/api.php` — semua API route untuk frontend (`/movies/*`, `/recommendations/*`).

- `resources/js/`
    - `app.jsx` — entry SPA (React Router).
    - `Pages/` — `Dashboard.jsx`, `RekomendasiUtama.jsx`, `BerdasarkanGenre.jsx`, `FilmAI.jsx`.
    - `Components/` — `SearchInput.jsx`, `MovieCard.jsx`, `FeaturedMovieCard.jsx`, `MovieModal.jsx`, `Modal.jsx`, `Pagination.jsx`, dll.
    - `utils/` — `apiClient.js` (wrapper untuk `/api/`), `moodRecommender.js` (scoring logic).

- `resources/UI/` — screenshot dokumentasi.
- `database/migrations/` — skema `genres` dan `user_movie_interactions`.

---

## Cara Menjalankan Project (step-by-step)

Langkah berikut mengasumsikan Anda bekerja di mesin pengembangan lokal.

1. Install dependensi PHP

```powershell
composer install
```

2. Install dependensi JS dan jalankan dev server Vite

```powershell
npm install
npm run dev
```

3. Konfigurasi environment

- Salin `.env.example` menjadi `.env` jika belum ada.
- Tambahkan atau perbarui variabel berikut (contoh):

```dotenv
# TMDB (direkomendasikan dipindahkan dari kode ke ENV jika Anda ingin aman)
TMDB_API_KEY=your_tmdb_api_key

# DeepSeek
DEEPSEEK_API_URL=https://api.deepseek.com/v1/query
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

> Penting: `DEEPSEEK_API_URL` harus mengarah ke endpoint penerima POST yang benar (bukan sekadar domain root). Jika API provider mengharuskan path khusus, isi path tersebut.

4. (Opsional) Generate key dan migrasi database

```powershell
php artisan key:generate
php artisan migrate
```

5. Jalankan server Laravel

```powershell
php artisan serve
```

6. Buka browser di `http://127.0.0.1:8000` dan navigasi ke halaman yang relevan:

- `/` — dashboard
- `/rekomendasi-utama` — rekomendasi berdasarkan mood
- `/berdasarkan-genre` — jelajah genre
- `/film-ai` — input teks AI

---

## Catatan Tambahan & Keterbatasan (jujur)

- **DeepSeek payload**: Proxy server mengirim JSON `{ q: "<teks>" }` ke `DEEPSEEK_API_URL`. Jika penyedia DeepSeek mengharuskan nama parameter lain (mis. `prompt`), controller perlu disesuaikan.

- **TMDBService**: `app/Services/TMDBService.php` menyimpan token di kode sumber. Untuk keamanan, pindahkan kunci ini ke file `.env` dan baca via `env('TMDB_API_KEY')`.

- **Inertia vs React Router**: Composer mendaftarkan paket Inertia, tetapi frontend menggunakan `react-router`. Aplikasi berjalan sebagai SPA React.

- **Pengujian AI**: Jika hasil AI kosong, jalankan uji manual terhadap proxy untuk melihat status/respon upstream. Contoh:

```bash
curl -i -X POST http://127.0.0.1:8000/api/recommendations/deepseek \
  -H "Content-Type: application/json" \
  -d '{"q":"cari film komedi romantis terbaru"}'
```

---

## Rencana Perbaikan / Pengembangan yang Direkomendasikan

- Pindahkan credential TMDB ke `.env` dan ubah `TMDBService` agar menggunakan `env()`.
- Sesuaikan payload proxy DeepSeek sesuai dokumentasi layanan.
- Tambahkan parsing respons DeepSeek di server agar frontend menerima format teks yang konsisten.
- Tambahkan test unit/integrasi untuk `moodRecommender` dan endpoint proxy DeepSeek.

---

Jika Anda ingin, saya dapat langsung memperbaiki `TMDBService` agar membaca `TMDB_API_KEY` dari `.env`, atau menyesuaikan payload proxy DeepSeek jika Anda memberikan dokumentasi API DeepSeek (contoh request/response).

```

```
