import React, { lazy, Suspense } from "react";
import { Container, Divider, Icon, Tab } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import { dependencies } from "../../package.json";
import Loading from "./Loading";

const ContrastAnalysis = lazy(() => import("./ContrastAnalysis"));

const LinkIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledContainer = styled(Container)`
  && {
    width: 90%;
    max-width: 95%;
  }
`;

const panes = [
  {
    menuItem: "Contrast",
    // eslint-disable-next-line react/display-name
    render: () => (
      <Suspense fallback={<Loading />}>
        <Tab.Pane>
          <ContrastAnalysis />
        </Tab.Pane>
      </Suspense>
    )
  }
];

export default function App(): JSX.Element {
  return (
    <StyledContainer>
      <GlobalStyle />

      <Divider hidden />

      <h2>ColorMaster v{dependencies.colormaster.replace(/\^/g, "")}</h2>

      <Divider hidden />

      <Tab menu={{ vertical: false /*tabular: true, attached: true*/ }} panes={panes} />

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
