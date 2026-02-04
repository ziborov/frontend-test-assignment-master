import { animate } from "motion";

import { randomFloat, randomInt } from "../../../engine/utils/random";
import { waitFor } from "../../../engine/utils/waitFor";

import { DIRECTION, Logo } from "./Logo";
import type { MainScreen } from "./MainScreen";
import { Wheel, IWheelOptions } from "./Wheel";
import { WinArrow } from "./WinArrow";
import { FancyButton } from "@pixi/ui";
import { WinningPopup } from "../../popups/WinningPopup";
import { engine } from "../../getEngine";
import { Label } from "../../ui/Label";

export class Bouncer {
  private static readonly LOGO_COUNT = 4;
  private static readonly ANIMATION_DURATION = 1;
  private static readonly WAIT_DURATION = 0.5;
  private static readonly WHEEL_SECTIONS_QUANTITY = 8;
  private readonly BET = 10;

  public screen!: MainScreen;

  private allLogoArray: Logo[] = [];
  private activeLogoArray: Logo[] = [];
  private yMin = -400;
  private yMax = 400;
  private xMin = -400;
  private xMax = 400;
  private wheel!: Wheel;
  private wheelRotation = false;
  private wheelRotationAngle = 0;
  private wheelRotationDecrementSpeed = 0;
  private wheelTargetAngle = 0;
  private playButton: FancyButton = new FancyButton({});
  private sectionIndex = 0;
  private winArrow: WinArrow = new WinArrow();
  private balance: Label = new Label();
  private win: Label = new Label();
  private balanceValue = 1000;

