import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { FlexColumn } from "../styles/Flex";
import { StyledAngleIcon } from "./ColorSelectorWidget";
import Spacers from "./Spacers";

const Container = styled.div.attrs((props: { $cols: number }) => props)`
  position: relative;
  width: ${(props) => (props.$cols * 100) / 24 + "%"};
`;

const Button = styled.button`
  padding: 10px;
  background-color: transparent;
  border: 1px solid hsla(0, 0%, 75%, 1);
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  outline: none;
`;

const ItemsWrapper = styled.div`
  text-align: center;
  position: absolute;
  width: calc(100% - 2px);
  left: 1px;
  z-index: 1;
`;

const Item = styled.div.attrs((props: { $active: boolean; $selected: boolean; $last: boolean }) => props)`
  border: 1px solid hsla(0, 0%, 90%, 1);
  border-top: none;
  border-radius: ${(props) => (props.$last ? "0 0 10px 10px" : "")};
  background-color: ${(props) => (props.$active ? "hsla(0, 0%, 95%, 1)" : "white")};
  font-weight: ${(props) => (props.$selected ? "bold" : "normal")};
  width: 100%;
  padding: 10px;
  cursor: pointer;
`;

const StyledIcon = styled.span.attrs((props: { $iconPos: "right" | "left" }) => props)`
  position: absolute;
  left: ${(props) => (props.$iconPos === "left" ? "8px" : "")};
  right: ${(props) => (props.$iconPos === "right" ? "8px" : "")};
`;

interface IDropdown {
  opts: string[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  icon: JSX.Element;
  iconPos: "left" | "right";
  /** The up/down angle brackets that let the user adjust dropdown values without opening it */
  switcherPos: "left" | "right";
  cols?: number;
}

const Switcher = ({ adjustSelection }: { adjustSelection: (dir: "up" | "down") => void }): JSX.Element => {
  return (
    <FlexColumn $cols={1}>
      <StyledAngleIcon icon={faAngleUp} color="gray" onClick={() => adjustSelection("up")} />
      <StyledAngleIcon icon={faAngleDown} color="gray" onClick={() => adjustSelection("down")} />
    </FlexColumn>
  );
};

export default function Dropdown({
  opts,
  value,
  setValue,
  icon,
  iconPos,
  switcherPos,
  cols = 4
}: IDropdown): JSX.Element {
  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const adjustSelection = useCallback(
    (dir: "up" | "down") => {
      let newValue = "";
      const currentIndex = opts.indexOf(value);
      if (dir === "down") {
        newValue = currentIndex === 0 ? opts[opts.length - 1] : opts[currentIndex - 1];
      } else {
        newValue = currentIndex === opts.length - 1 ? opts[0] : opts[currentIndex + 1];
      }

      setValue(newValue);
    },
    [opts, value, setValue]
  );

  return (
    <>
      {switcherPos === "left" && (
        <>
          <Switcher adjustSelection={adjustSelection} />
          <Spacers width="5px" />
        </>
      )}
      <Container $cols={cols}>
        <Button onClick={() => setShow(!show)}>
          <StyledIcon $iconPos={iconPos}>{iconPos === "left" && icon}</StyledIcon>
          {value.toUpperCase()}
          <StyledIcon $iconPos={iconPos}>{iconPos === "right" && icon}</StyledIcon>
        </Button>
        <ItemsWrapper onPointerLeave={() => setShow(false)}>
          {show &&
            opts.map((item, i) => {
              return (
                <Item
                  key={item}
                  $active={item === activeItem}
                  $selected={item === value}
                  $last={i === opts.length - 1}
                  onClick={() => {
                    setValue(item);
                    setShow(false);
                  }}
                  onPointerOver={() => setActiveItem(item)}
                >
                  {item.toUpperCase()}
                </Item>
              );
            })}
        </ItemsWrapper>
      </Container>
      {switcherPos === "right" && (
        <>
          <Spacers width="5px" />
          <Switcher adjustSelection={adjustSelection} />
        </>
      )}
    </>
  );
}
