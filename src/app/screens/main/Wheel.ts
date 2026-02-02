import { Graphics, Text, TextStyle } from "pixi.js";

export interface IWheelOptions {
  center: { x: number; y: number };
  radius: number;
  segments: string[];
  colors: string[];
}

export class Wheel extends Graphics {
  private center: { x: number; y: number };
  private radius: number;
  private segments: string[];
  private colors: string[];

  constructor(options: IWheelOptions) {
    super();
    this.center = options.center;
    this.radius = options.radius;
    this.segments = options.segments;
    this.colors = options.colors;
    this.drawWheel();
  }

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
      this.arc(this.center.x, this.center.y, this.radius, startAngle, endAngle);
      this.closePath();
      this.fill();

      const positionTextAngle = startAngle + segmentAngle / 2;

      const style = new TextStyle({
        fontSize: 100,
        fill: "#000000",
        align: "center",
        fontFamily: "Arial",
        fontWeight: "bold",
      });
      const text = new Text({ text: this.segments[i], style });
      text.anchor.set(0.5);
      text.position.set(
        this.center.x + this.radius * 0.6 * Math.cos(positionTextAngle),
        this.center.y + this.radius * 0.6 * Math.sin(positionTextAngle),
      );
      text.rotation = (i + 0.5) * segmentAngle;
      this.addChild(text); // Text inherits Graphics positioning
    }

    // Draw center circle
    this.fillStyle = "black";
    this.beginPath();
    this.arc(this.center.x, this.center.y, this.radius * 0.1, 0, 2 * Math.PI);
    this.fill();
  }
}
