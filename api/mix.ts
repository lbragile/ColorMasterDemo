import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import { TFormat } from "colormaster/types";
import MixPlugin from "colormaster/plugins/mix";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([MixPlugin, NamePlugin]);

const validColorspace = ["rgb", "hex", "hsl", "hsv", "hwb", "lab", "lch", "luv", "uvw", "ryb", "cmyk", "xyz"];

module.exports = (req: VercelRequest, res: VercelResponse) => {
  const { primary, secondary, ratio: r, colorspace: c } = req.query as { [key: string]: string };

  const ratio = Number(r ?? 0.5);
  const colorspace = (c ?? "luv") as Exclude<TFormat, "invalid" | "name">;

  if (
    CM(primary).isValid() &&
    CM(primary).isValid() &&
    0 <= ratio &&
    ratio <= 1 &&
    validColorspace.includes(colorspace)
  ) {
    const result = CM(primary)
      .mix({ color: CM(secondary), ratio, colorspace })
      .stringHEX()
      .slice(1)
      .toLowerCase();

    const [primaryName, secondaryName, resultName] = [primary, secondary, result].map((c) =>
      CM(c).name({ exact: false })
    );
    res.json({ primary, primaryName, secondary, secondaryName, result, resultName, ratio, colorspace });
  } else {
    res.status(400).json({ error: "Invalid data provided" });
  }
};
