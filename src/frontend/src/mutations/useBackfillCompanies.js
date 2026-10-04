import { useMutation, useMutationState , useIsMutating } from '@tanstack/react-query';
import { backfillCompanies } from '../api/backfillCompanies';

export function useBackfillCompanies() {
  return useMutation({
    mutationKey: ['backfill-companies'],
    mutationFn: backfillCompanies,
    gcTime: 60 * 1000, 
  });
}

export function useIsBackfillingCompanies() {
  return useIsMutating({
    mutationKey: ['backfill-companies'],
  }) > 0;
}

export function useLastBackfillResult() {

  const results = useMutationState({

    filters: {
      mutationKey: ['backfill-companies'],
    },

    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),

  });

  return results.at(-1);

}