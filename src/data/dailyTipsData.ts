export type DailyTipCategory = 'clima' | 'biodiversidade' | 'geografia' | 'astrometria' | 'cultura';

export interface DailyTipItem {
  id: string;
  title: string;
  category: DailyTipCategory;
  stateId: string;
  stateName: string;
  fact: string;
  didYouKnow: string;
  curiosityDepth: string;
  sourceAgency: 'IBGE' | 'INPE' | 'NASA' | 'ICMBio' | 'IPHAN' | 'CPRM';
  sourceDetail: string;
  coordinates: { lat: number; lng: number };
  suggestedMode: '2d' | 'globo3d';
  actionLabel: string;
  xpReward: number;
}

export const DAILY_TIPS_CATALOG: DailyTipItem[] = [
  // --- CLIMA & FENÔMENOS EXTREMOS (INPE / CPTEC / CPRM) ---
  {
    id: 'tip-clima-rios-voadores',
    title: 'Rios Voadores da Amazônia',
    category: 'clima',
    stateId: 'AM',
    stateName: 'Amazonas',
    fact: 'Uma única árvore amazônica de grande porte bombeia mais de 1.000 litros de água por dia para a atmosfera.',
    didYouKnow: 'Você sabia que os "Rios Voadores" transportam mais vapor de água pela atmosfera do que toda a vazão diária do Rio Amazonas no mar?',
    curiosityDepth: 'Esse vapor é empurrado pelos ventos alísios contra a Cordilheira dos Andes, canalizando chuvas vitais para o Centro-Oeste e Sudeste.',
    sourceAgency: 'INPE',
    sourceDetail: 'Projeto Rios Voadores & CPTEC/INPE',
    coordinates: { lat: -3.119, lng: -60.021 },
    suggestedMode: '2d',
    actionLabel: 'Ver Rios Voadores no Amazonas',
    xpReward: 15,
  },
  {
    id: 'tip-clima-raios-brasil',
    title: 'Campeão Mundial de Raios',
    category: 'clima',
    stateId: 'MG',
    stateName: 'Minas Gerais',
    fact: 'O Brasil recebe cerca de 77,8 milhões de descargas atmosféricas todos os anos.',
    didYouKnow: 'Você sabia que o Brasil é o país com a maior incidência de raios do planeta Terra?',
    curiosityDepth: 'A vasta extensão tropical combinada à umidade da Amazônia e relevos do Sudeste cria tempestades convectivas gigantescas no verão.',
    sourceAgency: 'INPE',
    sourceDetail: 'Grupo de Eletricidade Atmosférica (ELAT/INPE)',
    coordinates: { lat: -19.916, lng: -43.934 },
    suggestedMode: '2d',
    actionLabel: 'Teletransportar para Minas Gerais',
    xpReward: 15,
  },
  {
    id: 'tip-clima-neve-sul',
    title: 'Geada e Neve nos Cânions',
    category: 'clima',
    stateId: 'SC',
    stateName: 'Santa Catarina',
    fact: 'Urubici e São Joaquim registram as menores temperaturas do Brasil, com termômetros abaixo de -10 °C.',
    didYouKnow: 'Você sabia que o Morro da Igreja (1.822 m) registrou a menor temperatura oficial do país: -17,8 °C em 1996?',
    curiosityDepth: 'Massas de ar polar vindas da Antártida encontram o planalto serrano escarpado, provocando precipitação nívea e sincelo.',
    sourceAgency: 'INPE',
    sourceDetail: 'Estação Meteorológica Inmet/Epagri-Ciram',
    coordinates: { lat: -27.595, lng: -48.548 },
    suggestedMode: '2d',
    actionLabel: 'Explorar Serras de Santa Catarina',
    xpReward: 15,
  },
  {
    id: 'tip-clima-calor-pantanal',
    title: 'A Fornalha do Pantanal',
    category: 'clima',
    stateId: 'MT',
    stateName: 'Mato Grosso',
    fact: 'Cuiabá e o Pantanal Norte costumam liderar o ranking nacional de calor, superando 42 °C.',
    didYouKnow: 'Você sabia que a planície do Pantanal atua como um enorme coletor térmico fechado por chapadas circundantes?',
    curiosityDepth: 'O relevo rebaixado e a baixa ventilação retêm calor intenso nos meses que antecedem as cheias do Rio Paraguai.',
    sourceAgency: 'INPE',
    sourceDetail: 'Monitoramento Climático Diário CPTEC',
    coordinates: { lat: -15.601, lng: -56.097 },
    suggestedMode: '2d',
    actionLabel: 'Explorar Clima do Mato Grosso',
    xpReward: 15,
  },
  {
    id: 'tip-clima-chuva-belem',
    title: 'A Chuva Pontual das 14h',
    category: 'clima',
    stateId: 'PA',
    stateName: 'Pará',
    fact: 'Belém registra chuva em mais de 250 dias ao ano, quase sempre após as 14 horas.',
    didYouKnow: 'Você sabia que os paraenses marcam encontros com base em "antes ou depois da chuva"?',
    curiosityDepth: 'A convecção diurna intensa evapora a umidade da Baía do Guajará e da floresta, gerando nuvens Cumulonimbus pontuais à tarde.',
    sourceAgency: 'INPE',
    sourceDetail: 'Climatologia Histórica do Trópico Úmido',
    coordinates: { lat: -1.455, lng: -48.502 },
    suggestedMode: '2d',
    actionLabel: 'Ver Chuvas no Pará',
    xpReward: 15,
  },

  // --- BIODIVERSIDADE RARA (ICMBIO / GBIF / MMA) ---
  {
    id: 'tip-bio-onca-pintada',
    title: 'O Santuário da Onça-Pintada',
    category: 'biodiversidade',
    stateId: 'MS',
    stateName: 'Mato Grosso do Sul',
    fact: 'O Pantanal abriga a maior densidade populacional e os maiores exemplares de onça-pintada do planeta.',
    didYouKnow: 'Você sabia que as onças do Pantanal chegam a pesar 140 kg, quase o dobro das onças da América Central?',
    curiosityDepth: 'A abundância de capivaras, jacarés e veados na bacia alagável garantiu uma adaptação física com mandíbulas muito mais potentes.',
    sourceAgency: 'ICMBio',
    sourceDetail: 'Centro Nacional de Pesquisa e Conservação de Carnívoros (CENAP)',
    coordinates: { lat: -20.469, lng: -54.62 },
    suggestedMode: '2d',
    actionLabel: 'Conhecer Onça no Pantanal (MS)',
    xpReward: 15,
  },
  {
    id: 'tip-bio-mico-leao',
    title: 'O Renascimento do Mico-Leão-Dourado',
    category: 'biodiversidade',
    stateId: 'RJ',
    stateName: 'Rio de Janeiro',
    fact: 'Existem apenas na Mata Atlântica fluminense e já estiveram à beira de menos de 200 indivíduos.',
    didYouKnow: 'Você sabia que viadutos florestais com copas de árvores interligadas foram erguidos sobre rodovias para salvá-los?',
    curiosityDepth: 'A fragmentação da floresta impedia o cruzamento genético, hoje recuperado com corredores ecológicos pioneiros.',
    sourceAgency: 'ICMBio',
    sourceDetail: 'Reserva Biológica de Poço das Antas (ICMBio/AMLD)',
    coordinates: { lat: -22.906, lng: -43.172 },
    suggestedMode: '2d',
    actionLabel: 'Ver Espécies Nativas no RJ',
    xpReward: 15,
  },
  {
    id: 'tip-bio-arara-azul-lear',
    title: 'O Tesouro dos Cânions da Caatinga',
    category: 'biodiversidade',
    stateId: 'BA',
    stateName: 'Bahia',
    fact: 'A rara Arara-azul-de-lear só nidifica nos paredões de arenito do Raso da Catarina.',
    didYouKnow: 'Você sabia que essa arara depende quase exclusivamente dos cocos da palmeira licuri para sobreviver?',
    curiosityDepth: 'Sua população esteve restrita a dezenas de aves nos anos 80 e hoje supera 2.000 exemplares graças à proteção das falésias.',
    sourceAgency: 'ICMBio',
    sourceDetail: 'Estação Ecológica Raso da Catarina / CEMAVE',
    coordinates: { lat: -12.977, lng: -38.501 },
    suggestedMode: '2d',
    actionLabel: 'Explorar Caatinga na Bahia',
    xpReward: 15,
  },
  {
    id: 'tip-bio-vitoria-regia',
    title: 'A Fortaleza Flutuante Amazônica',
    category: 'biodiversidade',
    stateId: 'AC',
    stateName: 'Acre',
    fact: 'A folha da vitória-régia pode atingir 2,5 metros de diâmetro e suportar até 40 kg sem afundar.',
    didYouKnow: 'Você sabia que o verso da folha possui uma teia radial de nervuras cheias de ar que imita vigas de engenharia?',
    curiosityDepth: 'Suas flores brancas mudam para rosa intenso na segunda noite após serem polinizadas por besouros do gênero Cyclocephala.',
    sourceAgency: 'ICMBio',
    sourceDetail: 'Flora do Brasil 2020 / Jardim Botânico RJ',
    coordinates: { lat: -9.975, lng: -67.824 },
    suggestedMode: '2d',
    actionLabel: 'Explorar Flora no Acre',
    xpReward: 15,
  },

  // --- GEOGRAFIA & FRONTEIRAS INUSITADAS (IBGE / CPRM) ---
  {
    id: 'tip-geo-ponto-oriental',
    title: 'O Ponto Mais Oriental das Américas',
    category: 'geografia',
    stateId: 'PB',
    stateName: 'Paraíba',
    fact: 'A Ponta do Seixas, em João Pessoa, é o ponto continental mais próximo do continente africano.',
    didYouKnow: 'Você sabia que em João Pessoa o sol nasce e se põe mais cedo do que em qualquer outra capital continental brasileira?',
    curiosityDepth: 'Longitude 34° 47\' 30" W: daqui até a costa de Dacar, no Senegal, são menos de 3.000 quilômetros em linha reta pelo Atlântico.',
    sourceAgency: 'IBGE',
    sourceDetail: 'Marcos Geodésicos Fundamentais IBGE',
    coordinates: { lat: -7.152, lng: -34.795 },
    suggestedMode: 'globo3d',
    actionLabel: 'Ver Ponta do Seixas no Globo 3D',
    xpReward: 15,
  },
  {
    id: 'tip-geo-nascente-foz',
    title: 'Mais Perto do Canadá que do RS',
    category: 'geografia',
    stateId: 'RR',
    stateName: 'Roraima',
    fact: 'O Monte Caburaí (RR) está mais próximo da Groenlândia e do Canadá do que do Arroio Chuí no Rio Grande do Sul.',
    didYouKnow: 'Você sabia que o extremo norte do Brasil não é o Oiapoque, mas sim o Monte Caburaí, a 84 km mais ao norte?',
    curiosityDepth: 'A expressão "do Oiapoque ao Chuí" é popular, mas geograficamente incorreta: o correto é "do Caburaí ao Chuí".',
    sourceAgency: 'IBGE',
    sourceDetail: 'Comissão Brasileira Demarcadora de Limites',
    coordinates: { lat: 2.823, lng: -60.675 },
    suggestedMode: 'globo3d',
    actionLabel: 'Girar Globo para Monte Caburaí',
    xpReward: 15,
  },
  {
    id: 'tip-geo-berco-aguas',
    title: 'O Berço das Bacias Hidrográficas',
    category: 'geografia',
    stateId: 'GO',
    stateName: 'Goiás',
    fact: 'As águas que brotam no planalto goiano correm para 3 das maiores bacias da América do Sul.',
    didYouKnow: 'Você sabia que no Parque Nacional das Emas uma gota de chuva pode cair e seguir para o Rio Amazonas ou para a Bacia do Prata?',
    curiosityDepth: 'O relevo do Cerrado atua como um divisor de águas continental subterrâneo mantido por aquíferos profundos.',
    sourceAgency: 'IBGE',
    sourceDetail: 'Atlas Nacional do Brasil / ANA',
    coordinates: { lat: -16.686, lng: -49.264 },
    suggestedMode: '2d',
    actionLabel: 'Ver Bacias Hidrográficas em Goiás',
    xpReward: 15,
  },
  {
    id: 'tip-geo-ilha-bananal',
    title: 'A Maior Ilha Fluvial do Mundo',
    category: 'geografia',
    stateId: 'TO',
    stateName: 'Tocantins',
    fact: 'A Ilha do Bananal tem 20.000 km², uma área maior que o Líbano ou o estado de Sergipe.',
    didYouKnow: 'Você sabia que ela é cercada por dois braços do Rio Araguaia e abriga aldeias das etnias Karajá e Javaé?',
    curiosityDepth: 'É uma transição ecológica perfeita entre a Amazônia e o Cerrado, inundada anualmente pelo ciclo hidrológico.',
    sourceAgency: 'IBGE',
    sourceDetail: 'Divisão Territorial Brasileira (DTB/IBGE)',
    coordinates: { lat: -10.184, lng: -48.333 },
    suggestedMode: '2d',
    actionLabel: 'Ver Ilha do Bananal no Tocantins',
    xpReward: 15,
  },

  // --- ASTROMETRIA & SOL (NASA / INPE) ---
  {
    id: 'tip-astro-equador-marco-zero',
    title: 'A Linha Equinocial e o Monumento do Sol',
    category: 'astrometria',
    stateId: 'AP',
    stateName: 'Amapá',
    fact: 'Em Macapá, no monumento Marco Zero, você pode ter um pé no Hemisfério Norte e outro no Hemisfério Sul.',
    didYouKnow: 'Você sabia que nos equinócios de março e setembro o Sol se alinha perfeitamente ao rasgo de 30 metros do obelisco?',
    curiosityDepth: 'Nesse dia astronômico, a Terra não projeta sombras laterais ao meio-dia solar exato sobre a linha imaginária de latitude 0°.',
    sourceAgency: 'NASA',
    sourceDetail: 'Observatório Solar & Efemérides Astronômicas',
    coordinates: { lat: 0.035, lng: -51.07 },
    suggestedMode: 'globo3d',
    actionLabel: 'Ver Linha do Equador no Globo 3D',
    xpReward: 15,
  },
  {
    id: 'tip-astro-alcantara',
    title: 'A Rampa de Lançamento Mais Veloz',
    category: 'astrometria',
    stateId: 'MA',
    stateName: 'Maranhão',
    fact: 'O Centro Espacial de Alcântara economiza até 30% de combustível no lançamento de satélites.',
    didYouKnow: 'Você sabia que Alcântara está a apenas 2°18\' ao sul do Equador, onde a rotação da Terra atinge velocidade máxima?',
    curiosityDepth: 'O empurrão tangencial da rotação planetária (~1.670 km/h) ajuda foguetes a alcançarem a velocidade de escape orbital com menos propelente.',
    sourceAgency: 'NASA',
    sourceDetail: 'Agência Espacial Brasileira (AEB/MCTI)',
    coordinates: { lat: -2.53, lng: -44.306 },
    suggestedMode: 'globo3d',
    actionLabel: 'Explorar Base de Alcântara no Maranhão',
    xpReward: 15,
  },
  {
    id: 'tip-astro-cruzeiro-do-sul',
    title: 'A Constelação da Bandeira Nacional',
    category: 'astrometria',
    stateId: 'DF',
    stateName: 'Distrito Federal',
    fact: 'A bandeira do Brasil reflete a posição real do céu do Rio de Janeiro às 8h30 de 15 de novembro de 1889.',
    didYouKnow: 'Você sabia que cada estrela da bandeira representa uma unidade federativa e sua magnitude astronômica real?',
    curiosityDepth: 'A estrela solitária acima da faixa "Ordem e Progresso" é Spica (Alpha Virginis), representando o estado do Pará.',
    sourceAgency: 'NASA',
    sourceDetail: 'Observatório Nacional / Lei nº 5.700',
    coordinates: { lat: -15.797, lng: -47.882 },
    suggestedMode: 'globo3d',
    actionLabel: 'Ver Constelações a partir de Brasília',
    xpReward: 15,
  },
  {
    id: 'tip-astro-luzes-noturnas',
    title: 'A Teia Noturna Vista do Espaço',
    category: 'astrometria',
    stateId: 'SP',
    stateName: 'São Paulo',
    fact: 'A megalópole Rio-São Paulo forma a mancha luminosa contínua mais brilhante de todo o Hemisfério Sul.',
    didYouKnow: 'Você sabia que satélites meteorológicos da NASA medem a atividade econômica analisando a luminosidade noturna?',
    curiosityDepth: 'Os sensores VIIRS/DNB detectam a malha de rodovias iluminadas convergindo para as serras e o litoral paulista.',
    sourceAgency: 'NASA',
    sourceDetail: 'NASA Earth Observatory (Black Marble VIIRS)',
    coordinates: { lat: -23.55, lng: -46.633 },
    suggestedMode: 'globo3d',
    actionLabel: 'Ver Luzes Noturnas no Globo 3D',
    xpReward: 15,
  },

  // --- CULTURA, PATRIMÔNIO & HISTÓRIA (IPHAN) ---
  {
    id: 'tip-cult-ouro-preto',
    title: 'A Capital Mundial do Barroco nas Rochas',
    category: 'cultura',
    stateId: 'MG',
    stateName: 'Minas Gerais',
    fact: 'Ouro Preto foi a primeira cidade brasileira declarada Patrimônio Mundial pela UNESCO, em 1980.',
    didYouKnow: 'Você sabia que as igrejas de Ouro Preto usaram pedra-sabão e talha dourada criada pelas mãos de Aleijadinho?',
    curiosityDepth: 'A riqueza aurífera do século XVIII financiou uma arquitetura única adaptada à topografia sinuosa dos contrafortes da Serra do Espinhaço.',
    sourceAgency: 'IPHAN',
    sourceDetail: 'Dossiê do Patrimônio Mundial UNESCO/IPHAN',
    coordinates: { lat: -20.385, lng: -43.503 },
    suggestedMode: '2d',
    actionLabel: 'Ver Minas Gerais Histórica',
    xpReward: 15,
  },
  {
    id: 'tip-cult-frevo-patrimonio',
    title: 'A Dança que Nasceu da Capoeira',
    category: 'cultura',
    stateId: 'PE',
    stateName: 'Pernambuco',
    fact: 'O Frevo pernambucano é reconhecido pela UNESCO como Patrimônio Cultural Imaterial da Humanidade.',
    didYouKnow: 'Você sabia que os passos frenéticos do Frevo com sombrinha nasceram dos movimentos de defesa pessoal da capoeira?',
    curiosityDepth: 'No final do século XIX, capoeiristas protegiam bandas marciais nas ruas de Olinda e Recife usando sombrinhas como escudo e disfarce.',
    sourceAgency: 'IPHAN',
    sourceDetail: 'Inventário Nacional de Referências Culturais',
    coordinates: { lat: -8.047, lng: -34.877 },
    suggestedMode: '2d',
    actionLabel: 'Explorar Tradições em Pernambuco',
    xpReward: 15,
  },
  {
    id: 'tip-cult-serras-capivara',
    title: 'O Registro Humano Mais Antigo das Américas',
    category: 'cultura',
    stateId: 'PI',
    stateName: 'Piauí',
    fact: 'O Parque Nacional da Serra da Capivara abriga mais de 30.000 pinturas rupestres pré-históricas.',
    didYouKnow: 'Você sabia que pesquisas lideradas por Niède Guidon identificaram fogueiras e vestígios humanos de mais de 50.000 anos?',
    curiosityDepth: 'Essa descoberta desafiou a teoria tradicional de que os humanos teriam chegado às Américas exclusivamente pelo Estreito de Bering há 13.000 anos.',
    sourceAgency: 'IPHAN',
    sourceDetail: 'Fundação Museu do Homem Americano (FUMDHAM)',
    coordinates: { lat: -8.847, lng: -42.544 },
    suggestedMode: '2d',
    actionLabel: 'Ver Serra da Capivara no Piauí',
    xpReward: 15,
  },
  {
    id: 'tip-cult-cataratas-iguacu',
    title: 'O Trovão das Águas Sagradas',
    category: 'cultura',
    stateId: 'PR',
    stateName: 'Paraná',
    fact: 'As Cataratas do Iguaçu somam 275 saltos de água e foram consideradas uma das Novas 7 Maravilhas da Natureza.',
    didYouKnow: 'Você sabia que para a lenda indígena Guarani as cataratas foram criadas pela fúria da serpente mitológica M\'Boi?',
    curiosityDepth: 'A Garganta do Diabo despenca de 80 metros de altura em formato de ferradura geológica esculpida por derrames basálticos há 130 milhões de anos.',
    sourceAgency: 'IPHAN',
    sourceDetail: 'Patrimônio Natural da Humanidade UNESCO/ICMBio',
    coordinates: { lat: -25.695, lng: -54.436 },
    suggestedMode: '2d',
    actionLabel: 'Visitar Cataratas no Paraná',
    xpReward: 15,
  },
];

/**
 * Seleciona deterministicamente as 5 dicas do dia (1 de cada pilar de conhecimento).
 * Garante que todos os usuários vejam exatamente as mesmas 5 dicas para uma mesma data civil (Brasília).
 */
export function getDailyTipsForDate(dateStr?: string): DailyTipItem[] {
  const dStr = dateStr || new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Cria um hash numérico simples a partir da string da data (ex: "13/09/2026")
  let hash = 0;
  for (let i = 0; i < dStr.length; i++) {
    hash = (hash << 5) - hash + dStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveSeed = Math.abs(hash);

  const categories: DailyTipCategory[] = ['clima', 'biodiversidade', 'geografia', 'astrometria', 'cultura'];

  return categories.map((cat, index) => {
    const subset = DAILY_TIPS_CATALOG.filter((tip) => tip.category === cat);
    if (subset.length === 0) {
      return DAILY_TIPS_CATALOG[index % DAILY_TIPS_CATALOG.length];
    }
    const tipIndex = (positiveSeed + index * 11) % subset.length;
    return subset[tipIndex];
  });
}
