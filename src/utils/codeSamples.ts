import CM, { ColorMaster, extendPlugins } from "colormaster";
import { THarmony, TMonoEffect, TNumArr } from "colormaster/types";
import MixPlugin from "colormaster/plugins/mix";
import HarmonyPlugin from "colormaster/plugins/harmony";
import NamePlugin from "colormaster/plugins/name";
import { TValidColorspace } from "../types/colormaster";

extendPlugins([MixPlugin, HarmonyPlugin, NamePlugin]);

const nameOpts = { exact: false };
const precision = [0, 0, 0, 2] as Required<TNumArr>;

export function ContrastSample(
  fgColor: ColorMaster,
  bgColor: ColorMaster,
  contrast: string | number,
  readableOn: boolean[],
  ratio: boolean
): string {
  return `import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";

extendPlugins([A11yPlugin]); // add ColorMaster's accessibility plugin

const fgColor = CM("${fgColor.stringRGB({ precision })}"); // ${fgColor.name(nameOpts)}
const bgColor = CM("${bgColor.stringRGB({ precision })}"); // ${bgColor.name(nameOpts)}

console.log(fgColor.contrast({ bgColor, ratio: ${ratio}, precision: 3 })); // ${contrast}

console.log(fgColor.readableOn({ bgColor, level: "minimum", size: "body" })); // ${readableOn[0]}
console.log(fgColor.readableOn({ bgColor, level: "enhanced", size: "body" })); // ${readableOn[1]}
console.log(fgColor.readableOn({ bgColor, level: "minimum", size: "large" })); // ${readableOn[2]}
console.log(fgColor.readableOn({ bgColor, level: "enhanced", size: "large" })); // ${readableOn[3]}
`;
}

export function HarmonySample(color: ColorMaster, type: THarmony, effect: TMonoEffect, amount: number): string {
  const harmonyArr = color.harmony({ type, effect, amount });

  return `import CM, { extendPlugins } from "colormaster";
import HarmonyPlugin from "colormaster/plugins/harmony";

extendPlugins([HarmonyPlugin]); // add ColorMaster's harmony plugin

const color = CM("${color.stringRGB({ precision })}"); // ${color.name(nameOpts)}
const harmonyArr = color.harmony({ type: "${type}"${
    type === "monochromatic" ? `, effect: "${effect}", amount: ${amount}` : ""
  } }).map((c) => c.stringHSL());

harmonyArr.forEach((c) => console.log(c));
/**
${harmonyArr
  .map(
    (c, i) =>
      " * " +
      c.stringHSL() +
      " ??? " +
      c.name(nameOpts) +
      (c.stringHSL() === color.stringHSL() ? " (original)" : "") +
      (i !== harmonyArr.length - 1 ? "\n" : "")
  )
  .join("")} 
 */
`;
}

export function MixSample(
  primary: ColorMaster,
  secondary: ColorMaster,
  ratio: number,
  colorspace: TValidColorspace,
  alpha: boolean
): string {
  const mix = primary.mix({ color: secondary, ratio, colorspace });

  return `import CM, { extendPlugins } from "colormaster";
import MixPlugin from "colormaster/plugins/mix";

extendPlugins([MixPlugin]); // add ColorMaster's mix plugin

const primary = CM("${primary.stringRGB({ precision })}"); // ${primary.name(nameOpts)}
const secondary = CM("${secondary.stringRGB({ precision })}"); // ${secondary.name(nameOpts)}
const ratio = ${ratio}; ${ratio === 0.5 ? "// default" : ""}
const colorspace = "${colorspace}"; ${colorspace === "luv" ? "// default" : ""}

const mix = primary.mix({color: secondary, ratio, colorspace});
console.log(mix.stringHSL({ alpha: ${alpha} })); // ${mix.stringHSL({ alpha })} ??? ${mix.name(nameOpts)}
`;
}

