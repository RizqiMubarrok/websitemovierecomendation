import React from "react";
import { Search, Menu } from "lucide-react";
import SearchModal from "./SearchModal";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);

    const isActive = (path) => {
        return window.location.pathname === path;
    };

    return (
        <nav
            className="text-white py-7 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundColor: "#1B1D1F",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center" style={{ gap: "60px" }}>
                    {/* Logo */}
                    <div
                        className="text-4xl md:text-5xl font-bold italic text-white"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        MOODFLIX
                    </div>

                    {/* Desktop Navigation - Wrapped in Card */}
                    <div
                        className="hidden md:flex items-center rounded-[10px] px-6 py-3 space-x-1"
                        style={{ backgroundColor: "#32363A" }}
                    >
                        <a
                            href="/"
                            className={`px-4 py-2 text-sm font-normal transition ${
                                isActive("/") ? "" : ""
                            }`}
                        >
                            <span
                                className={`inline-block border-b-2 border-transparent transition-all ${isActive("/") ? "border-white text-white" : "text-gray-300 hover:text-white hover:border-white"}`}
                            >
                                Dashboard
                            </span>
                        </a>
                        <a
                            href="/rekomendasi-utama"
                            className="px-4 py-2 text-sm font-normal transition"
                        >
                            <span
                                className={`inline-block border-b-2 border-transparent transition-all ${isActive("/rekomendasi-utama") ? "border-white text-white" : "text-gray-300 hover:text-white hover:border-white"}`}
                            >
                                Rekomendasi Utama
                            </span>
                        </a>
                        <a
                            href="/berdasarkan-genre"
                            className="px-4 py-2 text-sm font-normal transition"
                        >
                            <span
                                className={`inline-block border-b-2 border-transparent transition-all ${isActive("/berdasarkan-genre") ? "border-white text-white" : "text-gray-300 hover:text-white hover:border-white"}`}
                            >
                                Berdasarkan Genre
                            </span>
                        </a>
                        <a
                            href="/film-ai"
                            className="px-4 py-2 text-sm font-normal transition"
                        >
                            <span
                                className={`inline-block border-b-2 border-transparent transition-all ${isActive("/film-ai") ? "border-white text-white" : "text-gray-300 hover:text-white hover:border-white"}`}
                            >
                                Film AI
                            </span>
                        </a>
                    </div>

                    {/* Spacer to push icons to the right */}
                    <div className="flex-1"></div>

                    {/* Search and Menu Icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="text-gray-300 hover:text-white transition p-2"
                            aria-label="Search"
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search size={36} />
                        </button>
                        <button
                            className="md:hidden text-gray-300 hover:text-white transition"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div
                        className="md:hidden mt-4 rounded-[10px] p-4 flex flex-col space-y-2"
                        style={{ backgroundColor: "#32363A" }}
                    >
                        <a
                            href="/"
                            className={`px-4 py-2 text-sm font-normal rounded-lg transition ${
                                isActive("/")
                                    ? "bg-[#BC4F51] text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Dashboard
                        </a>
                        <a
                            href="/rekomendasi-utama"
                            className={`px-4 py-2 text-sm font-normal rounded-lg transition ${
                                isActive("/rekomendasi-utama")
                                    ? "bg-[#BC4F51] text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Rekomendasi Utama
                        </a>
                        <a
                            href="/berdasarkan-genre"
                            className={`px-4 py-2 text-sm font-normal rounded-lg transition ${
                                isActive("/berdasarkan-genre")
                                    ? "bg-[#BC4F51] text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Berdasarkan Genre
                        </a>
                        <a
                            href="/film-ai"
                            className={`px-4 py-2 text-sm font-normal rounded-lg transition ${
                                isActive("/film-ai")
                                    ? "bg-[#BC4F51] text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Film AI
                        </a>
                    </div>
                )}
                <SearchModal
                    open={searchOpen}
                    onClose={() => setSearchOpen(false)}
                />
            </div>
        </nav>
    );
}
