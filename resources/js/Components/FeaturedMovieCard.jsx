import React from "react";

export default function FeaturedMovieCard({ movie, onInteraction, onOpen }) {
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
    const mainGenre =
        (movie.genres && movie.genres[0] && movie.genres[0].name) ||
        (movie.genre && movie.genre) ||
        "";

    const handleCardClick = () => {
        if (onInteraction) onInteraction(movie.id);
    };

    const handlePosterClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen(movie.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="rounded-xl cursor-pointer transform hover:scale-95 duration-300 p-1"
            style={{
                backgroundColor: "#EAEAEA",
                maxWidth: "335px",
                margin: "0 auto",
            }}
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover block rounded-lg"
                    onClick={handlePosterClick}
                    role="button"
                />

                {rating && (
                    <div className="absolute top-2 right-2 bg-[#BC4F51] text-white rounded-full px-2 py-1 text-xs font-bold">
                        {rating}
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="text-base font-medium text-gray-900 truncate">
                    {movie.title}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    {mainGenre && (
                        <span className="text-xs text-gray-600">
                            {mainGenre}
                        </span>
                    )}
                    <span className="text-xs text-[#000000]">{year}</span>
                </div>
            </div>
        </div>
    );
}
