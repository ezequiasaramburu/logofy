import html2canvas from "html2canvas";
import { icons } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { StoredValue, STORAGE_CHANGE_EVENT } from "@/hooks/useLocalStorage";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_ROUNDED,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_ROTATE,
  DEFAULT_ICON_BORDER_WIDTH,
  DEFAULT_ICON_BORDER_COLOR,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON,
  DEFAULT_TEXT_SIZE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT,
  DEFAULT_TEXT_POSITION_X,
  DEFAULT_TEXT_POSITION_Y,
  DEFAULT_HIDE_ICON,
  DEFAULT_BACKGROUND_PADDING,
} from "@/constants/defaults";

interface PreviewProps {
  downloadIcon?: {
    format: "svg" | "png" | "ico";
    timestamp: number;
  };
}

const Preview: React.FC<PreviewProps> = ({ downloadIcon }) => {
  const [storageValue, setStorageValue] = useState<StoredValue | null>(null);

  useEffect(() => {
    const handleStorageChange = (event: CustomEvent<StoredValue>) => {
      setStorageValue(event.detail);
    };

    // Initial load
    const storageData = localStorage.getItem("value")
      ? JSON.parse(localStorage.getItem("value")!)
      : null;
    setStorageValue(storageData);

    // Listen for storage changes
    window.addEventListener(
      STORAGE_CHANGE_EVENT,
      handleStorageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        STORAGE_CHANGE_EVENT,
        handleStorageChange as EventListener
      );
  }, []);

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

  const downloadIco = useCallback(() => {
    const downloadlogodiv = document.getElementById("downloadlogodiv");

    if (!downloadlogodiv) {
      console.error("Downloadable div not found.");
      return;
    }

    html2canvas(downloadlogodiv, {
      backgroundColor: null,
    }).then((canvas) => {
      // Convert to ICO format (16x16, 32x32, 48x48)
      const sizes = [16, 32, 48];
      const icoCanvas = document.createElement("canvas");
      const icoContext = icoCanvas.getContext("2d");

      if (!icoContext) {
        console.error("Failed to get canvas context");
        return;
      }

      // Create ICO file
      const icoBlob = new Blob([], { type: "image/x-icon" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(icoBlob);
      downloadLink.download = "icon.ico";
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    });
  }, []);

  const createSvgElementFromDiv = useCallback(
    (div: HTMLElement) => {
      if (!storageValue) return null;

      const {
        bgColor,
        bgRounded,
        iconBorderColor,
        iconFillColor,
        icon,
        iconSize,
        iconRotate,
        iconBorderWidth,
        text,
        textSize,
        textColor,
        textPositionX,
        textPositionY,
        hideIcon,
      } = storageValue;

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
        <div>
          <LucidIcon
            color={iconBorderColor || DEFAULT_ICON_BORDER_COLOR}
            size={iconSize || DEFAULT_ICON_SIZE}
            strokeWidth={iconBorderWidth || DEFAULT_ICON_BORDER_WIDTH}
            style={{
              transform: `rotate(${iconRotate || DEFAULT_ICON_ROTATE}deg)`,
            }}
          />
        </div>
      );

      const iconSvgString = ReactDOMServer.renderToStaticMarkup(iconElement);
      const iconSvgElement = new DOMParser().parseFromString(
        iconSvgString,
        "image/svg+xml"
      ).documentElement;

      // Apply fill color to paths if needed
      if (iconFillColor) {
        // Check if the fill color has opacity
        const hasOpacity =
          iconFillColor.includes("rgba") && iconFillColor.includes("0)");

        const paths = iconSvgElement.querySelectorAll("path");
        paths.forEach((path) => {
          if (hasOpacity) {
            // If opacity is 0, remove the fill attribute
            path.removeAttribute("fill");
          } else {
            // Set fill color
            path.setAttribute("fill", iconFillColor);
          }
        });
      }

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
      backgroundRect.setAttribute(
        "rx",
        (bgRounded !== undefined ? bgRounded : 0).toString()
      ); // For rounded corners
      backgroundRect.setAttribute(
        "ry",
        (bgRounded !== undefined ? bgRounded : 0).toString()
      );

      svgWrapper.appendChild(backgroundRect);

      // Only add the icon if it's not hidden
      if (hideIcon !== undefined ? !hideIcon : !DEFAULT_HIDE_ICON) {
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
      }

      // Add text if it exists
      if (text) {
        const textElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textElement.setAttribute(
          "x",
          `${textPositionX || DEFAULT_TEXT_POSITION_X}%`
        );
        textElement.setAttribute(
          "y",
          `${textPositionY || DEFAULT_TEXT_POSITION_Y}%`
        );
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("dominant-baseline", "middle");
        textElement.setAttribute(
          "font-size",
          `${textSize || DEFAULT_TEXT_SIZE}px`
        );
        textElement.setAttribute("fill", textColor || DEFAULT_TEXT_COLOR);
        textElement.textContent = text;
        svgWrapper.appendChild(textElement);
      }

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
      switch (downloadIcon.format) {
        case "svg":
          downloadSvg();
          break;
        case "png":
          downloadPng();
          break;
        case "ico":
          downloadIco();
          break;
      }
    }
  }, [downloadIcon, downloadSvg, downloadPng, downloadIco]);

  const Icon = ({
    name,
    color,
    size,
    rotate,
    strokeWidth,
    fillColor,
  }: {
    name: string;
    color: string;
    size: number;
    rotate: number;
    strokeWidth: number;
    fillColor?: string;
  }) => {
    const LucidIcon = icons[name as keyof typeof icons];
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (iconRef.current && fillColor) {
        // Check if the fill color has opacity
        const hasOpacity =
          fillColor.includes("rgba") && fillColor.includes("0)");

        // Find all path elements in the icon
        const paths = iconRef.current.querySelectorAll("path");
        paths.forEach((path) => {
          if (hasOpacity) {
            // If opacity is 0, remove the fill attribute
            path.removeAttribute("fill");
          } else {
            // Set fill color
            path.setAttribute("fill", fillColor);
          }
        });
      }
    }, [fillColor]);

    if (!LucidIcon) {
      console.error(`Icon "${name}" not found.`);
      return null;
    }

    return (
      <div ref={iconRef}>
        <LucidIcon
          color={color || DEFAULT_ICON_BORDER_COLOR}
          size={size || DEFAULT_ICON_SIZE}
          strokeWidth={strokeWidth || DEFAULT_ICON_BORDER_WIDTH}
          style={{
            transform: `rotate(${rotate || DEFAULT_ICON_ROTATE}deg)`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <div className="relative group">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-s px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          Downloadable zone
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
        </div>
        <div
          className="w-[600px] h-[600px] border-2 border-dashed border-gray-400 relative transition-all duration-300 hover:border-gray-600 hover:shadow-md group-hover:opacity-80"
          style={{
            padding:
              storageValue?.bgPadding !== undefined
                ? storageValue.bgPadding
                : DEFAULT_BACKGROUND_PADDING,
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            id="downloadlogodiv"
            style={{
              background: storageValue?.bgColor || DEFAULT_BACKGROUND_COLOR,
              borderRadius:
                storageValue?.bgRounded !== undefined
                  ? storageValue.bgRounded
                  : DEFAULT_BACKGROUND_ROUNDED,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: storageValue?.iconSize
                  ? `${storageValue.iconSize}px`
                  : `${DEFAULT_ICON_SIZE}px`,
                height: storageValue?.iconSize
                  ? `${storageValue.iconSize}px`
                  : `${DEFAULT_ICON_SIZE}px`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display:
                  storageValue?.hideIcon !== undefined
                    ? storageValue.hideIcon
                      ? "none"
                      : "block"
                    : DEFAULT_HIDE_ICON
                    ? "none"
                    : "block",
              }}
            >
              <Icon
                color={
                  storageValue?.iconBorderColor || DEFAULT_ICON_BORDER_COLOR
                }
                name={storageValue?.icon || DEFAULT_ICON}
                size={storageValue?.iconSize || DEFAULT_ICON_SIZE}
                rotate={storageValue?.iconRotate || DEFAULT_ICON_ROTATE}
                strokeWidth={
                  storageValue?.iconBorderWidth || DEFAULT_ICON_BORDER_WIDTH
                }
                fillColor={
                  storageValue?.iconFillColor || DEFAULT_ICON_FILL_COLOR
                }
              />
            </div>

            {/* Text Display */}
            {storageValue?.text && (
              <div
                style={{
                  position: "absolute",
                  bottom: `${
                    100 -
                    (storageValue.textPositionY || DEFAULT_TEXT_POSITION_Y)
                  }%`,
                  left: `${
                    storageValue.textPositionX || DEFAULT_TEXT_POSITION_X
                  }%`,
                  transform: "translate(-50%, 50%)",
                  fontSize: `${storageValue.textSize || DEFAULT_TEXT_SIZE}px`,
                  color: storageValue.textColor || DEFAULT_TEXT_COLOR,
                  textAlign: "center",
                  width: "100%",
                  zIndex: 10,
                }}
              >
                {storageValue.text || DEFAULT_TEXT}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
