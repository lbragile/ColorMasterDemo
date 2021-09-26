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
import useDarkMode from "../hooks/useDarkMode";

// Based on https://stackoverflow.com/a/54159114/4298115, add a MINIMUM delay of x seconds on original load
const paths = ["Contrast", "Statistics", "Harmony", "Mix", "Manipulate"];
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
  padding: 24px 8px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
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
  const BREAKPOINT_MAP = useMemo(() => breakpoints, [breakpoints]);

  const { isDarkMode } = useDarkMode();
  const APP_THEME = useMemo(() => (isDarkMode ? theme.dark : theme.light), [isDarkMode]);

  return (
    <Container>
      <ThemeProvider theme={APP_THEME}>
        <BreakpointsContext.Provider value={BREAKPOINT_MAP}>
          <GlobalStyle />
          <Navigation />

          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/contrast" component={Contrast} />
              <Route path="/statistics" component={Statistics} />
              <Route path="/harmony" component={Harmony} />
              <Route path="/mix" component={Mix} />
              <Route path="/manipulate" component={Manipulate} />
              <Redirect from="/" to="/contrast" />
            </Switch>
          </Suspense>

          <Footer />
        </BreakpointsContext.Provider>
      </ThemeProvider>
    </Container>
  );
}
