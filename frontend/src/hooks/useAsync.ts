import { useEffect, useState } from 'react';

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
};

type Stored<T> = { key: string | null; data: T | undefined; error: Error | null };

// Runs `load` whenever `key` changes. Keeps the previous data while the next request runs,
// so the screen doesn't flash empty between pages or search keystrokes.
export function useAsync<T>(key: string, load: () => Promise<T>): AsyncState<T> {
  const [stored, setStored] = useState<Stored<T>>({ key: null, data: undefined, error: null });

  useEffect(() => {
    let cancelled = false; // ignore answers that arrive after the key has changed again

    load()
      .then((data) => {
        if (!cancelled) setStored({ key, data, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setStored((prev) => ({ key, data: prev.data, error }));
      });

    return () => {
      cancelled = true;
    };
    // `load` is a new function on every render; `key` alone decides when to reload.
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data: stored.data,
    loading: stored.key !== key,
    error: stored.key === key ? stored.error : null,
  };
}