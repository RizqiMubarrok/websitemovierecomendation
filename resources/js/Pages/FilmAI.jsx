import React, { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import GenrePill from "../Components/GenrePill";
import SearchInput from "../Components/SearchInput";
import Pagination from "../Components/Pagination";
import { apiClient } from "../utils/apiClient";

const moods = [
    "Happy",
    "Sad",
    "Excited",
    "Scared",
    "Relaxed",
    "Angry",
    "Confused",
];

export default function FilmAI() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchGenres();
        fetchInitialMovies();
    }, []);

    useEffect(() => {
        if (hasSearched) {
            fetchAIRecommendations();
        }
    }, [selectedMood, selectedGenres, page, hasSearched]);

    const fetchGenres = async () => {
        try {
            const result = await apiClient.getGenres();
            setGenres(result.data || []);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchInitialMovies = async () => {
        try {
            setLoading(true);
            const result = await apiClient.getPopularMovies(1);
            setMovies(result.data || []);
            setPagination(result.pagination || {});
        } catch (error) {
            console.error("Error fetching initial movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIRecommendations = async () => {
        try {
            setLoading(true);
            const result = await apiClient.getAIRecommendations(
                selectedMood,
                selectedGenres,
                page,
            );
            setMovies(result.data || []);
            setPagination(result.pagination || {});
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMoodClick = (mood) => {
        setSelectedMood(selectedMood === mood ? null : mood);
        setPage(1);
        setHasSearched(true);
    };

    const handleGenreClick = (genreId) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId],
        );
        setPage(1);
        setHasSearched(true);
    };

    const handleSearch = async (query) => {
        try {
            setLoading(true);
            const result = await apiClient.searchMovies(query, 1);
            setMovies(result.data || []);
            setPagination(result.pagination || {});
            setHasSearched(true);
        } catch (error) {
            console.error("Error searching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieInteraction = async (movieId) => {
        try {
            await apiClient.recordInteraction(
                movieId,
                selectedMood,
                selectedGenres,
            );
        } catch (error) {
            console.error("Error recording interaction:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Selamat Datang, Film
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Apa yang ada di
                    <span className="text-[#BC4F51] font-semibold">
                        {" "}
                        Pikiranmu?
                    </span>
                </p>

                {/* Search Input */}
                <div className="mb-8">
                    <SearchInput
                        onSearch={handleSearch}
                        placeholder="AI merekomendasikan film berdasarkan input"
                    />
                </div>

                {/* Mood Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Pilih Mood Anda
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {moods.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => handleMoodClick(mood)}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    selectedMood === mood
                                        ? "bg-[#BC4F51] text-white"
                                        : "bg-white text-gray-900 border-2 border-gray-300 hover:border-[#BC4F51]"
                                }`}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Genre Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Pilih Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <GenrePill
                                key={genre.id}
                                id={genre.id}
                                name={genre.name}
                                isActive={selectedGenres.includes(genre.id)}
                                onClick={handleGenreClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Movies Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-gray-500">
                            Loading recommendations...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    onInteraction={handleMovieInteraction}
                                />
                            ))}
                        </div>

                        {movies.length === 0 && hasSearched && (
                            <div className="flex justify-center items-center h-96">
                                <div className="text-lg text-gray-500">
                                    No recommendations found.
                                </div>
                            </div>
                        )}

                        {pagination.total_pages > 1 && (
                            <Pagination
                                currentPage={pagination.current_page}
                                totalPages={pagination.total_pages}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
