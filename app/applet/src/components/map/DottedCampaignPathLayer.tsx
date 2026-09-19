import React from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';

interface DottedCampaignPathLayerProps {
  centroids: Record<string, [number, number]>;
  selectedCampaign: string; // 'todos' | 'livre' | 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul'
  completedStateIds: Set<string>;
  tiltAngle?: number;
}

export const CAMPAIGN_SEQUENCES: Record<string, string[]> = {
  norte: ['AC', 'RO', 'AM', 'RR', 'PA', 'AP', 'TO'],
  nordeste: ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
  centro_oeste: ['MS', 'MT', 'GO', 'DF'],
  sudeste: ['SP', 'RJ', 'ES', 'MG'],
  sul: ['PR', 'SC', 'RS'],
};

export const DottedCampaignPathLayer: React.FC<DottedCampaignPathLayerProps> = ({
  centroids,
  selectedCampaign,
  completedStateIds,
  tiltAngle = 42,
}) => {
  // If campaign is 'todos' or 'livre' without region constraint, we can connect major regional routes or skip
  if (!selectedCampaign || selectedCampaign === 'todos') return null;

  const sequence = CAMPAIGN_SEQUENCES[selectedCampaign];
  if (!sequence || sequence.length < 2) return null;

  // Build points array
  const points: { id: string; x: number; y: number; isCompleted: boolean }[] = [];
  for (const stateId of sequence) {
    const coords = centroids[stateId];
    if (coords) {
      points.push({
        id: stateId,
        x: coords[0],
        y: coords[1],
        isCompleted: completedStateIds.has(stateId),
      });
    }
  }

  if (points.length < 2) return null;

  return (
    <svg
      className="camada-trajetoria-campanha absolute inset-0 pointer-events-none select-none z-15"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
      viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
    >
      <defs>
        <linearGradient id="campaignPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
        </linearGradient>
        <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Render segments between adjacent states in campaign sequence */}
      {points.map((pt, idx) => {
        if (idx === points.length - 1) return null;
        const nextPt = points[idx + 1];

        const isSegmentDone = pt.isCompleted && nextPt.isCompleted;

        // Curved bezier control point for organic cartographic trajectory
        const midX = (pt.x + nextPt.x) / 2;
        const midY = (pt.y + nextPt.y) / 2 - 25; // upward arc

        const pathD = `M ${pt.x} ${pt.y} Q ${midX} ${midY} ${nextPt.x} ${nextPt.y}`;

        return (
          <g key={`campaign-seg-${pt.id}-${nextPt.id}`}>
            {/* Background Glow Line */}
            <path
              d={pathD}
              fill="none"
              stroke={isSegmentDone ? '#f59e0b' : '#0284c7'}
              strokeWidth={isSegmentDone ? '5' : '4'}
              strokeOpacity="0.35"
              filter="url(#pathGlow)"
            />

            {/* Dotted Trajectory Line with march animation */}
            <path
              d={pathD}
              fill="none"
              stroke={isSegmentDone ? '#f59e0b' : '#38bdf8'}
              strokeWidth={isSegmentDone ? '2.8' : '2.2'}
              strokeDasharray={isSegmentDone ? '6 4' : '8 6'}
              className={isSegmentDone ? '' : 'anim-route-dash-offset'}
              strokeLinecap="round"
            />

            {/* Intermediate Waypoint Beacon Marker */}
            <circle
              cx={midX}
              cy={midY}
              r="3.5"
              fill={isSegmentDone ? '#f59e0b' : '#38bdf8'}
              stroke="#020617"
              strokeWidth="1.5"
            />
          </g>
        );
      })}
    </svg>
  );
};
