import { faMix, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faAdjust, faChartPie, faDharmachakra, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BreakpointsContext } from "./App";
import SocialMedia from "./SocialMedia";
import Spacers from "./Spacers";

const MENU_TABS: { type: string; icon: IconDefinition }[] = [
  { type: "contrast", icon: faAdjust },
  { type: "statistics", icon: faChartPie },
  { type: "harmony", icon: faDharmachakra },
  { type: "mix", icon: faMix },
  { type: "manipulate", icon: faSlidersH }
];

const MenuContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 2px solid ${(props) => props.theme.colors.borderLight};
  padding-bottom: 3px;
  margin-bottom: 20px;
  width: 100%;
`;

const Item = styled(NavLink).attrs((props: { $active: boolean }) => props)`
  color: black;
  margin-right: 24px;
  padding-bottom: 14px;
  text-decoration: none;

  font-size: 1.2rem;
  border-bottom: 2px solid ${(props) => (props.$active ? "black" : "none")};

  &:hover {
    color: black;
  }
`;

export default function Navigation(): JSX.Element {
  const location = useLocation();
  const [active, setActive] = useState("");
  const { isMobile, isTablet } = useContext(BreakpointsContext);

  useEffect(() => setActive(location.pathname), [location]);

  return (
    <MenuContainer>
      <span>
        {MENU_TABS.map((item, i) => {
          const path = `/${i < 2 ? "accessibility/" : ""}${item.type}`;
          return (
            <Item key={path} to={path} $active={active === path} onClick={() => setActive(path)}>
              <FontAwesomeIcon icon={item.icon} />
              {!isMobile && !isTablet && (
                <>
                  <Spacers width="4px" />
                  {item.type[0].toUpperCase() + item.type.slice(1)}
                </>
              )}
            </Item>
          );
        })}
      </span>

      <SocialMedia />
    </MenuContainer>
  );
}
