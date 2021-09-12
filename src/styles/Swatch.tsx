import { Icon, Label } from "semantic-ui-react";
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
  display: ${(props) => props.display ?? "block"};
  margin: auto ${(props) => (props.display ? "2px" : "auto")};
  position: ${(props) => props.position ?? ""};
  cursor: ${(props) => props.$cursor};
`;

export const CurrentColorIcon = styled(Icon)`
  && {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const SwatchCounter = styled(Label)`
  && {
    border-radius: 2px 0;
    color: black;
    position: absolute;
    left: 0;
    top: -1px;
  }
`;
