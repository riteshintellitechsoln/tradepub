import { useEffect, useState } from "react";

// Generic debounce hook — used by search inputs (Module 11) and admin filters
// (Module 16) to avoid firing a request on every keystroke.
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
