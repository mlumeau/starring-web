import { create } from 'zustand';
import type { Movie } from '../entities/Movie';

interface MovieStoreState {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useMovieStore = create<MovieStoreState>((set) => ({
  movies: [],
  setMovies: (movies: Movie[]) => set({ movies }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  error: null,
  setError: (error: string | null) => set({ error }),
}));
