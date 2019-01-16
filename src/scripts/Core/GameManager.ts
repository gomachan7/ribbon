import { DebugYoutubeScene } from 'Scenes/Debug/DebugYoutubeScene';
import { DebugPlaygroundScene } from 'Scenes/Debug/DebugPlaygroundScene';
import { UISettings } from 'Constants/UISettings';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export class GameManager {
  private static instance: GameManager;
  private game: Phaser.Game;
  private onResizeEvent: Observable<{ width; height }>;

  private constructor() {
    this.initializeGame();

    this.onResizeEvent = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange'),
      of(true)
    ).pipe(
      shareReplay(1),
      map(v => {
        return { width: this.canvasWidth, height: this.canvasHeight };
      })
    );
  }

  static initialize() {
    GameManager.shared;
  }

  static get shared(): GameManager {
    if (!this.instance) {
      this.instance = new GameManager();
    }

    return this.instance;
  }

  get worldWidth(): number {
    return UISettings.width;
  }

  get worldHeight(): number {
    return UISettings.height;
  }

  get canvasWidth(): number {
    return this.calculateCurrentCanvasSize()[0];
  }

  get canvasHeight(): number {
    return this.calculateCurrentCanvasSize()[1];
  }

  get onResize(): Observable<{ width; height }> {
    return this.onResizeEvent;
  }

  private initializeGame() {
    // Initialize Phaser
    const config = {
      title: APP_TITLE,
      version: APP_VERSION,
      type: Phaser.AUTO,
      width: UISettings.width,
      height: UISettings.height,
      scene: [DebugPlaygroundScene, DebugYoutubeScene],
      scaleMode: Phaser.DOM.CONTAIN,
      resolution: window.devicePixelRatio,
      parent: 'game-container',
      transparent: true
    };

    this.game = new Phaser.Game(config);

    // Fix canvas size on a wide screen
    this.game.canvas.style.maxWidth = UISettings.width + 'px';
    this.game.canvas.style.maxHeight = UISettings.height + 'px';

    // Specify logical coordinates(indipendent from canvas size)
    this.game.resize(UISettings.width, UISettings.height);
  }

  private calculateCurrentCanvasSize(): [number, number] {
    if (!this.game) {
      return [UISettings.width, UISettings.height];
    }

    const ratio = UISettings.width / UISettings.height;
    const containerWidth = this.game.canvas.clientWidth;
    const containerHeight = this.game.canvas.clientHeight;

    let trueWidth = 0;
    let trueHeight = 0;

    if (ratio >= 1) {
      // landscape
      if (containerWidth > containerHeight * ratio) {
        trueHeight = containerHeight;
        trueWidth = containerHeight * ratio;
      } else {
        trueWidth = containerWidth;
        trueHeight = trueWidth / ratio;
      }
    } else {
      // portrait
      if (containerHeight * ratio > containerWidth) {
        trueWidth = containerWidth;
        trueHeight = containerWidth / ratio;
      } else {
        trueHeight = containerHeight;
        trueWidth = trueHeight * ratio;
      }
    }

    return [trueWidth, trueHeight];
  }
}
