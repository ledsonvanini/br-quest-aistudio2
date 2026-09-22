// src/context/BeaconHoverContext.tsx
// Gerenciador de estado global para Tooltips de Beacons em nível de Tela (HTML Nativo 1:1)

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { StructuredBeaconMetric } from '../components/map/markers/beaconTelemetryParser';

export interface BeaconTooltipPayload {
  tag: string;
  tagColor?: string;
  tagBg?: string;
  title: string;
  titleColor?: string;
  borderColor?: string;
  lines?: string[];
  telemetry?: string;
  telemetryColor?: string;
  metrics?: StructuredBeaconMetric[];
  subtitle?: string;
  footerSource?: string;
  topBadge?: {
    label: string;
    icon?: React.ReactNode;
  };
}

export interface ActiveBeaconState {
  payload: BeaconTooltipPayload;
  screenPos: { x: number; y: number };
}

interface BeaconHoverContextValue {
  activeBeacon: ActiveBeaconState | null;
  showBeaconTooltip: (payload: BeaconTooltipPayload, event: React.MouseEvent) => void;
  updateBeaconPos: (event: React.MouseEvent) => void;
  hideBeaconTooltip: () => void;
}

const BeaconHoverContext = createContext<BeaconHoverContextValue | null>(null);

export const BeaconHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBeacon, setActiveBeacon] = useState<ActiveBeaconState | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBeaconTooltip = useCallback((payload: BeaconTooltipPayload, event: React.MouseEvent) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveBeacon({
      payload,
      screenPos: { x: event.clientX, y: event.clientY },
    });
  }, []);

  const updateBeaconPos = useCallback((event: React.MouseEvent) => {
    setActiveBeacon((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        screenPos: { x: event.clientX, y: event.clientY },
      };
    });
  }, []);

  const hideBeaconTooltip = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setActiveBeacon(null);
    }, 120);
  }, []);

  return (
    <BeaconHoverContext.Provider
      value={{
        activeBeacon,
        showBeaconTooltip,
        updateBeaconPos,
        hideBeaconTooltip,
      }}
    >
      {children}
    </BeaconHoverContext.Provider>
  );
};

export function useBeaconHover(): BeaconHoverContextValue {
  const ctx = useContext(BeaconHoverContext);
  if (!ctx) {
    // Fallback gracioso caso esteja fora do provider
    return {
      activeBeacon: null,
      showBeaconTooltip: () => {},
      updateBeaconPos: () => {},
      hideBeaconTooltip: () => {},
    };
  }
  return ctx;
}
