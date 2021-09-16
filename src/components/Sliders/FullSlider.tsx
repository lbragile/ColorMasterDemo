import React from "react";
import RangeInput from "./RangeInput";
import NumberInput from "./NumberInput";
import styled from "styled-components";
import { IFullSlider } from "../../types/Sliders";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

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
    <FlexRow>
      <Title>{title?.[0].toUpperCase()}</Title>
      <RangeInput {...CommonProps} color={color} colorRight={colorRight} />
      <NumberInput {...CommonProps} postfix={postfix} />
    </FlexRow>
  );
}
