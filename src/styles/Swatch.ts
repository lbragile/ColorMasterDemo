import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const Swatch = styled.div.attrs(
  (props: {
    background: string;
    position?: string;
    display?: string;
    $radius: number;
    $borderColor: string;
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
  border: ${(props) => props.$borderColor ?? "hsla(0, 0%, 90%, 1)"} 1px solid;
  cursor: ${(props) => props.$cursor};
`;

export const CurrentColorIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const SwatchCounter = styled.div`
  && {
    border-radius: 2px 0;
    color: black;
    position: absolute;
    top: 1px;
    left: 1px;
    padding: 4px 8px;
    background-color: hsla(0, 0%, 90%);
    color: black;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
