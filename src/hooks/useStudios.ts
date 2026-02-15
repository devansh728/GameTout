import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studioService } from "@/services/studioService";
import { Studio, StudioRequest, StudioFilters, StudioPageResponse } from "@/types/studio";

// Query keys for cache management
export const studioKeys = {
  all: ["studios"] as const,
  lists: () => [...studioKeys.all, "list"] as const,
  list: (page: number, size: number, filters?: StudioFilters) => 
    [...studioKeys.lists(), { page, size, filters }] as const,
  pending: () => [...studioKeys.all, "pending"] as const,
  pendingList: (page: number, size: number) => 
    [...studioKeys.pending(), { page, size }] as const,
  details: () => [...studioKeys.all, "detail"] as const,
  detail: (id: number) => [...studioKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated studios
 */
export const useStudios = (
  page: number = 0,
  size: number = 20,
  filters?: StudioFilters
) => {
  const hasFilters = filters && (filters.country || filters.city || filters.ratings);

  return useQuery({
    queryKey: studioKeys.list(page, size, filters),
    queryFn: () => 
      hasFilters 
        ? studioService.getFiltered(filters, page, size)
        : studioService.getAll(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch a single studio
 */
export const useStudio = (id: number | null) => {
  return useQuery({
    queryKey: studioKeys.detail(id!),
    queryFn: () => studioService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch pending studios (admin only)
 */
export const usePendingStudios = (
  page: number = 0,
  size: number = 20
) => {
  return useQuery({
    queryKey: studioKeys.pendingList(page, size),
    queryFn: () => studioService.getPendingStudios(page, size),
    staleTime: 1 * 60 * 1000, // 1 minute - refresh more often for pending
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook for studio mutations (create, update, delete)
 */
export const useStudioMutation = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: studioKeys.all });
  }, [queryClient]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: studioService.create,
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to create studio");
      setLoading(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudioRequest }) => 
      studioService.update(id, data),
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update studio");
      setLoading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: studioService.delete,
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to delete studio");
      setLoading(false);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: studioService.bulkDelete,
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to delete studios");
      setLoading(false);
    },
  });

  // Bulk create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: studioService.bulkCreate,
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to bulk create studios");
      setLoading(false);
    },
  });

  // Approve/Reject mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: number; isApproved: boolean }) => 
      studioService.approveStudio(id, isApproved),
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update studio status");
      setLoading(false);
    },
  });

  // User create request mutation
  const createRequestMutation = useMutation({
    mutationFn: studioService.createRequest,
    onSuccess: () => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to submit studio request");
      setLoading(false);
    },
  });

  // Rate studio mutation (returns updated rating and stats)
  const rateStudioMutation = useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: number }) =>
      studioService.rateStudio(id, rating),
    onSuccess: (data) => {
      invalidateQueries();
      setSuccess(true);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to submit rating");
      setLoading(false);
    },
  });

  const create = useCallback(async (data: StudioRequest) => {
    reset();
    setLoading(true);
    return createMutation.mutateAsync(data);
  }, [createMutation, reset]);

  const update = useCallback(async (id: number, data: StudioRequest) => {
    reset();
    setLoading(true);
    return updateMutation.mutateAsync({ id, data });
  }, [updateMutation, reset]);

  const remove = useCallback(async (id: number) => {
    reset();
    setLoading(true);
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation, reset]);

  const bulkRemove = useCallback(async (ids: number[]) => {
    reset();
    setLoading(true);
    return bulkDeleteMutation.mutateAsync(ids);
  }, [bulkDeleteMutation, reset]);

  const bulkCreate = useCallback(async (studios: StudioRequest[]) => {
    reset();
    setLoading(true);
    return bulkCreateMutation.mutateAsync(studios);
  }, [bulkCreateMutation, reset]);

  const approve = useCallback(async (id: number, isApproved: boolean) => {
    reset();
    setLoading(true);
    return approveMutation.mutateAsync({ id, isApproved });
  }, [approveMutation, reset]);

  const createRequest = useCallback(async (data: StudioRequest) => {
    reset();
    setLoading(true);
    return createRequestMutation.mutateAsync(data);
  }, [createRequestMutation, reset]);

  const rateStudio = useCallback(async (id: number, rating: number) => {
    reset();
    setLoading(true);
    return rateStudioMutation.mutateAsync({ id, rating });
  }, [rateStudioMutation, reset]);

  return {
    create,
    update,
    remove,
    bulkRemove,
    bulkCreate,
    approve,
    createRequest,
    rateStudio,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook to get unique countries and cities for filters
 */
export const useStudioFilters = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Fetch all studios to extract unique values
  const { data } = useStudios(0, 100);

  useEffect(() => {
    if (data?.content) {
      const uniqueCountries = [...new Set(data.content.map(s => s.country))].sort();
      const uniqueCities = [...new Set(data.content.map(s => s.city))].sort();
      setCountries(uniqueCountries);
      setCities(uniqueCities);
    }
  }, [data]);

  return { countries, cities };
};
