// ============================================================================
// ARTCONNECT CRM - SUPABASE HOOKS
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, subscribeToTable } from '../supabase';
import type { Database } from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseSupabaseQueryOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseSupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Generic hook for Supabase queries
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseSupabaseQueryOptions<T> = {}
): UseSupabaseQueryResult<T> {
  const { enabled = true, refetchInterval, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  // Initial fetch and deps changes
  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(fetchData, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, fetchData]);

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refetch: fetchData,
  };
}

/**
 * Generic hook for Supabase mutations
 */
export function useSupabaseMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = async (variables: V): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await mutationFn(variables);
      setData(result);
      setIsSuccess(true);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setIsSuccess(false);
      onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  };

  return {
    mutate,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess,
    reset,
  };
}

/**
 * Hook for realtime table subscriptions
 */
export function useRealtimeSubscription<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Database['public']['Tables'][T]['Row'] | null;
    old: Database['public']['Tables'][T]['Row'] | null;
  }) => void,
  filter?: string,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribeToTable(table, callback, filter);

    return () => {
      unsubscribe();
    };
  }, [table, callback, filter, enabled]);
}

/**
 * Hook to check Supabase connection status
 */
export function useSupabaseConnection(): {
  isConnected: boolean;
  isChecking: boolean;
  error: Error | null;
  checkConnection: () => Promise<void>;
} {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Simple query to test connection
      const { error } = await supabase.from('users').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error('Connection failed'));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isChecking,
    error,
    checkConnection,
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate<T>(
  initialData: T | null
): {
  data: T | null;
  setOptimistic: (data: T) => void;
  rollback: () => void;
  confirm: (data: T) => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const previousDataRef = useRef<T | null>(initialData);

  const setOptimistic = (newData: T) => {
    previousDataRef.current = data;
    setData(newData);
  };

  const rollback = () => {
    setData(previousDataRef.current);
  };

  const confirm = (confirmedData: T) => {
    setData(confirmedData);
    previousDataRef.current = confirmedData;
  };

  return {
    data,
    setOptimistic,
    rollback,
    confirm,
  };
}

/**
 * Hook for pagination state
 */
export function usePagination(initialPage: number = 1, initialLimit: number = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  const updatePagination = (count: number) => {
    setTotalCount(count);
    setTotalPages(Math.ceil(count / limit));
  };

  return {
    page,
    limit,
    totalPages,
    totalCount,
    setPage,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    updatePagination,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Hook for debounced search
 */
export function useDebouncedSearch(delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, delay]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    isDebouncing: searchTerm !== debouncedTerm,
  };
}
