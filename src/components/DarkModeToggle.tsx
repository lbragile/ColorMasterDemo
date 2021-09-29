import React from "react";
import styled from "styled-components";
import { IUseDarkModeOutput } from "../types/darkmode";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Switch = styled.div.attrs((props: { $isDark: boolean }) => props)`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  background-color: white;
  left: ${(props) => (props.$isDark ? "calc(100% - 1.75rem)" : "3px")};
`;

const Toggle = styled.button.attrs((props: { $isDark: boolean }) => props)`
  position: relative;
  width: 4.5rem;
  height: 2rem;
  background-color: ${(props) => (props.$isDark ? "hsla(200, 100%, 50%, 1)" : "hsla(0, 0%, 55%, 1)")};
  border: 1px solid lightgray;
  border-radius: 10em;
  cursor: pointer;
  transform: scale(0.8);

  &:focus {
    outline: none;
  }

  & svg {
    color: ${(props) => (props.$isDark ? "hsla(0, 0%, 90%, 1)" : "hsla(45, 100%, 60%, 1)")};
    font-size: 1.5rem;
    left: ${(props) => (props.$isDark ? "3px" : "calc(100% - 1.75rem)")};
  }

  & svg,
  & ${Switch} {
    position: absolute;
    transition: left 0.3s linear;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default function DarkModeToggle({ isDarkMode, toggle }: IUseDarkModeOutput): JSX.Element {
  return (
    <Toggle onClick={toggle} $isDark={isDarkMode} aria-label="Toggle for Application Theme (Light or Dark mode)">
      <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
      <Switch $isDark={isDarkMode} />
    </Toggle>
  );
}
