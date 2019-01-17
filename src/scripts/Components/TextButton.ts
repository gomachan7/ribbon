export class TextButton extends Phaser.GameObjects.Text {
  private outColor: string;
  private hoverColor: string;
  private activeColor: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    style: object,
    onClicked: () => void
  ) {
    super(scene, x, y, text, style);

    this.hoverColor = style['hoverColor'] || '#000';
    this.outColor = style['outColor'] || '#000';
    this.activeColor = style['activeColor'] || '#000';

    this.onOut();
    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.onHover())
      .on('pointerout', () => this.onOut())
      .on('pointerdown', () => this.onActive())
      .on('pointerup', () => {
        this.onHover();
        onClicked();
      });
  }

  private onOut() {
    this.setStyle({ fill: this.outColor });
  }

  private onHover() {
    this.setStyle({ fill: this.hoverColor });
  }

  private onActive() {
    this.setStyle({ fill: this.activeColor });
  }
}
