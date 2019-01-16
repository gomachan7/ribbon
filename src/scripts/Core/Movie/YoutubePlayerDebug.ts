import * as dat from 'dat.gui';
import { YoutubePlayer } from './YoutubePlayer';

export class YoutubePlayerDebug {
  private gui: dat.GUI;
  private player: YT.Player;

  private currentTime: number = 0;
  private volume: number = 0;
  private isMuted: boolean = false;
  private requestAnimationID: number;

  constructor(player: YT.Player) {
    this.player = player;
    this.volume = this.player.getVolume();
    this.isMuted = this.player.isMuted();

    this.gui = new dat.GUI({ name: 'YoutubePlayer' });
    // Make SeekBar
    this.gui
      .add(this, 'currentTime', 0, this.player.getDuration())
      .listen()
      .step(0.001)
      .onChange(v => {
        this.player.pauseVideo();
        this.currentTime = v;
      })
      .onFinishChange(v => {
        this.player.playVideo();
        this.player.seekTo(v, true);
        this.currentTime = v;
      });

    this.gui
      .add(this, 'volume', 0, 100)
      .step(1)
      .onChange(v => {
        this.player.setVolume(v);
      });

    this.gui.add(this, 'isMuted').onChange(v => {
      v ? this.player.mute() : this.player.unMute();
    });
    this.gui.add(this, 'togglePlaying');

    // Express progress bar
    this.startAnimationLoop();
  }

  terminate() {
    this.stopAnimationLoop();
    this.gui.destroy();
    this.player = null;
  }

  private togglePlaying() {
    this.player.getPlayerState() == YT.PlayerState.PLAYING
      ? this.player.pauseVideo()
      : this.player.playVideo();
  }

  private startAnimationLoop() {
    this.requestAnimationID = window.requestAnimationFrame(this.animationLoop.bind(this));
  }

  private stopAnimationLoop() {
    window.cancelAnimationFrame(this.requestAnimationID);
  }

  private animationLoop() {
    if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
      this.currentTime = this.player.getCurrentTime();
    }
    this.requestAnimationID = window.requestAnimationFrame(this.animationLoop.bind(this));
  }
}
