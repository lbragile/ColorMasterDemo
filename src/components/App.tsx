import React, { lazy, Suspense, useEffect, useState } from "react";
import { Container, Divider, Dropdown, Menu } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, NavLink, useLocation, Redirect } from "react-router-dom";
import SocialMedia from "./SocialMedia";
import useBreakpointMap from "../hooks/useBreakpointMap";

const ContrastAnalysis = lazy(() => import("./Analysis/ContrastAnalysis"));
const HarmonyAnalysis = lazy(() => import("./Analysis/HarmonyAnalysis"));
const MixAnalysis = lazy(() => import("./Analysis/MixAnalysis"));
const ManipulateAnalysis = lazy(() => import("./Analysis/ManipulateAnalysis"));
const A11yStatisticsAnalysis = lazy(() => import("./Analysis/A11yStatisticsAnalysis"));

const StyledContainer = styled(Container)`
  && {
    position: relative;
    width: 90%;
    max-width: 95%;
    height: 100vh;
  }
`;

const Content = styled.div.attrs((props: { $mobile: boolean }) => props)`
  ${(props) =>
    !props.$mobile
      ? {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)"
        }
      : {}}
`;

const MENU_TABS = ["contrast", "statistics", "harmony", "mix", "manipulate"];

export default function App(): JSX.Element {
  const location = useLocation();
  const [active, setActive] = useState("");

  const { isMobile } = useBreakpointMap();

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <StyledContainer>
      <GlobalStyle />

      <Suspense fallback={<Loading />}>
        {isMobile && <Divider hidden />}

        <Menu pointing secondary>
          <Dropdown item text={isMobile ? "A11y" : "Accessibility"}>
            <Dropdown.Menu>
              {MENU_TABS.slice(0, 2).map((item) => {
                const path = "/accessibility/" + item;
                return (
                  <Dropdown.Item
                    as={NavLink}
                    key={path}
                    to={path}
                    active={active === path}
                    onClick={() => setActive(path)}
                  >
                    {item[0].toUpperCase() + item.slice(1)}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          {MENU_TABS.slice(2).map((item) => {
            const path = "/" + item;
            return (
              <Menu.Item as={NavLink} key={path} to={path} active={active === path} onClick={() => setActive(path)}>
                {item[0].toUpperCase() + item.slice(1)}
              </Menu.Item>
            );
          })}

          {!isMobile && (
            <Menu.Item position="right">
              <SocialMedia />
            </Menu.Item>
          )}
        </Menu>

        <Content $mobile={isMobile}>
          <Switch>
            <Route path="/accessibility/contrast" component={ContrastAnalysis} />
            <Route path="/accessibility/statistics" component={A11yStatisticsAnalysis} />
            <Route path="/harmony" component={HarmonyAnalysis} />
            <Route path="/mix" component={MixAnalysis} />
            <Route path="/manipulate" component={ManipulateAnalysis} />
            <Redirect from="/" to="/harmony" />
          </Switch>
        </Content>
      </Suspense>
    </StyledContainer>
  );
}
