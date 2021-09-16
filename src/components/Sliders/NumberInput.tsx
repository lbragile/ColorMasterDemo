import React from "react";
import { TFormat } from "colormaster/types";
import styled from "styled-components";
import { INumberInput } from "../../types/Sliders";

const NumberInputContainer = styled.div`
  display: flex;
  flex: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 36px;
`;

const StyledNumberInput = styled.input.attrs((props: { $format: Exclude<TFormat, "invalid" | "name"> }) => props)`
  width: 90px;
  height: 100%;
  z-index: 0;
  border: 1px solid rgb(232 232 232);
  border-radius: 4px 0 0 4px;
  padding: 6px;
  padding-left: ${(props) => (props.$format === "hex" ? "2.5rem" : "1.5em")};

  &:focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
    transform: scale(1.05, 1.02);

    &:hover {
      cursor: pointer;
    }
  }
`;

const StyledLabel = styled.div`
  display: inline-block;
  width: 28px;
  height: 100%;
  padding: 0 8px;
  align-content: center;
  background: rgb(232, 232, 232);
  border-radius: 0 4px 4px 0;
  display: grid;
  place-items: center;
  font-weight: bolder;
`;

export default function NumberInput({
  value,
  onChange,
  format = undefined,
  min = "0",
  max = "100",
  postfix = undefined
}: INumberInput): JSX.Element {
  const valueStr = value.toString(format === "hex" ? 16 : 10);
  const valueFormatted =
    format === "hex"
      ? ("0" + valueStr.toUpperCase()).slice(-2)
      : valueStr.length > 6
      ? valueStr.slice(0, 6)
      : valueStr.replace(/$0+/g, "");

  const NumberInputProps = {
    type: format === "hex" ? "text" : "number",
    pattern: format === "hex" ? "[0-9a-fA-F]{2}" : "",
    min,
    max,
    step: "0.01",
    value: valueFormatted,
    onChange,
    $format: format
  };

  return (
    <NumberInputContainer>
      <StyledNumberInput {...NumberInputProps} />
      <StyledLabel>{postfix}</StyledLabel>
    </NumberInputContainer>
  );
}
