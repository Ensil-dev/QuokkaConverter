import { useState, useCallback } from 'react';

export interface UseConverterState<T = unknown> {
  loading: boolean;
  error: string;
  result: T | null;
}

export interface UseConverterActions<T> {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setResult: (result: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

export function useConverter<T = unknown>(initialResult: T | null = null): [UseConverterState<T>, UseConverterActions<T>] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<T | null>(initialResult);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError('');
    setResult(null);
  }, []);

  const state: UseConverterState<T> = {
    loading,
    error,
    result
  };

  const actions: UseConverterActions<T> = {
    setLoading,
    setError,
    setResult,
    clearError,
    reset
  };

  return [state, actions];
}
