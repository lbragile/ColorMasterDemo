import React from "react";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
// import useCopyToClipboard from "../hooks/useCopytoClipboard";
import Spacers from "./Spacers";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import { FlexRow } from "../styles/Flex";
import Checkbox from "./Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import useCopyToClipboard from "../hooks/useCopytoClipboard";
import { Tooltip } from "../styles/Tooltip";

extendPlugins([NamePlugin]);

const StyledColorDisplay = styled.input.attrs(
  (props: { $mobile: boolean; action: { color: string; [key: string]: unknown } }) => props
)`
  height: 36px;
  padding: 0 10px;
  border-radius: 4px 0 0 4px;
  text-align: center;
  border: 1px solid hsla(0, 0%, 80%, 1);
  outline: none;
`;

const CopyButton = styled.button.attrs((props: { $copied: string | null }) => props)`
  height: 36px;
  padding: 0 10px;
  background: ${(props) => `hsl(${props.$copied ? 120 : 180}, 100%, 40%)`};
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

export const Heading = styled.h3.attrs((props: { $color?: string }) => props)`
  color: ${(props) => props.color ?? "black"};
  text-align: center;
  margin: 0;
`;

interface IColorIndicator {
  color: string;
  alpha: boolean;
  setAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  showName?: boolean;
}

export default function ColorIndicator({ color, alpha, setAlpha, showName = true }: IColorIndicator): JSX.Element {
  const [copy, setCopy] = useCopyToClipboard();
  const { isMobile } = useBreakpointMap();

  return (
    <>
      {showName && <Heading $color="grey">{CM(color).name({ exact: false })}</Heading>}

      <FlexRow>
        <StyledColorDisplay type="text" value={color} spellCheck={false} readOnly $mobile={isMobile} />
        <Tooltip $copied={!!copy}>
          <span>Copy to clipboard</span>
          <CopyButton $copied={copy} onClick={() => setCopy(color)} onBlur={() => setCopy("")}>
            <FontAwesomeIcon icon={copy ? faCheckCircle : faCopy} color="white" />
          </CopyButton>
        </Tooltip>

        <Spacers width="8px" />

        <Checkbox value={alpha} setValue={setAlpha} label="Alpha" />
      </FlexRow>
    </>
  );
}
