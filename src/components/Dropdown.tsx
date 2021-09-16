import React, { useState } from "react";
import styled from "styled-components";

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

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

const ItemsWrapper = styled.div`
  text-align: center;
  position: absolute;
  width: calc(100% - 2px);
  left: 1px;
  z-index: 10;
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
  cols?: number;
}

export default function Dropdown({ opts, value, setValue, icon, iconPos, cols = 4 }: IDropdown): JSX.Element {
  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  return (
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
  );
}
