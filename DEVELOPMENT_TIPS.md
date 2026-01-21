# MOODFLIX - Development Tips & Best Practices

## Frontend Development Tips

### React Best Practices

#### State Management

```jsx
// ✅ GOOD: Use useState for simple state
const [movies, setMovies] = useState([]);
const [loading, setLoading] = useState(false);

// ✅ GOOD: Group related state
const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
});

// ❌ AVOID: Multiple useState for related data
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
```

#### Effects

```jsx
// ✅ GOOD: Separate effects for different concerns
useEffect(() => {
    fetchMovies();
}, [page]);

useEffect(() => {
    fetchGenres();
}, []);

// ❌ AVOID: Multiple operations in one effect
useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchRecommendations();
}, []);
```

#### Error Handling

```jsx
// ✅ GOOD: Handle errors properly
const fetchMovies = async () => {
    try {
        setLoading(true);
        const result = await apiClient.getPopularMovies();
        setMovies(result.data || []);
    } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
    } finally {
        setLoading(false);
    }
};

// ❌ AVOID: Ignoring errors
const fetchMovies = async () => {
    const result = await apiClient.getPopularMovies();
    setMovies(result.data);
};
```

### Styling with Tailwind

#### Responsive Design

```jsx
// ✅ GOOD: Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// ❌ AVOID: Starting with desktop
<div className="grid grid-cols-4 gap-6">
```

#### Color Consistency

```jsx
// ✅ GOOD: Use defined colors
className = "bg-red-500 text-white";
className = "bg-gray-50";
className = "border-gray-300";

// ❌ AVOID: Using random colors
className = "bg-#FF5555";
className = "bg-rgb(100,100,100)";
```

#### Spacing

```jsx
// ✅ GOOD: Use Tailwind spacing scale
<div className="p-4 mb-8 mt-6">

// ❌ AVOID: Arbitrary spacing
<div style={{ padding: '15px', marginBottom: '30px' }}>
```

---

## Backend Development Tips

### Laravel Best Practices

#### Controller Organization

```php
// ✅ GOOD: Single responsibility
public function getPopular(Request $request)
{
    $page = $request->query('page', 1);
    $movies = $this->tmdbService->getPopularMovies($page);
    return response()->json(['success' => true, 'data' => $movies]);
}

// ❌ AVOID: Multiple responsibilities
public function handleRequest(Request $request)
{
    // Validate, fetch, process, cache, record analytics...
}
```

#### Error Handling

```php
// ✅ GOOD: Proper error responses
try {
    $movies = $this->tmdbService->getPopularMovies($page);
    return response()->json(['success' => true, 'data' => $movies]);
} catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => 'Failed to fetch movies',
        'error' => $e->getMessage(),
    ], 500);
}

// ❌ AVOID: Exposing stack traces
throw new Exception("Database error: " . $e);
```

#### Service Layer

```php
// ✅ GOOD: Logic in service layer
class TMDBService
{
    public function getPopularMovies(int $page = 1): array
    {
        // Complex logic here
    }
}

// ❌ AVOID: Logic in controller
public function getPopular(Request $request)
{
    // 50 lines of complex logic
}
```

### Database Best Practices

#### Queries

```php
// ✅ GOOD: Optimized queries
$interactions = UserMovieInteraction::where('session_id', $sessionId)
    ->orderBy('created_at', 'desc')
    ->get();

// ❌ AVOID: Fetching all and filtering in PHP
$interactions = UserMovieInteraction::all();
$filtered = $interactions->filter(fn($i) => $i->session_id === $sessionId);
```

#### Migrations

```php
// ✅ GOOD: Proper indexes
Schema::create('user_movie_interactions', function (Blueprint $table) {
    $table->id();
    $table->string('session_id')->index();
    $table->integer('tmdb_movie_id');
    $table->unique(['session_id', 'tmdb_movie_id']);
});

// ❌ AVOID: No indexes
Schema::create('user_movie_interactions', function (Blueprint $table) {
    $table->id();
    $table->string('session_id');
    $table->integer('tmdb_movie_id');
});
```

