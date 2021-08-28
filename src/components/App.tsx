import React, { lazy, Suspense, useState } from "react";
import { Container, Divider, Icon, Menu, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { GlobalStyle } from "../styles/Global";
import { dependencies } from "../../package.json";

const WheelPicker = lazy(() => import("./WheelPicker"));
const SketchPicker = lazy(() => import("./SketchPicker"));
import Loading from "./Loading";

const LinkIcon = styled(Icon)`
  cursor: pointer;
`;

export default function App(): JSX.Element {
  const [activeItem, setActiveItem] = useState("WHEEL");

  const MenuItemWrapper = ({ navName }: { navName: string }) => {
    return (
      <Menu.Item
        name={navName.toUpperCase()}
        active={activeItem === navName}
        onClick={(e, { name }) => setActiveItem(name ?? "WHEEL")}
      />
    );
  };

  return (
    <Container>
      <GlobalStyle />

      <Divider hidden />

      <h2>ColorMaster v{dependencies.colormaster.replace(/\^/g, "")}</h2>

      <Divider hidden />

      <Menu attached="top" tabular>
        <MenuItemWrapper navName="WHEEL" />
        <MenuItemWrapper navName="SKETCH" />
      </Menu>
      <Segment attached="bottom">
        <Suspense fallback={<Loading />}>{activeItem === "WHEEL" ? <WheelPicker /> : <SketchPicker />}</Suspense>
      </Segment>

      <Divider hidden />

      <LinkIcon
        name="github"
        size="big"
        circular
        title="https://www.github.com/lbragile/ColorMaster"
        onClick={() => location.assign("https://www.github.com/lbragile/ColorMaster")}
      />

      <LinkIcon
        name="npm"
        size="big"
        color="red"
        circular
        title="https://www.npmjs.com/package/colormaster"
        onClick={() => location.assign("https://www.npmjs.com/package/colormaster")}
      />
    </Container>
  );
}