  constructor(balance: Label, win: Label) {
    this.balance = balance;
    this.win = win;
  }

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    for (let i = 0; i < Bouncer.LOGO_COUNT; i++) {
      this.add();
      await waitFor(Bouncer.WAIT_DURATION);
    }
    this.wheelAdd();
    this.winArrowAdd();
  }

  public add(): void {
    const width = randomFloat(this.xMin, this.xMax);
    const height = randomFloat(this.yMin, this.yMax);
    const logo = new Logo();

    logo.alpha = 0;
    logo.position.set(width, height);
    animate(logo, { alpha: 1 }, { duration: Bouncer.ANIMATION_DURATION });
    this.screen.mainContainer.addChild(logo);
    this.allLogoArray.push(logo);
    this.activeLogoArray.push(logo);
  }

  public wheelAdd(): void {
    const options: IWheelOptions = {
      center: { x: 0, y: 0 },
      radius: 400,
      segments: [2.0, 50.0, 500.0, 2.0, 100.0, 50.0, 2.0, 75.0],
      colors: [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#F333FF",
        "#33FFF5",
        "#F5FF33",
        "#FF33A8",
        "#A833FF",
      ],
      weights: [200, 76, 12, 200, 62, 81, 200, 74],
      weightsIndexes: [],
    };

    for (let i = 0; i < options.weights.length; i++) {
      const weight = options.weights[i];
      for (let j = 0; j < weight; j++) {
        options.weightsIndexes.push(i);
      }
    }

    this.wheel = new Wheel(options);
    this.wheel.alpha = 1;
    this.wheel.position.set(0, 0);
    animate(this.wheel, { alpha: 1 }, { duration: Bouncer.ANIMATION_DURATION });
    this.screen.mainContainer.addChild(this.wheel);
  }

  public winArrowAdd(): void {
    this.winArrow.position.set(550, 0);
    this.screen.mainContainer.addChild(this.winArrow);
  }

  private startWheelRotation(): void {
    this.wheelRotationAngle = Math.PI * 2 * 20;
    this.wheel.rotation = this.wheelRotationAngle;
    this.wheelRotationDecrementSpeed = 0.3;
    this.wheelRotation = true;
    const sectorAngle = -(Math.PI * 2) / Bouncer.WHEEL_SECTIONS_QUANTITY;
    this.wheelTargetAngle = sectorAngle * this.sectionIndex - Math.PI / 8;
    engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });
  }

  private stopWheelRotation(): void {
    this.wheelRotation = false;
  }

  public remove(): void {
    const logo = this.activeLogoArray.pop();
    if (logo) {
      animate(logo, { alpha: 0 }, { duration: Bouncer.ANIMATION_DURATION })
        .then(() => {
          this.screen.mainContainer.removeChild(logo);
          const index = this.allLogoArray.indexOf(logo);
          if (index !== -1) this.allLogoArray.splice(index, 1);
        })
        .catch((error) => {
          console.error("Error during logo removal animation:", error);
        });
    }
    if (this.wheel) {
      animate(
        this.wheel,
        { alpha: 0 },
        { duration: Bouncer.ANIMATION_DURATION },
      )
        .then(() => {
          this.screen.mainContainer.removeChild(this.wheel);
        })
        .catch((error) => {
          console.error("Error during wheel removal animation:", error);
        });
    }
  }

  public play(playButton: FancyButton): boolean {
    this.playButton = playButton;
    this.wheelRotation = !this.wheelRotation;
    if (this.wheelRotation) {
      const randomIndex = randomInt(0, this.wheel.weightsIndexes.length - 1);
      this.sectionIndex = this.wheel.weightsIndexes[randomIndex];
      this.balanceValue -= this.BET;
      this.balance.text = `Balance: ${this.balanceValue}`;
      this.startWheelRotation();
      return false;
    } else {
      this.stopWheelRotation();
      return true;
    }
  }

  private setWinning(): void {
    this.wheelRotation = false;
    if (this.playButton) {
      this.playButton.text = "Press to spin";
    }
    this.win.text = `Win: ${this.wheel.segments[this.sectionIndex]}`;
    this.balanceValue += this.wheel.segments[this.sectionIndex] as number;
    this.balance.text = `Balance: ${this.balanceValue}`;
    WinningPopup.WINNING_STRING = `You won ${this.wheel.segments[this.sectionIndex]}!`;
    engine().navigation.presentPopup(WinningPopup);
  }

  private wheelRotationDecrement(): void {
    // console.log(
    //   "this.wheelRotationAngle: ",
    //   this.wheelRotationAngle,
    //   "this.wheelRotationDecrementSpeed: ",
    //   this.wheelRotationDecrementSpeed,
    //   "this.wheelTargetAngle: ",
    //   this.wheelTargetAngle,
    // );
    this.wheel.rotation = this.wheelRotationAngle;
    this.wheelRotationAngle -= this.wheelRotationDecrementSpeed;
    this.wheelRotationDecrementSpeed = this.wheelRotationDecrementSpeed * 0.998;
  }

  private updateWheelRotation(): void {
    if (this.wheelRotationAngle < this.wheelTargetAngle) {
      this.setWinning();
    } else {
      this.wheelRotationDecrement();
    }
  }

  public update(): void {
    this.allLogoArray.forEach((entity) => {
      this.setDirection(entity);
      this.setLimits(entity);
    });
    if (this.wheel && this.wheelRotation) {
      this.updateWheelRotation();
    }
  }

  private setDirection(logo: Logo): void {
    if (this.wheelRotation) {
      switch (logo.direction) {
        case DIRECTION.NE:
          logo.x += logo.speed;
          logo.y -= logo.speed;
          break;
        case DIRECTION.NW:
          logo.x -= logo.speed;
          logo.y -= logo.speed;
          break;
        case DIRECTION.SE:
          logo.x += logo.speed;
          logo.y += logo.speed;
          break;
        case DIRECTION.SW:
          logo.x -= logo.speed;
          logo.y += logo.speed;
          break;
      }
    }
  }

  private setLimits(logo: Logo): void {
    const { position, top, bottom, left, right } = logo;
    let { direction } = logo;

    if (position.y + top <= this.yMin) {
      direction = direction === DIRECTION.NW ? DIRECTION.SW : DIRECTION.SE;
    }
    if (position.y + bottom >= this.yMax) {
      direction = direction === DIRECTION.SE ? DIRECTION.NE : DIRECTION.NW;
    }
    if (position.x + left <= this.xMin) {
      direction = direction === DIRECTION.NW ? DIRECTION.NE : DIRECTION.SE;
    }
    if (position.x + right >= this.xMax) {
      direction = direction === DIRECTION.NE ? DIRECTION.NW : DIRECTION.SW;
    }

    logo.direction = direction;
  }

  public resize(w: number, h: number): void {
    this.xMin = -w / 2;
    this.xMax = w / 2;
    this.yMin = -h / 2;
    this.yMax = h / 2;
  }
}
