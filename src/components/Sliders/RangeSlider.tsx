import React from "react";
import { TFormat } from "colormaster/types";
import { Grid, Header, Input } from "semantic-ui-react";
import styled from "styled-components";
import useIsMobile from "../../hooks/useIsMobile";

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
  width: 100%;
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
    cursor: ew-resize;
  }
`;

const NumberInput = styled(Input)`
  && > input {
    width: 100%;
    height: 36px;
    text-align: ${(props) => (props.format === "hex" || props.mobile === "true" ? "center" : "left")};
    padding: 6px;
    padding-left: ${(props) => (props.format === "hex" ? "" : props.mobile === "true" ? "0.2em" : "1.5em")};
    font-size: ${(props) => (props.mobile === "true" ? "0.925em" : "1em")};

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      opacity: 1;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;

      &:hover {
        cursor: pointer;
      }
    }
  }

  & .label {
    width: 2.5ch;
    text-align: center;
    padding: 1px;
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
    const clampedVal = Math.max(+min, format === "hex" ? Math.round(val) : Math.min(Math.round(val * 100) / 100, +max));
    const strVal = clampedVal.toString(format === "hex" && adjustBase ? 16 : 10).toUpperCase();

    return format === "hex" && strVal.length === 1 ? "0" + strVal : strVal;
  }

  const isMobile = useIsMobile();

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
    <Grid.Row>
      <Grid.Column>
        <Header as="h4">{title}</Header>
      </Grid.Column>

      <Grid.Column className="slider-input-col" computer={10} mobile={7}>
        <SliderInput {...SliderInputProps} />
      </Grid.Column>

      <Grid.Column computer={3} mobile={5}>
        <NumberInput mobile={isMobile.toString()} {...NumberInputProps} />
      </Grid.Column>
    </Grid.Row>
  );
}
