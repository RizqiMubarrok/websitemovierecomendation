import React from "react";

export default function MovieCard({
    movie,
    genres = [],
    onInteraction,
    onOpen,
}) {
    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : "https://via.placeholder.com/342x513?text=No+Poster";

    // Get the main genre name from the first genre ID
    const getMainGenre = () => {
        if (!movie.genre_ids || movie.genre_ids.length === 0) return null;
        const mainGenreId = movie.genre_ids[0];
        const genreObj = genres.find((g) => g.id === mainGenreId);
        return genreObj ? genreObj.name : null;
    };

    const mainGenre = getMainGenre();

    const handleClick = () => {
        if (onInteraction) {
            onInteraction(movie.id);
        }
    };

    const handlePosterClick = (e) => {
        e.stopPropagation();
        if (onOpen) onOpen(movie.id);
    };

    return (
        <div
            onClick={handleClick}
            className="rounded-xl cursor-pointer group p-5 transform transition-shadow duration-300"
            style={{
                backgroundColor: "#EAEAEA",
                maxWidth: "335px",
                margin: "0 auto",
            }}
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img
                    src={posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onClick={handlePosterClick}
                    role="button"
                />
                {movie.vote_average && (
                    <div className="absolute top-2 right-2 bg-[#BC4F51] text-white rounded-full px-2 py-1 text-xs font-bold">
                        {movie.vote_average.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {movie.title}
                </h3>
                {mainGenre && (
                    <p className="text-xs text-gray-600 mt-2">{mainGenre}</p>
                )}
            </div>
        </div>
    );
}
