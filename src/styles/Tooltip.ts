import styled from "styled-components";

export const Tooltip = styled.div.attrs((props: { $copied: boolean; $top?: number }) => props)`
  position: relative;
  display: inline-block;
  cursor: help;

  span {
    visibility: hidden;
    position: absolute;
    top: ${(props) => (props.$top ?? -45) + 5 + "px"};
    left: 50%;
    transform: translateX(-50%);
    background: ${(props) => props.theme.colors.text};
    color: ${(props) => props.theme.colors.textInverse};
    box-shadow: 0 0 2px 2px ${(props) => props.theme.colors.textInverse} inset;
    white-space: pre;
    line-height: 1.5;
    padding: 12px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out, top 0.3s ease-in-out;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: ${(props) => props.theme.colors.text} transparent transparent transparent;
    }
  }

  &:hover span {
    visibility: ${(props) => (props.$copied ? "hidden" : "visible")};
    opacity: 1;
    top: ${(props) => (props.$top ?? -45) + "px"};
  }
`;
