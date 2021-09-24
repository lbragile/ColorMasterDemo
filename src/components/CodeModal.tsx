import React, { useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyBlock, dracula } from "react-code-blocks";
import styled from "styled-components";

const PrimaryButton = styled.button`
  padding: 8px 24px;
  border-radius: 10em;
  background-color: ${(props) => props.theme.colors.primaryBtn};
  border: none;
  color: white;
  font-weight: bolder;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryBtnHover};
  }
`;

const Modal = styled.div.attrs((props: { $open: boolean }) => props)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: ${(props) => (props.$open ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  overflow: none;
  z-index: 10;
`;

const Content = styled.div`
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 100%;

  & div {
    border-radius: 8px;

    & button {
      cursor: pointer;
    }
  }
`;

const CloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  position: absolute;
  top: -30px;
  right: -30px;
`;

export default function CodeModal({ code }: { code: string }): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <PrimaryButton onClick={() => setOpen(true)}>Code</PrimaryButton>

      <Modal $open={open}>
        <Content>
          <CopyBlock text={code} theme={dracula} language="typescript" wrapLines />
          <CloseIcon icon={faTimes} onClick={() => setOpen(false)} color="white" size="2x" />
        </Content>
      </Modal>
    </React.Fragment>
  );
}
