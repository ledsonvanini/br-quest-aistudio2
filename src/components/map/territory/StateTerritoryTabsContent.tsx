/**
 * StateTerritoryTabsContent.tsx
 * Subcomponente de Conteúdo Modular das Abas do AppLateral de Detalhamento do Estado.
 * Abas: Köppen | Bacias (ANA 2025/2026) | Relevo (Jurandyr Ross) | Extremos | Rotas | Dados.
 */

import React from 'react';
import { TerritoryBasinTabContent } from './TerritoryBasinTabContent';
import { TerritoryReliefTabContent } from './TerritoryReliefTabContent';
import { TerritoryKoppenTabContent } from './TerritoryKoppenTabContent';
import { TerritoryExtremesTabContent } from './TerritoryExtremesTabContent';
import { TerritoryRoutesTabContent } from './TerritoryRoutesTabContent';
import { TerritoryCensusTabContent } from './TerritoryCensusTabContent';

export type TerritoryDialogTab =
  | 'koppen'
  | 'bacias'
  | 'relevo'
  | 'extremos'
  | 'rotas'
  | 'dados';

interface StateTerritoryTabsContentProps {
  stateId: string;
  activeTab: TerritoryDialogTab;
}

export const StateTerritoryTabsContent: React.FC<StateTerritoryTabsContentProps> = ({
  stateId,
  activeTab,
}) => {
  return (
    <div className="conteudo-abas-territorio flex-1 overflow-y-auto p-3.5 sm:p-4 md:p-5 space-y-4 select-text">
      {activeTab === 'koppen' && <TerritoryKoppenTabContent stateId={stateId} />}
      {activeTab === 'bacias' && <TerritoryBasinTabContent stateId={stateId} />}
      {activeTab === 'relevo' && <TerritoryReliefTabContent stateId={stateId} />}
      {activeTab === 'extremos' && <TerritoryExtremesTabContent stateId={stateId} />}
      {activeTab === 'rotas' && <TerritoryRoutesTabContent stateId={stateId} />}
      {activeTab === 'dados' && <TerritoryCensusTabContent stateId={stateId} />}
    </div>
  );
};
