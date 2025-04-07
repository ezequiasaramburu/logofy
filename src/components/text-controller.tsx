import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { Input } from "./ui/input";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";
import { Button } from "./ui/button";

const TextController = () => {
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#fff");
  const [text, setText] = useState("");
  const [positionX, setPositionX] = useState(50); // Default to center (50%)
  const [positionY, setPositionY] = useState(80); // Default to bottom (80%)
  const [hideIcon, setHideIcon] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { setUpdateStorage } = useContext(UpdateStorageContext);
  const [storedValue, setStoredValue] = useLocalStorage<StoredValue>(
    "value",
    {}
  );

  // Initialize values from storage
  useEffect(() => {
    if (isInitialized) return;

    const storageValue = localStorage.getItem("value");
    if (storageValue) {
      const parsedValue = JSON.parse(storageValue);
      setSize(parsedValue.textSize || 20);
      setColor(parsedValue.textColor || "#fff");
      setText(parsedValue.text || "");
      setPositionX(parsedValue.textPositionX || 50);
      setPositionY(parsedValue.textPositionY || 80);
      setHideIcon(parsedValue.hideIcon || false);
    }

    setIsInitialized(true);
  }, [isInitialized]);

  // Update storage when values change
  useEffect(() => {
    if (!isInitialized) return;

    // Get existing storage value
    const existingStorage = localStorage.getItem("value");
    const existingValue = existingStorage ? JSON.parse(existingStorage) : {};

    // Merge with new text properties
    const updatedValue = {
      ...existingValue,
      textSize: size,
      textColor: color,
      text: text,
      textPositionX: positionX,
      textPositionY: positionY,
      hideIcon: hideIcon,
    };

    setUpdateStorage(updatedValue);
    localStorage.setItem("value", JSON.stringify(updatedValue));
  }, [
    size,
    color,
    text,
    positionX,
    positionY,
    hideIcon,
    setUpdateStorage,
    isInitialized,
  ]);

  const toggleIconVisibility = () => {
    setHideIcon(!hideIcon);
  };

  return (
    <div className="w-full border-r p-3 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-2 mt-4">
        <Button
          variant={hideIcon ? "destructive" : "outline"}
          onClick={toggleIconVisibility}
          className="w-full"
        >
          {hideIcon ? "Show Icon" : "Remove Icon"}
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm">Text</p>

        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
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
          <p className="text-sm">Horizontal Position</p>
          <p className="text-xs">{positionX}%</p>
        </div>

        <Slider
          defaultValue={[positionX]}
          max={100}
          step={1}
          onValueChange={(e) => setPositionX(e[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Vertical Position</p>
          <p className="text-xs">{positionY}%</p>
        </div>

        <Slider
          defaultValue={[positionY]}
          max={100}
          step={1}
          onValueChange={(e) => setPositionY(e[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Text Color</p>
        </div>
        <div className="">
          <ColorsPicker
            hiddenController
            selectedColor={(color) => setColor(color)}
            hideEyeDrop
            hidePreset
          />
        </div>
      </div>

      <div className="my-8"></div>
    </div>
  );
};

export default TextController;
