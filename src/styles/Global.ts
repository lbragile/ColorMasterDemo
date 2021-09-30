import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    background-color: ${(props) => props.theme.bgDefault};
    color: ${(props) => props.theme.text};
    transition: background-color 0.5s ease-in-out;
  }
`;
