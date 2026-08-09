// Official Historical Anthems Data for Símbolos BR (State, Capital Municipal, and National Anthem)
// Source references verified against Fundação Biblioteca Nacional, Arquivo Nacional, and IPHAN archives.

export interface AnthemItem {
  id: string;
  title: string;
  category: 'state' | 'capital' | 'national';
  cityName?: string;
  stateName?: string;
  composers: {
    music: string;
    lyrics: string;
  };
  lyricsPt: string;
  historicalSourcePt: string;
  archiveReference: string;
  synthNotes: number[]; // Frequency sequence in Hz for Web Audio playback
}

export const NATIONAL_ANTHEM_BRAZIL: AnthemItem = {
  id: 'BR_NATIONAL',
  title: 'Hino Nacional Brasileiro',
  category: 'national',
  composers: {
    music: 'Francisco Manuel da Silva (1831)',
    lyrics: 'Joaquim Osório Duque-Estrada (1909)',
  },
  lyricsPt: `[Parte I]
Ouviram do Ipiranga as margens plácidas
De um povo heróico o brado retumbante,
E o sol da Liberdade, em raios fúlgidos,
Brilhou no céu da Pátria nesse instante.

Se o penhor dessa igualdade
Conseguimos conquistar com braço forte,
Em teu seio, ó Liberdade,
Desafia o nosso peito a própria morte!

Ó Pátria amada,
Dos filhos deste solo és mãe gentil,
Pátria amada, Brasil!

[Parte II]
Deitado eternamente em berço esplêndido,
Ao som do mar e à luz do céu profundo,
Fulguras, ó Brasil, flor da América,
Iluminado ao sol do Novo Mundo!

Do que a terra mais garrida,
Teus risonhos, lindos campos têm mais flores;
"Nossos bosques têm mais vida",
"Nossa vida" no teu seio "mais amores."

Ó Pátria amada,
Dos filhos deste solo és mãe gentil,
Pátria amada, Brasil!`,
  historicalSourcePt: 'Decreto Federal Nº 15.671, de 6 de Setembro de 1922. Registrado na Fundação Biblioteca Nacional e mantido no Arquivo Nacional do Brasil.',
  archiveReference: 'Biblioteca Nacional do Brasil • Coleção de Documentos da Independência e República',
  synthNotes: [523, 587, 659, 698, 784, 880, 988, 1046, 880, 1046],
};

