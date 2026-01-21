<?php

namespace App\Http\Controllers;

use App\Models\UserMovieInteraction;
use App\Services\TMDBService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecommendationController extends Controller
{
    protected TMDBService $tmdbService;

    public function __construct(TMDBService $tmdbService)
    {
        $this->tmdbService = $tmdbService;
    }

    /**
     * Get recommendations based on mood and genres
     */
    public function getRecommendations(Request $request): JsonResponse
    {
        $mood = $request->query('mood', 'Happy');
        $genreIds = $request->query('genres', '');
        $page = $request->query('page', 1);
        $sessionId = $request->query('session_id', session()->getId());

        try {
            $genres = !empty($genreIds) ? array_map('intval', explode(',', $genreIds)) : [];

            $recommendations = $this->tmdbService->getRecommendations($mood, $genres, $page);

            return response()->json([
                'success' => true,
                'data' => $recommendations['results'] ?? [],
                'pagination' => [
                    'current_page' => $recommendations['page'] ?? $page,
                    'total_pages' => $recommendations['total_pages'] ?? 1,
                    'total_results' => $recommendations['total_results'] ?? 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recommendations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Record user movie interaction
     */
    public function recordInteraction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tmdb_movie_id' => 'required|integer',
            'mood' => 'nullable|string',
            'genres' => 'nullable|array',
            'rating' => 'nullable|integer|min:1|max:10',
        ]);

        try {
            $sessionId = $request->query('session_id', session()->getId());

            UserMovieInteraction::updateOrCreate(
                [
                    'session_id' => $sessionId,
                    'tmdb_movie_id' => $validated['tmdb_movie_id'],
                ],
                [
                    'mood' => $validated['mood'] ?? null,
                    'genres' => $validated['genres'] ?? null,
                    'rating' => $validated['rating'] ?? null,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Interaction recorded successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record interaction',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get AI recommendations based on user history
     */
    public function getAIRecommendations(Request $request): JsonResponse
    {
        $sessionId = $request->query('session_id', session()->getId());
        $mood = $request->query('mood', null);
        $genreIds = $request->query('genres', '');
        $page = $request->query('page', 1);

        try {
            $interactions = UserMovieInteraction::where('session_id', $sessionId)
                ->pluck('tmdb_movie_id')
                ->toArray();

            $genres = !empty($genreIds) ? array_map('intval', explode(',', $genreIds)) : [];

            $recommendations = $this->tmdbService->getAIRecommendations(
                $interactions,
                $mood,
                $genres
            );

            return response()->json([
                'success' => true,
                'data' => $recommendations['results'] ?? [],
                'pagination' => [
                    'current_page' => $recommendations['page'] ?? $page,
                    'total_pages' => $recommendations['total_pages'] ?? 1,
                    'total_results' => $recommendations['total_results'] ?? 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch AI recommendations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user interaction history
     */
    public function getUserHistory(Request $request): JsonResponse
    {
        $sessionId = $request->query('session_id', session()->getId());

        try {
            $interactions = UserMovieInteraction::where('session_id', $sessionId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $interactions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
