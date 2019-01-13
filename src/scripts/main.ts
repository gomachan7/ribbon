import 'phaser-custom';
import { GameManager } from 'Core/GameManager';



// Initialize Game
GameManager.initialize();

// Prevent zoom by pinch in/out
document.ontouchstart = event => {
  return event.touches.length > 1;
};
