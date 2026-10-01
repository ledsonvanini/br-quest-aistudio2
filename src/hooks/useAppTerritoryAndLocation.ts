/**
 * Hook de Orquestração de Camadas de Território, Seleção de Estados e Geolocalização
 * Projeto: BR Quest
 */

import { useState, useCallback } from 'react';
import { CartographyLayerMode } from '../types/cartography';
import { AppMainMode, BrazilBiome } from '../types';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { getStateDefaultBiome } from '../services/geolocationService';
import { audioEngine } from '../lib/audioSynth';

interface TerritoryAndLocationOptions {
  modes: any;
  activeTab: string;
  setActiveTab: (tab: 'map' | 'insignias') => void;
  setBiodiversityBiome: (biome: BrazilBiome | 'all') => void;
  notify: (msg: string) => void;
  closeDailyTips: () => void;
}

export function useAppTerritoryAndLocation({
  modes,
  activeTab,
  setActiveTab,
  setBiodiversityBiome,
  notify,
  closeDailyTips,
}: TerritoryAndLocationOptions) {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [activeCartographyLayer, setActiveCartographyLayer] = useState<CartographyLayerMode>('none');
  const [selectedTerritorySubitemId, setSelectedTerritorySubitemId] = useState<string | null>(null);
  const [isTerritorySubmenuOpen, setIsTerritorySubmenuOpen] = useState<boolean>(true);

  const [userLocation, setUserLocation] = useState<{
    stateId: string;
    stateName: string;
    regionId: string;
  } | null>(() => {
    try {
      const cached = localStorage.getItem('brquest_user_geolocation');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const handleSelectCartographyLayer = useCallback((layer: CartographyLayerMode, targetState?: string | null) => {
    if (layer === activeCartographyLayer) {
      setActiveCartographyLayer('none');
      setSelectedTerritorySubitemId(null);
      setSelectedStateId(null);
      setIsTerritorySubmenuOpen(false);
      return;
    }

    setActiveCartographyLayer(layer);
    setSelectedTerritorySubitemId(null);
    if (layer !== 'none') {
      if (targetState) {
        setSelectedStateId(targetState);
        setIsTerritorySubmenuOpen(false);
      } else {
        setSelectedStateId(null);
        setIsTerritorySubmenuOpen(true);
        if (modes.showNeighbors) modes.setShowNeighbors(false);
        modes.setCenterMapTrigger((prev: number) => prev + 1);
      }
    } else {
      setSelectedStateId(null);
      setIsTerritorySubmenuOpen(false);
    }
  }, [activeCartographyLayer, modes]);

  const handleSelectMainMode = useCallback((newMode: AppMainMode) => {
    modes.selectMainMode(newMode);
    setActiveCartographyLayer('none');
    setSelectedTerritorySubitemId(null);
    setIsTerritorySubmenuOpen(false);

    if (userLocation) {
      modes.setSelectedRegionFilter(userLocation.regionId);
      setSelectedStateId(userLocation.stateId);
      modes.setFocusedStateId(userLocation.stateId);
      if (newMode === 'biodiversidade') {
        setBiodiversityBiome(getStateDefaultBiome(userLocation.stateId));
      }
    }

    if (activeTab !== 'map') {
      setActiveTab('map');
      window.location.hash = '#/mapa';
    }
  }, [modes, userLocation, activeTab, setActiveTab, setBiodiversityBiome]);

  const handleStateLocated = useCallback((stateId: string, stateName: string, regionId?: string) => {
    const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
    const resolvedRegion = regionId || guardian?.regionId || 'sudeste';
    const loc = { stateId, stateName, regionId: resolvedRegion };
    setUserLocation(loc);
    try {
      localStorage.setItem('brquest_user_geolocation', JSON.stringify(loc));
    } catch {}

    setSelectedStateId(stateId);
    modes.setFocusedStateId(stateId);
    modes.setSelectedRegionFilter(resolvedRegion);
    if (modes.mainMode === 'biodiversidade') {
      setBiodiversityBiome(getStateDefaultBiome(stateId));
    }
  }, [modes, setBiodiversityBiome]);

  const handleClearUserLocation = useCallback(() => {
    setUserLocation(null);
    try {
      localStorage.removeItem('brquest_user_geolocation');
    } catch {}
    setSelectedStateId(null);
    modes.setFocusedStateId(null);
    modes.setSelectedRegionFilter('todos');
    modes.setCenterMapTrigger((prev: number) => prev + 1);
    notify('🌐 Modo Livre ativado: visualização de todo o território brasileiro.');
  }, [modes, notify]);

  const handleTeleportFromDailyTip = useCallback((targetStateId: string) => {
    closeDailyTips();
    setSelectedStateId(targetStateId);
    modes.setFocusedStateId(targetStateId);
    audioEngine.playSfx('travel');
    notify(`🎯 Teletransportado com sucesso para ${targetStateId}!`);
  }, [closeDailyTips, modes, notify]);

  return {
    hoveredStateId,
    setHoveredStateId,
    selectedStateId,
    setSelectedStateId,
    userLocation,
    activeCartographyLayer,
    selectedTerritorySubitemId,
    setSelectedTerritorySubitemId,
    isTerritorySubmenuOpen,
    setIsTerritorySubmenuOpen,
    handleSelectCartographyLayer,
    handleSelectMainMode,
    handleStateLocated,
    handleClearUserLocation,
    handleTeleportFromDailyTip,
  };
}
