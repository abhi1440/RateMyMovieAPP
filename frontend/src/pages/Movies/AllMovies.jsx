import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";
import banner from "../../assets/banner.jpg";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();

  // Fetch data from API
  const { data: movies, isLoading, isError, error } = useGetAllMoviesQuery();
  const { data: genres, isLoading: genresLoading, isError: genresError } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);

  // Prepare years for filtering
  const movieYears = movies?.map((movie) => movie.year) || [];
  const uniqueYears = Array.from(new Set(movieYears));

  // Sync movies and years with Redux store
  useEffect(() => {
    if (movies) {
      dispatch(setFilteredMovies(movies));
      dispatch(setMovieYears(movieYears));
      dispatch(setUniqueYears(uniqueYears));
    }
  }, [movies, dispatch]);

  // Handlers for search, genre, year, and sort
  const handleSearchChange = (e) => {
    dispatch(setMoviesFilter({ searchTerm: e.target.value }));
    const filtered = movies.filter((movie) =>
      movie.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    dispatch(setFilteredMovies(filtered));
  };

  const handleGenreClick = (genreId) => {
    const filtered = movies.filter((movie) => movie.genre === genreId);
    dispatch(setFilteredMovies(filtered));
    dispatch(setMoviesFilter({ selectedGenre: genreId }));
  };

  const handleYearChange = (year) => {
    const filtered = movies.filter((movie) => movie.year === +year);
    dispatch(setFilteredMovies(filtered));
    dispatch(setMoviesFilter({ selectedYear: year }));
  };

  const handleSortChange = (sortOption) => {
    switch (sortOption) {
      case "new":
        dispatch(setFilteredMovies(newMovies || []));
        break;
      case "top":
        dispatch(setFilteredMovies(topMovies || []));
        break;
      case "random":
        dispatch(setFilteredMovies(randomMovies || []));
        break;
      default:
        dispatch(setFilteredMovies(movies || []));
        break;
    }
    dispatch(setMoviesFilter({ selectedSort: sortOption }));
  };

  // Loading and error states
  if (isLoading || genresLoading) return <div className="text-center mt-10">Loading movies...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error loading movies: {error?.error || error?.status}</div>;
  if (genresError) return <div className="text-center mt-10 text-red-500">Error loading genres.</div>;

  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Banner */}
      <div
        className="relative w-full h-[18rem] flex items-center justify-center bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight">Browse Movies</h1>
          <p className="text-lg md:text-2xl font-medium text-gray-200">Find your next favorite film</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <input
          type="text"
          className="w-full md:w-72 h-12 border border-gray-600 bg-[#23272f] text-white px-4 rounded focus:ring-2 focus:ring-teal-500 outline-none"
          placeholder="Search Movie"
          value={moviesFilter.searchTerm || ""}
          onChange={handleSearchChange}
        />
        <select
          className="border p-2 rounded text-black"
          value={moviesFilter.selectedGenre || ""}
          onChange={(e) => handleGenreClick(e.target.value)}
        >
          <option value="">Genres</option>
          {genres?.map((genre) => (
            <option key={genre._id} value={genre._id}>
              {genre.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded text-black"
          value={moviesFilter.selectedYear || ""}
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <option value="">Year</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded text-black"
          value={moviesFilter.selectedSort || ""}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="new">New Movies</option>
          <option value="top">Top Movies</option>
          <option value="random">Random Movies</option>
        </select>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-16">
        {filteredMovies?.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No movies found.</div>
        ) : (
          filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default AllMovies;
