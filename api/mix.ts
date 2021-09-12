import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import { TFormat } from "colormaster/types";
import MixPlugin from "colormaster/plugins/mix";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([MixPlugin, NamePlugin]);

const validColorspace = ["rgb", "hex", "hsl", "hsv", "hwb", "lab", "lch", "luv", "uvw", "ryb", "cmyk", "xyz"];

/**
 * @swagger
 * /api/mix:
 *   get:
 *     summary: Information from mixing two colors
 *     description: Information from mixing two colors at a given `ratio` in `colorspace`.
 *                  The colorspace can be any of the ones supported by ColorMaster.
 *     tags:
 *       - ColorMaster
 *
 *     parameters:
 *       - in: query
 *         name: primary
 *         required: true
 *         description: Original color that is used in the mixing process
 *         default: ffff00ff
 *         schema:
 *           type: string
 *       - in: query
 *         name: secondary
 *         required: true
 *         description: Another color to mix with the primary color
 *         default: 0000ffff
 *         schema:
 *           type: string
 *       - in: query
 *         name: ratio
 *         required: false
 *         description: The proportions to use when mixing the colors. Must be in range [0, 1]
 *         default: 0.5
 *         schema:
 *           type: float
 *       - in: query
 *         name: colorspace
 *         required: false
 *         description: "A colorspace supported by [ColorMaster](https://www.npmjs.com/package/colormaster#-color-space-plugins). Mixing is performed in this colorspace."
 *         default: luv
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Results from the mixture obtained by mixing `primary` with `secondary` with proportions given by `ratio` in `colorspace`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 primary:
 *                   type: string
 *                   example: 'ffff00ff'
 *                 primaryName:
 *                   type: string
 *                   example: 'yellow'
 *                 secondary:
 *                   type: string
 *                   example: '0000ffff'
 *                 secondaryName:
 *                   type: string
 *                   example: 'blue'
 *                 result:
 *                   type: string
 *                   example: "9898b4ff"
 *                 resultName:
 *                   type: string
 *                   example: "dark gray"
 *                 ratio:
 *                   type: integer
 *                   example: 0.5
 *                 colorspace:
 *                   type: string
 *                   example: luv
 *       400:
 *         description: Bad data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid data provided'
 */
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
