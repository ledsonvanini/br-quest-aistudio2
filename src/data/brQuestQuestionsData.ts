import { shuffleQuestionOptions } from './questionShuffle';

export type QuestThemePillar =
  | 'clima'
  | 'biodiversidade'
  | 'demografia'
  | 'geopolitica'
  | 'geografia'
  | 'cultura_musica';

export type QuestScope = 'nacional' | 'regional' | 'estadual';

export interface BrQuestQuestion {
  id: string;
  scope: QuestScope;
  regionId?: 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul';
  stateId?: string;
  pillar: QuestThemePillar;
  difficulty: 'iniciante' | 'aventureiro' | 'mestre';
  questionPt: string;
  questionEn: string;
  optionsPt: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationPt: string;
  explanationEn: string;
  sourceRef?: string;
}

export const BR_QUEST_QUESTIONS: BrQuestQuestion[] = [
  // =========================================================================
  // 1. BLOCO NACIONAL - CLIMA & METEOROLOGIA (Open-Meteo / ECMWF / CPTEC)
  // =========================================================================
  {
    id: 'nat_clima_01',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'aventureiro',
    questionPt: 'O que são os chamados "Rios Voadores" e qual é sua importância climática para o Brasil?',
    questionEn: 'What are the "Flying Rivers" and what is their climate importance for Brazil?',
    optionsPt: [
      'Fluxos aéreos de vapor d’água gerados pela transpiração da Amazônia que levam chuvas ao Centro-Oeste, Sudeste e Sul',
      'Correntes marítimas que transportam água quente do Atlântico Equatorial até a foz do Rio da Prata',
      'Canais artificiais fluviais escavados para navegação hidroviária interligando o Norte e o Sul',
      'Frentes polares de inverno que provocam geadas exclusivas nas serras gaúchas e catarinenses'
    ],
    optionsEn: [
      'Massive airborne water vapor streams from Amazon evapotranspiration that supply rainfall to Central-West, Southeast, and South',
      'Oceanic warm currents flowing from Equatorial Atlantic down to River Plate',
      'Man-made river canals connecting northern and southern basins',
      'Winter polar fronts creating frost exclusively in southern ranges'
    ],
    correctIndex: 0,
    explanationPt: 'A Floresta Amazônica funciona como uma gigantesca bomba de vapor (evapotranspiração), canalizando trilhões de litros de umidade ao longo dos Andes em direção ao Centro-Sul do país.',
    explanationEn: 'The Amazon Rainforest acts as a giant moisture pump, channeling trillions of liters of water vapor towards Central-South Brazil.',
    sourceRef: 'INPE / ECMWF Telemetry'
  },
  {
    id: 'nat_clima_02',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'iniciante',
    questionPt: 'A Zona de Convergência do Atlântico Sul (ZCAS) é responsável por qual fenômeno meteorológico frequente no verão brasileiro?',
    questionEn: 'The South Atlantic Convergence Zone (SACZ) is responsible for which frequent summer meteorological phenomenon?',
    optionsPt: [
      'Secas severas e ondas de calor persistentes no litoral do Rio Grande do Sul',
      'Uma faixa contínua de nebulosidade e chuvas volumosas que cruza do Norte/Centro-Oeste até o Sudeste',
      'Furacões de categoria 5 que se formam regularmente na costa nordestina',
      'Quedas bruscas de neve nas capitais do Centro-Oeste'
    ],
    optionsEn: [
      'Severe droughts and heatwaves in southern coasts',
      'A persistent band of clouds and heavy precipitation stretching from Amazon/Central-West across to the Southeast',
      'Category 5 hurricanes on northeastern shores',
      'Sudden snowfalls in Central-West capitals'
    ],
    correctIndex: 1,
    explanationPt: 'A ZCAS é o principal sistema meteorológico do verão no Brasil central e sudeste, caracterizada por uma extensa banda de nuvens que causa dias seguidos de precipitação volumosa.',
    explanationEn: 'The SACZ is the primary summer weather system across Central and Southeast Brazil, producing prolonged heavy rainfalls.',
    sourceRef: 'CPTEC / INMET'
  },
  {
    id: 'nat_clima_03',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'mestre',
    questionPt: 'Durante episódios intensos do fenômeno El Niño, qual padrão meteorológico típico ocorre no território brasileiro?',
    questionEn: 'During strong El Niño episodes, what typical weather pattern occurs across Brazilian territory?',
    optionsPt: [
      'Seca e redução de chuvas no Norte/Nordeste e aumento expressivo de tempestades e inundações no Sul',
      'Invernos com neve generalizada na Amazônia e secas severas no Rio Grande do Sul',
      'Aumento uniforme de chuvas em todos os 26 estados e no Distrito Federal',
      'Desaparecimento dos ventos alísios e congelamento das bacias do Pantanal'
    ],
    optionsEn: [
      'Drought and reduced rainfall in North/Northeast, with intense storms and flooding in the South',
      'Widespread snow in the Amazon and severe drought in the South',
      'Uniform rain increase across all 26 states and DF',
      'Total cessation of trade winds and freezing in the Pantanal'
    ],
    correctIndex: 0,
    explanationPt: 'O El Niño aquece as águas do Pacífico Equatorial, alterando a célula de circulação atmosférica (Walker), inibindo chuvas na Amazônia/Nordeste e concentrando frentes de tempestade no Sul.',
    explanationEn: 'El Niño warms equatorial Pacific waters, altering circulation cells to suppress rain in the North/Northeast while dumping excessive rain in the South.',
    sourceRef: 'NOAA / CPTEC'
  },

  // =========================================================================
  // 2. BLOCO NACIONAL - BIODIVERSIDADE & BIOMAS (GBIF / ICMBio / IBGE)
  // =========================================================================
  {
    id: 'nat_bio_01',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'iniciante',
    questionPt: 'Qual dos biomas brasileiros é reconhecido internacionalmente como o único bioma exclusivamente brasileiro (endêmico)?',
    questionEn: 'Which Brazilian biome is internationally recognized as strictly exclusive (endemic) to Brazil?',
    optionsPt: [
      'Caatinga',
      'Mata Atlântica',
      'Pantanal',
      'Pampa'
    ],
    optionsEn: [
      'Caatinga',
      'Atlantic Forest',
      'Pantanal',
      'Pampa'
    ],
    correctIndex: 0,
    explanationPt: 'A Caatinga ocupa cerca de 10% do território nacional e não existe em nenhum outro país do planeta, abrigando milhares de espécies adaptadas ao clima semiárido.',
    explanationEn: 'Caatinga covers approximately 10% of Brazil and exists in no other country on Earth, hosting unique semi-arid biodiversity.',
    sourceRef: 'ICMBio / Ministério do Meio Ambiente'
  },
  {
    id: 'nat_bio_02',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'aventureiro',
    questionPt: 'Por que o Cerrado é considerado a "Caixa d’Água do Brasil"?',
    questionEn: 'Why is the Cerrado biome referred to as "Brazil’s Water Tower"?',
    optionsPt: [
      'Porque abriga as maiores geleiras e reservatórios subterrâneos de gelo do continente',
      'Porque nele nascem nascentes que alimentam 8 das 12 grandes bacias hidrográficas do país, incluindo São Francisco, Tocantins e Paraná',
      'Porque é o bioma com a maior média pluviométrica diária do mundo durante todo o ano',
      'Porque nele ficam as usinas de dessalinização de água marinha do litoral'
    ],
    optionsEn: [
      'Because it hosts South America’s largest underground ice reservoirs',
      'Because its high plateaus cradle the headwaters of 8 out of 12 major Brazilian river basins, including São Francisco, Tocantins, and Paraná',
      'Because it records the world’s highest daily rainfall year-round',
      'Because it contains coastal desalination plants'
    ],
    correctIndex: 1,
    explanationPt: 'Com seu relevo de chapadões e solos profundos que funcionam como esponjas, o Cerrado recarrega os principais aquíferos (como o Aquífero Guarani) e alimenta as principais bacias fluviais.',
    explanationEn: 'The Cerrado plateau functions as a giant natural sponge, replenishing major aquifers and sustaining the headwaters of 8 national river basins.',
    sourceRef: 'WWF Brasil / ANA'
  },
  {
    id: 'nat_bio_03',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'mestre',
    questionPt: 'Qual destas espécies ameaçadas de extinção é considerada símbolo máximo da conservação da Mata Atlântica na Baixada Litorânea do Rio de Janeiro?',
    questionEn: 'Which endangered species is the flagship symbol of Atlantic Forest conservation in Rio de Janeiro coastal lowlands?',
    optionsPt: [
      'Mico-leão-dourado (Leontopithecus rosalia)',
      'Lobo-guará (Chrysocyon brachyurus)',
      'Peixe-boi-marinho (Trichechus manatus)',
      'Arara-azul-de-lear (Anodorhynchus leari)'
    ],
    optionsEn: [
      'Golden Lion Tamarin (Leontopithecus rosalia)',
      'Maned Wolf (Chrysocyon brachyurus)',
      'West Indian Manatee (Trichechus manatus)',
      'Lear’s Macaw (Anodorhynchus leari)'
    ],
    correctIndex: 0,
    explanationPt: 'O Mico-leão-dourado é endêmico das matas costeiras do Rio de Janeiro e foi salvo de extinção iminente através de programas integrados de reflorestamento e corredores ecológicos.',
    explanationEn: 'The Golden Lion Tamarin is endemic to Rio de Janeiro’s coastal Atlantic Forest and was rescued from extinction through habitat corridor restoration.',
    sourceRef: 'GBIF / Associação Mico-Leão-Dourado'
  },

  // =========================================================================
  // 3. BLOCO NACIONAL - DEMOGRAFIA & SOCIEDADE (Censo IBGE 2022)
  // =========================================================================
  {
    id: 'nat_demo_01',
    scope: 'nacional',
    pillar: 'demografia',
    difficulty: 'iniciante',
    questionPt: 'Segundo os dados consolidados do Censo Demográfico do IBGE 2022, qual é a população aproximada do Brasil?',
    questionEn: 'According to the 2022 IBGE Demographic Census, what is Brazil’s approximate population?',
    optionsPt: [
      '203 milhões de habitantes',
      '155 milhões de habitantes',
      '275 milhões de habitantes',
      '310 milhões de habitantes'
    ],
    optionsEn: [
      '203 million inhabitants',
      '155 million inhabitants',
      '275 million inhabitants',
      '310 million inhabitants'
    ],
    correctIndex: 0,
    explanationPt: 'O Censo 2022 contabilizou exatamente 203.080.756 habitantes no território brasileiro, confirmando o Brasil como o 7º país mais populoso do mundo.',
    explanationEn: 'The 2022 Census registered 203,080,756 inhabitants, ranking Brazil as the 7th most populous nation on Earth.',
    sourceRef: 'IBGE Censo 2022'
  },
  {
    id: 'nat_demo_02',
    scope: 'nacional',
    pillar: 'demografia',
    difficulty: 'aventureiro',
    questionPt: 'Qual estado brasileiro possui a maior taxa de alfabetização da população (superior a 97%) segundo o Censo 2022?',
    questionEn: 'Which Brazilian state has the highest literacy rate (above 97%) according to the 2022 Census?',
    optionsPt: [
      'Santa Catarina (SC)',
      'Amazonas (AM)',
      'Maranhão (MA)',
      'Tocantins (TO)'
    ],
    optionsEn: [
      'Santa Catarina (SC)',
      'Amazonas (AM)',
      'Maranhão (MA)',
      'Tocantins (TO)'
    ],
    correctIndex: 0,
    explanationPt: 'Santa Catarina atingiu 97,4% de taxa de alfabetização no Censo 2022, seguido de perto pelo Distrito Federal (97,2%) e Rio Grande do Sul (96,9%).',
    explanationEn: 'Santa Catarina reached a 97.4% literacy rate in the 2022 Census, followed closely by the Federal District (97.2%) and Rio Grande do Sul (96.9%).',
    sourceRef: 'IBGE Censo 2022 / Educação'
  },
  {
    id: 'nat_demo_03',
    scope: 'nacional',
    pillar: 'demografia',
    difficulty: 'mestre',
    questionPt: 'Qual é o grupo étnico autodeclarado mais numeroso do Brasil de acordo com o Censo 2022, representando cerca de 45,3% da população?',
    questionEn: 'Which self-declared ethnic group is the largest in Brazil according to the 2022 Census, representing about 45.3% of the population?',
    optionsPt: [
      'Pardos (Miscigenados)',
      'Brancos',
      'Pretos',
      'Indígenas'
    ],
    optionsEn: [
      'Pardos (Multiracial/Mixed)',
      'Whites',
      'Blacks',
      'Indigenous'
    ],
    correctIndex: 0,
    explanationPt: 'Pela primeira vez desde o início da série histórica moderna do IBGE em 1991, os pardos tornaram-se o maior contingente populacional do Brasil (45,3%), superando os brancos (43,5%).',
    explanationEn: 'In 2022, Pardos (multiracial individuals) officially became the largest demographic group in Brazil (45.3%), surpassing self-declared whites (43.5%).',
    sourceRef: 'IBGE Censo 2022 / Cor ou Raça'
  },

  // =========================================================================
  // 4. BLOCO NACIONAL - GEOPOLÍTICA & FRONTEIRAS
  // =========================================================================
  {
    id: 'nat_geo_01',
    scope: 'nacional',
    pillar: 'geopolitica',
    difficulty: 'iniciante',
    questionPt: 'Com quantos países da América do Sul o Brasil faz fronteira territorial direta?',
    questionEn: 'How many South American nations share direct land borders with Brazil?',
    optionsPt: [
      '10 países (todos os países sul-americanos, exceto Chile e Equador)',
      '5 países apenas',
      '12 países (todos sem exceção)',
      '7 países do Mercosul'
    ],
    optionsEn: [
      '10 nations (all South American countries except Chile and Ecuador)',
      'Only 5 nations',
      '12 nations without exception',
      '7 Mercosur countries'
    ],
    correctIndex: 0,
    explanationPt: 'O Brasil faz fronteira com Argentina, Uruguai, Paraguai, Bolívia, Peru, Colômbia, Venezuela, Guiana, Suriname e a Guiana Francesa (França). Somente Chile e Equador não tocam o território brasileiro.',
    explanationEn: 'Brazil borders 10 countries/territories. Only Chile and Ecuador do not share land boundaries with Brazil.',
    sourceRef: 'Itamaraty / IBGE Geociências'
  },
  {
    id: 'nat_geo_02',
    scope: 'nacional',
    pillar: 'geografia',
    difficulty: 'aventureiro',
    questionPt: 'Onde se localiza o ponto culminante do relevo brasileiro (o Pico da Neblina, com 2.995 metros)?',
    questionEn: 'Where is Brazil’s highest peak located (Pico da Neblina, 2,995 meters)?',
    optionsPt: [
      'No Estado do Amazonas (Serra do Imeri, fronteira com a Venezuela)',
      'Na Serra da Mantiqueira, entre São Paulo e Minas Gerais',
      'Na Chapada dos Veadeiros, em Goiás',
      'Na Serra Geral, entre o Rio Grande do Sul e Santa Catarina'
    ],
    optionsEn: [
      'In Amazonas State (Serra do Imeri, on the border with Venezuela)',
      'In Serra da Mantiqueira, between SP and MG',
      'In Chapada dos Veadeiros, Goiás',
      'In Serra Geral, between RS and SC'
    ],
    correctIndex: 0,
    explanationPt: 'O Pico da Neblina (2.995 m) e o Pico 31 de Março (2.974 m) ficam no Parque Nacional do Pico da Neblina, município de Santa Isabel do Rio Negro (AM).',
    explanationEn: 'Pico da Neblina (2,995 m) is located in the northern Amazonas state, within Yanomami ancestral lands along the Venezuelan border.',
    sourceRef: 'IBGE Altimetria'
  },

  // =========================================================================
  // 5. BLOCO NACIONAL - CULTURA, RÁDIO & MÚSICA BRASILEIRA
  // =========================================================================
  {
    id: 'nat_mus_01',
    scope: 'nacional',
    pillar: 'cultura_musica',
    difficulty: 'iniciante',
    questionPt: 'Qual emissora histórica do Rio de Janeiro inaugurou a Era de Ouro do Rádio no Brasil a partir dos anos 1930 e 1940?',
    questionEn: 'Which historic radio station in Rio de Janeiro pioneered the Golden Era of Brazilian Radio from the 1930s and 1940s?',
    optionsPt: [
      'Rádio Nacional do Rio de Janeiro (PRE-8)',
      'Rádio Record de São Paulo',
      'Rádio Gaúcha de Porto Alegre',
      'Rádio Clube de Pernambuco'
    ],
    optionsEn: [
      'Rádio Nacional do Rio de Janeiro (PRE-8)',
      'Rádio Record of São Paulo',
      'Rádio Gaúcha of Porto Alegre',
      'Rádio Clube of Pernambuco'
    ],
    correctIndex: 0,
    explanationPt: 'Inaugurada em 1936, a Rádio Nacional tornou-se o grande polo unificador da música brasileira, irradiando radionovelas, programas de auditório e revelando mestres como Ary Barroso, Emilinha Borba e Luiz Gonzaga.',
    explanationEn: 'Broadcasting since 1936, Rádio Nacional connected the entire country with live auditorium shows, radio dramas, and iconic MPB legends.',
    sourceRef: 'Acervo EBC / Rádio Nacional'
  },
  {
    id: 'nat_mus_02',
    scope: 'nacional',
    pillar: 'cultura_musica',
    difficulty: 'aventureiro',
    questionPt: 'Qual gênero musical genuinamente pernambucano, famoso pelo ritmo acelerado e pelos passos acrobáticos com sombrinhas coloridas, foi declarado Patrimônio Imaterial da Humanidade pela UNESCO?',
    questionEn: 'Which Pernambuco musical genre, famed for its fast tempo and umbrella acrobatic dances, was designated UNESCO Intangible Cultural Heritage?',
    optionsPt: [
      'Frevo',
      'Sertanejo Universitário',
      'Axé Music',
      'Samba-Enredo'
    ],
    optionsEn: [
      'Frevo',
      'Sertanejo Universitário',
      'Axé Music',
      'Samba-Enredo'
    ],
    correctIndex: 0,
    explanationPt: 'O Frevo nasceu no Recife no final do século XIX da fusão de marcha, maxixe e movimentos de capoeira, sendo consagrado pela UNESCO em 2012.',
    explanationEn: 'Born in late 19th century Recife from marching bands, maxixe, and capoeira steps, Frevo was honored by UNESCO in 2012.',
    sourceRef: 'UNESCO / IPHAN'
  },

  // =========================================================================
  // 6. BLOCOS REGIONAIS
  // =========================================================================
  // NORTE
  {
    id: 'reg_norte_01',
    scope: 'regional',
    regionId: 'norte',
    pillar: 'biodiversidade',
    difficulty: 'aventureiro',
    questionPt: 'O Rio Amazonas e seus afluentes abrigam qual destes gigantes de água doce, considerado um dos maiores peixes escamosos do mundo?',
    questionEn: 'The Amazon River and its tributaries host which freshwater giant, considered one of the largest scaled fishes in the world?',
    optionsPt: [
      'Pirarucu (Arapaima gigas)',
      'Tubarão-baleia',
      'Salmão-do-atlântico',
      'Dourado-do-mar'
    ],
    optionsEn: [
      'Pirarucu (Arapaima gigas)',
      'Whale shark',
      'Atlantic salmon',
      'Mahi-mahi'
    ],
    correctIndex: 0,
    explanationPt: 'O Pirarucu pode atingir mais de 2,5 metros de comprimento e pesar até 200 kg, possuindo respiração aérea obrigatória graças à sua bexiga natatória modificada.',
    explanationEn: 'The Pirarucu can exceed 2.5 meters in length and 200 kg, breathing atmospheric air via its vascularized swim bladder.',
    sourceRef: 'INPA / GBIF'
  },
  {
    id: 'reg_norte_02',
    scope: 'regional',
    regionId: 'norte',
    pillar: 'cultura_musica',
    difficulty: 'iniciante',
    questionPt: 'No Pará, qual ritmo tradicional amazônico tem como símbolo instrumentos de percussão rústicos chamados "curimbós" e foi consagrado por Mestre Verequete?',
    questionEn: 'In Pará, which traditional Amazonian rhythm uses wooden drums called "curimbós" and was popularized by Mestre Verequete?',
    optionsPt: [
      'Carimbó',
      'Vaneira',
      'Chamarrita',
      'Moda de Viola'
    ],
    optionsEn: [
      'Carimbó',
      'Vaneira',
      'Chamarrita',
      'Moda de Viola'
    ],
    correctIndex: 0,
    explanationPt: 'O Carimbó é Patrimônio Cultural Imaterial do Brasil (IPHAN), unindo tradições indígenas amazônicas, afro-brasileiras e ibéricas.',
    explanationEn: 'Carimbó is recognized by IPHAN as national heritage, combining Amazon indigenous, Afro-Brazilian, and Portuguese rhythms.',
    sourceRef: 'IPHAN'
  },

  // NORDESTE
  {
    id: 'reg_nordeste_01',
    scope: 'regional',
    regionId: 'nordeste',
    pillar: 'geografia',
    difficulty: 'aventureiro',
    questionPt: 'Quantos estados compõem a Região Nordeste, tornando-a a região com o maior número de unidades federativas do Brasil?',
    questionEn: 'How many states make up the Northeast Region, making it the region with the largest number of federal units?',
    optionsPt: [
      '9 estados (MA, PI, CE, RN, PB, PE, AL, SE, BA)',
      '7 estados',
      '11 estados',
      '5 estados'
    ],
    optionsEn: [
      '9 states (MA, PI, CE, RN, PB, PE, AL, SE, BA)',
      '7 states',
      '11 states',
      '5 states'
    ],
    correctIndex: 0,
    explanationPt: 'O Nordeste conta com 9 estados e uma das faixas litorâneas mais extensas e ricas do país, banhado pelo Oceano Atlântico desde o Maranhão até a Bahia.',
    explanationEn: 'The Northeast features 9 states and one of South America’s longest and most diverse coastlines.',
    sourceRef: 'IBGE'
  },
  {
    id: 'reg_nordeste_02',
    scope: 'regional',
    regionId: 'nordeste',
    pillar: 'cultura_musica',
    difficulty: 'iniciante',
    questionPt: 'Luiz Gonzaga, o "Rei do Baião", imortalizou a cultura sertaneja nordestina no rádio nacional através de canções emblemáticas como:',
    questionEn: 'Luiz Gonzaga, the "King of Baião", immortalized sertanejo culture on national radio with iconic songs like:',
    optionsPt: [
      'Asa Branca e O Xote das Meninas',
      'Garota de Ipanema e Águas de Março',
      'Canto Alegretense e Querência Amada',
      'Aquarela do Brasil e Carinhoso'
    ],
    optionsEn: [
      'Asa Branca and O Xote das Meninas',
      'Garota de Ipanema and Águas de Março',
      'Canto Alegretense and Querência Amada',
      'Aquarela do Brasil and Carinhoso'
    ],
    correctIndex: 0,
    explanationPt: 'Com sua sanfona, zabumba e triângulo, Luiz Gonzaga e Humberto Teixeira levaram a dor e a beleza do sertão e da Caatinga para todo o Brasil.',
    explanationEn: 'Gonzaga’s accordion, zabumba, and triangle projected northeastern resilience and heritage across Latin America.',
    sourceRef: 'Memória Musical / Rádio Nacional'
  },

  // CENTRO-OESTE
  {
    id: 'reg_centrooeste_01',
    scope: 'regional',
    regionId: 'centro_oeste',
    pillar: 'biodiversidade',
    difficulty: 'iniciante',
    questionPt: 'Qual é a maior planície alagável contínua do planeta, localizada nos estados de Mato Grosso e Mato Grosso do Sul?',
    questionEn: 'What is the world’s largest continuous tropical wetland, situated in Mato Grosso and Mato Grosso do Sul?',
    optionsPt: [
      'Pantanal',
      'Everglades',
      'Delta do Okavango',
      'Manguezais de Sundarbans'
    ],
    optionsEn: [
      'Pantanal',
      'Everglades',
      'Okavango Delta',
      'Sundarbans Mangroves'
    ],
    correctIndex: 0,
    explanationPt: 'O Pantanal é uma Reserva da Biosfera e Patrimônio Natural da Humanidade pela UNESCO, abrigando a maior densidade de onças-pintadas e jacarés das Américas.',
    explanationEn: 'The Pantanal is a UNESCO World Heritage site and hosts the highest jaguar and caiman densities in the Americas.',
    sourceRef: 'UNESCO / ICMBio'
  },
  {
    id: 'reg_centrooeste_02',
    scope: 'regional',
    regionId: 'centro_oeste',
    pillar: 'geopolitica',
    difficulty: 'aventureiro',
    questionPt: 'Em que ano foi inaugurada a capital federal Brasília, projetada no Planalto Central por Lúcio Costa e Oscar Niemeyer?',
    questionEn: 'In what year was the federal capital Brasília inaugurated in the Central Plateau, designed by Lúcio Costa and Oscar Niemeyer?',
    optionsPt: [
      '1960 (21 de abril)',
      '1950 (15 de novembro)',
      '1972 (7 de setembro)',
      '1945 (1 de janeiro)'
    ],
    optionsEn: [
      '1960 (April 21)',
      '1950 (November 15)',
      '1972 (September 7)',
      '1945 (January 1)'
    ],
    correctIndex: 0,
    explanationPt: 'Sob o governo de Juscelino Kubitschek, Brasília foi erguida em tempo recorde no coração do Cerrado para integrar o interior ao litoral brasileiro.',
    explanationEn: 'Inaugurated on April 21, 1960, Brasília shifted the national capital to the heart of the country to spur interior development.',
    sourceRef: 'Arquivo Público do DF'
  },

  // SUDESTE
  {
    id: 'reg_sudeste_01',
    scope: 'regional',
    regionId: 'sudeste',
    pillar: 'demografia',
    difficulty: 'iniciante',
    questionPt: 'Qual estado da Região Sudeste é o mais populoso do Brasil, concentrando mais de 44 milhões de habitantes?',
    questionEn: 'Which state in the Southeast is Brazil’s most populous, with over 44 million inhabitants?',
    optionsPt: [
      'São Paulo (SP)',
      'Minas Gerais (MG)',
      'Rio de Janeiro (RJ)',
      'Espírito Santo (ES)'
    ],
    optionsEn: [
      'São Paulo (SP)',
      'Minas Gerais (MG)',
      'Rio de Janeiro (RJ)',
      'Espírito Santo (ES)'
    ],
    correctIndex: 0,
    explanationPt: 'São Paulo responde por mais de 21% da população total do Brasil e é o principal motor econômico, industrial e financeiro da América Latina.',
    explanationEn: 'São Paulo represents over 21% of Brazil’s population and is the primary economic engine of Latin America.',
    sourceRef: 'IBGE Censo 2022'
  },
  {
    id: 'reg_sudeste_02',
    scope: 'regional',
    regionId: 'sudeste',
    pillar: 'cultura_musica',
    difficulty: 'aventureiro',
    questionPt: 'No final dos anos 1950, qual movimento musical revolucionário nasceu na Zona Sul do Rio de Janeiro com João Gilberto e Tom Jobim?',
    questionEn: 'In the late 1950s, which revolutionary musical movement originated in Rio de Janeiro with João Gilberto and Tom Jobim?',
    optionsPt: [
      'Bossa Nova',
      'Tropicália',
      'Manguebeat',
      'Sertanejo Raiz'
    ],
    optionsEn: [
      'Bossa Nova',
      'Tropicália',
      'Manguebeat',
      'Sertanejo Raiz'
    ],
    correctIndex: 0,
    explanationPt: 'A Bossa Nova uniu a síncope do samba à harmonia refinada do jazz, ganhando o mundo com obras eternas como "Chega de Saudade" e "Garota de Ipanema".',
    explanationEn: 'Bossa Nova merged samba syncopation with jazz harmonies, achieving global acclaim with classics like "Garota de Ipanema".',
    sourceRef: 'História da Música Brasileira'
  },

  // SUL
  {
    id: 'reg_sul_01',
    scope: 'regional',
    regionId: 'sul',
    pillar: 'clima',
    difficulty: 'aventureiro',
    questionPt: 'Qual tipo de clima predomina na Região Sul do Brasil, caracterizado por quatro estações bem definidas e ocorrência de geadas no inverno?',
    questionEn: 'Which climate type predominates in the South Region of Brazil, characterized by four well-defined seasons and winter frosts?',
    optionsPt: [
      'Subtropical úmido (Cfa / Cfb)',
      'Equatorial superúmido',
      'Semiárido quente',
      'Tropical de altitude com estiagem extrema'
    ],
    optionsEn: [
      'Humid subtropical (Cfa / Cfb)',
      'Super-humid equatorial',
      'Hot semi-arid',
      'Highland tropical with extreme drought'
    ],
    correctIndex: 0,
    explanationPt: 'Por estar abaixo do Trópico de Capricórnio, a Região Sul possui clima subtropical com precipitações bem distribuídas ao longo de todo o ano e massas de ar polar frequentes.',
    explanationEn: 'Located below the Tropic of Capricorn, Southern Brazil features a humid subtropical climate with well-distributed annual rainfall and polar front incursions.',
    sourceRef: 'INMET / CPTEC'
  },
  {
    id: 'reg_sul_02',
    scope: 'regional',
    regionId: 'sul',
    pillar: 'biodiversidade',
    difficulty: 'iniciante',
    questionPt: 'O Pinheiro-do-Paraná (Araucaria angustifolia) é a árvore símbolo de qual floresta característica dos planaltos da Região Sul?',
    questionEn: 'The Paraná Pine (Araucaria angustifolia) is the hallmark tree of which plateau forest in Southern Brazil?',
    optionsPt: [
      'Mata das Araucárias (Floresta Ombrófila Mista)',
      'Floresta de Terra Firme Amazônica',
      'Mata de Cocais',
      'Manguezal Costeiro'
    ],
    optionsEn: [
      'Araucaria Moist Forest (Mixed Ombrophilous Forest)',
      'Amazon Terra Firme Rainforest',
      'Babassu Palm Forest',
      'Coastal Mangrove'
    ],
    correctIndex: 0,
    explanationPt: 'A Floresta com Araucária cobria vastas áreas do Paraná, Santa Catarina e Rio Grande do Sul, produzindo o pinhão, alimento vital da fauna nativa como a gralha-azul.',
    explanationEn: 'The Araucaria Forest dominated the southern highlands, producing pine nuts (pinhão) that sustain wildlife such as the Azure Jay.',
    sourceRef: 'ICMBio'
  },
  // NOVAS QUESTÕES EXPANDIDAS - CLIMA
  {
    id: 'clima_03',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'aventureiro',
    questionPt: 'Qual fenômeno meteorológico de inverno na Região Sul e Sudeste ocorre quando o ar frio e denso fica retido próximo ao solo, dificultando a dispersão de poluentes em grandes metrópoles?',
    questionEn: 'Which winter meteorological phenomenon traps cool dense air near the ground in major cities, impeding pollutant dispersion?',
    optionsPt: ['Inversão Térmica', 'Rios Voadores', 'El Niño Oscilação Sul', 'Ciclone Extratropical'],
    optionsEn: ['Thermal Inversion', 'Flying Rivers', 'El Niño Southern Oscillation', 'Extratropical Cyclone'],
    correctIndex: 0,
    explanationPt: 'A inversão térmica ocorre em noites frias de inverno quando uma camada de ar quente se sobrepõe ao ar frio da superfície, bloqueando as correntes de convecção.',
    explanationEn: 'Thermal inversion traps cold air beneath a warm layer, concentrating smog near urban surfaces.',
    sourceRef: 'INMET / CPTEC'
  },
  {
    id: 'clima_04',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'aventureiro',
    questionPt: 'Como se denomina a incursão de massas de ar polar atlânticas que avançam pelas planícies do interior e derrubam bruscamente as temperaturas na Amazônia ocidental (Acre e Rondônia)?',
    questionEn: 'What is the term for polar air masses that penetrate deep into the western Amazon, causing sharp temperature drops in Acre and Rondônia?',
    optionsPt: ['Friagem', 'Geada Negra', 'Vento Minuano', 'Tromba d’Água'],
    optionsEn: ['Friagem', 'Black Frost', 'Minuano Wind', 'Waterspout'],
    correctIndex: 0,
    explanationPt: 'A Friagem é a queda acentuada de temperatura nos estados do sudoeste amazônico provocada pelo avanço desimpedido da Massa Polar Atlântica pela Bacia do Prata.',
    explanationEn: 'Friagem refers to abrupt cold snaps in the Amazon caused by polar air pushing north along the Andes.',
    sourceRef: 'INMET'
  },
  {
    id: 'clima_05',
    scope: 'nacional',
    pillar: 'clima',
    difficulty: 'mestre',
    questionPt: 'Durante eventos severos de "El Niño" (aquecimento anômalo das águas do Oceano Pacífico Equatorial), qual é o impacto pluviométrico típico no Brasil?',
    questionEn: 'During intense El Niño events, what is the typical precipitation impact across Brazil?',
    optionsPt: [
      'Secas severas no Norte/Nordeste e chuvas volumosas acima da média no Sul',
      'Neve generalizada no Nordeste e seca extrema no Sul',
      'Chuvas torrenciais diárias na Caatinga e seca no Rio Grande do Sul',
      'Neutralidade completa sem alteração pluviométrica'
    ],
    optionsEn: [
      'Severe drought in North/Northeast and above-average torrential rains in the South',
      'Widespread snow in Northeast and extreme drought in South',
      'Daily rain in Caatinga and drought in South',
      'Complete neutrality with no precipitation anomaly'
    ],
    correctIndex: 0,
    explanationPt: 'O El Niño intensifica frentes frias estacionárias no Sul (provocando enchentes) e enfraquece a convecção tropical no Norte e Nordeste (causando estiagens severas).',
    explanationEn: 'El Niño causes severe rainfall deficits in North/Northeast and triggers extreme precipitation in southern Brazil.',
    sourceRef: 'CPTEC / INPE'
  },
  // NOVAS QUESTÕES EXPANDIDAS - BIODIVERSIDADE
  {
    id: 'bio_03',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'iniciante',
    questionPt: 'Qual o maior felino das Américas e terceiro maior do mundo, predador de topo com mordida capaz de perfurar carapaças de tartarugas e jacarés no Pantanal e na Amazônia?',
    questionEn: 'Which is the largest feline in the Americas and third largest globally, a top predator able to crush turtle shells in the Pantanal and Amazon?',
    optionsPt: ['Onça-pintada (Panthera onca)', 'Jaguatirica', 'Lobo-guará', 'Suçuarana'],
    optionsEn: ['Jaguar (Panthera onca)', 'Ocelot', 'Maned Wolf', 'Cougar'],
    correctIndex: 0,
    explanationPt: 'A onça-pintada é o maior predador terrestre do Brasil, essencial para o equilíbrio ecológico das populações de herbívoros nos biomas neotropicais.',
    explanationEn: 'The jaguar is the apex predator of South American forests and wetlands, pivotal for trophic balance.',
    sourceRef: 'ICMBio'
  },
  {
    id: 'bio_04',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'aventureiro',
    questionPt: 'Qual primata endêmico da Mata Atlântica fluminense, com pelos dourados e juba marcante, tornou-se símbolo nacional de esforços bem-sucedidos de conservação contra a extinção?',
    questionEn: 'Which golden-furred primate endemic to Rio de Janeiro’s Atlantic Forest became a national icon of successful conservation?',
    optionsPt: ['Mico-leão-dourado (Leontopithecus rosalia)', 'Macaco-prego', 'Bugio-ruivo', 'Muriqui-do-sul'],
    optionsEn: ['Golden Lion Tamarin', 'Capuchin Monkey', 'Brown Howler', 'Southern Muriqui'],
    correctIndex: 0,
    explanationPt: 'O mico-leão-dourado esteve à beira da extinção na década de 1970 e hoje conta com populações recuperadas em reservas biológicas como Poço das Antas (RJ).',
    explanationEn: 'The Golden Lion Tamarin bounced back from critical endangerment thanks to decades of habitat corridor restoration.',
    sourceRef: 'Associação Mico-Leão-Dourado / ICMBio'
  },
  {
    id: 'bio_05',
    scope: 'nacional',
    pillar: 'biodiversidade',
    difficulty: 'aventureiro',
    questionPt: 'O Tuiuiú (Jabiru mycteria), com mais de 1,40 m de altura, bico comprido e pescoço preto com faixa vermelha, é a ave símbolo de qual ecossistema brasileiro?',
    questionEn: 'The Jabiru stork (Tuiuiú), standing over 1.40 m tall with a black neck and red collar, is the symbolic bird of which Brazilian wetland?',
    optionsPt: ['Pantanal', 'Manguezais de Santos', 'Restingas de Maricá', 'Campos de Cima da Serra'],
    optionsEn: ['Pantanal', 'Santos Mangroves', 'Maricá Sandbanks', 'Highland Grasslands'],
    correctIndex: 0,
    explanationPt: 'O Tuiuiú constrói ninhos gigantescos no topo de árvores pantaneiras (como piúvas) e alimenta-se de peixes nas lagoas sazonais da planície pantaneira.',
    explanationEn: 'The Jabiru is the emblem of the Pantanal wetlands, building massive nests atop tall trees.',
    sourceRef: 'Embrapa Pantanal'
  },
  // NOVAS QUESTÕES EXPANDIDAS - DEMOGRAFIA & IBGE
  {
    id: 'demo_03',
    scope: 'nacional',
    pillar: 'demografia',
    difficulty: 'aventureiro',
    questionPt: 'De acordo com o Censo Demográfico do IBGE 2022, qual foi a população total recenseada do Brasil e qual tendência demográfica foi evidenciada?',
    questionEn: 'According to the 2022 IBGE Census, what was Brazil’s total recorded population and dominant demographic shift?',
    optionsPt: [
      'Aproximadamente 203 milhões de habitantes, com desaceleração do crescimento e envelhecimento populacional',
      'Exatos 350 milhões de habitantes, com explosão de nascimentos rurais',
      '120 milhões de habitantes, com redução pela metade da população urbana',
      '500 milhões de habitantes, tornando o Brasil o país mais populoso da Terra'
    ],
    optionsEn: [
      'Approx. 203 million residents, featuring growth deceleration and rapid population aging',
      '350 million residents with a rural birth boom',
      '120 million residents with urban halving',
      '500 million residents, making Brazil the most populous nation'
    ],
    correctIndex: 0,
    explanationPt: 'O Censo 2022 registrou 203.062.512 habitantes, com a menor taxa de crescimento anual da história (0,52% ao ano) e aceleração do envelhecimento demográfico.',
    explanationEn: 'The 2022 Census counted 203 million Brazilians, confirming fertility decline and an aging demographic pyramid.',
    sourceRef: 'Censo Demográfico IBGE 2022'
  },
  {
    id: 'demo_04',
    scope: 'nacional',
    pillar: 'demografia',
    difficulty: 'mestre',
    questionPt: 'No Censo 2022, pela primeira vez o IBGE divulgou dados detalhados da população quilombola em todo o país. Qual estado brasileiro concentra o maior número absoluto de quilombolas?',
    questionEn: 'In the 2022 Census, IBGE published comprehensive data on Quilombola populations. Which Brazilian state has the largest absolute Quilombola population?',
    optionsPt: ['Bahia', 'Rio Grande do Sul', 'Acre', 'Santa Catarina'],
    optionsEn: ['Bahia', 'Rio Grande do Sul', 'Acre', 'Santa Catarina'],
    correctIndex: 0,
    explanationPt: 'A Bahia lidera o país com quase 400 mil quilombolas (quase 30% do total nacional de 1,32 milhão de quilombolas recenseados pelo IBGE).',
    explanationEn: 'Bahia is home to the largest Quilombola community in Brazil, representing nearly 30% of the nationwide total.',
    sourceRef: 'IBGE / Censo Quilombola 2022'
  },
  // NOVAS QUESTÕES EXPANDIDAS - GEOPOLÍTICA & FRONTEIRAS
  {
    id: 'geo_pol_02',
    scope: 'nacional',
    pillar: 'geopolitica',
    difficulty: 'aventureiro',
    questionPt: 'O Brasil possui mais de 16.800 km de fronteiras terrestres e faz limite com 10 dos 12 países da América do Sul. Quais são os únicos dois países sul-americanos que NÃO fazem fronteira com o Brasil?',
    questionEn: 'Brazil borders 10 of the 12 South American nations along 16,800 km of frontiers. Which two South American countries DO NOT share borders with Brazil?',
    optionsPt: ['Chile e Equador', 'Argentina e Uruguai', 'Colômbia e Venezuela', 'Peru e Bolívia'],
    optionsEn: ['Chile and Ecuador', 'Argentina and Uruguay', 'Colombia and Venezuela', 'Peru and Bolivia'],
    correctIndex: 0,
    explanationPt: 'O Chile e o Equador são as únicas nações da América do Sul continental que não possuem limites territoriais diretos com o Brasil.',
    explanationEn: 'Only Chile and Ecuador do not share land boundaries with Brazil in South America.',
    sourceRef: 'Ministério das Relações Exteriores / IBGE'
  },
  {
    id: 'geo_pol_03',
    scope: 'nacional',
    pillar: 'geopolitica',
    difficulty: 'mestre',
    questionPt: 'O conceito estratégico de "Amazônia Azul", cunhado pela Marinha do Brasil, refere-se a:',
    questionEn: 'The strategic concept of "Blue Amazon" (Amazônia Azul), coined by the Brazilian Navy, designates:',
    optionsPt: [
      'A imensa Zona Econômica Exclusiva marítima de 4,5 milhões de km² rica em petróleo, biodiversidade e rotas comerciais',
      'Uma rede de rios subterrâneos de água doce no Aquífero Guarani',
      'Uma nova unidade de conservação no Rio Negro',
      'Um tratado militar espacial entre países da OTAN'
    ],
    optionsEn: [
      'The 4.5 million km² maritime Exclusive Economic Zone abundant in petroleum, biodiversity, and trade routes',
      'Underground freshwater rivers in Guarani Aquifer',
      'A new national park on the Rio Negro',
      'A space treaty among NATO allies'
    ],
    correctIndex: 0,
    explanationPt: 'A Amazônia Azul engloba a plataforma continental e águas jurisdicionais brasileiras, de onde provêm 95% do petróleo e 95% do comércio exterior marítimo do Brasil.',
    explanationEn: 'The Blue Amazon is Brazil’s vast maritime territory, critical for energy security and international shipping lanes.',
    sourceRef: 'Marinha do Brasil / SECIRM'
  },
  // NOVAS QUESTÕES EXPANDIDAS - CULTURA & MÚSICA
  {
    id: 'cult_03',
    scope: 'nacional',
    pillar: 'cultura_musica',
    difficulty: 'iniciante',
    questionPt: 'Em 1958, o lançamento da canção "Chega de Saudade", composta por Tom Jobim e Vinicius de Moraes e gravada por João Gilberto com sua batida sincopada no violão, inaugurou qual movimento da música brasileira?',
    questionEn: 'In 1958, the song "Chega de Saudade" with João Gilberto’s syncopated guitar rhythm launched which world-renowned Brazilian music movement?',
    optionsPt: ['Bossa Nova', 'Tropicália', 'Manguebeat', 'Samba-Enredo'],
    optionsEn: ['Bossa Nova', 'Tropicália', 'Manguebeat', 'Samba-Enredo'],
    correctIndex: 0,
    explanationPt: 'A Bossa Nova combinou a sofisticação harmônica com a poesia urbana e a batida única de violão, tornando canções como "Garota de Ipanema" conhecidas mundialmente.',
    explanationEn: 'Bossa Nova merged jazz harmonies with samba syncopation, revolutionizing global music aesthetics.',
    sourceRef: 'Acervo Instituto Tom Jobim'
  },
  {
    id: 'cult_04',
    scope: 'nacional',
    pillar: 'cultura_musica',
    difficulty: 'aventureiro',
    questionPt: 'Qual gênio do bandolim e flauta é considerado o pai do Choro moderno brasileiro, autor de clássicos instrumentais imortais como "Carinhoso" e "Lamentos"?',
    questionEn: 'Which genius of the flute and sax is considered the father of modern Brazilian Choro, composer of "Carinhoso" and "Lamentos"?',
    optionsPt: ['Pixinguinha (Alfredo da Rocha Vianna Filho)', 'Chiquinha Gonzaga', 'Cartola', 'Noel Rosa'],
    optionsEn: ['Pixinguinha', 'Chiquinha Gonzaga', 'Cartola', 'Noel Rosa'],
    correctIndex: 0,
    explanationPt: 'Pixinguinha estruturou as linhas de contraponto do Choro brasileiro e regeu o conjunto Os Oito Batutas, sendo homenageado no Dia Nacional do Choro (23 de abril).',
    explanationEn: 'Pixinguinha defined modern Choro arrangements, blending European ballroom melodies with Afro-Brazilian counterpoints.',
    sourceRef: 'Fundação Nacional de Artes (Funarte)'
  },
  {
    id: 'cult_05',
    scope: 'nacional',
    pillar: 'cultura_musica',
    difficulty: 'aventureiro',
    questionPt: 'Na década de 1930 a 1950, qual emissora estatal no Rio de Janeiro foi o epicentro irradiador da música e dos ídolos populares em todo o território nacional durante a "Era de Ouro"?',
    questionEn: 'From the 1930s to the 1950s, which state broadcaster in Rio was the cultural powerhouse of Brazil’s "Golden Age of Radio"?',
    optionsPt: ['Rádio Nacional do Rio de Janeiro', 'Rádio Guaíba', 'Rádio Tupi de São Paulo', 'Rádio Clube do Pará'],
    optionsEn: ['Rádio Nacional do Rio de Janeiro', 'Rádio Guaíba', 'Rádio Tupi of São Paulo', 'Rádio Clube of Pará'],
    correctIndex: 0,
    explanationPt: 'A Rádio Nacional unificou o imaginário brasileiro com seus programas de auditório, radionovelas e orquestras ao vivo com Carmélia Alves, Orlando Silva e Emilinha Borba.',
    explanationEn: 'Rádio Nacional connected the entire nation via shortwave, establishing standard cultural benchmarks.',
    sourceRef: 'Empresa Brasil de Comunicação (EBC)'
  },
  // NOVAS QUESTÕES EXPANDIDAS - GEOGRAFIA & RELEVO
  {
    id: 'geo_relevo_02',
    scope: 'nacional',
    pillar: 'geografia',
    difficulty: 'aventureiro',
    questionPt: 'Qual rio 100% brasileiro, carinhosamente apelidado de "Velho Chico" e "Rio da Integração Nacional", nasce na Serra da Canastra (MG) e deságua no Oceano Atlântico entre AL e SE?',
    questionEn: 'Which entirely domestic river, dubbed "Velho Chico" and "River of National Integration", originates in Minas Gerais and empties into the Atlantic between Alagoas and Sergipe?',
    optionsPt: ['Rio São Francisco', 'Rio Amazonas', 'Rio Tocantins', 'Rio Paraná'],
    optionsEn: ['São Francisco River', 'Amazon River', 'Tocantins River', 'Paraná River'],
    correctIndex: 0,
    explanationPt: 'O Rio São Francisco atravessa o semiárido nordestino com vazão perene e foi vital para o povoamento do interior e a transposição de águas.',
    explanationEn: 'The São Francisco River is the lifeblood of the Brazilian interior, connecting the Southeast to the arid Northeast.',
    sourceRef: 'ANA (Agência Nacional de Águas)'
  }
];

export function getQuestionsByScope(scope: QuestScope): BrQuestQuestion[] {
  return BR_QUEST_QUESTIONS.filter((q) => q.scope === scope);
}

export function getQuestionsByRegion(regionId: string): BrQuestQuestion[] {
  return BR_QUEST_QUESTIONS.filter((q) => q.regionId === regionId);
}

export function getQuestionsByPillar(pillar: QuestThemePillar): BrQuestQuestion[] {
  return BR_QUEST_QUESTIONS.filter((q) => q.pillar === pillar);
}

export function getRandomQuizBatch(count = 5, filter?: { scope?: QuestScope; pillar?: QuestThemePillar; regionId?: string }): BrQuestQuestion[] {
  let pool = [...BR_QUEST_QUESTIONS];
  if (filter?.scope) {
    pool = pool.filter((q) => q.scope === filter.scope);
  }
  if (filter?.pillar) {
    pool = pool.filter((q) => q.pillar === filter.pillar);
  }
  if (filter?.regionId) {
    pool = pool.filter((q) => q.regionId === filter.regionId);
  }
  
  // Shuffle array
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  return pool.slice(0, count).map((q) => shuffleQuestionOptions(q));
}
