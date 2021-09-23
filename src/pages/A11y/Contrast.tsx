import React, { useEffect, useState } from "react";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import useDebounce from "../../hooks/useDebounce";
import styled from "styled-components";
import { ContrastSample } from "../../utils/codeSamples";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import CodeModal from "../../components/CodeModal";
import ColorSelectorWidget from "../../components/ColorSelectorWidget";
import Spacers from "../../components/Spacers";
import { FlexColumn, FlexRow } from "../../styles/Flex";
import { Label } from "../../styles/Label";
import Checkbox from "../../components/Checkbox";
import { Heading } from "../../styles/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCheckCircle, faCircle, faSquareFull, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../components/Dropdown";
import useBreakpointMap from "../../hooks/useBreakpointMap";

extendPlugins([A11yPlugin]);

const SampleOutput = styled.div.attrs(
  (props: { background: string; color: string; size: "body" | "large" | "image" }) => props
)`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  border-radius: 4px;
  padding: ${(props) => (props.size === "image" ? "12px 24px" : "12px")};
  font-size: ${(props) => (props.size === "large" ? "14pt" : "1rem")};
  font-weight: ${(props) => (props.size === "large" ? "bold" : "normal")};
  border: 1px solid hsla(0, 0%, 90%, 1);
  text-align: left;
  line-height: 2rem;
  margin-top: 12px;

  & svg {
    font-size: 3rem;
  }
`;

const StyledTable = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  font-size: 1.2rem;

  & *:not(svg) {
    border: 1px solid hsla(0, 0%, 80%, 1);
    padding: 20px;
  }

  & th {
    background: hsla(0, 0%, 95%, 1);

    &:empty {
      visibility: hidden;
    }
  }
`;

const TableCell = styled.td.attrs((props: { $positive?: boolean; $negative?: boolean }) => props)`
  position: relative;
  background: ${(props) =>
    props.$positive ? "hsla(120, 100%, 90%, 1)" : props.$negative ? "hsla(0, 100%, 90%, 1)" : "transparent"};
  color: ${(props) =>
    props.$positive ? "hsla(120, 100%, 25%, 1)" : props.$negative ? "hsla(0, 100%, 25%, 1)" : "black"};
  text-align: center;

  & svg {
    position: absolute;
    top: 2px;
    right: 2px;
  }
`;

const RadioInput = styled.span`
  display: inline-flex;
  align-items: center;

  & label {
    font-size: 1.2rem;
  }

  & * {
    cursor: pointer;
  }
