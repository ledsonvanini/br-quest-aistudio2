// State Data Module: São Paulo (SP)
// Unified module for SP packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'SP';
export const info = BRAZIL_STATES_REGISTRY['SP'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'SP')!;
export const anthems = ANTHEMS_BY_STATE['SP'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['SP'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['SP'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['SP'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['SP'];
export const speech = GUARDIAN_SPEECHES['SP'];

export const bundle: StateDataBundle = {
  uf: 'SP',
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
