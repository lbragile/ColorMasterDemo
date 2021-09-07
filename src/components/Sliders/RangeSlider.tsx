import React from "react";
import { TFormat } from "colormaster/types";
import { Grid, Header, Input } from "semantic-ui-react";
import styled from "styled-components";
import useBreakpointMap from "../../hooks/useBreakpointMap";

const SliderInput = styled.input.attrs(
  (props: { value: string; min: string; max: string; $color: string; $colorRight: string }) => {
    const val = Number(props.value ?? 0);
    const min = Number(props.min ?? 0);
    const max = Number(props.max ?? 100);
    const breakpoint = 100 * ((val - min) / (max - min));
    const colorRight = props.$colorRight ?? "hsla(0, 0%, 90%, 1)";
    const sliderColor = `linear-gradient(to right, ${props.$color} 0%, ${props.$color} ${breakpoint}%, ${colorRight} ${breakpoint}%, ${colorRight} 100%)`;
    return { style: { background: sliderColor }, colorRight };
  }
)`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 12px;
  border: ${(props) => (props.colorRight ? "1px solid hsla(0, 0%, 80%, 1)" : "")};

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

const NumberInput = styled(Input).attrs(
  (props: { $mobile: boolean; $format: Exclude<TFormat, "invalid" | "name"> }) => props
)`
  && > input {
    width: 100%;
    height: 36px;
    text-align: ${(props) => (props.$format === "hex" || props.$mobile ? "center" : "left")};
    padding: 6px;
    padding-left: ${(props) => (props.$format === "hex" ? "" : props.$mobile ? "0.2em" : "1.5em")};
    font-size: ${(props) => (props.$mobile ? "0.925em" : "1em")};

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  min?: string;
  max?: string;
  step?: string;
  postfix?: string;
  format?: Exclude<TFormat, "name" | "invalid">;
  showNum?: boolean;
  colorRight?: string;
}

export default function RangeSlider({
  value,
  color,
  onChange,
  title = undefined,
  min = "0",
  max = "100",
  step = "any",
  postfix = "",
  format = undefined,
  showNum = true,
  colorRight = undefined
}: IRangeSlider): JSX.Element {
  // formats the input when typing to avoid "jumpy" behavior
  function clamp(val: number, adjustBase = false): string {
    const clampedVal = Math.max(+min, format === "hex" ? Math.round(val) : Math.min(Math.round(val * 100) / 100, +max));
    const strVal = clampedVal.toString(format === "hex" && adjustBase ? 16 : 10).toUpperCase();

    return format === "hex" && strVal.length === 1 ? "0" + strVal : strVal;
  }

  const { isMobile } = useBreakpointMap();

  const type = format === "hex" ? "text" : "number";
  const CommonProps = { type, min, max, step, $format: format, onChange };

  const SliderInputProps = {
    ...CommonProps,
    value: clamp(value, false),
    type: "range",
    step: format === "hex" ? "1" : "0.01",
    draggable: false,
    $color: color,
    $colorRight: colorRight
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

      {showNum && (
        <Grid.Column computer={colorRight ? 3 : 4} mobile={5}>
          <NumberInput {...NumberInputProps} $mobile={isMobile} />
        </Grid.Column>
      )}
    </Grid.Row>
  );
}
