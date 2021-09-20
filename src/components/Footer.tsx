import React from "react";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
import { FlexRow } from "../styles/Flex";
import SocialMedia from "./SocialMedia";

const Wrapper = styled.div.attrs((props: { $smallScreen: boolean }) => props)`
  position: absolute;
  bottom: ${(props) => (props.$smallScreen ? "-100px" : "0")};
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px 0;
`;

export default function Footer(): JSX.Element {
  const { isMobile, isTablet } = useBreakpointMap();

  return (
    <Wrapper $smallScreen={isMobile || isTablet}>
      <FlexRow $wrap="wrap" $gap="12px">
        <span>
          <b>{`Site Design & Development © ${new Date().getFullYear()} Lior Bragilevsky, et al.`}</b>
        </span>
        <SocialMedia />
      </FlexRow>
    </Wrapper>
  );
}
