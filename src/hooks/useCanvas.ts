import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { BreakpointsContext } from "../components/App";

type Generic<X> = X | null | undefined;
type TCanvas = Generic<HTMLCanvasElement>;
type TContext = Generic<CanvasRenderingContext2D>;

function fitCanvasContainer(canvas: TCanvas, thickness?: number, vertical?: boolean, isMobile?: boolean): TContext {
  const dim = (isMobile ? 0.75 : 1) * 300;
  const ctx = canvas?.getContext("2d");

  if (ctx) {
    if (thickness && vertical) {
      // vertical hue & alpha pickers
      ctx.canvas.width = thickness;
      ctx.canvas.height = dim;
    } else {
      // non-vertical pickers (hue, alpha, sketch, wheel)
      ctx.canvas.width = dim;
      ctx.canvas.height = thickness ?? dim;
    }
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
export default function useCanvas(thickness?: number, vertical?: boolean): [RefObject<HTMLCanvasElement>, TContext] {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<TContext>(null);

  const { isMobile, isTablet } = useContext(BreakpointsContext);
  const isResponsive = isMobile || isTablet;

  useEffect(() => {
    setCtx(fitCanvasContainer(ref.current, thickness, vertical, isResponsive));
  }, [thickness, vertical, isResponsive]);

  return [ref, ctx];
}
