import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MovieList from './components/MovieList.tsx';
import Watchlist from './components/Watchlist.tsx';
import MovieDetail from './components/MovieDetail.tsx';
import './App.css';

function App() {
  useEffect(() => {
    document.title = 'Starring – The Movie Database';
  }, []);
  return (
    <Router>
      <header style={{
        textAlign: 'left',
        margin: 0,
        paddingLeft: 32,
        top: 0,
        zIndex: 100,
        paddingTop: 24,
        paddingBottom: 8,
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1, color: '#fcfcfc', margin: 0 }}>
          Starring <span style={{ color: '#1976d2' }}>🎬</span>
        </h1>
        <div style={{ color: '#888', fontSize: 18, marginTop: 4 }}>The Movie Database Watchlist App</div>
      </header>
      <nav style={{
        display: 'flex',
        gap: 16,
        marginBottom: 24,
        justifyContent: 'flex-start',
        paddingLeft: 32,
        top: 80,
        zIndex: 99,
        paddingTop: 8,
        paddingBottom: 8,
      }}>
        <NavLink to="/upcoming">Upcoming</NavLink>
        <NavLink to="/now_playing">Now Playing</NavLink>
        <NavLink to="/top_rated">Top Rated</NavLink>
        <NavLink to="/popular">Popular</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
      </nav>
      <Routes>
        <Route path="/upcoming" element={<MovieList endpoint="upcoming" title="Upcoming Movies" />} />
        <Route path="/now_playing" element={<MovieList endpoint="now_playing" title="Now Playing" />} />
        <Route path="/top_rated" element={<MovieList endpoint="top_rated" title="Top Rated" />} />
        <Route path="/popular" element={<MovieList endpoint="popular" title="Popular" />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="*" element={<Navigate to="/upcoming" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
