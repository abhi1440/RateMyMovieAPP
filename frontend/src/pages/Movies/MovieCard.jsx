import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => (
  <div className="bg-[#23272f] rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-105 transition-all duration-200">
    <Link to={`/movies/${movie._id}`}>
      <img
        src={movie.image}
        alt={movie.name}
        className="w-full h-64 object-cover"
      />
    </Link>
    <div className="p-4">
      <p className="text-lg font-bold text-white truncate">{movie.name}</p>
      <div className="flex flex-row gap-2 mt-2">
        <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
          {movie.year}
        </span>
      </div>
    </div>
  </div>
);

export default MovieCard;
