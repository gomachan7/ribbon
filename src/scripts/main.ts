import 'phaser-custom';
import { UISettings } from 'Constants/UISettings';
import { EmptyScene } from 'Scenes/EmptyScene';

const config = {
  title: APP_TITLE,
  version: APP_VERSION,
  type: Phaser.AUTO,
  width: UISettings.width,
  height: UISettings.height,
  scene: [EmptyScene],
  scaleMode: Phaser.DOM.CONTAIN,
  resolution: window.devicePixelRatio,
  parent: 'game-container'
};

const game = new Phaser.Game(config);

// Fix canvas size on a wide screen
if (UISettings.width > UISettings.height) {
  game.canvas.style.maxWidth = UISettings.width + 'px';
} else {
  game.canvas.style.maxHeight = UISettings.height + 'px';
}

// Specify logical coordinates(indipendent from canvas size)
game.resize(UISettings.width, UISettings.height);

// Prevent zoom by pinch in/out
document.ontouchstart = event => {
  return event.touches.length > 1;
};

window.onresize = window.onorientationchange = event => {};
