import React from "react";
import styled from "styled-components";
import { FlexRow } from "../styles/Flex";
import SocialMedia from "./SocialMedia";

const Wrapper = styled.footer`
  margin: 16px 0;
`;

const CopyrightText = styled.span`
  text-align: center;
  width: 70%;
`;

export default function Footer(): JSX.Element {
  return (
    <Wrapper>
      <FlexRow $wrap="wrap" $gap="12px">
        <CopyrightText>
          <b>{`Site Design & Development © ${new Date().getFullYear()} Lior Bragilevsky, et al.`}</b>
        </CopyrightText>
        <SocialMedia />
      </FlexRow>
    </Wrapper>
  );
}
