import React, { useContext, useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import MixPlugin from "colormaster/plugins/mix";
import CodeModal from "../components/CodeModal";
import ColorIndicator from "../components/ColorIndicator";
import ColorSelectorWidget from "../components/ColorSelectorWidget";
import Spacers from "../components/Spacers";
import useDebounce from "../hooks/useDebounce";
import { Swatch } from "../styles/Swatch";
import { MixSample } from "../utils/codeSamples";
import { FlexColumn, FlexRow } from "../styles/Flex";
import { Label } from "../styles/Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals, faInfoCircle, faPalette, faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../components/Dropdown";
import { Tooltip } from "../styles/Tooltip";
import styled from "styled-components";
import A11yPlugin from "colormaster/plugins/accessibility";
import NumberInput from "../components/Sliders/NumberInput";
import { BreakpointsContext } from "../components/App";
import { FadeIn } from "../styles/Fade";
import useLocalStorage from "../hooks/useLocalStorage";
import { TSetState } from "../types/react";
import { TValidColorspace } from "../types/colormaster";
import { InformationIcon } from "../styles/Icons";

extendPlugins([MixPlugin, A11yPlugin]);

const colorspaceOpts = ["rgb", "hex", "hsl", "hsv", "hwb", "lab", "lch", "luv", "uvw", "ryb", "cmyk", "xyz"];

const MixtureSwatch = styled(Swatch).attrs((props: { $isLight: boolean }) => props)`
  position: relative;
  flex-shrink: 0;

  & span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    max-width: 100%;
    font-weight: normal;
    color: ${(props) => (props.$isLight ? "black" : "white")};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;

    & input {
      background-color: transparent;
      color: ${(props) => (props.$isLight ? "black" : "white")};
      border: 1px solid ${(props) => (props.$isLight ? "black" : "white")};
      width: 6ch;
      font-size: 1.3rem;
      text-align: right;
    }

    & button {
      width: 16px;
      background: ${(props) => (props.$isLight ? "black" : "white")};

      &:hover {
        background: ${(props) => (props.$isLight ? "hsla(0, 0%, 0%, 0.6)" : "hsla(0, 0%, 100%, 0.6)")};
      }

      & svg {
        transform: scale(0.8);
        color: ${(props) => (props.$isLight ? "white" : "black")};
      }
    }

    &::after {
      content: "%";
      padding-left: 2px;
    }
  }
`;

export default function Mix(): JSX.Element {
  const { isMobile, isTablet, isLaptop, isComputer, isWideScreen } = useContext(BreakpointsContext);

  const [primary, setPrimary] = useLocalStorage("leftWidget", CM("hsla(180, 100%, 50%, 1)"));
  const [secondary, setSecondary] = useLocalStorage("rightWidget", CM("hsla(0, 100%, 50%, 1)"));
  const [ratio, setRatio] = useLocalStorage("mixRatio", 0.5);
  const [colorspace, setColorspace] = useLocalStorage<TValidColorspace>("mixColorspace", "luv");
  const [alpha, setAlpha] = useState(true);

  const [mix, setMix] = useState(primary.mix({ color: secondary, ratio, colorspace }).stringHSL({ alpha }));

  const primaryDebounce = useDebounce(primary, 100);
  const secondaryDebounce = useDebounce(secondary, 100);
  const ratioDebounce = useDebounce(ratio, 100);

  useEffect(() => {
    setMix(primary.mix({ color: secondary, ratio, colorspace }).stringHSL({ alpha }));
  }, [primary, secondary, ratio, colorspace, alpha]);

  return (
    <FadeIn $wrap="wrap" $gap="20px">
      <ColorSelectorWidget color={primary} setColor={setPrimary} initPicker="sketch">
        <Label $where="left">{isMobile ? "1st" : "Primary"}</Label>
      </ColorSelectorWidget>

      <FlexColumn
        $cols={isMobile ? 24 : isTablet || isLaptop ? 12 : isWideScreen ? 6 : 10}
        $gap="20px"
        $order={isComputer ? 1 : 0}
      >
        <ColorIndicator color={mix} alpha={alpha} setAlpha={setAlpha} dir="column" />

        <FlexRow $gap="12px" $wrap="wrap">
          <MixtureSwatch
            title={primary.stringHSL()}
            $radius={60}
            $borderRadius="4px"
            display="inline-block"
            position="relative"
            background={primary.stringHSL()}
            tabIndex={0}
            $cursor="help"
            $isLight={primary.isLight()}
          >
            <span>
              <NumberInput
                min="0"
                max="100"
                value={(1 - ratio) * 100}
                onChange={(e) =>
                  setRatio(Math.max(0, Math.min(Number.isNaN(+e.target.value) ? 0 : 100 - +e.target.value, 100)) / 100)
                }
              />
            </span>
          </MixtureSwatch>

          <FontAwesomeIcon icon={faPlus} />

          <MixtureSwatch
            title={secondary.stringHSL()}
            $radius={60}
            $borderRadius="4px"
            display="inline-block"
            position="relative"
            background={secondary.stringHSL()}
            tabIndex={0}
            $cursor="help"
            $isLight={secondary.isLight()}
          >
            <span>{(ratio * 100).toFixed(0)}</span>
          </MixtureSwatch>

          <FontAwesomeIcon icon={faEquals} />

          <MixtureSwatch
            title={mix}
            $radius={60}
            $borderRadius="4px"
            display="inline-block"
            position="relative"
            background={mix}
            tabIndex={0}
            $cursor="help"
          />
        </FlexRow>

        <FlexRow>
          <Dropdown
            opts={colorspaceOpts}
            value={colorspace}
            setValue={setColorspace as TSetState<string>}
            icon={<FontAwesomeIcon icon={faPalette} />}
            iconPos="left"
            switcherPos="left"
            cols={isMobile || isTablet ? 8 : 6}
          />

          <Spacers width="4px" />

          <Tooltip>
            <span>The two colors will be converted to this color space when mixing</span>
            <InformationIcon icon={faInfoCircle} />
          </Tooltip>
        </FlexRow>

        <CodeModal code={MixSample(primaryDebounce, secondaryDebounce, ratioDebounce, colorspace, alpha)} />
      </FlexColumn>

      <ColorSelectorWidget color={secondary} setColor={setSecondary} initPicker="sketch">
        <Label $where="right">{isMobile ? "2nd" : "Secondary"}</Label>
      </ColorSelectorWidget>
    </FadeIn>
  );
}
