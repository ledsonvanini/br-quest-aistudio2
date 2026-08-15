export interface ArchiveReference {
  title: string;
  institution: string;
  url: string;
  description: string;
}

export interface HistoricalArchiveData {
  archiveName: string;
  imageUrl?: string;
  imageCaption?: string;
  period?: string;
  curatorNotes?: string;
}

export interface CulturalItem {
  id: string;
  stateId: string;
  title: string;
  category: 'culinaria' | 'historia' | 'fauna_flora' | 'tradicoes' | 'personagens' | 'geografia';
  categoryLabel: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  historicalContext: string;
  culturalImpact: string;
  keyTakeaways: string[];
  curiosity: string;
  guardianQuote: string;
  rarity: 'comum' | 'raro' | 'epico' | 'sagrado';
  archive: HistoricalArchiveData;
  references: ArchiveReference[];
}

export const CULTURAL_INVENTORY_BY_STATE: Record<string, CulturalItem[]> = {
  RS: [
    {
      id: 'rs_chimarrao',
      stateId: 'RS',
      title: 'Cuia & Chimarrão Sagrado',
      category: 'culinaria',
      categoryLabel: 'Culinária & Hospitalidade',
      icon: '🧉',
      shortDesc: 'A bebida símbolo da união, fraternidade e hospitalidade sul-rio-grandense.',
      fullDesc:
        'Preparado na cuia de porongo (Lagenaria siceraria) com erva-mate pura (Ilex paraguariensis) finamente moída e água quente a cerca de 70°C a 75°C (sem nunca deixar ferver para não queimar a erva), o chimarrão é degustado através da bomba metálica provida de filtro milenar na base. É muito mais que uma infusão: constitui um ritual cívico e social sagrado nos galpões e lares, onde a cuia circula de mão em mão em sentido horário como demonstração de respeito mútuo, franqueza e acolhimento.',
      historicalContext:
        'O consumo da erva-mate (denominada Caá em Guarani) foi aprendido pelos padres jesuítas e colonizadores espanhóis e portugueses diretamente com os povos indígenas Guaranis e Kaingangs que habitavam as bacias dos rios Paraná e Uruguai no século XVI. Inicialmente combatido pela Inquisição como "erva do demônio" devido ao seu vigor estimulante, o mate logo se tornou a maior força econômica da Província de São Pedro do Rio Grande e o principal produto de exportação das Missões Jesuíticas.',
      culturalImpact:
        'Instituído como Bebida Símbolo do Rio Grande do Sul pela Lei Estadual nº 11.929 de 2003, o chimarrão representa a quintessência do espírito comunitário pampeano. A roda de chimarrão dissolve hierarquias sociais: ricos e humildes compartilham a mesma cuia e a mesma infusão, fortalecendo laços de confiança e diálogo sincero.',
      keyTakeaways: [
        'Tradição herdada diretamente dos povos indígenas Guaranis e Kaingangs.',
        'A água deve permanecer a cerca de 70°C para preservar polifenóis e aroma sem amargar.',
        'Reconhecido oficialmente por Lei Estadual como Bebida Símbolo e Patrimônio Cultural.',
      ],
      curiosity:
        'No código de etiqueta tradicionalista, dizer "obrigado" ao devolver a cuia significa que você já bebeu o suficiente e está satisfeito, saindo da rodada.',
      guardianQuote:
        '“O chimarrão não é apenas bebida, tchê: é o abraço caloroso que une ricos e pobres ao redor do fogo de chão, espantando o frio do minuano!”',
      rarity: 'sagrado',
      archive: {
        archiveName: 'Acervo Digital IPHAN / Instituto Gaúcho de Tradição e Folclore (IGTF)',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Roda tradicionalista de mate amargo servido em cuia de porongo natural com bocal de prata trabalhada.',
        period: 'Século XVI até a Contemporaneidade',
        curatorNotes: 'Patrimônio Imaterial Cultural do Sul do Brasil.',
      },
      references: [
        {
          title: 'IPHAN - Dossiê do Patrimônio Cultural Imaterial dos Saberes da Erva-Mate',
          institution: 'Instituto do Patrimônio Histórico e Artístico Nacional',
          url: 'http://portal.iphan.gov.br/pagina/detalhes/848',
          description: 'Documentação histórica sobre o cultivo, moagem e rito social do mate no sul do Brasil.',
        },
        {
          title: 'Lei Estadual do RS nº 11.929/2003 - Bebida Símbolo do Estado',
          institution: 'Assembleia Legislativa do Estado do Rio Grande do Sul',
          url: 'https://www.al.rs.gov.br/legis/',
          description: 'Texto de lei que oficializa o Chimarrão como patrimônio oficial e bebida símbolo estadual.',
        },
        {
          title: 'Acervo Digital da Fundação Biblioteca Nacional - O Mate e os Costumes Sulinos',
          institution: 'Biblioteca Nacional do Brasil',
          url: 'https://bndigital.bn.gov.br/',
          description: 'Relatos e gravuras históricas de viajantes do século XIX sobre a etiqueta do mate.',
        },
      ],
    },
    {
      id: 'rs_lenco_farroupilha',
      stateId: 'RS',
      title: 'Lenço Farroupilha Vermelho & Branco',
      category: 'historia',
      categoryLabel: 'História & Guerra dos Farrapos',
      icon: '🧣',
      shortDesc: 'Emblema sagrado da Revolução Farroupilha (1835–1845) e distinção cívico-militar.',
      fullDesc:
        'Durante o decênio da Revolução Farroupilha — a mais duradoura guerra civil da história do Brasil (1835–1845) —, o lenço atado ao pescoço com nós característicos servia de uniforme e distintivo visual tático entre combatentes. O lenço vermelho identificava os revolucionários republicanos farroupilhas (mais tarde chamados de Maragatos na Revolução Federalista de 1893), enquanto o lenço branco era adotado pelos legalistas imperiais defensores do Império do Brasil (conhecidos como Chimangos).',
      historicalContext:
        'A revolta eclodiu em 20 de setembro de 1835, liderada por Bento Gonçalves da Silva, contra a excessiva taxação do charque e couro gaúchos em benefício do produto importado do Prata. Os farrapos proclamaram a República Rio-Grandense em 1836 (na Câmara de Piratini) e a República Juliana em 1839 (em Laguna/SC), sustentando combates de cavalaria por dez anos até a celebração da honrosa Paz de Ponche Verde em 1845.',
      culturalImpact:
        'O lenço de seda vermelho tornou-se peça basilar da Pilcha Gaúcha e elemento central da identidade do tradicionalismo. Ele representa o compromisso cívico com os ideais republicanos inscritos no brasão estadual: "Liberdade, Igualdade, Humanidade".',
      keyTakeaways: [
        'Diferenciava facções no campo de batalha: Vermelho (Republicanos) vs Branco (Legalistas).',
        'Símbolo da Proclamação da República Rio-Grandense na histórica cidade de Piratini (1836).',
        'Peça obrigatória no traje de gala da pilcha tradicionalista regulamentada por lei.',
      ],
      curiosity:
        'O tipo de nó atado ao lenço (nó de correr, nó de quatro cantos, nó de namorado ou nó maçônico) indicava a região de origem, patente ou status social do cavaleiro.',
      guardianQuote:
        '“Esse lenço rubro é a honra do gaúcho! Carrega a coragem dos heróis que sonharam com uma terra livre e justa para todos os seus filhos!”',
      rarity: 'sagrado',
      archive: {
        archiveName: 'Acervo do Museu Júlio de Castilhos / Arquivo Histórico do RS',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Indumentária farrapa preservada em acervo museológico com lenço de seda carmesim e insígnia bordada.',
        period: '1835–1845 (Revolução Farroupilha)',
        curatorNotes: 'Exemplar de farda republicana farroupilha do século XIX.',
      },
      references: [
        {
          title: 'Museu Júlio de Castilhos - Acervo da Revolução Farroupilha',
          institution: 'Secretaria de Estado da Cultura do RS (SEDAC)',
          url: 'https://cultura.rs.gov.br/museu-julio-de-castilhos',
          description: 'Documentos originais, armamentos e indumentárias dos generais farroupilhas.',
        },
        {
          title: 'Instituto Histórico e Geográfico do Rio Grande do Sul (IHGRS)',
          institution: 'IHGRS - Arquivos Republicano e Provincial',
          url: 'http://www.ihgrs.org.br/',
          description: 'Pesquisas acadêmicas sobre as causas socioeconômicas da Guerra dos Farrapos.',
        },
        {
          title: 'Biblioteca Digital da Assembleia Legislativa do RS - Tratado de Ponche Verde',
          institution: 'Assembleia Legislativa do RS',
          url: 'https://ww3.al.rs.gov.br/biblioteca/',
          description: 'A íntegra dos termos de pacificação que integraram as forças gaúchas ao Exército Brasileiro.',
        },
      ],
    },
    {
      id: 'rs_churrasco_fogo_chao',
      stateId: 'RS',
      title: 'Costela no Fogo de Chão',
      category: 'culinaria',
      categoryLabel: 'Culinária & Tradição',
      icon: '🥩',
      shortDesc: 'A arte campeira de assar carne em espetos cravados no solo em braseiro lento.',
      fullDesc:
        'O tradicional churrasco gaúcho em fogo de chão é o ápice gastronômico da lida campeira. Peças nobres e inteiras de costela bovina são fixadas em espetos rústicos de madeira de angico ou ferro, fincados na terra ao redor de uma vala com toras incandescentes de lenha de lei. O calor indireto e a fumaça de madeiras nobres assam a carne vagarosamente por 6 a 8 horas, preservando a maciez e suculência interna.',
      historicalContext:
        'Nas vastas extensões dos pampas do século XVIII, o gado chimarrão (selvagem) pastava livremente. Os tropeiros e vaqueiros abatiam os animais para retirar o couro e consumiam as melhores carnes assando-as em espetos fincados no solo, temperadas unicamente com sal grosso ou salmoura, que eram os únicos conservantes disponíveis nas longas travessias.',
      culturalImpact:
        'Elevado a Patrimônio Cultural Imaterial pelo Estado do Rio Grande do Sul pela Lei Estadual nº 11.929/2003, o churrasco representa o momento supremo da reunião familiar e comunitária nos Centros de Tradições Gaúchas (CTGs) espalhados pelo Brasil e pelo mundo.',
      keyTakeaways: [
        'Assado em calor brando e indireto durante 6 a 8 horas com lenha aromática.',
        'Temperado exclusivamente com sal grosso, realçando o sabor autêntico da carne pampeana.',
        'Prato Oficial e Patrimônio Cultural Imaterial do Estado do RS por lei.',
      ],
      curiosity:
        'Os campeiros medem a distância correta do espeto ao fogo colocando a mão na frente da carne: se conseguirem suportar o calor por 5 segundos antes de retirar a mão, a temperatura está perfeita para o assado lento.',
      guardianQuote:
        '“Costela boa pede paciência, braseiro manso e lenha cheirosa. Aqui não se tem pressa, pois o tempo é o melhor tempero da nossa terra!”',
      rarity: 'epico',
      archive: {
        archiveName: 'Acervo Cultural do Tradicionalismo Pampeano / Embrapa Pecuária Sul',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Espetos de costela bovina fincados em círculo ao redor de toras de braseiro de madeira nobre.',
        period: 'Século XVIII aos dias atuais',
        curatorNotes: 'Técnica gastronômica tradicionalista de cocção a lenha.',
      },
      references: [
        {
          title: 'Embrapa Pecuária Sul - História da Pecuária e Gastronomia do Pampa',
          institution: 'Empresa Brasileira de Pesquisa Agropecuária (Embrapa)',
          url: 'https://www.embrapa.br/pecuaria-sul',
          description: 'Estudos técnicos e históricos sobre os rebanhos do bioma Pampa e a culinária do fogo.',
        },
        {
          title: 'Movimento Tradicionalista Gaúcho (MTG) - Normas do Churrasco Campeiro',
          institution: 'MTG Rio Grande do Sul',
          url: 'https://www.mtg.org.br/',
          description: 'Diretrizes culturais sobre a preparação de acampamentos e festividades campeiras.',
        },
      ],
    },
    {
      id: 'rs_missoes_jesuiticas',
      stateId: 'RS',
      title: 'Ruínas de São Miguel das Missões',
      category: 'geografia',
      categoryLabel: 'Geografia & Patrimônio Mundial',
      icon: '🏛️',
      shortDesc: 'Monumento monumental declarado Patrimônio Mundial pela UNESCO em 1983.',
      fullDesc:
        'No noroeste do Rio Grande do Sul erguem-se as colunas monumentais de arenito róseo de São Miguel Arcanjo, a principal das reduções jesuítico-guaranis dos Sete Povos das Missões. Entre os séculos XVII e XVIII, os padres da Companhia de Jesus e os indígenas Guaranis ergueram uma civilização teocrática singular que uniu arte barroca missioneira, polifonia musical, fundição de sinos de bronze, tipografia em prensa e agricultura comunal solidária.',
      historicalContext:
        'O Tratado de Madrid (1750) determinou a entrega dos Sete Povos a Portugal em troca da Colônia do Sacramento. A recusa dos indígenas e padres em abandonar suas cidades, igrejas e lavouras culminou na trágica Guerra Guaranítica (1753–1756), onde tombou o herói guarani Sepé Tiaraju. Em 1768, a expulsão dos jesuítas pelo Marquês de Pombal levou ao declínio das reduções.',
      culturalImpact:
        'Inscrito na Lista do Patrimônio Mundial da Humanidade pela UNESCO em 1983, o Parque Histórico Nacional de São Miguel é um dos mais impressionantes sítios arqueológicos das Américas, acolhendo o espetáculo noturno "Som e Luz" que reconta a epopeia dos povos da floresta.',
      keyTakeaways: [
        'Declarado Patrimônio Cultural da Humanidade pela UNESCO em 1983.',
        'Expressão suprema do Barroco Missioneiro com esculturas em arenito e madeira policromada.',
        'Sede da célebre resistência de Sepé Tiaraju em defesa do território guarani.',
      ],
      curiosity:
        'A igreja de São Miguel foi projetada pelo arquiteto jesuíta italiano Giovanni Battista Primoli inspirada na Igreja de Sant’Ignazio de Roma e levou mais de 10 anos para ser construída com milhares de blocos de arenito talhados à mão.',
      guardianQuote:
        '“Nessas pedras veneráveis ainda ecoa a prece e a arte de um povo que construiu a utopia de uma terra sem males no coração da América do Sul!”',
      rarity: 'sagrado',
      archive: {
        archiveName: 'UNESCO World Heritage Centre / IPHAN 12ª Superintendência Regional',
        imageUrl: 'https://images.unsplash.com/photo-1590483256037-14282361cf57?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Fachada frontal da Catedral de São Miguel das Missões esculpida em arenito róseo missioneiro.',
        period: '1687–1756 (Período das Reduções Jesuíticas)',
        curatorNotes: 'Sítio Arqueológico Tombado pela UNESCO (Critério IV).',
      },
      references: [
        {
          title: 'UNESCO World Heritage List - Jesuit Missions of the Guaranis: San Miguel',
          institution: 'United Nations Educational, Scientific and Cultural Organization',
          url: 'https://whc.unesco.org/en/list/275/',
          description: 'Ficha técnica internacional e critérios de tombamento como patrimônio da humanidade.',
        },
        {
          title: 'IPHAN - Parque Histórico Nacional das Missões',
          institution: 'Instituto do Patrimônio Histórico e Artístico Nacional',
          url: 'http://portal.iphan.gov.br/pagina/detalhes/248',
          description: 'Plano de conservação arqueológica e acervo do Museu das Missões projetado por Lúcio Costa.',
        },
        {
          title: 'Arquivo Nacional - Documentos da Guerra Guaranítica e Tratado de Madrid',
          institution: 'Arquivo Nacional do Brasil',
          url: 'https://www.gov.br/arquivonacional/pt-br',
          description: 'Mapas e tratados diplomáticos do século XVIII sobre a demarcação das fronteiras sulinas.',
        },
      ],
    },
    {
      id: 'rs_sepe_tiaraju',
      stateId: 'RS',
      title: 'O Brado de Sepé Tiaraju',
      category: 'personagens',
      categoryLabel: 'Guerra Guaranítica & Raízes',
      icon: '🛡️',
      shortDesc: '“Esta terra tem dono!” — Líder guerreiro indígena inscrito no Livro dos Heróis da Pátria.',
      fullDesc:
        'José Sepé Tiaraju (1723–1756) foi alferes e capitão-geral indígena do povoado de São Miguel das Missões. Quando as coroas de Portugal e Espanha ordenaram a remoção forçada de mais de 30 mil guaranis para a margem ocidental do rio Uruguai, Sepé liderou a resistência guerreira com o brado imortal em guarani: "Co Yvy Oguerekó Iára!" (Esta terra tem dono!). Tombou heroicamente em combate em 7 de fevereiro de 1756, nas coxilhas de Caiboaté.',
      historicalContext:
        'A Guerra Guaranítica expôs a crueldade dos impérios coloniais que tentavam repartir territórios habitados por comunidades autossuficientes. Sepé tornou-se símbolo supremo da defesa da soberania territorial, dos direitos indígenas e da dignidade humana no continente sul-americano.',
      culturalImpact:
        'Pela Lei Federal nº 12.032 de 2009, Sepé Tiaraju foi solenemente inscrito no Livro dos Heróis da Pátria (o "Livro de Aço" do Panteão da Pátria em Brasília), sendo reverenciado no folclore popular como "São Sepé", com a lenda do lunar luminoso em sua fronte.',
      keyTakeaways: [
        'Comandante guarani na Guerra Guaranítica contra as forças conjuntas hispano-portuguesas.',
        'Autor da célebre frase "Esta terra tem dono!", símbolo de resistência territorial.',
        'Inscrito oficialmente no Livro dos Heróis da Pátria por Lei Federal.',
      ],
      curiosity:
        'A tradição oral missioneira relata que no local onde Sepé tombou brotou uma fonte de água cristalina e que a constelação do Cruzeiro do Sul é o reflexo do lunar de sua fronte no céu.',
      guardianQuote:
        '“Co Yvy Oguerekó Iára! Esta terra tem dono, tem alma ancestral e tem sangue sagrado regando cada palmo de solo rio-grandense!”',
      rarity: 'sagrado',
      archive: {
        archiveName: 'Memorial dos Povos Missioneiros / Panteão da Pátria e da Liberdade',
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Representação artística histórica da bravura de Sepé Tiaraju nos campos de Caiboaté.',
        period: '1723–1756 (Século XVIII)',
        curatorNotes: 'Herói Nacional Brasileiro tombado na defesa das Missões Jesuíticas.',
      },
      references: [
        {
          title: 'Lei Federal nº 12.032/2009 - Inscrição de Sepé Tiaraju no Livro dos Heróis da Pátria',
          institution: 'Presidência da República / Diário Oficial da União',
          url: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12032.htm',
          description: 'Decreto que inscreve Sepé Tiaraju no Panteão da Pátria e da Liberdade Tancredo Neves.',
        },
        {
          title: 'Dossiê Histórico Sepé Tiaraju - Universidade Federal de Santa Maria (UFSM)',
          institution: 'UFSM / Núcleo de Estudos Missioneiros',
          url: 'https://www.ufsm.br/',
          description: 'Estudos historiográficos sobre a liderança política e militar guarani nas Missões.',
        },
      ],
    },
    {
      id: 'rs_bombacha_poncho',
      stateId: 'RS',
      title: 'Pilcha Gaúcha, Bombacha & Poncho',
      category: 'tradicoes',
      categoryLabel: 'Vestimenta & Pilcha Gaúcha',
      icon: '👖',
      shortDesc: 'A indumentária tradicional oficial protegida pela Lei Estadual nº 8.813/1989.',
      fullDesc:
        'A pilcha é o traje típico oficial do Rio Grande do Sul. Compreende a bombacha (calça larga e folgada com favos e botões nos tornozelos), a bota de couro sanfonada de cano alto com esporas, a camisa de gola fechada, a guaiaca (cinto largo de couro com fivelas, coldre e bolsos de utilidade), o lenço ao pescoço, o chapéu de feltro de abas largas com barbicacho e o pesado poncho de lã crua para proteção contra a geada e o vento minuano.',
      historicalContext:
        'A bombacha tem origem nas calças largas usadas na Europa e no Oriente Médio (como os trajes turcos e andaluzes trazidos nas guerras da Crimeia e guerras carlistas no século XIX). Devido à sua extrema mobilidade sobre a sela e capacidade de proteger as pernas contra arbustos espinhosos das coxilhas, foi rapidamente adotada pelos campeiros e tropeiros do sul.',
      culturalImpact:
        'A Lei Estadual nº 8.813 de 1989 reconhece a Pilcha como traje de honra e de gala para uso em todas as solenidades oficiais e atos públicos no Estado, assegurando que o cidadão pilchado tem livre acesso a tribunais, palácios de governo e assembleias legislativas.',
      keyTakeaways: [
        'Indumentária reconhecida por lei como traje oficial de gala e honra cívica.',
        'Desenvolvida ergonomicamente para garantir agilidade nas montarias e lida com rebanhos.',
        'O poncho de lã de ovelha é o protetor térmico definitivo contra o vento minuano polar.',
      ],
      curiosity:
        'Existem normas rigorosas do Movimento Tradicionalista Gaúcho que regulamentam a discrição, cores sóbrias e proporções da pilcha autêntica, diferenciando-a de fantasias carnavalescas.',
      guardianQuote:
        '“Pilchar-se com decência e aprumo não é usar fantasia: é vestir a própria história viva do nosso chão com orgulho e honra inquebrantável!”',
      rarity: 'raro',
      archive: {
        archiveName: 'Acervo do Museu da Imagem e do Som / MTG RS',
        imageUrl: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Vestimenta gaúcha completa (pilcha de gala) com bombacha tradicional e guaiaca lavrada.',
        period: 'Século XIX até os dias atuais',
        curatorNotes: 'Patrimônio Cultural e Vestimenta Oficial do RS.',
      },
      references: [
        {
          title: 'Lei Estadual nº 8.813/1989 - Oficialização da Pilcha Gaúcha',
          institution: 'Assembleia Legislativa do Estado do Rio Grande do Sul',
          url: 'https://www.al.rs.gov.br/legis/',
          description: 'Regulamentação do uso da pilcha em solenidades oficiais e atos cívicos.',
        },
        {
          title: 'Diretrizes da Indumentária Tradicionalista Gaúcha',
          institution: 'Movimento Tradicionalista Gaúcho (MTG)',
          url: 'https://www.mtg.org.br/indumentaria/',
          description: 'Manual detalhado de peças, cortes, tecidos e regras de apresentação da pilcha campeira.',
        },
      ],
    },
    {
      id: 'rs_cavalo_crioulo',
      stateId: 'RS',
      title: 'O Lendário Cavalo Crioulo',
      category: 'fauna_flora',
      categoryLabel: 'Fauna & Raça Campeira',
      icon: '🐎',
      shortDesc: 'A raça de equinos forjada em séculos de seleção natural nas intempéries do cone sul.',
      fullDesc:
        'O Cavalo Crioulo (Equus caballus) é descendente direto dos cavalos berberes e andaluzes trazidos ao continente sul-americano pelos colonizadores espanhóis no século XVI. Abandonados nas campinas após conflitos coloniais, esses animais reproduziram-se em estado selvagem por mais de quatro séculos, enfrentando invernos glaciais, secas e predadores, o que forjou uma raça de rusticidade, docilidade e resistência metabólica inigualáveis.',
      historicalContext:
        'Foi o companheiro indispensável do gaúcho em todas as campanhas militares da história platina: nas guerras de fronteira, na Guerra da Tríplice Aliança e na Revolução Farroupilha. Sem o cavalo crioulo, a colonização e a pecuária extensiva no bioma Pampa teriam sido inviáveis.',
      culturalImpact:
        'Declarado Animal Símbolo do Rio Grande do Sul pela Lei Estadual nº 11.826 de 2002. Anualmente, a Associação Brasileira de Criadores de Cavalos Crioulos (ABCCC) realiza a prova do "Freio de Ouro" em Esteio, considerada a mais rigorosa avaliação morfológica e funcional de equinos do planeta.',
      keyTakeaways: [
        'Declarado Animal Símbolo do Estado do RS por Lei Estadual em 2002.',
        'Capacidade de percorrer centenas de quilômetros alimentando-se exclusivamente de pastagens nativas.',
        'Estrela do "Freio de Ouro", principal campeonato de rédeas e funcionalidade da América Latina.',
      ],
      curiosity:
        'Na lendária "Marcha de Resistência", cavalos crioulos percorrem 750 km em 14 dias comendo apenas o capim do campo e carregando cavaleiros de até 90 kg.',
      guardianQuote:
        '“O gaúcho sem o seu pingo crioulo é metade de um homem; juntos na coxilha, são força invencível que doma a distância e o tempo!”',
      rarity: 'epico',
      archive: {
        archiveName: 'Acervo da Associação Brasileira de Criadores de Cavalos Crioulos (ABCCC)',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Cavalo Crioulo em galope nas coxilhas onduladas do Pampa durante o amanhecer.',
        period: 'Século XVI ao presente',
        curatorNotes: 'Patrimônio Genético e Cultural da Pecuária Sulina.',
      },
      references: [
        {
          title: 'Lei Estadual nº 11.826/2002 - Declara o Cavalo Crioulo Animal Símbolo do RS',
          institution: 'Governo do Estado do Rio Grande do Sul',
          url: 'https://www.al.rs.gov.br/legis/',
          description: 'Reconhecimento oficial da raça crioula como patrimônio zootécnico e cultural estadual.',
        },
        {
          title: 'ABCCC - Padrão Racial e História da Raça Crioula',
          institution: 'Associação Brasileira de Criadores de Cavalos Crioulos',
          url: 'https://www.cavalocrioulo.org.br/',
          description: 'Árvore genealógica, características morfológicas e regulamento do Freio de Ouro.',
        },
      ],
    },
    {
      id: 'rs_gaita_acordeom',
      stateId: 'RS',
      title: 'Gaita Ponto & Tradições Musicais',
      category: 'tradicoes',
      categoryLabel: 'Música & Ritmos Nativistas',
      icon: '🪗',
      shortDesc: 'O acordeom de botões que dita o compasso vibrante do vanerão, milonga e chamamé.',
      fullDesc:
        'A gaita ponto (acordeom diatônico de botões) e a gaita piano foram introduzidas no sul do Brasil pelos imigrantes alemães e italianos no século XIX e rapidamente adotadas pelos músicos campeiros. Com sua sonoridade potente capaz de preencher galpões sem amplificação elétrica, tornou-se o instrumento condutor dos bailes tradicionalistas, executando ritmos tradicionais como a vaneira, o vanerão acelerado, a milonga reflexiva, o bugio, o xote e o chamamé.',
      historicalContext:
        'Gaiteros lendários como Tio Bilia (conhecido como o Rei da Gaita Ponto nas Missões), Renato Borghetti e Luiz Carlos Borges projetaram a gaita gaúcha em palcos mundiais, combinando a improvisação campeira com técnicas orquestrais.',
      culturalImpact:
        'A música nativista gaúcha é celebrada em dezenas de festivais anuais como a "Calhandra de Ouro" na Califórnia da Canção Nativa de Uruguaiana, servindo de salvaguarda poética para o linguajar, lendas e o respeito à terra.',
      keyTakeaways: [
        'Instrumento central dos fandangos e bailes de galpão nativistas.',
        'Mestres como Tio Bilia e Renato Borghetti consagraram a gaita ponto no Brasil e no exterior.',
        'Conduz ritmos autênticos do cone sul: Vanerão, Milonga, Chamamé e Bugio.',
      ],
      curiosity:
        'O ritmo do "Bugio" é único no mundo: foi criado na serra gaúcha imitando o ronco característico do macaco bugio (Alouatta guariba) através do fole da gaita.',
      guardianQuote:
        '“Quando o fole da gaita ponto abre gemendo um vanerão, o chão do galpão estremece e a tristeza não encontra lugar para pousar!”',
      rarity: 'epico',
      archive: {
        archiveName: 'Acervo do Museu da Califórnia da Canção Nativa / Discoteca Pública do RS',
        imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
        imageCaption: 'Gaita ponto histórica de oito baixos confeccionada em madeira nobre e fole decorado.',
        period: 'Século XIX até a atualidade',
        curatorNotes: 'Patrimônio Musical Nativista do Sul.',
      },
      references: [
        {
          title: 'Discoteca Pública Natho Henn - Acervo da Música Regionalista Gaúcha',
          institution: 'Secretaria da Cultura do RS (SEDAC)',
          url: 'https://cultura.rs.gov.br/discoteca-publica-natho-henn',
          description: 'Gravações históricas de Tio Bilia, Honeyde Bertolini e festivais de canção nativa.',
        },
        {
          title: 'Califórnia da Canção Nativa de Uruguaiana - Patrimônio Cultural Imaterial',
          institution: 'Prefeitura Municipal de Uruguaiana / IGTF',
          url: 'https://uruguaiana.rs.gov.br/',
          description: 'História do festival que refundou a moderna poesia campeira e o nativismo brasileiro.',
        },
      ],
    },
  ],
};

