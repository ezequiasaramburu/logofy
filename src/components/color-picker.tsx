import { useState, useEffect } from "react";
import ColorPicker from "react-best-gradient-color-picker";

interface ColorsPickerProps {
  hiddenController?: boolean;
  selectedColor: (e: string) => void;
  hideEyeDrop?: boolean;
  hidePreset?: boolean;
  initialColor?: string;
  hideGradientControls?: boolean;
  hideGradientStop?: boolean;
}

const ColorsPicker: React.FC<ColorsPickerProps> = ({
  hiddenController = false,
  selectedColor,
  hideEyeDrop = false,
  hidePreset = false,
  initialColor,
  hideGradientControls = false,
  hideGradientStop = true,
}) => {
  const [color, setColor] = useState(initialColor);

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
      hideGradientControls={hideGradientControls}
      hideGradientStop={hideGradientStop}
    />
  );
};

export default ColorsPicker;
