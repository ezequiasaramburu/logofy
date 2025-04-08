import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useEffect, useState } from "react";
import AllIcons from "./all-icons";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";
import {
  DEFAULT_ICON_SIZE_DESKTOP,
  DEFAULT_ICON_SIZE_MOBILE,
  DEFAULT_ICON_ROTATE,
  DEFAULT_ICON_BORDER_WIDTH,
  DEFAULT_ICON_BORDER_COLOR,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON,
  DEFAULT_ICON_POSITION_X,
  DEFAULT_ICON_POSITION_Y,
} from "@/constants/defaults";

const IconController = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [size, setSize] = useState(DEFAULT_ICON_SIZE_DESKTOP);
  const [rotate, setRotate] = useState(DEFAULT_ICON_ROTATE);
  const [borderWidth, setBorderWidth] = useState(DEFAULT_ICON_BORDER_WIDTH);
  const [borderColor, setBorderColor] = useState(DEFAULT_ICON_BORDER_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULT_ICON_FILL_COLOR);
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [positionX, setPositionX] = useState(DEFAULT_ICON_POSITION_X);
  const [positionY, setPositionY] = useState(DEFAULT_ICON_POSITION_Y);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSize(
        window.innerWidth < 768
          ? DEFAULT_ICON_SIZE_MOBILE
          : DEFAULT_ICON_SIZE_DESKTOP
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [storedValue, setStoredValue] = useLocalStorage<StoredValue>("value", {
    iconSize: isMobile ? DEFAULT_ICON_SIZE_MOBILE : DEFAULT_ICON_SIZE_DESKTOP,
    iconRotate: DEFAULT_ICON_ROTATE,
    iconBorderWidth: DEFAULT_ICON_BORDER_WIDTH,
    iconBorderColor: DEFAULT_ICON_BORDER_COLOR,
    iconFillColor: DEFAULT_ICON_FILL_COLOR,
    icon: DEFAULT_ICON,
    iconPositionX: DEFAULT_ICON_POSITION_X,
    iconPositionY: DEFAULT_ICON_POSITION_Y,
  });

  useEffect(() => {
    if (isInitialized) return;

    const {
      iconSize,
      iconRotate,
      iconBorderWidth,
      iconBorderColor,
      iconFillColor,
      icon: storedIcon,
      iconPositionX,
      iconPositionY,
    } = storedValue;

    if (iconSize) setSize(iconSize);
    if (iconRotate) setRotate(iconRotate);
    if (iconBorderWidth) setBorderWidth(iconBorderWidth);
    if (iconBorderColor) setBorderColor(iconBorderColor);
    if (iconFillColor) setFillColor(iconFillColor);
    if (storedIcon) setIcon(storedIcon);
    if (iconPositionX !== undefined) setPositionX(iconPositionX);
    if (iconPositionY !== undefined) setPositionY(iconPositionY);

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
      iconSize: size,
      iconRotate: rotate,
      iconBorderWidth: borderWidth,
      iconBorderColor: borderColor,
      iconFillColor: fillColor,
      icon: icon,
      iconPositionX: positionX,
      iconPositionY: positionY,
    };

    setStoredValue(updatedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    size,
    rotate,
    borderColor,
    fillColor,
    borderWidth,
    icon,
    positionX,
    positionY,
    isInitialized,
  ]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-4 h-full overflow-y-auto">
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
          value={[size]}
          max={600}
          min={100}
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
          value={[rotate]}
          max={180}
          min={-180}
          step={1}
          onValueChange={(e) => setRotate(e[0])}
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
          <p className="text-sm">Border width</p>
          <p className="text-xs">{borderWidth.toFixed(1)} px</p>
        </div>

        <Slider
          value={[borderWidth]}
          max={4}
          min={1}
          step={0.1}
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
            initialColor={borderColor}
          />
        </div>
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
            initialColor={fillColor}
          />
        </div>
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default IconController;
