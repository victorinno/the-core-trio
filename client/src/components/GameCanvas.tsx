/**
 * STYLE — Afterglow uses the canvas as one cinematic stage: zero dashboard chrome, only night, dialogue and choice.
 */
import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createGameScene, type GameHandle } from "@/game/scene";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      adaptToDeviceRatio: true,
    });
    let disposed = false;
    let handle: GameHandle | null = null;

    createGameScene(engine, canvas).then((gameHandle) => {
      if (disposed) {
        gameHandle.dispose();
        return;
      }
      handle = gameHandle;
      engine.runRenderLoop(() => gameHandle.scene.render());
    });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      handle?.dispose();
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      tabIndex={0}
      aria-label="Afterglow: jogo de simulação de encontros. Pressione Enter para começar e as teclas 1, 2 ou 3 para escolher uma resposta."
      style={{ touchAction: "none" }}
    />
  );
}
