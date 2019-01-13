import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

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

export class YoutubePlayer {
  constructor() {}

  get onAPIReady() {
    return youtubeAPIIPrepared.pipe(take(1));
  }
}
