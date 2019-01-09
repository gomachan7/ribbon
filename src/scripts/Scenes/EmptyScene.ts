import { ImageAssets } from 'Assets/ImageAssets';

export class EmptyScene extends Phaser.Scene {
  constructor(config: string) {
    super(config);
  }

  preload() {
    this.load.image(ImageAssets.sample1.key, ImageAssets.sample1.path);
    this.load.image(ImageAssets.sample2.key, ImageAssets.sample2.path);
  }

  create() {
    this.add
      .image(0, 0, ImageAssets.sample1.key)
      .setOrigin(0, 0)
      .setDisplaySize(300, 300);

    this.add
      .image(0, 300, ImageAssets.sample2.key)
      .setOrigin(0, 0)
      .setDisplaySize(300, 300);

    this.add.text(0, 600, 'Hello World', { font: '32px Arial' });
  }

  update(time: number, delta: number) {}
}
