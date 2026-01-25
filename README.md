## FilmAI — Aplikasi Rekomendasi Film

Proyek ini adalah aplikasi single-page berbasis Laravel + Inertia/React yang memberikan rekomendasi film menggunakan kombinasi metadata TMDB dan layanan AI free-text (DeepSeek). Antarmuka dibuat dengan Tailwind CSS dan dibundel memakai Vite. Aplikasi dirancang sebagai front-end rekomendasi film ringan dengan mode penelusuran berikut:

- Rekomendasi utama berbasis mood (algoritma mood di sisi klien + kartu unggulan).
- Penjelajahan berdasarkan genre dengan kontrol pil horizontal.
- Film AI: input teks bebas yang mengirim kueri ke layanan DeepSeek untuk mendapat saran atau rekomendasi.
- Pencarian cepat (modal) dan tampilan detail film (MovieModal).

Di bawah ini terdapat dokumentasi singkat, petunjuk menjalankan secara lokal, dan screenshot yang ada pada folder `resources/UI`.

### Screenshot

- Rekomendasi Utama

![Rekomendasi Utama](resources/UI/Halaman_RekomendasiUtama.png)

- Berdasarkan Genre

![Berdasarkan Genre](resources/UI/Halaman_BerdasarkanGenre.png)

- Film AI (halaman input teks)

![Film AI](resources/UI/Halaman_FilmAI.png)

- Dashboard

![Dashboard](resources/UI/Halaman_Dashboard.png)

### Teknologi

- Backend: PHP 8.x, Laravel
- Frontend: Inertia.js + React, Vite, Tailwind CSS
- Integrasi eksternal: TMDB (untuk metadata film), DeepSeek (AI free-text)

### Struktur proyek (intinya)

- `resources/js/Pages` — halaman React utama (`FilmAI`, `RekomendasiUtama`, `BerdasarkanGenre`, `Dashboard`).
- `resources/js/Components` — komponen yang dapat digunakan ulang (`SearchInput`, `MovieCard`, `Modal`, `MovieModal`, dll.).
- `app/Http/Controllers` — controller Laravel untuk route API.
- `app/Services/TMDBService.php` — helper integrasi TMDB.
- `resources/UI` — screenshot yang dipakai dokumentasi ini.

## Menjalankan secara lokal (pengembangan)

Persiapan: PHP 8.x, Composer, Node 16+/npm atau Yarn, (opsional) MySQL.

1. Install dependensi PHP:

```powershell
composer install
```

2. Install dependensi JS dan build aset:

```powershell
npm install
npm run dev
```

3. Konfigurasi environment

Salin `.env.example` menjadi `.env` dan atur variabel penting. Contoh yang diperlukan untuk fitur AI:

```dotenv
# Endpoint DeepSeek (pastikan berisi path endpoint, mis. /v1/query jika diperlukan)
DEEPSEEK_API_URL=https://api.deepseek.com/v1/query
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# TMDB API key untuk metadata film
TMDB_API_KEY=your_tmdb_api_key
```

Catatan:

- Pastikan `DEEPSEEK_API_URL` menunjuk ke endpoint lengkap yang menerima POST JSON. Jika hanya diberikan domain root tanpa path, sering mengakibatkan respon kosong atau 404.
- Jangan pernah meng-commit `DEEPSEEK_API_KEY` atau kunci sensitif lainnya.

4. Generate aplikasi key dan jalankan migrasi (opsional jika menggunakan database):

```powershell
php artisan key:generate
php artisan migrate
```

5. Jalankan server lokal:

```powershell
php artisan serve
```

Buka `http://127.0.0.1:8000` lalu buka halaman Film AI untuk menguji input teks bebas.

## Film AI — cara kerja singkat

- Pada halaman Film AI, `SearchInput` mengirim kueri teks ke endpoint proxy server: `POST /api/recommendations/deepseek`.
- Endpoint proxy ada di `RecommendationController::deepseekQuery()` dan meneruskan (forward) permintaan ke `DEEPSEEK_API_URL` menggunakan header `Authorization: Bearer <DEEPSEEK_API_KEY>` sehingga kunci tetap aman di server.
- Jika layanan upstream mengembalikan error, proxy membalas dengan `status` dan potongan `body` (truncated) untuk membantu debugging tanpa menampilkan kunci.

## Troubleshooting singkat

- Hasil AI kosong: Periksa apakah `DEEPSEEK_API_URL` sudah benar termasuk path yang diperlukan (mis. `/v1/query`) dan pastikan `DEEPSEEK_API_KEY` valid.
- Uji proxy langsung dengan `curl` untuk melihat respon mentah dari layanan DeepSeek:

```bash
curl -i -X POST http://127.0.0.1:8000/api/recommendations/deepseek \
	-H "Content-Type: application/json" \
	-d '{"q":"cari film komedi romantis terbaru"}'
```

Jika respon berisi `success: false` dan `status`/`body`, gunakan informasi tersebut untuk menyesuaikan URL atau format permintaan ke DeepSeek.

## Catatan pengembang

- Animasi UI dan mount logic ada di `resources/js/Pages` (mis. variabel `initialMounted` untuk animasi satu-kali pada load).
- Logika rekomendasi berbasis mood berada di `resources/js/utils/moodRecommender.js`.

## Kontribusi

Jika ingin berkontribusi, buka issue terlebih dahulu dan sertakan screenshot untuk perubahan UI. Buat commit kecil dan deskriptif.

## Lisensi

Ikuti lisensi paket yang digunakan oleh proyek serta ketentuan layanan API pihak ketiga.
