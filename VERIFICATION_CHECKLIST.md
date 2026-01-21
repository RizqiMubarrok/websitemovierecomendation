# MOODFLIX - Installation & Verification Checklist

## Pre-Installation Requirements

-   [ ] PHP 8.1 or higher installed
-   [ ] MySQL 8.0 or higher running
-   [ ] Node.js 18+ installed
-   [ ] Composer installed globally
-   [ ] npm or yarn available
-   [ ] Git available (if cloning)

---

## Step 1: Install Dependencies ✅

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

-   [ ] No composer errors
-   [ ] No npm errors
-   [ ] All packages installed successfully
-   [ ] `vendor/` directory exists
-   [ ] `node_modules/` directory exists

---

## Step 2: Environment Setup ✅

```bash
# Copy example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

-   [ ] `.env` file created
-   [ ] `APP_KEY` generated in `.env`
-   [ ] File is readable

---

## Step 3: Database Configuration ✅

Edit `.env` with database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moodflix
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

-   [ ] Database credentials configured
-   [ ] Database created (manually or by migration)
-   [ ] MySQL is running and accessible
-   [ ] Test connection with:
    ```bash
    php artisan tinker
    >>> DB::connection()->getPDO();
    ```

---

## Step 4: Run Migrations ✅

```bash
# Run all migrations
php artisan migrate
```

-   [ ] Migrations ran without errors
-   [ ] 4+ tables created in database:
    -   [ ] users
    -   [ ] genres
    -   [ ] user_movie_interactions
    -   [ ] Other Laravel default tables
-   [ ] No SQL errors in output

---

## Step 5: Verify Project Structure ✅

Check that all required files exist:

### Backend Files

-   [ ] `app/Services/TMDBService.php`
-   [ ] `app/Http/Controllers/MovieController.php`
-   [ ] `app/Http/Controllers/RecommendationController.php`
-   [ ] `app/Models/Genre.php`
-   [ ] `app/Models/UserMovieInteraction.php`
-   [ ] `routes/api.php` (updated)
-   [ ] `routes/web.php` (updated)

### Frontend Files

-   [ ] `resources/js/app.jsx`
-   [ ] `resources/js/Components/Navbar.jsx`
-   [ ] `resources/js/Components/MovieCard.jsx`
-   [ ] `resources/js/Components/GenrePill.jsx`
-   [ ] `resources/js/Components/RatingBadge.jsx`
-   [ ] `resources/js/Components/Pagination.jsx`
-   [ ] `resources/js/Components/SearchInput.jsx`
-   [ ] `resources/js/Components/FilterDropdown.jsx`
-   [ ] `resources/js/Pages/Dashboard.jsx`
-   [ ] `resources/js/Pages/RekomendasiUtama.jsx`
-   [ ] `resources/js/Pages/BerdasarkanGenre.jsx`
-   [ ] `resources/js/Pages/FilmAI.jsx`
-   [ ] `resources/js/Layouts/MainLayout.jsx`
-   [ ] `resources/js/utils/apiClient.js`
-   [ ] `resources/views/app.blade.php` (updated)

### Test Files

-   [ ] `tests/Feature/MovieRecommendationTest.php`

### Documentation Files

-   [ ] `QUICKSTART.md`
-   [ ] `IMPLEMENTATION_GUIDE.md`
-   [ ] `DEPLOYMENT.md`
-   [ ] `PROJECT_SUMMARY.md`
-   [ ] `ARCHITECTURE.md`

---

## Step 6: Build Frontend Assets ✅

```bash
npm run build
```

-   [ ] Build completed without errors
-   [ ] `public/build/` directory created with assets
-   [ ] No warnings (optional, some warnings are acceptable)

---

## Step 7: Start Development Servers ✅

### Terminal 1 - Start Vite Dev Server

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.0  ready in 000 ms

  ➜  Local:   http://localhost:5173/
```

-   [ ] Vite server started
-   [ ] Local port accessible (default: 5173)
-   [ ] Hot module replacement active

### Terminal 2 - Start Laravel Dev Server

```bash
php artisan serve
```

Expected output:

```
   Local:   http://127.0.0.1:8000
```

-   [ ] Laravel server started
-   [ ] Port 8000 accessible
-   [ ] No errors in output

