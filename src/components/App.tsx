import React, { lazy, Suspense, useMemo } from "react";
import { Container, Divider, Icon, Tab } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";

const ContrastAnalysis = lazy(() => import("./Analysis/ContrastAnalysis"));
const HarmonyAnalysis = lazy(() => import("./Analysis/HarmonyAnalysis"));
const MixAnalysis = lazy(() => import("./Analysis/MixAnalysis"));

const LinkIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledContainer = styled(Container)`
  && {
    width: 90%;
    max-width: 95%;
  }
`;

export default function App(): JSX.Element {
  const panes = useMemo(
    () =>
      [
        { menuItem: "Contrast", elem: <ContrastAnalysis /> },
        { menuItem: "Harmony", elem: <HarmonyAnalysis /> },
        { menuItem: "Mix", elem: <MixAnalysis /> }
      ].map((item) => {
        return {
          menuItem: item.menuItem,
          render: function renderElement() {
            return (
              <Suspense fallback={<Loading />}>
                <Tab.Pane>{item.elem}</Tab.Pane>
              </Suspense>
            );
          }
        };
      }),
    []
  );

  return (
    <StyledContainer>
      <GlobalStyle />

      <Divider hidden />

      <h2>ColorMaster v1.2.0</h2>

      <Divider hidden />

      <Tab menu={{ vertical: false /*tabular: true, attached: true*/ }} panes={panes} defaultActiveIndex={2} />

      <Divider hidden />

      <LinkIcon
        name="github"
        size="big"
        circular
        title="https://www.github.com/lbragile/ColorMaster"
        onClick={() => location.assign("https://www.github.com/lbragile/ColorMaster")}
      />

      <LinkIcon
        name="npm"
        size="big"
        color="red"
        circular
        title="https://www.npmjs.com/package/colormaster"
        onClick={() => location.assign("https://www.npmjs.com/package/colormaster")}
      />

      <Divider hidden />
    </StyledContainer>
  );
}
