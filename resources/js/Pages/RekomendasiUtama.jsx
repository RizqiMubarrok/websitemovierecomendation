import React, { useEffect, useState } from "react";
import FeaturedMovieCard from "../Components/FeaturedMovieCard";
import MovieModal from "../Components/MovieModal";
import Pagination from "../Components/Pagination";
import { apiClient } from "../utils/apiClient";
import { groupMoviesByMood } from "../utils/moodRecommender";

const moods = [
    "Happy",
    "Sad",
    "Excited",
    "Scared",
    "Relaxed",
    "Angry",
    "Confused",
];

export default function RekomendasiUtama() {
    const [movies, setMovies] = useState([]);
    const [selectedMood, setSelectedMood] = useState("Happy");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    const [moviesByGroup, setMoviesByGroup] = useState({
        high: [],
        medium: [],
        low: [],
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, [selectedMood, page]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setMounted(false);
            // Fetch starting page from server
            const result = await apiClient.getRecommendations(
                selectedMood,
                [],
                page,
            );

            let items = result.data || [];
            const serverPagination = result.pagination || {};

            // Ensure we display exactly 7 items per page (if available) by
            // fetching subsequent server pages and concatenating until we
            // reach 7 items or there are no more pages.
            let nextPage = page;
            const totalPages = serverPagination.total_pages || 1;
            while (items.length < 7 && nextPage < totalPages) {
                nextPage += 1;
                try {
                    const nextRes = await apiClient.getRecommendations(
                        selectedMood,
                        [],
                        nextPage,
                    );
                    const more = nextRes.data || [];
                    items = items.concat(more);
                } catch (err) {
                    // stop fetching more on error
                    break;
                }
            }

            // compute groups based on active mood and prioritize display
            const groups = groupMoviesByMood(items, selectedMood);
            setMoviesByGroup(groups);

            // build prioritized list: high -> medium -> low
            const prioritized = [
                ...groups.high.map((g) => g.movie),
                ...groups.medium.map((g) => g.movie),
                ...groups.low.map((g) => g.movie),
            ];

            // Trim to exactly 7 items (or fewer if not enough available)
            const finalList = prioritized.slice(0, 7);
            setMovies(finalList);
            // trigger entrance animation after movies are set
            setTimeout(() => setMounted(true), 60);
            setPagination(serverPagination);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMoodChange = (mood) => {
        setSelectedMood(mood);
        setPage(1);
    };

    const handleMovieInteraction = async (movieId) => {
        try {
            await apiClient.recordInteraction(movieId, selectedMood, []);
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-8xl w-full mx-auto px-4 sm:px-12 lg:px-30 pt-4 pb-16">
                <h2 className="text-3xl font-medium text-black mb-4">
                    Rekomendasi film yang ingin ditonton sesuai{" "}
                    <span className="text-[#BC4F51] font-semibold"> Mood</span>
                </h2>

                {/* Mood Selection (horizontal scroll bar) */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-reguler text-black">
                            Pilih Mood Anda:
                        </h3>
                    </div>

                    <div className="mt-2 flex space-x-4 overflow-x-auto py-1">
                        {moods.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => handleMoodChange(mood)}
                                className={`flex-shrink-0 w-32 flex items-center justify-center px-4 py-2 rounded-full font-medium transition ${
                                    selectedMood === mood
                                        ? "bg-[#BC4F51] text-white"
                                        : "bg-white text-black border-2 border-black hover:border-[#000000]"
                                }`}
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Genre filter removed per design */}

                {/* Movies Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-gray-500">
                            Loading movies...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-8">
                            <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-6 pt-2 items-start">
                                {movies.map((movie, idx) => (
                                    <div
                                        key={movie.id}
                                        className={`flex-shrink-0 transform transition-all duration-500 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                        style={{
                                            width: 200,
                                            transitionDelay: `${idx * 80}ms`,
                                        }}
                                    >
                                        <FeaturedMovieCard
                                            movie={movie}
                                            onInteraction={
                                                handleMovieInteraction
                                            }
                                            onOpen={openMovieModal}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {movies.length === 0 && (
                            <div className="flex justify-center items-center h-96">
                                <div className="text-lg text-gray-500">
                                    No movies found for this mood.
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
                    </>
                )}
            </div>
        </div>
    );
}
