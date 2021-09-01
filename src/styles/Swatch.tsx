import styled from "styled-components";

export const Swatch = styled.div.attrs(
  (props: {
    radius: number;
    background: string;
    units?: string;
    borderColor: string;
    borderRadius?: string;
    display?: string;
    position?: string;
  }) => ({
    ...props,
    style: { background: props.background } // this changes a lot
  })
)`
  width: ${(props) => props.radius * 2 + (props.units ?? "px")};
  height: ${(props) => props.radius * 2 + (props.units ?? "px")};
  border-radius: ${(props) => props.borderRadius ?? "50%"};
  border: ${(props) => props.borderColor ?? "hsla(0, 0%, 90%, 1)"} 1px solid;
  display: ${(props) => props.display ?? "block"};
  margin: 0 ${(props) => (props.display ? "2px" : "auto")};
  position: ${(props) => props.position ?? ""};
`;
