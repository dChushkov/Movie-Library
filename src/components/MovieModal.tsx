import React, { useEffect, useState } from 'react';
import { X, Clock, Calendar, Star, Play } from 'lucide-react';
import { MovieDetails, MovieVideo } from '../types';
import { getMovieDetails, getMovieVideos } from '../api';

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movieId, onClose }) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieDetails, movieVideos] = await Promise.all([
          getMovieDetails(movieId),
          getMovieVideos(movieId)
        ]);
        setDetails(movieDetails);
        setVideos(movieVideos.filter(video => video.site === 'YouTube' && video.type === 'Trailer'));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  const openYouTubeVideo = (videoKey: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoKey}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!details) return null;

  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1920';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={backdropUrl}
            alt={details.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{details.title}</h2>
          {details.tagline && (
            <p className="text-gray-400 italic mb-4">{details.tagline}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(details.release_date).getFullYear()}
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              {details.runtime} min
            </div>
            <div className="flex items-center text-gray-300">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              {details.vote_average.toFixed(1)}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {details.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-300 mb-6">{details.overview}</p>

          {videos.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Trailers</h3>
              <div className="grid gap-4">
                {videos.slice(0, 2).map(video => (
                  <button
                    key={video.id}
                    onClick={() => openYouTubeVideo(video.key)}
                    className="w-full bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors flex items-center gap-3 text-white"
                  >
                    <Play className="w-6 h-6" />
                    <span className="text-left">{video.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};