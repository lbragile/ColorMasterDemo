import { TFormat } from "colormaster/types";
import React from "react";

interface ICommon {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  format?: Exclude<TFormat, "name" | "invalid">;
}

export interface INumberInput extends ICommon {
  postfix?: string;
}

export interface IRangeInput extends ICommon {
  color: string;
  colorRight?: string;
}

export interface IFullSlider extends INumberInput, IRangeInput {
  title?: string;
}
