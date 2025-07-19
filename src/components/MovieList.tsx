import { useEffect, useState } from 'react';
import { fetchMovies } from '../services/movieService';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../services/watchlistService';
import { useMovieStore } from '../store/movieStore';
import type { Movie } from '../entities/Movie';
import { useSearchParams } from 'react-router-dom';
import { MovieListPanel } from './MovieListPanel';
import { THEME } from '../styles/theme';

interface MovieListProps {
  endpoint: string;
  title: string;
}

function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) {
  return totalPages > 1 ? (
    <div style={{ display: 'flex', justifyContent: 'center', gap: THEME.cardGap, margin: '24px 0' }}>
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{
          ...THEME.paginationButton,
          ...(page === 1 ? THEME.paginationButtonDisabled : {}),
        }}
      >Previous</button>
      <span style={{ alignSelf: 'center' }}>Page {page} / {totalPages}</span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={{
          ...THEME.paginationButton,
          ...(page === totalPages ? THEME.paginationButtonDisabled : {}),
        }}
      >Next</button>
    </div>
  ) : null;
}

export default function MovieList({ endpoint, title }: MovieListProps) {
  const { movies, setMovies, loading, setLoading, error, setError } = useMovieStore();
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { setSearchParams({ page: String(page) }); }, [page, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovies(endpoint, page)
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => setError('Error loading movies.'))
      .finally(() => setLoading(false));
  }, [endpoint, page, setMovies, setLoading, setError]);

  useEffect(() => {
    getWatchlist()
      .then((response) => {
        const raw = Array.isArray(response) ? response : [];
        setWatchlist(raw.map((item: { movie_id: number }) => item.movie_id));
      })
      .catch(() => setWatchlist([]));
  }, [endpoint]);

  useEffect(() => { setPage(pageParam); }, [pageParam, endpoint]);

  const handleAdd = (movie: Movie) => {
    addToWatchlist(movie).then((res) => {
      if (res.success !== false) setWatchlist(wl => [...wl, movie.id]);
    });
  };
  const handleRemove = (movie: Movie) => {
    removeFromWatchlist(movie.id).then((res) => {
      if (res.success !== false) setWatchlist(wl => wl.filter(id => id !== movie.id));
    });
  };

  return (
    <MovieListPanel
      title={title}
      movies={movies}
      loading={loading}
      error={error}
      inWatchlist={movie => watchlist.includes(movie.id)}
      onAdd={handleAdd}
      onRemove={handleRemove}
      darkMode
      pagination={<Pagination page={page} totalPages={totalPages} setPage={setPage} />}
    />
  );
}
