import { Graphics } from "pixi.js";

export interface IWheelOptions {
  center: { x: number; y: number };
  radius: number;
  segments: string[];
  colors: string[];
  wheelAngle: number;
}

export class Wheel extends Graphics {
  private center: { x: number; y: number };
  private radius: number;
  private segments: string[];
  private colors: string[];
  private wheelAngle: number = 0;

  constructor(options: IWheelOptions) {
    super();
    this.center = options.center;
    this.radius = options.radius;
    this.segments = options.segments;
    this.colors = options.colors;
    this.wheelAngle = options.wheelAngle || 0;
    this.drawWheel();
  }

  //drawCtx(ctx: CanvasRenderingContext2D, wheelAngle: number): number {
  drawWheel(): void {
    const segmentAngle = (2 * Math.PI) / this.segments.length;

    for (let i = 0; i < this.segments.length; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Set fill color
      this.fillStyle = this.colors[i];

      // Draw segment
      this.beginPath();
      this.moveTo(this.center.x, this.center.y);
      this.arc(
        this.center.x,
        this.center.y,
        this.radius,
        this.wheelAngle + startAngle,
        this.wheelAngle + endAngle,
      );
      this.closePath();
      this.fill();

      this.moveTo(this.center.x, this.center.y);
      this.lineTo(
        this.center.x + this.radius * Math.cos(this.wheelAngle + startAngle),
        this.center.y + this.radius * Math.sin(this.wheelAngle + startAngle),
      );
      this.lineTo(
        this.center.x + this.radius * Math.cos(this.wheelAngle + endAngle),
        this.center.y + this.radius * Math.sin(this.wheelAngle + endAngle),
      );
      this.lineTo(this.center.x, this.center.y);
      this.closePath();
      this.stroke();

      //ctx.stroke();

      // this.save();
      // this.translate(this.center.x, this.center.y);
      // this.rotate(this.wheelAngle + (i + 0.5) * segmentAngle);
      // this.textAlign = "right";
      // this.fillStyle = "#000";
      // this.font = "45px Arial";
      // this.fillText(this.segments[i], this.radius - 30, 5);
      // this.restore();
    }

    // Draw center circle
    this.fillStyle = "black";
    this.beginPath();
    this.arc(this.center.x, this.center.y, this.radius * 0.1, 0, 2 * Math.PI);
    this.fill();
  }

  // publicdraw(): void {
  //   //this.fillStyle(this.colors[0]);
  //   this.drawCircle(this.center.x, this.center.y, this.radius);
  //   this.endFill();
  // }
}
