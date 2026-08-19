/**
 * STYLE — Afterglow is a soft neo-noir visual novel: the canvas is a rain-blue stage for warm human choices.
 */
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Shaders/layer.fragment";
import "@babylonjs/core/Shaders/layer.vertex";
import { GameWorld } from "./GameWorld";

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
}

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor.set(0.025, 0.045, 0.11, 1);

  const camera = new FreeCamera("interface-camera", new Vector3(0, 0, -10), scene);
  camera.setTarget(Vector3.Zero());
  scene.activeCamera = camera;

  const world = new GameWorld(scene);
  canvas.focus();

  return {
    scene,
    dispose: () => {
      world.dispose();
      scene.dispose();
    },
  };
}
