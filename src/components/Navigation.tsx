import { faMix, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faAdjust, faChartPie, faDharmachakra, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
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
  border-bottom: 2px solid hsla(0, 0%, 90%, 1);
  padding-bottom: 3px;
  margin-bottom: 20px;
  width: 100%;
`;

const Item = styled(NavLink).attrs((props: { $active: boolean }) => props)`
  color: black;
  margin-right: 24px;
  padding-bottom: 12px;

  font-size: 1.2rem;
  border-bottom: 2px solid ${(props) => (props.$active ? "black" : "none")};

  &:hover {
    color: black;
  }
`;

export default function Navigation(): JSX.Element {
  const location = useLocation();
  const [active, setActive] = useState("");
  const { isMobile, isTablet } = useBreakpointMap();

  useEffect(() => setActive(location.pathname), [location]);

  return (
    <MenuContainer>
      {/* <Dropdown item text="Accessibility">
            <Dropdown.Menu>
              {MENU_TABS.slice(0, 2).map((item) => {
                const path = "/accessibility/" + item;
                return (
                  <Dropdown.Item as={NavLink} key={path} to={path} active={active === path} onClick={() => setActive(path)}>
                    {item[0].toUpperCase() + item.slice(1)}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown> */}

      <span>
        {MENU_TABS.slice(2).map((item) => {
          const path = "/" + item.type;
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