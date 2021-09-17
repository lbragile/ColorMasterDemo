import React from "react";
import Spacers from "./Spacers";

interface ICheckbox {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

export default function Checkbox({ value, setValue, label }: ICheckbox): JSX.Element {
  return (
    <>
      <input type="checkbox" id="label" name="label" checked={value} onChange={() => setValue(!value)} />
      <Spacers width="2px" />
      <label htmlFor="label">{label}</label>
    </>
  );
}
