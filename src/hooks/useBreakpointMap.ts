import { useState, useEffect } from "react";
import { IBreakpointsMap } from "../types/breakpoints";

/**
 * Hook to pin point the user's device based on the window size
 * @returns A boolean object defining which device the current window size corresponds to
 */
export default function useBreakpointMap(): IBreakpointsMap {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  return {
    isMobile: width <= 576,
    isTablet: 576 < width && width <= 992,
    isLaptop: 992 < width && width <= 1200,
    isComputer: 1200 < width && width <= 1500,
    isWideScreen: 1500 < width && width <= 1800,
    isUltraWideScreen: 1800 < width
  };
}
