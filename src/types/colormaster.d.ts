import { TFormat } from "colormaster/types";

export type TValidColorspace = Exclude<TFormat, "name" | "invalid">;
