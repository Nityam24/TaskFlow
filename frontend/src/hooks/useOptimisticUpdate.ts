import { useCallback, useState } from "react";

interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
}

interface UseOptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown, rollbackData: T) => void;
}

export function useOptimisticUpdate<T>(
  initialData: T,
  options: UseOptimisticUpdateOptions<T> = {}
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
  });

  const updateOptimistically = useCallback(
    async (
      optimisticData: T,
      asyncFn: () => Promise<T>
    ): Promise<T | undefined> => {
      const previousData = state.data;

      setState({ data: optimisticData, isOptimistic: true });

      try {
        const result = await asyncFn();
        setState({ data: result, isOptimistic: false });
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        setState({ data: previousData, isOptimistic: false });
        options.onError?.(error, previousData);
        throw error;
      }
    },
    [state.data, options]
  );

  const setData = useCallback((data: T) => {
    setState({ data, isOptimistic: false });
  }, []);

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    updateOptimistically,
    setData,
  };
}
