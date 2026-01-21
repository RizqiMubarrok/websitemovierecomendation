# MOODFLIX - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  React 18 Application (SPA)                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Navbar Component                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Pages:                                                 │   │
│  │ • Dashboard (Popular Movies)                           │   │
│  │ • Rekomendasi Utama (Mood-based)                       │   │
│  │ • Berdasarkan Genre (Genre-based)                      │   │
│  │ • Film AI (AI Recommendations)                         │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Shared Components:                                     │   │
│  │ • MovieCard  • GenrePill  • Pagination                │   │
│  │ • SearchInput  • FilterDropdown  • RatingBadge        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/JSON API Calls
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL 11 BACKEND                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API Routes (routes/api.php)                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ GET  /api/movies/popular                               │  │
│  │ GET  /api/movies/search?q=title                        │  │
│  │ GET  /api/movies/by-genre?genres=16,35                │  │
│  │ GET  /api/movies/genres                                │  │
│  │ GET  /api/movies/{movieId}                             │  │
│  │                                                         │  │
│  │ GET  /api/recommendations?mood=Happy&genres=16,35      │  │
│  │ POST /api/recommendations/interaction                  │  │
│  │ GET  /api/recommendations/ai                           │  │
│  │ GET  /api/recommendations/history                      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          │                                     │
│         ┌────────────────┼────────────────┐                   │
│         ▼                ▼                ▼                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │    Movie     │ │Recommendation│ │   Genre     │          │
│  │ Controller  │ │ Controller   │ │ Data        │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
│         │                ▼                │                   │
│         └────────────────┼────────────────┘                   │
│                          ▼                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         TMDB Service Layer                          │    │
│  │  (app/Services/TMDBService.php)                     │    │
│  │                                                     │    │
│  │  • getPopularMovies()                             │    │
│  │  • searchMovies()                                 │    │
│  │  • getMoviesByGenre()                             │    │
│  │  • getGenres()                                    │    │
│  │  • getRecommendations()                           │    │
│  │  • getAIRecommendations()                         │    │
│  └──────────────────────────────────────────────────────┘    │
│         │                    │                                │
│         ▼                    ▼                                │
│  ┌──────────────┐  ┌──────────────────┐                     │
│  │  Database    │  │  Cache Layer     │                     │
│  │ (MySQL)      │  │ (Redis/Database) │                     │
│  │              │  │                  │                     │
│  │ • genres     │  │  24h cache       │                     │
│  │ • interactions   │  7d genres      │                     │
│  │              │  │  12h AI recs     │                     │
│  └──────────────┘  └──────────────────┘                     │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                 HTTPS Connection
                              │
                              ▼
         ┌─────────────────────────────────────┐
         │     TMDB API (External)             │
         │  https://api.themoviedb.org/3       │
         │                                     │
         │  • Movie Data                       │
         │  • Genres                           │
         │  • Ratings                          │
         │  • Poster Images                    │
         └─────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Popular Movies Flow

```
User visits Dashboard
         │
         ▼
React fetches /api/movies/popular
         │
         ▼
MovieController->getPopular()
         │
         ▼
TMDBService->getPopularMovies()
         │
    ┌────┴────┐
    ▼         ▼
 Cache    API Call to TMDB
    │         │
    └────┬────┘
         ▼
  Parse & Format
         │
         ▼
  Return to Frontend
         │
         ▼
React displays MovieCards with pagination
```

### 2. Recommendation Flow

```
User selects mood + genres
         │
         ▼
React sends mood + genres to API
         │
         ▼
RecommendationController->getRecommendations()
         │
         ▼
TMDBService->getRecommendations()
         │
         ├─ Map mood to genres
         ├─ Fetch popular movies
         ├─ Filter by genres
         └─ Sort by rating
         │
         ▼
Record interaction in database
         │
         ▼
Return filtered movies to Frontend
         │
         ▼
React displays filtered MovieCards
```

### 3. AI Recommendation Flow

```
User clicks on movies (recorded interactions)
         │
         ▼
User sets mood + genres for AI
         │
         ▼
React sends to /api/recommendations/ai
         │
         ▼
RecommendationController->getAIRecommendations()
         │
         ▼
Fetch user interaction history
         │
         ▼
Extract genres from viewed movies
         │
         ▼
Combine with selected genres
         │
         ▼
TMDBService->getMoviesByGenre()
         │
         ▼
Sort by vote_average
         │
         ▼
Return to Frontend
         │
         ▼
React displays AI recommendations
```

