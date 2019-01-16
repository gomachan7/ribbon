export class DebugPlaygroundScene extends Phaser.Scene {
  constructor() {
    super('DebugPlaygroundScene');
  }

  init() {}

  preload() {}

  create() {
    this.add.text(0, 0, 'DebugPlaygroundScene', { font: '24px Arial', fill: '#000' });

    /* Temprary workspace to experiment with something codes */
  }

  update(time: number, delta: number) {}
}
