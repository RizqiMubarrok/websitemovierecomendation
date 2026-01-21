const API_BASE = "/api";

export const apiClient = {
    async getPopularMovies(page = 1) {
        const response = await fetch(`${API_BASE}/movies/popular?page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch popular movies");
        return response.json();
    },

    async searchMovies(query, page = 1) {
        const response = await fetch(
            `${API_BASE}/movies/search?q=${encodeURIComponent(
                query
            )}&page=${page}`
        );
        if (!response.ok) throw new Error("Failed to search movies");
        return response.json();
    },

    async getMoviesByGenre(genreIds, sortBy = "popularity.desc", page = 1) {
        const genres = Array.isArray(genreIds) ? genreIds.join(",") : genreIds;
        const response = await fetch(
            `${API_BASE}/movies/by-genre?genres=${genres}&sort_by=${sortBy}&page=${page}`
        );
        if (!response.ok) throw new Error("Failed to fetch movies by genre");
        return response.json();
    },

    async getGenres() {
        const response = await fetch(`${API_BASE}/movies/genres`);
        if (!response.ok) throw new Error("Failed to fetch genres");
        return response.json();
    },

    async getMovieDetails(movieId) {
        const response = await fetch(`${API_BASE}/movies/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        return response.json();
    },

    async getRecommendations(mood, genreIds = [], page = 1) {
        const genres = Array.isArray(genreIds) ? genreIds.join(",") : genreIds;
        const url = new URL(
            `${API_BASE}/recommendations/`,
            window.location.origin
        );
        url.searchParams.append("mood", mood);
        if (genres) url.searchParams.append("genres", genres);
        url.searchParams.append("page", page);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        return response.json();
    },

    async recordInteraction(
        tmdbMovieId,
        mood = null,
        genres = null,
        rating = null
    ) {
        const response = await fetch(
            `${API_BASE}/recommendations/interaction`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
                body: JSON.stringify({
                    tmdb_movie_id: tmdbMovieId,
                    mood,
                    genres,
                    rating,
                }),
            }
        );
        if (!response.ok) throw new Error("Failed to record interaction");
        return response.json();
    },

    async getAIRecommendations(mood = null, genreIds = [], page = 1) {
        const genres = Array.isArray(genreIds) ? genreIds.join(",") : genreIds;
        const url = new URL(
            `${API_BASE}/recommendations/ai`,
            window.location.origin
        );
        if (mood) url.searchParams.append("mood", mood);
        if (genres) url.searchParams.append("genres", genres);
        url.searchParams.append("page", page);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch AI recommendations");
        return response.json();
    },

    async getUserHistory() {
        const response = await fetch(`${API_BASE}/recommendations/history`);
        if (!response.ok) throw new Error("Failed to fetch user history");
        return response.json();
    },
};
