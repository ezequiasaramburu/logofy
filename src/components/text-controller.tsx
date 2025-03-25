import { Slider } from "./ui/slider";
import ColorsPicker from "./color-picker";
import { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { Input } from "./ui/input";

const TextController = () => {
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#fff");
  const [text, setText] = useState("");
  const { setUpdateStorage } = useContext(UpdateStorageContext);

  // Load initial values from localStorage on client side
  useEffect(() => {
    const storageValue = localStorage.getItem("value");
    if (storageValue) {
      const parsedValue = JSON.parse(storageValue);
      setSize(parsedValue.textSize || 20);
      setColor(parsedValue.textColor || "#fff");
      setText(parsedValue.text || "");
    }
  }, []);

  useEffect(() => {
    const updatedValue = {
      textSize: size,
      textColor: color,
      text: text,
    };

    setUpdateStorage(updatedValue);
    localStorage.setItem("value", JSON.stringify(updatedValue));
  }, [size, color, text, setUpdateStorage]);

  return (
    <div className="w-full border-r p-3 flex flex-col gap-8 overflow-auto h-screen">
      <div className="">
        <p className="text-sm my-1">Text</p>
        <div className="font-semibold">{text ? text : "your text preview"}</div>
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
