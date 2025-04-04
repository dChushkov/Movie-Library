import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movieId: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isFavorite, onToggleFavorite }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  const getYear = (releaseDate: string | null) => {
    if (!releaseDate) return 'N/A';
    const date = new Date(releaseDate);
    return isNaN(date.getFullYear()) ? 'N/A' : date.getFullYear();
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer relative group"
      onClick={() => onClick(movie.id)}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100"
      >
        <Heart 
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
        />
      </button>
      <div className="p-3">
        <h3 className="text-sm font-bold mb-1 text-white line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs mb-1">
          {getYear(movie.release_date)}
        </p>
        <div className="flex items-center text-xs">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-gray-300">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};