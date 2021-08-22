import { useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border: none;
  outline: none;

  width: fit-content;
  width: 65px;
  margin-left: 10px;

  &:hover {
    border-bottom: 1px solid black;
    padding-bottom: 4px;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    opacity: 1;
  }
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  background: ${(props) =>
    `linear-gradient(to right, ${props.color}, ${props.color} ${props.value}%, white ${props.value}%, white 100%)`};
  border: solid 1px ${(props) => props.color};
  width: 200px;
  height: 8px;
  border-radius: 12px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: ${(props) => props.color};
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
`;

interface IRangeSlider {
  value: string;
  color: string;
  title: string;
  min?: number;
  max?: number;
  step?: string;
}

export default function RangeSlider({
  value,
  color,
  title,
  min = 0,
  max = 100,
  step = "any"
}: IRangeSlider): JSX.Element {
  const [inputVal, setInputVal] = useState(value);
  return (
    <div>
      <h3>{title}</h3>

      <SliderInput
        color={color}
        type="range"
        id="alpha"
        name="alpha"
        min="0"
        max="100"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        step="0.01"
        draggable={false}
      />
      <StyledInput
        type="number"
        min={min}
        max={max}
        step={step}
        value={inputVal}
        onChange={(e) => setInputVal(Math.max(min, Math.min(+e.target.value, max)).toString())}
        onBlur={(e) => setInputVal((+e.target.value).toFixed(2))}
      />
    </div>
  );
}
