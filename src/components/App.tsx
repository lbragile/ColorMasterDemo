import { lazy, Suspense, useState } from "react";
import { Button, Container, Icon, Label, Menu, Segment } from "semantic-ui-react";

const WheelPicker = lazy(() => import("./WheelPicker"));
const Flat = lazy(() => import("./Flat"));
const AlphaPicker = lazy(() => import("./AlphaPicker"));
import Loading from "./Loading";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App(): JSX.Element {
  const [activeItem, setActiveItem] = useState("FLAT");

  const MenuItemWrapper = ({ navName }: { navName: string }) => {
    return (
      <Menu.Item
        name={navName.toUpperCase()}
        active={activeItem === navName}
        onClick={(e, { name }) => setActiveItem(name ?? "FLAT")}
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
        <MenuItemWrapper navName="WHEEL" />
        <MenuItemWrapper navName="FLAT" />
        <MenuItemWrapper navName="ALPHA" />
      </Menu>
      <Segment attached="bottom">
        <Suspense fallback={<Loading />}>
          {activeItem === "WHEEL" ? <WheelPicker /> : activeItem === "ALPHA" ? <AlphaPicker /> : <Flat />}
        </Suspense>
      </Segment>
    </Container>
  );
}
