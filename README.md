# 🎬 Moodflix — Dokumentasi Proyek

## Deskripsi Singkat

Moodflix adalah aplikasi single-page (SPA) front-end untuk rekomendasi film. Aplikasi menggabungkan metadata film dari TMDB dengan sistem rekomendasi berbasis mood dan genre, serta berfokus pada UX interaktif seperti penjelajahan film, pencarian cepat, dan tampilan detail film melalui modal.

---

## Latar Belakang / Tujuan

Tujuan proyek ini adalah menyediakan antarmuka yang memungkinkan pengguna menemukan film sesuai preferensi (mood dan genre) dengan cara yang mudah dan interaktif. Proyek ini juga berfungsi sebagai demonstrasi integrasi API eksternal (TMDB), pengelolaan state di React, serta penerapan client-side scoring sederhana untuk rekomendasi film.

---

## Fitur Utama (sesuai kode)

Rekomendasi berbasis mood (client-side scoring)
→ Diimplementasikan di resources/js/utils/moodRecommender.js dan digunakan pada resources/js/Pages/RekomendasiUtama.jsx.

Penjelajahan film berdasarkan genre
→ Menggunakan pil genre horizontal pada resources/js/Pages/BerdasarkanGenre.jsx.

Dashboard film unggulan
→ Menampilkan pilihan film berdasarkan genre dan popularitas (resources/js/Pages/Dashboard.jsx).

Pencarian cepat film
→ Komponen pencarian dengan hasil instan (resources/js/Components/SearchInput.jsx).

Tampilan detail film menggunakan modal (popup)
→ Tanpa berpindah halaman (MovieModal.jsx, Modal.jsx).

Perekaman interaksi pengguna
→ Melalui model UserMovieInteraction dan endpoint API POST /api/recommendations/interaction.

Animasi dan transisi UI
→ Menggunakan Tailwind CSS dan state mount (initialMounted, cardsMounted) untuk efek masuk komponen.

Catatan: Aplikasi berjalan sepenuhnya sebagai SPA React menggunakan react-router, tanpa server-side rendering.

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
    - Halaman dengan area input teks besar (textarea) untuk kueri free-text.

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

````dotenv
# TMDB (direkomendasikan dipindahkan dari kode ke ENV jika Anda ingin aman)
TMDB_API_KEY=your_tmdb_api_key

4. (Opsional) Generate key dan migrasi database

```powershell
php artisan key:generate
php artisan migrate
````

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

- **TMDBService**: `app/Services/TMDBService.php` menyimpan token di kode sumber. Untuk keamanan, pindahkan kunci ini ke file `.env` dan baca via `env('TMDB_API_KEY')`.

- **Inertia vs React Router**: Composer mendaftarkan paket Inertia, tetapi frontend menggunakan `react-router`. Aplikasi berjalan sebagai SPA React.

## Rencana Perbaikan / Pengembangan yang Direkomendasikan

- Pindahkan credential TMDB ke `.env` dan ubah `TMDBService` agar menggunakan `env()`.
- Sesuaikan payload proxy DeepSeek sesuai dokumentasi layanan.
- Tambahkan parsing respons DeepSeek di server agar frontend menerima format teks yang konsisten.
- Tambahkan test unit/integrasi untuk `moodRecommender` dan endpoint proxy DeepSeek.
