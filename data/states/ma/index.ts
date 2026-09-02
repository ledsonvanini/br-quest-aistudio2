// State Data Module: Maranhão (MA)
// Unified module for MA packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'MA';
export const info = BRAZIL_STATES_REGISTRY['MA'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'MA')!;
export const anthems = ANTHEMS_BY_STATE['MA'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['MA'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['MA'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['MA'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['MA'];
export const speech = GUARDIAN_SPEECHES['MA'];

export const bundle: StateDataBundle = {
  uf: 'MA',
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
