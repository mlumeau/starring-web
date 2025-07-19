import type { Movie } from '../entities/Movie';
import { MovieListItem } from './MovieListItem';
import { THEME } from '../styles/theme';

interface MovieListPanelProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  inWatchlist?: (movie: Movie) => boolean;
  onAdd?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
  darkMode?: boolean;
  emptyMessage?: string;
  pagination?: React.ReactNode;
}

export function MovieListPanel({
  title,
  movies,
  loading,
  error,
  inWatchlist,
  onAdd,
  onRemove,
  darkMode,
  emptyMessage = 'No movies to display.',
  pagination,
}: MovieListPanelProps) {
  return (
    <div style={THEME.listPanelContainer}>
      <h2 style={THEME.listPanelTitle}>{title}</h2>
      {loading && <p style={THEME.listPanelLoading}>Loading…</p>}
      {error && <p style={THEME.listPanelError}>{error}</p>}
      {!loading && !error && (
        <>
          <ul style={THEME.listPanelList}>
            {movies.length === 0 && <li style={THEME.listPanelEmpty}>{emptyMessage}</li>}
            {movies.map((movie) => (
              <MovieListItem
                key={movie.id}
                movie={movie}
                inWatchlist={inWatchlist ? inWatchlist(movie) : undefined}
                onAdd={onAdd}
                onRemove={onRemove}
                darkMode={darkMode}
              />
            ))}
          </ul>
          {pagination}
        </>
      )}
    </div>
  );
}
