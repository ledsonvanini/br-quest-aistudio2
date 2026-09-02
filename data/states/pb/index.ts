// State Data Module: Paraíba (PB)
// Unified module for PB packaging registry, guardian, anthems, cultural inventory, geopolitics, climatology and biodiversity.
import { StateDataBundle } from '../types';
import { BRAZIL_STATES_REGISTRY } from '../../brazilStatesRegistry';
import { GUARDIANS_DATA } from '../../guardiansData';
import { ANTHEMS_BY_STATE } from '../../anthemsData';
import { CULTURAL_INVENTORY_BY_STATE } from '../../culturalInventoryData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../geopoliticaData';
import { STATE_CLIMATOLOGY_DATABASE } from '../../stateClimatologyData';
import { STATE_BIODIVERSITY_PROFILES } from '../../brazilBiodiversityData';
import { GUARDIAN_SPEECHES } from '../../guardianPhrases';

export const uf = 'PB';
export const info = BRAZIL_STATES_REGISTRY['PB'];
export const guardian = GUARDIANS_DATA.find((g) => g.id === 'PB')!;
export const anthems = ANTHEMS_BY_STATE['PB'];
export const cultural = CULTURAL_INVENTORY_BY_STATE['PB'] || [];
export const geopolitics = BRAZIL_STATES_GEOPOLITICS['PB'];
export const climatology = STATE_CLIMATOLOGY_DATABASE['PB'];
export const biodiversity = STATE_BIODIVERSITY_PROFILES['PB'];
export const speech = GUARDIAN_SPEECHES['PB'];

export const bundle: StateDataBundle = {
  uf: 'PB',
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
