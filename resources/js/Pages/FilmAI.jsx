import React, { useEffect, useState } from "react";
// Movie cards, genre pills and mood selection removed from this page
import SearchInput from "../Components/SearchInput";
import { apiClient } from "../utils/apiClient";

export default function FilmAI() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    // mood and genre selection removed — AI endpoint will be called without filters
    const [loading, setLoading] = useState(false);
    // pagination removed for this page
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchGenres();
        fetchInitialMovies();
    }, []);

    useEffect(() => {
        if (hasSearched) {
            fetchAIRecommendations();
        }
    }, [hasSearched]);

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
        } catch (error) {
            console.error("Error fetching initial movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIRecommendations = async () => {
        try {
            setLoading(true);
            const result = await apiClient.getAIRecommendations(null, [], 1);
            setMovies(result.data || []);
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    // mood/genre handlers removed

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

    // movie interaction tracking removed for this page

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
            </div>
        </div>
    );
}
