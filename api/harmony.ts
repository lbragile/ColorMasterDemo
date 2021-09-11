import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import HarmonyPlugin from "colormaster/plugins/harmony";
import NamePlugin from "colormaster/plugins/name";
import { THarmony, TMonoEffect } from "colormaster/types";

extendPlugins([HarmonyPlugin, NamePlugin]);

const validTypes = [
  "analogous",
  "complementary",
  "split-complementary",
  "double-split-complementary",
  "triad",
  "rectangle",
  "square",
  "monochromatic"
];

const validEffects = ["tints", "shades", "tones"];

/**
 * @swagger
 * /api/harmony:
 *   get:
 *     summary: Color harmonies from an input color
 *     description: "Given a `type` with (optionally - for monochromatic types) `effect` & `amount`, returns the related color harmony group for the input color. See [color harmonies](https://www.canva.com/colors/color-wheel/) for more details"
 *
 *     tags:
 *       - ColorMaster
 *
 *     parameters:
 *       - in: query
 *         name: color
 *         required: true
 *         description: The main color from which the harmony is determined
 *         default: ffff00ff
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         description: "Harmony group type to find. One of: \"analogous\", \"complementary\", \"split-complementary\", \"double split-complementary\", \"triad\", \"rectangle\", \"square\", or \"monochromatic\""
 *         default: analogous
 *         schema:
 *           type: string
 *       - in: query
 *         name: effect
 *         required: false
 *         description: Only applies to monochromatic harmony type. Possible values are shades, tints, or tones
 *         default: shades
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         required: false
 *         description: Only applies to monochromatic harmony type. Number of harmony colors to return - in range [2, 10]
 *         default: 5
 *         schema:
 *           type: integer
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
 *                   example: 'ffff00ff'
 *                 colorName:
 *                   type: string
 *                   example: 'yellow'
 *                 result:
 *                   type: array
 *                   example: [
 *                              "ff8000ff",
 *                              "ffff00ff",
 *                              "80ff00ff"
 *                            ]
 *                 resultName:
 *                   type: array
 *                   example: [
 *                              "dark orange",
 *                              "yellow",
 *                              "chart reuse"
 *                            ]
 *                 type:
 *                   type: string
 *                   example: 'monochromatic'
 *                 effect:
 *                   type: string
 *                   example: 'shades'
 *                 amount:
 *                   type: integer
 *                   example: 5
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
  const { color, type: t, effect: e, amount: a } = req.query as { [key: string]: string };

  const amount = Number(a ?? 5);
  const type = (t ?? "analogous") as THarmony;
  const effect = (e ?? "shades") as TMonoEffect;

  if (
    CM(color).isValid() &&
    validTypes.includes(type) &&
    validEffects.includes(effect) &&
    2 <= amount &&
    amount <= 10
  ) {
    const result = CM(color)
      .harmony({ type, effect, amount })
      .map((c) => c.stringHEX().slice(1).toLowerCase());

    const [colorName, ...resultName] = [color, ...result].map((c) => CM(c).name({ exact: false }));

    res.json({ color, colorName, result, resultName, type, ...(type === "monochromatic" && { effect, amount }) });
  } else if (amount < 2 || amount > 10) {
    res.status(400).json({ error: "Amount must be in range [2, 10]" });
  } else if (!validEffects.includes(effect)) {
    res.status(400).json({ error: "Invalid effect. Use one of " + validEffects.join(", ") });
  } else if (!validTypes.includes(type)) {
    res.status(400).json({ error: "Invalid type. Use one of " + validTypes.join(", ") });
  } else {
    res.status(400).json({ error: "Invalid color format" });
  }
};
