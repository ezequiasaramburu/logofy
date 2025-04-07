import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_ROUNDED,
  DEFAULT_BACKGROUND_PADDING,
} from "@/constants/defaults";

const BackGroundController = () => {
  const [rounded, setRounded] = useState(DEFAULT_BACKGROUND_ROUNDED);
  const [padding, setPadding] = useState(DEFAULT_BACKGROUND_PADDING);
  const [color, setColor] = useState(DEFAULT_BACKGROUND_COLOR);
  const [isInitialized, setIsInitialized] = useState(false);

  const { setUpdateStorage } = useContext(UpdateStorageContext);
  const [storedValue, setStoredValue] = useLocalStorage<StoredValue>("value", {
    bgRounded: DEFAULT_BACKGROUND_ROUNDED,
    bgPadding: DEFAULT_BACKGROUND_PADDING,
    bgColor: DEFAULT_BACKGROUND_COLOR,
  });

  // Initialize values from storage
  useEffect(() => {
    if (isInitialized) return;

    const { bgRounded, bgPadding, bgColor } = storedValue;

    // Check if values exist in storage (including 0)
    if (bgRounded !== undefined) setRounded(bgRounded);
    if (bgPadding !== undefined) setPadding(bgPadding);
    if (bgColor !== undefined) setColor(bgColor);

    setIsInitialized(true);
  }, [storedValue, isInitialized]);

  // Update storage when values change
  useEffect(() => {
    if (!isInitialized) return;

    // Get the current storage value to ensure we preserve all properties
    const currentStorage = localStorage.getItem("value");
    const currentValue = currentStorage ? JSON.parse(currentStorage) : {};

    const updatedValue: StoredValue = {
      ...currentValue,
      bgRounded: rounded,
      bgPadding: padding,
      bgColor: color,
    };

    setUpdateStorage(updatedValue);
    setStoredValue(updatedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounded, padding, color, setUpdateStorage, isInitialized]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-8 overflow-auto h-screen ">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Rounded</p>
          <p className="text-xs">{rounded} px</p>
        </div>

        <Slider
          value={[rounded]}
          max={300}
          min={0}
          step={1}
          onValueChange={(e) => setRounded(e[0])}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Padding</p>
          <p className="text-xs">{padding} px</p>
        </div>

        <Slider
          value={[padding]}
          max={100}
          min={0}
          step={1}
          onValueChange={(e) => setPadding(e[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Background Color</p>
        </div>
        <div className="">
          <ColorsPicker
            selectedColor={(color) => setColor(color)}
            initialColor={color}
            hidePreset
          />
        </div>
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default BackGroundController;
