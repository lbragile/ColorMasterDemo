// Based on https://stackoverflow.com/a/27667424/4298115
export function drawCheckeredBackground(ctx: CanvasRenderingContext2D, vertical?: boolean): void {
  let { width: w, height: h } = ctx.canvas;

  const numBlocks = (vertical ? w : h) + 10;

  // calculate width and height of blocks
  w /= vertical ? 2 : numBlocks;
  h /= vertical ? numBlocks : 2;

  for (let j = 0; j < numBlocks; j++) {
    ctx.rect(vertical ? 0 : 2 * j * w, vertical ? 2 * j * h : 0, w, h); // first row/col
    ctx.rect(vertical ? w : (2 * j + 1) * w, vertical ? (2 * j + 1) * h : h, w, h); // second row/col
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fill();
}
