import { faMix, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faAdjust, faBars, faChartPie, faDharmachakra, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
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
  cursor: pointer;
`;

const MenuContainer = styled.nav.attrs((props: { $responsive: boolean }) => props)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${(props) => (props.$responsive ? "0 0 28px 0" : "12px 0 0 0")};
  padding-bottom: ${(props) => (props.$responsive ? "0" : "11px")};
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
  width: 100%;
`;

const List = styled.ul.attrs(
  (props: { $dir: "row" | "column"; $height: number; $show: boolean; $responsive: boolean }) => props
)`
  display: flex;
  flex-direction: ${(props) => props.$dir};
  gap: ${(props) => (props.$responsive ? "24px" : "32px")};
  ${(props) =>
    props.$responsive
      ? css`
          overflow: hidden;
          max-height: ${props.$show ? `${props.$height}px` : "0"};
          margin: ${props.$show ? "12px 0" : "0"};
          transition: all 0.5s ease-out;
          transition-property: margin, max-height;
        `
      : ""};
`;

const Item = styled.li`
  list-style: none;
`;

const Anchor = styled(NavLink).attrs((props: { $active: boolean; $responsive: boolean }) => props)`
  color: ${(props) => props.theme.colors.text};
  padding-bottom: 12px;
  text-decoration: none;
  font-size: 1.2rem;
  border-bottom: 2px solid ${(props) => (props.$active && !props.$responsive ? props.theme.colors.text : "none")};
  font-weight: ${(props) => (props.$active && props.$responsive ? "bold" : "normal")};

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

const Flex = styled.div.attrs((props: { $dir: "row" | "column" }) => props)`
  display: flex;
  flex-direction: ${(props) => props.$dir};
`;

const MenuRight = styled.span.attrs((props: { $responsive: boolean }) => props)`
  position: absolute;
  top: ${(props) => (props.$responsive ? "0" : "-6px")};
  right: 0;
  display: flex;
  align-items: center;
`;

export default function Navigation(): JSX.Element {
  const location = useLocation();
  const { isMobile, isTablet } = useContext(BreakpointsContext);
  const { isDarkMode, toggle } = useDarkMode();

  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);

  // The following are used to dynamically calculate list height for collapse transition
  const [listHeight, setListHeight] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => setActive(location.pathname), [location]);

  const responsive = isMobile || isTablet;
  const dir = responsive ? "column" : "row";

  const openMenu = () => {
    // dynamically calculate the list height when about to reveal it
    if (!show) {
      setListHeight(listRef.current?.scrollHeight ?? 0);
    }

    setShow(!show);
  };

  const closeMenu = () => setShow(false);

  const handleScroll = useCallback(() => {
    if (responsive && show) {
      setShow(false);
    }
  }, [responsive, show]);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <MenuContainer $responsive={responsive}>
      <Flex $dir={dir}>
        <Bars icon={faBars} size="2x" $responsive={responsive} onClick={openMenu} />

        <List ref={listRef} $dir={dir} $height={listHeight} $show={show} $responsive={responsive} onClick={closeMenu}>
          {MENU_TABS.map((item) => {
            const path = `/${item.type}`;

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

      <MenuRight $responsive={responsive} onClick={closeMenu}>
        <DarkModelToggle isDarkMode={isDarkMode} toggle={toggle} />
        <Spacers width="4px" />
        <SocialMedia />
      </MenuRight>
    </MenuContainer>
  );
}
