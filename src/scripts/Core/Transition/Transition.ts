const DurationMinMs = 300;

export enum TransitionType {
  Koko = 'KokoTransitionScene',
  Friends = 'FriendsTransitionScene'
}

export interface TransitionSceneParam {
  target: string;
  halfDuration: number;
}

export class Transition {
  static to(from: Phaser.Scene, targetSceneKey: string, type: TransitionType, duration: number) {
    const halfDuration = Math.max(duration, DurationMinMs) * 0.5;

    from.scene.transition({
      target: type.toString(),
      moveAbove: true,
      duration: halfDuration,
      data: { target: targetSceneKey, halfDuration: halfDuration }
    });
  }
}
