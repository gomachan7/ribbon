import { UISettings } from 'Constants/UISettings';
import { TransitionSceneParam } from 'Core/Transition/Transition';

export class KokoTransitionScene extends Phaser.Scene {
  constructor() {
    super('KokoTransitionScene');
  }

  private targetScene: string;
  private halfDuration: number;
  private rect: Phaser.GameObjects.Rectangle;
  private arkMask: Phaser.GameObjects.Graphics;
  private flapTrigger: boolean;
  private flapStartTime: number;
  private readonly intervalMs: number = 32;

  init(data: TransitionSceneParam) {
    this.targetScene = data.target;
    this.halfDuration = data.halfDuration;
    this.flapTrigger = false;
    this.flapStartTime = 0;
  }

  create() {
    this.scene.moveAbove(this.scene.key, this.targetScene);

    this.arkMask = this.add.graphics();
    this.rect = this.add
      .rectangle(0, 0, UISettings.width, UISettings.height, 0x000000)
      .setOrigin(0, 0);
    this.rect.setMask(this.arkMask.createGeometryMask());

    this.tweens.timeline({
      tweens: [
        {
          targets: this.rect, // dummy target
          duration: this.halfDuration,
          alpha: 1.0,
          offset: 0,
          onUpdate: v => {
            const progress = Math.min(1.0, v.totalElapsed / this.halfDuration);
            this.drawArcMask(270, 270 - 360 * progress);
          },
          onComplete: () => {
            this.scene.moveBelow(this.scene.key, this.targetScene);
          }
        },
        {
          targets: this.rect, // dummy target
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
          targets: this.rect, // dummy target
          alpha: 1.0,
          duration: this.halfDuration,
          offset: this.halfDuration + this.intervalMs,
          onUpdate: v => {
            const progress = Math.min(
              1.0,
              (v.totalElapsed - this.halfDuration - this.intervalMs) / this.halfDuration
            );
            this.drawArcMask(270, -90 + 360 * progress);
          },
          onComplete: () => {
            this.arkMask.visible = false;
            this.rect.visible = false;
          }
        }
      ]
    });
  }

  update(time: number, delta: number) {}

  private drawArcMask(from: number, to: number) {
    this.arkMask.clear();
    this.arkMask.slice(
      UISettings.width * 0.5,
      UISettings.height * 0.5,
      Math.max(UISettings.width * 0.5, UISettings.height * 0.5) * 1.5,
      Phaser.Math.DegToRad(from),
      Phaser.Math.DegToRad(to),
      true
    );
    this.arkMask.fillPath();
  }
}
