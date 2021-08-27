import { lazy, Suspense, useState } from "react";
import { Button, Container, Icon, Label, Menu, Segment } from "semantic-ui-react";
import { dependencies } from "../../package.json";

const WheelPicker = lazy(() => import("./WheelPicker"));
const SketchPicker = lazy(() => import("./SketchPicker"));
import Loading from "./Loading";

export default function App(): JSX.Element {
  const [activeItem, setActiveItem] = useState("SKETCH");

  const MenuItemWrapper = ({ navName }: { navName: string }) => {
    return (
      <Menu.Item
        name={navName.toUpperCase()}
        active={activeItem === navName}
        onClick={(e, { name }) => setActiveItem(name ?? "SKETCH")}
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

      <h3>ColorMaster v{dependencies.colormaster.replace(/\^/g, "")}</h3>

      <Menu attached="top" tabular>
        <MenuItemWrapper navName="WHEEL" />
        <MenuItemWrapper navName="SKETCH" />
      </Menu>
      <Segment attached="bottom">
        <Suspense fallback={<Loading />}>{activeItem === "WHEEL" ? <WheelPicker /> : <SketchPicker />}</Suspense>
      </Segment>
    </Container>
  );
}
