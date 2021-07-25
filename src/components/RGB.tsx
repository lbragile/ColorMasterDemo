import React from "react";
import { rgb } from "colormaster";

export default function RGB(): JSX.Element {
  return <div>{rgb({ r: 128, g: 128, b: 128, a: 0.5 }).string({ withAlpha: true, quotes: "double" })}</div>;
}
