import 'phaser-custom';
import JSS from 'jss';
import JSSPreset from 'jss-preset-default/dist/jss-preset-default';

import { GameManager } from 'Core/GameManager';

// Initialize JSS with preset
JSS.setup(JSSPreset());

// Initialize Game
GameManager.initialize();

// Prevent zoom by pinch in/out
document.ontouchstart = event => {
  return event.touches.length > 1;
};
