import { TFormat } from "colormaster/types";
import React from "react";
import { Input } from "semantic-ui-react";
import styled from "styled-components";

const SliderInput = styled.input.attrs((props) => {
  const val = Number(props.value ?? 0);
  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const breakpoint = 100 * ((val - min) / (max - min));

  return {
    style: {
      background: `linear-gradient(to right, ${props.color} 0%, ${props.color} ${breakpoint}%, hsla(0, 0%, 90%, 1) ${breakpoint}%, hsla(0, 0%, 90%, 1) 100%)`
    }
  };
})`
  -webkit-appearance: none;
  width: 200px;
  height: 8px;
  border-radius: 12px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: hsla(0, 0%, 80%, 1);
    border: 1px solid grey;
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }

  &:hover {
    cursor: grab;
  }
`;

const NumberInput = styled(Input)`
  margin-left: 10px;

  &.ui.input {
    & > input {
      width: 11ch;
      text-align: ${(props) => (props.format === "hex" ? "center" : "left")};
      padding-left: ${(props) => (props.format === "hex" ? "" : "2.2em")};

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        opacity: 1;
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        height: 50%;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;

const SliderContainer = styled.div`
  & > span {
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 10px;
    display: inline-block;
    width: 1ch;
  }
`;

interface IRangeSlider {
  value: number;
  color: string;
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  step?: string;
  postfix?: string;
  format?: Exclude<TFormat, "name" | "invalid">;
}

export default function RangeSlider({
  value,
  color,
  title,
  onChange,
  min = "0",
  max = "100",
  step = "any",
  postfix = "",
  format = undefined
}: IRangeSlider): JSX.Element {
  // formats the input when typing to avoid "jumpy" behavior
  function clamp(val: number, adjustBase = false): string {
    console.log(val);
    const clampedVal = Math.max(+min, format === "hex" ? Math.round(val) : Math.min(Math.round(val * 100) / 100, +max));
    const strVal = clampedVal.toString(format === "hex" && adjustBase ? 16 : 10).toUpperCase();

    return format === "hex" && strVal.length === 1 ? "0" + strVal : strVal;
  }

  const CommonProps = {
    min,
    max,
    type: format === "hex" ? "text" : "number",
    format,
    step,
    onChange
  };
  const SliderInputProps = {
    ...CommonProps,
    value: clamp(value, false),
    type: "range",
    step: "0.01",
    color,
    draggable: false
  };
  const NumberInputProps = {
    ...CommonProps,
    value: clamp(value, true),
    ...(postfix ? { label: postfix, labelPosition: "right" } : {})
  };

  return (
    <SliderContainer>
      <span>{title}</span>

      <SliderInput {...SliderInputProps} />

      <NumberInput {...NumberInputProps} />
    </SliderContainer>
  );
}
