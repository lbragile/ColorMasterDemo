import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const Swatch = styled.div.attrs(
  (props: {
    background: string;
    position?: string;
    display?: string;
    $radius: number;
    $units?: string;
    $borderRadius?: string;
    $cursor?: string;
  }) => ({
    ...props,
    style: { background: props.background } // this changes a lot
  })
)`
  width: ${(props) => props.$radius * 2 + (props.$units ?? "px")};
  height: ${(props) => props.$radius * 2 + (props.$units ?? "px")};
  border-radius: ${(props) => props.$borderRadius ?? "50%"};
  border: 1px solid ${(props) => props.theme.colors.borderLight};
  cursor: ${(props) => props.$cursor};
`;

export const CurrentColorIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const SwatchCounter = styled.div.attrs((props: { $top: string; $left: string; $isLight: boolean }) => props)`
  border-radius: 2px 0;
  color: black;
  position: absolute;
  top: ${(props) => props.$top ?? "0px"};
  left: ${(props) => props.$left ?? "0px"};
  padding: 4px 8px;
  background-color: ${(props) => (props.$isLight ? "hsla(0, 0%, 30%)" : "hsla(0, 0%, 90%)")};
  color: ${(props) => (props.$isLight ? "white" : "black")};
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;
