# MOODFLIX - Quick Start Guide

## Setup in 5 Minutes

### Step 1: Install Dependencies

```bash
composer install
npm install
```

### Step 2: Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### Step 3: Database Configuration

Update `.env`:

```env
DB_DATABASE=moodflix
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

### Step 4: Migrate Database

```bash
php artisan migrate
```

### Step 5: Run Development Servers

**Terminal 1:**

```bash
npm run dev
```

**Terminal 2:**

```bash
php artisan serve
```

### Visit Application

Open browser: `http://localhost:8000`

---

## Project Structure

```
resources/js/
├── Components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── MovieCard.jsx
│   ├── GenrePill.jsx
│   ├── RatingBadge.jsx
│   ├── Pagination.jsx
│   ├── SearchInput.jsx
│   └── FilterDropdown.jsx
├── Pages/              # Full page components
│   ├── Dashboard.jsx
│   ├── RekomendasiUtama.jsx
│   ├── BerdasarkanGenre.jsx
│   └── FilmAI.jsx
├── utils/
│   └── apiClient.js    # API client methods
└── app.jsx             # Main app with routing

app/
├── Http/Controllers/
│   ├── MovieController.php
│   └── RecommendationController.php
├── Services/
│   └── TMDBService.php # TMDB API integration
├── Models/
│   ├── Genre.php
│   └── UserMovieInteraction.php
└── Console/

routes/
├── api.php             # API endpoints
└── web.php             # Frontend catch-all

database/migrations/
├── *_create_genres_table.php
└── *_create_user_movie_interactions_table.php
```

---

## Pages Overview

### 1. Dashboard (/)

-   Title: "Rekomendasi film untuk kamu hari ini."
-   Shows most popular movies
-   4-column grid layout
-   Pagination included

### 2. Rekomendasi Utama (/rekomendasi-utama)

-   Select your mood (7 options)
-   Filter by genre
-   Mood-based recommendations
-   Pagination

### 3. Berdasarkan Genre (/berdasarkan-genre)

-   Select one or multiple genres
-   Sort options: Newest, Year, Popularity, Rating
-   Genre-filtered movies
-   Pagination

### 4. Film AI (/film-ai)

-   Search movies by title
-   Select mood
-   Select genres
-   AI-powered recommendations based on your history
-   Pagination

---

## API Endpoints

### Get Movies

```bash
GET /api/movies/popular?page=1
GET /api/movies/search?q=Inception&page=1
GET /api/movies/by-genre?genres=16,35&sort_by=popularity.desc&page=1
GET /api/movies/genres
GET /api/movies/{movieId}
```

### Recommendations

```bash
GET /api/recommendations?mood=Happy&genres=16,35&page=1
POST /api/recommendations/interaction
GET /api/recommendations/ai
GET /api/recommendations/history
```

---

## Key Technologies

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| **Laravel 11**      | Backend framework       |
| **React 18**        | Frontend framework      |
| **Vite**            | Build tool & dev server |
| **Tailwind CSS**    | Styling                 |
| **React Router v6** | Client-side routing     |
| **MySQL**           | Database                |
| **TMDB API**        | Movie data source       |

---

## Common Commands

```bash
# Development
npm run dev                    # Start Vite dev server
php artisan serve             # Start Laravel server

# Building
npm run build                  # Build production assets
php artisan optimize          # Optimize for production

# Database
php artisan migrate           # Run migrations
php artisan migrate:refresh   # Reset database
php artisan db:seed          # Seed data

# Testing
php artisan test              # Run all tests
php artisan test tests/Feature/MovieRecommendationTest.php

# Cache
php artisan cache:clear      # Clear application cache
php artisan config:cache     # Cache config

# Cleanup
php artisan view:clear       # Clear views
php artisan route:clear      # Clear routes
```

---

## TMDB API Details

**Base URL:** `https://api.themoviedb.org/3`

**Authentication:** Bearer Token (provided in `TMDBService.php`)

**Poster Images:** `https://image.tmdb.org/t/p/w342{poster_path}`

---

## Troubleshooting

| Issue                         | Solution                                           |
| ----------------------------- | -------------------------------------------------- |
| **Port 8000 in use**          | `php artisan serve --port=8001`                    |
| **Port 5173 in use**          | Edit `vite.config.js` server port                  |
| **Database connection error** | Check `.env` DB credentials                        |
| **npm packages missing**      | `npm install` or `npm cache clean --force`         |
| **Migrations not running**    | Ensure MySQL is running                            |
| **API calls failing**         | Check internet connection, verify TMDB credentials |

---

## Performance Tips

1. **Enable Caching:** Set `CACHE_DRIVER=database` in `.env`
2. **Database Indexing:** Migrations already include indexes
3. **Asset Compression:** Run `npm run build` for production
4. **API Rate Limiting:** TMDB has 40 requests/10 seconds limit
5. **Browser Caching:** Configure cache headers in Laravel

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure database
3. ✅ Run migrations
4. ✅ Start dev servers
5. ✅ Test application
6. ✅ Explore pages
7. ✅ Customize styling (edit Tailwind classes)
8. ✅ Add more features

---

## Support

-   **Laravel Docs:** https://laravel.com/docs
-   **React Docs:** https://react.dev
-   **Tailwind CSS:** https://tailwindcss.com
-   **TMDB API:** https://developer.themoviedb.org/docs
-   **Vite:** https://vitejs.dev

---

**Ready to run? Execute:**

```bash
composer install && npm install && php artisan migrate
```

Then open two terminals:

```bash
# Terminal 1
npm run dev

# Terminal 2
php artisan serve
```

Visit: `http://localhost:8000` 🎬
