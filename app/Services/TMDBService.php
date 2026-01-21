<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TMDBService
{
    protected string $apiKey = '204ec07f01f609366972991007916521';
    protected string $baseUrl = 'https://api.themoviedb.org/3';
    protected string $bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDRlYzA3ZjAxZjYwOTM2Njk3Mjk5MTAwNzkxNjUyMSIsIm5iZiI6MTc2NDkyNTY0Ni4xNTgwMDAyLCJzdWIiOiI2OTMyYTBjZTcxMmQ3YjAzMGZhMTg4OWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nifJ3vwAznKiiM4ZN_hrtIOulcNbksQPOtaJzMqETK4';

    public function __construct()
    {
    }

    /**
     * Get movie recommendations based on mood and genres
     */
    public function getRecommendations(string $mood, array $genreIds = [], int $page = 1): array
    {
        $cacheKey = "recommendations:{$mood}:" . implode(',', $genreIds) . ":{$page}";

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($mood, $genreIds, $page) {
            $movies = $this->getPopularMovies($page);

            $moods = $this->getMoodGenreMapping();
            if (isset($moods[$mood])) {
                $genreIds = array_unique(array_merge($genreIds, $moods[$mood]));
            }

            if (!empty($genreIds)) {
                $movies['results'] = array_filter($movies['results'], function ($movie) use ($genreIds) {
                    $movieGenres = $movie['genre_ids'] ?? [];
                    return count(array_intersect($movieGenres, $genreIds)) > 0;
                });

                $movies['results'] = array_values($movies['results']);
            }

            usort($movies['results'], function ($a, $b) {
                return ($b['vote_average'] ?? 0) <=> ($a['vote_average'] ?? 0);
            });

            return $movies;
        });
    }

    /**
     * Get popular movies
     */
    public function getPopularMovies(int $page = 1): array
    {
        $cacheKey = "popular_movies:{$page}";

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($page) {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->bearerToken,
            ])->get("{$this->baseUrl}/movie/popular", [
                'page' => $page,
                'language' => 'en-US',
            ]);

            return $response->json();
        });
    }

    /**
     * Get all genres
     */
    public function getGenres(): array
    {
        $cacheKey = 'movie_genres';

        return Cache::remember($cacheKey, now()->addDays(7), function () {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->bearerToken,
            ])->get("{$this->baseUrl}/genre/movie/list", [
                'language' => 'en-US',
            ]);

            return $response->json();
        });
    }

    /**
     * Search movies by title
     */
    public function searchMovies(string $query, int $page = 1): array
    {
        $cacheKey = "search:{$query}:{$page}";

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($query, $page) {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->bearerToken,
            ])->get("{$this->baseUrl}/search/movie", [
                'query' => $query,
                'page' => $page,
                // Use Indonesian localization for search results so titles
                // are not translated to English when user searches in Indonesian.
                'language' => 'id-ID',
            ]);

            return $response->json();
        });
    }

    /**
     * Get movies by genre
     */
    public function getMoviesByGenre(array $genreIds, string $sortBy = 'popularity.desc', int $page = 1): array
    {
        $cacheKey = "movies_by_genre:" . implode(',', $genreIds) . ":{$sortBy}:{$page}";

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($genreIds, $sortBy, $page) {
            $genreString = implode('|', $genreIds);
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->bearerToken,
            ])->get("{$this->baseUrl}/discover/movie", [
                'with_genres' => $genreString,
                'sort_by' => $sortBy,
                'page' => $page,
                'language' => 'en-US',
            ]);

            return $response->json();
        });
    }

    /**
     * Get movie details
     */
    public function getMovieDetails(int $movieId): array
    {
        // bump cache key version to force refresh after logic change
        $cacheKey = "movie_details_v2:{$movieId}";

        return Cache::remember($cacheKey, now()->addDays(7), function () use ($movieId) {
            // Try to fetch details in Indonesian first for longer localized overview
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->bearerToken,
            ])->get("{$this->baseUrl}/movie/{$movieId}", [
                'language' => 'id-ID',
            ]);

            $data = $response->json();

            // If Indonesian overview is empty or not available, fallback to English
            if (empty($data['overview'] ?? null)) {
                $responseEn = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->bearerToken,
                ])->get("{$this->baseUrl}/movie/{$movieId}", [
                    'language' => 'en-US',
                ]);

                $dataEn = $responseEn->json();
                // prefer English if it has overview
                if (!empty($dataEn['overview'] ?? null)) {
                    $data = array_merge($data, $dataEn);
                }
            }

            return $data;
        });
    }

    /**
     * Map mood to genres
     */
    protected function getMoodGenreMapping(): array
    {
        return [
            'Happy' => [16, 35, 10751],
            'Sad' => [18, 10749],
            'Excited' => [28, 12, 878],
            'Scared' => [27, 53],
            'Relaxed' => [10749, 10751, 16],
            'Angry' => [28, 53, 80],
            'Confused' => [9648, 878],
        ];
    }

    /**
     * Get AI recommendations based on user history
     */
    public function getAIRecommendations(array $viewedMovieIds, string $currentMood = null, array $selectedGenres = []): array
    {
        $cacheKey = "ai_recommendations:" . implode(',', $viewedMovieIds) . ":{$currentMood}:" . implode(',', $selectedGenres);

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($viewedMovieIds, $currentMood, $selectedGenres) {
            $recommendations = [];

            if (!empty($viewedMovieIds)) {
                foreach ($viewedMovieIds as $movieId) {
                    $details = $this->getMovieDetails($movieId);
                    if (isset($details['genres'])) {
                        foreach ($details['genres'] as $genre) {
                            $recommendations[] = $genre['id'];
                        }
                    }
                }
            }

            $genreIds = array_unique(array_merge($recommendations, $selectedGenres));

            if (empty($genreIds)) {
                return $this->getPopularMovies();
            }

            return $this->getMoviesByGenre($genreIds, 'vote_average.desc', 1);
        });
    }
}
