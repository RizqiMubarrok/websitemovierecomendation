import React, { useEffect, useState, useRef } from "react";
import FeaturedMovieCard from "../Components/FeaturedMovieCard";
import MovieModal from "../Components/MovieModal";
import GenrePill from "../Components/GenrePill";
import FilterDropdown from "../Components/FilterDropdown";
import Pagination from "../Components/Pagination";
import { apiClient } from "../utils/apiClient";

const sortOptions = [
    { label: "Terbaru", value: "primary_release_date.desc" },
    { label: "Tahun", value: "release_date.desc" },
    { label: "Popularity", value: "popularity.desc" },
    { label: "Rating", value: "vote_average.desc" },
];

export default function BerdasarkanGenre() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    const [selectedYear, setSelectedYear] = useState(null);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const pillRowRef = useRef(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        if (selectedGenres.length > 0) {
            fetchMovies();
        }
    }, [selectedGenres, sortBy, page]);

    const fetchGenres = async () => {
        try {
            const result = await apiClient.getGenres();
            setGenres(result.data || []);
            if (result.data && result.data.length > 0) {
                setSelectedGenres([result.data[0].id]);
            }
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const result = await apiClient.getMoviesByGenre(
                selectedGenres,
                sortBy,
                page,
            );
            let items = result.data || [];
            // client-side year filter (API doesn't accept year param)
            if (selectedYear) {
                items = items.filter((m) => {
                    const d = m.release_date || m.first_air_date || "";
                    return d.startsWith(String(selectedYear));
                });
            }
            setMovies(items);
            setPagination(result.pagination || {});
        } catch (error) {
            console.error("Error fetching movies:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenreClick = (genreId) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId],
        );
        setPage(1);
    };

    const handleMovieInteraction = async (movieId) => {
        try {
            await apiClient.recordInteraction(movieId, null, selectedGenres);
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

    // visibility map for pills to animate when they enter/leave viewport
    const [visibleMap, setVisibleMap] = useState({});

    useEffect(() => {
        const el = pillRowRef.current;
        if (!el) return;

        const items = Array.from(el.children);
        const obs = new IntersectionObserver(
            (entries) => {
                setVisibleMap((prev) => {
                    const next = { ...prev };
                    for (const e of entries) {
                        const id = e.target.dataset.genreId;
                        if (!id) continue;
                        // Consider visible when mostly visible
                        next[id] = e.intersectionRatio > 0.6;
                    }
                    return next;
                });
            },
            { root: el, threshold: [0, 0.25, 0.6, 1] },
        );

        for (const it of items) obs.observe(it);
        return () => obs.disconnect();
    }, [genres]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-8xl w-full mx-auto px-4 sm:px-12 lg:px-30 pt-4 pb-16">
                <h2 className="text-lg font-reguler text-black">
                    Kategori Film
                </h2>

                {/* Genre Pills (horizontal, pill buttons with left/right controls) */}
                <div className="mb-6 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                        <button
                            onClick={() => {
                                const el = pillRowRef.current;
                                if (!el) return;
                                const first = el.firstElementChild;
                                if (!first) return;
                                const computed = window.getComputedStyle(el);
                                const gap =
                                    parseFloat(
                                        computed.columnGap ||
                                            computed.gap ||
                                            computed.getPropertyValue("gap"),
                                    ) || 0;
                                const step = Math.round(
                                    first.getBoundingClientRect().width + gap,
                                );
                                el.scrollBy({
                                    left: -step,
                                    behavior: "smooth",
                                });
                            }}
                            aria-label="Scroll genres left"
                            className="text-black p-2"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path
                                    d="M15 18L9 12L15 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-2 px-12">
                        <div
                            ref={pillRowRef}
                            className="flex gap-4 overflow-x-auto py-1 scrollbar-hidden snap-x snap-mandatory"
                            style={{ scrollBehavior: "smooth" }}
                        >
                            {genres.map((genre) => {
                                const isVisible = !!visibleMap[genre.id];
                                return (
                                    <button
                                        key={genre.id}
                                        data-genre-id={genre.id}
                                        onClick={() =>
                                            handleGenreClick(genre.id)
                                        }
                                        className={`snap-start flex items-center justify-center px-4 py-2 rounded-full font-medium transition-transform duration-300 ease-out ${
                                            isVisible
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 -translate-y-2"
                                        } ${
                                            selectedGenres.includes(genre.id)
                                                ? "bg-[#BC4F51] text-white"
                                                : "bg-white text-gray-900 border-2 border-black hover:border-[#000000]"
                                        }`}
                                        style={{
                                            flex: "0 0 calc((100% - 7rem) / 8)",
                                        }}
                                    >
                                        {genre.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                        <button
                            onClick={() => {
                                const el = pillRowRef.current;
                                if (!el) return;
                                const first = el.firstElementChild;
                                if (!first) return;
                                const computed = window.getComputedStyle(el);
                                const gap =
                                    parseFloat(
                                        computed.columnGap ||
                                            computed.gap ||
                                            computed.getPropertyValue("gap"),
                                    ) || 0;
                                const step = Math.round(
                                    first.getBoundingClientRect().width + gap,
                                );
                                el.scrollBy({ left: step, behavior: "smooth" });
                            }}
                            aria-label="Scroll genres right"
                            className="text-black p-2"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path
                                    d="M9 6L15 12L9 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sort Filter (three buttons: Populer, Terbaru, Tahun) */}
                <div className="mb-2">
                    <span className="text-lg font-reguler text-black">
                        Sort by:
                    </span>

                    <div className="mt-2 flex items-center gap-4">
                        <button
                            onClick={() => {
                                setSortBy("popularity.desc");
                                setShowYearDropdown(false);
                                setSelectedYear(null);
                            }}
                            className={`flex-shrink-0 w-40 flex items-center justify-center px-4 py-2 rounded-full font-medium transition ${
                                sortBy === "popularity.desc"
                                    ? "bg-[#BC4F51] text-white"
                                    : "bg-white text-gray-900 border-2 border-black"
                            }`}
                        >
                            Populer
                        </button>

                        <button
                            onClick={() => {
                                setSortBy("primary_release_date.desc");
                                setShowYearDropdown(false);
                                setSelectedYear(null);
                            }}
                            className={`flex-shrink-0 w-40 flex items-center justify-center px-4 py-2 rounded-full font-medium transition ${
                                sortBy === "primary_release_date.desc"
                                    ? "bg-[#BC4F51] text-white"
                                    : "bg-white text-gray-900 border-2 border-black"
                            }`}
                        >
                            Terbaru
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowYearDropdown((s) => !s)}
                                className={`flex-shrink-0 w-40 flex items-center justify-center px-4 py-2 rounded-full font-medium transition ${
                                    showYearDropdown || selectedYear
                                        ? "bg-[#BC4F51] text-white"
                                        : "bg-white text-gray-900 border-2 border-black"
                                }`}
                            >
                                {selectedYear ? String(selectedYear) : "Tahun"}
                            </button>

                            {showYearDropdown && (
                                <div className="absolute left-0 mt-2 z-20">
                                    <FilterDropdown
                                        options={Array.from({ length: 46 }).map(
                                            (_, i) => {
                                                const y = 2025 - i;
                                                return {
                                                    label: String(y),
                                                    value: String(y),
                                                };
                                            },
                                        )}
                                        value={selectedYear || ""}
                                        onChange={(v) => {
                                            setSelectedYear(v || null);
                                            setShowYearDropdown(false);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Movies Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-gray-500">
                            Loading movies...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-6">
                            <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-3 pt-4 items-start">
                                {movies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="flex-shrink-0"
                                        style={{ width: 200 }}
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
                                    No movies found.
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
