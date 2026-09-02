// State Data Module: Pernambuco (PE)
// Unified module for PE packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'PE';
export const info = BRAZIL_STATES_REGISTRY['PE'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'PE')!;
export const anthems = ANTHEMS_BY_STATE['PE'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['PE'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['PE'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['PE'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['PE'];
export const speech = GUARDIAN_SPEECHES['PE'];

export const bundle: StateDataBundle = {
  uf: 'PE',
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
