import { useMutation, useMutationState , useIsMutating } from '@tanstack/react-query';
import { searchCompanies } from '../api/searchCompanies';

export function useSearchCompanies() {
  return useMutation({
    mutationKey: ['search-companies'],
    mutationFn: searchCompanies,
    gcTime: 60 * 1000,
  });
}

export function useIsSearchingCompanies() {
  return useIsMutating({
    mutationKey: ['search-companies'],
  }) > 0;
}

export function useLastSearchResult() {
  const results = useMutationState({
    filters: {
      mutationKey: ['search-companies'],
    },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),
  });

  return results.at(-1);
}