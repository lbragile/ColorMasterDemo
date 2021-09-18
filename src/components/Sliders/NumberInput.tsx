import React, { useRef } from "react";
import { TFormat } from "colormaster/types";
import styled from "styled-components";
import { INumberInput } from "../../types/Sliders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexColumn, FlexRow } from "../../styles/Flex";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const InputContainer = styled(FlexRow)`
  position: relative;
`;

const StyledNumberInput = styled.input.attrs((props: { $format: Exclude<TFormat, "invalid" | "name"> }) => props)`
  width: 110px;
  height: 36px;
  border: 1px solid hsla(0, 0%, 90%, 1);
  border-radius: 4px;
  padding: 6px;
  text-align: center;

  &:focus {
    outline: none;
    border: 1px solid hsla(210, 100%, 75%, 1);
  }
`;

const ArrowButton = styled.button.attrs((props: { $dir: "up" | "down"; disabled: boolean }) => props)`
  position: absolute;
  left: 1px;
  top: ${(props) => (props.$dir === "up" ? "1px" : "")};
  bottom: ${(props) => (props.$dir === "down" ? "1px" : "")};
  background-color: hsla(0, 0%, 90%, 1);
  height: calc(50% - 1px);
  border-radius: ${(props) => (props.$dir === "up" ? "2px 0 0 0" : "0 0 0 2px")};
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-bottom: ${(props) => (props.$dir === "up" ? "1px solid hsla(0, 0%, 75%, 1)" : "")};
  outline: none;

  &:hover {
    background-color: hsla(0, 0%, 80%, 1);
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }

  & path {
    fill: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.2)" : "")};
  }
`;

const StyledLabel = styled.div`
  position: absolute;
  right: 1px;
  top: 1px;
  width: 20px;
  height: calc(100% - 2px);
  background: hsla(0, 0%, 90%, 1);
  border-radius: 0 4px 4px 0;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function NumberInput({
  value,
  onChange,
  format = undefined,
  min = "0",
  max = "100",
  postfix = undefined
}: INumberInput): JSX.Element {
  const timeoutId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePointerDown(btn: "top" | "bottom", step: number) {
    const sign = btn === "top" ? 1 : -1;

    timeoutId.current = setInterval(() => {
      if (inputRef.current) {
        const value =
          format === "hex" ? parseInt(inputRef.current.value, 16) + sign : Number(inputRef.current.value) + sign * step;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange({ target: { value } });
      }
    }, 75) as unknown as number;
  }

  const NumberInputProps = {
    type: "text",
    min,
    max,
    step: 0.1,
    value:
      format === "hex" ? ("0" + Math.round(+value).toString(16)).slice(-2).toUpperCase() : Number(value).toFixed(2),
    onChange,
    $format: format
  };

  return (
    <InputContainer>
      <FlexColumn>
        <ArrowButton
          $dir="up"
          disabled={Number(value) === Number(max)}
          onPointerDown={() => handlePointerDown("top", NumberInputProps.step)}
          onPointerUp={() => clearInterval(timeoutId.current)}
        >
          <FontAwesomeIcon icon={faCaretUp} color="hsla(0, 0%, 25%, 1)" />
        </ArrowButton>
        <ArrowButton
          $dir="down"
          disabled={Number(value) === Number(min)}
          onPointerDown={() => handlePointerDown("bottom", NumberInputProps.step)}
          onPointerUp={() => clearInterval(timeoutId.current)}
        >
          <FontAwesomeIcon icon={faCaretDown} color="hsla(0, 0%, 25%, 1)" />
        </ArrowButton>
      </FlexColumn>
      <StyledNumberInput ref={inputRef} {...NumberInputProps} />
      {postfix && <StyledLabel>{postfix}</StyledLabel>}
    </InputContainer>
  );
}
