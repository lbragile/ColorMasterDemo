import { DefaultTheme } from "styled-components";

interface ITheme {
  light: DefaultTheme;
  dark: DefaultTheme;
}

const light: DefaultTheme = {
  primaryBtn: "hsla(225, 100%, 60%, 1)",
  primaryBtnHover: "hsla(225, 100%, 55%, 1)",
  boxShadow: "hsla(0, 0%, 40%, 0.5)",
  border: "hsla(0, 0%, 75%, 1)",
  borderSlider: "hsla(0, 0%, 80%, 1)",
  borderLight: "hsla(0, 0%, 90%, 1)",
  borderFocus: "hsla(210, 100%, 75%, 1)",
  bgHover: "hsla(0, 0%, 95%, 1)",
  bgActive: "hsla(0, 0%, 90%, 1)",
  bgDefault: "hsla(0, 0%, 100%, 1)",
  bgDark: "hsla(0, 0%, 80%, 1)",
  bgSliderRight: "hsla(0, 0%, 95%, 1)",
  bgSliderThumb: "hsla(0, 0%, 95%, 1)",
  bgPositive: "hsla(120, 100%, 90%, 1)",
  bgNegative: "hsla(0, 100%, 90%, 1)",
  bgPositiveDark: "hsla(120, 100%, 25%, 1)",
  bgNegativeDark: "hsla(0, 100%, 25%, 1)",
  bgTooltip: "hsla(0, 0%, 10%, 1)",
  arrowColor: "hsla(0, 0%, 25%, 1)",
  arrowColorHover: "hsla(0, 0%, 70%, 1)",
  heading: "hsla(0, 0%, 45%, 1)",
  text: "black",
  textInverse: "white",
  alphaPickerCheckers: "hsla(0, 0%, 0%, 0.2)",
  wheelPicker: "hsla(0, 0%, 0%, 0.6)"
};

const dark: DefaultTheme = {
  primaryBtn: "hsla(225, 100%, 60%, 1)",
  primaryBtnHover: "hsla(225, 100%, 55%, 1)",
  boxShadow: "hsla(0, 0%, 80%, 0.5)",
  border: "hsla(0, 0%, 50%, 1)",
  borderSlider: "hsla(0, 0%, 80%, 1)",
  borderLight: "hsla(0, 0%, 90%, 1)",
  borderFocus: "hsla(210, 100%, 75%, 1)",
  bgHover: "hsla(215, 30%, 20%, 1)",
  bgActive: "hsla(215, 30%, 15%, 1)",
  bgDefault: "hsla(215, 30%, 5%, 1)",
  bgDark: "hsla(0, 0%, 80%, 1)",
  bgSliderRight: "hsla(0, 0%, 95%, 1)",
  bgSliderThumb: "hsla(0, 0%, 95%, 1)",
  bgPositive: "hsla(120, 100%, 10%, 1)",
  bgNegative: "hsla(0, 100%, 10%, 1)",
  bgPositiveDark: "hsla(120, 100%, 75%, 1)",
  bgNegativeDark: "hsla(0, 100%, 75%, 1)",
  bgTooltip: "hsla(0, 0%, 90%, 1)",
  arrowColor: "hsla(0, 0%, 75%, 1)",
  arrowColorHover: "hsla(0, 0%, 30%, 1)",
  heading: "hsla(0, 0%, 55%, 1)",
  text: "white",
  textInverse: "black",
  alphaPickerCheckers: "hsla(0, 0%, 100%, 0.2)",
  wheelPicker: "hsla(0, 0%, 100%, 0.6)"
};

const theme: ITheme = { light, dark };

export default theme;
