// State Data Module: Tocantins (TO)
// Unified module for TO packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'TO';
export const info = BRAZIL_STATES_REGISTRY['TO'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'TO')!;
export const anthems = ANTHEMS_BY_STATE['TO'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['TO'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['TO'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['TO'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['TO'];
export const speech = GUARDIAN_SPEECHES['TO'];

export const bundle: StateDataBundle = {
  uf: 'TO',
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
