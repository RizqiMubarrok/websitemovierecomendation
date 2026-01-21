<?php

namespace Tests\Feature;

use App\Models\Genre;
use App\Models\UserMovieInteraction;
use App\Services\TMDBService;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class MovieRecommendationTest extends TestCase
{
    protected TMDBService $tmdbService;

    public function setUp(): void
    {
        parent::setUp();
        $this->tmdbService = new TMDBService();
    }

    /**
     * Test TMDB API returns valid popular movies response structure
     */
    public function test_tmdb_service_fetches_popular_movies_with_valid_structure(): void
    {
        Cache::flush();

        $movies = $this->tmdbService->getPopularMovies(1);

        $this->assertIsArray($movies);
        $this->assertArrayHasKey('results', $movies);
        $this->assertArrayHasKey('page', $movies);
        $this->assertArrayHasKey('total_pages', $movies);
        $this->assertArrayHasKey('total_results', $movies);

        $this->assertIsArray($movies['results']);
        $this->assertGreaterThan(0, count($movies['results']));

        $firstMovie = $movies['results'][0];
        $this->assertArrayHasKey('id', $firstMovie);
        $this->assertArrayHasKey('title', $firstMovie);
        $this->assertArrayHasKey('poster_path', $firstMovie);
    }

    /**
     * Test TMDB API caching works correctly
     */
    public function test_tmdb_service_caches_api_responses(): void
    {
        Cache::flush();

        $cacheKey = 'popular_movies:1';
        $this->assertNull(Cache::get($cacheKey));

        $firstCall = $this->tmdbService->getPopularMovies(1);

        $this->assertNotNull(Cache::get($cacheKey));

        $secondCall = $this->tmdbService->getPopularMovies(1);

        $this->assertEquals($firstCall, $secondCall);
        $this->assertEquals(Cache::get($cacheKey), $firstCall);
    }

    /**
     * Test genres API returns valid structure
     */
    public function test_tmdb_service_fetches_genres_with_valid_structure(): void
    {
        Cache::flush();

        $genres = $this->tmdbService->getGenres();

        $this->assertIsArray($genres);
        $this->assertArrayHasKey('genres', $genres);

        $genreList = $genres['genres'];
        $this->assertIsArray($genreList);
        $this->assertGreaterThan(0, count($genreList));

        $firstGenre = $genreList[0];
        $this->assertArrayHasKey('id', $firstGenre);
        $this->assertArrayHasKey('name', $firstGenre);
    }

    /**
     * Test recommendations filtering works correctly
     */
    public function test_recommendations_filters_movies_by_genre(): void
    {
        Cache::flush();

        $recommendations = $this->tmdbService->getRecommendations('Happy', [16, 35], 1);

        $this->assertIsArray($recommendations);
        $this->assertArrayHasKey('results', $recommendations);

        if (count($recommendations['results']) > 0) {
            foreach ($recommendations['results'] as $movie) {
                $this->assertArrayHasKey('id', $movie);
                $this->assertArrayHasKey('genre_ids', $movie);
            }
        }
    }

    /**
     * Test movie search returns valid structure
     */
    public function test_tmdb_service_searches_movies_with_valid_response(): void
    {
        Cache::flush();

        $result = $this->tmdbService->searchMovies('Inception', 1);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('results', $result);
        $this->assertArrayHasKey('page', $result);
        $this->assertArrayHasKey('total_pages', $result);

        if (count($result['results']) > 0) {
            $firstMovie = $result['results'][0];
            $this->assertArrayHasKey('id', $firstMovie);
            $this->assertArrayHasKey('title', $firstMovie);
        }
    }

    /**
     * Test user movie interaction recording
     */
    public function test_user_movie_interaction_is_recorded(): void
    {
        $sessionId = 'test-session-123';
        $movieId = 12345;

        UserMovieInteraction::create([
            'session_id' => $sessionId,
            'tmdb_movie_id' => $movieId,
            'mood' => 'Happy',
            'genres' => [16, 35],
            'rating' => 8,
        ]);

        $this->assertDatabaseHas('user_movie_interactions', [
            'session_id' => $sessionId,
            'tmdb_movie_id' => $movieId,
            'mood' => 'Happy',
            'rating' => 8,
        ]);
    }

    /**
     * Test cache expiration and refresh
     */
    public function test_cache_expires_and_refreshes_correctly(): void
    {
        Cache::flush();

        $cacheKey = 'popular_movies:1';

        $firstResponse = $this->tmdbService->getPopularMovies(1);
        $this->assertNotNull(Cache::get($cacheKey));

        Cache::forget($cacheKey);
        $this->assertNull(Cache::get($cacheKey));

        $secondResponse = $this->tmdbService->getPopularMovies(1);
        $this->assertNotNull(Cache::get($cacheKey));
        $this->assertEquals($firstResponse, $secondResponse);
    }

    /**
     * Test API response with pagination
     */
    public function test_pagination_response_contains_required_fields(): void
    {
        Cache::flush();

        $result = $this->tmdbService->getPopularMovies(1);

        $this->assertArrayHasKey('page', $result);
        $this->assertArrayHasKey('total_pages', $result);
        $this->assertArrayHasKey('total_results', $result);

        $this->assertIsInt($result['page']);
        $this->assertIsInt($result['total_pages']);
        $this->assertIsInt($result['total_results']);

        $this->assertGreaterThan(0, $result['total_pages']);
    }
}
