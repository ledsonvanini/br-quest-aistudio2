// State Data Module: Rondônia (RO)
// Unified module for RO packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'RO';
export const info = BRAZIL_STATES_REGISTRY['RO'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'RO')!;
export const anthems = ANTHEMS_BY_STATE['RO'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['RO'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['RO'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['RO'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['RO'];
export const speech = GUARDIAN_SPEECHES['RO'];

export const bundle: StateDataBundle = {
  uf: 'RO',
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
