import styled, { keyframes } from "styled-components";
import { FlexRow } from "./Flex";

const FadeInKeys = keyframes`
from {
  opacity: 0;
}

to {
  opacity: 1;
}
`;

export const FadeIn = styled(FlexRow)`
  animation: ${FadeInKeys} 0.5s ease-in-out;
`;