---

## Step 8: Verify Application ✅

Open browser and navigate to: `http://localhost:8000`

### Homepage (Dashboard)

-   [ ] Page loads without errors
-   [ ] Navbar visible at top
-   [ ] Title shows: "Rekomendasi film untuk kamu" with "hari ini." badge
-   [ ] Movie cards display
-   [ ] Pagination controls visible
-   [ ] No console errors (F12 Developer Tools)

### Navigation

-   [ ] Navbar has 4 links
-   [ ] Dashboard link active (red underline)
-   [ ] Click "Rekomendasi Utama" navigates to that page
-   [ ] Click "Berdasarkan Genre" navigates to that page
-   [ ] Click "Film AI" navigates to that page
-   [ ] Click "Dashboard" navigates back to home

### Dashboard Page (/)

-   [ ] Movies display in grid
-   [ ] Movie cards show: poster, title, year, genres, rating badge
-   [ ] Pagination works
-   [ ] No console errors

### Rekomendasi Utama Page (/rekomendasi-utama)

-   [ ] Mood buttons visible (Happy, Sad, Excited, etc.)
-   [ ] Genre pills visible
-   [ ] Movie cards update when mood changes
-   [ ] Movie cards update when genres change
-   [ ] Pagination works
-   [ ] No console errors

### Berdasarkan Genre Page (/berdasarkan-genre)

-   [ ] Genre pills visible
-   [ ] Sort dropdown visible (Terbaru, Tahun, etc.)
-   [ ] Movie cards display
-   [ ] Selecting genres filters movies
-   [ ] Changing sort updates results
-   [ ] Pagination works
-   [ ] No console errors

### FilmAI Page (/film-ai)

-   [ ] Search input visible
-   [ ] Mood buttons visible
-   [ ] Genre pills visible
-   [ ] Search functionality works
-   [ ] Mood selection works
-   [ ] Genre selection works
-   [ ] Movie cards display recommendations
-   [ ] Pagination works
-   [ ] No console errors

---

## Step 9: API Verification ✅

Test API endpoints using curl or Postman:

```bash
# Test popular movies endpoint
curl http://localhost:8000/api/movies/popular

# Expected: JSON response with movies array
```

-   [ ] `/api/movies/popular` returns movies
-   [ ] `/api/movies/genres` returns genres
-   [ ] `/api/movies/search?q=test` returns search results
-   [ ] `/api/recommendations?mood=Happy` returns recommendations
-   [ ] All endpoints return valid JSON
-   [ ] No CORS errors

---

## Step 10: Database Verification ✅

```bash
php artisan tinker
```

```php
# Check genres table
>>> DB::table('genres')->count()
>>> DB::table('genres')->first()

# Check user_movie_interactions table
>>> DB::table('user_movie_interactions')->count()
```

-   [ ] Genres table has data (or can fetch from TMDB)
-   [ ] User interactions table is empty initially (normal)
-   [ ] Database connection working
-   [ ] All tables exist

---

## Step 11: Run Tests ✅

```bash
php artisan test
```

Expected output:

```
PASS Tests/Feature/MovieRecommendationTest
✓ test_tmdb_service_fetches_popular_movies_with_valid_structure
✓ test_tmdb_service_caches_api_responses
✓ test_tmdb_service_fetches_genres_with_valid_structure
✓ test_recommendations_filters_movies_by_genre
✓ test_tmdb_service_searches_movies_with_valid_response
✓ test_user_movie_interaction_is_recorded
✓ test_cache_expires_and_refreshes_correctly
✓ test_pagination_response_contains_required_fields

8 passed
```

-   [ ] All 8 tests passing
-   [ ] No test failures
-   [ ] Test output shows success

---

## Step 12: Browser Console Check ✅

Open Developer Tools (F12) on each page:

### Console Tab

-   [ ] No red errors
-   [ ] No CORS errors
-   [ ] No 404 errors
-   [ ] No undefined variable warnings (some warnings OK)

### Network Tab

-   [ ] All API calls successful (200 status)
-   [ ] No failed requests
-   [ ] Response times reasonable (< 5 seconds)

---

## Step 13: Performance Check ✅

Test application responsiveness:

