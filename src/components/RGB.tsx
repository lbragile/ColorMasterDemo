import CM, { extendPlugins, random } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import A11yPlugin from "colormaster/plugins/accessibility";

extendPlugins([NamePlugin, NamePlugin, A11yPlugin]);
const color1 = CM({ h: 120, s: 100, l: 50 }).name({ exact: false });
const light = CM({ h: 120, s: 100, l: 50 }).isDark();

export default function RGB(): JSX.Element {
  return (
    <div style={{ color: "black" }}>
      HELLO {color1} {light.toString()} {random().stringRGB()}
    </div>
  );
}
