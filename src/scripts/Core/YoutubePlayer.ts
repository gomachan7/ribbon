import { BehaviorSubject, Observable, Subscription, Subject } from 'rxjs';
import { take, filter, mergeMap } from 'rxjs/operators';
import JSS from 'jss';
import { GameManager } from './GameManager';

// Dynamic loading YoutubeAPI
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Will be fired automatically on loaded YoutubeAPI
declare global {
  interface Window {
    onYouTubeIframeAPIReady(): void;
  }
}

Window.prototype.onYouTubeIframeAPIReady = () => {
  youtubeAPIIPrepared.next(true);
};

const youtubeAPIIPrepared = new BehaviorSubject<Boolean>(false);
const PlayerIDPrefix = 'youtube-player';

export class YoutubePlayer {
  private uuid: string;
  private player: YT.Player;
  private playerCSS: any;
  private playerElm: HTMLDivElement;
  private onResizeSubscription: Subscription;
  private subject: Subject<YT.PlayerState> = new Subject();

  constructor() {
    this.uuid = Phaser.Utils.String.UUID();
  }

  get isAvailable(): boolean {
    return this.player != null;
  }

  get onStatusChanged() {
    return this.subject;
  }

  createPlayer(videoId: string): Observable<YoutubePlayer> {
    const createPlayerObservable = Observable.create(observer => {
      if (this.isAvailable) {
        return observer.error('Player is already created');
      }

      // Prepare DOM for Youtube Player
      const playerId = PlayerIDPrefix + this.uuid;
      this.createDOM(playerId);

      // Replace target dom with iframe contains a video
      new YT.Player(playerId, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          loop: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 1,
          playsinline: 1
        },
        events: {
          onReady: evt => {
            this.onPlayerReady(evt);
            observer.next(this);
          },
          onStateChange: evt => {
            this.onPlayerStateChange(evt);
          },
          onError: evt => {
            this.onPlyerError(evt);
          }
        }
      });
    }).pipe(take(1));

    return this.onAPIReady().pipe(mergeMap(_ => createPlayerObservable));
  }

  deletePlayer() {
    if (!this.isAvailable) {
      return;
    }

    this.player.destroy();
    this.player = null;
    JSS.removeStyleSheet(this.playerCSS);
    this.playerCSS = null;

    if (this.playerElm) {
      this.playerElm.remove();
      this.playerElm = null;
    }
    this.onResizeSubscription.unsubscribe();
    this.onResizeSubscription = null;
  }

  cueVideoById(id: string) {
    if (this.isAvailable) {
      this.player.cueVideoById(id);
    }
  }

  playVideo() {
    if (this.isAvailable) {
      this.player.playVideo();
    }
  }

  pauseVideo() {
    if (this.isAvailable) {
      this.player.pauseVideo();
    }
  }

  setVideoSize(width: number, height: number) {
    if (this.isAvailable) {
      this.player.setSize(width, height);
    }
  }

  seekTo(seconds: number, allowSeekAhead: boolean) {
    if (this.isAvailable) {
      return this.player.seekTo(seconds, allowSeekAhead);
    }
  }

  getCurrentTime(): number {
    if (this.isAvailable) {
      return this.player.getCurrentTime();
    }
    return 0.0;
  }

  getDuration(): number {
    if (this.isAvailable) {
      return this.player.getDuration();
    }
    return 0.0;
  }

  getPlayerState(): YT.PlayerState {
    if (this.isAvailable) {
      return this.player.getPlayerState();
    }
    return YT.PlayerState.UNSTARTED;
  }

  private createDOM(playerId: string) {
    if (this.playerElm) {
      return;
    }
    const styles = {
      base: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        position: 'absolute',
        opacity: 0
      },
      player: {
        extend: 'base',
        'z-index': -1,
        'background-color': 'rgba(0,0,0,0.2)'
      }
    };

    this.playerCSS = JSS.createStyleSheet(styles as any).attach();

    this.playerElm = document.createElement('div');
    this.playerElm.className = this.playerCSS.classes.player;
    this.playerElm.id = playerId;

    const body = document.querySelector('body');
    if (body) {
      body.appendChild(this.playerElm);
    }
  }

  private onAPIReady() {
    return youtubeAPIIPrepared.pipe(
      filter((isPrepared: boolean) => isPrepared),
      take(1)
    );
  }

  private onPlayerReady(event: YT.PlayerEvent) {
    console.log('[YoutubeAPI] onPlayerReady');

    if (this.isAvailable) {
      return;
    }
    this.player = event.target;

    // Fit iframe for video to current canvas size(drawable space)
    this.onResizeSubscription = GameManager.shared.onResize.subscribe(size => {
      this.setVideoSize(size.width, size.height);
    });
  }

  private onPlayerStateChange(event: YT.OnStateChangeEvent) {
    const statusString = ((state: YT.PlayerState) => {
      if (state == YT.PlayerState.ENDED) {
        return 'ENDED';
      } else if (state == YT.PlayerState.PLAYING) {
        return 'PLAYING';
      } else if (state == YT.PlayerState.PAUSED) {
        return 'PAUSED';
      } else if (state == YT.PlayerState.BUFFERING) {
        return 'BUFFERING';
      } else if (state == YT.PlayerState.CUED) {
        return 'CUED';
      } else if (state == YT.PlayerState.UNSTARTED) {
        return 'UNSTARTED';
      } else {
        return 'UNKNOWN';
      }
    })(event.data);

    console.log('[YoutubeAPI] onPlayerStateChange' + ' -> ' + statusString);

    this.subject.next(event.data);
  }

  private onPlyerError(event: YT.OnErrorEvent) {
    console.log('[YoutubeAPI] onPlyerError');

    const errorString = ((errorNo: number) => {
      if (errorNo === 2) {
        return '動画IDのフォーマットが不正です';
      } else if (errorNo === 5) {
        return 'HTMLのプレイヤーで再生できない動画の可能性があります';
      } else if (errorNo === 100) {
        return '読み込もうとした動画が削除されたか非公開にされた可能性があります';
      } else if (errorNo === 101 || errorNo === 150) {
        return '動画が存在しない可能性があります';
      } else {
        return '不明なエラーです';
      }
    })(event.data);

    alert('エラー: ' + errorString);

    this.subject.error(event.data);
  }
}