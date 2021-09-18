import { TFormat } from "colormaster/types";
import React from "react";

interface ICommon {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  format?: Exclude<TFormat, "name" | "invalid">;
  min?: string;
  max?: string;
}

export interface INumberInput extends ICommon {
  postfix?: string;
}

export interface IRangeInput extends ICommon {
  color: string;
  colorRight?: string;
  step?: string;
}

export interface IFullSlider extends INumberInput, IRangeInput {
  title?: string;
}
