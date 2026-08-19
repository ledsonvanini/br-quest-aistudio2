export interface RadioEraDevice {
  id: string;
  name: string;
  shortName: string;
  decade: string;
  yearRange: string;
  historicalContext: string;
  curiosity: string;
  musicalMovements: {
    title: string;
    description: string;
    keyGenres: string[];
    iconicArtists: string[];
  };
  cabinetStyle: {
    theme: 'wood_vintage' | 'catedral_artdeco' | 'bakelite_modernist' | 'metallic_boombox' | 'digital_futuristic';
    cabinetBorderColor: string;
    cabinetBgClass: string;
    accentColor: string;
    dialColor: string;
    hasMagicEye: boolean;
    hasVuMeter: boolean;
    hasDigitalDisplay: boolean;
    hasCoilGraphic: boolean;
  };
  audioProfile: {
    lowpassHz: number;
    highpassHz: number;
    tubeDrive: number;
    staticNoiseGain: number;
    description: string;
  };
}

export const VINTAGE_RADIO_ERAS: RadioEraDevice[] = [
  {
    id: 'catedral_1930_1940',
    name: 'Rádio Valvulado Art Déco "Capelinha"',
    shortName: 'Capelinha 1930s',
    decade: '1930–1940s',
    yearRange: '1936–1948',
    historicalContext: 'A Era de Ouro do Rádio Brasileiro, marcada pela Rádio Nacional do Rio de Janeiro (PRE-8), auditórios lotados, radionovelas e os maiores cantores do país.',
    curiosity: 'O famoso "Olho Mágico" valvulado verde (válvula 6E5) indicava visualmente a intensidade da sintonia ao fechar suas abas de luz fosforescente.',
    musicalMovements: {
      title: 'A Era de Ouro do Rádio & O Surgimento do Baião',
      description: 'Auditórios lotados, radionovelas, orquestras ao vivo e consagração do Samba-Canção, Choro e a explosão do Baião no Nordeste.',
      keyGenres: ['Samba-Canção', 'Choro Orquestrado', 'Baião & Xote', 'Samba de Breque', 'Marchinhas de Carnaval'],
      iconicArtists: ['Luiz Gonzaga', 'Carmen Miranda', 'Orlando Silva', 'Francisco Alves', 'Pixinguinha', 'Ary Barroso', 'Dorival Caymmi'],
    },
    cabinetStyle: {
      theme: 'catedral_artdeco',
      cabinetBorderColor: 'border-amber-700/80',
      cabinetBgClass: 'bg-gradient-to-b from-[#2e190b] via-[#1a0e06] to-[#0d0703]',
      accentColor: 'text-amber-400',
      dialColor: 'from-amber-900/60 to-yellow-950/80',
      hasMagicEye: true,
      hasVuMeter: false,
      hasDigitalDisplay: false,
      hasCoilGraphic: false,
    },
    audioProfile: {
      lowpassHz: 3600,
      highpassHz: 180,
      tubeDrive: 0.7,
      staticNoiseGain: 0.04,
      description: 'Som encorpado, quente e aveludado característico das válvulas termoiônicas a vácuo.',
    },
  },
  {
    id: 'galena_1920',
    name: 'Rádio Galena & Cristal de Rocha',
    shortName: 'Galena 1920s',
    decade: '1920s',
    yearRange: '1922–1929',
    historicalContext: 'Os primórdios do rádio no Brasil, inaugurado em 7 de setembro de 1922 no Centenário da Independência por Roquette-Pinto com a Rádio Sociedade.',
    curiosity: 'Funcionava sem pilhas ou eletricidade na tomada: a própria energia eletromagnética da antena alimentava o fone através do cristal semicondutor de sulfeto de chumbo.',
    musicalMovements: {
      title: 'Pioneirismo das Ondas & Primórdios do Choro',
      description: 'Transmissões experimentais, serestas românticas ao violão e as primeiras gravações mecânicas de Choro e Maxixe.',
      keyGenres: ['Choro Primitivo', 'Maxixe', 'Modinhas & Serestas', 'Valsas Brasileiras'],
      iconicArtists: ['Ernesto Nazareth', 'Chiquinha Gonzaga', 'Sinhô', 'Patrício Teixeira', 'Donga'],
    },
    cabinetStyle: {
      theme: 'wood_vintage',
      cabinetBorderColor: 'border-amber-800/80',
      cabinetBgClass: 'bg-gradient-to-b from-[#3a2213] via-[#24140a] to-[#120904]',
      accentColor: 'text-yellow-600',
      dialColor: 'from-yellow-950/70 to-stone-950/80',
      hasMagicEye: false,
      hasVuMeter: false,
      hasDigitalDisplay: false,
      hasCoilGraphic: true,
    },
    audioProfile: {
      lowpassHz: 2400,
      highpassHz: 350,
      tubeDrive: 0.1,
      staticNoiseGain: 0.08,
      description: 'Áudio rústico com frequências médias concentradas e estalos suaves do cristal mineral.',
    },
  },
  {
    id: 'modernista_1950_1960',
    name: 'Rádio Baquelite & Spidômetro "Bossa Nova"',
    shortName: 'Spidômetro 1950s',
    decade: '1950–1960s',
    yearRange: '1954–1965',
    historicalContext: 'A modernização estética de Brasília e o surgimento da Bossa Nova, com aparelhos de mesa em baquelite e plástico marfim inspirados no painel dos carros da época.',
    curiosity: 'O dial horizontal espelhado lembrava o velocímetro de um automóvel dos anos 50, com botões de baquelite polido e frisos dourados.',
    musicalMovements: {
      title: 'A Bossa Nova, Marchinhas & Início da Jovem Guarda',
      description: 'Batida sincopada no violão de João Gilberto, harmonias sofisticadas de Tom Jobim, auge das Marchinhas de Carnaval e a explosão do iê-iê-iê juvenil.',
      keyGenres: ['Bossa Nova', 'Marchinhas de Ouro', 'Samba-Jazz', 'Jovem Guarda (Iê-Iê-Iê)', 'Forró Pé-de-Serra'],
      iconicArtists: ['Tom Jobim', 'João Gilberto', 'Vinicius de Moraes', 'Dolores Duran', 'Jackson do Pandeiro', 'Roberto Carlos (Jovem Guarda)', 'Emilinha Borba'],
    },
    cabinetStyle: {
      theme: 'bakelite_modernist',
      cabinetBorderColor: 'border-yellow-600/70',
      cabinetBgClass: 'bg-gradient-to-b from-[#3b2d1d] via-[#211a12] to-[#0f0c08]',
      accentColor: 'text-amber-300',
      dialColor: 'from-amber-800/50 to-stone-900/80',
      hasMagicEye: true,
      hasVuMeter: false,
      hasDigitalDisplay: false,
      hasCoilGraphic: false,
    },
    audioProfile: {
      lowpassHz: 4800,
      highpassHz: 120,
      tubeDrive: 0.4,
      staticNoiseGain: 0.025,
      description: 'Equilíbrio acústico refinado, ideal para a suavidade do violão e voz da Bossa Nova.',
    },
  },
  {
    id: 'boombox_1970_1980',
    name: 'Boombox Estéreo & Tape Deck dos Festivais',
    shortName: 'Boombox 1980s',
    decade: '1970–1980s',
    yearRange: '1976–1988',
    historicalContext: 'A era das rádios FM comerciais, fitas cassete K7 gravadas em casa e as transmissões ao vivo dos grandes Festivais de MPB e Rock no Brasil.',
    curiosity: 'Contava com medidores de volume analógicos VU Meter com agulhas iluminadas, antena telescópica dupla e reforço de graves (botão Loudness).',
    musicalMovements: {
      title: 'Tropicália, MPB dos Festivais & Rock Nacional dos Anos 80',
      description: 'Guitarras elétricas na MPB, poesia contestadora de Chico Buarque, o Clube da Esquina mineiro, Samba de Raiz e o apogeu do Rock de Brasília e São Paulo.',
      keyGenres: ['Tropicália', 'MPB dos Festivais', 'Clube da Esquina', 'Samba de Raiz', 'Rock Nacional 80s', 'Música Nativista Gaúcha'],
      iconicArtists: ['Chico Buarque', 'Elis Regina', 'Milton Nascimento', 'Caetano Veloso', 'Gilberto Gil', 'Cartola', 'Legião Urbana', 'Titãs', 'Teixeirinha'],
    },
    cabinetStyle: {
      theme: 'metallic_boombox',
      cabinetBorderColor: 'border-slate-500/80',
      cabinetBgClass: 'bg-gradient-to-b from-[#1e242d] via-[#11161d] to-[#080b0f]',
      accentColor: 'text-cyan-400',
      dialColor: 'from-slate-800/80 to-slate-950/90',
      hasMagicEye: false,
      hasVuMeter: true,
      hasDigitalDisplay: false,
      hasCoilGraphic: false,
    },
    audioProfile: {
      lowpassHz: 7500,
      highpassHz: 70,
      tubeDrive: 0.2,
      staticNoiseGain: 0.015,
      description: 'Resposta de frequência ampla, graves encorpados e nitidez característica do FM.',
    },
  },
  {
    id: 'digital_1990_2000',
    name: 'Mini System Digital PLL & Hi-Fi',
    shortName: 'Digital PLL 1990s',
    decade: '1990–2000s',
    yearRange: '1992–2005',
    historicalContext: 'A transição para o CD digital, sintetizadores de frequência PLL precisos e displays fluorescentes que mostravam os canais gravados na memória.',
    curiosity: 'Dispensa a busca manual por botão giratório: a sintonia trava perfeitamente na frequência exata por circuito Phase-Locked Loop (PLL).',
    musicalMovements: {
      title: 'Axé da Bahia, Manguebeat, Sertanejo & Pagode 90s',
      description: 'Tambores e trios elétricos do Axé Music, a fusão de maracatu com guitarras do Manguebeat pernambucano e o apogeu do Sertanejo romântico.',
      keyGenres: ['Axé Music', 'Manguebeat', 'Sertanejo Romântico', 'Pagode dos Anos 90', 'Rap Nacional', 'Carimbó Elétrico'],
      iconicArtists: ['Chico Science & Nação Zumbi', 'Olodum / Daniela Mercury', 'Zezé Di Camargo & Luciano', 'Racionais MCs', 'Pato Fu', 'Tribo de Jah'],
    },
    cabinetStyle: {
      theme: 'digital_futuristic',
      cabinetBorderColor: 'border-emerald-500/70',
      cabinetBgClass: 'bg-gradient-to-b from-[#0b1b1f] via-[#060f12] to-[#020507]',
      accentColor: 'text-emerald-400',
      dialColor: 'from-emerald-950/80 to-slate-950/90',
      hasMagicEye: false,
      hasVuMeter: false,
      hasDigitalDisplay: true,
      hasCoilGraphic: false,
    },
    audioProfile: {
      lowpassHz: 12000,
      highpassHz: 40,
      tubeDrive: 0.05,
      staticNoiseGain: 0.005,
      description: 'Clareza cristalina digital estéreo, sem ruído residual de frequência analógica.',
    },
  },
];