---

## Component Communication

```
App (Router)
├── Navbar
│   └── Links to pages
│
├── Dashboard Page
│   ├── MovieCard (repeated)
│   │   └── Triggers recordInteraction()
│   └── Pagination
│       └── Changes page state
│
├── Rekomendasi Utama Page
│   ├── GenrePill (repeated)
│   │   └── Updates selectedGenres state
│   ├── Mood buttons
│   │   └── Updates selectedMood state
│   ├── MovieCard (repeated)
│   │   └── Triggers recordInteraction()
│   └── Pagination
│       └── Changes page state
│
├── Berdasarkan Genre Page
│   ├── GenrePill (repeated)
│   │   └── Updates selectedGenres state
│   ├── FilterDropdown
│   │   └── Updates sortBy state
│   ├── MovieCard (repeated)
│   │   └── Triggers recordInteraction()
│   └── Pagination
│       └── Changes page state
│
└── FilmAI Page
    ├── SearchInput
    │   └── Triggers search API call
    ├── Mood buttons (repeated)
    │   └── Updates selectedMood state
    ├── GenrePill (repeated)
    │   └── Updates selectedGenres state
    ├── MovieCard (repeated)
    │   └── Triggers recordInteraction()
    └── Pagination
        └── Changes page state
```

---

## State Management Flow

```
Page Component
├── State Variables
│   ├── movies (array)
│   ├── loading (boolean)
│   ├── page (number)
│   ├── pagination (object)
│   ├── selectedMood (string)
│   ├── selectedGenres (array)
│   └── sortBy (string)
│
├── useEffect Hooks
│   ├── Fetch on component mount
│   ├── Refetch on state changes
│   └── Update URL params
│
└── Event Handlers
    ├── onClick handlers
    ├── onChange handlers
    └── onPageChange handlers
```

---

## API Request/Response Cycle

### Example: Get Recommendations

```
REQUEST:
GET /api/recommendations?mood=Happy&genres=16,35&page=1

RESPONSE (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 278,
      "title": "The Shawshank Redemption",
      "poster_path": "/...",
      "release_date": "1994-10-14",
      "vote_average": 8.7,
      "genre_ids": [18, 80]
    },
    ...
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_results": 100
  }
}
```

---

## Database Schema

```
genres table:
┌────┬────────┬──────────┬────────────┬────────────┐
│ id │ tmdb_id│  name    │ created_at │ updated_at │
├────┼────────┼──────────┼────────────┼────────────┤
│ 1  │  28    │ Action   │ timestamp  │ timestamp  │
│ 2  │  35    │ Comedy   │ timestamp  │ timestamp  │
│ ... (more genres)

user_movie_interactions table:
┌────┬────────────┬──────────────┬────────┬─────────┬───────┬────────────┬────────────┐
│ id │ session_id │tmdb_movie_id │ mood   │ genres  │rating │created_at  │updated_at  │
├────┼────────────┼──────────────┼────────┼─────────┼───────┼────────────┼────────────┤
│ 1  │ abc123     │ 278          │ Happy  │ [18,80] │ 8     │ timestamp  │ timestamp  │
│ 2  │ abc123     │ 550          │ Happy  │ [18]    │ 9     │ timestamp  │ timestamp  │
│ ... (more interactions)
```

---

## Caching Strategy

```
Request comes in
│
├─ Check Cache
│  ├─ Cache HIT → Return cached data (fast)
│  │
│  └─ Cache MISS → Continue
│
├─ Call TMDB API
│  ├─ API SUCCESS → Cache result for configured duration
│  │
│  └─ API ERROR → Return error response
│
└─ Return to Frontend
```

### Cache Duration by Endpoint

-   `/api/movies/popular` → 24 hours
-   `/api/movies/search` → 24 hours
-   `/api/movies/by-genre` → 24 hours
-   `/api/movies/genres` → 7 days
-   `/api/movies/{movieId}` → 7 days
-   `/api/recommendations` → 24 hours
-   `/api/recommendations/ai` → 12 hours

---

## Error Handling Flow

