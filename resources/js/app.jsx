import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import RekomendasiUtama from "./Pages/RekomendasiUtama";
import BerdasarkanGenre from "./Pages/BerdasarkanGenre";
import FilmAI from "./Pages/FilmAI";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                        path="/rekomendasi-utama"
                        element={<RekomendasiUtama />}
                    />
                    <Route
                        path="/berdasarkan-genre"
                        element={<BerdasarkanGenre />}
                    />
                    <Route path="/film-ai" element={<FilmAI />} />
                </Routes>
            </div>
        </Router>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
