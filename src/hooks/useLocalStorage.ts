import { useState } from "react";

export interface StoredValue {
  iconSize?: number;
  iconRotate?: number;
  iconBorderWidth?: number;
  iconBorderColor?: string;
  iconFillColor?: string;
  icon?: string;
  iconPositionX?: number;
  iconPositionY?: number;
  bgRounded?: number;
  bgPadding?: number;
  bgColor?: string;
  text?: string;
  textSize?: number;
  textColor?: string;
  textPositionX?: number;
  textPositionY?: number;
  hideIcon?: boolean;
}

// Custom event name for storage changes
export const STORAGE_CHANGE_EVENT = "localStorageChange";

export function useLocalStorage<T extends StoredValue>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: valueToStore }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
} 