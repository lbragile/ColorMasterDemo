import React from "react";
import styled from "styled-components";

const NumberInput = styled.input`
  border: none;
  outline: none;

  width: 8.5ch;
  margin-left: 10px;
  padding-left: 20px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    opacity: 1;
    position: absolute;
    left: 0;
    height: 100%;
  }
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  background: ${(props) => {
    const pos =
      ((Number(props.value ?? 0) - Number(props.min ?? 0)) * 100) / (Number(props.max ?? 0) - Number(props.min ?? 0));
    return `linear-gradient(to right, ${props.color}, ${props.color} ${pos}%, white ${pos}%, white 100%)`;
  }};
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

  &:hover {
    cursor: grab;
  }
`;

const InputLabel = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 10px;
  text-transform: capitalize;
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
}

export default function RangeSlider({
  value,
  color,
  title,
  onChange,
  min = "0",
  max = "100",
  step = "any",
  postfix = ""
}: IRangeSlider): JSX.Element {
  function clamp(min: string, val: number, max: string): string {
    return Math.max(+min, Math.min(Math.round(val * 100) / 100, +max)).toString();
  }

  return (
    <div>
      <span>{title}</span>

      <input
        type="range"
        value={value}
        color={color}
        min={min}
        max={max}
        onChange={onChange}
        step="0.01"
        draggable={false}
      />

      <input type="number" min={min} max={max} step={step} value={clamp(min, value, max)} onChange={onChange} />
      {postfix}
    </div>
  );
}
