/**
 * Fachada Retrocompatível do Serviço de Telemetria e Rastreamento de APIs
 * Redireciona e expõe a arquitetura modular em /src/services/telemetry/
 * 
 * Regra de Ouro: Arquivo enxuto (< 20 linhas) com garantia de compatibilidade total.
 */

export * from './telemetry/apiTrackerService';
