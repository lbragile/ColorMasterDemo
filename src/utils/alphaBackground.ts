// Based on https://stackoverflow.com/a/27667424/4298115
export function drawCheckeredBackground(ctx: CanvasRenderingContext2D): void {
  let { width: w, height: h } = ctx.canvas;

  const cols = h + 10;

  w /= cols; // width of a block
  h /= 2; // height of a block

  for (let j = 0; j < cols; j++) {
    ctx.rect(2 * j * w, 0, w, h); // first row
    ctx.rect((2 * j + 1) * w, h, w, h); // second row
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fill();
}
