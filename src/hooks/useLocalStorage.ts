import CM, { ColorMaster } from "colormaster";
import { useCallback, useEffect, useState } from "react";
import { TSetState } from "../types/react";

/**
 * @see https://usehooks-typescript.com/react-hook/use-local-storage
 */
export default function useLocalStorage<T>(key: string, initialValue: T): [T, TSetState<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      // ColorMaster parsing
      if (item && CM(item).isValid()) return CM(item) as unknown as T;
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: TSetState<T> = (value) => {
    if (typeof window == "undefined") {
      console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
    }

    try {
      const newValue =
        value instanceof Function ? value(storedValue) : value instanceof ColorMaster ? value.stringRGB() : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // need to adjust incase new value is a ColorMaster string
      const stateNewValue = (CM(newValue as string).isValid() ? CM(newValue as string) : newValue) as T;
      setStoredValue(stateNewValue);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const handleStorageChange = useCallback(() => setStoredValue(readValue()), [readValue]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [handleStorageChange]);

  return [storedValue, setValue];
}
