import React from "react";
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
    border: 1px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }

  &:hover {
    cursor: grab;
  }
`;

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

const SliderContainer = styled.div`
  margin: 2em 0;

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
  return (
    <SliderContainer>
      <span>{title}</span>

      <SliderInput
        type="range"
        value={value}
        color={color}
        min={min}
        max={max}
        onChange={onChange}
        step="0.01"
        draggable={false}
      />

      <NumberInput type="number" min={min} max={max} step={step} value={value} onChange={onChange} />
      {postfix}
    </SliderContainer>
  );
}
