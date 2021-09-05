import React, { lazy, Suspense, useEffect, useState } from "react";
import { Container, Menu } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import Loading from "./Loading";
import { Switch, Route, NavLink, useLocation, Redirect } from "react-router-dom";
import SocialMedia from "./SocialMedia";

const ContrastAnalysis = lazy(() => import("./Analysis/ContrastAnalysis"));
const HarmonyAnalysis = lazy(() => import("./Analysis/HarmonyAnalysis"));
const MixAnalysis = lazy(() => import("./Analysis/MixAnalysis"));

const StyledContainer = styled(Container)`
  && {
    width: 90%;
    max-width: 95%;
  }
`;

const StyledNavLink = styled(NavLink)`
  && {
    color: black;
  }
`;

const MENU_TABS = ["contrast", "harmony", "mix"];

export default function App(): JSX.Element {
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <StyledContainer>
      <GlobalStyle />

      <Menu pointing secondary>
        {MENU_TABS.map((item) => {
          const path = "/" + item;
          return (
            <Menu.Item as={StyledNavLink} key={path} to={path} active={active === path} onClick={() => setActive(path)}>
              {item[0].toUpperCase() + item.slice(1)}
            </Menu.Item>
          );
        })}

        <Menu.Item position="right">
          <SocialMedia />
        </Menu.Item>
      </Menu>

      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/contrast" component={ContrastAnalysis} />
          <Route path="/harmony" component={HarmonyAnalysis} />
          <Route path="/mix" component={MixAnalysis} />
          <Redirect from="/" to="/mix" />
        </Switch>
      </Suspense>
    </StyledContainer>
  );
}
