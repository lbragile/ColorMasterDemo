import React, { useEffect, useState } from "react";
import { Container, Divider, Grid, Header, Icon } from "semantic-ui-react";
import useDebounce from "../../hooks/useDebounce";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import { CurrentColorIcon, Swatch, SwatchCounter } from "../../styles/Swatch";
import { A11yStatisticsSample } from "../../utils/codeSamples";
import CM, { ColorMaster, extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import useBreakpointMap from "../../hooks/useBreakpointMap";
import BreadcrumbPath from "../../components/BreadcrumbPath";
import CodeModal from "../../components/CodeModal";
import ColorIndicator from "../../components/ColorIndicator";
import ColorSelectorWidget from "../../components/ColorSelectorWidget";
import Spacers from "../../components/Spacers";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

extendPlugins([A11yPlugin]);

interface IPureHue {
  pure: boolean;
  reason: string;
}

export default function Statistics(): JSX.Element {
  const history = useHistory();
  const query = useQuery();
  const { isMobile } = useBreakpointMap();

  const [color, setColor] = useState(CM(query.color ?? "hsla(45, 75%, 50%, 1)"));
  const [pureHue, setPureHue] = useState<IPureHue>(color.isPureHue() as IPureHue);
  const [closest, setClosest] = useState<{ [K in "warm" | "cool" | "pure" | "web"]: ColorMaster }>({
    warm: CM(color.hsla()).closestWarm(),
    cool: CM(color.hsla()).closestCool(),
    pure: CM(color.hsla()).closestPureHue(),
    web: CM(color.hsla()).closestWebSafe()
  });

  const [alphaWarm, setAlphaWarm] = useState(query.alpha ? JSON.parse(query.alpha)[0] : true);
  const [alphaCool, setAlphaCool] = useState(query.alpha ? JSON.parse(query.alpha)[1] : true);
  const [alphaPure, setAlphaPure] = useState(query.alpha ? JSON.parse(query.alpha)[2] : true);
  const [alphaWeb, setAlphaWeb] = useState(query.alpha ? JSON.parse(query.alpha)[3] : true);

  const colorDebounce = useDebounce(color, 100);

  useEffect(() => {
    setPureHue(color.isPureHue() as IPureHue);
    setClosest({
      warm: CM(color.hsla()).closestWarm(),
      cool: CM(color.hsla()).closestCool(),
      pure: CM(color.hsla()).closestPureHue(),
      web: CM(color.hsla()).closestWebSafe()
    });
  }, [color]);

  useEffect(() => {
    history.replace({
      pathname: "/accessibility/statistics",
      search: `?color=${colorDebounce
        .stringHEX()
        .slice(1)
        .toLowerCase()}&alpha=[${alphaWarm},${alphaCool},${alphaPure},${alphaWeb}]`
    });
  }, [history, colorDebounce, alphaWarm, alphaCool, alphaPure, alphaWeb]);

  return (
    <>
      {isMobile && <Spacers height="24px" />}

      <BreadcrumbPath path="Statistics" />

      <Spacers height="40px" />

      <Grid verticalAlign="middle" stackable>
        <Grid.Row columns={3}>
          <Grid.Column width={5}>
            <ColorSelectorWidget
              color={color}
              setColor={setColor}
              initPicker="wheel"
              initColorspace="hsl"
              harmony={[closest.warm, closest.cool, closest.pure, closest.web]}
            />
          </Grid.Column>

          <Spacers width="24px" />

          <Grid.Column width={3} textAlign="center">
            <Header as="h2">
              Brightness
              <Spacers height="8px" />
              <Header.Subheader>{color.brightness()}</Header.Subheader>
            </Header>

            <Header as="h2">
              Luminance
              <Spacers height="8px" />
              <Header.Subheader>{color.luminance()}</Header.Subheader>
            </Header>

            <Header as="h2">
              Light | Dark
              <Spacers height="8px" />
              <Header.Subheader>
                {color.isLight() ? "Light" : "Dark"} <Spacers width="2px" />
                <Icon name="sun" color={color.isLight() ? "yellow" : "black"} />
              </Header.Subheader>
            </Header>

            <Header as="h2">
              Warm | Cool
              <Spacers height="8px" />
              <Header.Subheader>
                {color.isWarm() ? "Warm" : "Cool"} <Spacers width="2px" />
                <Icon name={color.isWarm() ? "fire" : "snowflake"} color={color.isWarm() ? "red" : "blue"} />
              </Header.Subheader>
            </Header>

            <Header as="h2">
              Tinted | Shaded | Toned
              <Spacers height="8px" />
              <Header.Subheader>
                {pureHue.reason !== "N/A" ? pureHue.reason[0].toUpperCase() + pureHue.reason.slice(1) : "N/A"}
              </Header.Subheader>
            </Header>

            <Header as="h2">
              Pure Hue?
              <Spacers height="8px" />
              <Header.Subheader>
                <Icon name={pureHue.pure ? "check" : "x"} color={pureHue.pure ? "green" : "red"} />
              </Header.Subheader>
            </Header>
          </Grid.Column>

          <Spacers width="24px" />

          <Grid.Column width={6}>
            <Grid columns="equal" verticalAlign="middle" textAlign="center">
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2">Closest Warm</Header>

                  <ColorIndicator
                    color={closest.warm.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaWarm })}
                    alpha={alphaWarm}
                    setAlpha={setAlphaWarm}
                  />

                  <Spacers height="8px" />

                  <Swatch
                    title={closest.warm.stringHSL({ precision: [2, 2, 2, 2] })}
                    position="relative"
                    background={closest.warm.stringHSL()}
                    onClick={() => setColor(closest.warm)}
                    $radius={75}
                    $borderRadius="4px"
                    $cursor="pointer"
                  >
                    <SwatchCounter>1</SwatchCounter>
                    {closest.warm.stringHSL({ precision: [2, 2, 2, 2] }) ===
                      colorDebounce.stringHSL({ precision: [2, 2, 2, 2] }) && (
                      <CurrentColorIcon icon={faCheckCircle} color={color.isDark() ? "white" : "black"} size="2x" />
                    )}
                  </Swatch>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Header as="h2">Closest Cool</Header>

                  <ColorIndicator
                    color={closest.cool.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaCool })}
                    alpha={alphaCool}
                    setAlpha={setAlphaCool}
                  />

                  <Spacers height="8px" />

                  <Swatch
                    title={closest.cool.stringHSL({ precision: [2, 2, 2, 2] })}
                    position="relative"
                    background={closest.cool.stringHSL()}
                    onClick={() => setColor(closest.cool)}
                    $radius={75}
                    $borderRadius="4px"
                    $cursor="pointer"
                  >
                    <SwatchCounter>2</SwatchCounter>
                    {closest.cool.stringHSL({ precision: [2, 2, 2, 2] }) ===
                      colorDebounce.stringHSL({ precision: [2, 2, 2, 2] }) && (
                      <CurrentColorIcon icon={faCheckCircle} color={color.isDark() ? "white" : "black"} size="2x" />
                    )}
                  </Swatch>
                </Grid.Column>
              </Grid.Row>

              <Divider />

              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2">Closest Pure Hue</Header>

                  <ColorIndicator
                    color={closest.pure.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaPure })}
                    alpha={alphaPure}
                    setAlpha={setAlphaPure}
                  />

                  <Spacers height="8px" />

                  <Swatch
                    title={closest.pure.stringHSL({ precision: [2, 2, 2, 2] })}
                    position="relative"
                    background={closest.pure.stringHSL()}
                    onClick={() => setColor(closest.pure)}
                    $radius={75}
                    $borderRadius="4px"
                    $cursor="pointer"
                  >
                    <SwatchCounter>3</SwatchCounter>
                  </Swatch>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Header as="h2">Closest Web Safe</Header>

                  <ColorIndicator
                    color={closest.web.stringHSL({ precision: [2, 2, 2, 2], alpha: alphaWeb })}
                    alpha={alphaWeb}
                    setAlpha={setAlphaWeb}
                  />

                  <Spacers height="8px" />

                  <Swatch
                    title={closest.web.stringHSL({ precision: [2, 2, 2, 2] })}
                    $radius={75}
                    position="relative"
                    $borderRadius="4px"
                    background={closest.web.stringHSL()}
                    onClick={() => setColor(closest.web)}
                    $cursor="pointer"
                  >
                    <SwatchCounter>4</SwatchCounter>
                  </Swatch>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Spacers height="32px" />

            <Container textAlign="center">
              <CodeModal
                code={A11yStatisticsSample(colorDebounce, {
                  warm: alphaWarm,
                  cool: alphaCool,
                  pure: alphaPure,
                  web: alphaWeb
                })}
              />
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
