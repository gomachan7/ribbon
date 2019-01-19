import { UISettings } from 'Constants/UISettings';
import { TransitionSceneParam } from 'Core/Transition/Transition';

const BarWidth = 18;
const Padding = 6;
const TotalBarWidth = BarWidth + Padding;

class ColorBar extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
    super(scene, x, y);

    const baseRect = scene.add.rectangle(0, 0, TotalBarWidth, 1, 0xffffff).setOrigin(0, 0);
    const rect1 = scene.add
      .rectangle(0, 0, BarWidth, 1, color)
      .setOrigin(0, 0)
      .setX(Padding * 0.5);
    this.add(baseRect);
    this.add(rect1);
  }
}

export class FriendsTransitionScene extends Phaser.Scene {
  constructor() {
    super('FriendsTransitionScene');
  }

  private targetScene: string;
  private halfDuration: number;
  private readonly intervalMs: number = 32;

  init(data: TransitionSceneParam) {
    this.targetScene = data.target;
    this.halfDuration = data.halfDuration;
  }

  create() {
    this.scene.moveAbove(this.scene.key, this.targetScene);

    const totalBarLength = 1800;
    const barOffset = 450;
    const stopTime = 50;

    const pinkContainer = this.add.container(0, 0);
    const blueContainer = this.add.container(0, 0);
    const container = this.add.container(0, 0);
    container.setY(UISettings.height * 0.5 - UISettings.width * 0.5);
    for (let i = 0; i < 30; ++i) {
      const pinkBar = new ColorBar(this, i * 2 * TotalBarWidth, 0, 0xf5b9e5);
      pinkContainer.add(pinkBar);
      pinkContainer.setX(-TotalBarWidth * 8);
      pinkContainer.setY(barOffset);
      pinkContainer.scaleY = totalBarLength;

      const blueBar = new ColorBar(this, TotalBarWidth + i * 2 * TotalBarWidth, 0, 0x81b6f9);
      blueContainer.add(blueBar);
      blueContainer.setX(-TotalBarWidth * 8);
      blueContainer.setY(-barOffset);
      blueContainer.scaleY = -totalBarLength;
    }

    container.add(pinkContainer);
    container.add(blueContainer);
    container.rotation = Phaser.Math.DegToRad(45);

    this.tweens.timeline({
      tweens: [
        {
          targets: pinkContainer,
          y: (-barOffset * 2 - totalBarLength) * 0.5,
          duration: this.halfDuration - stopTime * 0.5,
          offset: 0
        },
        {
          targets: blueContainer,
          y: (barOffset * 2 + totalBarLength) * 0.5,
          duration: this.halfDuration - stopTime * 0.5,
          offset: 0,
          onComplete: () => {
            this.scene.moveBelow(this.scene.key, this.targetScene);
          }
        },
        {
          targets: container, // dummy target
          alpha: 1.0,
          duration: this.intervalMs,
          offset: this.halfDuration,
          onComplete: () => {
            this.scene.transition({
              target: this.targetScene,
              duration: this.halfDuration
            });
          }
        },
        {
          targets: pinkContainer,
          y: -barOffset * 2 - totalBarLength,
          duration: this.halfDuration - stopTime * 0.5,
          offset: this.halfDuration + stopTime * 0.5
        },
        {
          targets: blueContainer,
          y: barOffset * 2 + totalBarLength,
          duration: this.halfDuration - stopTime * 0.5,
          offset: this.halfDuration + stopTime * 0.5
        }
      ]
    });
  }

  update(time: number, delta: number) {}
}
