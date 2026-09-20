import { EducationalTrack, ClassroomGroup } from '../types/educator';

export const EDUCATIONAL_TRACKS: EducationalTrack[] = [
  // =========================================================================
  // 1. ENSINO FUNDAMENTAL (Turmas do 6º ao 9º ano)
  // =========================================================================
  {
    id: 'trilha-fundamental-biomas-paisagens',
    title: 'Biomas e Paisagens do Brasil: Fauna, Flora e Diversidade Regional',
    biome: 'Caatinga',
    targetTier: 'fundamental',
    targetGrade: '6º e 7º Anos (Ensino Fundamental)',
    durationMinutes: 60,
    recommendedStates: ['CE', 'PE', 'BA', 'MG', 'PA', 'RS'],
    enemFocusTheme: 'Morfoclimatologia básica, ecossistemas e localização cartográfica',
    dataSourceRef: 'IBGE Geociências 2024 / ICMBio Livro Vermelho da Fauna 2024',
    overview:
      'Apresentação dos 6 grandes domínios morfoclimáticos do Brasil com foco nas características visuais, adaptações de plantas e animais ao clima local e leitura de mapas temáticos.',
    learningGoals: [
      'Localizar no mapa do Brasil os 6 biomas: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.',
      'Identificar adaptações dos seres vivos ao clima semiárido da Caatinga e à umidade equatorial amazônica.',
      'Compreender o conceito de preservação ambiental e áreas de conservação biológica.',
    ],
    bnccSkills: [
      {
        code: 'EF07GE02',
        gradeLevel: 'Ensino Fundamental',
        tier: 'fundamental',
        theme: 'Biomas Brasileiros e Biodiversidade',
        description:
          'Analisar a influência da estrutura geológica e relevo nos domínios morfoclimáticos e na formação dos biomas brasileiros.',
      },
      {
        code: 'EF07GE11',
        gradeLevel: 'Ensino Fundamental',
        tier: 'fundamental',
        theme: 'Cartografia e Paisagem',
        description:
          'Utilizar mapas temáticos e imagens de satélite para identificar padrões de uso da terra e conservação da natureza.',
      },
    ],
    examQuestionSample: {
      origin: 'Prova Brasil / Avaliação Diagnóstica EF',
      tier: 'fundamental',
      points: 100,
      xp: 50,
      prompt:
        'Qual bioma brasileiro é considerado exclusivo do território nacional (endêmico) e possui plantas adaptadas para economizar água durante períodos de estiagem?',
      options: [
        'Caatinga',
        'Mata Atlântica',
        'Pantanal',
        'Pampa',
      ],
      correctIndex: 0,
      explanation:
        'A Caatinga ocupa cerca de 10% do Brasil e possui flora xerófila e fauna com adaptações exclusivas ao clima semiárido.',
    },
  },
  {
    id: 'trilha-fundamental-bacias-hidrografia',
    title: 'As Águas do Brasil: Bacias Hidrográficas, Rios e o Ciclo da Água',
    biome: 'Cerrado',
    targetTier: 'fundamental',
    targetGrade: '7º e 8º Anos (Ensino Fundamental)',
    durationMinutes: 70,
    recommendedStates: ['GO', 'TO', 'MG', 'BA', 'SP', 'PR'],
    enemFocusTheme: 'Recursos hídricos, nascentes do Cerrado e abastecimento urbano',
    dataSourceRef: 'ANA - Agência Nacional de Águas / Hidroweb 2024/2025',
    overview:
      'Estudo das 12 regiões hidrográficas brasileiras, o papel do Cerrado como berço das águas e a importância do consumo consciente e da preservação das matas ciliares.',
    learningGoals: [
      'Diferenciar bacia hidrográfica, afluente, nascente e foz através de modelos cartográficos interativos.',
      'Reconhecer a importância do Rio São Francisco e da Bacia do Paraná para a geração de energia e abastecimento.',
      'Investigar as causas da poluição dos rios urbanos e propor soluções para conservação das matas ciliares.',
    ],
    bnccSkills: [
      {
        code: 'EF07GE04',
        gradeLevel: 'Ensino Fundamental',
        tier: 'fundamental',
        theme: 'Recursos Hídricos e Sociedade',
        description:
          'Analisar os padrões de distribuição dos recursos hídricos no Brasil e os impactos das atividades humanas sobre mananciais e bacias.',
      },
      {
        code: 'EF08GE15',
        gradeLevel: 'Ensino Fundamental',
        tier: 'fundamental',
        theme: 'Dinâmica Natural e População',
        description:
          'Aplicar conceitos geográficos de bacias hidrográficas para entender a ocupação territorial e o abastecimento de cidades.',
      },
    ],
    examQuestionSample: {
      origin: 'Olimpíada Brasileira de Geografia Júnior',
      tier: 'fundamental',
      points: 100,
      xp: 50,
      prompt:
        'O Cerrado é frequentemente chamado de "Berço das Águas" do Brasil porque:',
      options: [
        'Nele nascem rios que abastecem 8 das 12 grandes bacias hidrográficas brasileiras.',
        'É a região com o maior volume de chuva diária ininterrupta do planeta.',
        'Possui as maiores geleiras e reservatórios subterrâneos de água salgada.',
        'Fica no litoral brasileiro e concentra as maiores usinas de dessalinização.',
      ],
      correctIndex: 0,
      explanation:
        'O relevo elevado do Planalto Central e suas raízes profundas funcionam como esponja que recarrega aquíferos e alimenta as bacias do São Francisco, Tocantins, Paraná e outras.',
    },
  },

  // =========================================================================
  // 2. ENSINO MÉDIO (1º ao 3º Anos & ENEM)
  // =========================================================================
  {
    id: 'trilha-medio-amazonia-rios-voadores',
    title: 'Amazônia & Rios Voadores: Dinâmica Hidroclimática da América do Sul',
    biome: 'Amazônia',
    targetTier: 'medio',
    targetGrade: '1º ao 3º Ano (Ensino Médio & ENEM)',
    durationMinutes: 90,
    recommendedStates: ['AM', 'PA', 'RO', 'MT', 'SP'],
    enemFocusTheme: 'Climatologia, evapotranspiração florestal e segurança hídrica',
    dataSourceRef: 'INPE / CPTEC Previsão Numérica 2025 & ECMWF Reanalysis',
    overview:
      'Compreensão do mecanismo físico dos rios voadores (bomba biótica amazônica), convergência com a Cordilheira dos Andes e impacto nas chuvas do Centro-Sul do Brasil.',
    learningGoals: [
      'Identificar o papel da evapotranspiração arbórea na formação de umidade atmosférica.',
      'Analisar a interação entre Ventos Alísios, relevo andino e a Zona de Convergência do Atlântico Sul (ZCAS).',
      'Correlacionar desmatamento regional com crises hídricas nos reservatórios do Sudeste.',
    ],
    bnccSkills: [
      {
        code: 'EM13CHS103',
        gradeLevel: 'Ensino Médio',
        tier: 'medio',
        theme: 'Natureza e Sociedade',
        description:
          'Elaborar hipóteses, selecionar evidências e compor argumentos relativos a processos climáticos e suas interferências antrópicas.',
      },
      {
        code: 'EM13CHS301',
        gradeLevel: 'Ensino Médio',
        tier: 'medio',
        theme: 'Impactos Socioambientais',
        description:
          'Problematizar hábitos e práticas sustentáveis diante de desequilíbrios ecossistêmicos em escalas locais e continentais.',
      },
    ],
    examQuestionSample: {
      origin: 'ENEM 2024',
      tier: 'medio',
      points: 200,
      xp: 100,
      prompt:
        'A massa de ar úmida originada sobre a Bacia Amazônica desloca-se em direção ao oeste até encontrar a barreira orográfica dos Andes, sofrendo deflexão para o sul e sudeste do continente. Esse fenômeno é vital para:',
      options: [
        'A formação do Semiárido nordestino e estiagem sertaneja.',
        'O abastecimento de chuva nas bacias do Prata, Paraná e no agronegócio do Centro-Sul.',
        'A intensificação da friagem no litoral do Nordeste oriental.',
        'A contenção de frentes polares oceânicas no Cone Sul.',
      ],
      correctIndex: 1,
      explanation:
        'Os rios voadores transportam bilhões de litros diários de vapor d’água da Amazônia, irrigando lavouras e mananciais no Centro-Oeste e Sudeste.',
    },
  },
  {
    id: 'trilha-medio-geopolitica-matopiba',
    title: 'Geopolítica do Agronegócio e Transição Demográfica no Brasil Contemporâneo',
    biome: 'Cerrado',
    targetTier: 'medio',
    targetGrade: '1º ao 3º Ano (Ensino Médio & ENEM)',
    durationMinutes: 80,
    recommendedStates: ['DF', 'GO', 'MT', 'MS', 'MA', 'PI', 'BA', 'SP'],
    enemFocusTheme: 'Fronteiras agrícolas (Matopiba), Censo Demográfico e transição da matriz energética',
    dataSourceRef: 'IBGE Censo Demográfico & Estimativas 2024/2025 / MapBiomas Coleção 9',
    overview:
      'Análise crítica das transformações do espaço agrário brasileiro, expansão do Matopiba, dinâmica das migrações internas e envelhecimento da pirâmide etária do Censo.',
    learningGoals: [
      'Examinar o avanço da fronteira agroexportadora nos estados do Maranhão, Tocantins, Piauí e Bahia.',
      'Interpretar gráficos do Censo sobre razão de dependência e transição demográfica.',
      'Avaliar a participação das energias renováveis (eólica e solar) na matriz energética nacional.',
    ],
    bnccSkills: [
      {
        code: 'EM13CHS202',
        gradeLevel: 'Ensino Médio',
        tier: 'medio',
        theme: 'Espaço Geográfico e Economia',
        description:
          'Analisar a formação do território brasileiro e as relações entre dinâmicas produtivas e fluxos populacionais.',
      },
      {
        code: 'EM13CHS304',
        gradeLevel: 'Ensino Médio',
        tier: 'medio',
        theme: 'Geopolítica e Infraestrutura',
        description:
          'Avaliar os impactos territoriais de grandes eixos logísticos, hidrovias e expansão da matriz energética limpa.',
      },
    ],
    examQuestionSample: {
      origin: 'FUVEST / ENEM 2024',
      tier: 'medio',
      points: 200,
      xp: 100,
      prompt:
        'Os dados demográficos consolidados do IBGE revelam que o Brasil vivencia uma rápida transição na estrutura etária de sua população, caracterizada por:',
      options: [
        'Aumento exponencial das taxas de fecundidade acima de 3,5 filhos por mulher em todas as capitais.',
        'Estreitamento da base da pirâmide com aceleração do envelhecimento populacional e aumento da idade mediana.',
        'Explosão da taxa de natalidade rural acompanhada de evasão generalizada das cidades metropolitanas.',
        'Manutenção de uma pirâmide predominantemente jovem idêntica ao padrão dos anos 1970.',
      ],
      correctIndex: 1,
      explanation:
        'Com a queda da taxa de fecundidade abaixo do nível de reposição e o aumento da expectativa de vida, o Brasil envelhece em ritmo acelerado.',
    },
  },

  // =========================================================================
  // 3. NÍVEL AVANÇADO (Nível Pesquisador / Universitário / Acadêmico)
  // =========================================================================
  {
    id: 'trilha-avancado-teleconexoes-clima',
    title: 'Teleconexões Climáticas Globais: ENSO, Dipolo do Atlântico e Modelagem ECMWF',
    biome: 'Mata Atlântica',
    targetTier: 'avancado',
    targetGrade: 'Nível Pesquisador / Superior',
    durationMinutes: 120,
    recommendedStates: ['RS', 'SC', 'PR', 'SP', 'RJ', 'BA', 'AM'],
    enemFocusTheme: 'Circulação geral da atmosfera, termodinâmica de fluidos e telemetria preditiva',
    dataSourceRef: 'ECMWF Integrated Forecasting System & CPTEC/INPE 2025',
    overview:
      'Modelagem avançada das oscilações climáticas interanuais (El Niño / La Niña, IOD, Madden-Julian) e sua influência na ZCAS, bloqueios atmosféricos e eventos extremos no território sul-americano.',
    learningGoals: [
      'Modelar a alteração da Célula de Walker durante fases anômalas de TSM no Pacífico Equatorial.',
      'Calcular anomalias de precipitação e correlações espaciais com a Zona de Convergência Intertropical (ZCIT).',
      'Interpretar dados de reanálise ERA5/ECMWF para prevenção de desastres hidrometeorológicos.',
    ],
    bnccSkills: [
      {
        code: 'PC-GEO-2025-01',
        gradeLevel: 'Nível Pesquisador',
        tier: 'avancado',
        theme: 'Climatologia Física e Dinâmica de Fluidos',
        description:
          'Modelar interações oceano-atmosfera em multiescalas e projetar cenários hidroclimáticos regionais sob forçantes radiativas.',
      },
      {
        code: 'PC-GEO-2025-02',
        gradeLevel: 'Nível Pesquisador',
        tier: 'avancado',
        theme: 'Sensoriamento Remoto e Modelagem Geoespacial',
        description:
          'Processar séries temporais de telemetria satelital e aplicar algoritmos de aprendizado para predição de extremos.',
      },
    ],
    examQuestionSample: {
      origin: 'Concurso Nacional Unificado / Pós-Graduação em Geociências 2025',
      tier: 'avancado',
      points: 350,
      xp: 200,
      prompt:
        'Na dinâmica atmosférica tropical sul-americana, a modulação da Zona de Convergência do Atlântico Sul (ZCAS) durante a ocorrência de anomalias térmicas positivas no Atlântico Sul Tropical é regida fundamentalmente por:',
      options: [
        'Inversão térmica estratosférica provocando subsidência generalizada sobre a Bacia do Prata sem trocas turbulentas.',
        'Transporte meridional de calor e umidade modulado pelo Jato de Baixos Níveis (JBN) a leste dos Andes em interação com o gradiente térmico da TSM.',
        'Extinção completa dos ventos alísios de sudeste pela passagem do vórtice ciclônico de altos níveis do Nordeste.',
        'Bloqueio barotrópico que impede a atuação de qualquer onda de Rossby sobre o Atlântico Sudoeste.',
      ],
      correctIndex: 1,
      explanation:
        'O Jato de Baixos Níveis (JBN) canaliza umidade equatorial da Amazônia paralelamente à encosta oriental dos Andes, organizando o canal de precipitação da ZCAS.',
    },
  },
  {
    id: 'trilha-avancado-mapbiomas-sensoriamento',
    title: 'Sensoriamento Remoto, Matrizes de Transição de Uso do Solo e Segurança Hídrica',
    biome: 'Pantanal',
    targetTier: 'avancado',
    targetGrade: 'Nível Pesquisador / Superior',
    durationMinutes: 110,
    recommendedStates: ['MS', 'MT', 'PA', 'RO', 'TO', 'MA'],
    enemFocusTheme: 'Classificação supervisionada, balanço hídrico de bacias e conservação de hotspots',
    dataSourceRef: 'MapBiomas Coleção 9 (1985-2024) / ANA Hidroweb 2025',
    overview:
      'Investigação geoespacial quantitativa da perda de superfície de água no Pantanal e Cerrado com base em 40 anos de imagens Landsat/Sentinel e matrizes de Markov de transição da cobertura vegetal.',
    learningGoals: [
      'Analisar índices de vegetação (NDVI, EVI, NDWI) e cálculo de perda líquida de espelho d’água.',
      'Construir matrizes de transição de uso da terra entre pastagens, agricultura irrigada e vegetação primária.',
      'Desenvolver indicadores de vulnerabilidade hídrica para os comitês de bacias hidrográficas da ANA.',
    ],
    bnccSkills: [
      {
        code: 'PC-AMB-2025-01',
        gradeLevel: 'Nível Pesquisador',
        tier: 'avancado',
        theme: 'Geoprocessamento e Análise Temporal',
        description:
          'Manipular cubos de dados de observação da Terra para quantificar trajetórias ecológicas e degradação florestal.',
      },
      {
        code: 'PC-AMB-2025-02',
        gradeLevel: 'Nível Pesquisador',
        tier: 'avancado',
        theme: 'Gestão Integrada de Recursos Hídricos',
        description:
          'Aplicar modelagem hidrológica distribuída acoplada a cenários de conversão da cobertura da terra em bacias críticas.',
      },
    ],
    examQuestionSample: {
      origin: 'Exame de Admissão em Ciências Ambientais & Geoprocessamento 2025',
      tier: 'avancado',
      points: 350,
      xp: 200,
      prompt:
        'A série histórica temporal de 1985 a 2024 do MapBiomas no Bioma Pantanal evidenciou uma redução na área média inundada. Essa dinâmica é explicada pela interação entre:',
      options: [
        'Aumento artificial da cota de montante por represamento total de todos os tributários sem alteração climática.',
        'Déficits de precipitação acumulados na bacia do Alto Paraguai, alteração do pulso de inundação e conversão de nascentes no planalto circundante.',
        'Impermeabilização asfáltica massiva da planície pantaneira superando a taxa de evaporação local.',
        'Derretimento das geleiras dos contrafortes andinos que alimentavam diretamente o Rio Cuiabá.',
      ],
      correctIndex: 1,
      explanation:
        'A redução da área alagada do Pantanal resulta de secas plurianuais e do desmatamento nas cabeceiras no Cerrado do planalto circundante, que compromete a retenção e o tempo de recarga da planície.',
    },
  },
];

