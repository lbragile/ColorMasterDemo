import React, { lazy, Suspense } from "react";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import theme from "../styles/Theme";

// Based on https://stackoverflow.com/a/54159114/4298115, add a MINIMUM delay of x seconds on original load
const paths = ["A11y/Contrast", "A11y/Statistics", "Harmony", "Mix", "Manipulate"];
const DELAY_IN_SECONDS = 1.5;
const [Contrast, Statistics, Harmony, Mix, Manipulate] = paths.map((path) => {
  return lazy(() =>
    Promise.all([
      import("../pages/" + path),
      new Promise((resolve) => setTimeout(resolve, DELAY_IN_SECONDS * 1000))
    ]).then(([moduleExports]) => moduleExports)
  );
});

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
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/accessibility/contrast" component={Contrast} />
            <Route path="/accessibility/statistics" component={Statistics} />
            <Route path="/harmony" component={Harmony} />
            <Route path="/mix" component={Mix} />
            <Route path="/manipulate" component={Manipulate} />
            <Redirect from="/" to="/harmony" />
          </Switch>
        </ThemeProvider>
      </Suspense>

      <Footer />
    </Container>
  );
}
