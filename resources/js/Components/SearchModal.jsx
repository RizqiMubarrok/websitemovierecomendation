import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { apiClient } from "../utils/apiClient";
import MovieModal from "./MovieModal";

export default function SearchModal({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const openRef = useRef(open);

    // helpers to lock/unlock body scroll shared per-window via a counter
    const lockBodyScroll = () => {
        if (!window.__modalOpenCount) window.__modalOpenCount = 0;
        window.__modalOpenCount++;
        if (window.__modalOpenCount === 1)
            document.body.classList.add("overflow-hidden");
    };
    const unlockBodyScroll = () => {
        window.__modalOpenCount = Math.max(
            0,
            (window.__modalOpenCount || 1) - 1,
        );
        if (window.__modalOpenCount === 0)
            document.body.classList.remove("overflow-hidden");
    };

    useEffect(() => {
        openRef.current = open;
        if (open) {
            lockBodyScroll();
            setTimeout(() => inputRef.current?.focus(), 50);
            document.addEventListener("keydown", handleKeyDown);
        } else {
            setQuery("");
            setResults([]);
            setShowResults(false);
            // reset selected movie/modal when search modal is closed
            setShowMovieModal(false);
            setSelectedMovie(null);
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            if (open) {
                // cleanup lock added when open was true
                unlockBodyScroll();
                document.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [open]);

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
    };

    const handleOutsideClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (open) document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [open]);

    const doSearch = async (q) => {
        if (!q || q.trim() === "") {
            setResults([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.searchMovies(q, 1);
            // api returns { success, data }
            const items = (res && res.data) || res || [];
            setResults(items || []);
            setShowResults(true);
        } catch (e) {
            setResults([]);
            setShowResults(true);
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const v = e.target.value;
        setQuery(v);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // debounce 250ms
        timeoutRef.current = setTimeout(() => doSearch(v), 250);
    };

    const onItemClick = (movie) => {
        // fetch movie details and open MovieModal
        (async () => {
            try {
                setLoading(true);
                const res = await apiClient.getMovieDetails(movie.id);
                // API returns movie object (or { data: movie })
                const mv = (res && res.data) || res || null;
                // only show movie modal if search modal is still open
                if (openRef.current) {
                    setSelectedMovie(mv);
                    setShowMovieModal(true);
                }
            } catch (e) {
                console.error("Failed to load movie details", e);
            } finally {
                setLoading(false);
            }
        })();
    };

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showMovieModal, setShowMovieModal] = useState(false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                ref={containerRef}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-20 p-4"
            >
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={onChange}
                            placeholder="Cari film, genre, atau sutradara..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 placeholder-gray-400 caret-gray-900 focus:outline-none focus:ring-0 focus:border-gray-200 focus-visible:outline-none"
                        />
                    </div>

                    <button
                        aria-label="Close search"
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-900"
                    >
                        <X />
                    </button>
                </div>

                {/* Results */}
                {query.trim() !== "" && (
                    <div className="mt-3 bg-white max-h-[60vh] overflow-auto">
                        {loading ? (
                            <div className="p-4 text-sm text-gray-500">
                                Loading...
                            </div>
                        ) : results && results.length > 0 ? (
                            <ul className="rounded-md overflow-hidden">
                                {results.map((m) => (
                                    <li
                                        key={m.id}
                                        onClick={() => onItemClick(m)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                    >
                                        <span className="text-sm font-medium text-gray-900">
                                            {m.title}
                                        </span>
                                        <span className="text-sm text-[#BC4F51]">
                                            {m.release_date
                                                ? `(${m.release_date.split("-")[0]})`
                                                : ""}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-sm text-gray-500">
                                Film tidak ditemukan
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Movie detail modal */}
            {showMovieModal && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => {
                        setShowMovieModal(false);
                        setSelectedMovie(null);
                    }}
                />
            )}
        </div>
    );
}