### API Best Practices

#### Responses

```php
// ✅ GOOD: Consistent response format
return response()->json([
    'success' => true,
    'data' => $data,
    'pagination' => [
        'current_page' => 1,
        'total_pages' => 5,
        'total_results' => 100,
    ],
]);

// ❌ AVOID: Inconsistent formats
return response()->json($movies);
return response()->json(['movies' => $movies]);
return response()->json(['result' => $data, 'meta' => $pagination]);
```

#### Status Codes

```php
// ✅ GOOD: Correct status codes
return response()->json($data, 200);           // Success
return response()->json($error, 400);          // Bad request
return response()->json(['error' => '...'], 500); // Server error

// ❌ AVOID: Always returning 200
return response()->json($error, 200);          // Wrong!
```

---

## API Usage Tips

### Using apiClient

```jsx
// ✅ GOOD: Use utility methods
const { data, pagination } = await apiClient.getPopularMovies(page);

// ❌ AVOID: Direct fetch calls
const response = await fetch("/api/movies/popular?page=" + page);
const json = await response.json();
```

### Error Handling in Frontend

```jsx
// ✅ GOOD: Handle specific errors
try {
    const result = await apiClient.search(query);
    setMovies(result.data);
} catch (error) {
    console.error("Search failed:", error);
    setError("Failed to search movies");
    setMovies([]);
}

// ❌ AVOID: Generic error handling
try {
    const result = await apiClient.search(query);
    setMovies(result.data);
} catch (error) {
    alert("Error!");
}
```

---

## Performance Tips

### Frontend Optimization

#### Image Optimization

```jsx
// ✅ GOOD: Use TMDB CDN with right size
const posterPath = `https://image.tmdb.org/t/p/w342${poster_path}`;

// ❌ AVOID: Large images
const posterPath = `https://image.tmdb.org/t/p/w1280${poster_path}`;
```

#### Memoization

```jsx
// ✅ GOOD: Memoize heavy components
export default React.memo(MovieCard);

// ❌ AVOID: Unnecessary re-renders
export default MovieCard;
```

### Backend Optimization

#### Caching

```php
// ✅ GOOD: Cache expensive operations
return Cache::remember('popular_movies:1', 86400, function () {
    return $this->tmdbService->getPopularMovies(1);
});

// ❌ AVOID: No caching
return $this->tmdbService->getPopularMovies(1);
```

#### Query Optimization

```php
// ✅ GOOD: Only fetch needed fields
$genres = Genre::select('id', 'name')->get();

// ❌ AVOID: Fetch all fields
$genres = Genre::all();
```

---

## Common Issues & Solutions

### Issue: Slow API Responses

**Symptoms:**

-   API takes > 5 seconds to respond
-   Network tab shows slow requests

**Solutions:**

1. Check if caching is enabled: `echo config('cache.default');`
2. Verify database indexes: `php artisan tinker` → `DB::table('genres')->count();`
3. Check TMDB API rate limits
4. Monitor Laravel logs: `tail -f storage/logs/laravel.log`

### Issue: Movies Not Loading

**Symptoms:**

-   Movie grid is empty
-   Console shows API errors

**Solutions:**

1. Check API endpoint: `curl http://localhost:8000/api/movies/popular`
2. Verify TMDB API credentials in `TMDBService.php`
3. Check internet connection
4. Check browser Network tab for HTTP errors
5. Review Laravel logs for exceptions

### Issue: Database Connection Failed

**Symptoms:**

-   "No connection" error when fetching data
-   Migration fails

**Solutions:**

1. Verify MySQL is running: `mysql -u root -p`
2. Check `.env` database credentials
3. Test connection: `php artisan tinker` → `DB::connection()->getPDO();`
4. Create database: `mysql -u root -p -e "CREATE DATABASE moodflix;"`
5. Run migrations: `php artisan migrate`

### Issue: Build/Compilation Errors

**Symptoms:**

-   `npm run build` fails
-   Vite shows syntax errors

**Solutions:**

