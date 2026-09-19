import React, { useEffect, useRef } from 'react';
import { OCEAN_DEEP_VERTEX_SHADER, OCEAN_DEEP_FRAGMENT_SHADER } from '../../lib/oceanEngine/oceanDeepShaders';
import { AppMainMode } from '../../types';

interface OceanDeepFractalCanvasProps {
  mode?: AppMainMode;
  isTerritoryMode?: boolean;
  waveSpeed?: number;
  isPlayingAnimation?: boolean;
}

const getThemeModeInt = (mode?: AppMainMode, isTerritoryMode?: boolean): number => {
  if (isTerritoryMode) return 4;
  if (mode === 'biodiversidade') return 1;
  if (mode === 'musicalidades') return 2;
  return 0; // aventura, clima, geopolitica
};

/**
 * OceanDeepFractalCanvas
 * Camada Base do Oceano Profundo:
 * Renderiza o Shader Fractal de Cáusticas Líquidas e Partículas Marinhas
 * cobrindo 100% da área navegável (14.000 x 10.000px) de forma resiliente ao zoom out,
 * com ondulação contínua, respiração suave e sem nenhum corte de borda.
 */
export const OceanDeepFractalCanvas: React.FC<OceanDeepFractalCanvasProps> = ({
  mode = 'aventura',
  isTerritoryMode = false,
  waveSpeed = 0.72,
  isPlayingAnimation = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const accumulatedTimeRef = useRef<number>(0);
  const uniformsRef = useRef<{
    u_time: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_theme_mode: WebGLUniformLocation | null;
  }>({
    u_time: null,
    u_resolution: null,
    u_theme_mode: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      gl = null;
    }

    if (!gl) {
      console.warn('WebGL2 indisponível para OceanDeepFractalCanvas.');
      return;
    }

    glRef.current = gl;

    // Compilar Vertex Shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, OCEAN_DEEP_VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Falha de compilação VS Oceano Profundo:', gl.getShaderInfoLog(vs));
      return;
    }

    // Compilar Fragment Shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, OCEAN_DEEP_FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Falha de compilação FS Oceano Profundo:', gl.getShaderInfoLog(fs));
      return;
    }

    // Linkar programa
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Falha ao linkar Programa Oceano Profundo:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Geometria Fullscreen Quad
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posAttribLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttribLoc);
    gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_theme_mode: gl.getUniformLocation(program, 'u_theme_mode'),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    lastTimeRef.current = performance.now();
    let lastRenderTime = performance.now();
    const TARGET_FPS_INTERVAL = 1000 / 30; // 30 FPS é ideal para ondulação abissal lenta de 9s

    // Render loop otimizado com pacing de 30 FPS na GPU
    const render = () => {
      if (!gl || !programRef.current) return;

      const now = performance.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!document.hidden && isPlayingAnimation) {
        accumulatedTimeRef.current += deltaSec * waveSpeed;

        // Limita a execução do shader para 30 FPS, economizando 50% de ciclos de GPU
        if (now - lastRenderTime >= TARGET_FPS_INTERVAL) {
          lastRenderTime = now - ((now - lastRenderTime) % TARGET_FPS_INTERVAL);
          const currentSec = accumulatedTimeRef.current;

          gl.useProgram(programRef.current);

          if (uniformsRef.current.u_time) {
            gl.uniform1f(uniformsRef.current.u_time, currentSec);
          }
          if (uniformsRef.current.u_resolution) {
            gl.uniform2f(uniformsRef.current.u_resolution, canvas.width, canvas.height);
          }
          if (uniformsRef.current.u_theme_mode) {
            gl.uniform1i(uniformsRef.current.u_theme_mode, getThemeModeInt(mode, isTerritoryMode));
          }

          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (gl) {
        if (programRef.current) gl.deleteProgram(programRef.current);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      }
    };
  }, [mode, isTerritoryMode, waveSpeed, isPlayingAnimation]);

  return (
    <div
      id="container-oceano-profundo-fractal"
      className="container-oceano-profundo-fractal absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
    >
      <canvas
        id="canva-shader-oceano-profundo"
        ref={canvasRef}
        width={960}
        height={600}
        className="canva-shader-oceano-profundo absolute inset-0 w-full h-full pointer-events-none"
        style={{
          mixBlendMode: 'normal',
          opacity: 0.88,
        }}
        data-testid="ocean-deep-fractal-canvas"
        title="Oceano Profundo - Shader Fractal Resiliente ao Zoom Out"
      />
    </div>
  );
};
