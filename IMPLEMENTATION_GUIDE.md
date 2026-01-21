# MOODFLIX - Movie Recommendation Application

## Project Setup & Installation

### Prerequisites

-   PHP 8.1+
-   Node.js 18+
-   MySQL 8.0+
-   Composer
-   npm

### Installation Steps

1. **Install PHP Dependencies**

```bash
composer install
```

2. **Install Node Dependencies**

```bash
npm install
```

3. **Environment Configuration**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database**
   Update `.env` with your MySQL credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moodflix
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run Migrations**

```bash
php artisan migrate
```

6. **Build Frontend Assets**

```bash
npm run build
```

7. **Start Development Servers**

**Terminal 1 - Vite Development Server:**

```bash
npm run dev
```

**Terminal 2 - Laravel Development Server:**

```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## Project Structure

### Backend (Laravel)

#### Database

-   **Migrations**

    -   `2024_01_16_000001_create_genres_table.php` - Store TMDB genres
    -   `2024_01_16_000002_create_user_movie_interactions_table.php` - Track user interactions

-   **Models**
    -   `app/Models/Genre.php` - Genre model
    -   `app/Models/UserMovieInteraction.php` - User interaction model

#### Services

-   **`app/Services/TMDBService.php`**
    -   Fetches popular movies
    -   Searches movies by title
    -   Retrieves movies by genre
    -   Gets all genres
    -   Implements recommendation logic based on mood
    -   Handles AI-assisted recommendations
    -   Implements caching (24-hour expiration)

#### Controllers

-   **`app/Http/Controllers/MovieController.php`**

    -   `getPopular()` - GET /api/movies/popular
    -   `search()` - GET /api/movies/search
    -   `getByGenre()` - GET /api/movies/by-genre
    -   `getGenres()` - GET /api/movies/genres
    -   `getDetails()` - GET /api/movies/{movieId}

-   **`app/Http/Controllers/RecommendationController.php`**
    -   `getRecommendations()` - GET /api/recommendations/
    -   `recordInteraction()` - POST /api/recommendations/interaction
    -   `getAIRecommendations()` - GET /api/recommendations/ai
    -   `getUserHistory()` - GET /api/recommendations/history

#### Routes

-   **`routes/api.php`** - All API endpoints (no authentication required)

#### Tests

-   **`tests/Feature/MovieRecommendationTest.php`**
    -   Tests TMDB API integration
    -   Validates response structures
    -   Tests caching behavior
    -   Tests pagination
    -   Tests user interactions

### Frontend (React + Vite)

#### Components (`resources/js/Components/`)

-   **`Navbar.jsx`** - Navigation bar with links to all pages
-   **`MovieCard.jsx`** - Movie poster card with title, year, genres, rating
-   **`GenrePill.jsx`** - Genre selection pill component
-   **`RatingBadge.jsx`** - Movie rating display badge
-   **`Pagination.jsx`** - Pagination controls
-   **`SearchInput.jsx`** - Movie search input
-   **`FilterDropdown.jsx`** - Sort/filter dropdown

#### Pages (`resources/js/Pages/`)

-   **`Dashboard.jsx`** - "Rekomendasi film untuk kamu hari ini"

    -   Shows popular movies
    -   Displays movie cards in 4-column grid
    -   Includes pagination

-   **`RekomendasiUtama.jsx`** - "Rekomendasi film yang ingin ditonton sesuai mood"

    -   Mood selection (Happy, Sad, Excited, Scared, Relaxed, Angry, Confused)
    -   Genre filtering
    -   Mood-based recommendation filtering
    -   Pagination

-   **`BerdasarkanGenre.jsx`** - "Kategori Film"

    -   Genre selection pills
    -   Sort options (Terbaru, Tahun, Popularity, Rating)
    -   Dynamic genre-based filtering
    -   Pagination

-   **`FilmAI.jsx`** - "Film AI"
    -   AI-powered recommendations
    -   Search by movie title
    -   Mood selection
    -   Genre selection
    -   AI recommendations based on user history
    -   Pagination

#### Utilities (`resources/js/utils/`)

-   **`apiClient.js`** - Centralized API client with methods:
    -   `getPopularMovies(page)`
    -   `searchMovies(query, page)`
    -   `getMoviesByGenre(genreIds, sortBy, page)`
    -   `getGenres()`
    -   `getMovieDetails(movieId)`
    -   `getRecommendations(mood, genreIds, page)`
    -   `recordInteraction(movieId, mood, genres, rating)`
    -   `getAIRecommendations(mood, genreIds, page)`
    -   `getUserHistory()`

#### Styling

-   **Tailwind CSS** - All components styled with Tailwind utilities
-   **Responsive Design** - Mobile-first approach with breakpoints
-   **Dark Navbar** - Dark gray background (#1F2937) with white text
-   **Red Accents** - Red badges and active states (#EF4444)
-   **Rounded Cards** - Soft shadows and hover effects

---

## API Endpoints

### Movies

-   `GET /api/movies/popular?page=1` - Get popular movies
-   `GET /api/movies/search?q=query&page=1` - Search movies by title
-   `GET /api/movies/by-genre?genres=16,35&sort_by=popularity.desc&page=1` - Get movies by genres
-   `GET /api/movies/genres` - Get all available genres
-   `GET /api/movies/{movieId}` - Get movie details

### Recommendations

-   `GET /api/recommendations?mood=Happy&genres=16,35&page=1` - Get recommendations by mood and genres
-   `POST /api/recommendations/interaction` - Record user movie interaction
-   `GET /api/recommendations/ai` - Get AI-powered recommendations
-   `GET /api/recommendations/history` - Get user's interaction history

---

## TMDB API Configuration

The application uses TMDB API with the following credentials:

**API Key:** `204ec07f01f609366972991007916521`

**Bearer Token:** `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDRlYzA3ZjAxZjYwOTM2Njk3Mjk5MTAwNzkxNjUyMSIsIm5iZiI6MTc2NDkyNTY0Ni4xNTgwMDAyLCJzdWIiOiI2OTMyYTBjZTcxMmQ3YjAzMGZhMTg4OWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nifJ3vwAznKiiM4ZN_hrtIOulcNbksQPOtaJzMqETK4`

All API requests use Bearer Token authorization.

---

## Caching Strategy

-   **Popular Movies:** 24-hour cache
-   **Genres:** 7-day cache
-   **Search Results:** 24-hour cache
-   **Genre-filtered Movies:** 24-hour cache
-   **Movie Details:** 7-day cache
-   **Recommendations:** 24-hour cache
-   **AI Recommendations:** 12-hour cache

---

## Running Tests

```bash
php artisan test tests/Feature/MovieRecommendationTest.php
```

### Test Coverage

-   ✅ TMDB API integration validation
-   ✅ API response structure verification
-   ✅ Caching behavior confirmation
-   ✅ Pagination response validation
-   ✅ User interaction recording
-   ✅ Recommendation filtering

---

## Database Schema

### genres table

```sql
- id (primary key)
- tmdb_id (unique, integer)
- name (string)
- timestamps
```

### user_movie_interactions table

```sql
- id (primary key)
- session_id (indexed, string)
- tmdb_movie_id (integer)
- mood (nullable, string)
- genres (nullable, json)
- rating (nullable, integer)
- timestamps
- unique constraint: (session_id, tmdb_movie_id)
```

---

## UI Features

### Navbar

-   Dark theme (gray-900 background)
-   White text
-   Active route indicator (red underline)
-   Navigation links to all 4 pages

### Movie Cards

-   Poster image (342x513px)
-   Movie title (truncated)
-   Release year
-   Genre badges
-   Rating badge (top right, red background)
-   Hover scale effect with shadow

### Genre Pills

-   Active state: Red background, white text
-   Inactive state: White background, gray border
-   Hover effect on inactive pills

### Pagination

-   Previous/Next buttons
-   Page number buttons
-   Current page highlight (red)
-   Disabled state on first/last pages
-   Ellipsis for large page ranges

### Search Input

-   Rounded border
-   Focus state (red border)
-   Search button inside input
-   Placeholder text for guidance

---

## Development Guidelines

### Adding New Features

1. **Backend API:**

    - Create controller method
    - Add route in `routes/api.php`
    - Add service method in `TMDBService`
    - Add test case

2. **Frontend:**
    - Create component or page
    - Use `apiClient.js` for API calls
    - Style with Tailwind CSS
    - Add routing if necessary

### Code Standards

-   PSR-12 for PHP (Laravel)
-   ES6+ for JavaScript (React)
-   Tailwind CSS for styling
-   Functional components with React Hooks
-   Error handling in all API calls

---

## Troubleshooting

### Port Conflicts

-   Vite: Change dev server port in `vite.config.js`
-   Laravel: Use `php artisan serve --port=8001`

### Database Issues

-   Clear cache: `php artisan cache:clear`
-   Reset database: `php artisan migrate:refresh`

### Node Module Issues

-   Clear npm cache: `npm cache clean --force`
-   Reinstall: `rm -rf node_modules && npm install`

### TMDB API Errors

-   Verify API credentials in `TMDBService.php`
-   Check internet connection
-   Verify TMDB API service status

---

## Environment Variables (.env)

```env
APP_NAME="MOODFLIX"
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moodflix
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=database
CACHE_EXPIRATION_POPULAR=86400
CACHE_EXPIRATION_GENRES=604800
CACHE_EXPIRATION_AI=43200
```

---

## Production Deployment

1. Build frontend: `npm run build`
2. Run migrations: `php artisan migrate --force`
3. Configure caching strategy
4. Set `APP_DEBUG=false`
5. Configure HTTPS
6. Set up error monitoring (Sentry, etc.)
7. Configure CDN for images

---

## Support & Documentation

For TMDB API documentation: https://developer.themoviedb.org/docs
For Laravel documentation: https://laravel.com/docs
For React documentation: https://react.dev

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Author:** MOODFLIX Development Team
