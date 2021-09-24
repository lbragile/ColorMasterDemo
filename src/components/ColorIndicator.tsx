import React from "react";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import { FlexRow } from "../styles/Flex";
import Checkbox from "./Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import useCopyToClipboard from "../hooks/useCopytoClipboard";
import { Tooltip } from "../styles/Tooltip";
import { Heading } from "../styles/Heading";

extendPlugins([NamePlugin]);

const StyledColorDisplay = styled.input.attrs(
  (props: { $mobile: boolean; action: { color: string; [key: string]: unknown } }) => props
)`
  height: 36px;
  padding: 0 10px;
  border-radius: 4px 0 0 4px;
  text-align: center;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-right: none;
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

const RowOrCol = styled(FlexRow).attrs((props: { $dir?: "row" | "column" }) => props)`
  flex-direction: ${(props) => props.$dir ?? "row"};
`;

interface IColorIndicator {
  color: string;
  alpha: boolean;
  setAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  showName?: boolean;
  dir?: "row" | "column";
}

export default function ColorIndicator({
  color,
  alpha,
  setAlpha,
  showName = true,
  dir = "row"
}: IColorIndicator): JSX.Element {
  const [copy, setCopy] = useCopyToClipboard();
  const { isMobile } = useBreakpointMap();

  return (
    <>
      {showName && (
        <Heading $color="grey" $size="h2">
          {CM(color).name({ exact: false })}
        </Heading>
      )}

      <RowOrCol $gap="12px" $wrap="wrap" $dir={dir}>
        <span>
          <StyledColorDisplay type="text" value={color} spellCheck={false} readOnly $mobile={isMobile} />
          <Tooltip $copied={!!copy}>
            <span>Copy to clipboard</span>
            <CopyButton $copied={copy} onClick={() => setCopy(color)} onBlur={() => setCopy("")}>
              <FontAwesomeIcon icon={copy ? faCheckCircle : faCopy} color="white" />
            </CopyButton>
          </Tooltip>
        </span>

        <span>
          <Checkbox value={alpha} setValue={setAlpha} label="Alpha" />
        </span>
      </RowOrCol>
    </>
  );
}
