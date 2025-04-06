import { useState, useEffect } from "react";
import ColorPicker from "react-best-gradient-color-picker";

interface ColorsPickerProps {
  hiddenController?: boolean;
  selectedColor: (e: string) => void;
  hideEyeDrop?: boolean;
  hidePreset?: boolean;
  initialColor?: string;
}
const ColorsPicker: React.FC<ColorsPickerProps> = ({
  hiddenController = false,
  selectedColor,
  hideEyeDrop = false,
  hidePreset = false,
  initialColor = "rgba(255,255,255,1)",
}) => {
  const [color, setColor] = useState(initialColor);

  // Update the color state when initialColor changes
  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  return (
    <ColorPicker
      value={color}
      onChange={(e) => {
        setColor(e);
        selectedColor(e);
      }}
      hideEyeDrop={hideEyeDrop}
      hidePresets={hidePreset}
      hideControls={hiddenController}
    />
  );
};

export default ColorsPicker;
