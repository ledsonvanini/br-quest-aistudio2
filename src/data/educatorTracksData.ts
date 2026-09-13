import { EducationalTrack, ClassroomGroup } from '../types/educator';

export const EDUCATIONAL_TRACKS: EducationalTrack[] = [
  {
    id: 'trilha-amazonia-rios-voadores',
    title: 'Amazônia & Rios Voadores: Dinâmica Hidroclimática da América do Sul',
    biome: 'Amazônia',
    targetGrade: '1º ao 3º Ano (EM)',
    durationMinutes: 90,
    recommendedStates: ['AM', 'PA', 'RO', 'MT', 'SP'],
    enemFocusTheme: 'Climatologia, evapotranspiração florestal e segurança hídrica',
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
        theme: 'Natureza e Sociedade',
        description:
          'Elaborar hipóteses, selecionar evidências e compor argumentos relativos a processos climáticos e suas interferências antrópicas.',
      },
      {
        code: 'EM13CHS301',
        gradeLevel: 'Ensino Médio',
        theme: 'Impactos Socioambientais',
        description:
          'Problematizar hábitos e práticas sustentáveis diante de desequilíbrios ecossistêmicos em escalas locais e continentais.',
      },
    ],
    examQuestionSample: {
      origin: 'ENEM 2021 Adaptado',
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
    id: 'trilha-cerrado-berco-das-aguas',
    title: 'Cerrado: O Berço das Águas e a Fronteira Agrícola do Matopiba',
    biome: 'Cerrado',
    targetGrade: '7º Ano (EF)',
    durationMinutes: 60,
    recommendedStates: ['GO', 'TO', 'MT', 'MS', 'MA', 'PI', 'BA'],
    enemFocusTheme: 'Aquíferos, chapadões sedimentares e expansão da fronteira agropecuária',
    overview:
      'Investigação do relevo tabular do Planalto Central, solos latossólicos com calagem, recarga dos Aquíferos Guarani e Urucuia e as três maiores bacias hidrográficas do país.',
    learningGoals: [
      'Reconhecer por que o Cerrado é denominado "caixa d’água" do Brasil.',
      'Examinar a vegetação xeromórfica, cascas grossas e raízes profundas.',
      'Debater a sustentabilidade da expansão agrícola na região do Matopiba.',
    ],
    bnccSkills: [
      {
        code: 'EF07GE01',
        gradeLevel: 'Ensino Fundamental II',
        theme: 'Território e Diversidade Regional',
        description:
          'Avaliar a dinâmica da produção agrária e as transformações na paisagem do Cerrado.',
      },
      {
        code: 'EF07GE04',
        gradeLevel: 'Ensino Fundamental II',
        theme: 'Recursos Naturais',
        description:
          'Analisar a distribuição dos recursos hídricos e os impactos das atividades econômicas nos mananciais.',
      },
    ],
    examQuestionSample: {
      origin: 'ENEM 2023',
      prompt:
        'O sistema radicular profundo da vegetação do Cerrado desempenha papel fundamental na dinâmica hidrológica brasileira porque:',
      options: [
        'Acelera a erosão laminar e o assoreamento de voçorocas.',
        'Funciona como esponja natural, facilitando a infiltração e a recarga dos lençóis freáticos.',
        'Impede a proliferação de gramíneas invasoras nativas.',
        'Bloqueia a evapotranspiração durante a estação chuvosa.',
      ],
      correctIndex: 1,
      explanation:
        'As raízes profundas agem como condutores que recarregam aquíferos mesmo durante os longos meses de estiagem do inverno do Planalto Central.',
    },
  },
  {
    id: 'trilha-caatinga-adaptacao-climatica',
    title: 'Caatinga: O Único Bioma Exclusivamente Brasileiro & Convivência com o Semiárido',
    biome: 'Caatinga',
    targetGrade: '9º Ano (EF)',
    durationMinutes: 75,
    recommendedStates: ['CE', 'PE', 'BA', 'PI', 'RN', 'PB', 'AL', 'SE'],
    enemFocusTheme: 'Clima semiárido, depressão sertaneja, cactáceas e tecnologias sociais',
    overview:
      'Desmistificação da Caatinga como ambiente estéril: análise de sua rica biodiversidade adaptada, transposição do Rio São Francisco e cisternas de placa.',
    learningGoals: [
      'Entender os mecanismos botânicos de perda de folhas (caducifólia) e armazenamento de água em cactos.',
      'Diferenciar seca climática natural de escassez socioeconômica e hídrica.',
      'Analisar matriz energética limpa da região (eólica e solar fotovoltaica).',
    ],
    bnccSkills: [
      {
        code: 'EF07GE02',
        gradeLevel: 'Ensino Fundamental II',
        theme: 'Biomas Brasileiros',
        description:
          'Comparar características físico-naturais e formas de apropriação dos domínios morfoclimáticos.',
      },
      {
        code: 'EM13CHS304',
        gradeLevel: 'Ensino Médio',
        theme: 'Políticas Públicas e Meio Ambiente',
        description:
          'Analisar os impactos socioambientais de grandes obras e projetos de infraestrutura hídrica e energética.',
      },
    ],
    examQuestionSample: {
      origin: 'ENEM 2020',
      prompt:
        'A substituição do conceito de "combate à seca" pelo de "convivência com o semiárido" no Nordeste brasileiro representou:',
      options: [
        'A total transferência da população rural para metrópoles litorâneas.',
        'Adoção de cisternas de captação de água de chuva, valorização de espécies nativas e manejo adequado da Caatinga.',
        'O abandono do cultivo agrícola em favor de mineração em áreas de preservação.',
        'A imposição de monoculturas irrigadas em áreas protegidas.',
      ],
      correctIndex: 1,
      explanation:
        'A convivência com o semiárido apoia-se no aproveitamento das chuvas com cisternas descentralizadas e respeito à ecologia xerófila da Caatinga.',
    },
  },
];

export const INITIAL_CLASSROOMS: ClassroomGroup[] = [
  {
    id: 'turma-7a-geografia',
    name: '7º Ano A — Geografia do Brasil',
    schoolName: 'Colégio Estadual Dom Pedro II',
    grade: '7º Ano EF',
    accessCode: 'BRQ-7A26',
    studentCount: 32,
    averageScorePercent: 82,
    activeTrackId: 'trilha-cerrado-berco-das-aguas',
    statesMasteredCount: 18,
  },
  {
    id: 'turma-3em-enem',
    name: '3º Ano EM — Foco ENEM & Vestibulares',
    schoolName: 'Instituto Federal / Pré-Vestibular Social',
    grade: '3º Ano EM',
    accessCode: 'ENEM-2026',
    studentCount: 45,
    averageScorePercent: 91,
    activeTrackId: 'trilha-amazonia-rios-voadores',
    statesMasteredCount: 26,
  },
  {
    id: 'turma-9b-ciencias',
    name: '9º Ano B — Meio Ambiente & Climatologia',
    schoolName: 'Escola Municipal Rio Branco',
    grade: '9º Ano EF',
    accessCode: 'BIO-9B44',
    studentCount: 28,
    averageScorePercent: 76,
    activeTrackId: 'trilha-caatinga-adaptacao-climatica',
    statesMasteredCount: 14,
  },
];
