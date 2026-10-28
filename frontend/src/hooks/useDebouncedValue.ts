import { useEffect, useState } from 'react';

// Returns `value`, but only after it has stopped changing for `delay` ms.
export function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer); // a new keystroke cancels the previous timer
    }, [value, delay]);

    return debounced;
}