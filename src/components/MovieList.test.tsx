import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import MovieList from './MovieList';
import * as movieService from '../services/movieService';

const fakeMovies = [
  { id: 1, title: 'Fake Movie', poster_path: '/poster1.jpg' },
  { id: 2, title: 'Another Movie', poster_path: null },
];

describe('MovieList', () => {
  it('affiche les films et les posters', async () => {
    vi.spyOn(movieService, 'fetchMovies').mockResolvedValue({ results: fakeMovies });
    render(<MovieList endpoint="upcoming" title="Test" />);
    await waitFor(() => {
      expect(screen.getByText('Fake Movie')).toBeInTheDocument();
      expect(screen.getByText('Another Movie')).toBeInTheDocument();
      expect(screen.getAllByRole('img').length).toBe(1); // Only one poster
    });
  });

  it('affiche un message d’erreur en cas d’échec', async () => {
    vi.spyOn(movieService, 'fetchMovies').mockRejectedValue(new Error('Erreur API'));
    render(<MovieList endpoint="upcoming" title="Test" />);
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
});
