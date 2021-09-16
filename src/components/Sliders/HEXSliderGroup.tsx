import { ColorMaster } from "colormaster";
import { TChannel, TChannelHSL } from "colormaster/types";
import React from "react";
import RGBSliderGroup from "./RGBSliderGroup";

interface IHEXSliderGroup {
  color: ColorMaster;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: TChannel | TChannelHSL) => void;
  gap?: string;
}

export default function HEXSliderGroup({ color, onChange, gap = "" }: IHEXSliderGroup): JSX.Element {
  return <RGBSliderGroup rgb={color.rgba()} onChange={onChange} format="hex" gap={gap} />;
}
