import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { THEME } from '../styles/theme';
import type { Movie } from '../entities/Movie';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

type MovieDetailData = Movie & {
  backdrop_path?: string | null;
  cast?: { id: number; name: string; character?: string; profile_path?: string | null }[];
  director?: string | null;
  in_watchlist?: boolean;
};

function ActionButton({ onClick, disabled, children, style }: { onClick: () => void; disabled: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...THEME.buttonBase, ...style }}>{children}</button>
  );
}

function Poster({ src, alt }: { src?: string | null; alt: string }) {
  return src ? (
    <img src={src} alt={alt} style={THEME.posterStyle} onError={e => (e.currentTarget.style.display = 'none')} />
  ) : (
    <div style={THEME.posterFallback}>No image</div>
  );
}

function CastList({ cast }: { cast: MovieDetailData['cast'] }) {
  if (!cast?.length) return null;
  return (
    <div style={{ marginTop: THEME.mainCastMarginTop, textAlign: 'left' }}>
      <h3 style={THEME.mainCastTitle}>Main cast</h3>
      <div style={{...THEME.castListRow, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {cast.map(actor => (
          <div key={actor.id} style={THEME.actorCard}>
            {actor.profile_path ? (
              <img src={`${PROFILE_BASE}${actor.profile_path}`} alt={actor.name} style={THEME.actorImage} />
            ) : (
              <div style={THEME.actorNoImage}>?</div>
            )}
            <div style={THEME.actorName}>{actor.name}</div>
            <div style={THEME.actorCharacter}>{actor.character || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/movies/detail/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setMovie(data);
      })
      .catch(() => !cancelled && setError('Error while loading the movie.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  const handleAdd = async () => {
    if (!movie) return;
    setPending(true);
    await addToWatchlist(movie);
    setMovie({ ...movie, in_watchlist: true });
    setPending(false);
  };
  const handleRemove = async () => {
    if (!movie) return;
    setPending(true);
    await removeFromWatchlist(movie.id);
    setMovie({ ...movie, in_watchlist: false });
    setPending(false);
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{...THEME.detailContainer, position: 'relative' }}>
      {movie.backdrop_path && (
        <div style={{...THEME.backdropWrapper, position: 'absolute' }}>
          <img src={`${BACKDROP_BASE}${movie.backdrop_path}`} alt="Backdrop" style={{...THEME.backdropImage, objectFit: 'cover', }} />
          <div style={{...THEME.backdropOverlay, position: 'absolute' }} />
        </div>
      )}
      <div style={{...THEME.detailContent(movie.backdrop_path != null), position: 'relative' }}>
        <div style={THEME.detailRow}>
          <Poster src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : undefined} alt={movie.title || ''} />
          <div style={{...THEME.detailInfo, textAlign: 'left'}}>
            <button onClick={() => navigate(-1)} style={THEME.buttonBack}>&larr; Back</button>
            <h2 style={THEME.title}>{movie.title || <i>Untitled</i>}</h2>
            {movie.director && <div style={THEME.director}>Directed by: {movie.director}</div>}
            <div style={THEME.originalTitle}>Original title: {movie.original_title || '-'}</div>
            <div style={THEME.overview}>{movie.overview || <span style={THEME.overviewEmpty}>No overview available.</span>}</div>
            <div><b>Release date:</b> <span style={THEME.releaseDate}>{movie.release_date || '-'}</span></div>
            <div><b>Rating:</b> <span style={THEME.rating}>{movie.vote_average ?? '-'}</span> / 10 {movie.vote_count ? <span style={THEME.ratingOutOf}>({movie.vote_count} votes)</span> : ''}</div>
            <div><b>Genres:</b> <span style={THEME.genres}>{movie.genres?.length ? movie.genres.map(g => g.name).join(', ') : '-'}</span></div>
            <div style={{ margin: '16px 0' }}>
              {movie.in_watchlist ? (
                <ActionButton onClick={handleRemove} disabled={pending} style={THEME.buttonRemove}>Remove from watchlist</ActionButton>
              ) : (
                <ActionButton onClick={handleAdd} disabled={pending} style={THEME.buttonAdd}>Add to watchlist</ActionButton>
              )}
            </div>
          </div>
        </div>
        <CastList cast={movie.cast} />
      </div>
    </div>
  );
}