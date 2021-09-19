import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { INumberInput } from "../../types/Sliders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexColumn, FlexRow } from "../../styles/Flex";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

interface IPressedKey {
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
}

const InputContainer = styled(FlexRow)`
  position: relative;
`;

const StyledNumberInput = styled.input`
  width: 90px;
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

  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventZoom, { passive: false });
    return () => document.removeEventListener("wheel", preventZoom);
  }, []);

  function getStepSize({ shiftKey, ctrlKey, altKey }: IPressedKey): number {
    let step = 0;
    if (ctrlKey) step += 25;
    if (shiftKey) step += 10;
    if (altKey) step += 5;

    if (step === 0) step = 1;

    return step;
  }

  function manualChangeEvent(e: React.ChangeEvent<HTMLInputElement>, sign: number, step: number): void {
    if (inputRef.current) {
      const delta = sign * step;
      const numValue =
        format === "hex"
          ? Math.max(0, Math.min(parseInt(inputRef.current.value, 16) + delta, 255))
          : Number(inputRef.current.value) + delta;

      onChange({ ...e, target: { ...e.target, value: numValue.toString(format === "hex" ? 16 : 10) } });
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, btn: "top" | "bottom") => {
    const { shiftKey, ctrlKey, altKey } = e;
    const step = getStepSize({ shiftKey, ctrlKey, altKey });
    timeoutId.current = setInterval(
      () => manualChangeEvent(e as unknown as React.ChangeEvent<HTMLInputElement>, btn === "top" ? 1 : -1, step),
      75
    ) as unknown as number;
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    const { shiftKey, ctrlKey, altKey, deltaY } = e;
    const step = getStepSize({ shiftKey, ctrlKey, altKey });

    // only fire if the previous interval was cleared
    if (timeoutId.current === 0) {
      manualChangeEvent(e as unknown as React.ChangeEvent<HTMLInputElement>, deltaY < 0 ? 1 : -1, step);
    }
  };

  const clearHold = () => {
    clearInterval(timeoutId.current);
    timeoutId.current = 0;
  };

  return (
    <InputContainer>
      <FlexColumn>
        <ArrowButton
          $dir="up"
          disabled={Number(value) === Number(max)}
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(e, "top")}
          onPointerUp={clearHold}
        >
          <FontAwesomeIcon icon={faCaretUp} color="hsla(0, 0%, 25%, 1)" />
        </ArrowButton>

        <ArrowButton
          $dir="down"
          disabled={Number(value) === Number(min)}
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(e, "bottom")}
          onPointerUp={clearHold}
        >
          <FontAwesomeIcon icon={faCaretDown} color="hsla(0, 0%, 25%, 1)" />
        </ArrowButton>
      </FlexColumn>

      <StyledNumberInput
        ref={inputRef}
        type="text"
        min={min}
        max={max}
        value={
          format === "hex" ? ("0" + Math.round(+value).toString(16)).slice(-2).toUpperCase() : Number(value).toFixed(0)
        }
        onChange={onChange}
        onWheel={handleWheel}
      />

      {postfix && <StyledLabel>{postfix}</StyledLabel>}
    </InputContainer>
  );
}
