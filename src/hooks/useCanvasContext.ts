import { RefObject, useEffect, useState } from "react";
import useBreakpointMap from "./useBreakpointMap";

type TRefCanvas = RefObject<HTMLCanvasElement>;

function fitCanvasContainer(
  ctx: CanvasRenderingContext2D,
  breakpoints: {
    isMobile: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isComputer: boolean;
    isWideScreen: boolean;
  },
  thickness?: number,
  vertical?: boolean
): CanvasRenderingContext2D {
  // vertical hue & alpha pickers
  if (thickness && vertical) {
    ctx.canvas.style.height = (!breakpoints.isWideScreen ? 0.75 : 1) * ctx.canvas.offsetWidth + "px";
    ctx.canvas.style.width = thickness + "px";
    ctx.canvas.width = thickness;
    ctx.canvas.height = ctx.canvas.offsetHeight;
  } else {
    // non-vertical pickers (hue, alpha, sketch, wheel)
    ctx.canvas.style.width = !breakpoints.isWideScreen ? "75%" : "";
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = thickness ?? ctx.canvas.offsetWidth;
  }
  return ctx;
}

/**
 * Hook to set the main & picker context from the corresponding reference canvas.
 * Also adjusts the scale so that it fits the parent container nicely (useful for vertical vs horizontal pickers).
 * @param refMain This corresponds to the canvas that displays the UI of a picker background
 * @param refPicker This corresponds to the canvas that displays the actual picker location (user can drag this)
 * @param thickness Only relevant for Hue & Alpha pickers - determines how thick they are depending on the orientation
 * @param vertical Only relevant for Hue & Alpha pickers - whether or not the picker will be upright or not (horizontal saves space in mobile)
 * @returns The scaled context of an input canvas background and picker
 */
export default function useCanvasContext(
  refMain: TRefCanvas,
  refPicker: TRefCanvas,
  thickness?: number,
  vertical?: boolean
): [CanvasRenderingContext2D | undefined, CanvasRenderingContext2D | undefined] {
  const [main, setMain] = useState<CanvasRenderingContext2D>();
  const [picker, setPicker] = useState<CanvasRenderingContext2D>();

  const breakpoints = useBreakpointMap();

  useEffect(() => {
    const ctxMain = refMain.current?.getContext("2d");
    const ctxPicker = refPicker.current?.getContext("2d");
    if (ctxMain && ctxPicker) {
      setMain(fitCanvasContainer(ctxMain, breakpoints, thickness, vertical));
      setPicker(fitCanvasContainer(ctxPicker, breakpoints, thickness, vertical));
    }
  }, [refMain, refPicker, thickness, vertical, breakpoints]);

  return [main, picker];
}
