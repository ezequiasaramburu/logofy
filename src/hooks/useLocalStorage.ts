import { useState } from 'react';

export interface StoredValue {
  iconSize?: number;
  iconRotate?: number;
  iconBorderWidth?: number;
  iconBorderColor?: string;
  iconFillColor?: string;
  iconFillOpacity?: number;
  icon?: string;
  bgRounded?: number;
  bgPadding?: number;
  bgColor?: string;
}

export function useLocalStorage(key: string, initialValue: StoredValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<StoredValue>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: StoredValue | ((val: StoredValue) => StoredValue)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
} 