export interface GuardianTopicQuestion {
  topicId: string;
  topicName: string;
  icon: string;
  questionPrompt: string;
  guardianResponse: string;
  detailBullets: string[];
}

export const GUARDIAN_TOPIC_KNOWLEDGE_QUESTIONS: Record<string, GuardianTopicQuestion[]> = {
  RS: [
    {
      topicId: 'origem_cultura',
      topicName: 'Entranhas da Cultura Gaúcha',
      icon: '🔥',
      questionPrompt: 'Gostaria de adentrar nas entranhas da nossa cultura?',
      guardianResponse:
        '“A cultura gaúcha não é mero folclore: é um estilo de vida forjado nas coxilhas abertas, na convivência entre indígenas guaranis, colonizadores ibéricos e imigrantes europeus. Nossa ética se baseia na honra da palavra dada, no respeito aos mais velhos, na roda de chimarrão e no apego à liberdade!”',
      detailBullets: [
        'Tradição Oral & Centros de Tradições Gaúchas (CTGs espalhados pelo mundo)',
        'O Culto ao Galpão Crioulo e à Chama Crioula acesa anualmente no mês Farroupilha',
        'A Pilcha tradicionalista protegida por lei como traje formal',
      ],
    },
    {
      topicId: 'historia_farrapos',
      topicName: 'História & Bravura Farroupilha',
      icon: '⚔️',
      questionPrompt: 'Posso te falar sobre nossa história de batalhas?',
      guardianResponse:
        '“De 1835 a 1845, travamos a Revolução Farroupilha contra os pesados tributos do Império sobre o nosso charque. Proclamamos a República Rio-Grandense em Piratini e a República Juliana em Santa Catarina. Foi uma década de heroísmo que moldou nossa bandeira verde, vermelha e amarela!”',
      detailBullets: [
        'Líderes: Bento Gonçalves, Giuseppe Garibaldi, Anita Garibaldi e General Netto',
        'Os Lanceiros Negros: soldados de elite da cavalaria republicana',
        'Paz de Ponche Verde: acordo honroso que garantiu anistia e incorporação das forças',
      ],
    },
    {
      topicId: 'fauna_flora',
      topicName: 'Fauna e Flora dos Pampas',
      icon: '🌾',
      questionPrompt: 'Quer conhecer as riquezas da nossa Fauna e Flora?',
      guardianResponse:
        '“Nosso bioma predominante é o Pampa — um mar de gramíneas ondulantes onde o vento minuano canta baixinho. Ao norte, as matas de Araucárias recortam o céu da Serra Gaúcha. Entre os animais, o quero-quero vigia os campos, o graxaim corre nas matas e o cavalo crioulo é nosso irmão de jornada!”',
      detailBullets: [
        'Bioma Pampa: Campos sulinos com mais de 3.000 espécies vegetais rasteiras',
        'Bioma Mata Atlântica: Florestas de Pinhais e cânions gigantescos em Aparados da Serra',
        'Fauna: Quero-quero, Seriema, Capivara, Tuco-tuco e Gato-dos-pampas',
      ],
    },
    {
      topicId: 'regionalizacao',
      topicName: 'Regionalização & Geografia',
      icon: '🗺️',
      questionPrompt: 'Deseja entender as diferentes regiões do nosso estado?',
      guardianResponse:
        '“O Rio Grande do Sul é mosaico fascinante: a Campanha Gaúcha com suas estâncias de gado a perder de vista; a Serra Gaúcha com cidades frias e vinhedos nas encostas; o Planalto Médio com alta produtividade agrícola; a Região Metropolitana ao redor do Guaíba; e o Litoral com a imensa Lagoa dos Patos!”',
      detailBullets: [
        'Metade Sul & Pampa: Tradição campeira, pecuária extensiva e cultivo de arroz',
        'Serra Gaúcha & Encosta da Serra: Colonização italiana e alemã, fábricas de móveis e vinhos',
        'Litoral & Lagoa dos Patos: A maior laguna do Brasil e o Porto de Rio Grande',
      ],
    },
    {
      topicId: 'comidas_gastronomia',
      topicName: 'Principais Comidas e Bebidas',
      icon: '🍖',
      questionPrompt: 'Quer saber quais são as nossas principais comidas?',
      guardianResponse:
        '“Nossa mesa é farta e aromática! O churrasco de costela no fogo de chão com sal grosso é o rei dos domingos. O arroz de carreteiro feito com charque picadinho conta a história dos tropeiros. No inverno, o pinhão cozido, a sopa de capeletti da serra e a cuca alemã com linguiça completam o banquete!”',
      detailBullets: [
        'Chimarrão amargo na cuia com bomba de prata',
        'Costela e vazio assados lentamente na brasa de lenha',
        'Doces de Pelotas: tradição portuguesa com fios de ovos, quindins e pastéis de Santa Clara',
      ],
    },
    {
      topicId: 'nomes_importantes',
      topicName: 'Nomes Importantes e Heróis',
      icon: '👑',
      questionPrompt: 'Gostaria de conhecer os nomes históricos da nossa terra?',
      guardianResponse:
        '“Muitas almas grandiosas nasceram ou combateram em nosso solo: Sepé Tiaraju nos tempos das Missões; Bento Gonçalves e Anita Garibaldi nas guerras republicanas; o escritor Érico Veríssimo que eternizou O Tempo e o Vento; e líderes como Getúlio Vargas e João Goulart que marcaram a República brasileira!”',
      detailBullets: [
        'Érico Veríssimo: mestre literário da saga Farroupilha (Ana Terra e Capitão Rodrigo)',
        'Anita Garibaldi: heroína da liberdade no Brasil e na Itália',
        'Sepé Tiaraju: herói missioneiro imortalizado no Livro dos Heróis da Pátria',
      ],
    },
  ],
};

