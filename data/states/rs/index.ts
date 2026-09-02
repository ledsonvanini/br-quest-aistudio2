// State Data Module: Rio Grande do Sul (RS)
// Unified module for RS packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'RS';
export const info = BRAZIL_STATES_REGISTRY['RS'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'RS')!;
export const anthems = ANTHEMS_BY_STATE['RS'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['RS'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['RS'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['RS'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['RS'];
export const speech = GUARDIAN_SPEECHES['RS'];

export const bundle: StateDataBundle = {
  uf: 'RS',
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
