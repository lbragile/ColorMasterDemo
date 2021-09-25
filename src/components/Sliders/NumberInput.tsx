import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { INumberInput } from "../../types/slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexColumn } from "../../styles/Flex";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

interface IPressedKey {
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
}

const InputContainer = styled.div`
  position: relative;
`;

const StyledNumberInput = styled.input`
  width: 90px;
  border: 1px solid ${(props) => props.theme.colors.borderLight};
  padding: 6px;
  border-radius: 4px;
  text-align: center;
  outline: none;
  font-size: 1.1rem;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.borderFocus};
  }
`;

const ArrowButton = styled.button.attrs((props: { $dir: "up" | "down"; disabled: boolean }) => props)`
  position: absolute;
  left: 1px;
  top: ${(props) => (props.$dir === "up" ? "1px" : "")};
  bottom: ${(props) => (props.$dir === "down" ? "1px" : "")};
  background-color: ${(props) => props.theme.colors.borderLight};
  height: calc(50% - 1px);
  border-radius: ${(props) => (props.$dir === "up" ? "2px 0 0 0" : "0 0 0 2px")};
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-bottom: ${(props) => (props.$dir === "up" ? `1px solid ${props.theme.colors.border}` : "")};
  outline: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => props.theme.colors.bgDark};
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
  background: ${(props) => props.theme.colors.bgActive};
  border-radius: 0 4px 4px 0;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.arrowColor};
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
      if (e.ctrlKey || e.altKey) {
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
      <FlexColumn $cols={1}>
        <ArrowButton
          $dir="up"
          disabled={Number(value) === Number(max)}
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(e, "top")}
          onPointerUp={clearHold}
          aria-label="Number Input Increment Button"
        >
          <ArrowIcon icon={faCaretUp} />
        </ArrowButton>

        <ArrowButton
          $dir="down"
          disabled={Number(value) === Number(min)}
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(e, "bottom")}
          onPointerUp={clearHold}
          aria-label="Number Input Decrement Button"
        >
          <ArrowIcon icon={faCaretDown} />
        </ArrowButton>
      </FlexColumn>

      <StyledNumberInput
        ref={inputRef}
        aria-label="Color Channel Value"
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
