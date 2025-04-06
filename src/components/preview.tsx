import { UpdateStorageContext } from "@/context/update-storage-context";
import html2canvas from "html2canvas";
import { icons } from "lucide-react";
import { useContext, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { StoredValue } from "@/hooks/useLocalStorage";

interface PreviewProps {
  downloadIcon?: any;
}

const Preview: React.FC<PreviewProps> = ({ downloadIcon }) => {
  const [storageValue, setStorageValue] = useState<StoredValue | null>(null);

  const { updateStorage } = useContext(UpdateStorageContext);

  useEffect(() => {
    const storageDate = localStorage.getItem("value")
      ? JSON.parse(localStorage.getItem("value")!)
      : null;
    setStorageValue(storageDate);
  }, [updateStorage]);

  const downloadPng = useCallback(() => {
    const downloadlogodiv = document.getElementById("downloadlogodiv");

    if (!downloadlogodiv) {
      console.error("Downloadable div not found.");
      return;
    }

    html2canvas(downloadlogodiv, {
      backgroundColor: null,
    }).then((canvas) => {
      const pngimage = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngimage;
      downloadLink.download = "icon.png";
      downloadLink.click();
    });
  }, []);

  const createSvgElementFromDiv = useCallback(
    (div: HTMLElement) => {
      if (!storageValue) return null;

      const { bgColor, bgRounded, iconFillColor, icon, iconSize, iconRotate } =
        storageValue;

      if (!icon) {
        console.error("Icon name is undefined");
        return null;
      }

      const LucidIcon = icons[icon as keyof typeof icons];

      if (!LucidIcon) {
        console.error(`Icon "${icon}" not found.`);
        return null;
      }

      const iconElement = (
        <LucidIcon
          color={iconFillColor || "#000"}
          size={iconSize || 20}
          style={{ transform: `rotate(${iconRotate || 0}deg)` }}
        />
      );

      const iconSvgString = ReactDOMServer.renderToStaticMarkup(iconElement);
      const iconSvgElement = new DOMParser().parseFromString(
        iconSvgString,
        "image/svg+xml"
      ).documentElement;

      const divRect = div.getBoundingClientRect();
      const width = divRect.width;
      const height = divRect.height;

      const svgWrapper = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgWrapper.setAttribute("width", width.toString());
      svgWrapper.setAttribute("height", height.toString());
      svgWrapper.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      // Apply background styles
      const backgroundRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      backgroundRect.setAttribute("width", "100%");
      backgroundRect.setAttribute("height", "100%");
      backgroundRect.setAttribute("fill", bgColor || "#000");
      backgroundRect.setAttribute("rx", (bgRounded || 0).toString()); // For rounded corners
      backgroundRect.setAttribute("ry", (bgRounded || 0).toString());

      svgWrapper.appendChild(backgroundRect);

      // Center the icon within the SVG
      const iconGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      const innerSvg = new DOMParser().parseFromString(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
         ${iconSvgElement.outerHTML}
       </svg>`,
        "image/svg+xml"
      ).documentElement;

      iconGroup.appendChild(innerSvg);
      svgWrapper.appendChild(iconGroup);

      return svgWrapper;
    },
    [storageValue]
  );

  const downloadSvg = useCallback(() => {
    const downloadlogodiv = document.getElementById("downloadlogodiv");

    if (!downloadlogodiv) {
      console.error("Downloadable div not found.");
      return;
    }

    const svgElement = createSvgElementFromDiv(downloadlogodiv);

    if (!svgElement) {
      console.error("Failed to create SVG element.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], {
      type: "image/svg+xml",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "icon.svg";
    downloadLink.click();
    URL.revokeObjectURL(svgUrl);
  }, [createSvgElementFromDiv]);

  useEffect(() => {
    if (downloadIcon) {
      downloadPng();
      downloadSvg();
    }
  }, [downloadIcon, downloadPng, downloadSvg]);

  const Icon = ({
    name,
    color,
    size,
    rotate,
  }: {
    name: string;
    color: string;
    size: number;
    rotate: number;
  }) => {
    const LucidIcon = icons[name as keyof typeof icons];

    if (!LucidIcon) {
      console.error(`Icon "${name}" not found.`);
      return null; // or provide a default icon
    }

    return (
      <LucidIcon
        color={color}
        size={size}
        style={{ transform: `rotate(${rotate}deg)` }}
      />
    );
  };

  return (
    <div className="w-full p-3 h-screen flex justify-center items-center">
      <div
        className="w-[500px] h-[500px] bg-slate-100 border-dashed border"
        style={{
          padding: storageValue?.bgPadding,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          id="downloadlogodiv"
          style={{
            background: storageValue?.bgColor || "#000",
            borderRadius: storageValue?.bgRounded,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: storageValue?.iconSize
                ? `${storageValue.iconSize}px`
                : "20px",
              height: storageValue?.iconSize
                ? `${storageValue.iconSize}px`
                : "20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon
              color={storageValue?.iconFillColor || "#000"}
              name={storageValue?.icon || "Activity"}
              size={storageValue?.iconSize || 20}
              rotate={storageValue?.iconRotate || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
