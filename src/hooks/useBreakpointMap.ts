import { useState, useEffect } from "react";

interface IBreakpointMap {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isComputer: boolean;
}

/**
 * Hook to pin point the user's device based on the window size
 * @returns A boolean object defining which device the current window size corresponds to
 */
export default function useBreakpointMap(): IBreakpointMap {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return {
    isMobile: width <= 576,
    isTablet: 576 < width && width <= 992,
    isLaptop: 992 < width && width <= 1200,
    isComputer: 1200 < width
  };
}
