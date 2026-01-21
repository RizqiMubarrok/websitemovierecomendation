import React from "react";

export default function RatingBadge({ rating }) {
    const ratingPercentage = Math.round(rating * 10);
    const color =
        ratingPercentage >= 70
            ? "bg-green-500"
            : ratingPercentage >= 50
              ? "bg-yellow-500"
              : "bg-[#BC4F51]";

    return (
        <div
            className={`${color} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm`}
        >
            {rating.toFixed(1)}
        </div>
    );
}
