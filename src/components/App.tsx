import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Contrast = lazy(() => import("../pages/A11y/Contrast"));
const Statistics = lazy(() => import("../pages/A11y/Statistics"));
const Harmony = lazy(() => import("../pages/Harmony"));
const Mix = lazy(() => import("../pages/Mix"));
const Manipulate = lazy(() => import("../pages/Manipulate"));

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  max-width: 90%;
  padding: 24px 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function App(): JSX.Element {
  return (
    <Container>
      <GlobalStyle />

      <Navigation />

      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/accessibility/contrast" component={Contrast} />
          <Route path="/accessibility/statistics" component={Statistics} />
          <Route path="/harmony" component={Harmony} />
          <Route path="/mix" component={Mix} />
          <Route path="/manipulate" component={Manipulate} />
          <Redirect from="/" to="/harmony" />
        </Switch>
      </Suspense>

      <Footer />
    </Container>
  );
}
