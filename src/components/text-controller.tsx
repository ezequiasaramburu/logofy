import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { Input } from "./ui/input";
import { useLocalStorage, StoredValue } from "@/hooks/useLocalStorage";

const TextController = () => {
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#fff");
  const [text, setText] = useState("");
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
    };

    setUpdateStorage(updatedValue);
    localStorage.setItem("value", JSON.stringify(updatedValue));
  }, [size, color, text, setUpdateStorage, isInitialized]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="">
        <p className="text-sm my-1">Text</p>
        <div className="font-semibold">{text ? text : "Your text preview"}</div>
      </div>

      <div className="space-y-2">
        <p className="text-sm">Input Text</p>

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
          <p className="text-sm">Border Color</p>
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
