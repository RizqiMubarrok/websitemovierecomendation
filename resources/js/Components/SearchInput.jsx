import React, { useState } from "react";

export default function SearchInput({
    onSearch,
    placeholder = "Search movies...",
}) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

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
