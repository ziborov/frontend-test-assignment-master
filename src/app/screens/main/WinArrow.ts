import { Sprite, Texture } from "pixi.js";

export class WinArrow extends Sprite {
  constructor() {
    const tex = "arrow.png";
    super({ texture: Texture.from(tex), anchor: 0.5, scale: 1.0 });
  }
}
