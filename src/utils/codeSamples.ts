import { ColorMaster } from "colormaster";
import { TNumArr } from "colormaster/types";

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
