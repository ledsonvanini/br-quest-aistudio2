import { useEffect, useRef, useCallback, RefObject } from 'react';
import { AppMainMode } from '../../types';
import { OCEAN_VERTEX_SHADER, OCEAN_FRAGMENT_SHADER } from './oceanShaders';
import { generateCoastDistanceTexture } from './oceanDistanceField';

export interface UseOceanWebGLOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  waveSpeed: number;
  mode: AppMainMode;
  customBrazilGeo?: any;
  mapScale?: [number, number];
}

interface UniformLocations {
  u_time: WebGLUniformLocation | null;
  u_resolution: WebGLUniformLocation | null;
  u_theme_mode: WebGLUniformLocation | null;
  u_coast_distance_tex: WebGLUniformLocation | null;
  u_sun_pos: WebGLUniformLocation | null;
  u_map_scale: WebGLUniformLocation | null;
}

/**
 * Custom Hook responsável pelo ciclo de vida da Mini-Engine WebGL2 do Oceano Atlântico.
 * Separação estrita de lógica de renderização GPU conforme arquitetura modular.
 */
export function useOceanWebGL({
  canvasRef,
  enabled,
  waveSpeed,
  mode,
  customBrazilGeo,
  mapScale = [1.0, 1.0],
}: UseOceanWebGLOptions) {
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const distanceTexRef = useRef<WebGLTexture | null>(null);

  const uniformsRef = useRef<UniformLocations>({
    u_time: null,
    u_resolution: null,
    u_theme_mode: null,
    u_coast_distance_tex: null,
    u_sun_pos: null,
    u_map_scale: null,
  });

  const getThemeModeInt = useCallback((themeMode: AppMainMode): number => {
    switch (themeMode) {
      case 'biodiversidade':
        return 1;
      case 'musicalidades':
        return 2;
      case 'clima':
      case 'geopolitica':
        return 3;
      case 'aventura':
      default:
        return 0;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      });
    } catch {
      gl = null;
    }

    if (!gl) {
      console.warn('WebGL2 indisponível para o OceanShaderCanvas.');
      return;
    }

    glRef.current = gl;

    // 1. Compilar Shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, OCEAN_VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Falha de compilação do Vertex Shader:', gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, OCEAN_FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Falha de compilação do Fragment Shader:', gl.getShaderInfoLog(fs));
      return;
    }

    // 2. Linkar Programa WebGL
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Falha ao linkar Shader Program:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // 3. Geometria Fullscreen Quad
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

    // 4. Uniformes
    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_theme_mode: gl.getUniformLocation(program, 'u_theme_mode'),
      u_coast_distance_tex: gl.getUniformLocation(program, 'u_coast_distance_tex'),
      u_sun_pos: gl.getUniformLocation(program, 'u_sun_pos'),
      u_map_scale: gl.getUniformLocation(program, 'u_map_scale'),
    };

    // 5. Upload da textura SDF Batimétrica da costa brasileira
    const { canvas: sdfCanvas } = generateCoastDistanceTexture(customBrazilGeo);
    const distanceTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, distanceTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sdfCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    distanceTexRef.current = distanceTex;

    // Configurações WebGL
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 6. Loop de Renderização otimizado na GPU:
    // Em telas 60Hz, o RAF oscila entre 14.2ms e 17.5ms. O limiar de 10.5ms garante 60 FPS sólidos sem descartar
    // frames por jitter de VSync (eliminando a queda para 40-42 FPS), enquanto limita telas de 120Hz/144Hz.
    let lastRenderMs = 0;
    const MIN_FRAME_INTERVAL_MS = 10.5;

    const render = (timeMs: number) => {
      if (!gl || !programRef.current) return;

      if (!document.hidden) {
        if (timeMs - lastRenderMs >= MIN_FRAME_INTERVAL_MS) {
          lastRenderMs = timeMs;
          const elapsedSec = ((timeMs - startTimeRef.current) / 1000) * waveSpeed;

          gl.useProgram(programRef.current);

          if (uniformsRef.current.u_time) {
            gl.uniform1f(uniformsRef.current.u_time, elapsedSec);
          }
          if (uniformsRef.current.u_resolution) {
            gl.uniform2f(uniformsRef.current.u_resolution, canvas.width, canvas.height);
          }
          if (uniformsRef.current.u_theme_mode) {
            gl.uniform1i(uniformsRef.current.u_theme_mode, getThemeModeInt(mode));
          }
          if (uniformsRef.current.u_sun_pos) {
            gl.uniform2f(uniformsRef.current.u_sun_pos, 0.82, 0.15);
          }
          if (uniformsRef.current.u_coast_distance_tex) {
            gl.uniform1i(uniformsRef.current.u_coast_distance_tex, 0);
          }
          if (uniformsRef.current.u_map_scale) {
            gl.uniform2f(uniformsRef.current.u_map_scale, mapScale[0], mapScale[1]);
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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (distanceTexRef.current && gl) {
        gl.deleteTexture(distanceTexRef.current);
      }
      if (program && gl) {
        gl.deleteProgram(program);
      }
    };
  }, [enabled, waveSpeed, mode, getThemeModeInt, canvasRef, customBrazilGeo, mapScale]);

  // Atualização de tema reativa sem recompilação de shaders
  useEffect(() => {
    const gl = glRef.current;
    if (gl && programRef.current && uniformsRef.current.u_theme_mode) {
      gl.useProgram(programRef.current);
      gl.uniform1i(uniformsRef.current.u_theme_mode, getThemeModeInt(mode));
    }
  }, [mode, getThemeModeInt]);
}
