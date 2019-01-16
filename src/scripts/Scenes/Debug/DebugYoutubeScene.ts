import { YoutubePlayer } from 'Core/Movie/YoutubePlayer';

export class DebugYoutubeScene extends Phaser.Scene {
  private youtuberPlayer: YoutubePlayer;

  constructor() {
    super('DebugYoutubeScene');
  }

  init() {
    this.events.on('shutdown', () => this.shutdown());
  }

  preload() {}

  create() {
    const videoId = 'F-F4CZoUoxg';

    this.youtuberPlayer = new YoutubePlayer();
    this.youtuberPlayer.createPlayer(videoId).subscribe({
      next: player => {
        player.playVideo();
      },
      error: e => console.log('Error occured: ', e),
      complete: () => console.log('Player is now available')
    });

    this.youtuberPlayer.onStatusChanged.subscribe({
      next: status => {
        console.log(status);
      },
      error: e => console.log('Error occured: ', e),
      complete: () => console.log('Tracking Status is end')
    });
  }

  update(time: number, delta: number) {}

  private shutdown() {
    if (this.youtuberPlayer) {
      this.youtuberPlayer.deletePlayer();
      this.youtuberPlayer = null;
    }
  }
}