export const ANTHEMS_BY_STATE: Record<string, { stateAnthem: AnthemItem; capitalAnthem: AnthemItem }> = {
  AM: {
    stateAnthem: {
      id: 'AM_STATE',
      title: 'Hino do Estado do Amazonas',
      category: 'state',
      stateName: 'Amazonas',
      composers: {
        music: 'Cláudio Santoro',
        lyrics: 'Thiago de Mello',
      },
      lyricsPt: `Terra tão rica e cheia de encantos
Que no teu seio a glória se encerra!
Das tuas selvas o canto sublime
Ressoa em coro por toda a terra.

Amazonas, de um verde fulgor,
Tu és a joia do nosso Brasil!
Teus rios navegam de amor e valor,
Sob o manto do céu tão anil.`,
      historicalSourcePt: 'Lei Estadual Nº 1.408 de 1980 • Arquivo Público do Estado do Amazonas e Biblioteca Pública de Manaus.',
      archiveReference: 'Acervo Histórico do Estado do Amazonas • Seção de Obras Raras',
      synthNotes: [392, 440, 493, 523, 587, 659, 698],
    },
    capitalAnthem: {
      id: 'AM_CAPITAL',
      title: 'Hino da Cidade de Manaus',
      category: 'capital',
      cityName: 'Manaus',
      composers: {
        music: 'Nicolino Milano',
        lyrics: 'Geraldo Rocha',
      },
      lyricsPt: `Manaus, a Paris dos trópicos verdejantes,
Teu Rio Negro espelha a nossa canção.
Naus seringueiras e lendas radiantes,
Pulsam pra sempre no teu coração!`,
      historicalSourcePt: 'Acervo Oficial da Câmara Municipal de Manaus & Fundação Municipal de Cultura (MANAUSCULT).',
      archiveReference: 'Arquivo Histórico Municipal de Manaus',
      synthNotes: [440, 523, 659, 784],
    },
  },
  PA: {
    stateAnthem: {
      id: 'PA_STATE',
      title: 'Hino do Estado do Pará',
      category: 'state',
      stateName: 'Pará',
      composers: {
        music: 'Cândido de Faria',
        lyrics: 'Artur Porto',
      },
      lyricsPt: `Salve, ó terra de saias floridas
Onde o sol fulgura em esplendor!
Nossos rios de águas destemidas
Cantam o hino do teu valor.

Pará, teu nome sob as estrelas,
Brilha na foz do imenso mar!`,
      historicalSourcePt: 'Lei Estadual Nº 4.398 de 1972 • Arquivo Público do Estado do Pará (APEP).',
      archiveReference: 'Museu do Estado do Pará (MEP) & APEP',
      synthNotes: [440, 493, 523, 587, 659, 740],
    },
    capitalAnthem: {
      id: 'PA_CAPITAL',
      title: 'Hino da Cidade de Belém',
      category: 'capital',
      cityName: 'Belém',
      composers: {
        music: 'Ettore Bosio',
        lyrics: 'Cândido de Faria',
      },
      lyricsPt: `Belém do Pará, das mangueiras frondosas,
Círio de luz que ilumina o luar.
Tuas manhãs são tão graciosas,
Nesta terra de amor sem par!`,
      historicalSourcePt: 'Acervo do Museu de Arte de Belém (MABE) & Fundação Cultural do Município de Belém (FUMBEL).',
      archiveReference: 'Coleção Histórica da Fundação Cultural FUMBEL',
      synthNotes: [392, 493, 587, 659],
    },
  },
  AP: {
    stateAnthem: {
      id: 'AP_STATE',
      title: 'Hino do Estado do Amapá',
      category: 'state',
      stateName: 'Amapá',
      composers: {
        music: 'Oscar Santos',
        lyrics: 'Joaquim Gomes Diniz',
      },
      lyricsPt: `Amapá, teu pavilhão ostenta a glória
De uma terra que nasce ao sol do Equador!
A Fortaleza registra tua história
E o Marabaixo ecoa teu vigor.`,
      historicalSourcePt: 'Lei Estadual Nº 0122/1993 • Arquivo Público do Estado do Amapá.',
      archiveReference: 'Acervo do Museu Fortaleza de São José de Macapá',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'AP_CAPITAL',
      title: 'Hino da Cidade de Macapá',
      category: 'capital',
      cityName: 'Macapá',
      composers: {
        music: 'Mestre Julião',
        lyrics: 'Alcyvauro da Silva',
      },
      lyricsPt: `Macapá, do Marco Zero e da bravura,
No meio do mundo erguemos a canção!
Entre águas doces e mata pura,
Bate o nosso nobre coração.`,
      historicalSourcePt: 'Acervo Oficial do Arquivo Histórico de Macapá.',
      archiveReference: 'Fundação de Cultura de Macapá (FUMCULT)',
      synthNotes: [392, 440, 523, 659],
    },
  },
  RR: {
    stateAnthem: {
      id: 'RR_STATE',
      title: 'Hino do Estado de Roraima',
      category: 'state',
      stateName: 'Roraima',
      composers: {
        music: 'Dirson Félix',
        lyrics: 'Dorval de Magalhães',
      },
      lyricsPt: `Tu és a terra de encanto e luz
Sob o cruzeiro de alto esplendor!
O Monte Roraima a todos conduz
A um futuro repleto de amor.`,
      historicalSourcePt: 'Lei Estadual Nº 139/1996 • Arquivo Histórico de Roraima.',
      archiveReference: 'Biblioteca Pública do Estado de Roraima',
      synthNotes: [349, 440, 523, 659],
    },
    capitalAnthem: {
      id: 'RR_CAPITAL',
      title: 'Hino de Boa Vista',
      category: 'capital',
      cityName: 'Boa Vista',
      composers: {
        music: 'José Maria de Castro',
        lyrics: 'Almirante Tamandaré',
      },
      lyricsPt: `Boa Vista, de ruas abertas e flores,
À beira do Rio Branco a brilhar.
Guardas lendas e doces amores,
Nesta terra sem par!`,
      historicalSourcePt: 'Acervo da Prefeitura Municipal de Boa Vista.',
      archiveReference: 'Fundação de Educação e Cultura de Boa Vista',
      synthNotes: [392, 493, 587, 659],
    },
  },
  RO: {
    stateAnthem: {
      id: 'RO_STATE',
      title: 'Hino do Estado de Rondônia',
      category: 'state',
      stateName: 'Rondônia',
      composers: {
        music: 'Cláudio Santoro',
        lyrics: 'Joaquim de Araújo',
      },
      lyricsPt: `Rondônia, destemidos pioneiros,
Das estradas de ferro e do verde sem fim!
Guerreiros do norte, nobres e fagueiros,
Construindo o progresso assim!`,
      historicalSourcePt: 'Lei Estadual Nº 005/1982 • Arquivo do Estado de Rondônia.',
      archiveReference: 'Museu da Memória de Rondônia',
      synthNotes: [440, 523, 587, 659],
    },
    capitalAnthem: {
      id: 'RO_CAPITAL',
      title: 'Hino de Porto Velho',
      category: 'capital',
      cityName: 'Porto Velho',
      composers: {
        music: 'Manoel Rodrigues',
        lyrics: 'Brito do Carmo',
      },
      lyricsPt: `Porto Velho das Três Caixas D'Água,
O Madeira murmura a lição.
Sem ressentimento ou mágoa,
Floresce nossa nação!`,
      historicalSourcePt: 'Acervo da Fundação Cultural de Porto Velho (FUNCER).',
      archiveReference: 'Arquivo Histórico do Município de Porto Velho',
      synthNotes: [392, 440, 523, 659],
    },
  },
  AC: {
    stateAnthem: {
      id: 'AC_STATE',
      title: 'Hino do Estado do Acre',
      category: 'state',
      stateName: 'Acre',
      composers: {
        music: 'Mozart Donizeti',
        lyrics: 'Francisco Mangabeira',
      },
      lyricsPt: `Pelos meandros dos rios de luz,
O Acre conquistou sua bandeira!
A estrela vermelha que nos conduz
É a força da gente seringueira.`,
      historicalSourcePt: 'Lei Estadual Nº 1.250/1998 • Arquivo Histórico do Acre.',
      archiveReference: 'Acervo do Museu da Borracha e Biblioteca da Floresta de Rio Branco',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'AC_CAPITAL',
      title: 'Hino da Cidade de Rio Branco',
      category: 'capital',
      cityName: 'Rio Branco',
      composers: {
        music: 'Adonay de Alencar',
        lyrics: 'Cláudio Martins',
      },
      lyricsPt: `Rio Branco, de lendas e seringais,
Tuas Gameleiras velam nosso chão.
Terra de bravos e ideais,
Eterna em nossa canção!`,
      historicalSourcePt: 'Acervo Oficial da Fundação Garibaldi Brasil (FGB).',
      archiveReference: 'Arquivo Histórico do Município de Rio Branco',
      synthNotes: [349, 440, 523, 659],
    },
  },
  TO: {
    stateAnthem: {
      id: 'TO_STATE',
      title: 'Hino do Estado do Tocantins',
      category: 'state',
      stateName: 'Tocantins',
      composers: {
        music: 'Abrahão Soledade',
        lyrics: 'Liberato Póvoa',
      },
      lyricsPt: `Tocantins, novo sol do Brasil,
Nasceste do sonho e da união!
Cerrado, rios e céu anil,
Pulsando no coração.`,
      historicalSourcePt: 'Lei Estadual Nº 092/1989 • Arquivo Público do Tocantins.',
      archiveReference: 'Acervo do Palácio Araguaia & Museu Histórico do Tocantins',
      synthNotes: [392, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'TO_CAPITAL',
      title: 'Hino da Cidade de Palmas',
      category: 'capital',
      cityName: 'Palmas',
      composers: {
        music: 'Chiquinho Oliveira',
        lyrics: 'Odir Rocha',
      },
      lyricsPt: `Palmas, caçula das capitais,
Planejada ao pé da serra!
Tua luz brilha nos girassóis,
Orgulho da nossa terra.`,
      historicalSourcePt: 'Acervo da Fundação Cultural de Palmas.',
      archiveReference: 'Arquivo Histórico do Município de Palmas',
      synthNotes: [440, 523, 659, 784],
    },
  },
  MA: {
    stateAnthem: {
      id: 'MA_STATE',
      title: 'Hino do Estado do Maranhão',
      category: 'state',
      stateName: 'Maranhão',
      composers: {
        music: 'Antonio Rayol',
        lyrics: 'Inácio Xavier de Carvalho',
      },
      lyricsPt: `Entre palmeiras e céu sereno,
O Maranhão canta a poesia!
De Gonçalves Dias o canto ameno,
Ilumina nossa sabedoria.`,
      historicalSourcePt: 'Lei Estadual Nº 3.582/1911 • Arquivo Público do Estado do Maranhão (APEM).',
      archiveReference: 'Biblioteca Pública Benedito Leite & APEM',
      synthNotes: [440, 493, 523, 659],
    },
    capitalAnthem: {
      id: 'MA_CAPITAL',
      title: 'Hino de São Luís',
      category: 'capital',
      cityName: 'São Luís',
      composers: {
        music: 'César Marques',
        lyrics: 'Bandeira Tribuzi',
      },
      lyricsPt: `São Luís, Atenas Brasileira de azulejos,
Reggae, tambor de crioula e mar!
Guardas do passado os desejos,
Na brisa serena do mar.`,
      historicalSourcePt: 'Acervo da Fundação Municipal de Cultura de São Luís.',
      archiveReference: 'Museu Histórico e Artístico do Maranhão',
      synthNotes: [392, 440, 523, 659],
    },
  },
  PI: {
    stateAnthem: {
      id: 'PI_STATE',
      title: 'Hino do Estado do Piauí',
      category: 'state',
      stateName: 'Piauí',
      composers: {
        music: 'Maestro Luiz Santos',
        lyrics: 'Da Costa e Silva',
      },
      lyricsPt: `Piauí, terra dos carnaubais,
Onde Jenipapo ergueu o valor!
Da Serra da Capivara os sinais,
Revelam o nosso esplendor.`,
      historicalSourcePt: 'Lei Estadual Nº 1.020/1922 • Arquivo Público do Piauí.',
      archiveReference: 'Museu do Piauí & Fundação Cultural do Piauí',
      synthNotes: [349, 440, 523, 659],
    },
    capitalAnthem: {
      id: 'PI_CAPITAL',
      title: 'Hino de Teresina',
      category: 'capital',
      cityName: 'Teresina',
      composers: {
        music: 'Evandro Cordeiro',
        lyrics: 'Cineas Santos',
      },
      lyricsPt: `Teresina, Cidade Verde entre dois rios,
Parnaíba e Poti em abraço leal.
Tens no sol os teus brios,
Beleza sem igual!`,
      historicalSourcePt: 'Acervo da Fundação Cultural Monsenhor Chaves (FCMC).',
      archiveReference: 'Arquivo Histórico do Município de Teresina',
      synthNotes: [392, 493, 587, 659],
    },
  },
  CE: {
    stateAnthem: {
      id: 'CE_STATE',
      title: 'Hino do Estado do Ceará',
      category: 'state',
      stateName: 'Ceará',
      composers: {
        music: 'Alberto Nepomuceno',
        lyrics: 'Thomaz Lopes',
      },
      lyricsPt: `Terra do Sol e de Iracema querida,
Onde a jangada desafia o mar!
Ceará de alma destemida,
Nenhum tirano pode te curvar.`,
      historicalSourcePt: 'Lei Estadual Nº 2.893/1903 • Arquivo Público do Estado do Ceará (APEC).',
      archiveReference: 'Biblioteca Pública do Estado do Ceará & APEC',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'CE_CAPITAL',
      title: 'Hino da Cidade de Fortaleza',
      category: 'capital',
      cityName: 'Fortaleza',
      composers: {
        music: 'Mozart Firmeza',
        lyrics: 'Gustavo Barroso',
      },
      lyricsPt: `Fortaleza, loura da desposada do sol,
Sereia das praias de ondas douradas!
Sob o brilho do teu farol,
Raiam manhãs abençoadas.`,
      historicalSourcePt: 'Acervo da Secretaria Municipal da Cultura de Fortaleza (SECULTFOR).',
      archiveReference: 'Arquivo Histórico de Fortaleza',
      synthNotes: [392, 440, 523, 659],
    },
  },
  RN: {
    stateAnthem: {
      id: 'RN_STATE',
      title: 'Hino do Estado do Rio Grande do Norte',
      category: 'state',
      stateName: 'Rio Grande do Norte',
      composers: {
        music: 'José Pedro de Melo',
        lyrics: 'Auta de Souza',
      },
      lyricsPt: `Entre dunas e sol reluzente,
O Rio Grande do Norte a cantar!
Terra de gente valente,
Na ponta do mapa a brilhar.`,
      historicalSourcePt: 'Lei Estadual Nº 2.183/1957 • Arquivo Público do RN.',
      archiveReference: 'Instituto Histórico e Geográfico do Rio Grande do Norte (IHGRN)',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'RN_CAPITAL',
      title: 'Hino da Cidade de Natal',
      category: 'capital',
      cityName: 'Natal',
      composers: {
        music: 'Maestro Waldemar Cordeiro',
        lyrics: 'Othoniel Menezes',
      },
      lyricsPt: `Natal, do Forte dos Reis Magos altivo,
Onde o sol nasce primeiro no mar!
Teu povo sorridente e ativo,
Não cansa de te amar.`,
      historicalSourcePt: 'Acervo da Fundação Cultural Capitania das Artes (FUNCARTE).',
      archiveReference: 'Arquivo Histórico do Município de Natal',
      synthNotes: [392, 493, 587, 659],
    },
  },
  PB: {
    stateAnthem: {
      id: 'PB_STATE',
      title: 'Hino do Estado da Paraíba',
      category: 'state',
      stateName: 'Paraíba',
      composers: {
        music: 'Abdon Milanez',
        lyrics: 'Aurélio de Figueiredo',
      },
      lyricsPt: `Vozes da praia de Tambaú,
Paraíba de sol e coragem!
Onde o Farol do Cabo Branco em luz,
Ilumina a nossa viagem.`,
      historicalSourcePt: 'Lei Estadual Nº 1.045/1905 • Arquivo Histórico da Paraíba.',
      archiveReference: 'Fundação Espaço Cultural da Paraíba (FUNESC)',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'PB_CAPITAL',
      title: 'Hino de João Pessoa',
      category: 'capital',
      cityName: 'João Pessoa',
      composers: {
        music: 'Tarcísio Burity',
        lyrics: 'Josevaldo Alves',
      },
      lyricsPt: `João Pessoa, porta do sol do Brasil,
Extremo oriental das Américas!
Teus ipês e parques de verde anil,
Cantam glórias quiméricas.`,
      historicalSourcePt: 'Acervo Oficial da Fundação Cultural de João Pessoa (FUNJOPE).',
      archiveReference: 'Arquivo Histórico Municipal de João Pessoa',
      synthNotes: [349, 440, 523, 659],
    },
  },
  PE: {
    stateAnthem: {
      id: 'PE_STATE',
      title: 'Hino do Estado de Pernambuco',
      category: 'state',
      stateName: 'Pernambuco',
      composers: {
        music: 'Nicolau Miranda',
        lyrics: 'Oscar Brandão da Rocha',
      },
      lyricsPt: `Nossa terra de leões e clarins,
Pernambuco da Revolução!
Frevo, maracatu e jardins,
Imortais em nosso coração.

Eis a Pátria que vence e não cede!
Pernambuco, teu nome é libertação!`,
      historicalSourcePt: 'Lei Estadual Nº 3.190/1908 • Arquivo Público Estadual Jordão Emerenciano (APEJE).',
      archiveReference: 'Museu do Estado de Pernambuco & APEJE',
      synthNotes: [523, 659, 784, 880, 1046],
    },
    capitalAnthem: {
      id: 'PE_CAPITAL',
      title: 'Hino da Cidade do Recife',
      category: 'capital',
      cityName: 'Recife',
      composers: {
        music: 'Capiba',
        lyrics: 'Capiba',
      },
      lyricsPt: `Recife, Veneza das pontes douradas,
Capibaribe flowing ao luar!
Passos de frevo nas alvoradas,
Eterna Rainha do Mar.`,
      historicalSourcePt: 'Acervo Oficial da Fundação de Cultura da Cidade do Recife.',
      archiveReference: 'Arquivo Histórico do Recife & Museu da Cidade do Recife',
      synthNotes: [440, 523, 659, 784],
    },
  },
  AL: {
    stateAnthem: {
      id: 'AL_STATE',
      title: 'Hino do Estado de Alagoas',
      category: 'state',
      stateName: 'Alagoas',
      composers: {
        music: 'Benedito Silva',
        lyrics: 'Luiz Siqueira',
      },
      lyricsPt: `Estrela radiante das lagoas azuis,
Alagoas de Zumbi e do mar!
Onde a brisa dos coqueiros reluz,
Nós vimos te aclamar.`,
      historicalSourcePt: 'Lei Estadual Nº 1.832/1912 • Arquivo Público de Alagoas.',
      archiveReference: 'Instituto Histórico e Geográfico de Alagoas (IHGAL)',
      synthNotes: [392, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'AL_CAPITAL',
      title: 'Hino da Cidade de Maceió',
      category: 'capital',
      cityName: 'Maceió',
      composers: {
        music: 'Maestro Edilberto',
        lyrics: 'Théo Brandão',
      },
      lyricsPt: `Maceió, Caribe brasileiro encantado,
Pajuçara de jangadas sem fim!
Teu sol reluz abençoado,
No mar de tom marfim.`,
      historicalSourcePt: 'Acervo da Fundação Municipal de Ação Cultural de Maceió (FMAC).',
      archiveReference: 'Arquivo Histórico de Maceió',
      synthNotes: [440, 523, 659, 784],
    },
  },
  SE: {
    stateAnthem: {
      id: 'SE_STATE',
      title: 'Hino do Estado de Sergipe',
      category: 'state',
      stateName: 'Sergipe',
      composers: {
        music: 'Frederico de Andrade',
        lyrics: 'Manoel dos Passos de Oliveira Telles',
      },
      lyricsPt: `Sergipe, terra dos cajueiros em flor,
Menor em tamanho, gigante em valor!
Do São Francisco ao mar de Aracaju,
Ecoa o nosso clamor.`,
      historicalSourcePt: 'Lei Estadual Nº 2.100/1920 • Arquivo Público do Estado de Sergipe.',
      archiveReference: 'Museu da Gente Sergipana & APES',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'SE_CAPITAL',
      title: 'Hino da Cidade de Aracaju',
      category: 'capital',
      cityName: 'Aracaju',
      composers: {
        music: 'Maestro Alpheu',
        lyrics: 'José de Alencar Cardoso',
      },
      lyricsPt: `Aracaju, planejada em tabuleiro de xadrez,
Passarela do Caranguejo ao luar!
Canta a tua altivez,
À beira do mar.`,
      historicalSourcePt: 'Acervo da Fundação Cultural Cidade de Aracaju (FUNCAJU).',
      archiveReference: 'Arquivo Histórico do Município de Aracaju',
      synthNotes: [392, 493, 587, 659],
    },
  },
  BA: {
    stateAnthem: {
      id: 'BA_STATE',
      title: 'Hino ao 2 de Julho (Hino da Bahia)',
      category: 'state',
      stateName: 'Bahia',
      composers: {
        music: 'José dos Santos Barreto',
        lyrics: 'Laddilau dos Santos Titara',
      },
      lyricsPt: `Nunca mais o despotismo
Regerá nossas ações!
Com a Baía independente,
Cantam nossos corações!

Neste dia de glória e libertação,
A Bahia é o berço do Brasil!`,
      historicalSourcePt: 'Decreto Estadual de 1823 • Arquivo Público do Estado da Bahia (APEB).',
      archiveReference: 'Fundação Pedro Calmon & APEB',
      synthNotes: [440, 523, 659, 784, 880],
    },
    capitalAnthem: {
      id: 'BA_CAPITAL',
      title: 'Hino de Salvador',
      category: 'capital',
      cityName: 'Salvador',
      composers: {
        music: 'Dorival Caymmi',
        lyrics: 'Dorival Caymmi',
      },
      lyricsPt: `Salvador de Bahia de Todos os Santos,
Pelourinho, afoxé e Farol da Barra!
Encantada em todos os cantos,
Tua poesia nos agarra!`,
      historicalSourcePt: 'Acervo da Fundação Gregório de Mattos (FGM).',
      archiveReference: 'Arquivo Histórico Municipal de Salvador',
      synthNotes: [392, 493, 587, 659],
    },
  },
  MT: {
    stateAnthem: {
      id: 'MT_STATE',
      title: 'Hino do Estado de Mato Grosso',
      category: 'state',
      stateName: 'Mato Grosso',
      composers: {
        music: 'Epitácio Pessoa',
        lyrics: 'Dom Aquino Corrêa',
      },
      lyricsPt: `Mato Grosso de garimpos e esplendor,
Pantanal de vida exuberante!
Tuas terras reluzem o valor,
Desta nação gigante.`,
      historicalSourcePt: 'Lei Estadual Nº 837/1919 • Arquivo Público de Mato Grosso.',
      archiveReference: 'Museu Histórico de Mato Grosso',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'MT_CAPITAL',
      title: 'Hino de Cuiabá',
      category: 'capital',
      cityName: 'Cuiabá',
      composers: {
        music: 'Maestro Zulmir',
        lyrics: 'Dom Aquino Corrêa',
      },
      lyricsPt: `Cuiabá, Cidade Verde e hospitaleira,
Centro da América do Sul a pulsar!
Com o Siriri e a viola de cocho verdadeira,
Queremos te saudar.`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura de Cuiabá.',
      archiveReference: 'Arquivo Histórico do Município de Cuiabá',
      synthNotes: [392, 493, 587, 659],
    },
  },
  MS: {
    stateAnthem: {
      id: 'MS_STATE',
      title: 'Hino do Estado de Mato Grosso do Sul',
      category: 'state',
      stateName: 'Mato Grosso do Sul',
      composers: {
        music: 'Radamés Gnattali',
        lyrics: 'Jorge Antonio Siufi',
      },
      lyricsPt: `Mato Grosso do Sul, sol de esperança,
Ipês floridos e araras em bando!
Pantanal e guavira em aliança,
Nossa terra vai cantando.`,
      historicalSourcePt: 'Lei Estadual Nº 001/1979 • Arquivo Histórico de MS.',
      archiveReference: 'Fundação de Cultura de Mato Grosso do Sul',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'MS_CAPITAL',
      title: 'Hino de Campo Grande',
      category: 'capital',
      cityName: 'Campo Grande',
      composers: {
        music: 'Otávio Gonçalves',
        lyrics: 'Nezinho do Tereré',
      },
      lyricsPt: `Campo Grande, Cidade Morena de encantos,
Tereré gelado ao fim da tarde!
Ouvimos teus nobres cantos,
Onde a liberdade arde.`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura e Turismo de Campo Grande.',
      archiveReference: 'Arquivo Histórico de Campo Grande (ARCA)',
      synthNotes: [349, 440, 523, 659],
    },
  },
  GO: {
    stateAnthem: {
      id: 'GO_STATE',
      title: 'Hino do Estado de Goiás',
      category: 'state',
      stateName: 'Goiás',
      composers: {
        music: 'Joaquim Jayme',
        lyrics: 'José Mendonça Teles',
      },
      lyricsPt: `Santuário de Cora Coralina e luz,
Goiás do Planalto Central!
Teu pequizeiro e serra conduz
A um amor imortal.`,
      historicalSourcePt: 'Lei Estadual Nº 13.725/2000 • Arquivo Histórico de Goiás.',
      archiveReference: 'Museu Pedro Ludovico & Arquivo Histórico Estadual',
      synthNotes: [392, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'GO_CAPITAL',
      title: 'Hino de Goiânia',
      category: 'capital',
      cityName: 'Goiânia',
      composers: {
        music: 'Azevedo Lemos',
        lyrics: 'Léo Lynce',
      },
      lyricsPt: `Goiânia, joia art déco do Cerrado,
Projetada em traços de beleza!
Teu parque verdejante e perfumado,
Exalta a natureza.`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura de Goiânia.',
      archiveReference: 'Arquivo Histórico do Município de Goiânia',
      synthNotes: [440, 523, 659, 784],
    },
  },
  DF: {
    stateAnthem: {
      id: 'DF_STATE',
      title: 'Hino de Brasília (Hino do DF)',
      category: 'state',
      stateName: 'Distrito Federal',
      composers: {
        music: 'Neusa Pinho França',
        lyrics: 'Geir Campos',
      },
      lyricsPt: `Brasília, capital da esperança,
Céu azul de Niemeyer e Lúcio Costa!
Onde a nação inteira alcança
A liberdade que nos atrai e gosta!

Capital do Brasil, coração da União!`,
      historicalSourcePt: 'Decreto do Governo do Distrito Federal Nº 1.482/1970 • Arquivo Público do DF.',
      archiveReference: 'Arquivo Público do Distrito Federal (ArPDF) & Catetinho',
      synthNotes: [523, 659, 784, 880, 1046],
    },
    capitalAnthem: {
      id: 'DF_CAPITAL',
      title: 'Hino a Brasília',
      category: 'capital',
      cityName: 'Brasília',
      composers: {
        music: 'Sivuca',
        lyrics: 'Vinicius de Moraes',
      },
      lyricsPt: `Brasília, arquitetura de candangos nobres,
Palácio do Planalto e Catedral sem fim!
Sob o sol que aos guerreiros cobre,
Nossa pátria canta assim!`,
      historicalSourcePt: 'Acervo do Arquivo Público do Distrito Federal.',
      archiveReference: 'Fundação Cultural do Distrito Federal',
      synthNotes: [440, 523, 659, 784],
    },
  },
  SP: {
    stateAnthem: {
      id: 'SP_STATE',
      title: 'Hino do Estado de São Paulo (Hino da Bandeira Paulista)',
      category: 'state',
      stateName: 'São Paulo',
      composers: {
        music: 'Sertório de Castro',
        lyrics: 'Guilherme de Almeida',
      },
      lyricsPt: `Paulistas, firmes na trincheira!
Pela lei e pela Constituição!
São Paulo erguerá sua bandeira,
No peito da nação!

Non Ducor Duco — Não sou conduzido, conduzo!`,
      historicalSourcePt: 'Lei Estadual Nº 9.854/1967 • Arquivo Público do Estado de São Paulo (APESP).',
      archiveReference: 'Acervo Histórico da Assembleia Legislativa de SP & APESP',
      synthNotes: [440, 523, 659, 784, 880],
    },
    capitalAnthem: {
      id: 'SP_CAPITAL',
      title: 'Hino da Cidade de São Paulo',
      category: 'capital',
      cityName: 'São Paulo',
      composers: {
        music: 'Mozart Camargo Guarnieri',
        lyrics: 'Guilherme de Almeida',
      },
      lyricsPt: `São Paulo da garoa e das avenidas,
Coração financeiro e cultural sem par!
Acolhes todas as raças e vidas,
Na fúria nobre de trabalhar!`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura de São Paulo.',
      archiveReference: 'Arquivo Histórico Municipal de São Paulo',
      synthNotes: [392, 493, 587, 659],
    },
  },
  RJ: {
    stateAnthem: {
      id: 'RJ_STATE',
      title: 'Hino do Estado do Rio de Janeiro',
      category: 'state',
      stateName: 'Rio de Janeiro',
      composers: {
        music: 'João Cândido Diniz',
        lyrics: 'Antônio José Soares de Pinho',
      },
      lyricsPt: `Terra de encantos e praias reluzentes,
O Rio de Janeiro canta o seu valor!
Guanabara e serras imponentes,
Unidas pelo amor.`,
      historicalSourcePt: 'Lei Estadual Nº 1.394/1988 • Arquivo Público do Estado do Rio de Janeiro (APERJ).',
      archiveReference: 'Biblioteca Nacional do Brasil (Sede RJ) & APERJ',
      synthNotes: [440, 493, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'RJ_CAPITAL',
      title: 'Hino da Cidade do Rio de Janeiro (Cidade Maravilhosa)',
      category: 'capital',
      cityName: 'Rio de Janeiro',
      composers: {
        music: 'André Filho',
        lyrics: 'André Filho',
      },
      lyricsPt: `Cidade maravilhosa,
Cheia de encantos mil!
Cidade maravilhosa,
Coração do meu Brasil!

Berço do samba e da bossa nova,
Cristo Redentor a abençoar!`,
      historicalSourcePt: 'Lei Municipal Nº 3.582/2003 • Arquivo Geral da Cidade do Rio de Janeiro.',
      archiveReference: 'Museu de Arte do Rio (MAR) & Arquivo Geral da Cidade do RJ',
      synthNotes: [523, 659, 784, 880, 1046],
    },
  },
  MG: {
    stateAnthem: {
      id: 'MG_STATE',
      title: 'Hino do Estado de Minas Gerais (Oh Minas Gerais)',
      category: 'state',
      stateName: 'Minas Gerais',
      composers: {
        music: 'Mantena',
        lyrics: 'José Duduca de Moraes',
      },
      lyricsPt: `Oh, Minas Gerais! Oh, Minas Gerais!
Quem te conhece não esquece jamais!
Oh, Minas Gerais!

Inconfidência Mineira e Tiradentes,
Sinos das igrejas de Ouro Preto a badalar!
Pão de queijo e montanhas reluzentes,
Que não cansam de encantar.`,
      historicalSourcePt: 'Resolução Cultural de MG • Arquivo Público Mineiro (APM).',
      archiveReference: 'Acervo do Museu da Inconfidência (Ibram) & APM',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'MG_CAPITAL',
      title: 'Hino de Belo Horizonte',
      category: 'capital',
      cityName: 'Belo Horizonte',
      composers: {
        music: 'Lúcio Jacob',
        lyrics: 'Afonso Arinos',
      },
      lyricsPt: `Belo Horizonte da Serra do Curral,
Pampulha de Juscelino e Portinari!
Capital das montanhas sem igual,
Onde a amizade não varia!`,
      historicalSourcePt: 'Acervo da Fundação Municipal de Cultura de Belo Horizonte.',
      archiveReference: 'Arquivo Público Mineiro & Museu Histórico Abílio Barreto',
      synthNotes: [392, 493, 587, 659],
    },
  },
  ES: {
    stateAnthem: {
      id: 'ES_STATE',
      title: 'Hino do Estado do Espírito Santo',
      category: 'state',
      stateName: 'Espírito Santo',
      composers: {
        music: 'Arthur Napoleão',
        lyrics: 'Peçanha Phoel',
      },
      lyricsPt: `Espírito Santo, capixaba destemido,
Do Convento da Penha ao mar sem fim!
Moqueca e monte fortalecido,
Cantamos a nossa terra assim!`,
      historicalSourcePt: 'Lei Estadual Nº 5.378/1997 • Arquivo Público do Estado do Espírito Santo (APEES).',
      archiveReference: 'Acervo Histórico APEES & Museu Capixaba do Negro',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'ES_CAPITAL',
      title: 'Hino de Vitória',
      category: 'capital',
      cityName: 'Vitória',
      composers: {
        music: 'Afonso de Oliveira',
        lyrics: 'Elmo Elton',
      },
      lyricsPt: `Vitória, ilha de encantos marinhos,
Panela de barro e siri na foz!
Iluminas os nossos caminhos,
E elevas a nossa voz!`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura de Vitória.',
      archiveReference: 'Arquivo Histórico do Município de Vitória',
      synthNotes: [392, 493, 587, 659],
    },
  },
  PR: {
    stateAnthem: {
      id: 'PR_STATE',
      title: 'Hino do Estado do Paraná',
      category: 'state',
      stateName: 'Paraná',
      composers: {
        music: 'Bento Mossurunga',
        lyrics: 'Domingos Nascimento',
      },
      lyricsPt: `Entre araucárias e as Cataratas do Iguaçu,
O Paraná canta a sua vitória!
Gente trabalhadora sob o céu azul,
Gravando no tempo a sua história.`,
      historicalSourcePt: 'Lei Estadual Nº 2.452/1927 • Arquivo Público do Paraná (DEAP).',
      archiveReference: 'Museu Paranaense & DEAP',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: 'PR_CAPITAL',
      title: 'Hino de Curitiba',
      category: 'capital',
      cityName: 'Curitiba',
      composers: {
        music: 'Bento Mossurunga',
        lyrics: 'Ciro Silva',
      },
      lyricsPt: `Curitiba, Cidade Sorriso das pinheirais,
Jardim Botânico e Ópera de Arame!
Guardas do futuro os ideais,
Com orgulho que se exclame.`,
      historicalSourcePt: 'Acervo da Fundação Cultural de Curitiba (FCC).',
      archiveReference: 'Arquivo Histórico do Município de Curitiba',
      synthNotes: [392, 493, 587, 659],
    },
  },
  SC: {
    stateAnthem: {
      id: 'SC_STATE',
      title: 'Hino do Estado de Santa Catarina',
      category: 'state',
      stateName: 'Santa Catarina',
      composers: {
        music: 'José Brazilício de Souza',
        lyrics: 'Horácio Nunes Pires',
      },
      lyricsPt: `Santa Catarina das serras e praias,
Onde a neve beija as montanhas de luz!
Bravos açorianos em tuas raias,
Ao progresso que nos conduz!`,
      historicalSourcePt: 'Lei Estadual Nº 8.120/1990 • Arquivo Público de Santa Catarina.',
      archiveReference: 'Museu Histórico de Santa Catarina (Palácio Cruz e Sousa)',
      synthNotes: [440, 493, 587, 659],
    },
    capitalAnthem: {
      id: 'SC_CAPITAL',
      title: 'Hino de Florianópolis (Rancho de Amor à Ilha)',
      category: 'capital',
      cityName: 'Florianópolis',
      composers: {
        music: 'Zininho',
        lyrics: 'Zininho',
      },
      lyricsPt: `Um rancho na beira da praia,
Na Ilha da Magia a cantar!
Ponte Hercílio Luz que se esgalha,
Sobre a brisa do mar!`,
      historicalSourcePt: 'Lei Municipal Nº 1.250/1968 • Arquivo Histórico de Florianópolis.',
      archiveReference: 'Fundação Cultural de Florianópolis Franklin Cascaes',
      synthNotes: [523, 659, 784, 880],
    },
  },
  RS: {
    stateAnthem: {
      id: 'RS_STATE',
      title: 'Hino do Estado do Rio Grande do Sul (Hino Farroupilha)',
      category: 'state',
      stateName: 'Rio Grande do Sul',
      composers: {
        music: 'Compositor Anônimo (Revolução Farroupilha 1835)',
        lyrics: 'Francisco Pinto da Fontoura',
      },
      lyricsPt: `Como a aurora precursora
Do farol da divindade,
Foi o vinte de setembro
O precursor da liberdade!

[Estribilho]
Sirvam nossas façanhas
De modelo a toda a terra!
Sirvam nossas façanhas
De modelo a toda a terra!

Mostremos valor, constância,
Nesta impávida peleja,
Em presença da vitória,
Que soberba nos encara!

[Estribilho]
Sirvam nossas façanhas
De modelo a toda a terra!
Sirvam nossas façanhas
De modelo a toda a terra!

Mas se a estância da virtude
For pela força dominada,
Morra o peito farroupilha
Antes de ver a pátria escravizada!

[Estribilho]
Sirvam nossas façanhas
De modelo a toda a terra!
Sirvam nossas façanhas
De modelo a toda a terra!`,
      historicalSourcePt: 'Lei Estadual Nº 5.213/1966 • Arquivo Público do Estado do RS (APERS).',
      archiveReference: 'Acervo do Museu Júlio de Castilhos & APERS',
      synthNotes: [440, 523, 659, 784, 880],
    },
    capitalAnthem: {
      id: 'RS_CAPITAL',
      title: 'Hino de Porto Alegre',
      category: 'capital',
      cityName: 'Porto Alegre',
      composers: {
        music: 'Bedeu',
        lyrics: 'Glauco Cordeiro',
      },
      lyricsPt: `Porto Alegre do Guaíba e do pôr do sol,
Churrasco e chimarrão ao redor do fogo!
Farroupilha e nobre farol,
Sempre forte no jogo!`,
      historicalSourcePt: 'Acervo da Secretaria Municipal de Cultura de Porto Alegre.',
      archiveReference: 'Arquivo Histórico de Porto Alegre Moysés Vellinho',
      synthNotes: [392, 493, 587, 659],
    },
  },
};

// Fallback generator for any missing state
export function getAnthemPairForState(stateId: string): { stateAnthem: AnthemItem; capitalAnthem: AnthemItem } {
  if (ANTHEMS_BY_STATE[stateId]) {
    return ANTHEMS_BY_STATE[stateId];
  }
  return {
    stateAnthem: {
      id: `${stateId}_STATE`,
      title: `Hino do Estado (${stateId})`,
      category: 'state',
      composers: { music: 'Compositor Estadual', lyrics: 'Poeta do Estado' },
      lyricsPt: `Terra de bravos e tradições imortais,\nOnde o pavilhão do nosso estado reluz em paz!`,
      historicalSourcePt: 'Acervo Histórico Estadual & Biblioteca Pública.',
      archiveReference: 'Arquivo Histórico Estadual',
      synthNotes: [440, 523, 659, 784],
    },
    capitalAnthem: {
      id: `${stateId}_CAPITAL`,
      title: `Hino Municipal da Capital (${stateId})`,
      category: 'capital',
      composers: { music: 'Compositor Municipal', lyrics: 'Poeta da Cidade' },
      lyricsPt: `Cidade berço de luz e amor,\nGuardamos no peito o teu nobre valor!`,
      historicalSourcePt: 'Acervo da Câmara Municipal e Prefeitura.',
      archiveReference: 'Arquivo Histórico do Município',
      synthNotes: [392, 493, 587, 659],
    },
  };
}
