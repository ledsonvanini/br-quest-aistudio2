// State Data Module: Distrito Federal (DF)
// Unified module for DF packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'DF';
export const info = BRAZIL_STATES_REGISTRY['DF'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'DF')!;
export const anthems = ANTHEMS_BY_STATE['DF'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['DF'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['DF'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['DF'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['DF'];
export const speech = GUARDIAN_SPEECHES['DF'];

export const bundle: StateDataBundle = {
  uf: 'DF',
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
