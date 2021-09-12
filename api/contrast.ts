import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([A11yPlugin, NamePlugin]);

const sizes = ["body", "large"] as ("body" | "large")[];
const levels = ["minimum", "enhanced"] as ("minimum" | "enhanced")[];

/**
 * @swagger
 * /api/contrast:
 *   get:
 *     summary: Contrast & Readability information from two colors
 *     description: Obtain `contrast` and `readability` related information from `foreground` and `background` colors.
 *
 *     tags:
 *       - ColorMaster
 *
 *     parameters:
 *       - in: query
 *         name: fgColor
 *         required: true
 *         description: The **foreground color** (text on top of background)
 *         default: ffff00ff
 *         schema:
 *           type: string
 *       - in: query
 *         name: bgColor
 *         required: true
 *         description: The **background color** (behind the text)
 *         default: 0000ffff
 *         schema:
 *           type: string
 *       - in: query
 *         name: ratio
 *         required: false
 *         description: Whether or not to add **:1** to the contrast
 *         default: true
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: size
 *         required: false
 *         description: "`body` or `large` indicating the text size"
 *         default: large
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Foreground & Background colors, their names, contrast, and readability information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fgColor:
 *                   type: string
 *                   example: 'ffff00ff'
 *                 fgColorName:
 *                   type: string
 *                   example: 'yellow'
 *                 bgColor:
 *                   type: string
 *                   example: '0000ffff'
 *                 bgColorName:
 *                   type: string
 *                   example: 'blue'
 *                 contrast:
 *                   type: string
 *                   example: '8.0016:1'
 *                 readableOn:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       size:
 *                         type: string
 *                         example: 'body'
 *                       level:
 *                         type: string
 *                         example: 'minimum'
 *                       readable:
 *                         type: boolean
 *                 ratio:
 *                   type: boolean
 *                   example: true
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
  const { fgColor, bgColor, ratio: r } = req.query as { [key: string]: string };

  const ratio = r === "true";

  if (CM(fgColor).isValid() && CM(bgColor).isValid()) {
    const contrast = CM(fgColor).contrast({ bgColor, ratio });
    const readableOn = sizes.flatMap((s) =>
      levels.map((l) => ({ size: s, level: l, readable: CM(fgColor).readableOn({ bgColor, size: s, level: l }) }))
    );

    const [fgColorName, bgColorName] = [fgColor, bgColor].map((c) => CM(c).name({ exact: false }));

    res.json({ fgColor, fgColorName, bgColor, bgColorName, contrast, readableOn, ratio });
  } else {
    res.status(400).json({ error: "Invalid data provided" });
  }
};
