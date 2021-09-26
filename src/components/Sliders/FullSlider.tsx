import React from "react";
import RangeInput from "./RangeInput";
import NumberInput from "./NumberInput";
import styled from "styled-components";
import { FlexRow } from "../../styles/Flex";
import Spacers from "../Spacers";
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
  postfix = undefined
}: IFullSlider): JSX.Element {
  const CommonProps = { value, min, max, format, onChange };

  return (
    <FlexRow>
      <Title>{title}</Title>

      <Spacers width="10px" />

      <RangeInput {...CommonProps} color={color} colorRight={colorRight} />

      <Spacers width="10px" />

      <NumberInput {...CommonProps} postfix={postfix} />
    </FlexRow>
  );
}
