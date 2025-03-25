import { createContext } from "react";

interface StorageValue {
  textSize?: number;
  textColor?: string;
  text?: string;
  [key: string]: any; // for other potential values
}

interface UpdateStorageContextType {
  updateStorage: StorageValue;
  setUpdateStorage: (value: StorageValue) => void;
}

export const UpdateStorageContext = createContext<UpdateStorageContextType>({
  updateStorage: {},
  setUpdateStorage: () => {},
});
