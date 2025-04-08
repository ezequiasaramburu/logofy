import { useEffect, useState, useRef } from "react";
import { icons } from "lucide-react";
import { StoredValue, STORAGE_CHANGE_EVENT } from "@/hooks/useLocalStorage";
import { downloadPng, downloadSvg, downloadIco } from "@/utils/download";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_ROUNDED,
  DEFAULT_ICON_SIZE_DESKTOP,
  DEFAULT_ICON_SIZE_MOBILE,
  DEFAULT_ICON_ROTATE,
  DEFAULT_ICON_BORDER_WIDTH,
  DEFAULT_ICON_BORDER_COLOR,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON,
  DEFAULT_TEXT_SIZE_DESKTOP,
  DEFAULT_TEXT_SIZE_MOBILE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT,
  DEFAULT_TEXT_POSITION_X,
  DEFAULT_TEXT_POSITION_Y,
  DEFAULT_HIDE_ICON,
  DEFAULT_BACKGROUND_PADDING,
  DEFAULT_ICON_POSITION_X,
  DEFAULT_ICON_POSITION_Y,
} from "@/constants/defaults";

interface PreviewProps {
  downloadIcon?: {
    format: "svg" | "png" | "ico";
    timestamp: number;
  };
}

const Preview: React.FC<PreviewProps> = ({ downloadIcon }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [storageValue, setStorageValue] = useState<StoredValue | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const lastDownloadTimestamp = useRef<number>(0);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const value = localStorage.getItem("value");
      setStorageValue(value ? JSON.parse(value) : null);
    };

    handleStorageChange();
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    return () =>
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
  }, []);

  // Only trigger download when explicitly requested via dropdown
  useEffect(() => {
    if (
      downloadIcon &&
      downloadIcon.timestamp > lastDownloadTimestamp.current
    ) {
      lastDownloadTimestamp.current = downloadIcon.timestamp;

      switch (downloadIcon.format) {
        case "png":
          downloadPng();
          break;
        case "svg":
          downloadSvg();
          break;
        case "ico":
          downloadIco();
          break;
      }
    }
  }, [downloadIcon]);

  const handleClick = () => {
    setShowTooltip(!showTooltip);
  };

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
          size={
            size ||
            (isMobile ? DEFAULT_ICON_SIZE_MOBILE : DEFAULT_ICON_SIZE_DESKTOP)
          }
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
      <div className="relative group w-full md:w-auto">
        <div
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-s px-2 py-2 rounded ${
            showTooltip ? "opacity-100" : "opacity-0"
          } md:group-hover:opacity-100 transition-opacity duration-300 z-10`}
        >
          Downloadable zone
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
        </div>
        <div
          className="w-full aspect-square md:w-[600px] md:h-[600px] border-2 border-dashed border-gray-400 relative transition-all duration-300 hover:border-gray-600 hover:shadow-md md:group-hover:opacity-80 cursor-pointer"
          style={{
            padding:
              storageValue?.bgPadding !== undefined
                ? storageValue.bgPadding
                : DEFAULT_BACKGROUND_PADDING,
            maxWidth: "100%",
          }}
          onClick={handleClick}
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
                  : `${
                      isMobile
                        ? DEFAULT_ICON_SIZE_MOBILE
                        : DEFAULT_ICON_SIZE_DESKTOP
                    }px`,
                height: storageValue?.iconSize
                  ? `${storageValue.iconSize}px`
                  : `${
                      isMobile
                        ? DEFAULT_ICON_SIZE_MOBILE
                        : DEFAULT_ICON_SIZE_DESKTOP
                    }px`,
                position: "absolute",
                bottom: `${
                  100 - (storageValue?.iconPositionY || DEFAULT_ICON_POSITION_Y)
                }%`,
                left: `${
                  storageValue?.iconPositionX || DEFAULT_ICON_POSITION_X
                }%`,
                transform: "translate(-50%, 50%)",
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
                size={
                  storageValue?.iconSize ||
                  (isMobile
                    ? DEFAULT_ICON_SIZE_MOBILE
                    : DEFAULT_ICON_SIZE_DESKTOP)
                }
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
                  fontSize: `${
                    storageValue.textSize || isMobile
                      ? DEFAULT_TEXT_SIZE_MOBILE
                      : DEFAULT_TEXT_SIZE_DESKTOP
                  }px`,
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
