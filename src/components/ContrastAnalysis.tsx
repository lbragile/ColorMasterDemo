import React, { useEffect, useState } from "react";
import { Button, Divider, Grid, Header, Icon, Label, Modal, Radio, Table } from "semantic-ui-react";
import ColorSelectorWidget from "./ColorSelectorWidget";
import CM, { extendPlugins } from "colormaster";
import { CopyBlock, dracula } from "react-code-blocks";
import A11yPlugin from "colormaster/plugins/accessibility";
import useDebounce from "../hooks/useDebounce";
import useIsMobile from "../hooks/useIsMobile";
import styled from "styled-components";
import { ContrastSample } from "../utils/codeSamples";
extendPlugins([A11yPlugin]);

const SampleOutput = styled.div.attrs((props: { background: string; color: string; size: "body" | "large" }) => props)`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  border-radius: 4px;
  padding: 12px;
  font-size: ${(props) => (props.size === "large" ? "1.2rem" : "1rem")};
  font-weight: ${(props) => (props.size === "large" ? "bold" : "normal")};
  border: 1px solid hsla(0, 0%, 95%, 1);
  text-align: left;

  & li {
    padding: 4px 0;
  }
`;

export default function ContrastAnalysis(): JSX.Element {
  const [fgColor, setFgColor] = useState(CM("hsla(0, 100%, 50%, 1)"));
  const [bgColor, setBgColor] = useState(CM("hsla(180, 100%, 50%, 1)"));
  const [contrast, setContrast] = useState("1:1");
  const [readableOn, setReadableOn] = useState(new Array(4).fill(false));
  const [isLarge, setIsLarge] = useState(false);
  const [open, setOpen] = useState(false);

  const fgDebounce = useDebounce(fgColor, 100);
  const bgDebounce = useDebounce(bgColor, 100);
  const contrastDebounce = useDebounce(contrast, 100);
  const readableOnDebounce = useDebounce(readableOn, 100);

  const isMobile = useIsMobile();

  useEffect(() => {
    setContrast(fgColor.contrast({ bgColor: bgColor, ratio: true, precision: 3 }) as string);
    setReadableOn([
      fgColor.readableOn({ bgColor: bgColor, ratio: "minimum", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "enhanced", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "minimum", size: "large" }),
      fgColor.readableOn({ bgColor: bgColor, ratio: "enhanced", size: "large" })
    ]);
  }, [fgColor, bgColor]);

  return (
    <Grid columns={3} verticalAlign="top" stackable centered>
      <Grid.Row>
        <Grid.Column width={6}>
          <ColorSelectorWidget color={fgColor} setColor={setFgColor}>
            <Label size="big" color="black" attached="top left">
              {isMobile ? "FG" : "Foreground (FG)"}
            </Label>
          </ColorSelectorWidget>
        </Grid.Column>

        <Grid.Column width={3} textAlign="center">
          <Header as="h2">
            Sample Output
            <Divider hidden />
            <Header.Subheader>
              <Grid centered>
                <Grid.Row columns={2}>
                  <Grid.Column width={4}>
                    <Radio label="Body" name="radioGroup" checked={!isLarge} onChange={() => setIsLarge(!isLarge)} />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Radio label="Large" name="radioGroup" checked={isLarge} onChange={() => setIsLarge(!isLarge)} />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <SampleOutput
                    background={bgDebounce.stringRGB()}
                    color={fgDebounce.stringRGB()}
                    size={isLarge ? "large" : "body"}
                  >
                    <li>The quick brown fox jumps over the lazy dog.</li>
                    <li>The five boxing wizards jump quickly.</li>
                  </SampleOutput>
                </Grid.Row>
              </Grid>
            </Header.Subheader>
          </Header>

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
            <Divider hidden />
            <Header.Subheader>
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
            </Header.Subheader>
          </Header>

          <Divider hidden />

          <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
              <Button circular primary>
                Code
              </Button>
            }
          >
            <Modal.Content>
              <Modal.Description>
                <CopyBlock
                  text={ContrastSample(fgDebounce, bgDebounce, contrastDebounce, readableOnDebounce)}
                  language="typescript"
                  theme={dracula}
                  wrapLines={true}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>

        <Grid.Column width={6}>
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
