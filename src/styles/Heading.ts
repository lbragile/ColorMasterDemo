import styled from "styled-components";

export const Heading = styled.p.attrs(
  (props: { $color?: string; $size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) => props
)`
  color: ${(props) => props.$color ?? "black"};
  text-align: center;
  margin: 0;
  font-weight: bold;
  font-size: ${(props) =>
    props.$size === "h1"
      ? "2em"
      : props.$size === "h2"
      ? "1.5em"
      : props.$size === "h3"
      ? "1.17em"
      : props.$size === "h4"
      ? "1em"
      : props.$size === "h5"
      ? "0.83em"
      : "0.67em"};
`;
