import { UpdateStorageContext } from "@/context/update-storage-context";
import html2canvas from "html2canvas";
import { icons } from "lucide-react";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
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
            color={iconBorderColor || "#000"}
            size={iconSize || 20}
            strokeWidth={iconBorderWidth || 2}
            style={{
              transform: `rotate(${iconRotate || 0}deg)`,
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

      // Add text if it exists
      if (text) {
        const textElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textElement.setAttribute("x", "50%");
        textElement.setAttribute("y", "80%");
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("font-size", `${textSize || 20}px`);
        textElement.setAttribute("fill", textColor || "#fff");
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
      downloadPng();
      downloadSvg();
    }
  }, [downloadIcon, downloadPng, downloadSvg]);

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
          color={color}
          size={size}
          strokeWidth={strokeWidth}
          style={{
            transform: `rotate(${rotate}deg)`,
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
                color={storageValue?.iconBorderColor || "#000"}
                name={storageValue?.icon || "Activity"}
                size={storageValue?.iconSize || 20}
                rotate={storageValue?.iconRotate || 0}
                strokeWidth={storageValue?.iconBorderWidth || 2}
                fillColor={storageValue?.iconFillColor || "#000"}
              />
            </div>

            {/* Text Display */}
            {storageValue?.text && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: `${storageValue.textSize || 20}px`,
                  color: storageValue.textColor || "#fff",
                  textAlign: "center",
                  width: "100%",
                  zIndex: 10,
                }}
              >
                {storageValue.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
