import { RefObject, useEffect, useState } from "react";
import { fitCanvasContainer } from "../utils/fitCanvasContainer";

type TRefCanvas = RefObject<HTMLCanvasElement>;

export default function useCanvasContext(
  refMain: TRefCanvas,
  refPicker: TRefCanvas,
  height?: number
): [CanvasRenderingContext2D | undefined, CanvasRenderingContext2D | undefined] {
  const [main, setMain] = useState<CanvasRenderingContext2D>();
  const [picker, setPicker] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const ctxMain = refMain.current?.getContext("2d");
    const ctxPicker = refPicker.current?.getContext("2d");
    if (ctxMain && ctxPicker) {
      setMain(fitCanvasContainer(ctxMain, height));
      setPicker(fitCanvasContainer(ctxPicker, height));
    }
  }, [refMain, refPicker, height]);

  return [main, picker];
}
