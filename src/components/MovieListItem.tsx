import type { Movie } from '../entities/Movie';
import { Link } from 'react-router-dom';
import { THEME } from '../styles/theme';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

interface MovieListItemProps {
  movie: Movie;
  inWatchlist?: boolean;
  onAdd?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
  darkMode?: boolean;
}

function ActionButton({ onClick, children, style }: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{ ...THEME.buttonBase, ...style }}>{children}</button>
  );
}

function Poster({ src, alt, darkMode }: { src: string; alt: string; darkMode?: boolean }) {
  return src ? (
    <img src={src} alt={alt} style={{ ...THEME.posterStyle, background: darkMode ? THEME.colorPosterBgDark : THEME.colorPosterBgLight, objectFit: 'cover' as const }} />
  ) : (
    <div style={THEME.posterFallback}>No image</div>
  );
}

export function MovieListItem({ movie, inWatchlist, onAdd, onRemove, darkMode }: MovieListItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        gap: THEME.cardGap,
        alignItems: 'flex-start',
        marginBottom: THEME.cardMarginBottom,
        background: darkMode ? THEME.colorDark : THEME.colorLight,
        borderRadius: THEME.borderRadius,
        boxShadow: darkMode ? THEME.colorBoxShadowDark : THEME.colorBoxShadowLight,
        padding: THEME.cardPadding,
        color: darkMode ? THEME.colorTextDark : THEME.colorTextLight,
        transition: 'box-shadow 0.2s',
      }}
      onMouseOver={e => (e.currentTarget.style.boxShadow = darkMode ? THEME.colorBoxShadowDarkHover : THEME.colorBoxShadowLightHover)}
      onMouseOut={e => (e.currentTarget.style.boxShadow = darkMode ? THEME.colorBoxShadowDark : THEME.colorBoxShadowLight)}
    >
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
        <Poster src={movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : ''} alt={movie.title || ''} darkMode={darkMode} />
      </Link>
      <div style={{ textAlign: 'left', color: darkMode ? THEME.colorTextDark : THEME.colorOverviewLight, flex: 1 }}>
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: darkMode ? THEME.colorButtonText : THEME.colorTextLight }}>
          <div style={{ fontWeight: 'bold', fontSize: THEME.fontSizeTitle, color: darkMode ? THEME.colorButtonText : THEME.colorOverviewLight, marginBottom: 4 }}>{movie.title}</div>
        </Link>
        {movie.overview && (
          <div style={{ marginTop: 8, color: darkMode ? THEME.colorOverviewDark : THEME.colorOverviewLight, textAlign: 'left' }}>{movie.overview}</div>
        )}
        <div style={{ marginTop: 8, color: darkMode ? THEME.colorOriginalTitleDark : THEME.colorOriginalTitleLight, fontSize: THEME.fontSize, fontStyle: 'italic' }}>Original title: {movie.original_title || movie.title}</div>
        {(typeof inWatchlist === 'boolean') && (onAdd || onRemove) && (
          <div style={{ marginTop: 12 }}>
            {inWatchlist ? (
              <ActionButton onClick={() => onRemove && onRemove(movie)} style={THEME.buttonRemove}>
                Remove from watchlist
              </ActionButton>
            ) : (
              onAdd && (
                <ActionButton onClick={() => onAdd(movie)} style={THEME.buttonAdd}>
                  Add to watchlist
                </ActionButton>
              )
            )}
          </div>
        )}
      </div>
    </li>
  );
}
