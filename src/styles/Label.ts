import styled from "styled-components";

export const Label = styled.label.attrs(
  (props: { $where: "left" | "right"; $bgColor?: string; $color?: string }) => props
)`
  position: absolute;
  top: 0;
  left: ${(props) => (props.$where === "left" ? "0" : "")};
  right: ${(props) => (props.$where === "right" ? "0" : "")};
  border-radius: ${(props) => (props.$where === "left" ? "4px 0 4px 0" : "0 4px 0 4px")};
  background-color: ${(props) => props.$bgColor ?? "black"};
  color: ${(props) => props.$color ?? "white"};
  padding: 8px;
  font-weight: bold;
  font-size: 1.5rem;
`;