```
API Request
│
├─ Validation Error?
│  ├─ YES → Return 400 with error message
│  └─ NO → Continue
│
├─ TMDB API Error?
│  ├─ YES → Log error, return 500 with message
│  └─ NO → Continue
│
├─ Database Error?
│  ├─ YES → Log error, return 500 with message
│  └─ NO → Continue
│
└─ SUCCESS → Return 200 with data

Frontend catches errors:
├─ Display error message to user
├─ Log to console
└─ Fallback to empty state or previous data
```

---

## Session-Based User Tracking

```
Session Created
│
├─ Assign session_id
│
├─ User views movie
│  │
│  ├─ Record in user_movie_interactions
│  │  ├─ session_id
│  │  ├─ tmdb_movie_id
│  │  ├─ mood (if applicable)
│  │  └─ genres (if applicable)
│  │
│  └─ Next view...
│
└─ User leaves
   └─ Session remains (for AI recommendations based on history)
```

---

## Performance Optimization Points

```
Frontend:
├─ Component Memoization (React.memo for MovieCard)
├─ Lazy Loading with React.lazy() (pages)
├─ useEffect dependencies optimization
└─ Pagination (load one page at a time)

Backend:
├─ API Caching (24h - 7d)
├─ Database Indexing (session_id, tmdb_movie_id)
├─ TMDB API Rate Limiting (40 req/10s)
├─ Response Pagination (limit results per page)
└─ GZIP Compression (enabled by default)

Network:
├─ HTTP/2 or HTTP/3
├─ CDN for static assets
├─ Minimize JSON payload size
└─ Browser caching headers
```

---

## Deployment Architecture

```
Production Server
│
├─ Nginx/Apache (Reverse Proxy)
│  │
│  ├─ HTTPS/SSL Termination
│  │
│  └─ Static File Serving
│
├─ PHP 8.1+ FPM
│  │
│  ├─ Laravel Application
│  │  ├─ API Routes
│  │  ├─ Controllers
│  │  ├─ Services
│  │  └─ Models
│  │
│  └─ Queue Worker (optional)
│
├─ MySQL Database
│  │
│  ├─ genres table
│  ├─ user_movie_interactions table
│  ├─ Backups
│  └─ Replication (optional)
│
└─ Redis/Memcached (Cache)
   │
   ├─ API Response Cache
   ├─ Session Cache
   └─ Queue Jobs (optional)
```

---

## Scalability Considerations

```
As traffic increases:

1. Database
   ├─ Add read replicas
   ├─ Implement sharding (by session_id)
   └─ Optimize queries

2. Caching
   ├─ Upgrade to Redis cluster
   ├─ Increase cache TTL
   └─ Add CDN for static files

3. API Server
   ├─ Load balancing (nginx)
   ├─ Horizontal scaling (multiple servers)
   ├─ API rate limiting
   └─ Queue jobs for heavy operations

4. Frontend
   ├─ Serve from CDN
   ├─ Implement service workers
   ├─ Code splitting by route
   └─ Lazy load images
```

---

## Testing Architecture

```
Test Suite (PHPUnit)
│
├─ Feature Tests
│  ├─ MovieRecommendationTest
│  │  ├─ test_tmdb_service_fetches_popular_movies_with_valid_structure
│  │  ├─ test_tmdb_service_caches_api_responses
│  │  ├─ test_tmdb_service_fetches_genres_with_valid_structure
│  │  ├─ test_recommendations_filters_movies_by_genre
│  │  ├─ test_tmdb_service_searches_movies_with_valid_response
│  │  ├─ test_user_movie_interaction_is_recorded
│  │  ├─ test_cache_expires_and_refreshes_correctly
│  │  └─ test_pagination_response_contains_required_fields
│  │
│  └─ API Response Validation
│
├─ Unit Tests (optional for future)
│  ├─ TMDBService unit tests
│  ├─ Controller unit tests
│  └─ Model unit tests
│
└─ Integration Tests (optional for future)
   ├─ Frontend-Backend integration
   ├─ Database integration
   └─ External API integration
```

---

This architecture ensures:
✅ Scalability - Can handle increased traffic
✅ Maintainability - Clear separation of concerns
✅ Performance - Multi-level caching
✅ Reliability - Error handling throughout
✅ Security - Input validation and output escaping
✅ Testability - Test coverage included
