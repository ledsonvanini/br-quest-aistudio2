// State Data Module: Acre (AC)
// Unified module for AC packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'AC';
export const info = BRAZIL_STATES_REGISTRY['AC'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'AC')!;
export const anthems = ANTHEMS_BY_STATE['AC'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['AC'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['AC'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['AC'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['AC'];
export const speech = GUARDIAN_SPEECHES['AC'];

export const bundle: StateDataBundle = {
  uf: 'AC',
  info,
  guardian,
  anthems,
  culturalItems: cultural,
  geopolitics,
  climatology,
  biodiversity,
  speech,
};

export default bundle;
