import React from "react";
import styled from "styled-components";

const CopyrightText = styled.span`
  text-align: center;
  max-width: 75%;
  margin: 16px auto 0 auto;
  font-weight: bold;
`;

export default function Footer(): JSX.Element {
  return (
    <CopyrightText>{`Site Design & Development © ${new Date().getFullYear()} Lior Bragilevsky, et al.`}</CopyrightText>
  );
}
