import React from "react";
import RangeInput, { IRangeInput } from "./RangeInput";
import NumberInput, { INumberInput } from "./NumberInput";
import styled from "styled-components";

const SliderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

interface IFullSlider extends INumberInput, IRangeInput {
  title?: string;
}

export default function FullSlider({
  color,
  colorRight = undefined,
  value,
  onChange,
  format = undefined,
  min = "0",
  max = "100",
  title = undefined,
  postfix = undefined
}: IFullSlider): JSX.Element {
  const CommonProps = { value, min, max, format, onChange };

  return (
    <SliderRow>
      <Title>{title?.[0].toUpperCase()}</Title>
      <RangeInput {...CommonProps} color={color} colorRight={colorRight} />
      <NumberInput {...CommonProps} postfix={postfix} />
    </SliderRow>
  );
}
