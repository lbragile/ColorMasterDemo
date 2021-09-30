import React from "react";
import styled from "styled-components";
import { TSetState } from "../types/react";
import Spacers from "./Spacers";

interface ICheckbox {
  value: boolean;
  setValue: TSetState<boolean>;
  label: string;
}

const CheckboxContainer = styled.span`
  & * {
    cursor: pointer;
  }
`;

export default function Checkbox({ value, setValue, label }: ICheckbox): JSX.Element {
  const toggleValue = () => setValue(!value);

  return (
    <CheckboxContainer>
      <input type="checkbox" checked={value} onChange={toggleValue} aria-label="Toggle alpha channel visibility" />
      <Spacers width="3px" />
      <label onClick={toggleValue}>
        <b>{label}</b>
      </label>
    </CheckboxContainer>
  );
}
