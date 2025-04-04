import axios from 'axios';
import { Movie, MovieDetails, MovieVideo, PaginatedResponse, Genre, SortOption } from './types';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string, page = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      page,
      language: 'en-US',
      include_adult: false,
      'vote_count.gte': 1000,
    }
  });
  return response.data;
};

export const getPopularMovies = async (page = 1, sortBy: SortOption = 'popularity'): Promise<PaginatedResponse<Movie>> => {
  let endpoint = `${BASE_URL}/discover/movie`;
  let params: Record<string, any> = {
    api_key: API_KEY,
    page,
    language: 'en-US',
    region: 'US',
    include_adult: false,
    'vote_count.gte': 1000,
  };

  if (sortBy === 'popularity') {
    endpoint = `${BASE_URL}/movie/popular`;
  } else if (sortBy === 'rating') {
    params = {
      ...params,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 2000,
    };
  }

  const response = await axios.get(endpoint, { params });
  return response.data;
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
      language: 'en-US'
    }
  });
  return response.data;
};

export const getMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
    params: {
      api_key: API_KEY,
      language: 'en-US'
    }
  });
  return response.data.results;
};

export const getGenres = async (): Promise<Genre[]> => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
      language: 'en-US'
    }
  });
  return response.data.genres;
};

export const getMoviesByGenre = async (genreId: number, page = 1, sortBy: SortOption = 'popularity'): Promise<PaginatedResponse<Movie>> => {
  const params: Record<string, any> = {
    api_key: API_KEY,
    with_genres: genreId,
    page,
    language: 'en-US',
    region: 'US',
    include_adult: false,
    'vote_count.gte': 1000,
  };

  if (sortBy === 'popularity') {
    params.sort_by = 'popularity.desc';
  } else if (sortBy === 'rating') {
    params.sort_by = 'vote_average.desc';
    params['vote_count.gte'] = 2000;
  }

  const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
  return response.data;
};