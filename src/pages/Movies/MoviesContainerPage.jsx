import { useGetTopMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";
import { useState } from "react";
import banner from "../../assets/banner.jpg";

const MoviesContainerPage = () => {
  const { data: topMovies, isLoading, isError } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [search, setSearch] = useState("");

  // Filter by genre and search (only on Top Movies)
  const filteredMovies = (topMovies || []).filter(
    (movie) =>
      (!selectedGenre || movie.genre === selectedGenre) &&
      (!search ||
        movie.name.toLowerCase().includes(search.trim().toLowerCase()))
  );

  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative w-full h-[18rem] flex items-center justify-center bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#23272f]/90 to-[#18181b]/80"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight">
            RateMyMovie
          </h1>
          <p className="text-lg md:text-2xl font-medium text-gray-200">
            Discover, rate, and review the best in cinema
          </p>
        </div>
      </div>

      {/* Search & Genre Filter */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <input
          type="text"
          className="w-full md:w-72 h-12 border border-gray-600 bg-[#23272f] text-white px-4 rounded focus:ring-2 focus:ring-teal-500 outline-none"
          placeholder="Search Top Movies"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-row gap-2 overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              !selectedGenre
                ? "bg-teal-500 text-white"
                : "bg-[#23272f] text-gray-300 hover:bg-teal-600 hover:text-white"
            }`}
            onClick={() => setSelectedGenre(null)}
          >
            All Genres
          </button>
          {genres?.map((g) => (
            <button
              key={g._id}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedGenre === g._id
                  ? "bg-teal-500 text-white"
                  : "bg-[#23272f] text-gray-300 hover:bg-teal-600 hover:text-white"
              }`}
              onClick={() => setSelectedGenre(g._id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top Movies Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Top Movies</h2>
        {isLoading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Error loading top movies.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-16">
            {filteredMovies && filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No top movies found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesContainerPage;
