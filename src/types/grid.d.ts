export interface IGridSwatch {
  state: ColorMaster;
  alpha: boolean;
  count: number;
}

export interface IGridRowDetails<T> {
  type: keyof T;
  state: ColorMaster;
  text?: string;
}

export interface IGridRow<T> {
  arr: IGridRowDetails<T>[];
  startCount: number;
}

export interface IAlphaStatistics<T = boolean> {
  warm: T;
  cool: T;
  pure: T;
  web: T;
}

export interface IAlphaManipulation<T = boolean> {
  adjust: T;
  rotate: T;
  invert: T;
  grayscale: T;
}
