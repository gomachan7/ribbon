import * as dat from 'dat.gui';

export class DebugWindow {
  private game: Phaser.Game;
  private datGUI: dat.GUI;

  private sceneName: string = 'DebugPlaygroundScene';
  private bgColor: number[] = [0, 0, 0];
  private bgAlpha: number = 0.0;

  constructor(game: Phaser.Game) {
    this.game = game;

    this.datGUI = new dat.GUI();
    const basicFolder = this.datGUI.addFolder('Basic');
    basicFolder
      .add(this, 'sceneName', [
        'DebugPlaygroundScene',
        'DebugYoutubeScene',
        'DebugTransition1Scene',
        'DebugTransition2Scene'
      ])
      .onFinishChange(v => {
        this.startScene(v);
      });
    basicFolder.addColor(this, 'bgColor').onChange(v => {
      this.game.canvas.style.backgroundColor = `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${this.bgAlpha})`;
    });
    basicFolder
      .add(this, 'bgAlpha', 0, 1)
      .step(0.01)
      .onChange(v => {
        this.game.canvas.style.backgroundColor = `rgba(${this.bgColor[0]}, ${this.bgColor[1]}, ${
          this.bgColor[2]
        }, ${v})`;
      });
    basicFolder.open();
  }

  get GUI(): dat.GUI {
    return this.datGUI;
  }

  private startScene(key: string, param?: object) {
    this.stopAllScene();
    this.game.scene.start(key, param);
  }

  private stopAllScene() {
    this.game.scene.scenes.forEach(sceneKey => {
      this.game.scene.stop(sceneKey);
    });
  }
}
