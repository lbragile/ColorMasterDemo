import React from "react";
import styled from "styled-components";
import { IRangeInput } from "../../types/Sliders";

const SliderInput = styled.input.attrs(
  (props: {
    value: string | number;
    min: string;
    max: string;
    $color: string;
    $colorRight?: string;
    $width: string;
  }) => {
    const val = Number(props.value ?? 0);
    const min = Number(props.min ?? 0);
    const max = Number(props.max ?? 100);
    const breakpoint = 100 * ((val - min) / (max - min));
    const colorRight = props.$colorRight ?? "hsla(0, 0%, 90%, 1)";
    const sliderColor = `linear-gradient(to right, ${props.$color} 0%, ${props.$color} ${breakpoint}%, ${colorRight} ${breakpoint}%, ${colorRight} 100%)`;
    return { ...props, style: { background: sliderColor }, $colorRight: colorRight };
  }
)`
  -webkit-appearance: none;
  width: ${(props) => props.$width ?? "50%"};
  height: 8px;
  border-radius: 12px;
  border: ${(props) => (props.$colorRight ? "1px solid hsla(0, 0%, 80%, 1)" : "")};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: hsla(0, 0%, 80%, 1);
    border: 1px solid grey;
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }

  &:hover {
    cursor: ew-resize;
  }
`;

export default function RangeInput({
  color,
  colorRight = undefined,
  value,
  min = "0",
  max = "100",
  format = undefined,
  width = "50%",
  onChange
}: IRangeInput): JSX.Element {
  return (
    <SliderInput
      type="range"
      step="1"
      min={min}
      max={max}
      value={value}
      draggable={false}
      $color={color}
      $colorRight={colorRight}
      $width={width}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        // * sliders are always numeric (base 10), so need to convert to hex (base 16) if format matches
        onChange({ ...e, target: { ...e.target, value: Number(e.target.value).toString(format === "hex" ? 16 : 10) } });
      }}
    />
  );
}
