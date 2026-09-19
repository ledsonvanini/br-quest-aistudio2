import React, { useMemo } from 'react';
import { GeoProjection } from 'd3-geo';

interface CartographicGraticuleLayerProps {
  projection: GeoProjection | null;
  isParchmentMode?: boolean;
  isClimateActive?: boolean;
}

/**
 * CartographicGraticuleLayer
 * Renders discrete, authentic nautical and cartographic grid lines (graticules):
 * - Linha do Equador (0° Latitude) com destaque cartográfico nobre
 * - Trópico de Capricórnio (23°26'14" S) com notação astronômica/geográfica
 * - Meridianos e Paralelos discretos a cada 10° com rótulos de graus (°W / °S / °N)
 * - Indicador de rumo náutico ao Meridiano de Greenwich (0° Longitude ➔ Leste)
 * - Cruzes de interseção cartográficas discretas (+) nos pontos nodais oceânicos
 */
export const CartographicGraticuleLayer: React.FC<CartographicGraticuleLayerProps> = ({
  projection,
  isParchmentMode = false,
  isClimateActive = false,
}) => {
  // Generate mathematically accurate projected path strings for parallels & meridians
  const {
    parallels,
    meridians,
    equatorPath,
    tropicPath,
    equatorLabelPos,
    tropicLabelPos,
    greenwichPos,
    degreeLabels,
    intersections,
  } = useMemo(() => {
    if (!projection) {
      return {
        parallels: [],
        meridians: [],
        equatorPath: '',
        tropicPath: '',
        equatorLabelPos: null,
        tropicLabelPos: null,
        greenwichPos: null,
        degreeLabels: [],
        intersections: [],
      };
    }

    const minLng = -92;
    const maxLng = -20;
    const minLat = -54;
    const maxLat = 14;

    const sampleStep = 1; // 1 degree step for smooth curve interpolation

    // 1. Regular Parallels (every 10 degrees)
    const latList = [10, -10, -20, -30, -40, -50];
    const parallelPaths: { d: string; lat: number }[] = [];

    latList.forEach((lat) => {
      const pts: [number, number][] = [];
      for (let lng = minLng; lng <= maxLng; lng += sampleStep) {
        const pt = projection([lng, lat]);
        if (pt && !isNaN(pt[0]) && !isNaN(pt[1])) {
          pts.push(pt);
        }
      }
      if (pts.length > 1) {
        const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`;
        parallelPaths.push({ d, lat });
      }
    });

    // 2. Regular Meridians (every 10 degrees from -90° to -20°)
    const lngList = [-90, -80, -70, -60, -50, -40, -30, -20];
    const meridianPaths: { d: string; lng: number }[] = [];

    lngList.forEach((lng) => {
      const pts: [number, number][] = [];
      for (let lat = maxLat; lat >= minLat; lat -= sampleStep) {
        const pt = projection([lng, lat]);
        if (pt && !isNaN(pt[0]) && !isNaN(pt[1])) {
          pts.push(pt);
        }
      }
      if (pts.length > 1) {
        const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`;
        meridianPaths.push({ d, lng });
      }
    });

    // 3. Linha do Equador (Latitude 0°)
    const eqPts: [number, number][] = [];
    for (let lng = minLng - 2; lng <= maxLng + 2; lng += sampleStep) {
      const pt = projection([lng, 0]);
      if (pt && !isNaN(pt[0]) && !isNaN(pt[1])) {
        eqPts.push(pt);
      }
    }
    const equatorPathStr = eqPts.length > 1
      ? `M ${eqPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`
      : '';

    // 4. Trópico de Capricórnio (Latitude -23.4365°)
    const tropicLat = -23.4365;
    const trPts: [number, number][] = [];
    for (let lng = minLng - 2; lng <= maxLng + 2; lng += sampleStep) {
      const pt = projection([lng, tropicLat]);
      if (pt && !isNaN(pt[0]) && !isNaN(pt[1])) {
        trPts.push(pt);
      }
    }
    const tropicPathStr = trPts.length > 1
      ? `M ${trPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')}`
      : '';

    // Label anchor positions in oceanic areas
    const eqLabelPt = projection([-32, 0]);
    const trLabelPt = projection([-30, tropicLat]);
    const gwPt = projection([-21, -14]);

    // Marginal Degree Labels along grid bounds
    const labels: { text: string; x: number; y: number; align: 'start' | 'middle' | 'end'; baseline: string }[] = [];

    // Longitude labels at top and bottom
    lngList.forEach((lng) => {
      const topPt = projection([lng, maxLat]);
      if (topPt) {
        labels.push({
          text: `${Math.abs(lng)}°W`,
          x: topPt[0],
          y: topPt[1] - 10,
          align: 'middle',
          baseline: 'auto',
        });
      }
      const botPt = projection([lng, minLat]);
      if (botPt) {
        labels.push({
          text: `${Math.abs(lng)}°W`,
          x: botPt[0],
          y: botPt[1] + 18,
          align: 'middle',
          baseline: 'hanging',
        });
      }
    });

    // Latitude labels at left and right
    [10, 0, -10, -20, -23.4365, -30, -40, -50].forEach((lat) => {
      const leftPt = projection([minLng, lat]);
      const isSpecial = lat === 0 || lat === -23.4365;
      const text = lat === 0
        ? '0°'
        : lat === -23.4365
        ? '23.5°S'
        : lat > 0
        ? `${lat}°N`
        : `${Math.abs(lat)}°S`;

      if (leftPt && !isSpecial) {
        labels.push({
          text,
          x: leftPt[0] - 10,
          y: leftPt[1] + 3,
          align: 'end',
          baseline: 'middle',
        });
      }

      const rightPt = projection([maxLng, lat]);
      if (rightPt && !isSpecial) {
        labels.push({
          text,
          x: rightPt[0] + 10,
          y: rightPt[1] + 3,
          align: 'start',
          baseline: 'middle',
        });
      }
    });

    // Intersection crosses (+)
    const crossPoints: [number, number][] = [];
    const allLats = [10, 0, -10, -20, -30, -40, -50];
    lngList.forEach((lng) => {
      allLats.forEach((lat) => {
        const pt = projection([lng, lat]);
        if (pt) crossPoints.push(pt);
      });
    });

    return {
      parallels: parallelPaths,
      meridians: meridianPaths,
      equatorPath: equatorPathStr,
      tropicPath: tropicPathStr,
      equatorLabelPos: eqLabelPt,
      tropicLabelPos: trLabelPt,
      greenwichPos: gwPt,
      degreeLabels: labels,
      intersections: crossPoints,
    };
  }, [projection]);

  if (!projection) return null;

  // Theme palettes
  const strokeGrid = isParchmentMode ? '#92400e' : '#38bdf8';
  const strokeMajor = isParchmentMode ? '#78350f' : '#f59e0b';
  const textFill = isParchmentMode ? '#92400e' : '#7dd3fc';
  const badgeBg = isParchmentMode ? '#fdf6e7' : '#071b30';
  const badgeBorder = isParchmentMode ? '#d97706' : '#0284c7';
  const gridOpacity = isClimateActive ? 0.12 : isParchmentMode ? 0.32 : 0.20;
  const majorOpacity = isClimateActive ? 0.35 : isParchmentMode ? 0.85 : 0.70;

  return (
    <g
      id="cartographic-graticule-layer"
      className="camada-grid-cartografica-graticule pointer-events-none select-none"
    >
      {/* 1. Discrete Regular Parallels (Latitude lines) */}
      <g className="subcamada-paralelos-grid" opacity={gridOpacity}>
        {parallels.map(({ d, lat }) => (
          <path
            key={`lat-${lat}`}
            d={d}
            fill="none"
            stroke={strokeGrid}
            strokeWidth="0.75"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* 2. Discrete Regular Meridians (Longitude lines) */}
      <g className="subcamada-meridianos-grid" opacity={gridOpacity}>
        {meridians.map(({ d, lng }) => (
          <path
            key={`lng-${lng}`}
            d={d}
            fill="none"
            stroke={strokeGrid}
            strokeWidth="0.75"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* 3. Subtle Cartographic Intersection Crosses (+) */}
      <g className="subcamada-cruzes-intersecao" opacity={gridOpacity * 1.5}>
        {intersections.map(([x, y], idx) => (
          <g key={`cross-${idx}`} transform={`translate(${x}, ${y})`}>
            <line x1="-5" y1="0" x2="5" y2="0" stroke={strokeGrid} strokeWidth="1" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke={strokeGrid} strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* 4. LINHA DO EQUADOR (Latitude 0°) - Linha Cartográfica Discreta */}
      {equatorPath && (
        <g className="linha-equador-cartografica">
          <path
            d={equatorPath}
            fill="none"
            stroke={strokeMajor}
            strokeWidth="1.1"
            strokeDasharray="12 6"
            strokeOpacity={majorOpacity * 0.7}
          />
        </g>
      )}

      {/* 5. TRÓPICO DE CAPRICÓRNIO (Latitude 23°26' S) */}
      {tropicPath && (
        <g className="linha-tropico-capricornio">
          <path
            d={tropicPath}
            fill="none"
            stroke={strokeMajor}
            strokeWidth="1.0"
            strokeDasharray="8 6"
            strokeOpacity={majorOpacity * 0.6}
          />
        </g>
      )}

      {/* 7. Discretos Rótulos Numéricos de Graus nas Margens (°W e °S) */}
      <g className="rotulos-graus-cartograficos" opacity={isParchmentMode ? 0.6 : 0.45}>
        {degreeLabels.map((lbl, idx) => (
          <text
            key={`degree-lbl-${idx}`}
            x={lbl.x}
            y={lbl.y}
            textAnchor={lbl.align}
            fontSize="8.5"
            fontFamily="monospace, serif"
            fontWeight="bold"
            letterSpacing="1"
            fill={textFill}
          >
            {lbl.text}
          </text>
        ))}
      </g>
    </g>
  );
};
