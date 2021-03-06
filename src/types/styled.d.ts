import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    primaryBtn: string;
    primaryBtnHover: string;
    boxShadow: string;
    border: string;
    borderSlider: string;
    borderLight: string;
    borderFocus: string;
    bgHover: string;
    bgActive: string;
    bgDark: string;
    bgDefault: string;
    bgSliderRight: string;
    bgSliderThumb: string;
    bgPositive: string;
    bgNegative: string;
    bgPositiveDark: string;
    bgNegativeDark: string;
    bgTooltip: string;
    arrowColor: string;
    arrowColorHover: string;
    heading: string;
    text: string;
    textInverse: string;
    alphaPickerCheckers: string;
    wheelPicker: string;
    info: string;
    success: string;
    loader: string[];
    kbd: {
      bg: string;
      border: string;
      shadow: string[];
    };
  }
}