import { GUARDIANS_DATA } from './guardiansData';

/**
 * Retorna todos os itens culturais de um estado específico.
 * Se houver itens customizados em CULTURAL_INVENTORY_BY_STATE, usa-os.
 * Caso contrário, deriva itens canônicos ricos a partir dos dados do Guardião.
 */
export function getCulturalItemsForState(stateId: string): CulturalItem[] {
  const custom = CULTURAL_INVENTORY_BY_STATE[stateId];
  if (custom && custom.length > 0) {
    return custom;
  }

  const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
  if (!guardian) return [];

  const items: CulturalItem[] = [];

  // 1. Pergaminho Literário / Manuscrito Histórico
  if (guardian.literaryPergament) {
    items.push({
      id: `${guardian.id.toLowerCase()}_pergaminho`,
      stateId: guardian.id,
      title: `Manuscrito: ${guardian.literaryPergament.title}`,
      category: 'historia',
      categoryLabel: 'Literatura & Memória Histórica',
      icon: '📜',
      shortDesc: `Obra célebre de ${guardian.literaryPergament.author} que preserva a identidade de ${guardian.stateNamePt}.`,
      fullDesc: `“${guardian.literaryPergament.excerpt}” — Este fragmento histórico representa a alma do povo de ${guardian.stateNamePt}, resgatando a memória cívica e cultural preservada pelos guardiões.`,
      historicalContext: guardian.literaryPergament.contextPt,
      culturalImpact: `Obra de referência do patrimônio literário brasileiro, preservada na Biblioteca Nacional e acervos estaduais.`,
      keyTakeaways: [
        `Autor(a): ${guardian.literaryPergament.author}`,
        `Tema: ${guardian.literaryPergament.title}`,
        `Relevância: Memória cívica e literária de ${guardian.stateNamePt}`,
      ],
      curiosity: `Documento catalogado pelo Guardião ${guardian.guardianName} como herança sagrada para as futuras gerações.`,
      guardianQuote: `“Quem conhece a palavra e a história dos seus antepassados jamais terá sua honra esquecida!”`,
      rarity: 'sagrado',
      archive: {
        archiveName: `Acervo da Fundação Biblioteca Nacional / Arquivo Público de ${guardian.stateNamePt}`,
        imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
        imageCaption: `Manuscrito original e registros bibliográficos de ${guardian.stateNamePt}.`,
        period: 'Século XIX ao XX',
        curatorNotes: 'Patrimônio Documental e Histórico Nacional.',
      },
      references: [
        {
          title: `Biblioteca Nacional Digital - Memória de ${guardian.stateNamePt}`,
          institution: 'Fundação Biblioteca Nacional do Brasil',
          url: 'https://bndigital.bn.gov.br/',
          description: 'Documentos e acervos digitalizados da literatura regional brasileira.',
        },
        {
          title: `IPHAN - Bens Culturais Registrados em ${guardian.stateNamePt}`,
          institution: 'Instituto do Patrimônio Histórico e Artístico Nacional',
          url: 'http://portal.iphan.gov.br/',
          description: 'Dossiês de registro do patrimônio imaterial e histórico do estado.',
        },
      ],
    });
  }

  // 2. Gastronomia Tradicional
  if (guardian.typicalDishPt) {
    items.push({
      id: `${guardian.id.toLowerCase()}_culinaria`,
      stateId: guardian.id,
      title: `Tradição Culinária: ${guardian.typicalDishPt}`,
      category: 'culinaria',
      categoryLabel: 'Gastronomia & Sabores',
      icon: '🍲',
      shortDesc: `Os sabores ancestrais e temperos tradicionais que definem a identidade de ${guardian.stateNamePt}.`,
      fullDesc: `A gastronomia típica de ${guardian.stateNamePt}, representada com destaque por ${guardian.typicalDishPt}, sintetiza influências indígenas, africanas e europeias em ricas panelas e fogões tradicionais.`,
      historicalContext: `Desenvolvida a partir dos ingredientes nativos da região e dos costumes dos povos originários e colonizadores ao longo de séculos.`,
      culturalImpact: `Símbolo de hospitalidade, sustento e identidade regional reconhecido em feiras populares e patrimônio imaterial.`,
      keyTakeaways: [
        `Prato Típico: ${guardian.typicalDishPt}`,
        `Origem: Mistura de saberes ancestrais e ingredientes locais`,
        `Preservação: Receita tradicional protegida como saber culinário`,
      ],
      curiosity: `O preparo desse prato tradicional segue rituais passados de geração em geração entre famílias do estado.`,
      guardianQuote: `“À mesa de ${guardian.stateNamePt}, cada tempero conta a história de nossa gente e acolhe o visitante como irmão!”`,
      rarity: 'epico',
      archive: {
        archiveName: `Dossiê dos Saberes Tradicionais / IPHAN`,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        imageCaption: `Preparo artesanal do prato tradicional ${guardian.typicalDishPt}.`,
        period: 'Tradição secular contínua',
        curatorNotes: 'Saber gastronômico tradicional.',
      },
      references: [
        {
          title: `IPHAN - Registro de Saberes e Ofícios Culinários`,
          institution: 'Instituto do Patrimônio Histórico e Artístico Nacional',
          url: 'http://portal.iphan.gov.br/',
          description: 'Salvaguarda de práticas culinárias tradicionais brasileiras.',
        },
      ],
    });
  }

  // 3. Fauna e Flora / Natureza Sagrada
  if (guardian.faunaPt || guardian.floraPt) {
    items.push({
      id: `${guardian.id.toLowerCase()}_natureza`,
      stateId: guardian.id,
      title: `Natureza Sagrada: ${guardian.faunaPt || guardian.floraPt}`,
      category: 'fauna_flora',
      categoryLabel: 'Biodiversidade & Biomas',
      icon: '🌿',
      shortDesc: `A exuberância biológica de ${guardian.stateNamePt}: fauna (${guardian.faunaPt}) e flora (${guardian.floraPt}).`,
      fullDesc: `As paisagens naturais de ${guardian.stateNamePt} abrigam espécies nobres como ${guardian.faunaPt} e formações vegetais como ${guardian.floraPt}, fundamentais para o equilíbrio ecológico e mítico do Brasil.`,
      historicalContext: `Espécies reverenciadas pelos povos originários como guardiãs das águas, florestas e campos abertos.`,
      culturalImpact: `Inspiram lendas, canções populares e o compromisso ético de conservação ambiental para o futuro da nação.`,
      keyTakeaways: [
        `Fauna Símbolo: ${guardian.faunaPt}`,
        `Flora Símbolo: ${guardian.floraPt}`,
        `Bioma: Riqueza natural sob a proteção dos guardiões`,
      ],
      curiosity: `Muitas dessas espécies são protegidas por parques estaduais e reservas ecológicas federais.`,
      guardianQuote: `“A floresta e os campos são o templo sagrado da vida. Respeite cada ser que neles habita!”`,
      rarity: 'raro',
      archive: {
        archiveName: `Instituto Chico Mendes de Conservação da Biodiversidade (ICMBio)`,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        imageCaption: `Espécies emblemáticas da biodiversidade de ${guardian.stateNamePt}.`,
        period: 'Patrimônio Natural Permanente',
        curatorNotes: 'Biodiversidade e conservação ambiental.',
      },
      references: [
        {
          title: `ICMBio - Unidades de Conservação de ${guardian.stateNamePt}`,
          institution: 'Ministério do Meio Ambiente e Mudança do Clima',
          url: 'https://www.gov.br/icmbio/pt-br',
          description: 'Relatórios sobre fauna e flora nativas brasileiras.',
        },
      ],
    });
  }

  // 4. Música, Folclore & Manifestações
  if (guardian.musicAndCulturePt) {
    items.push({
      id: `${guardian.id.toLowerCase()}_cultura`,
      stateId: guardian.id,
      title: `Celebração: ${guardian.musicAndCulturePt}`,
      category: 'tradicoes',
      categoryLabel: 'Música & Festividades Populares',
      icon: '🎭',
      shortDesc: `A maior manifestação folclórica e festiva de ${guardian.stateNamePt}: ${guardian.musicAndCulturePt}.`,
      fullDesc: `Com ritmos vibrantes, cortejos e trajes suntuosos, a celebração de ${guardian.musicAndCulturePt} expressa a devoção, alegria e talento artístico do povo de ${guardian.stateNamePt}.`,
      historicalContext: `Tradição popular forjada na confluência de celebrações religiosas, autos populares e ritmos afro-indígenas.`,
      culturalImpact: `Reúne milhares de participantes e fortalece a identidade comunitária, transmitida através das gerações.`,
      keyTakeaways: [
        `Manifestação: ${guardian.musicAndCulturePt}`,
        `Expressão: Folclore, danças e tradições populares`,
        `Patrimônio: Registro na memória imaterial brasileira`,
      ],
      curiosity: `As festividades mobilizam comunidades inteiras durante meses de preparação artesanal e ensaios musicais.`,
      guardianQuote: `“Quando os tambores e cantos de ${guardian.stateNamePt} ecoam, a história ganha vida sob as estrelas!”`,
      rarity: 'epico',
      archive: {
        archiveName: `Inventário Nacional de Referências Culturais (INRC) / IPHAN`,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
        imageCaption: `Celebração popular e manifestação folclórica de ${guardian.stateNamePt}.`,
        period: 'Século XVIII à Contemporaneidade',
        curatorNotes: 'Patrimônio Imaterial Festivo.',
      },
      references: [
        {
          title: `IPHAN - Festas e Celebrações do Brasil`,
          institution: 'Instituto do Patrimônio Histórico e Artístico Nacional',
          url: 'http://portal.iphan.gov.br/',
          description: 'Registro das grandes celebrações populares do Brasil.',
        },
      ],
    });
  }

  return items;
}

/**
 * Retorna todos os itens culturais de todos os 27 estados do Brasil.
 */
export function getAllCulturalItems(): CulturalItem[] {
  const allItems: CulturalItem[] = [];
  GUARDIANS_DATA.forEach((g) => {
    const items = getCulturalItemsForState(g.id);
    allItems.push(...items);
  });
  return allItems;
}
