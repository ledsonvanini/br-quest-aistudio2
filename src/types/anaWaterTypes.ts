/**
 * anaWaterTypes.ts
 * Definição de tipos TypeScript para dados oficiais da ANA (Agência Nacional de Águas e Saneamento Básico)
 * e IBGE baseados na Conjuntura dos Recursos Hídricos 2024/2025/2026 e Dados Abertos (SNIRH).
 */

export interface AnaWaterUseShare {
  irrigacao: number;            // % de uso da água para irrigação agrícola
  abastecimentoUrbano: number;  // % para consumo humano / urbano
  industria: number;            // % industrial
  dessedentacaoAnimal: number;  // % pecuária
  termoeletricas: number;       // % termelétricas e outros
}

export interface JurandyrRossRelief {
  macroUnit: 'Planaltos' | 'Planícies' | 'Depressões' | 'Planaltos e Depressões';
  subUnits: string[];
  altitudeRange: string;
  dominantFeatures: string;
}

export interface StateClimateKoppenInfo {
  koppenCode: string;
  koppenDescription: string;
  annualPrecipitationMm: number;
  averagePressureHpa: number;
  rainySeason: string;
  drySeason: string;
}

export interface StateAnaWaterBalance2025 {
  stateId: string;
  stateName: string;
  basinOfficialName: string;
  ugrhCount: number;
  averageDischargeM3s: number;
  waterAvailabilityPerCapitaM3Year: number;
  consumptiveDemandM3s: number;
  waterUseShare: AnaWaterUseShare;
  waterSecurityStatus: 'Excelente' | 'Confortável' | 'Atenção' | 'Crítico' | 'Alerta Sazonal';
  anaReportEdition: string;
  snirhDataPortalUrl: string;
  jurandyrRossRelief: JurandyrRossRelief;
  climateClassification: StateClimateKoppenInfo;
}
