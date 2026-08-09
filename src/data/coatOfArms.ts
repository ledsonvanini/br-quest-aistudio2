export const STATE_COAT_OF_ARMS: Record<string, string> = {
  AC: '/brasao_br/brasao-do-acre-300x295.png',
  AL: '/brasao_br/brasao-de-alagoas-272x300.png',
  AM: '/brasao_br/brasao-do-amazonas-712x1024.png',
  AP: '/brasao_br/brasao-do-amapa-260x300.png',
  BA: '/brasao_br/brasao-da-bahia-256x300.png',
  CE: '/brasao_br/brasao-do-ceara-753x1024.png',
  DF: '/brasao_br/brasao-do-distrito-federal-768x901.png',
  ES: '/brasao_br/brasao-espirito-santo-768x846.png',
  GO: '/brasao_br/brasao-de-goias-765x1024.png',
  MA: '/brasao_br/brasao-maranhao-estado-768x768.png',
  MG: '/brasao_br/brasao-estado-minas-gerais-768x734.png',
  RJ: '/brasao_br/brasao-estado-rio-de-janeiro-768x977.png',
  SP: '/brasao_br/brasao-estado-de-sao-paulo-768x892.png',

  // High quality reliable coat of arms for remaining Brazilian states
  RS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Bras%C3%A3o_do_Rio_Grande_do_Sul.svg/300px-Bras%C3%A3o_do_Rio_Grande_do_Sul.svg.png',
  SC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_de_Santa_Catarina.svg/300px-Bras%C3%A3o_de_Santa_Catarina.svg.png',
  PR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_do_Paran%C3%A1.svg/300px-Bras%C3%A3o_do_Paran%C3%A1.svg.png',
  MS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg/300px-Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg.png',
  MT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bras%C3%A3o_de_Mato_Grosso.svg/300px-Bras%C3%A3o_de_Mato_Grosso.svg.png',
  PA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bras%C3%A3o_do_Par%C3%A1.svg/300px-Bras%C3%A3o_do_Par%C3%A1.svg.png',
  PB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bras%C3%A3o_da_Para%C3%ADba.svg/300px-Bras%C3%A3o_da_Para%C3%ADba.svg.png',
  PE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bras%C3%A3o_de_Pernambuco.svg/300px-Bras%C3%A3o_de_Pernambuco.svg.png',
  PI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bras%C3%A3o_do_Piau%C3%AD.svg/300px-Bras%C3%A3o_do_Piau%C3%AD.svg.png',
  RN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bras%C3%A3o_do_Rio_Grande_do_Norte.svg/300px-Bras%C3%A3o_do_Rio_Grande_do_Norte.svg.png',
  RO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bras%C3%A3o_de_Rond%C3%B4nia.svg/300px-Bras%C3%A3o_de_Rond%C3%B4nia.svg.png',
  RR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bras%C3%A3o_de_Roraima.svg/300px-Bras%C3%A3o_de_Roraima.svg.png',
  SE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bras%C3%A3o_de_Sergipe.svg/300px-Bras%C3%A3o_de_Sergipe.svg.png',
  TO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bras%C3%A3o_do_Tocantins.svg/300px-Bras%C3%A3o_do_Tocantins.svg.png',
};

export function getCoatOfArmsUrl(stateId: string): string {
  return STATE_COAT_OF_ARMS[stateId.toUpperCase()] || '';
}
