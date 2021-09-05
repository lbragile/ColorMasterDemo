import React, { useEffect, useState } from "react";
import { Divider, Grid, Header, Icon, Label, Radio, Table } from "semantic-ui-react";
import ColorSelectorWidget from "../ColorSelectorWidget";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import useDebounce from "../../hooks/useDebounce";
import useIsMobile from "../../hooks/useIsMobile";
import styled from "styled-components";
import { ContrastSample } from "../../utils/codeSamples";
import CodeModal from "./CodeModal";
import { useHistory } from "react-router";

extendPlugins([A11yPlugin]);

const SampleOutput = styled.div.attrs((props: { background: string; color: string; size: "body" | "large" }) => props)`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  border-radius: 4px;
  padding: 12px;
  font-size: ${(props) => (props.size === "large" ? "14pt" : "1rem")};
  font-weight: ${(props) => (props.size === "large" ? "bold" : "normal")};
  border: 1px solid hsla(0, 0%, 90%, 1);
  text-align: left;
  line-height: 2rem;
`;

export default function ContrastAnalysis(): JSX.Element {
  const [fgColor, setFgColor] = useState(CM("hsla(60, 100%, 50%, 1)"));
  const [bgColor, setBgColor] = useState(CM("hsla(0, 0%, 50%, 1)"));
  const [contrast, setContrast] = useState("1:1");
  const [readableOn, setReadableOn] = useState(new Array(4).fill(false));
  const [isLarge, setIsLarge] = useState(false);

  const fgDebounce = useDebounce(fgColor, 100);
  const bgDebounce = useDebounce(bgColor, 100);
  const contrastDebounce = useDebounce(contrast, 100);
  const readableOnDebounce = useDebounce(readableOn, 100);

  const isMobile = useIsMobile();
  const history = useHistory();

  useEffect(() => {
    setContrast(fgColor.contrast({ bgColor: bgColor, ratio: true, precision: 3 }) as string);
    setReadableOn([
      fgColor.readableOn({ bgColor: bgColor, ratio: "minimum", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "enhanced", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "minimum", size: "large" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "enhanced", size: "large" })
    ]);
  }, [fgColor, bgColor]);

  useEffect(() => {
    history.replace({
      pathname: "/contrast",
      search: `?fgColor=${fgDebounce.stringHEX().toLowerCase()}&bgColor=${bgDebounce
        .stringHEX()
        .toLowerCase()}&size=${isLarge}`
    });
  }, [history, fgDebounce, bgDebounce, isLarge]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Row>
        <Grid.Column width={5}>
          <ColorSelectorWidget color={fgColor} setColor={setFgColor}>
            <Label size="big" color="black" attached="top left">
              {isMobile ? "FG" : "Foreground (FG)"}
            </Label>
          </ColorSelectorWidget>
        </Grid.Column>

        <Grid.Column width={6} textAlign="center">
          <Header as="h2">Sample Output</Header>
          <Grid centered>
            <Grid.Row columns={2}>
              <Grid.Column width={4} textAlign="center">
                <Radio label="Body" name="radioGroup" checked={!isLarge} onChange={() => setIsLarge(!isLarge)} />
              </Grid.Column>
              <Grid.Column width={4} textAlign="center">
                <Radio label="Large" name="radioGroup" checked={isLarge} onChange={() => setIsLarge(!isLarge)} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <SampleOutput
                background={bgDebounce.stringRGB()}
                color={fgDebounce.stringRGB()}
                size={isLarge ? "large" : "body"}
              >
                The quick brown fox jumps over the lazy dog.
              </SampleOutput>
            </Grid.Row>
          </Grid>

          <Divider hidden />

          <Header as="h2" textAlign="center">
            Contrast
            <Header.Subheader>
              <b>{contrast}</b>
            </Header.Subheader>
          </Header>

          <Divider hidden />

          <Header as="h2" textAlign="center">
            ReadableOn
          </Header>
          <Table definition celled textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Minimum (AA)</Table.HeaderCell>
                <Table.HeaderCell>Enhanced (AAA)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Body</Table.Cell>
                <Table.Cell positive={readableOn[0]} negative={!readableOn[0]}>
                  <Icon name={readableOn[0] ? "checkmark" : "x"} /> 4.5:1
                </Table.Cell>
                <Table.Cell positive={readableOn[1]} negative={!readableOn[1]}>
                  <Icon name={readableOn[1] ? "checkmark" : "x"} />
                  7.0:1
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Large</Table.Cell>
                <Table.Cell positive={readableOn[2]} negative={!readableOn[2]}>
                  <Icon name={readableOn[2] ? "checkmark" : "x"} />
                  3.0:1
                </Table.Cell>

                <Table.Cell positive={readableOn[3]} negative={!readableOn[3]}>
                  <Icon name={readableOn[3] ? "checkmark" : "x"} /> 4.5:1
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Divider hidden />

          <CodeModal code={ContrastSample(fgDebounce, bgDebounce, contrastDebounce, readableOnDebounce)} />
        </Grid.Column>

        <Grid.Column width={5}>
          <ColorSelectorWidget color={bgColor} setColor={setBgColor}>
            <Label size="big" color="black" attached="top right">
              {isMobile ? "BG" : "Background (BG)"}
            </Label>
          </ColorSelectorWidget>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
