/**
 * Fachada Retrocompatível do Serviço de Imagens de Biodiversidade
 * Redireciona e expõe a arquitetura modular em /src/services/biodiversity/
 * 
 * Regra de Ouro: Arquivo enxuto (< 20 linhas) com garantia de compatibilidade total.
 */

export * from './biodiversity/biodiversityImageService';
