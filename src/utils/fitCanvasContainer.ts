export function fitCanvasContainer(ctx: CanvasRenderingContext2D, height?: number): CanvasRenderingContext2D {
  ctx.canvas.style.width = "50%";
  ctx.canvas.width = ctx.canvas.offsetWidth;
  ctx.canvas.height = height ?? ctx.canvas.offsetWidth;
  return ctx;
}
