import { useLocation } from "react-router";

/**
 * Hook to efficiently get the query parameters of a given URL
 * @returns Queries of a URL as an object
 */
export default function useQuery(): { [key: string]: string } {
  const location = useLocation();

  const urlSearchParams = new URLSearchParams(location.search);
  return Object.fromEntries(urlSearchParams.entries());
}
