import React from "react";

export default function FilterDropdown({ options, value, onChange, label }) {
    return (
        <div className="flex items-center gap-2">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 text-gray-900 font-medium bg-white"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