`;

export default function Contrast(): JSX.Element {
  const history = useHistory();
  const query = useQuery();
  const { isMobile, isTablet, isLaptop, isComputer, isWideScreen } = useBreakpointMap();

  const [fgColor, setFgColor] = useState(CM(query.fgColor ?? "hsla(60, 100%, 50%, 1)"));
  const [bgColor, setBgColor] = useState(CM(query.bgColor ?? "hsla(240, 100%, 50%, 1)"));
  const [contrast, setContrast] = useState<number | string>("1:1");
  const [readableOn, setReadableOn] = useState(new Array(4).fill(false));
  const [isLarge, setIsLarge] = useState(query.size ? query.size === "large" : true);
  const [ratio, setRatio] = useState(query.ratio ? query.ratio === "true" : true);
  const [sampleOutput, setSampleOutput] = useState("text");

  const fgDebounce = useDebounce(fgColor, 100);
  const bgDebounce = useDebounce(bgColor, 100);
  const contrastDebounce = useDebounce(contrast, 100);
  const readableOnDebounce = useDebounce(readableOn, 100);

  useEffect(() => {
    setContrast(fgColor.contrast({ bgColor: bgColor, ratio, precision: 3 }));
    setReadableOn([
      fgColor.readableOn({ bgColor: bgColor, level: "minimum", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, level: "enhanced", size: "body" }),
      fgColor.readableOn({ bgColor: bgColor, level: "minimum", size: "large" }),
      fgColor.readableOn({ bgColor: bgColor, level: "enhanced", size: "large" })
    ]);
  }, [fgColor, bgColor, ratio]);

  useEffect(() => {
    history.replace({
      pathname: "/accessibility/contrast",
      search: `?fgColor=${fgDebounce.stringHEX().slice(1).toLowerCase()}&bgColor=${bgDebounce
        .stringHEX()
        .slice(1)
        .toLowerCase()}&ratio=${ratio}&size=${isLarge ? "large" : "body"}`
    });
  }, [history, fgDebounce, bgDebounce, ratio, isLarge]);

  return (
    <FlexRow $wrap="wrap" $gap="48px">
      <ColorSelectorWidget color={fgColor} setColor={setFgColor}>
        <Label $where="left">{isMobile || isTablet ? "FG" : "Foreground"}</Label>
      </ColorSelectorWidget>

      <FlexColumn
        $gap="12px"
        $cols={isMobile || isTablet ? 24 : isLaptop ? 18 : isComputer ? 12 : isWideScreen ? 6 : 10}
        $order={isComputer ? 1 : 0}
      >
        <Heading $size="h1">Sample Output</Heading>

        <Spacers height="4px" />

        <FlexRow>
          <Dropdown
            opts={["text", "image"]}
            value={sampleOutput}
            setValue={setSampleOutput}
            icon={<FontAwesomeIcon icon={faCaretDown} color="dimgray" />}
            iconPos="right"
            switcherPos="right"
            cols={isMobile || isTablet ? 12 : 6}
          />
        </FlexRow>

        {sampleOutput === "text" ? (
          <React.Fragment>
            <Spacers height="4px" />

            <FlexRow $gap="20px">
              <RadioInput onClick={() => isLarge && setIsLarge(false)}>
                <input type="radio" name="body" checked={!isLarge} onChange={() => setIsLarge(!isLarge)} />
                <Spacers width="4px" />
                <label htmlFor="body">
                  <b>Body</b>
                </label>
              </RadioInput>

              <RadioInput onClick={() => !isLarge && setIsLarge(true)}>
                <input type="radio" name="large" checked={isLarge} onChange={() => setIsLarge(!isLarge)} />
                <Spacers width="4px" />
                <label htmlFor="large">
                  <b>Large</b>
                </label>
              </RadioInput>
            </FlexRow>
            <SampleOutput
              background={bgDebounce.stringRGB()}
              color={fgDebounce.stringRGB()}
              size={isLarge ? "large" : "body"}
            >
              The quick brown fox jumps over the lazy dog.
            </SampleOutput>
          </React.Fragment>
        ) : (
          <SampleOutput background={bgDebounce.stringRGB()} color={fgDebounce.stringRGB()} size="image">
            <FlexRow $gap="20px">
              <svg height="48" width="48" fill={fgDebounce.stringRGB()}>
                <polygon points="24,0 0,48 48,48" />
              </svg>
              <FontAwesomeIcon icon={faCircle} />
              <FontAwesomeIcon icon={faSquareFull} />
            </FlexRow>
          </SampleOutput>
        )}

        <Spacers height="8px" />

        <Heading $size="h1">Contrast</Heading>

        <Heading $size="h2" $color="grey">
          {contrast}
        </Heading>

        <span>
          <Checkbox label="Ratio" value={ratio} setValue={setRatio} />
        </span>

        <Spacers height="8px" />

        <Heading $size="h1">ReadableOn</Heading>

        <StyledTable>
          <thead>
            <tr>
              <th></th>
              <th>Minimum (AA)</th>
              <th>Enhanced (AAA)</th>
            </tr>
          </thead>

          <tbody>
            {sampleOutput === "text" ? (
              <>
                <tr>
                  <th>Body</th>
                  <TableCell $positive={readableOn[0]} $negative={!readableOn[0]}>
                    <FontAwesomeIcon icon={readableOn[0] ? faCheckCircle : faTimesCircle} /> 4.5:1
                  </TableCell>
                  <TableCell $positive={readableOn[1]} $negative={!readableOn[1]}>
                    <FontAwesomeIcon icon={readableOn[1] ? faCheckCircle : faTimesCircle} />
                    7.0:1
                  </TableCell>
                </tr>
                <tr>
                  <th>Large</th>
                  <TableCell $positive={readableOn[2]} $negative={!readableOn[2]}>
                    <FontAwesomeIcon icon={readableOn[2] ? faCheckCircle : faTimesCircle} />
                    3.0:1
                  </TableCell>

                  <TableCell $positive={readableOn[3]} $negative={!readableOn[3]}>
                    <FontAwesomeIcon icon={readableOn[3] ? faCheckCircle : faTimesCircle} /> 4.5:1
                  </TableCell>
                </tr>
              </>
            ) : (
              <tr>
                <th>Image</th>
                <TableCell $positive={readableOn[2]} $negative={!readableOn[2]}>
                  <FontAwesomeIcon icon={readableOn[2] ? faCheckCircle : faTimesCircle} />
                  3.0:1
                </TableCell>

                <TableCell>N/A</TableCell>
              </tr>
            )}
          </tbody>
        </StyledTable>

        <Spacers height="12px" />

        <CodeModal code={ContrastSample(fgDebounce, bgDebounce, contrastDebounce, readableOnDebounce, ratio)} />
      </FlexColumn>

      <ColorSelectorWidget color={bgColor} setColor={setBgColor} initPicker="sketch">
        <Label $where="right">{isMobile || isTablet ? "BG" : "Background"}</Label>
      </ColorSelectorWidget>
    </FlexRow>
  );
}
