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
