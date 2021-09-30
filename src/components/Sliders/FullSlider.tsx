import React from "react";
import RangeInput from "./RangeInput";
import NumberInput from "./NumberInput";
import styled from "styled-components";
import { FlexRow } from "../../styles/Flex";
import { IFullSlider } from "../../types/slider";

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
  postfix = undefined,
  children = undefined
}: IFullSlider): JSX.Element {
  const CommonProps = { value, min, max, format, onChange };

  return (
    <FlexRow $gap="8px">
      <Title>{title}</Title>

      <RangeInput {...CommonProps} color={color} colorRight={colorRight} />

      <NumberInput {...CommonProps} postfix={postfix} />

      {children}
    </FlexRow>
  );
}
