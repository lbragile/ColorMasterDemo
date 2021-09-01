import { ColorMaster } from "colormaster";
import { THarmony, TMonoEffect, TNumArr } from "colormaster/types";

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
  color1: ColorMaster,
  color2: ColorMaster,
  ratio: number,
  otherMix: { colord: string; tiny: string }
): string {
  const precision = [2, 2, 2, 2] as Required<TNumArr>;
  return `import CM, { extendPlugins } from 'colormaster';
import MixPlugin from "colormaster/plugins/mix";

extendPlugins([MixPlugin]); // add ColorMaster's mix plugin

const color1 = CM("${color1.stringRGB({ precision })}");
const color2 = CM("${color2.stringRGB({ precision })}");
const ratio = ${ratio};

const mix = color1.mix(color2, ratio);
console.log(mix.stringHSL()); // ${color1.mix(color2, ratio).stringHSL()}

/**
 * COLORD
 * import { colord, extend } from "colord";
 * extend([colordMixPlugin]);
 * 
 * const colordMix = colord(${color1.stringRGB({ precision })}).mix(${color2.stringRGB({ precision })}, ${ratio});
 * console.log(colordMix.toHslString()); // ${otherMix.colord}
 * 
 * TINYCOLOR2
 * import tinycolor from "tinycolor2";
 * 
 * const tinyMix = tinycolor.mix(${color1.stringRGB({ precision })}, ${color2.stringRGB({ precision })}, ${
    ratio * 100
  });
 * console.log(tinyMix.toHslString()); // ${otherMix.tiny}
 */
`;
}
