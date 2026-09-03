/**
 * Fachada Retrocompatível do Serviço Meteorológico e Oceanográfico
 * Redireciona e expõe a arquitetura modular em /src/services/climate/
 * 
 * Regra de Ouro: Arquivo enxuto (< 30 linhas) com garantia de compatibilidade total.
 */

export * from './climate/climateService';
export * from './climate/openMeteoClient';
