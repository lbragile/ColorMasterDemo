import React, { useEffect, useState } from "react";
import { Button, Divider, Dropdown, Grid, Modal } from "semantic-ui-react";
import ColorSelectorWidget from "./ColorSelectorWidget";
import { CopyBlock, dracula } from "react-code-blocks";
import useDebounce from "../hooks/useDebounce";
import CM, { extendPlugins } from "colormaster";
import HarmonyPlugin from "colormaster/plugins/harmony";
import { THarmony, TMonoEffect } from "colormaster/types";
import { Swatch } from "../styles/Swatch";

extendPlugins([HarmonyPlugin]);

const typeOptions = [
  "analogous",
  "complementary",
  "split-complementary",
  "double-split-complementary",
  "triad",
  "rectangle",
  "square",
  "monochromatic"
].map((value) => ({ key: value, text: value, value }));

const effectOptions = ["shades", "tints", "tones"].map((value) => ({ key: value, text: value, value }));

export default function HarmonyAnalysis(): JSX.Element {
  const [color, setColor] = useState(CM("hsla(0, 100%, 50%, 1)"));
  const [harmony, setHarmony] = useState(color.harmony().map((c) => c.stringHSL()));
  const [type, setType] = useState<THarmony>("analogous");
  const [effect, setEffect] = useState<TMonoEffect>("shades");
  const [amount, setAmount] = useState(7);

  const [open, setOpen] = useState(false);

  const colorDebounce = useDebounce(color, 100);

  useEffect(() => {
    console.log(type, effect, amount);
    setHarmony(colorDebounce.harmony({ type, effect, amount }).map((c) => c.stringHSL()));
  }, [colorDebounce, type, effect, amount]);

  return (
    <Grid columns={3} verticalAlign="middle" stackable centered>
      <Grid.Row>
        <Grid.Column width={6}>
          <ColorSelectorWidget color={color} setColor={setColor} />
        </Grid.Column>

        <Grid.Column width={10} textAlign="center">
          <Dropdown
            selection
            options={typeOptions}
            value={type}
            onChange={(e, { value }) => setType(value as THarmony)}
          />
          {type === "monochromatic" && (
            <>
              <Dropdown
                selection
                options={effectOptions}
                value={effect}
                onChange={(e, { value }) => setEffect(value as TMonoEffect)}
              />
              <input type="range" min="3" max="10" value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)} />
            </>
          )}

          {harmony.map((swatch) => (
            <Swatch
              key={swatch}
              title={swatch}
              radius={50}
              borderRadius="4px"
              display="inline-block"
              background={swatch}
              onClick={() => setColor(CM(swatch))}
            />
          ))}

          <Divider hidden />

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
                <CopyBlock text={"temp"} language="typescript" theme={dracula} wrapLines={true} />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
