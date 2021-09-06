import { ColorMaster, extendPlugins } from "colormaster";
import { TFormat, THarmony, TMonoEffect, TNumArr } from "colormaster/types";
import MixPlugin from "colormaster/plugins/mix";
import HarmonyPlugin from "colormaster/plugins/harmony";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([MixPlugin, HarmonyPlugin, NamePlugin]);

export function ContrastSample(
  fgColor: ColorMaster,
  bgColor: ColorMaster,
  contrast: string,
  readableOn: boolean[]
): string {
  const precision = [2, 2, 2, 2] as Required<TNumArr>;
  return `import CM, { extendPlugins } from 'colormaster';
import A11yPlugin from "colormaster/plugins/accessibility";

extendPlugins([A11yPlugin]); // add ColorMaster's accessibility plugin

const fgColor = CM("${fgColor.stringRGB({ precision })}");
const bgColor = CM("${bgColor.stringRGB({ precision })}");

console.log(fgColor.contrast({ bgColor, ratio: true, precision: 3 })); // ${contrast}

console.log(fgColor.readableOn({ bgColor, ratio: "minimum", size: "body" })); // ${readableOn[0]}
console.log(fgColor.readableOn({ bgColor, ratio: "enhanced", size: "body" })); // ${readableOn[1]}
console.log(fgColor.readableOn({ bgColor, ratio: "minimum", size: "large" })); // ${readableOn[2]}
console.log(fgColor.readableOn({ bgColor, ratio: "enhanced", size: "large" })); // ${readableOn[3]}
`;
}

export function HarmonySample(color: ColorMaster, type: THarmony, effect: TMonoEffect, amount: number): string {
  const precision = [2, 2, 2, 2] as Required<TNumArr>;
  return `import CM, { extendPlugins } from 'colormaster';
import HarmonyPlugin from "colormaster/plugins/harmony";

extendPlugins([HarmonyPlugin]); // add ColorMaster's harmony plugin

const color = CM("${color.stringRGB({ precision })}");
const harmonyArr = color.harmony({ type: "${type}"${
    type === "monochromatic" ? `, effect: "${effect}", amount: ${amount}` : ""
  } }).map((c) => c.stringHSL());

console.log(harmonyArr); // [${color
    .harmony({ type, effect, amount })
    .map((c) => c.stringHSL())
    .join(", ")}]
`;
}

export function MixSample(
  primary: ColorMaster,
  secondary: ColorMaster,
  ratio: number,
  colorspace: Exclude<TFormat, "invalid" | "name">
): string {
  const precision = [2, 2, 2, 2] as Required<TNumArr>;
  const mix = primary.mix({ color: secondary, ratio, colorspace });
  const nameOpts = { exact: false };

  return `import CM, { extendPlugins } from 'colormaster';
import MixPlugin from "colormaster/plugins/mix";

extendPlugins([MixPlugin]); // add ColorMaster's mix plugin

const primary = CM("${primary.stringRGB({ precision })}"); // ${primary.name(nameOpts)}
const secondary = CM("${secondary.stringRGB({ precision })}"); // ${secondary.name(nameOpts)}
const ratio = ${ratio}; ${ratio === 0.5 ? "// default" : ""}
const colorspace = "${colorspace}"; ${colorspace === "luv" ? "// default" : ""}

const mix = primary.mix({color: secondary, ratio, colorspace});
console.log(mix.stringHSL()); // ${mix.stringHSL()} → ${mix.name(nameOpts)}
`;
}
