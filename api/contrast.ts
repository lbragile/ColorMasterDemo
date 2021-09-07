import { VercelRequest, VercelResponse } from "@vercel/node";
import CM, { extendPlugins } from "colormaster";
import A11yPlugin from "colormaster/plugins/accessibility";
import NamePlugin from "colormaster/plugins/name";

extendPlugins([A11yPlugin, NamePlugin]);

const sizes = ["body", "large"] as ("body" | "large")[];
const levels = ["minimum", "enhanced"] as ("minimum" | "enhanced")[];

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
