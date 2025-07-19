const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function fetchMovies(endpoint: string, page = 1) {
  const cacheKey = `movies_${endpoint}_page_${page}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  const res = await fetch(`/api/movies/${endpoint}?page=${page}`);
  if (!res.ok) throw new Error('Erreur API');
  const data = await res.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}
