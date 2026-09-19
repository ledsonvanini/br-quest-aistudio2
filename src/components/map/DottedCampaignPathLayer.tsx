import React from 'react';
import { REGION_STATES_MAP } from './stateStyling/stateFillStyler';

interface DottedCampaignPathLayerProps {
  centroids: Record<string, [number, number]>;
  selectedCampaign: string;
  completedStateIds: Set<string>;
  tiltAngle?: number;
}

const CAMPAIGN_SEQUENCES: Record<string, string[]> = {
  norte: ['AC', 'RO', 'AM', 'RR', 'PA', 'AP', 'TO'],
  nordeste: ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
  centro_oeste: ['MT', 'MS', 'GO', 'DF'],
  sudeste: ['MG', 'ES', 'RJ', 'SP'],
  sul: ['PR', 'SC', 'RS'],
};

export const DottedCampaignPathLayer: React.FC<DottedCampaignPathLayerProps> = ({
  centroids,
  selectedCampaign,
  completedStateIds,
}) => {
  if (!selectedCampaign || selectedCampaign === 'todos' || selectedCampaign === 'livre') {
    return null;
  }

  const sequence = CAMPAIGN_SEQUENCES[selectedCampaign];
  if (!sequence || sequence.length < 2) return null;

  // Build SVG path points from state centroids
  const validPoints: Array<{ id: string; x: number; y: number; completed: boolean }> = [];
  for (const st of sequence) {
    const pt = centroids[st];
    if (pt) {
      validPoints.push({
        id: st,
        x: pt[0],
        y: pt[1],
        completed: completedStateIds.has(st),
      });
    }
  }

  if (validPoints.length < 2) return null;

  return (
    <svg
      className="camada-rota-pontilhada-campanha absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="campaignPathGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
        </linearGradient>
        <filter id="pathGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Render segments between sequential campaign states */}
      {validPoints.map((pt, idx) => {
        if (idx === 0) return null;
        const prev = validPoints[idx - 1];
        const isSegmentConquered = prev.completed && pt.completed;

        // Curved quadratic bezier connector
        const midX = (prev.x + pt.x) / 2;
        const midY = (prev.y + pt.y) / 2;
        const dx = pt.x - prev.x;
        const dy = pt.y - prev.y;
        // Normal offset for slight curvature
        const nx = -dy * 0.15;
        const ny = dx * 0.15;
        const ctrlX = midX + nx;
        const ctrlY = midY + ny;

        const pathData = `M ${prev.x} ${prev.y} Q ${ctrlX} ${ctrlY} ${pt.x} ${pt.y}`;

        return (
          <g key={`path-${prev.id}-${pt.id}`}>
            {/* Outer Glow */}
            <path
              d={pathData}
              fill="none"
              stroke={isSegmentConquered ? '#10b981' : '#f59e0b'}
              strokeWidth={isSegmentConquered ? 3.5 : 2.5}
              strokeDasharray={isSegmentConquered ? 'none' : '6 6'}
              strokeOpacity={isSegmentConquered ? 0.85 : 0.65}
              className={isSegmentConquered ? '' : 'animate-pulse'}
              filter="url(#pathGlowFilter)"
            />

            {/* Dotted Traveling Animation Line */}
            {!isSegmentConquered && (
              <path
                d={pathData}
                fill="none"
                stroke="#fef3c7"
                strokeWidth={2}
                strokeDasharray="4 8"
                strokeOpacity={0.9}
                style={{
                  animation: 'dashAnimation 3s linear infinite',
                }}
              />
            )}
          </g>
        );
      })}

      <style>{`
        @keyframes dashAnimation {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
};
