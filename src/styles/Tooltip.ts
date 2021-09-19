import styled from "styled-components";

export const Tooltip = styled.div.attrs((props: { $copied: boolean }) => props)`
  position: relative;
  display: inline-block;

  span {
    visibility: hidden;
    position: absolute;
    top: -90%;
    left: 50%;
    transform: translate(-50%, -5px);
    background: hsla(0, 0%, 10%, 1);
    color: white;
    white-space: nowrap;
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
      border-color: hsla(0, 0%, 10%, 1) transparent transparent transparent;
    }
  }

  &:hover span {
    visibility: ${(props) => (props.$copied ? "hidden" : "visible")};
    opacity: 1;
    top: -100%;
  }
`;