export const STORAGE_KEY_DEFAULT_RADIO_ERA = 'simbolos_br_default_radio_era';

export const getSavedDefaultRadioEraId = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DEFAULT_RADIO_ERA);
    if (saved && VINTAGE_RADIO_ERAS.some((e) => e.id === saved)) {
      return saved;
    }
  } catch {}
  return 'catedral_1930_1940';
};

export const saveDefaultRadioEraId = (eraId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY_DEFAULT_RADIO_ERA, eraId);
  } catch (e) {
    console.error('Failed to save default radio era to localStorage:', e);
  }
};

export const getDefaultRadioEra = (): RadioEraDevice => {
  const savedId = getSavedDefaultRadioEraId();
  return VINTAGE_RADIO_ERAS.find((e) => e.id === savedId) || VINTAGE_RADIO_ERAS[0];
};

/**
 * Retorna os destaques culturais da era para cada estado específico
 */
export const getStateHighlightsForEra = (stateId: string, eraId: string) => {
  const era = VINTAGE_RADIO_ERAS.find((e) => e.id === eraId) || VINTAGE_RADIO_ERAS[0];

  const STATE_ERA_CUSTOM_MAP: Record<string, Record<string, { movement: string; artists: string; fact: string }>> = {
    RJ: {
      galena_1920: { movement: 'Choro no Catete & Rádio Sociedade', artists: 'Chiquinha Gonzaga, Pixinguinha, Sinhô', fact: 'Primeira transmissão oficial do Brasil no Morro do Corcovado em 1922.' },
      catedral_1930_1940: { movement: 'Era de Ouro na Rádio Nacional (PRE-8)', artists: 'Carmen Miranda, Orlando Silva, Francisco Alves', fact: 'A Rádio Nacional na Praça Mauá reunia multidões nos seus famosos auditórios.' },
      modernista_1950_1960: { movement: 'Bossa Nova em Copacabana & Ipanema', artists: 'Tom Jobim, João Gilberto, Vinicius de Moraes', fact: 'O violão sincopado de "Chega de Saudade" revolucionou o mundo musical em 1958.' },
      boombox_1970_1980: { movement: 'Samba de Raiz & Circo Voador (Rock 80s)', artists: 'Cartola, Beth Carvalho, Cazuza, Barão Vermelho', fact: 'O Circo Voador nos Arcos da Lapa revelou os grandes expoentes do rock nacional.' },
      digital_1990_2000: { movement: 'Funk Melody & MPB Contemporânea', artists: 'Claudinho & Buchecha, Marisa Monte, Lulu Santos', fact: 'Consolidação das grandes transmissões digitais FM e canais musicais.' },
    },
    BA: {
      galena_1920: { movement: 'Samba de Roda do Recôncavo', artists: 'Mestres Griôs, Chula Tradicional', fact: 'As raízes afro-brasileiras ancestrais alimentaram a pulsação do samba primitivo.' },
      catedral_1930_1940: { movement: 'Dorival Caymmi & Canções Praieiras', artists: 'Dorival Caymmi, Waldemar da Paixão', fact: 'Caymmi levou a poesia do mar da Bahia para os estúdios do Rio de Janeiro.' },
      modernista_1950_1960: { movement: 'Geração Tropicalista na UFBA', artists: 'Caetano Veloso, Gilberto Gil, Gal Costa, Tom Zé', fact: 'O movimento teatral e musical baiano gestou a revolução da Tropicália.' },
      boombox_1970_1980: { movement: 'Blocos Afro & Reafricanização', artists: 'Ilê Aiyê, Olodum, Novos Baianos, Moraes Moreira', fact: 'O surgimento do samba-reggae no Pelourinho transformou o Carnaval de Salvador.' },
      digital_1990_2000: { movement: 'Explosão do Axé Music & Trios Elétricos', artists: 'Daniela Mercury, Ivete Sangalo, Timbalada, Olodum', fact: 'O Axé dominou as paradas de sucesso em todo o país com o ritmo dos tambores.' },
    },
    MG: {
      galena_1920: { movement: 'Serestas Coloniais & Modinhas', artists: 'Seresteiros de Diamantina e Ouro Preto', fact: 'Tradição do violão e flauta nas sacadas dos casarões históricos mineiros.' },
      catedral_1930_1940: { movement: 'Rádio Inconfidência de Belo Horizonte', artists: 'Ary Barroso (natural de Ubá), Ataulfo Alves', fact: 'A Rádio Inconfidência (1936) conectou as serras mineiras com grande orquestra.' },
      modernista_1950_1960: { movement: 'Poesia & Samba-Canção das Alterosas', artists: 'Clara Nunes (início), Ary Barroso', fact: 'Clara Nunes iniciou sua carreira no concurso "A Voz de Ouro ABC" em BH.' },
      boombox_1970_1980: { movement: 'Clube da Esquina & Barroco Moderno', artists: 'Milton Nascimento, Lô Borges, Beto Guedes, Skank', fact: 'Na esquina das ruas Divinópolis e Paraisópolis em Santa Tereza nasceu o Clube da Esquina.' },
      digital_1990_2000: { movement: 'Pop-Rock Mineiro dos Festivais', artists: 'Skank, Jota Quest, Pato Fu, Sepultura', fact: 'Belo Horizonte tornou-se a capital da produção fonográfica moderna do pop-rock.' },
    },
    SP: {
      galena_1920: { movement: 'Semana de Arte Moderna de 1922 & Rádio Educadora', artists: 'Heitor Villa-Lobos, Guiomar Novaes', fact: 'A Rádio Educadora Paulista (PRA-E) foi uma das pioneiras do estado em 1923.' },
      catedral_1930_1940: { movement: 'Rádio Record & O Samba Paulistano', artists: 'Adoniran Barbosa, Paulo Vanzolini', fact: 'Adoniran começou trabalhando em radionovelas e programas humorísticos na Record.' },
      modernista_1950_1960: { movement: 'Samba do Bixiga & Marchinhas Paulistanas', artists: 'Adoniran Barbosa & Demônios da Garoa', fact: '"Trem das Onze" e "Saudosa Maloca" retratam os bairros operários da capital.' },
      boombox_1970_1980: { movement: 'Vanguarda Paulista & Rock Urbano', artists: 'Itamar Assumpção, Arrigo Barnabé, Titãs, Ultraje a Rigor', fact: 'O Teatro Lira Paulistana em Pinheiros foi o berço da Vanguarda Paulista e do rock.' },
      digital_1990_2000: { movement: 'Rap Nacional & Hip-Hop da Periferia', artists: 'Racionais MCs, Sabotage, Mamonas Assassinas', fact: 'O álbum "Sobrevivendo no Inferno" dos Racionais marcou a história fonográfica brasileira.' },
    },
    RS: {
      galena_1920: { movement: 'Rádio Sociedade Gaúcha & Chula Pampeana', artists: 'Gaiteiros Tradicionais, Trovadores', fact: 'A Rádio Sociedade Gaúcha foi inaugurada em 1927 em Porto Alegre.' },
      catedral_1930_1940: { movement: 'Rádio Farroupilha & O Cancioneiro Crioulo', artists: 'Teixeirinha (jovem), Conjuntos de Fandango', fact: 'A Rádio Farroupilha (PRH-2) contava com estúdio auditório para música regional.' },
      modernista_1950_1960: { movement: 'Auge de Teixeirinha & Gildo de Freitas', artists: 'Teixeirinha, Mary Terezinha, Gildo de Freitas', fact: '"Coração de Luto" bateu recordes de vendas com milhões de discos comercializados.' },
      boombox_1970_1980: { movement: 'Califórnia da Canção & Rock Gaúcho', artists: 'Kleiton & Kledir, Bebeto Alves, Engenheiros do Hawaii, Nenhum de Nós', fact: 'A Califórnia da Canção Nativa em Uruguaiana fundou o moderno cancioneiro nativista.' },
      digital_1990_2000: { movement: 'Nativismo Contemporâneo & Pop dos Pampas', artists: 'Cidadão Quem, Papas da Língua, Luiz Marenco', fact: 'Fusão de milongas com violões e guitarras modernas no circuito universitário.' },
    },
    PE: {
      galena_1920: { movement: 'Rádio Clube de Pernambuco (PRA-8)', artists: 'Mestres de Frevo, Nelson Ferreira', fact: 'A Rádio Clube de Pernambuco (1919) é considerada a emissora pioneira das Américas.' },
      catedral_1930_1940: { movement: 'Auge do Frevo de Rua & Capiba', artists: 'Capiba, Nelson Ferreira, Claudionor Germano', fact: 'Capiba e Nelson Ferreira compuseram os hinos definitivos do Carnaval de Recife.' },
      modernista_1950_1960: { movement: 'Forró & Xote nos Salões Nordestinos', artists: 'Luiz Gonzaga, Jackson do Pandeiro', fact: 'Jackson do Pandeiro uniu o coco pernambucano ao samba e ao baião.' },
      boombox_1970_1980: { movement: 'Movimento Armorial & Quinteto Violado', artists: 'Alceu Valença, Geraldo Azevedo, Lenine (início)', fact: 'Ariano Suassuna fundou o Movimento Armorial valorizando a rabeca e a viola nordestina.' },
      digital_1990_2000: { movement: 'Revolução do Manguebeat', artists: 'Chico Science & Nação Zumbi, Mundo Livre S/A', fact: 'O manifesto "Caranguejos com Cérebro" uniu tambores de maracatu com guitarras pesadas.' },
    },
  };

  const customState = STATE_ERA_CUSTOM_MAP[stateId]?.[eraId];
  if (customState) {
    return {
      movementName: customState.movement,
      keyArtists: customState.artists,
      historicalFact: customState.fact,
      eraName: era.name,
      decade: era.decade,
    };
  }

  return {
    movementName: era.musicalMovements.title,
    keyArtists: era.musicalMovements.iconicArtists.slice(0, 4).join(', '),
    historicalFact: era.historicalContext,
    eraName: era.name,
    decade: era.decade,
  };
};