1. Clear cache: `npm cache clean --force`
2. Reinstall: `rm -rf node_modules && npm install`
3. Check for syntax errors in files
4. Use: `npm run dev` to see detailed error messages

---

## Debugging Tips

### Browser DevTools

```javascript
// Check API response
fetch("/api/movies/genres")
    .then((r) => r.json())
    .then((d) => console.log(d));

// Check cache
localStorage.getItem("key");

// Monitor API calls
// Open Network tab → Filter by XHR/Fetch
```

### Laravel Debugging

```php
// Log to console
Log::debug('Movies fetched', ['count' => count($movies)]);

// Check log file
tail -f storage/logs/laravel.log

// Database debugging
DB::listen(function($query) {
    echo $query->sql;
});
```

### Vue/React DevTools

```javascript
// In browser console
// Check component state
$0.__react; // Select element in DevTools

// Monitor re-renders
// Use React DevTools browser extension
```

---

## Code Review Checklist

Before committing code:

### Backend

-   [ ] No console.log or var_dump left
-   [ ] Error handling implemented
-   [ ] Database queries optimized
-   [ ] Comments added for complex logic
-   [ ] Variables named clearly
-   [ ] No hardcoded values

### Frontend

-   [ ] No console.log left
-   [ ] Error handling implemented
-   [ ] Loading states handled
-   [ ] Responsive design verified
-   [ ] Tailwind classes used
-   [ ] Components organized

### General

-   [ ] Tests passing
-   [ ] No syntax errors
-   [ ] No security vulnerabilities
-   [ ] Performance acceptable
-   [ ] Code follows standards

---

## Git Best Practices

```bash
# Good commit messages
git commit -m "Add movie search functionality"
git commit -m "Fix pagination bug in genre filter"

# Bad commit messages
git commit -m "Fix bugs"
git commit -m "Update stuff"

# Branch naming
git checkout -b feature/movie-search
git checkout -b bugfix/pagination-issue

# Before pushing
git fetch origin
git rebase origin/main
git push origin feature/movie-search
```

---

## Team Collaboration

### Code Standards

-   Follow PSR-12 for PHP
-   Follow ES6+ for JavaScript
-   Use Tailwind CSS consistently
-   Document public APIs
-   Keep functions small and focused

### Communication

-   Use descriptive commit messages
-   Comment complex logic
-   Document breaking changes
-   Review code before merging
-   Test before deployment

---

## Learning Resources

### Frontend

-   React Docs: https://react.dev
-   Tailwind CSS: https://tailwindcss.com
-   React Router: https://reactrouter.com

### Backend

-   Laravel Docs: https://laravel.com/docs
-   Eloquent ORM: https://laravel.com/docs/eloquent
-   HTTP Responses: https://laravel.com/docs/responses

### APIs

-   TMDB API: https://developer.themoviedb.org/docs
-   REST Best Practices: https://restfulapi.net

### DevOps

-   Docker: https://docs.docker.com
-   GitHub Actions: https://docs.github.com/en/actions
-   SSL/HTTPS: https://certbot.eff.org

---

## Quick Reference

### Start Development

```bash
npm run dev    # Terminal 1: Frontend dev server
php artisan serve  # Terminal 2: Laravel server
```

### Run Tests

```bash
php artisan test
```

### Clear Caches

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Database Operations

```bash
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Rollback last migration
php artisan migrate:refresh      # Reset and re-run
```

### Production Build

```bash
npm run build
php artisan config:cache
php artisan route:cache
```

---

## Useful Commands

```bash
# Laravel Tinker (interactive shell)
php artisan tinker
>>> DB::table('genres')->count()
>>> Cache::get('popular_movies:1')

# Generate boilerplate
php artisan make:model Name
php artisan make:controller NameController
php artisan make:migration create_table

# Queue jobs
php artisan queue:work

# Optimize
php artisan optimize
php artisan view:cache
php artisan config:cache
```

---

**Remember:** Code is read more often than it's written. Write clear, maintainable, and well-documented code!

Happy coding! 🚀
