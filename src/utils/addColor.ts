import CM from "colormaster";

type TColorMaster = ReturnType<typeof CM>;

export default function addColor(c1: TColorMaster, c2: TColorMaster, incArr: boolean[]): TColorMaster {
  const { h, s, l, a } = c2.hsla();

  const signs = incArr.map((val) => (val ? 1 : -1));

  const hueAlphaAdjusted = CM(c1.hsla())
    .hueBy(signs[0] * h)
    .alphaBy(signs[3] * a);

  const saturationAdjusted = incArr[1] ? hueAlphaAdjusted.saturateBy(s) : hueAlphaAdjusted.desaturateBy(s);
  return incArr[2] ? saturationAdjusted.lighterBy(l) : saturationAdjusted.darkerBy(l);
}
