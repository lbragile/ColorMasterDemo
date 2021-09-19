import React, { lazy, Suspense, useEffect, useState } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, NavLink, useLocation, Redirect } from "react-router-dom";
import SocialMedia from "./SocialMedia";
import useBreakpointMap from "../hooks/useBreakpointMap";

const Contrast = lazy(() => import("../pages/A11y/Contrast"));
const Statistics = lazy(() => import("../pages/A11y/Statistics"));
const Harmony = lazy(() => import("../pages/Harmony"));
const Mix = lazy(() => import("../pages/Mix"));
const Manipulate = lazy(() => import("../pages/Manipulate"));

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 90%;
  height: 100vh;
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
    <Grid>
      <GlobalStyle />

      <Suspense fallback={<Loading />}>
        {/* <Menu pointing secondary>
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
        </Menu> */}

        {/* <Content $mobile={isMobile}> */}
        <Switch>
          <Route path="/accessibility/contrast" component={Contrast} />
          <Route path="/accessibility/statistics" component={Statistics} />
          <Route path="/harmony" component={Harmony} />
          <Route path="/mix" component={Mix} />
          <Route path="/manipulate" component={Manipulate} />
          <Redirect from="/" to="/harmony" />
        </Switch>
        {/* </Content> */}
      </Suspense>
    </Grid>
  );
}
