<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMovieInteraction extends Model
{
    protected $fillable = [
        'session_id',
        'tmdb_movie_id',
        'mood',
        'genres',
        'rating',
    ];

    protected $casts = [
        'tmdb_movie_id' => 'integer',
        'genres' => 'array',
        'rating' => 'integer',
    ];
}
