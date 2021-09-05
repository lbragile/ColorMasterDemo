import { RefObject, useEffect, useState } from "react";

type TRefCanvas = RefObject<HTMLCanvasElement>;

function fitCanvasContainer(
  ctx: CanvasRenderingContext2D,
  thickness?: number,
  vertical?: boolean
): CanvasRenderingContext2D {
  // vertical hue & alpha pickers
  if (thickness && vertical) {
    ctx.canvas.style.height = ctx.canvas.offsetWidth + "px";
    ctx.canvas.style.width = thickness + "px";
    ctx.canvas.width = thickness;
    ctx.canvas.height = ctx.canvas.offsetHeight;
  } else {
    // non-vertical pickers (hue, alpha, sketch, wheel)
    ctx.canvas.style.width = "50%";
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = thickness ?? ctx.canvas.offsetWidth;
  }
  return ctx;
}

export default function useCanvasContext(
  refMain: TRefCanvas,
  refPicker: TRefCanvas,
  thickness?: number,
  vertical?: boolean
): [CanvasRenderingContext2D | undefined, CanvasRenderingContext2D | undefined] {
  const [main, setMain] = useState<CanvasRenderingContext2D>();
  const [picker, setPicker] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const ctxMain = refMain.current?.getContext("2d");
    const ctxPicker = refPicker.current?.getContext("2d");
    if (ctxMain && ctxPicker) {
      setMain(fitCanvasContainer(ctxMain, thickness, vertical));
      setPicker(fitCanvasContainer(ctxPicker, thickness, vertical));
    }
  }, [refMain, refPicker, thickness, vertical]);

  return [main, picker];
}
