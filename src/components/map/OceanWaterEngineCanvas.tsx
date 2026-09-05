import React, { useEffect, useRef, useCallback } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { OceanSimulationEngine, OceanRenderer, OceanEngineConfig } from '../../lib/oceanEngine';
import { AppMainMode } from '../../types';

export interface OceanWaterEngineCanvasProps {
  enabled?: boolean;
  mode?: AppMainMode;
  waveSpeed?: number;
  waveScale?: number;
  bubblesEnabled?: boolean;
  bubblesDensity?: number;
  marolasIntensity?: number;
  coastalSurfEnabled?: boolean;
  correntesEnabled?: boolean;
  interactiveRipples?: boolean;
  onWaterClick?: (x: number, y: number) => void;
}

/**
 * OceanWaterEngineCanvas
 * Mini-Engine modular de ondas oceânicas, marolas, arrebentação e efervescência de bolhas marinhas.
 * Executa simulação física autônoma a 60 FPS com renderização multi-camada e zero poluição no canvas principal.
 */
export const OceanWaterEngineCanvas: React.FC<OceanWaterEngineCanvasProps> = ({
  enabled = true,
  mode = 'aventura',
  waveSpeed = 1.0,
  waveScale = 1.0,
  bubblesEnabled = true,
  bubblesDensity = 1.0,
  marolasIntensity = 1.0,
  coastalSurfEnabled = true,
  correntesEnabled = true,
  interactiveRipples = true,
  onWaterClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OceanSimulationEngine | null>(null);
  const rendererRef = useRef<OceanRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Inicialização única da Engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new OceanSimulationEngine({
        mode,
        waveSpeed,
        waveScale,
        bubblesEnabled,
        bubblesDensity,
        marolasIntensity,
        coastalSurfEnabled,
        correntesEnabled,
      });
    }
  }, []);

  // Sincronização de configurações dinâmicas
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setConfig({
        mode,
        waveSpeed,
        waveScale,
        bubblesEnabled,
        bubblesDensity,
        marolasIntensity,
        coastalSurfEnabled,
        correntesEnabled,
      });
    }
  }, [
    mode,
    waveSpeed,
    waveScale,
    bubblesEnabled,
    bubblesDensity,
    marolasIntensity,
    coastalSurfEnabled,
    correntesEnabled,
  ]);

  // Ciclo de renderização 60 FPS
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!engineRef.current) {
      engineRef.current = new OceanSimulationEngine({ mode });
    }

    rendererRef.current = new OceanRenderer(canvas, engineRef.current);
    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const deltaSec = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = currentTime;

      // Executa apenas se o documento estiver visível (conservação de energia/GPU)
      if (!document.hidden && engineRef.current && rendererRef.current) {
        engineRef.current.update(deltaSec);
        rendererRef.current.render();
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [enabled]);

  // Handler para interação direta com a água (marolas e bolhas ao clicar)
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactiveRipples || !engineRef.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = MAP_CANVAS_WIDTH / rect.width;
      const scaleY = MAP_CANVAS_HEIGHT / rect.height;

      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      // Dispara 2 marolas concêntricas e 3 bolhas emergindo
      engineRef.current.triggerMarola(canvasX, canvasY, 'interaction', 4, 60);
      setTimeout(() => {
        engineRef.current?.triggerMarola(canvasX, canvasY, 'interaction', 2, 40);
      }, 140);

      // Dispara bolhas na posição do clique
      for (let i = 0; i < 3; i++) {
        const b = engineRef.current.spawnBubble();
        if (b) {
          b.x = canvasX + (Math.random() - 0.5) * 25;
          b.y = canvasY + (Math.random() - 0.5) * 25;
          b.z = 0.5;
        }
      }

      onWaterClick?.(canvasX, canvasY);
    },
    [interactiveRipples, onWaterClick]
  );

  if (!enabled) return null;

  return (
    <div
      id="container-mini-engine-oceano"
      className="container-mini-engine-oceano absolute inset-0 pointer-events-none z-15 select-none"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
      }}
    >
      <canvas
        id="canva-ondas-mar-engine"
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        className="canva-ondas-mar-engine camada-marolas-bolhas-vivas absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          width: MAP_CANVAS_WIDTH,
          height: MAP_CANVAS_HEIGHT,
        }}
        title="Oceano Atlântico - Clique para gerar marolas e bolhas"
      />
    </div>
  );
};
