import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// --- SCHEMAS ---
const genreSchema = new mongoose.Schema({
    tmdbId: Number,
    name: { type: String, required: true, unique: true }
});
const Genre = mongoose.model("Genre", genreSchema);

const movieSchema = new mongoose.Schema({
    tmdbId: Number,
    name: String,
    image: String,
    year: Number,
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    detail: String,
    cast: [String]
});
const Movie = mongoose.model("Movie", movieSchema);

// --- FETCH GENRES FROM TMDB ---
async function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`;
    const res = await axios.get(url);
    return res.data.genres; // [{ id, name }]
}

// --- FETCH POPULAR MOVIES FROM TMDB ---
async function fetchMovies(page = 1) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const res = await axios.get(url);
    return res.data.results; // [{ id, title, genre_ids, ... }]
}

// --- FETCH MOVIE DETAILS (for overview, cast, etc.) ---
async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`;
    const res = await axios.get(url);
    return res.data;
}

// --- SEED FUNCTION ---
async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Genre.deleteMany();
    await Movie.deleteMany();

    // 1. Insert genres
    const genres = await fetchGenres();
    const genreDocs = await Genre.insertMany(genres.map(g => ({ tmdbId: g.id, name: g.name })));
    const genreMap = Object.fromEntries(genreDocs.map(g => [g.tmdbId, g]));

    // 2. Insert movies
    const movies = await fetchMovies(1); // First page (20 movies)
    let moviesToInsert = [];
    for (const m of movies.slice(0, 10)) { // Limit to 10 movies
        const details = await fetchMovieDetails(m.id);
        // Find first genre that matches your genres
        const genreId = (m.genre_ids.length && genreMap[m.genre_ids[0]]) ? genreMap[m.genre_ids[0]]._id : null;
        // Get top 3 cast members
        const cast = (details.credits && details.credits.cast) ? details.credits.cast.slice(0, 3).map(c => c.name) : [];
        moviesToInsert.push({
            tmdbId: m.id,
            name: m.title,
            image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "",
            year: details.release_date ? parseInt(details.release_date.slice(0, 4)) : null,
            genre: genreId,
            detail: details.overview,
            cast
        });
    }
    await Movie.insertMany(moviesToInsert);

    console.log("Database seeded with genres and movies from TMDb!");
    process.exit();
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});