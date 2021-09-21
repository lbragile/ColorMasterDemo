import CM from "colormaster";

type TColorMaster = ReturnType<typeof CM>;

export default function addColor(c1: TColorMaster, c2: TColorMaster, dropdownValues: ("Add" | "Sub")[]): TColorMaster {
  const { h, s, l, a } = c2.hsla();

  const hueAlphaAdjusted = CM(c1.hsla())
    .hueBy((dropdownValues[0] === "Add" ? 1 : -1) * h)
    .alphaBy((dropdownValues[dropdownValues.length - 1] === "Add" ? 1 : -1) * a);

  const saturationAdjusted =
    dropdownValues[1] === "Add" ? hueAlphaAdjusted.saturateBy(s) : hueAlphaAdjusted.desaturateBy(s);
  return dropdownValues[2] === "Add" ? saturationAdjusted.lighterBy(l) : saturationAdjusted.darkerBy(l);
}
