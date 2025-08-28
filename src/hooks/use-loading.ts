import { useCallback, useState } from 'react'

interface UseLoadingOptions {
  initialState?: boolean
}

interface UseLoadingReturn {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  toggleLoading: () => void
  withLoading: <T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>
}

export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const { initialState = false } = options
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])
  const toggleLoading = useCallback(() => setIsLoading(prev => !prev), [])

  const withLoading = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R> => {
        startLoading()
        try {
          const result = await fn(...args)
          return result
        } finally {
          stopLoading()
        }
      }
    },
    [startLoading, stopLoading]
  )

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading,
  }
}
