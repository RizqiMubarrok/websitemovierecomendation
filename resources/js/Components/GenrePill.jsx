import React from "react";

export default function GenrePill({ name, id, isActive, onClick }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${
                isActive
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-900 border-gray-400 hover:border-red-500 hover:text-red-500"
            }`}
        >
            {name}
        </button>
    );
}