export function ManipulationSample(
  color: ColorMaster,
  incrementColor: ColorMaster,
  incArr: boolean[],
  alpha: { [K in "adjust" | "rotate" | "invert" | "grayscale"]: boolean }
): string {
  const { h, s, l, a } = incrementColor.hsla();

  const signs = incArr.map((val) => (val ? 1 : -1));
  const rotate = CM(color.hsla()).hueBy(signs[0] * h);
  const adjust = CM(rotate.hsla())
    .saturateBy(signs[1] * s)
    .lighterBy(signs[2] * l)
    .alphaBy(signs[3] * a);

  const invert = CM(color.hsla()).invert({ alpha: alpha.invert });
  const grayscale = CM(color.hsla()).grayscale();

  return `import CM from "colormaster";

const color = CM("${color.stringHSL({ precision })}"); // ${color.name(nameOpts)}
const incrementColor = CM("${incrementColor.stringHSL({ precision })}"); // ${incrementColor.name(nameOpts)}

// note we use \`CM(color.hsla())\` to "deep copy" \`color\` and avoid manipulating it unintentionally

const adjust = CM(color.hsla())
    .hueBy(${signs[0] === -1 ? signs[0] + " * " : ""}incrementColor.hue)
    .${signs[1] === 1 ? "saturateBy" : "desaturateBy"}(incrementColor.saturation)
    .${signs[2] === 1 ? "lighterBy" : "darkenBy"}(incrementColor.lightness)
    .alphaBy(${signs[3] === -1 ? signs[3] + " * " : ""}incrementColor.alpha);
const rotate = CM(color.hsla()).hueBy(${signs[0] === -1 ? signs[0] + " * " : ""}incrementColor.hue);
const invert = CM(color.hsla()).invert({ alpha: ${alpha.invert} });
const grayscale = CM(color.hsla()).grayscale();

/**
 * Here we provide the above \`adjust\` & \`rotate\` variables with parameters that adjust dynamically:
 * const adjust = CM(color.hsla()).hueBy(${(signs[0] * h).toFixed(2)}).${
    signs[1] === 1 ? "saturateBy" : "desaturateBy"
  }(${s.toFixed(2)}).${signs[2] === 1 ? "lighterBy" : "darkenBy"}(${l.toFixed(2)}).alphaBy(${(signs[3] * a).toFixed(
    4
  )});
 * const rotate = CM(color.hsla()).hueBy(${(signs[0] * h).toFixed(2)});
 */

console.log(adjust.stringHSL({ alpha: ${alpha.adjust} }))); // ${adjust.stringHSL({
    precision,
    alpha: alpha.adjust
  })} ??? ${adjust.name(nameOpts)}
console.log(rotate.stringHSL({ alpha: ${alpha.rotate} }))); // ${rotate.stringHSL({
    precision,
    alpha: alpha.rotate
  })} ??? ${rotate.name(nameOpts)}
console.log(invert.stringHSL({ alpha: ${alpha.invert} }))); // ${invert.stringHSL({
    precision,
    alpha: alpha.invert
  })} ??? ${invert.name(nameOpts)}
console.log(grayscale.stringHSL({ alpha: ${alpha.grayscale} }))); // ${grayscale.stringHSL({
    precision,
    alpha: alpha.grayscale
  })} ??? ${grayscale.name(nameOpts)}
`;
}

export function A11yStatisticsSample(
  color: ColorMaster,
  alpha: { [K in "warm" | "cool" | "pure" | "web"]: boolean }
): string {
  const warm = CM(color.hsla()).closestWarm();
  const cool = CM(color.hsla()).closestCool();
  const pure = CM(color.hsla()).closestPureHue();
  const web = CM(color.hsla()).closestWebSafe();

  return `import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";

extendPlugins([A11yPlugin]); // add ColorMaster's accessibility plugin

const color = CM("${color.stringHSL({ precision })}"); // ${color.name(nameOpts)}

// note we use \`CM(color.hsla())\` to "deep copy" \`color\` and avoid manipulating it unintentionally

const warm = CM(color.hsla()).closestWarm()
const cool = CM(color.hsla()).closestCool()
const pure = CM(color.hsla()).closestPureHue()
const web = CM(color.hsla()).closestWebSafe()

console.log(warm.stringHSL({ alpha: ${alpha.warm} }))); // ${warm.stringHSL({
    precision,
    alpha: alpha.warm
  })} ??? ${warm.name(nameOpts)}
console.log(cool.stringHSL({ alpha: ${alpha.cool} }))); // ${cool.stringHSL({
    precision,
    alpha: alpha.cool
  })} ??? ${cool.name(nameOpts)}
console.log(pure.stringHSL({ alpha: ${alpha.pure} }))); // ${pure.stringHSL({
    precision,
    alpha: alpha.pure
  })} ??? ${pure.name(nameOpts)}
console.log(web.stringHSL({ alpha: ${alpha.web} }))); // ${web.stringHSL({
    precision,
    alpha: alpha.web
  })} ??? ${web.name(nameOpts)}
`;
}
