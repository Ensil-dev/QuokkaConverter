import { useState, useCallback } from 'react';

export interface UseConverterState<T = any> {
  loading: boolean;
  error: string;
  result: T | null;
}

export interface UseConverterActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setResult: <T>(result: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

export function useConverter<T = any>(initialResult: T | null = null): [UseConverterState<T>, UseConverterActions] {
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

  const actions: UseConverterActions = {
    setLoading,
    setError,
    setResult,
    clearError,
    reset
  };

  return [state, actions];
}