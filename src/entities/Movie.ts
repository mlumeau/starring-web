export type Genre = { id: number; name: string };

export type Movie = {
  id: number;
  title?: string;
  original_title?: string;
  poster_path?: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Genre[];
};
