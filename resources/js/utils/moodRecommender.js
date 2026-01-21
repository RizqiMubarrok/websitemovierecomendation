// Improved mood recommender utilities
// - tokenizes title+overview
// - expanded keyword sets per mood
// - maps common genres to mood weights
// - uses weighted combination of keyword matches, genre-mood affinity, rating and popularity

const moodKeywords = {
    Happy: [
        "happy",
        "joy",
        "fun",
        "uplifting",
        "comedy",
        "family",
        "heartwarming",
        "feel-good",
        "warm",
        "lighthearted",
    ],
    Sad: [
        "sad",
        "tragic",
        "melancholy",
        "loss",
        "drama",
        "tear",
        "grief",
        "bittersweet",
    ],
    Excited: [
        "excite",
        "exciting",
        "adventure",
        "action",
        "thrill",
        "epic",
        "fast-paced",
    ],
    Scared: [
        "horror",
        "scare",
        "terrify",
        "thriller",
        "suspense",
        "fear",
        "slasher",
    ],
    Relaxed: [
        "relax",
        "calm",
        "soothing",
        "slice of life",
        "romance",
        "drama",
        "gentle",
    ],
    Angry: ["angry", "revenge", "violent", "war", "rage", "fight"],
    Confused: [
        "mystery",
        "surreal",
        "twist",
        "psychological",
        "mind-bending",
        "puzzle",
        "enigmatic",
    ],
};

// map common genre names to mood affinity weights (0-1)
const genreMoodWeights = {
    action: { Excited: 0.9, Angry: 0.4 },
    adventure: { Excited: 0.9 },
    comedy: { Happy: 0.95, Relaxed: 0.3 },
    family: { Happy: 0.9, Relaxed: 0.4 },
    drama: { Sad: 0.6, Relaxed: 0.4 },
    romance: { Relaxed: 0.8, Happy: 0.4 },
    horror: { Scared: 0.95 },
    thriller: { Scared: 0.85, Confused: 0.4 },
    mystery: { Confused: 0.9 },
    sci_fi: { Confused: 0.6, Excited: 0.4 },
    animation: { Happy: 0.9, Family: 0.6 },
    fantasy: { Excited: 0.6, Confused: 0.4 },
    documentary: { Relaxed: 0.5 },
    crime: { Angry: 0.6, Confused: 0.3 },
    war: { Angry: 0.9 },
    western: { Angry: 0.5, Excited: 0.4 },
};

function normalizeText(s = "") {
    return (s || "").toString().toLowerCase();
}

function tokenize(s = "") {
    const t = normalizeText(s);
    return t
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function countTokenMatches(tokens = [], keywords = []) {
    if (!tokens || tokens.length === 0 || !keywords || keywords.length === 0)
        return 0;
    const tokenSet = new Set(tokens);
    let count = 0;
    for (const k of keywords) {
        const kk = normalizeText(k).trim();
        if (!kk) continue;
        // exact token match or token contains keyword
        if (tokenSet.has(kk)) count += 1;
        else {
            for (const t of tokenSet) {
                if (t.includes(kk) || kk.includes(t)) {
                    count += 1;
                    break;
                }
            }
        }
    }
    return count;
}

function computeGenreMoodAffinity(movie = {}, mood = "Happy") {
    if (!movie || !movie.genres) return 0;
    let score = 0;
    for (const g of movie.genres) {
        const name = normalizeText(g.name || g);
        // try direct keys
        const key = name.replace(/\s+/g, "_");
        const weights = genreMoodWeights[key] || genreMoodWeights[name] || null;
        if (weights && weights[mood]) score += weights[mood];
        else {
            // try heuristic matching: check if genre name contains known genre keys
            for (const k of Object.keys(genreMoodWeights)) {
                if (name.includes(k.replace(/_/g, " ")) || key.includes(k)) {
                    if (genreMoodWeights[k][mood])
                        score += genreMoodWeights[k][mood];
                }
            }
        }
    }
    // clamp
    return Math.min(score, 3);
}

function scoreMovieForMood(movie = {}, mood = "Happy") {
    const title = movie.title || movie.name || "";
    const overview = movie.overview || "";
    const tokensTitle = tokenize(title);
    const tokensOverview = tokenize(overview);

    const kws = moodKeywords[mood] || [];
    // title matches are much more significant than overview matches
    const titleMatches = countTokenMatches(tokensTitle, kws);
    const overviewMatches = countTokenMatches(tokensOverview, kws);

    // phrase matches (multi-word keywords) in title/overview
    function countPhraseMatches(text = "", keywords = []) {
        const t = normalizeText(text);
        let c = 0;
        for (const k of keywords) {
            const kk = normalizeText(k).trim();
            if (kk.split(/\s+/).length <= 1) continue; // only multi-word
            if (kk && t.includes(kk)) c += 1;
        }
        return c;
    }

    const phraseMatchesTitle = countPhraseMatches(title, kws);
    const phraseMatchesOverview = countPhraseMatches(overview, kws);

    // keyword score (scaled) with title priority and phrase bonus
    const KW_TITLE_WEIGHT = 16; // each title token match
    const KW_OVERVIEW_WEIGHT = 9; // each overview token match
    const PHRASE_BONUS = 18; // multi-word phrase found bonus
    const kwScore = Math.min(
        titleMatches * KW_TITLE_WEIGHT +
            overviewMatches * KW_OVERVIEW_WEIGHT +
            (phraseMatchesTitle + phraseMatchesOverview) * PHRASE_BONUS,
        70,
    );

    // genre affinity (scaled)
    const GEN_MAX = 25;
    const genreAffinity = computeGenreMoodAffinity(movie, mood); // small float
    const genreScore = Math.min((genreAffinity / 3) * GEN_MAX, GEN_MAX);

    // rating (0-10)
    const rating = Number(movie.vote_average) || 0;
    const ratingScore = Math.min((rating / 10) * 10, 10);

    // popularity (based on vote_count) (0-10)
    const votes = Number(movie.vote_count) || 0;
    const popScore = Math.min((votes / 2000) * 10, 10);

    const raw = kwScore + genreScore + ratingScore + popScore;
    const MAX_RAW = 70 + GEN_MAX + 10 + 10; // match new kwScore cap + others
    const score = Math.min(Math.round((raw / MAX_RAW) * 100), 100);

    return score;
}

function groupMoviesByMood(movies = [], mood = "Happy") {
    const groups = { high: [], medium: [], low: [] };
    for (const m of movies) {
        const s = scoreMovieForMood(m, mood);
        const item = { movie: m, score: s };
        if (s >= 65) groups.high.push(item);
        else if (s >= 40) groups.medium.push(item);
        else groups.low.push(item);
    }
    for (const k of Object.keys(groups))
        groups[k].sort((a, b) => b.score - a.score);
    return groups;
}

export { scoreMovieForMood, groupMoviesByMood };
