import React, { useCallback, useContext, useEffect, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyBlock, dracula } from "react-code-blocks";
import styled, { css } from "styled-components";
import { BreakpointsContext } from "./App";

const PrimaryButton = styled.button`
  padding: 8px 24px;
  border-radius: 10em;
  background-color: ${(props) => props.theme.primaryBtn};
  border: none;
  color: white;
  font-weight: bolder;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  outline: none;

  &:hover {
    background-color: ${(props) => props.theme.primaryBtnHover};
  }
`;

const Modal = styled.div.attrs((props: { $open: boolean }) => props)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.text.replace("1)", "0.7)")};
  display: ${(props) => (props.$open ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  overflow: none;
  z-index: 10;
`;

const ContentContainer = styled.div.attrs((props: { $responsive: boolean }) => props)`
  position: relative;
  ${(props) =>
    props.$responsive
      ? css`
          width: 80%;
          height: 80%;
        `
      : ""}
`;

const Content = styled.div`
  background-color: ${(props) => props.theme.textInverse};
  padding: 20px;
  border-radius: 8px;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;

  & div {
    border-radius: 8px;

    & button {
      cursor: pointer;
    }
  }
`;

const CloseIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.textInverse};
  cursor: pointer;
  position: absolute;
  top: -30px;
  right: -30px;
`;

export default function CodeModal({ code }: { code: string }): JSX.Element {
  const { isMobile, isTablet } = useContext(BreakpointsContext);

  const [show, setShow] = useState(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const handleEscape = useCallback((e) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  return (
    <React.Fragment>
      <PrimaryButton onClick={open}>Code</PrimaryButton>

      <Modal $open={show}>
        <ContentContainer $responsive={isMobile || isTablet}>
          <Content>
            <CopyBlock text={code} theme={dracula} language="typescript" wrapLines />
          </Content>
          <CloseIcon icon={faTimes} onClick={close} size="2x" />
        </ContentContainer>
      </Modal>
    </React.Fragment>
  );
}
