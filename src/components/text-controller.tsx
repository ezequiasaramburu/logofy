import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { Input } from "./ui/input";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";
import { Button } from "./ui/button";
import {
  DEFAULT_TEXT_SIZE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT,
  DEFAULT_TEXT_POSITION_X,
  DEFAULT_TEXT_POSITION_Y,
  DEFAULT_HIDE_ICON,
} from "@/constants/defaults";

const TextController = () => {
  const [size, setSize] = useState(DEFAULT_TEXT_SIZE);
  const [color, setColor] = useState(DEFAULT_TEXT_COLOR);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [positionX, setPositionX] = useState(DEFAULT_TEXT_POSITION_X);
  const [positionY, setPositionY] = useState(DEFAULT_TEXT_POSITION_Y);
  const [hideIcon, setHideIcon] = useState(DEFAULT_HIDE_ICON);
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
      setSize(parsedValue.textSize || DEFAULT_TEXT_SIZE);
      setColor(parsedValue.textColor || DEFAULT_TEXT_COLOR);
      setText(parsedValue.text || DEFAULT_TEXT);
      setPositionX(parsedValue.textPositionX || DEFAULT_TEXT_POSITION_X);
      setPositionY(parsedValue.textPositionY || DEFAULT_TEXT_POSITION_Y);
      setHideIcon(parsedValue.hideIcon || DEFAULT_HIDE_ICON);
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
          min={20}
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
