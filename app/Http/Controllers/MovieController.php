<?php

namespace App\Http\Controllers;

use App\Services\TMDBService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    protected TMDBService $tmdbService;

    public function __construct(TMDBService $tmdbService)
    {
        $this->tmdbService = $tmdbService;
    }

    /**
     * Get popular movies
     */
    public function getPopular(Request $request): JsonResponse
    {
        $page = $request->query('page', 1);

        try {
            $movies = $this->tmdbService->getPopularMovies($page);

            return response()->json([
                'success' => true,
                'data' => $movies['results'] ?? [],
                'pagination' => [
                    'current_page' => $movies['page'] ?? $page,
                    'total_pages' => $movies['total_pages'] ?? 1,
                    'total_results' => $movies['total_results'] ?? 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch popular movies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search movies
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q', '');
        $page = $request->query('page', 1);

        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required',
            ], 400);
        }

        try {
            $movies = $this->tmdbService->searchMovies($query, $page);

            return response()->json([
                'success' => true,
                'data' => $movies['results'] ?? [],
                'pagination' => [
                    'current_page' => $movies['page'] ?? $page,
                    'total_pages' => $movies['total_pages'] ?? 1,
                    'total_results' => $movies['total_results'] ?? 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search movies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get movies by genre
     */
    public function getByGenre(Request $request): JsonResponse
    {
        $genreIds = $request->query('genres', '');
        $sortBy = $request->query('sort_by', 'popularity.desc');
        $page = $request->query('page', 1);

        if (empty($genreIds)) {
            return response()->json([
                'success' => false,
                'message' => 'Genre IDs are required',
            ], 400);
        }

        try {
            $genres = array_map('intval', explode(',', $genreIds));
            $movies = $this->tmdbService->getMoviesByGenre($genres, $sortBy, $page);

            return response()->json([
                'success' => true,
                'data' => $movies['results'] ?? [],
                'pagination' => [
                    'current_page' => $movies['page'] ?? $page,
                    'total_pages' => $movies['total_pages'] ?? 1,
                    'total_results' => $movies['total_results'] ?? 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch movies by genre',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all genres
     */
    public function getGenres(): JsonResponse
    {
        try {
            $genres = $this->tmdbService->getGenres();

            return response()->json([
                'success' => true,
                'data' => $genres['genres'] ?? [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch genres',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get movie details
     */
    public function getDetails(int $movieId): JsonResponse
    {
        try {
            $movie = $this->tmdbService->getMovieDetails($movieId);

            return response()->json([
                'success' => true,
                'data' => $movie,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch movie details',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
