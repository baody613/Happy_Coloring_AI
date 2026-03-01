import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatch when using persisted stores (localStorage)
 * Returns true only after component mounts on client side
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
