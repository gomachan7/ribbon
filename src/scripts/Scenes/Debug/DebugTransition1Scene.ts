import { Transition, TransitionType } from 'Core/Transition/Transition';

export class DebugTransition1Scene extends Phaser.Scene {
  constructor() {
    super('DebugTransition1Scene');
  }

  init() {}

  preload() {}

  create() {
    this.add.text(20, 20, 'DebugTransition1Scene', { font: '24px Arial', fill: '#000' });
    this.cameras.main.setBackgroundColor('#90caf9');

    this.input.on('pointerdown', _ => {
      Transition.to(this, 'DebugTransition2Scene', TransitionType.Friends, 800);
    });
  }

  update(time: number, delta: number) {}
}
