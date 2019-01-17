import { Transition, TransitionType } from 'Core/Transition/Transition';

export class DebugTransition2Scene extends Phaser.Scene {
  constructor() {
    super('DebugTransition2Scene');
  }

  init() {}

  preload() {}

  create() {
    this.add.text(20, 20, 'DebugTransition2Scene', { font: '24px Arial', fill: '#000' });
    this.cameras.main.setBackgroundColor('#c5e1a5');

    this.input.on('pointerdown', _ => {
      Transition.to(this, 'DebugTransition1Scene', TransitionType.Koko, 800);
    });
  }

  update(time: number, delta: number) {}
}