export const INITIAL_CLASSROOMS: ClassroomGroup[] = [
  {
    id: 'turma-7a-geografia',
    name: '7º Ano A — Geografia do Brasil',
    schoolName: 'Colégio Estadual Dom Pedro II',
    grade: '7º Ano EF',
    tier: 'fundamental',
    accessCode: 'BRQ-7A26',
    studentCount: 28,
    averageScorePercent: 78,
    activeTrackId: 'trilha-fundamental-biomas-paisagens',
    statesMasteredCount: 14,
  },
  {
    id: 'turma-3c-enem',
    name: '3º Ano C — Intensivo ENEM & Climatologia',
    schoolName: 'Instituto Federal de Educação, Ciência e Tecnologia',
    grade: '3º Ano EM',
    tier: 'medio',
    accessCode: 'BRQ-3C26',
    studentCount: 34,
    averageScorePercent: 86,
    activeTrackId: 'trilha-medio-amazonia-rios-voadores',
    statesMasteredCount: 22,
  },
  {
    id: 'turma-lab-pesquisa',
    name: 'Laboratório de Geociências & Sensoriamento Remoto',
    schoolName: 'Universidade Federal / Grupo de Iniciação Científica',
    grade: 'Nível Pesquisador',
    tier: 'avancado',
    accessCode: 'BRQ-LAB26',
    studentCount: 16,
    averageScorePercent: 94,
    activeTrackId: 'trilha-avancado-teleconexoes-clima',
    statesMasteredCount: 27,
  },
];
