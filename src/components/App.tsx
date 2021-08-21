import React, { lazy, Suspense, useState } from "react";
import { Button, Container, Icon, Label, Menu, Segment } from "semantic-ui-react";

const HEX = lazy(() => import("./HEX"));
const HSL = lazy(() => import("./HSL"));
const RGB = lazy(() => import("./RGB"));
const Wheel = lazy(() => import("./Wheel"));
const Flat = lazy(() => import("./Flat"));
import Loading from "./Loading";

export default function App(): JSX.Element {
  const [activeItem, setActiveItem] = useState("FLAT");

  const MenuItemWrapper = ({ navName }: { navName: string }) => {
    return (
      <Menu.Item
        name={navName.toUpperCase()}
        active={activeItem === navName}
        onClick={(e, { name }) => setActiveItem(name ?? "RGB")}
      />
    );
  };

  return (
    <Container>
      <Button
        as="div"
        labelPosition="right"
        onClick={() => location.assign("https://www.github.com/lbragile/ColorMaster")}
      >
        <Button color="black">
          <Icon name="github" size="large" /> GitHub
        </Button>
        <Label as="a" basic color="grey" pointing="left" content="ColorMaster" />
      </Button>
      <Button
        as="div"
        labelPosition="right"
        onClick={() => location.assign("https://www.npmjs.com/package/colormaster")}
      >
        <Button color="red">
          <Icon name="npm" size="large" /> NPM
        </Button>
        <Label as="a" basic color="grey" pointing="left" content="ColorMaster" />
      </Button>

      <Menu attached="top" tabular>
        <MenuItemWrapper navName="RGB" />
        <MenuItemWrapper navName="HEX" />
        <MenuItemWrapper navName="HSL" />
        <MenuItemWrapper navName="WHEEL" />
        <MenuItemWrapper navName="FLAT" />
      </Menu>
      <Segment attached="bottom">
        <Suspense fallback={<Loading />}>
          {activeItem === "RGB" ? (
            <RGB />
          ) : activeItem === "HEX" ? (
            <HEX />
          ) : activeItem === "HSL" ? (
            <HSL />
          ) : activeItem === "WHEEL" ? (
            <Wheel />
          ) : (
            <Flat />
          )}
        </Suspense>
      </Segment>
    </Container>
  );
}
