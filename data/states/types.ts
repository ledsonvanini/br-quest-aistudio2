import { BrazilStateInfo } from '../brazilStatesRegistry';
import { GuardianData, StateBiodiversityProfile } from '../../types';
import { AnthemItem } from '../anthemsData';
import { CulturalItem } from '../culturalInventoryData';
import { StateGeopoliticsProfile } from '../../types/geopolitica';
import { StateClimatologyDetail } from '../stateClimatologyData';
import { GuardianSpeechData } from '../guardianPhrases';

export interface StateDataBundle {
  uf: string;
  info: BrazilStateInfo;
  guardian: GuardianData;
  anthems?: {
    stateAnthem: AnthemItem;
    capitalAnthem: AnthemItem;
  };
  culturalItems?: CulturalItem[];
  geopolitics?: StateGeopoliticsProfile;
  climatology?: StateClimatologyDetail;
  biodiversity?: StateBiodiversityProfile;
  speech?: GuardianSpeechData;
}
