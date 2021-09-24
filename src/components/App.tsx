import React, { lazy, Suspense, useMemo, createContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import theme from "../styles/Theme";
import useBreakpointMap from "../hooks/useBreakpointMap";
import { IBreakpointsMap } from "../types/breakpoints";

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

export const BreakpointsContext = createContext<IBreakpointsMap>({
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isComputer: false,
  isWideScreen: false,
  isUltraWideScreen: false
});

export default function App(): JSX.Element {
  const breakpoints = useBreakpointMap();
  const providerValue = useMemo(() => breakpoints, [breakpoints]);

  return (
    <Container>
      <GlobalStyle />

      <ThemeProvider theme={theme}>
        <BreakpointsContext.Provider value={providerValue}>
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
        </BreakpointsContext.Provider>
      </ThemeProvider>
    </Container>
  );
}
