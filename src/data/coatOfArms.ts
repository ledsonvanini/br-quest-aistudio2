// Official state coats of arms with reliable CDN fallbacks and heraldic metadata
export interface StateHeraldicInfo {
  coatUrl: string;
  fallbackUrl: string;
  colors: [string, string, string]; // Top, Mid, Base heraldic colors
  symbol: string;
  motto?: string;
}

export const STATE_HERALDIC_DATA: Record<string, StateHeraldicInfo> = {
  AC: {
    coatUrl: '/brasao_br/brasao-do-acre-300x295.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Bras%C3%A3o_do_Acre.svg/200px-Bras%C3%A3o_do_Acre.svg.png',
    colors: ['#15803d', '#eab308', '#b91c1c'],
    symbol: '★',
    motto: 'Nec Luceat In Falsis',
  },
  AL: {
    coatUrl: '/brasao_br/brasao-de-alagoas-272x300.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bras%C3%A3o_de_Alagoas.svg/200px-Bras%C3%A3o_de_Alagoas.svg.png',
    colors: ['#dc2626', '#ffffff', '#2563eb'],
    symbol: '⚓',
    motto: 'Paz e Prosperidade',
  },
  AM: {
    coatUrl: '/brasao_br/brasao-do-amazonas-712x1024.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bras%C3%A3o_do_Amazonas.svg/200px-Bras%C3%A3o_do_Amazonas.svg.png',
    colors: ['#166534', '#0284c7', '#eab308'],
    symbol: '☀️',
    motto: 'Amazonas',
  },
  AP: {
    coatUrl: '/brasao_br/brasao-do-amapa-260x300.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bras%C3%A3o_do_Amap%C3%A1.svg/200px-Bras%C3%A3o_do_Amap%C3%A1.svg.png',
    colors: ['#15803d', '#0284c7', '#ca8a04'],
    symbol: 'Fortaleza',
    motto: 'Amapá',
  },
  BA: {
    coatUrl: '/brasao_br/brasao-da-bahia-256x300.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Bras%C3%A3o_da_Bahia.svg/200px-Bras%C3%A3o_da_Bahia.svg.png',
    colors: ['#2563eb', '#dc2626', '#ffffff'],
    symbol: '★',
    motto: 'Per Ardua Surgo',
  },
  CE: {
    coatUrl: '/brasao_br/brasao-do-ceara-753x1024.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Bras%C3%A3o_do_Cear%C3%A1.svg/200px-Bras%C3%A3o_do_Cear%C3%A1.svg.png',
    colors: ['#15803d', '#eab308', '#0284c7'],
    symbol: '☀️',
    motto: 'Terra da Luz',
  },
  DF: {
    coatUrl: '/brasao_br/brasao-do-distrito-federal-768x901.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bras%C3%A3o_do_Distrito_Federal_%28Brasil%29.svg/200px-Bras%C3%A3o_do_Distrito_Federal_%28Brasil%29.svg.png',
    colors: ['#15803d', '#eab308', '#ffffff'],
    symbol: '✛',
    motto: 'Venturis Ventis',
  },
  ES: {
    coatUrl: '/brasao_br/brasao-espirito-santo-768x846.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bras%C3%A3o_do_Esp%C3%ADrito_Santo.svg/200px-Bras%C3%A3o_do_Esp%C3%ADrito_Santo.svg.png',
    colors: ['#38bdf8', '#ffffff', '#f472b6'],
    symbol: '🕊️',
    motto: 'Trabalha e Confia',
  },
  GO: {
    coatUrl: '/brasao_br/brasao-de-goias-765x1024.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Bras%C3%A3o_de_Goi%C3%A1s.svg/200px-Bras%C3%A3o_de_Goi%C3%A1s.svg.png',
    colors: ['#15803d', '#eab308', '#2563eb'],
    symbol: '🌾',
    motto: 'Terra Fértil',
  },
  MA: {
    coatUrl: '/brasao_br/brasao-maranhao-estado-768x768.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bras%C3%A3o_do_Maranh%C3%A3o.svg/200px-Bras%C3%A3o_do_Maranh%C3%A3o.svg.png',
    colors: ['#dc2626', '#ffffff', '#1e293b'],
    symbol: '★',
    motto: 'Maranhão',
  },
  MG: {
    coatUrl: '/brasao_br/brasao-estado-minas-gerais-768x734.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Bras%C3%A3o_de_Minas_Gerais.svg/200px-Bras%C3%A3o_de_Minas_Gerais.svg.png',
    colors: ['#dc2626', '#ffffff', '#b91c1c'],
    symbol: '▲',
    motto: 'Libertas Quæ Sera Tamen',
  },
  MS: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/MS.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg/200px-Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg.png',
    colors: ['#2563eb', '#15803d', '#ffffff'],
    symbol: '★',
    motto: 'Mato Grosso do Sul',
  },
  MT: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/MT.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bras%C3%A3o_de_Mato_Grosso.svg/200px-Bras%C3%A3o_de_Mato_Grosso.svg.png',
    colors: ['#15803d', '#eab308', '#2563eb'],
    symbol: '★',
    motto: 'Virtute Plusquam Auro',
  },
  PA: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/PA.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bras%C3%A3o_do_Par%C3%A1.svg/200px-Bras%C3%A3o_do_Par%C3%A1.svg.png',
    colors: ['#dc2626', '#ffffff', '#2563eb'],
    symbol: '★',
    motto: 'Sub Lege Progrediamur',
  },
  PB: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/PB.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bras%C3%A3o_da_Para%C3%ADba.svg/200px-Bras%C3%A3o_da_Para%C3%ADba.svg.png',
    colors: ['#dc2626', '#0f172a', '#ffffff'],
    symbol: 'NEGO',
    motto: 'Nego',
  },
  PE: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/PE.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bras%C3%A3o_de_Pernambuco.svg/200px-Bras%C3%A3o_de_Pernambuco.svg.png',
    colors: ['#2563eb', '#ffffff', '#eab308'],
    symbol: '🌈',
    motto: 'Ego Sum Qui Sum',
  },
  PI: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/PI.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bras%C3%A3o_do_Piau%C3%AD.svg/200px-Bras%C3%A3o_do_Piau%C3%AD.svg.png',
    colors: ['#15803d', '#eab308', '#ffffff'],
    symbol: '★',
    motto: 'Impavidum Ferient Ruinae',
  },
  PR: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/PR.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_do_Paran%C3%A1.svg/200px-Bras%C3%A3o_do_Paran%C3%A1.svg.png',
    colors: ['#15803d', '#ffffff', '#2563eb'],
    symbol: '🌲',
    motto: 'Paraná',
  },
  RJ: {
    coatUrl: '/brasao_br/brasao-estado-rio-de-janeiro-768x977.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bras%C3%A3o_do_estado_do_Rio_de_Janeiro.svg/200px-Bras%C3%A3o_do_estado_do_Rio_de_Janeiro.svg.png',
    colors: ['#0284c7', '#ffffff', '#eab308'],
    symbol: '🦅',
    motto: 'Recte Rempublicam Gerere',
  },
  RN: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/RN.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bras%C3%A3o_do_Rio_Grande_do_Norte.svg/200px-Bras%C3%A3o_do_Rio_Grande_do_Norte.svg.png',
    colors: ['#15803d', '#ffffff', '#eab308'],
    symbol: '★',
    motto: 'Rio Grande do Norte',
  },
  RO: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/RO.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bras%C3%A3o_de_Rond%C3%B4nia.svg/200px-Bras%C3%A3o_de_Rond%C3%B4nia.svg.png',
    colors: ['#2563eb', '#15803d', '#eab308'],
    symbol: '★',
    motto: 'Rondônia',
  },
  RR: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/RR.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bras%C3%A3o_de_Roraima.svg/200px-Bras%C3%A3o_de_Roraima.svg.png',
    colors: ['#15803d', '#0284c7', '#eab308'],
    symbol: '★',
    motto: 'Roraima',
  },
  RS: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/RS.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Bras%C3%A3o_do_Rio_Grande_do_Sul.svg/200px-Bras%C3%A3o_do_Rio_Grande_do_Sul.svg.png',
    colors: ['#15803d', '#dc2626', '#eab308'],
    symbol: '⚔️',
    motto: 'Liberdade, Igualdade, Humanidade',
  },
  SC: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/SC.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_de_Santa_Catarina.svg/200px-Bras%C3%A3o_de_Santa_Catarina.svg.png',
    colors: ['#dc2626', '#ffffff', '#15803d'],
    symbol: '★',
    motto: 'Santa Catarina',
  },
  SE: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/SE.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bras%C3%A3o_de_Sergipe.svg/200px-Bras%C3%A3o_de_Sergipe.svg.png',
    colors: ['#15803d', '#eab308', '#2563eb'],
    symbol: '★',
    motto: 'Sub Lege Libertas',
  },
  SP: {
    coatUrl: '/brasao_br/brasao-estado-de-sao-paulo-768x892.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bras%C3%A3o_do_estado_de_S%C3%A3o_Paulo.svg/200px-Bras%C3%A3o_do_estado_de_S%C3%A3o_Paulo.svg.png',
    colors: ['#dc2626', '#ffffff', '#0f172a'],
    symbol: '⚔️',
    motto: 'Pro Brasilia Fiant Eximia',
  },
  TO: {
    coatUrl: 'https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/TO.png',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bras%C3%A3o_do_Tocantins.svg/200px-Bras%C3%A3o_do_Tocantins.svg.png',
    colors: ['#0284c7', '#ffffff', '#eab308'],
    symbol: '☀️',
    motto: 'Co Yvy Orecatu',
  },
};

export const STATE_COAT_OF_ARMS: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_HERALDIC_DATA).map(([k, v]) => [k, v.coatUrl])
);

export function getCoatOfArmsUrl(stateId: string): string {
  return STATE_HERALDIC_DATA[stateId.toUpperCase()]?.coatUrl || '';
}

export function getStateHeraldicInfo(stateId: string): StateHeraldicInfo | undefined {
  return STATE_HERALDIC_DATA[stateId.toUpperCase()];
}

