import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function MovieModal({ movie, onClose }) {
    useEffect(() => {
        if (!movie) return;
        // increment modal open counter and lock body scroll
        if (!window.__modalOpenCount) window.__modalOpenCount = 0;
        window.__modalOpenCount++;
        if (window.__modalOpenCount === 1)
            document.body.classList.add("overflow-hidden");
        return () => {
            window.__modalOpenCount = Math.max(
                0,
                (window.__modalOpenCount || 1) - 1,
            );
            if (window.__modalOpenCount === 0)
                document.body.classList.remove("overflow-hidden");
        };
    }, [movie]);

    if (!movie) return null;

    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    const genres = movie.genres || [];
    const runtime = movie.runtime ? `${movie.runtime} min` : "-";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "-";
    const production =
        (movie.production_companies &&
            movie.production_companies[0] &&
            movie.production_companies[0].name) ||
        "";
    const year = movie.release_date
        ? `(${movie.release_date.split("-")[0]})`
        : "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            {/* Modal Card */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden z-10 p-8 md:p-10"
                style={{ maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    aria-label="Close movie"
                    onClick={onClose}
                    className="absolute top-0.5 right-1 p-2 text-gray-600 hover:text-gray-900 z-20"
                >
                    <X />
                </button>
                {/* Close button removed per design */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Text content */}
                    <div className="flex-1 overflow-auto pr-4">
                        <div className="mb-1.5 flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex flex-wrap items-center gap-4">
                                {genres.map((g) => (
                                    <span
                                        key={g.id ?? g.name}
                                        className="text-sm"
                                        style={{ color: "#BC4F51" }}
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <span className="ml-2 text-yellow-500 font-normal">
                                {rating}
                            </span>
                        </div>

                        <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
                            <span>{runtime}</span>
                            <span>{production}</span>
                            <span>{year}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 leading-tight uppercase">
                            {movie.title}
                        </h1>

                        <div className="text-sm text-gray-500 leading-relaxed max-h-[55vh] overflow-auto pr-2">
                            {movie.overview}
                        </div>
                    </div>

                    {/* Right: Poster */}
                    <div className="md:w-96 w-72 flex-shrink-0 flex items-start justify-center">
                        <div className="w-full rounded-2xl overflow-hidden ring-1 ring-gray-100">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-auto object-cover block"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
