import React, { useState, useEffect } from 'react';
import { Search, SortAsc, Loader2, ChevronLeft, ChevronRight, X, Heart, Home } from 'lucide-react';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from './api';
import { Movie, SortOption, Genre } from './types';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    loadMovies(1);
    loadGenres();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const saveFavorites = (newFavorites: Movie[]) => {
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    const newFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== movie.id)
      : [...favorites, movie];
    saveFavorites(newFavorites);
  };

  const loadGenres = async () => {
    try {
      const genreList = await getGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!showOnlyFavorites) {
      loadMovies(currentPage);
    }
  }, [debouncedSearch, currentPage, selectedGenres, sortBy, showOnlyFavorites]);

  const loadMovies = async (page: number) => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearch.trim()) {
        response = await searchMovies(debouncedSearch, page);
      } else if (selectedGenres.length > 0) {
        response = await getMoviesByGenre(selectedGenres[0], page, sortBy);
      } else {
        response = await getPopularMovies(page, sortBy);
      }
      
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500));
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    if (!showOnlyFavorites) return movies;
    
    return [...movies].sort((a, b) => {
      if (!a.release_date || !b.release_date) return 0;
      
      if (sortBy === 'rating') {
        return b.vote_average - a.vote_average;
      }
      return b.vote_count - a.vote_count;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [genreId];
      setCurrentPage(1);
      return newGenres;
    });
  };

  const goToHome = () => {
    setShowOnlyFavorites(false);
    setSelectedGenres([]);
    setSearch('');
    setSortBy('popularity');
    setCurrentPage(1);
    loadMovies(1);
  };

  const displayedMovies = showOnlyFavorites ? favorites : movies;
  const sortedMovies = sortMovies(displayedMovies);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-col items-start">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 text-4xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              <Home className="w-8 h-8" />
              Movie Library
            </button>
            <p className="text-gray-400 text-sm mt-2">
              {sortBy === 'rating' ? '(Showing movies with 1000+ votes)' : '(Showing popular movies)'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showOnlyFavorites
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Heart className={showOnlyFavorites ? 'fill-current' : ''} />
              <span>{showOnlyFavorites ? 'Show All Movies' : `Favorites (${favorites.length})`}</span>
            </button>
            <p className="text-gray-400">
              Total Movies: {displayedMovies.length}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SortAsc className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">By Popularity</option>
              <option value="rating">By Rating</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedGenres.includes(genre.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre.name}
              {selectedGenres.includes(genre.id) && (
                <X className="inline-block w-4 h-4 ml-2" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : displayedMovies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">No movies found</p>
            <p className="mt-2">
              {showOnlyFavorites 
                ? "You haven't added any favorites yet"
                : "Try a different search term or genre"}
            </p>
            {showOnlyFavorites && (
              <button
                onClick={goToHome}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Movies
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={(id) => setSelectedMovie(id)}
                  isFavorite={favorites.some(fav => fav.id === movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {!showOnlyFavorites && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movieId={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;