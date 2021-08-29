import React, { useEffect, useState } from "react";
import { Grid, Header, Label } from "semantic-ui-react";
import SliderGroupSelector from "./SliderGroupSelector";
import CM, { extendPlugins } from "colormaster";
import { CopyBlock, dracula } from "react-code-blocks";
import A11yPlugin from "colormaster/plugins/accessibility";
import useDebounce from "../hooks/useDebounce";
extendPlugins([A11yPlugin]);

export default function ContrastAnalysis(): JSX.Element {
  const [fgColor, setFgColor] = useState(CM("hsla(0, 100%, 50%, 1)"));
  const [bgColor, setBgColor] = useState(CM("hsla(180, 100%, 50%, 1)"));
  const [contrast, setContrast] = useState("1:1");
  const [readableOn, setReadableOn] = useState(false);

  const fgDebounce = useDebounce(fgColor, 100);
  const bgDebounce = useDebounce(bgColor, 100);
  const contrastDebounce = useDebounce(contrast, 100);
  const readableOnDebounce = useDebounce(readableOn, 100);

  useEffect(() => {
    setContrast(fgColor.contrast({ bgColor: bgColor, ratio: true, precision: 3 }) as string);
    setReadableOn(fgColor.readableOn({ bgColor: bgColor, ratio: "minimum", size: "body" }));
  }, [fgColor, bgColor]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Row>
        <Grid.Column width={6}>
          <SliderGroupSelector
            color={fgColor}
            setColor={setFgColor}
            label={
              <Label size="big" color="black" ribbon>
                Foreground (FG)
              </Label>
            }
          />
        </Grid.Column>

        <Grid.Column width={3}>
          <Header as="h2" textAlign="center">
            Contrast
            <Header.Subheader>
              <b>{contrast}</b>
            </Header.Subheader>
          </Header>

          <Header as="h2" textAlign="center">
            ReadableOn
            <Header.Subheader>
              <b>{readableOn.toString()}</b>
            </Header.Subheader>
          </Header>
        </Grid.Column>

        <Grid.Column width={6}>
          <SliderGroupSelector
            color={bgColor}
            setColor={setBgColor}
            label={
              <Label size="big" color="black" ribbon="right">
                Background (BG)
              </Label>
            }
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={15}>
          <CopyBlock
            text={`import CM, { extendPlugins } from 'colormaster';\nimport A11yPlugin from "colormaster/plugins/accessibility";\n\nextendPlugins([A11yPlugin]); // add ColorMaster's accessibility plugin\n\nconst fgColor = CM("${fgDebounce.stringRGB(
              {
                precision: [2, 2, 2, 2]
              }
            )}");\nconst bgColor = CM("${bgDebounce.stringRGB({
              precision: [2, 2, 2, 2]
            })}");\n\nconsole.log(fgColor.contrast({ bgColor, ratio: true, precision: 3 })); // ${contrastDebounce}\nconsole.log(fgColor.readableOn({ bgColor, ratio: "minimum", size: "body" })); // ${readableOnDebounce}`}
            language="typescript"
            theme={dracula}
            wrapLines={true}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
