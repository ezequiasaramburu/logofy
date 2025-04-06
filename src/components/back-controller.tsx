import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const BackGroundController = () => {
  const [rounded, setRounded] = useState(0);
  const [padding, setPadding] = useState(0);
  const [color, setColor] = useState("#000");
  const [isInitialized, setIsInitialized] = useState(false);

  const { setUpdateStorage } = useContext(UpdateStorageContext);
  const [storedValue, setStoredValue] = useLocalStorage("value", {});

  // Initialize values from storage
  useEffect(() => {
    if (isInitialized || !storedValue || Object.keys(storedValue).length === 0)
      return;

    setRounded(storedValue.bgRounded || 0);
    setPadding(storedValue.bgPadding || 0);
    setColor(storedValue.bgColor || "#000");
    setIsInitialized(true);
  }, [storedValue, isInitialized]);

  // Update storage when values change
  useEffect(() => {
    if (!isInitialized) return;

    const updatedValue = {
      ...storedValue,
      bgRounded: rounded,
      bgPadding: padding,
      bgColor: color,
    };

    setUpdateStorage(updatedValue);
    setStoredValue(updatedValue);
  }, [rounded, padding, color, setUpdateStorage, isInitialized]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-8 overflow-auto h-screen ">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Rounded</p>
          <p className="text-xs">{rounded} px</p>
        </div>

        <Slider
          defaultValue={[rounded]}
          max={300}
          step={1}
          onValueChange={(e) => setRounded(e[0])}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Padding</p>
          <p className="text-xs">{padding}°</p>
        </div>

        <Slider
          defaultValue={[padding]}
          max={100}
          step={1}
          onValueChange={(e) => setPadding(e[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Background Color</p>
        </div>
        <div className="">
          <ColorsPicker selectedColor={(color) => setColor(color)} />
        </div>
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default BackGroundController;
