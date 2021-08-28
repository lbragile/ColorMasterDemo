import styled from "styled-components";

export const Swatch = styled.div.attrs(
  (props: { radius: number; background: string; units?: string; borderColor: string; borderRadius?: string }) => ({
    ...props,
    style: { background: props.background } // this changes a lot
  })
)`
  width: ${(props) => props.radius * 2 + (props.units ?? "px")};
  height: ${(props) => props.radius * 2 + (props.units ?? "px")};
  border-radius: ${(props) => props.borderRadius ?? "50%"};
  border: ${(props) => props.borderColor ?? "hsla(0, 0%, 95%, 1)"} 1px solid;
  margin: 10px auto;
`;
