import React, { useMemo } from "react";
import { Popup, Icon, Grid, Checkbox, Input, Header } from "semantic-ui-react";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
import useCopyToClipboard from "../hooks/useCopytoClipboard";
import Spacers from "./Spacers";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([NamePlugin]);

const StyledColorDisplay = styled(Input).attrs(
  (props: { $mobile: boolean; action: { color: string; [key: string]: unknown } }) => props
)`
  && {
    & > input {
      text-align: center;
      font-size: ${(props) => (props.$mobile ? "0.95em" : "1em")};
      padding: 0;
    }

    & .button:hover,
    & .button:focus {
      background-color: ${(props) => (props.action.color === "teal" ? "rgba(0, 196, 196, 1)" : "rgba(0, 196, 0, 1)")};
    }
  }
`;

export default function ColorIndicator({
  color,
  alpha,
  setAlpha,
  showName = true
}: {
  color: string;
  alpha: boolean;
  setAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  showName?: boolean;
}): JSX.Element {
  const [copy, setCopy] = useCopyToClipboard();
  const { isMobile } = useBreakpointMap();

  const copyAction = useMemo(
    () =>
      function (text: string) {
        return {
          icon: (
            <Popup
              content="Copy to clipboard"
              position="top center"
              inverted
              trigger={<Icon name={copy ? "check circle" : "copy"} />}
            />
          ),
          color: copy ? "green" : "teal",
          onClick: () => setCopy(text),
          onBlur: () => setCopy("")
        };
      },
    [copy, setCopy]
  );

  return (
    <>
      {showName && (
        <>
          <Grid.Row>
            <Header as="h3" color="grey">
              {CM(color).name({ exact: false })}
            </Header>
          </Grid.Row>

          <Spacers height="6px" />
        </>
      )}

      <Grid.Row columns={2}>
        <Grid.Column tablet={16} computer={11} largeScreen={12}>
          <StyledColorDisplay
            type="text"
            value={color}
            spellCheck={false}
            size="large"
            readOnly
            fluid
            action={copyAction(color)}
            $mobile={isMobile}
          />
        </Grid.Column>

        <Spacers height="12px" />

        <Grid.Column tablet={16} computer={2}>
          <Checkbox label="Alpha" checked={alpha} onChange={() => setAlpha(!alpha)} />
        </Grid.Column>
      </Grid.Row>
    </>
  );
}
