import React from "react";
import styled from "styled-components";

// Based on https://loading.io/css/

const Loader = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;

  & div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }

  & div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: black;
    margin: -4px 0 0 -4px;
  }

  & div:nth-child(1) {
    animation-delay: -0.036s;
  }

  & div:nth-child(1):after {
    top: 63px;
    left: 63px;
    background-color: hsla(0, 100%, 40%, 1);
  }

  & div:nth-child(2) {
    animation-delay: -0.072s;
  }

  & div:nth-child(2):after {
    top: 68px;
    left: 56px;
    background-color: hsla(45, 100%, 40%, 1);
  }

  & div:nth-child(3) {
    animation-delay: -0.108s;
  }

  & div:nth-child(3):after {
    top: 71px;
    left: 48px;
    background-color: hsla(90, 100%, 40%, 1);
  }

  & div:nth-child(4) {
    animation-delay: -0.144s;
  }

  & div:nth-child(4):after {
    top: 72px;
    left: 40px;
    background-color: hsla(135, 100%, 40%, 1);
  }

  & div:nth-child(5) {
    animation-delay: -0.18s;
  }

  & div:nth-child(5):after {
    top: 71px;
    left: 32px;
    background-color: hsla(180, 100%, 40%, 1);
  }

  & div:nth-child(6) {
    animation-delay: -0.216s;
  }

  & div:nth-child(6):after {
    top: 68px;
    left: 24px;
    background-color: hsla(225, 100%, 40%, 1);
  }

  & div:nth-child(7) {
    animation-delay: -0.252s;
  }

  & div:nth-child(7):after {
    top: 63px;
    left: 17px;
    background-color: hsla(270, 100%, 40%, 1);
  }

  & div:nth-child(8) {
    animation-delay: -0.288s;
  }

  & div:nth-child(8):after {
    top: 56px;
    left: 12px;
    background-color: hsla(315, 100%, 40%, 1);
  }

  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function Loading(): JSX.Element {
  return (
    <Loader>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </Loader>
  );
}
