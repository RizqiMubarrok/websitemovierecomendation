import React, { useEffect, useState } from "react";
// Movie cards, genre pills and mood selection removed from this page
import SearchInput from "../Components/SearchInput";
import { apiClient } from "../utils/apiClient";

export default function FilmAI() {
    const [movies, setMovies] = useState([]);
    // mood and genre selection removed — AI endpoint will be called without filters
    const [loading, setLoading] = useState(false);
    const [initialMounted, setInitialMounted] = useState(false);
    // pagination removed for this page
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        fetchInitialMovies();
    }, []);

    useEffect(() => {
        if (hasSearched) {
            fetchAIRecommendations();
        }
    }, [hasSearched]);

    useEffect(() => {
        const t = setTimeout(() => setInitialMounted(true), 90);
        return () => clearTimeout(t);
    }, []);

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
            <div className="max-w-8xl w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto text-center py-12">
                    <h2
                        className={
                            (initialMounted
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4") +
                            " text-4xl md:text-4xl font-medium text-black leading-tight mb-2 transition-transform duration-500 ease-out"
                        }
                    >
                        Selamat Datang, Film
                    </h2>

                    <p
                        className={
                            (initialMounted
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-3") +
                            " text-4xl md:text-4xl font-medium text-black mb-10 transition-transform duration-500 ease-out delay-75"
                        }
                    >
                        Apa yang ada di
                        <span className="text-[#BC4F51] font-medium">
                            {" "}
                            Pikiranmu?
                        </span>
                    </p>

                    <div
                        className={
                            (initialMounted
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-4 scale-95") +
                            " mx-auto w-full max-w-6xl transition-all duration-500 ease-out delay-150"
                        }
                    >
                        <SearchInput
                            onSearch={handleSearch}
                            placeholder="AI merekomendasikan film berdasarkan input"
                            large={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
