import html2canvas from "html2canvas";
import { DEFAULT_ICON_POSITION_X, DEFAULT_ICON_POSITION_Y } from '../constants/defaults';

// Helper function to get the downloadable zone element
const getDownloadableZone = () => {
  const downloadlogodiv = document.getElementById("downloadlogodiv");
  if (!downloadlogodiv) {
    console.error("Downloadable div not found.");
    return null;
  }
  return downloadlogodiv;
};

// Download PNG
export const downloadPng = () => {
  const downloadableZone = getDownloadableZone();
  if (!downloadableZone) return;

  html2canvas(downloadableZone, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
    width: 600,
    height: 600,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById('downloadlogodiv');
      if (clonedElement) {
        clonedElement.style.width = '600px';
        clonedElement.style.height = '600px';
        // Ensure font is loaded
        const textElement = clonedElement.querySelector('div[style*="position: absolute"][style*="bottom"]') as HTMLElement;
        if (textElement) {
          const computedStyle = window.getComputedStyle(textElement);
          textElement.style.fontFamily = computedStyle.fontFamily;
          textElement.style.fontSize = computedStyle.fontSize;
          textElement.style.fontWeight = computedStyle.fontWeight;
          textElement.style.fontStyle = computedStyle.fontStyle;
        }
      }
    }
  }).then((canvas) => {
    const pngimage = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngimage;
    downloadLink.download = "icon.png";
    downloadLink.click();
  });
};

// Download ICO
export const downloadIco = () => {
  const downloadableZone = getDownloadableZone();
  if (!downloadableZone) return;

  html2canvas(downloadableZone, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
    width: 600,
    height: 600,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById('downloadlogodiv');
      if (clonedElement) {
        clonedElement.style.width = '600px';
        clonedElement.style.height = '600px';
        // Ensure font is loaded
        const textElement = clonedElement.querySelector('div[style*="position: absolute"][style*="bottom"]') as HTMLElement;
        if (textElement) {
          const computedStyle = window.getComputedStyle(textElement);
          textElement.style.fontFamily = computedStyle.fontFamily;
          textElement.style.fontSize = computedStyle.fontSize;
          textElement.style.fontWeight = computedStyle.fontWeight;
          textElement.style.fontStyle = computedStyle.fontStyle;
        }
      }
    }
  }).then((canvas) => {
    const pngimage = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngimage;
    downloadLink.download = "icon.ico";
    downloadLink.click();
  });
};

// Download SVG
export const downloadSvg = () => {
  const downloadableZone = getDownloadableZone();
  if (!downloadableZone) return;

  // Get the background color and border radius
  const styles = window.getComputedStyle(downloadableZone);
  const backgroundColor = styles.backgroundColor;
  const borderRadius = styles.borderRadius;

  // Find the icon SVG
  const iconContainer = downloadableZone.querySelector('div[style*="position: absolute"][style*="transform: translate(-50%, -50%)"]');
  const iconSvg = iconContainer?.querySelector('svg');
  
  // Find the text element
  const textElement = downloadableZone.querySelector('div[style*="position: absolute"][style*="bottom"]');
  const textStyles = textElement ? window.getComputedStyle(textElement) : null;

  // Create the SVG document
  const svgDoc = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgDoc.setAttribute("width", "600");
  svgDoc.setAttribute("height", "600");
  svgDoc.setAttribute("viewBox", "0 0 600 600");
  svgDoc.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Add background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", backgroundColor);
  background.setAttribute("rx", borderRadius);
  background.setAttribute("ry", borderRadius);
  svgDoc.appendChild(background);

  // Add icon if it exists
  if (iconSvg) {
    const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    iconGroup.setAttribute("transform", "translate(300, 300)");
    
    // Clone the icon SVG content
    const iconContent = iconSvg.cloneNode(true) as SVGElement;
    
    // Get the icon size and calculate the center position
    const iconSize = parseInt(iconSvg.getAttribute("width") || "24");
    const offset = -iconSize / 2;
    
    // Get icon position from storage
    const storageValue = localStorage.getItem("value")
      ? JSON.parse(localStorage.getItem("value")!)
      : null;
    
    const iconPositionX = storageValue?.iconPositionX || DEFAULT_ICON_POSITION_X;
    const iconPositionY = storageValue?.iconPositionY || DEFAULT_ICON_POSITION_Y;
    
    // Position the icon at the center with offset
    iconContent.setAttribute("transform", `translate(${offset + iconPositionX}, ${offset + iconPositionY})`);
    iconGroup.appendChild(iconContent);
    svgDoc.appendChild(iconGroup);
  }

  // Add text if it exists
  if (textElement && textStyles) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = textElement.textContent || '';
    
    // Get position from style
    const bottom = textStyles.bottom;
    const left = textStyles.left;
    
    // Convert percentage to pixels
    const bottomValue = bottom ? parseFloat(bottom) : 0;
    const leftValue = left ? parseFloat(left) : 50;
    
    // Calculate the y position (SVG y is from top, CSS bottom is from bottom)
    const y = bottom ? 600 - (bottomValue / 100 * 600) : 300;
    
    // Create a group for the text to handle positioning
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    textGroup.setAttribute("transform", `translate(${leftValue * 6}, ${y})`);
    
    // Get the text size from the style or use default
    const fontSize = textStyles.fontSize || "60px";
    
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", fontSize);
    text.setAttribute("fill", textStyles.color);
    text.setAttribute("font-family", textStyles.fontFamily);
    text.setAttribute("font-weight", textStyles.fontWeight);
    text.setAttribute("font-style", textStyles.fontStyle);
    
    textGroup.appendChild(text);
    svgDoc.appendChild(textGroup);
  }

  // Convert to string and download
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgDoc);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "icon.svg";
  downloadLink.click();
  URL.revokeObjectURL(svgUrl);
}; 