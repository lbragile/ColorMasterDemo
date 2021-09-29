import { ColorMaster } from "colormaster";
import React from "react";

export interface IGridSwatch {
  state: ColorMaster;
  alpha: boolean;
  count: number;
}

export interface IGridRowDetails {
  type: keyof (IAlphaManipulation & IAlphaStatistics);
  state: ColorMaster;
  text: string;
}

export interface IGridRow {
  arr: IGridRowDetails[];
  startCount: number;
  page: "statistics" | "manipulate";
  setColor: React.Dispatch<React.SetStateAction<ColorMaster>>;
  alpha: T;
  setAlpha: React.Dispatch<React.SetStateAction<Partial<IAlphaManipulation & IAlphaStatistics>>>;
}

export interface IAlphaStatistics<T = boolean> {
  warm: T;
  cool: T;
  pure: T;
  web: T;
}

export interface IAlphaManipulation {
  adjust: boolean;
  rotate: boolean;
  invert: boolean;
  grayscale: boolean;
}
