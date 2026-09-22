import React, { useRef, useCallback } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { useOceanWebGL } from '../../lib/oceanEngine/useOceanWebGL';
import { AppMainMode } from '../../types';

export const OCEAN_EXPANDED_WIDTH = MAP_CANVAS_WIDTH;
export const OCEAN_EXPANDED_HEIGHT = MAP_CANVAS_HEIGHT;

export interface OceanShaderCanvasProps {
  enabled?: boolean;
  mode?: AppMainMode;
  isTerritoryMode?: boolean;
  waveSpeed?: number;
  onWaterClick?: (x: number, y: number) => void;
  customBrazilGeo?: any;
  // Propriedades herdadas suportadas para total compatibilidade e desacoplamento
  waveScale?: number;
  bubblesEnabled?: boolean;
  bubblesDensity?: number;
  marolasIntensity?: number;
  coastalSurfEnabled?: boolean;
  correntesEnabled?: boolean;
}

/**
 * OceanShaderCanvas
 * Componente modular desacoplado com Mini-Engine de Shaders WebGL2 para o Oceano Atlântico.
 * 
 * Renderiza em resolução nativa 2560x1440 (Ultra HD 1:1 sem esticamento ou perda de subpixel):
 * - Gradiente Batimétrico Contínuo (turquesa e esmeralda nas águas rasas litorâneas e ilhas oceânicas)
 * - Ondas e marolas heterogêneas físicas sem cálculos polares distorcidos
 * - Cáusticas solares dinâmicas suaves
 * - Alcance orgânico expandido mar adentro cobrindo a plataforma continental com bounding box invisível
 * - Zero interferência nos países vizinhos do continente sul-americano
 */
export const OceanShaderCanvas: React.FC<OceanShaderCanvasProps> = ({
  enabled = true,
  mode = 'aventura',
  isTerritoryMode = false,
  waveSpeed = 0.6,
  onWaterClick,
  customBrazilGeo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hook desacoplado de renderização WebGL2 com escala 1:1 perfeitamente sincronizada com as 27 UFs
  useOceanWebGL({
    canvasRef,
    enabled,
    waveSpeed,
    mode,
    isTerritoryMode,
    customBrazilGeo,
    mapScale: [1.0, 1.0],
  });

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !onWaterClick) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const mapX = normX * MAP_CANVAS_WIDTH;
      const mapY = normY * MAP_CANVAS_HEIGHT;
      onWaterClick(mapX, mapY);
    },
    [onWaterClick]
  );

  if (!enabled) return null;

  return (
    <div
      id="container-shader-oceano-atlantico"
      className="container-shader-oceano-atlantico absolute pointer-events-none z-0 select-none overflow-visible"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        left: 0,
        top: 0,
        transform: 'translateZ(-3px)',
      }}
    >
      <canvas
        id="canva-shader-oceano-webgl"
        ref={canvasRef}
        width={MAP_CANVAS_WIDTH}
        height={MAP_CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        className={`canva-shader-oceano-webgl absolute inset-0 w-full h-full ${onWaterClick ? 'pointer-events-auto' : 'pointer-events-none'}`}
        data-testid="ocean-shader-canvas"
        title="Oceano Atlântico - Shader Animado de Gradiente Fractal e Luz Líquida"
      />
    </div>
  );
};
