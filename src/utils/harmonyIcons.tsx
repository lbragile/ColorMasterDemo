import React from "react";
import styled from "styled-components";
import { THarmony } from "colormaster/types";

const StyledSVG = styled.svg`
  transform: scale(0.5);
`;

const RadialStop = styled.stop.attrs((props: { stopColor: string }) => props)`
  stop-color: ${(props) => props.stopColor};
  stop-opacity: 1;
`;

export const HarmonyIcons: Record<THarmony, JSX.Element> = {
  analogous: (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="50" x2="4" y2="7" />
        <line x1="25" y1="50" x2="25" y2="4" />
        <line x1="25" y1="50" x2="46" y2="7" />
        <circle cx="25" cy="4" r="3" />
        <circle cx="4" cy="7" r="3" />
        <circle cx="46" cy="7" r="3" />
      </g>
    </StyledSVG>
  ),
  complementary: (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="2" x2="25" y2="48" />
        <circle cx="25" cy="46" r="3" />
        <circle cx="25" cy="4" r="3" />
      </g>
    </StyledSVG>
  ),
  "split-complementary": (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="25" x2="15" y2="43" />
        <line x1="25" y1="25" x2="25" y2="0" />
        <line x1="25" y1="25" x2="35" y2="43" />
        <circle cx="25" cy="4" r="3" />
        <circle cx="15" cy="43" r="3" />
        <circle cx="35" cy="43" r="3" />
      </g>
    </StyledSVG>
  ),
  "double-split-complementary": (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="25" x2="10" y2="7" />
        <line x1="25" y1="25" x2="40" y2="7" />
        <line x1="25" y1="25" x2="10" y2="43" />
        <line x1="25" y1="25" x2="25" y2="0" />
        <line x1="25" y1="25" x2="40" y2="43" />
        <circle cx="10" cy="7" r="3" />
        <circle cx="40" cy="7" r="3" />
        <circle cx="25" cy="4" r="3" />
        <circle cx="10" cy="43" r="3" />
        <circle cx="40" cy="43" r="3" />
      </g>
    </StyledSVG>
  ),
  triad: (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="25" x2="4" y2="43" />
        <line x1="25" y1="25" x2="25" y2="0" />
        <line x1="25" y1="25" x2="46" y2="43" />
        <circle cx="25" cy="4" r="3" />
        <circle cx="4" cy="43" r="3" />
        <circle cx="46" cy="43" r="3" />
      </g>
    </StyledSVG>
  ),
  rectangle: (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="25" x2="15" y2="7" />
        <line x1="25" y1="25" x2="35" y2="7" />
        <line x1="25" y1="25" x2="15" y2="43" />
        <line x1="25" y1="25" x2="35" y2="43" />
        <circle cx="15" cy="7" r="3" />
        <circle cx="35" cy="7" r="3" />
        <circle cx="15" cy="43" r="3" />
        <circle cx="35" cy="43" r="3" />
      </g>
    </StyledSVG>
  ),
  square: (
    <StyledSVG height="50" width="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="1" fill="black">
        <line x1="25" y1="25" x2="0" y2="25" />
        <line x1="25" y1="25" x2="25" y2="0" />
        <line x1="25" y1="25" x2="50" y2="25" />
        <line x1="25" y1="25" x2="25" y2="50" />
        <circle cx="4" cy="25" r="3" />
        <circle cx="25" cy="4" r="3" />
        <circle cx="46" cy="25" r="3" />
        <circle cx="25" cy="46" r="3" />
      </g>
    </StyledSVG>
  ),
  monochromatic: (
    <StyledSVG width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.74073 46.3244L35.3465 2.18543C36.1685 1.10575 37.8061 1.14211 38.5592 2.27091C45.075 12.0364 47.8625 19.1993 50.6231 31.7056C50.8416 32.6952 50.2773 33.6916 49.3179 34.0177L3.97525 49.429C3.01676 49.7548 1.96602 49.3129 1.52849 48.4C1.20409 47.7231 1.28605 46.9216 1.74073 46.3244Z"
        fill="url(#mono_radial)"
      />
      <defs>
        <radialGradient
          id="mono_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0.999996 48.9865) rotate(-36.1395) scale(56.1389 81.7885)"
        >
          <RadialStop stopColor="hsla(0, 0%, 40%, 1)" />
          <RadialStop offset="0.1875" stopColor="hsla(0, 0%, 40%, 1)" />
          <RadialStop offset="0.1875" stopColor="hsla(0, 0%, 50%, 1)" />
          <RadialStop offset="0.375" stopColor="hsla(0, 0%, 50%, 1)" />
          <RadialStop offset="0.375" stopColor="hsla(0, 0%, 60%, 1)" />
          <RadialStop offset="0.5625" stopColor="hsla(0, 0%, 60%, 1)" />
          <RadialStop offset="0.5625" stopColor="hsla(0, 0%, 70%, 1)" />
          <RadialStop offset="0.75" stopColor="hsla(0, 0%, 70%, 1)" />
          <RadialStop offset="0.75" stopColor="hsla(0, 0%, 80%, 1)" />
          <RadialStop offset="0.9375" stopColor="hsla(0, 0%, 80%, 1)" />
          <RadialStop offset="0.9375" stopColor="transparent" />
          <RadialStop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
    </StyledSVG>
  )
};
