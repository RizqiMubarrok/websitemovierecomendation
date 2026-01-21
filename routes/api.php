<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('movies')->group(function () {
    Route::get('/popular', [MovieController::class, 'getPopular']);
    Route::get('/search', [MovieController::class, 'search']);
    Route::get('/by-genre', [MovieController::class, 'getByGenre']);
    Route::get('/genres', [MovieController::class, 'getGenres']);
    Route::get('/{movieId}', [MovieController::class, 'getDetails']);
});

Route::prefix('recommendations')->group(function () {
    Route::get('/', [RecommendationController::class, 'getRecommendations']);
    Route::post('/interaction', [RecommendationController::class, 'recordInteraction']);
    Route::get('/ai', [RecommendationController::class, 'getAIRecommendations']);
    Route::get('/history', [RecommendationController::class, 'getUserHistory']);
});
