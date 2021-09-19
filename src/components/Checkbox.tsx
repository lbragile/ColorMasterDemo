import React from "react";
import styled from "styled-components";
import Spacers from "./Spacers";

interface ICheckbox {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const CheckboxInput = styled.input`
  cursor: pointer;
`;

export default function Checkbox({ value, setValue, label }: ICheckbox): JSX.Element {
  return (
    <>
      <CheckboxInput type="checkbox" id="label" name="label" checked={value} onChange={() => setValue(!value)} />
      <Spacers width="2px" />
      <label htmlFor="label">{label}</label>
    </>
  );
}
