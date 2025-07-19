import type { Movie } from '../entities/Movie';

export interface WatchlistResponse {
    success: boolean;
    data: Movie[];
    message?: string;
}

export async function getWatchlist(): Promise<WatchlistResponse> {
  const res = await fetch('/api/watchlist');
  if (!res.ok) throw new Error('Erreur API');
  return res.json();
}

export async function addToWatchlist(movie: Movie): Promise<WatchlistResponse> {
    const payload = {
        movie_id: movie.id,
        title: movie.title,
        original_title: movie.original_title ?? movie.title,
        poster_path: movie.poster_path ?? null,
        overview: movie.overview ?? null,
    };
    const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (res.status === 409) {
        // Movie already in the watchlist
        return {
            success: false,
            data: [],
            message: 'This movie is already in the watchlist.'
        };
    }
    if (!res.ok) throw new Error('Erreur API');
    return res.json();
}

export async function removeFromWatchlist(movie_id: number): Promise<WatchlistResponse> {
  const res = await fetch(`/api/watchlist/${movie_id}`, { method: 'DELETE' });
  if (res.status === 204) {
    return { success: true, data: [] };
  }
  if (!res.ok) throw new Error('Erreur API');
  return res.json();
}
