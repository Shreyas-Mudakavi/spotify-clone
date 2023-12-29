import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
  const [deBouncedValue, setDeBouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeBouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return deBouncedValue;
}

export default useDebounce;
