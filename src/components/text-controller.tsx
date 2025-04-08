import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";
import { Button } from "./ui/button";
import {
  DEFAULT_TEXT_SIZE_DESKTOP,
  DEFAULT_TEXT_SIZE_MOBILE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT,
  DEFAULT_TEXT_POSITION_X,
  DEFAULT_TEXT_POSITION_Y,
  DEFAULT_HIDE_ICON,
} from "@/constants/defaults";

const TextController = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [size, setSize] = useState(DEFAULT_TEXT_SIZE_DESKTOP);
  const [color, setColor] = useState(DEFAULT_TEXT_COLOR);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [positionX, setPositionX] = useState(DEFAULT_TEXT_POSITION_X);
  const [positionY, setPositionY] = useState(DEFAULT_TEXT_POSITION_Y);
  const [hideIcon, setHideIcon] = useState(DEFAULT_HIDE_ICON);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSize(
        window.innerWidth < 768
          ? DEFAULT_TEXT_SIZE_MOBILE
          : DEFAULT_TEXT_SIZE_DESKTOP
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [storedValue, setStoredValue] = useLocalStorage<StoredValue>("value", {
    textSize: isMobile ? DEFAULT_TEXT_SIZE_MOBILE : DEFAULT_TEXT_SIZE_DESKTOP,
    textColor: DEFAULT_TEXT_COLOR,
    text: DEFAULT_TEXT,
    textPositionX: DEFAULT_TEXT_POSITION_X,
    textPositionY: DEFAULT_TEXT_POSITION_Y,
    hideIcon: DEFAULT_HIDE_ICON,
  });

  // Initialize values from storage
  useEffect(() => {
    if (isInitialized) return;

    const {
      textSize,
      textColor,
      text: storedText,
      textPositionX,
      textPositionY,
      hideIcon: storedHideIcon,
    } = storedValue;

    if (textSize) setSize(textSize);
    if (textColor) setColor(textColor);
    if (storedText) setText(storedText);
    if (textPositionX) setPositionX(textPositionX);
    if (textPositionY) setPositionY(textPositionY);
    if (storedHideIcon !== undefined) setHideIcon(storedHideIcon);

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
      textSize: size,
      textColor: color,
      text: text,
      textPositionX: positionX,
      textPositionY: positionY,
      hideIcon: hideIcon,
    };

    setStoredValue(updatedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, color, text, positionX, positionY, hideIcon, isInitialized]);

  const toggleIconVisibility = () => {
    setHideIcon(!hideIcon);
  };

  return (
    <div className="w-full border-r p-3 flex flex-col gap-4 h-full overflow-y-auto">
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
          value={[size]}
          max={isMobile ? 200 : 500}
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
          value={[positionX]}
          max={100}
          min={1}
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
          value={[positionY]}
          max={100}
          min={1}
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
            initialColor={color}
          />
        </div>
      </div>

      <div className="my-8"></div>
    </div>
  );
};

export default TextController;
