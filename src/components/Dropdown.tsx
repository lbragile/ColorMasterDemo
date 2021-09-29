import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { StyledAngleIcon } from "../styles/AngleIcon";
import { FlexColumn } from "../styles/Flex";
import Spacers from "./Spacers";

const Container = styled.div.attrs((props: { $cols: number }) => props)`
  position: relative;
  width: ${(props) => (props.$cols * 100) / 24 + "%"};
`;

const Button = styled.button`
  padding: 10px;
  background-color: transparent;
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.borderLight};
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
  max-height: 200px;
  overflow-y: auto;
`;

const Item = styled.div.attrs((props: { $active: boolean; $selected: boolean; $last: boolean }) => props)`
  border: 1px solid ${(props) => props.theme.borderLight};
  border-top: none;
  border-radius: ${(props) => (props.$last ? "0 0 10px 10px" : "")};
  background-color: ${(props) => (props.$active ? props.theme.bgActive : props.theme.bgDefault)};
  color: ${(props) => props.theme.text};
  font-weight: ${(props) => (props.$selected ? "bold" : "normal")};
  width: 100%;
  padding: 10px;
  cursor: pointer;
`;

const StyledIcon = styled.span.attrs((props: { $iconPos: "right" | "left" }) => props)`
  position: absolute;
  left: ${(props) => (props.$iconPos === "left" ? "8px" : "")};
  right: ${(props) => (props.$iconPos === "right" ? "8px" : "")};
  color: ${(props) => props.theme.arrowColor};
`;

interface IDropdown {
  opts: string[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  icon: JSX.Element;
  iconPos: "left" | "right";
  /** The up/down angle brackets that let the user adjust dropdown values without opening it */
  switcherPos: "left" | "right" | "none";
  cols?: number;
}

const Switcher = ({ adjustSelection }: { adjustSelection: (dir: "up" | "down") => void }): JSX.Element => {
  return (
    <FlexColumn $cols={1}>
      <StyledAngleIcon
        icon={faAngleUp}
        onClick={() => adjustSelection("up")}
        aria-label="Automatically switch dropdown value up"
      />
      <StyledAngleIcon
        icon={faAngleDown}
        onClick={() => adjustSelection("down")}
        aria-label="Automatically switch dropdown value down"
      />
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
          <Spacers width="2px" />
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
                  onPointerDown={() => {
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
          <Spacers width="2px" />
          <Switcher adjustSelection={adjustSelection} />
        </>
      )}
    </>
  );
}
