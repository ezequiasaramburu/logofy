import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import AllIcons from "./all-icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const IconController = () => {
  const [size, setSize] = useState(20);
  const [rotate, setRotate] = useState(0);
  const [borderWidth, setBorderWidth] = useState(2.5);
  const [borderColor, setBorderColor] = useState("#fff");
  const [fillColor, setFillColor] = useState("#fff");
  const [fillOpacity, setFillOpacity] = useState(0);
  const [icon, setIcon] = useState("Activity");
  const [isInitialized, setIsInitialized] = useState(false);

  const { setUpdateStorage } = useContext(UpdateStorageContext);
  const [storedValue, setStoredValue] = useLocalStorage("value", {});

  // Initialize values from storage
  useEffect(() => {
    if (isInitialized || !storedValue || Object.keys(storedValue).length === 0)
      return;

    setSize(storedValue.iconSize || 20);
    setRotate(storedValue.iconRotate || 0);
    setBorderWidth(storedValue.iconBorderWidth || 2.5);
    setBorderColor(storedValue.iconBorderColor || "#fff");
    setFillColor(storedValue.iconFillColor || "#fff");
    setFillOpacity(storedValue.iconFillOpacity || 0);
    setIcon(storedValue.icon || "Activity");
    setIsInitialized(true);
  }, [storedValue, isInitialized]);

  // Update storage when values change
  useEffect(() => {
    if (!isInitialized) return;

    const updatedValue = {
      ...storedValue,
      iconSize: size,
      iconBorderWidth: borderWidth,
      iconRotate: rotate,
      iconBorderColor: borderColor,
      iconFillColor: fillColor,
      iconFillOpacity: fillOpacity,
      icon: icon,
    };

    setUpdateStorage(updatedValue);
    setStoredValue(updatedValue);
  }, [
    size,
    rotate,
    borderColor,
    fillColor,
    borderWidth,
    icon,
    fillOpacity,
    setUpdateStorage,
    isInitialized,
  ]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-8 overflow-auto h-screen">
      <div className="flex justify-between">
        <p className="text-sm">Icon</p>
        <p className="text-sm">{icon}</p>
      </div>

      <AllIcons selectedIcon={setIcon} />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Size</p>
          <p className="text-xs">{size} px</p>
        </div>

        <Slider
          defaultValue={[size]}
          max={500}
          step={1}
          onValueChange={(e) => setSize(e[0])}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Rotate</p>
          <p className="text-xs">{rotate}°</p>
        </div>

        <Slider
          defaultValue={[rotate]}
          max={360}
          step={1}
          onValueChange={(e) => setRotate(e[0])}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Border width</p>
          <p className="text-xs">{borderWidth} px</p>
        </div>

        <Slider
          defaultValue={[borderWidth]}
          max={10}
          step={1}
          onValueChange={(e) => setBorderWidth(e[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Border Color</p>
        </div>
        <div className="">
          <ColorsPicker
            hiddenController
            selectedColor={(borderColor) => setBorderColor(borderColor)}
            hideEyeDrop
            hidePreset
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Fill opacity</p>
          <p className="text-xs">{fillOpacity} %</p>
        </div>

        <Slider
          defaultValue={[fillOpacity]}
          max={100}
          step={1}
          onValueChange={(e) => setFillOpacity(e[0])}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">Fill Color</p>
        </div>
        <div className="">
          <ColorsPicker
            hiddenController
            selectedColor={(fillColor) => setFillColor(fillColor)}
            hideEyeDrop
            hidePreset
          />
        </div>
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default IconController;
