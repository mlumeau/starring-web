import { useEffect } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { useMovieStore } from '../store/movieStore';
import type { Movie } from '../entities/Movie';
import { MovieListPanel } from './MovieListPanel';

export default function Watchlist() {
  const { movies, setMovies, loading, setLoading, error, setError } = useMovieStore();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getWatchlist()
      .then(response => {
        console.log('Réponse brute getWatchlist:', response);
        const raw = Array.isArray(response) ? response : [];
        const movies: Movie[] = raw.map(item => ({
          id: item.movie_id,
          title: item.title,
          original_title: item.original_title ?? null,
          poster_path: item.poster_path ?? null,
          overview: item.overview ?? null,
        }));
        console.log('Movies après mapping:', movies);
        setMovies(movies);
      })
      .catch(() => setError('Error loading watchlist.'))
      .finally(() => setLoading(false));
  }, [setMovies, setLoading, setError]);

  const handleRemove = (movie_id: number) => {
    removeFromWatchlist(movie_id)
      .then(() => setMovies(movies.filter(m => m.id !== movie_id)))
      .catch(() => setError('Error removing from watchlist.'));
  };

  return (
    <MovieListPanel
      title="My Watchlist"
      movies={movies}
      loading={loading}
      error={error}
      inWatchlist={() => true}
      onRemove={movie => handleRemove(movie.id)}
      darkMode
      emptyMessage="No movies in the watchlist."
    />
  );
}
