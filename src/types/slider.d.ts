import React from "react";
import { TValidColorspace } from "./colormaster";

interface ICommon {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  format?: TValidColorspace;
}

export interface INumberInput extends ICommon {
  postfix?: string;
}

export interface IRangeInput extends ICommon {
  color: string;
  colorRight?: string;
  width?: string;
}

export interface IFullSlider extends INumberInput, IRangeInput {
  title?: string;
  children?: JSX.Element;
}
