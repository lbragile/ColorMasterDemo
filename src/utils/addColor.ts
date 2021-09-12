import CM from "colormaster";

type TColorMaster = ReturnType<typeof CM>;

export default function addColor(c1: TColorMaster, c2: TColorMaster, isIncrement: boolean): TColorMaster {
  const sign = isIncrement ? 1 : -1;
  const { h, s, l, a } = c2.hsla();

  const hueAlphaAdjusted = CM(c1.hsla())
    .hueBy(sign * h)
    .alphaBy(sign * a);

  return isIncrement ? hueAlphaAdjusted.saturateBy(s).lighterBy(l) : hueAlphaAdjusted.desaturateBy(s).darkerBy(l);
}
