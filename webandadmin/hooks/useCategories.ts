import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories(search: string = "", skip: number = 0, take: number = 10) {
  // Only search if length is >= 3, otherwise pass empty string to get standard paginated batch
  const activeSearch = search.trim().length >= 3 ? search.trim() : "";
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?search=${encodeURIComponent(activeSearch)}&skip=${skip}&take=${take}`;

  const { data: res, error: err, isLoading: loading, mutate: refresh } = useSWR(
    url,
    fetcher,
    { keepPreviousData: true } // Keeps old list visible while loading the next batch smoothly
  );

  return {
    categories: res?.categories || [],
    total: res?.total || 0,
    hasMore: res?.hasMore || false,
    isLoading: loading,
    isError: err,
    refreshCategories: refresh,
  };
}