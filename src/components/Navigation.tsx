import { faMix, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faAdjust, faBars, faChartPie, faDharmachakra, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BreakpointsContext } from "./App";
import SocialMedia from "./SocialMedia";
import Spacers from "./Spacers";
import DarkModelToggle from "./DarkModeToggle";
import useDarkMode from "../hooks/useDarkMode";

const MENU_TABS: { type: string; icon: IconDefinition }[] = [
  { type: "contrast", icon: faAdjust },
  { type: "statistics", icon: faChartPie },
  { type: "harmony", icon: faDharmachakra },
  { type: "mix", icon: faMix },
  { type: "manipulate", icon: faSlidersH }
];

const Bars = styled(FontAwesomeIcon).attrs((props: { $responsive: boolean }) => props)`
  display: ${(props) => (props.$responsive ? "flex" : "none")};
  margin-bottom: 8px;
`;

const MenuContainer = styled.nav.attrs((props: { $responsive: boolean }) => props)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.$responsive ? "28px" : "0")};
  border-bottom: 2px solid ${(props) => props.theme.colors.borderLight};
  width: 100%;
`;

const List = styled.ul.attrs((props: { $dir: "row" | "column"; $show: boolean; $responsive: boolean }) => props)`
  display: ${(props) => (props.$show || !props.$responsive ? "flex" : "none")};
  flex-direction: ${(props) => props.$dir};
  gap: ${(props) => (props.$responsive ? "24px" : "16px")};
  margin: 16px 0;
`;

const Item = styled.li`
  list-style: none;
`;

const Anchor = styled(NavLink).attrs((props: { $active: boolean; $responsive: boolean }) => props)`
  color: black;
  padding-bottom: 17px;
  text-decoration: none;
  font-size: 1.2rem;
  border-bottom: 2px solid ${(props) => (props.$active && !props.$responsive ? "black" : "none")};
  font-weight: ${(props) => (props.$active && props.$responsive ? "bold" : "normal")};

  &:hover {
    color: black;
  }
`;

const Flex = styled.div.attrs((props: { $dir: "row" | "column" }) => props)`
  display: flex;
  flex-direction: ${(props) => props.$dir};
`;

const MenuRight = styled.span.attrs((props: { $responsive: boolean }) => props)`
  position: absolute;
  top: ${(props) => (props.$responsive ? "0" : "12px")};
  right: 0;
  display: flex;
  align-items: center;
`;

export default function Navigation(): JSX.Element {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  const { isMobile, isTablet } = useContext(BreakpointsContext);
  const { isDarkMode, toggle } = useDarkMode();

  useEffect(() => setActive(location.pathname), [location]);

  const responsive = isMobile || isTablet;
  const dir = responsive ? "column" : "row";
  const hide = () => setShow(false);

  return (
    <MenuContainer $responsive={responsive}>
      <Flex $dir={dir}>
        <Bars icon={faBars} size="2x" $responsive={responsive} onClick={() => setShow(!show)} />

        <List $dir={dir} $show={show} $responsive={responsive} onClick={hide}>
          {MENU_TABS.map((item, i) => {
            const path = `/${i < 2 ? "accessibility/" : ""}${item.type}`;
            return (
              <Item key={path}>
                <Anchor to={path} $active={active === path} $responsive={responsive} onClick={() => setActive(path)}>
                  <FontAwesomeIcon icon={item.icon} />
                  <Spacers width="4px" />
                  {item.type[0].toUpperCase() + item.type.slice(1)}
                </Anchor>
              </Item>
            );
          })}
        </List>
      </Flex>

      <MenuRight $responsive={responsive} onClick={hide}>
        <DarkModelToggle isDarkMode={isDarkMode} toggle={toggle} />
        <Spacers width="4px" />
        <SocialMedia />
      </MenuRight>
    </MenuContainer>
  );
}