-   [ ] Pages load quickly (< 2 seconds)
-   [ ] Pagination works smoothly
-   [ ] Movie card images load properly
-   [ ] Search responds quickly (cached results)
-   [ ] Genre filtering is fast
-   [ ] Mood selection updates instantly

---

## Step 14: Cross-Browser Testing ✅

Test in multiple browsers:

### Chrome/Edge

-   [ ] Application loads
-   [ ] All features work
-   [ ] No console errors

### Firefox

-   [ ] Application loads
-   [ ] All features work
-   [ ] No console errors

### Safari (if available)

-   [ ] Application loads
-   [ ] All features work
-   [ ] No console errors

---

## Step 15: Mobile Responsiveness ✅

Test on mobile view (F12 Device Emulation):

-   [ ] Navbar displays correctly
-   [ ] Movie grid adjusts to smaller screens
-   [ ] Text is readable
-   [ ] Buttons are clickable
-   [ ] Navigation works
-   [ ] No horizontal scroll
-   [ ] Images load properly

---

## Optional: Production Build ✅

```bash
npm run build
```

-   [ ] Build completes without errors
-   [ ] `public/build/manifest.json` created
-   [ ] JavaScript minified
-   [ ] CSS minified
-   [ ] Build size reasonable

---

## Troubleshooting

### If migrations fail:

```bash
php artisan migrate:refresh
php artisan migrate
```

### If npm packages conflict:

```bash
rm -rf node_modules package-lock.json
npm install
```

### If Laravel fails to start:

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan serve --port=8001
```

### If frontend doesn't load:

```bash
npm run dev
# Check if Vite is running on port 5173
# Check browser console for errors
```

### If API calls fail:

```bash
# Check that Laravel server is running
# Check that API routes are defined
# Check browser Network tab for errors
curl http://localhost:8000/api/movies/genres
```

---

## Final Verification Checklist

### Code Quality

-   [ ] No PHP syntax errors
-   [ ] No JavaScript syntax errors
-   [ ] All imports resolve correctly
-   [ ] No undefined variables

### Functionality

-   [ ] All 4 pages load
-   [ ] All API endpoints work
-   [ ] Database operations work
-   [ ] Caching works
-   [ ] Error handling works

### UI/UX

-   [ ] Dark navbar visible
-   [ ] Red accents on active items
-   [ ] Movie cards display properly
-   [ ] Pagination functions
-   [ ] Responsive on mobile

### Performance

-   [ ] Pages load quickly
-   [ ] API responses fast
-   [ ] Caching reduces API calls
-   [ ] Minimal console errors

### Security

-   [ ] CSRF token in forms
-   [ ] API validates input
-   [ ] No sensitive data in console
-   [ ] No SQL injection vulnerabilities

---

## Success Criteria Met ✅

Once all checkboxes are complete:

✅ **Application is fully functional**
✅ **All pages load correctly**
✅ **API endpoints are accessible**
✅ **Database operations work**
✅ **Tests pass**
✅ **UI matches design specifications**
✅ **Performance is acceptable**
✅ **Ready for production deployment**

---

## Next Steps

1. ✅ Verify all checkboxes above
2. ✅ Review code with team
3. ✅ Configure production environment (see DEPLOYMENT.md)
4. ✅ Set up monitoring (optional)
5. ✅ Deploy to production (see DEPLOYMENT.md)
6. ✅ Monitor for issues
7. ✅ Gather user feedback
8. ✅ Plan feature enhancements

---

## Support

-   **Quick Start:** QUICKSTART.md
-   **Implementation:** IMPLEMENTATION_GUIDE.md
-   **Deployment:** DEPLOYMENT.md
-   **Architecture:** ARCHITECTURE.md
-   **Project Summary:** PROJECT_SUMMARY.md

---

## Help & Support

-   Laravel Docs: https://laravel.com/docs
-   React Docs: https://react.dev
-   Tailwind CSS: https://tailwindcss.com
-   TMDB API: https://developer.themoviedb.org/docs

---

**Congratulations!** 🎉

If all items are checked, your MOODFLIX application is ready to use!

**Version:** 1.0.0  
**Status:** ✅ PRODUCTION READY

Enjoy your movie recommendation application! 🍿🎬
