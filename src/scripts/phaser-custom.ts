// Refer to https://github.com/photonstorm/phaser3-custom-build
import 'phaser/polyfills';
import * as CONST from 'phaser/const';
import * as Extend from 'phaser/utils/object/Extend';

import * as Actions from 'phaser/actions';
import * as Animation from 'phaser/animations';
import * as Cache from 'phaser/cache';
import * as Cameras from 'phaser/cameras';
import * as Class from 'phaser/utils/Class';
import * as Create from 'phaser/create';
import * as Curves from 'phaser/curves';
import * as Data from 'phaser/data';
import * as Display from 'phaser/display';
import * as DOM from 'phaser/dom';
import * as Events from 'phaser/events';
import * as Game from 'phaser/boot/Game';
import * as GameObjects from 'phaser/gameobjects';
import * as Geom from 'phaser/geom';
import * as Input from 'phaser/input';
import * as Loader from 'phaser/loader';
import * as Math from 'phaser/math';
import * as Physics from 'phaser/physics';
import * as Plugins from 'phaser/plugins';
import * as Renderer from 'phaser/renderer';
import * as Scene from 'phaser/scene/Scene';
import * as Scenes from 'phaser/scene';
import * as Sound from 'phaser/sound';
import * as Structs from 'phaser/structs';
import * as Textures from 'phaser/textures';
import * as Tilemaps from 'phaser/tilemaps';
import * as Time from 'phaser/time';
import * as Tweens from 'phaser/tweens';
import * as Utils from 'phaser/utils';

// Select modules to include

let Phaser = {
  Actions,
  Animation,
  Cache,
  Cameras,
  Class,
  Create,
  Curves,
  Data,
  Display,
  DOM,
  Events,
  Game,
  GameObjects,
  Geom,
  Input,
  Loader,
  Math,
  Physics,
  Plugins,
  Renderer,
  Scene,
  Scenes,
  Sound,
  Structs,
  Textures,
  Tilemaps,
  Time,
  Tweens,
  Utils
};

// Merge in the consts

Phaser = Extend(false, Phaser, CONST);

// Expose it

declare global {
  interface Window {
    Phaser: any;
  }
}
window.Phaser = Phaser;

// And bare import at entry point(main.ts)
