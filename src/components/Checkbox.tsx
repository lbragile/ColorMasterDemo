import React from "react";
import styled from "styled-components";
import Spacers from "./Spacers";

interface ICheckbox {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
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
      <input type="checkbox" checked={value} onChange={toggleValue} />
      <Spacers width="2px" />
      <label onClick={toggleValue}>
        <b>{label}</b>
      </label>
    </CheckboxContainer>
  );
}
