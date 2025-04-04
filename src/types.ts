export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  backdrop_path: string;
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export type SortOption = 'popularity' | 'rating';

export interface PaginatedResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}