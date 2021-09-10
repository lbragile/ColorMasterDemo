import CM, { ColorMaster, extendPlugins } from "colormaster";
import { TFormat, THarmony, TMonoEffect, TNumArr } from "colormaster/types";
import MixPlugin from "colormaster/plugins/mix";
import HarmonyPlugin from "colormaster/plugins/harmony";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([MixPlugin, HarmonyPlugin, NamePlugin]);

const nameOpts = { exact: false };
const precision = [2, 2, 2, 2] as Required<TNumArr>;

export function ContrastSample(
  fgColor: ColorMaster,
  bgColor: ColorMaster,
  contrast: string | number,
  readableOn: boolean[],
  ratio: boolean
): string {
  return `import CM, { extendPlugins } from 'colormaster';
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

  return `import CM, { extendPlugins } from 'colormaster';
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
      " → " +
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
  colorspace: Exclude<TFormat, "invalid" | "name">,
  alpha: boolean
): string {
  const mix = primary.mix({ color: secondary, ratio, colorspace });

  return `import CM, { extendPlugins } from 'colormaster';
import MixPlugin from "colormaster/plugins/mix";

extendPlugins([MixPlugin]); // add ColorMaster's mix plugin

const primary = CM("${primary.stringRGB({ precision })}"); // ${primary.name(nameOpts)}
const secondary = CM("${secondary.stringRGB({ precision })}"); // ${secondary.name(nameOpts)}
const ratio = ${ratio}; ${ratio === 0.5 ? "// default" : ""}
const colorspace = "${colorspace}"; ${colorspace === "luv" ? "// default" : ""}

const mix = primary.mix({color: secondary, ratio, colorspace});
console.log(mix.stringHSL({ alpha: ${alpha} })); // ${mix.stringHSL({ alpha })} → ${mix.name(nameOpts)}
`;
}

export function ManipulationSample(
  color: ColorMaster,
  incrementColor: ColorMaster,
  isIncrement: boolean,
  alpha: boolean
): string {
  const precision = [2, 2, 2, 2] as Required<TNumArr>;
  const { h, s, l, a } = incrementColor.hsla();
  const sign = isIncrement ? 1 : -1;
  const result = CM(color.stringHSL())
    .hueBy(sign * h)
    .saturateBy(sign * s)
    .lighterBy(sign * l)
    .alphaBy(sign * a);

  return `import CM from 'colormaster';

const color = CM("${color.stringHSL({ precision })}"); // ${color.name(nameOpts)}
const incrementColor = CM("${incrementColor.stringHSL({ precision })}"); // ${incrementColor.name(nameOpts)}

const result = color
    .hueBy(${!isIncrement ? sign + " * " : ""}incrementColor.hue)
    .${isIncrement ? "saturateBy" : "desaturateBy"}(incrementColor.saturation)
    .${isIncrement ? "lighterBy" : "darkenBy"}(incrementColor.lightness)
    .alphaBy(${!isIncrement ? sign + " * " : ""}incrementColor.alpha);

/**
 * const result = color.hueBy(${(sign * h).toFixed(2)}).${isIncrement ? "saturateBy" : "desaturateBy"}(${s.toFixed(
    2
  )}).${isIncrement ? "lighterBy" : "darkenBy"}(${l.toFixed(2)}).alphaBy(${(sign * a).toFixed(4)});
 */

console.log(result.stringHSL({ alpha: ${alpha} }))); // ${result.stringHSL({ precision, alpha })} → ${result.name(
    nameOpts
  )}
`;
}
