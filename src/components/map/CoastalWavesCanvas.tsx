import React from 'react';
import { OceanShaderCanvas, OceanShaderCanvasProps } from './OceanShaderCanvas';
import { AppMainMode } from '../../types';

export interface CoastalWavesCanvasProps extends OceanShaderCanvasProps {
  mode?: AppMainMode;
}

/**
 * CoastalWavesCanvas
 * Fachada desacoplada para a Mini-Engine de Shaders WebGL2 (OceanShaderCanvas),
 * oferecendo gradiente batimétrico natural, cáusticas solares e ondas heterogêneas.
 */
export const CoastalWavesCanvas: React.FC<CoastalWavesCanvasProps> = (props) => {
  return <OceanShaderCanvas {...props} />;
};

export { OceanShaderCanvas };
export type { OceanShaderCanvasProps };
