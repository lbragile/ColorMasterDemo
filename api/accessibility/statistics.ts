import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([A11yPlugin, NamePlugin]);

/**
 * @swagger
 * /api/accessibility/statistics:
 *   get:
 *     summary: Provides various accessibility statistics for a given input color
 *     description: Provides the `brightness`, `luminance` and whether the color is `light/dark`, `warm/cool`, `tinted/shaded/toned`, or `pure hue`. Additionally, returns the closest `warm`, `cool`, `pure hue`, and `web safe` colors.
 *
 *     tags:
 *       - ColorMaster
 *
 *     parameters:
 *       - in: query
 *         name: color
 *         required: true
 *         description: The current color instance whose statistics will be computer
 *         default: dfaf20ff
 *         schema:
 *           type: string
 *       - in: query
 *         name: alpha
 *         required: false
 *         description: For each of the closest `warm`, `cool`, `pure hue`, and `web safe` colors, should the alpha channel be included?
 *         default: '[true,true,true,true]'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accessibility statistics for the input color.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 color:
 *                   type: string
 *                   example: 'dfaf20ff'
 *                 colorName:
 *                   type: string
 *                   example: 'golden rod'
 *                 warm:
 *                   type: string
 *                   example: 'dfaf20ff'
 *                 warmName:
 *                   type: string
 *                   example: 'golden rod'
 *                 cool:
 *                   type: string
 *                   example: 'afdf20ff'
 *                 coolName:
 *                   type: string
 *                   example: 'green yellow'
 *                 pure:
 *                   type: string
 *                   example: 'ffbf00ff'
 *                 pureName:
 *                   type: string
 *                   example: 'gold'
 *                 web:
 *                   type: string
 *                   example: 'cc9933ff'
 *                 webName:
 *                   type: string
 *                   example: 'peru'
 *                 alpha:
 *                   type: array
 *                   example: [true,true,true,true]
 *                 brightness:
 *                   type: float
 *                   example: 0.6786
 *                 luminance:
 *                   type: float
 *                   example: 0.4645
 *                 lightOrDark:
 *                   type: string
 *                   example: 'light'
 *                 warmOrCool:
 *                   type: string
 *                   example: 'warm'
 *                 pureHue:
 *                   type: object
 *                   properties:
 *                     pure:
 *                       type: boolean
 *                       example: true
 *                     reason:
 *                       type: string
 *                       example: "toned"
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
  const { color, alpha: a } = req.query as { [key: string]: string };

  const alpha = a ? JSON.parse(a) : new Array(4).fill(true);
  const warm = CM(color).closestWarm().stringHEX({ alpha: alpha[0] }).slice(1).toLowerCase();
  const cool = CM(color).closestCool().stringHEX({ alpha: alpha[1] }).slice(1).toLowerCase();
  const pure = CM(color).closestPureHue().stringHEX({ alpha: alpha[2] }).slice(1).toLowerCase();
  const web = CM(color).closestWebSafe().stringHEX({ alpha: alpha[3] }).slice(1).toLowerCase();

  const brightness = CM(color).brightness();
  const luminance = CM(color).luminance();
  const lightOrDark = CM(color).isLight() ? "light" : "dark";
  const warmOrCool = CM(color).isWarm() ? "warm" : "cool";
  const pureHue = CM(color).isPureHue();

  if (CM(color).isValid()) {
    const [colorName, warmName, coolName, pureName, webName] = [color, warm, cool, pure, web].map((c) =>
      CM(c).name({ exact: false })
    );

    res.json({
      color,
      colorName,
      warm,
      warmName,
      cool,
      coolName,
      pure,
      pureName,
      web,
      webName,
      alpha,
      brightness,
      luminance,
      lightOrDark,
      warmOrCool,
      pureHue
    });
  } else {
    res.status(400).json({ error: "Invalid data provided" });
  }
};
