import React, { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import MovieModal from "../Components/MovieModal";
import { apiClient } from "../utils/apiClient";

export default function Dashboard() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMoviesAndGenres();
    }, []);

    const fetchMoviesAndGenres = async () => {
        try {
            setLoading(true);
            // Fetch both movies and genres in parallel
            const genresResult = await apiClient.getGenres();

            // Map genres
            let allGenres = [];
            if (genresResult.data && Array.isArray(genresResult.data)) {
                allGenres = genresResult.data;
                setGenres(allGenres);
            }

            // Helper: find genre id by name (case-insensitive)
            const findGenreId = (names) => {
                if (!Array.isArray(names)) names = [names];
                for (const name of names) {
                    const g = allGenres.find(
                        (gg) => gg.name.toLowerCase() === name.toLowerCase(),
                    );
                    if (g) return g.id;
                }
                return null;
            };

            // Helper: fetch top movie(s) for a genre list matching min rating
            const getTopMovieByGenres = async (genreIds, minRating = 7.5) => {
                try {
                    const res = await apiClient.getMoviesByGenre(
                        genreIds,
                        "vote_count.desc",
                        1,
                    );
                    const items = res.data || [];
                    // Filter by rating threshold and availability of poster/title
                    const filtered = items.filter(
                        (m) =>
                            (m.vote_average || 0) >= minRating &&
                            (m.vote_count || 0) > 50,
                    );
                    return filtered.length ? filtered[0] : null;
                } catch (e) {
                    return null;
                }
            };

            // Determine genre ids for required composition
            const actionId = findGenreId(["Action", "Adventure"]);
            const comedyId = findGenreId(["Comedy", "Family"]);
            const animationId = findGenreId(["Animation"]);
            const dramaOrFantasyId = findGenreId(["Drama", "Fantasy"]);

            // Fetch one top movie for each category
            const picks = [];
            if (actionId) {
                const m = await getTopMovieByGenres(actionId);
                if (m) picks.push(m);
            }
            if (comedyId) {
                const m = await getTopMovieByGenres(comedyId);
                if (m) picks.push(m);
            }
            if (animationId) {
                const m = await getTopMovieByGenres(animationId);
                if (m) picks.push(m);
            }
            if (dramaOrFantasyId) {
                const m = await getTopMovieByGenres(dramaOrFantasyId);
                if (m) picks.push(m);
            }

            // If some categories didn't yield a pick, fallback to popular movies
            if (picks.length < 4) {
                try {
                    const popularRes = await apiClient.getPopularMovies(1);
                    const candidates = (popularRes.data || [])
                        .filter(
                            (m) =>
                                (m.vote_average || 0) >= 7.5 &&
                                (m.vote_count || 0) > 100,
                        )
                        .sort(
                            (a, b) => (b.vote_count || 0) - (a.vote_count || 0),
                        );

                    for (const c of candidates) {
                        if (picks.findIndex((p) => p && p.id === c.id) === -1) {
                            picks.push(c);
                        }
                        if (picks.length >= 4) break;
                    }
                } catch (e) {
                    // ignore
                }
            }

            // Final safety: ensure up to 4 unique movies
            const unique = [];
            for (const p of picks) {
                if (!p) continue;
                if (unique.findIndex((u) => u.id === p.id) === -1)
                    unique.push(p);
                if (unique.length >= 4) break;
            }
            setMovies(unique.slice(0, 4));
        } catch (error) {
            console.error("Error fetching data:", error);
            setMovies([]);
            setGenres([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieInteraction = async (movieId) => {
        try {
            await apiClient.recordInteraction(movieId);
        } catch (error) {
            console.error("Error recording interaction:", error);
        }
    };

    // Modal state
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const openMovieModal = async (movieId) => {
        try {
            setSelectedMovieId(movieId);
            setModalLoading(true);
            const res = await apiClient.getMovieDetails(movieId);
            setSelectedMovieDetails(res.data || res);
        } catch (e) {
            console.error("Failed to load movie details:", e);
            setSelectedMovieDetails(null);
        } finally {
            setModalLoading(false);
        }
    };

    const closeMovieModal = () => {
        setSelectedMovieId(null);
        setSelectedMovieDetails(null);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-8xl w-full mx-auto px-4 sm:px-12 lg:px-19 pt-4 pb-16">
                <h1 className="text-4xl md:text-4xl font-medium text-black mb-4 text-center">
                    Pilihan Film Terbaik yang
                    <br />
                    <span className="block mt-2">
                        Direkomendasikan
                        <span className="inline-block bg-[#BC4F51] text-white rounded-full px-4 py-0 ml-3 text-4xl md:text-4xl font-medium">
                            Moodflix
                        </span>
                    </span>
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-gray-500">
                            Loading movies...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mt-8">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    genres={genres}
                                    onInteraction={handleMovieInteraction}
                                    onOpen={openMovieModal}
                                />
                            ))}
                        </div>

                        {selectedMovieId && (
                            <>
                                {modalLoading ? (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                                        <div className="bg-black/50 absolute inset-0"></div>
                                        <div className="z-10 bg-white p-6 rounded shadow">
                                            Loading...
                                        </div>
                                    </div>
                                ) : (
                                    <MovieModal
                                        movie={selectedMovieDetails}
                                        onClose={closeMovieModal}
                                    />
                                )}
                            </>
                        )}

                        {movies.length === 0 && (
                            <div className="flex justify-center items-center h-96">
                                <div className="text-lg text-gray-500">
                                    No movies found.
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
