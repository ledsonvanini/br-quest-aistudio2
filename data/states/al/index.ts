// State Data Module: Alagoas (AL)
// Unified module for AL packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'AL';
export const info = BRAZIL_STATES_REGISTRY['AL'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'AL')!;
export const anthems = ANTHEMS_BY_STATE['AL'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['AL'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['AL'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['AL'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['AL'];
export const speech = GUARDIAN_SPEECHES['AL'];

export const bundle: StateDataBundle = {
  uf: 'AL',
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
