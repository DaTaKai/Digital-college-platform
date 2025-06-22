import { useState, useEffect } from "react";

export function useMobileOptimized() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      setIsTablet(width >= 768 && width < 1024); // lg breakpoint
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const getDialogSize = () => {
    if (isMobile) return "max-w-[95vw] max-h-[95vh]";
    if (isTablet) return "max-w-4xl max-h-[90vh]";
    return "max-w-6xl max-h-[90vh]";
  };

  const getCardCols = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getFormCols = () => {
    if (isMobile) return "grid-cols-1";
    return "grid-cols-2";
  };

  const shouldUseDrawer = isMobile;

  return {
    isMobile,
    isTablet,
    getDialogSize,
    getCardCols,
    getFormCols,
    shouldUseDrawer,
  };
}
