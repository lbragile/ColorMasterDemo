import React from "react";
import styled from "styled-components";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import { FlexRow } from "../styles/Flex";
import Checkbox from "./Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import useCopyToClipboard from "../hooks/useCopytoClipboard";
import { Tooltip } from "../styles/Tooltip";
import { Heading } from "../styles/Heading";
import { TSetState } from "../types/react";

extendPlugins([NamePlugin]);

const StyledColorDisplay = styled.input`
  height: 36px;
  padding: 0 10px;
  border-radius: 4px 0 0 4px;
  text-align: center;
  border: 1px solid ${(props) => props.theme.borderLight};
  background-color: ${(props) => props.theme.bgDefault};
  color: ${(props) => props.theme.text};
  border-right: none;
  outline: none;
  line-height: 1.8em;
`;

const CopyButton = styled.button.attrs((props: { $copied: string | null }) => props)`
  height: 36px;
  padding: 0 10px;
  background: ${(props) => (props.$copied ? props.theme.success : props.theme.info)};
  border: 1px solid ${(props) => props.theme.borderLight};
  color: ${(props) => props.theme.bgDefault};
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

const RowOrCol = styled(FlexRow).attrs((props: { $dir?: "row" | "column" }) => props)`
  flex-direction: ${(props) => props.$dir ?? "row"};
`;

interface IColorIndicator {
  color: string;
  alpha: boolean;
  setAlpha: TSetState<boolean>;
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

  return (
    <>
      {showName && <Heading $size="h2">{CM(color).name({ exact: false })}</Heading>}

      <RowOrCol $gap="12px" $wrap="wrap" $dir={dir}>
        <span>
          <StyledColorDisplay
            type="text"
            value={color}
            spellCheck={false}
            readOnly
            aria-label="Color Indicator Display"
          />
          <Tooltip $copied={!!copy}>
            <span>Copy to clipboard</span>
            <CopyButton
              $copied={copy}
              onClick={() => setCopy(color)}
              onBlur={() => setCopy("")}
              aria-label="Copy to Clipboard"
            >
              <FontAwesomeIcon icon={copy ? faCheckCircle : faCopy} />
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
