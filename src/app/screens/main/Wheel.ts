import { Sprite } from "pixi.js";

export interface IWheelOptions {
  center: { x: number; y: number };
  radius: number;
  segments: string[];
  colors: string[];
  whellAngle: number;
}

export class Wheel extends Sprite {
  private center: { x: number; y: number };
  private radius: number;
  private segments: string[];
  private colors: string[];
  public whellAngle: number;

  constructor(options: IWheelOptions) {
    super();
    this.center = options.center;
    this.radius = options.radius;
    this.segments = options.segments;
    this.colors = options.colors;
    this.whellAngle = 0;
  }

  draw(ctx: CanvasRenderingContext2D, whellAngle: number): number {
    this.whellAngle = whellAngle;
    const segmentAngle = (2 * Math.PI) / this.segments.length;

    for (let i = 0; i < this.segments.length; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Set fill color
      ctx.fillStyle = this.colors[i];

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.arc(
        this.center.x,
        this.center.y,
        this.radius,
        this.whellAngle + startAngle,
        this.whellAngle + endAngle,
      );
      ctx.closePath();
      ctx.fill();

      //ctx.stroke();

      ctx.save();
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate(this.whellAngle + (i + 0.5) * segmentAngle);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "45px Arial";
      ctx.fillText(this.segments[i], this.radius - 30, 5);
      ctx.restore();
    }

    // Draw center circle
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius * 0.1, 0, 2 * Math.PI);
    ctx.fill();

    return this.whellAngle;
  }
}
