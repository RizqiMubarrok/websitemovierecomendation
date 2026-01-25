import React, { useState } from "react";

export default function SearchInput({
    onSearch,
    placeholder = "Search movies...",
    large = false,
}) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    if (!large) {
        return (
            <form onSubmit={handleSubmit} className="w-full">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#BC4F51] text-gray-900"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#BC4F51] text-white px-4 py-1 rounded-lg font-medium hover:bg-[#A84245] transition"
                    >
                        Search
                    </button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    rows={6}
                    className="w-full resize-none rounded-xl border-2 border-gray-300 focus:outline-none focus:border-[#BC4F51] text-gray-700 p-6 text-lg leading-6"
                />

                {/* left icon removed */}

                {/* right small action (download-like) */}
                <button
                    type="submit"
                    className="absolute right-4 bottom-4 bg-black text-white p-2 rounded-md hover:opacity-90 transition"
                    aria-label="Kirim"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                    >
                        <path
                            d="M12 3V15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M5 10L12 3L19 10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21 21H3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </form>
    );
}
