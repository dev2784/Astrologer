export async function jsonFetcher(url: string) {
  const response = await fetch(url);
  if (response.status === 404) return {};
  if (!response.ok) throw new Error('Unable to load data. Please try again.');
  return response.json();
}
