import html2canvas from "html2canvas";
import { toPng, toSvg } from 'html-to-image';

// Helper function to get the downloadable zone element
const getDownloadableZone = () => {
  const downloadlogodiv = document.getElementById("downloadlogodiv");
  if (!downloadlogodiv) {
    console.error("Downloadable div not found.");
    return null;
  }
  return downloadlogodiv;
};

const saveToFile = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

// Simple flag to prevent multiple downloads
let isDownloading = false;

// Download PNG
export const downloadPng = () => {
  // If already downloading, ignore this call
  if (isDownloading) {
    console.log("Download already in progress, ignoring duplicate call");
    return;
  }

  // Set downloading flag
  isDownloading = true;

  const downloadableZone = getDownloadableZone();
  if (!downloadableZone) {
    isDownloading = false;
    return;
  }

  // Create a temporary container for the clone
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  document.body.appendChild(tempContainer);

  // Clone the element
  const clone = downloadableZone.cloneNode(true) as HTMLElement;
  
  // Ensure the clone has the correct dimensions
  clone.style.width = '600px';
  clone.style.height = '600px';
  
  // Add the clone to the temporary container
  tempContainer.appendChild(clone);

  // Apply JetBrains Mono font family to all text elements
  const textElements = clone.querySelectorAll('div[style*="position: absolute"][style*="bottom"]');
  textElements.forEach(textElement => {
    // Apply the JetBrains Mono font family directly
    (textElement as HTMLElement).style.fontFamily = "'JetBrains Mono', monospace";
  });

  // Wait for fonts to load
  document.fonts.ready.then(() => {
    // Use html-to-image to capture the clone
    toPng(clone, {
      backgroundColor: undefined,
      width: 600,
      height: 600,
      style: {
        width: '600px',
        height: '600px',
      },
      filter: (node) => {
        // Include all elements
        return true;
      },
      fontEmbedCSS: '',
      pixelRatio: 2,
      quality: 1.0,
      skipAutoScale: true,
      cacheBust: true,
      includeQueryParams: true,
    })
      .then((dataUrl) => {
        saveToFile(dataUrl, "icon.png");
        // Clean up
        document.body.removeChild(tempContainer);
        // Reset downloading flag
        isDownloading = false;
      })
      .catch((error) => {
        console.error("Error generating PNG:", error);
        // Clean up even if there's an error
        document.body.removeChild(tempContainer);
        // Reset downloading flag
        isDownloading = false;
      });
  });
};

// Download SVG
export const downloadSvg = () => {
  // If already downloading, ignore this call
  if (isDownloading) {
    console.log("Download already in progress, ignoring duplicate call");
    return;
  }

  // Set downloading flag
  isDownloading = true;

  const downloadableZone = getDownloadableZone();
  if (!downloadableZone) {
    isDownloading = false;
    return;
  }

  // Create a temporary container for the clone
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  document.body.appendChild(tempContainer);

  // Clone the element
  const clone = downloadableZone.cloneNode(true) as HTMLElement;
  
  // Ensure the clone has the correct dimensions
  clone.style.width = '600px';
  clone.style.height = '600px';
  
  // Add the clone to the temporary container
  tempContainer.appendChild(clone);

  // Apply JetBrains Mono font family to all text elements
  const textElements = clone.querySelectorAll('div[style*="position: absolute"][style*="bottom"]');
  textElements.forEach(textElement => {
    // Apply the JetBrains Mono font family directly
    (textElement as HTMLElement).style.fontFamily = "'JetBrains Mono', monospace";
  });

  // Wait for fonts to load
  document.fonts.ready.then(() => {
    // Use html-to-image to capture the clone as SVG
    toSvg(clone, {
      backgroundColor: undefined,
      width: 600,
      height: 600,
      style: {
        width: '600px',
        height: '600px',
      },
      filter: (node) => {
        // Include all elements
        return true;
      },
      fontEmbedCSS: '',
      pixelRatio: 2,
      quality: 1.0,
      skipAutoScale: true,
      cacheBust: true,
      includeQueryParams: true,
    })
      .then((dataUrl) => {
        saveToFile(dataUrl, "icon.svg");
        // Clean up
        document.body.removeChild(tempContainer);
        // Reset downloading flag
        isDownloading = false;
      })
      .catch((error) => {
        console.error("Error generating SVG:", error);
        // Clean up even if there's an error
        document.body.removeChild(tempContainer);
        // Reset downloading flag
        isDownloading = false;
      });
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
    saveToFile(pngimage, "icon.ico");
  });
}; 