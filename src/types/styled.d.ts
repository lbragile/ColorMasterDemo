import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
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
    };
  }
}
