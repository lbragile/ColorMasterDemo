import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([NamePlugin]);

/**
 * @swagger
 * /api/manipulate:
 *   get:
 *     summary: Various manipulations of an input color
 *     description: "Given an \"increment color\" (via `hueBy`, `satBy`, `lightBy`, and `alphaBy`), returns 4 new colors:
 *
 *                   ### 1. **Adjust**
 *
 *                   Input color + increment color (channel wise)
 *
 *                   ### 2. **Rotate**
 *
 *                   Input color + increment color's hue ONLY
 *
 *                   ### 3. **Invert**
 *
 *                   Input color hue + 180&deg; &amp; flip input color lightness. This also takes into account `alpha[2]` (flip alpha channel value?).
 *                   In RGB space this would be the same as assigning each channel → **255 - channel value**
 *
 *                   ### 4. **Grayscale**
 *
 *                   Input color **saturation = 0%** (completely desaturate). Changes are visible only when lightness of input color is modified
 *                  "
 *
 *     tags:
 *       - ColorMaster
 *
 *     parameters:
 *       - in: query
 *         name: color
 *         required: true
 *         description: The color from which all the manipulation colors, described above, are computed
 *         default: ffff0080
 *         schema:
 *           type: string
 *       - in: query
 *         name: isIncrement
 *         required: false
 *         description: Whether to add or subtract `hueBy`, `satBy`, `lightBy`, &amp; `alphaBy` to/from `color`
 *         default: true
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: hueBy
 *         required: false
 *         description: How much to increment/decrement the hue of `color`
 *         default: 72.0
 *         schema:
 *           type: float
 *       - in: query
 *         name: satBy
 *         required: false
 *         description: How much to increment/decrement the saturation of `color`
 *         default: 15.0
 *         schema:
 *           type: float
 *       - in: query
 *         name: lightBy
 *         required: false
 *         description: How much to increment/decrement the lightness of `color`
 *         default: 10
 *         schema:
 *           type: float
 *       - in: query
 *         name: alphaBy
 *         required: false
 *         description: How much to increment/decrement the alpha of `color` (expressed as percentage)
 *         default: 5
 *         schema:
 *           type: float
 *       - in: query
 *         name: alpha
 *         required: false
 *         description: "Whether or not to include alpha channels in the manipulation colors.
 *                       Each index corresponds to the respectively numbered manipulation color above.
 *                       For `invert` this also indicates if the alpha channel should also be flipped."
 *         default: "[true, true, true, true]"
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Relevant harmony information such as base color, its name, resulting harmony, and resulting harmony names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 color:
 *                   type: string
 *                   example: 'ffff0080'
 *                 colorName:
 *                   type: string
 *                   example: 'yellow (with opacity)'
 *                 adjust:
 *                   type: string
 *                   example: '33FF5C8D'
 *                 adjustName:
 *                   type: string
 *                   example: 'spring green (with opacity)'
 *                 rotate:
 *                   type: string
 *                   example: '00FF3380'
 *                 rotateName:
 *                   type: string
 *                   example: 'lime (with opacity)'
 *                 invert:
 *                   type: string
 *                   example: '0000FF7F'
 *                 invertName:
 *                   type: string
 *                   example: 'blue (with opacity)'
 *                 grayscale:
 *                   type: string
 *                   example: '80808080'
 *                 grayscaleName:
 *                   type: string
 *                   example: 'gray (with opacity)'
 *                 isIncrement:
 *                   type: boolean
 *                   example: true
 *                 alpha:
 *                   type: array
 *                   example: '[true, true, true, true]'
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
  const {
    color,
    hueBy: h,
    satBy: s,
    lightBy: l,
    alphaBy: a,
    isIncrement,
    alpha: alphaArr
  } = req.query as { [key: string]: string };

  const hueBy = Number(h ?? 72);
  const satBy = Number(s ?? 15);
  const lightBy = Number(l ?? 10);
  const alphaBy = a ? +a / 100 : 0.05;
  const alpha = JSON.parse(alphaArr);

  const sign = isIncrement === "true" ? 1 : -1;

  if (CM(color).isValid()) {
    const rotate = CM(color)
      .rotate(sign * hueBy)
      .stringHEX({ alpha: alpha[1] })
      .slice(1);
    const adjust = CM(rotate)
      .alphaBy(sign * alphaBy)
      .saturateBy(sign * satBy)
      .lighterBy(sign * lightBy)
      .stringHEX({ alpha: alpha[0] })
      .slice(1);
    const invert = CM(color).invert({ alpha: alpha[2] }).stringHEX({ alpha: alpha[2] }).slice(1);
    const grayscale = CM(color).grayscale().stringHEX({ alpha: alpha[3] }).slice(1);

    const [colorName, adjustName, rotateName, invertName, grayscaleName] = [
      color,
      adjust,
      rotate,
      invert,
      grayscale
    ].map((c) => CM(c).name({ exact: false }));

    res.json({
      color,
      colorName,
      adjust,
      adjustName,
      rotate,
      rotateName,
      invert,
      invertName,
      grayscale,
      grayscaleName,
      isIncrement,
      alpha
    });
  } else {
    res.status(400).json({ error: "Invalid color format" });
  }
};
