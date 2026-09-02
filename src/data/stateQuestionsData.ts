import { BrQuestQuestion } from './brQuestQuestionsData';
import { GUARDIANS_DATA } from './guardiansData';
import { shuffleQuestionOptions } from './questionShuffle';

export interface StateQuizQuestion {
  id: string;
  stateId: string;
  category: 'geografia' | 'clima' | 'biodiversidade' | 'historia_herois' | 'cultura_sabores' | 'simbolos';
  questionPt: string;
  optionsPt: string[];
  correctIndex: number;
  explanationPt: string;
}

export const STATE_DEDICATED_QUESTIONS: StateQuizQuestion[] = [
  // ==========================================
  // ACRE (AC)
  // ==========================================
  {
    id: 'ac_01',
    stateId: 'AC',
    category: 'historia_herois',
    questionPt: 'Qual tratado diplomático de 1903 formalizou a anexação do Acre ao território brasileiro após a Revolução Acreana liderada por Plácido de Castro?',
    optionsPt: ['Tratado de Petrópolis', 'Tratado de Madri', 'Tratado de Tordesilhas', 'Tratado de Badajós'],
    correctIndex: 0,
    explanationPt: 'O Tratado de Petrópolis (1903), negociado pelo Barão do Rio Branco, garantiu a incorporação do Acre mediante indenização à Bolívia e a construção da Estrada de Ferro Madeira-Mamoré.',
  },
  {
    id: 'ac_02',
    stateId: 'AC',
    category: 'biodiversidade',
    questionPt: 'Qual líder seringueiro acreano e ambientalista internacionalmente reconhecido lutou em Xapuri pela criação das Reservas Extrativistas?',
    optionsPt: ['Chico Mendes', 'Sepé Tiaraju', 'Mestre Pastinha', 'Cândido Rondon'],
    correctIndex: 0,
    explanationPt: 'Chico Mendes liderou o movimento dos seringueiros no Acre e defendeu a conservação da Amazônia com as reservas extrativistas, tornando-se mártir da ecologia mundial.',
  },
  {
    id: 'ac_03',
    stateId: 'AC',
    category: 'cultura_sabores',
    questionPt: 'Qual prato tradicional da culinária acreana é composto por feijão, arroz, carne de sol, farinha de mandioca e cheiro-verde?',
    optionsPt: ['Baixaria', 'Pato no Tucupi', 'Vatapá', 'Arroz com Pequi'],
    correctIndex: 0,
    explanationPt: 'A Baixaria é um prato matinal clássico dos mercados do Acre, servido tipicamente com cuscuz de milho, carne moída temperada, ovos fritos e cheiro-verde.',
  },
  {
    id: 'ac_04',
    stateId: 'AC',
    category: 'geografia',
    questionPt: 'Em relação ao fuso horário de Brasília (UTC-3), qual é a diferença oficial do fuso horário do Acre?',
    optionsPt: ['2 horas a menos (UTC-5)', '1 hora a mais (UTC-2)', 'Mesmo horário (UTC-3)', '3 horas a menos (UTC-6)'],
    correctIndex: 0,
    explanationPt: 'O Acre e trechos do oeste do Amazonas pertencem ao fuso horário UTC-5, ficando 2 horas atrás do horário oficial de Brasília.',
  },

  // ==========================================
  // ALAGOAS (AL)
  // ==========================================
  {
    id: 'al_01',
    stateId: 'AL',
    category: 'historia_herois',
    questionPt: 'Na Serra da Barriga, em Alagoas, localizava-se o maior e mais emblemático refúgio de resistência negra contra a escravidão no Brasil colonial:',
    optionsPt: ['Quilombo dos Palmares', 'Quilombo do Frechal', 'Quilombo do Ambrósio', 'Quilombo do Ivaporunduva'],
    correctIndex: 0,
    explanationPt: 'O Quilombo dos Palmares, liderado por Ganga Zumba e Zumbi, resistiu por quase um século na Serra da Barriga (hoje União dos Palmares/AL).',
  },
  {
    id: 'al_02',
    stateId: 'AL',
    category: 'cultura_sabores',
    questionPt: 'Qual iguaria originária das lagoas Mundaú e Manguaba em Alagoas é preparada com pequenos moluscos cozidos em leite de coco e dendê?',
    optionsPt: ['Sururu de Capote', 'Moqueca Capixaba', 'Tacacá', 'Casquinha de Siri'],
    correctIndex: 0,
    explanationPt: 'O Sururu de Alagoas é patrimônio imaterial estadual, extraído das lagoas de Maceió e preparado tradicionalmente com leite de coco cremoso e pimentões.',
  },
  {
    id: 'al_03',
    stateId: 'AL',
    category: 'geografia',
    questionPt: 'Qual cânion fluvial deslumbrante corta o sertão de Alagoas, sendo o 5º maior cânion navegável do mundo?',
    optionsPt: ['Cânions do Rio São Francisco (Xingó)', 'Cânion de Guartelá', 'Cânion Itaimbezinho', 'Cânion das Bandeiras'],
    correctIndex: 0,
    explanationPt: 'O Cânion do Xingó, formado pela represa do Velho Chico entre Alagoas e Sergipe, possui imensos paredões de granito avermelhado e águas verdes navegáveis.',
  },

  // ==========================================
  // AMAPÁ (AP)
  // ==========================================
  {
    id: 'ap_01',
    stateId: 'AP',
    category: 'geografia',
    questionPt: 'Em Macapá, capital do Amapá, qual monumento astronômico e turístico marca exatamente a passagem da Linha do Equador?',
    optionsPt: ['Monumento Marco Zero do Equador', 'Obelisco da Abolição', 'Farol da Barra', 'Relógio Solar dos Pampas'],
    correctIndex: 0,
    explanationPt: 'O Marco Zero de Macapá permite aos visitantes ficarem com um pé no Hemisfério Norte e outro no Hemisfério Sul, famoso pelo fenômeno do equinócio.',
  },
  {
    id: 'ap_02',
    stateId: 'AP',
    category: 'historia_herois',
    questionPt: 'Qual gigantesca fortificação militar do século XVIII é considerada a maior fortaleza colonial construída pela Coroa Portuguesa no Brasil?',
    optionsPt: ['Fortaleza de São José de Macapá', 'Forte dos Reis Magos', 'Fortaleza de Santa Cruz da Barra', 'Forte Príncipe da Beira'],
    correctIndex: 0,
    explanationPt: 'Erguida entre 1764 e 1782 na margem esquerda do Rio Amazonas, a Fortaleza de São José de Macapá defendia a Amazônia setentrional contra incursões francesas.',
  },
  {
    id: 'ap_03',
    stateId: 'AP',
    category: 'biodiversidade',
    questionPt: 'O Parque Nacional Montanhas do Tumucumaque, localizado em grande parte no Amapá, detém qual título mundial?',
    optionsPt: [
      'Maior parque nacional de floresta tropical do planeta',
      'Ponto mais alto das Américas',
      'Único deserto árido do Brasil',
      'Maior planície inundável do mundo'
    ],
    correctIndex: 0,
    explanationPt: 'Com 3,8 milhões de hectares de floresta intocada, o Parque Nacional Montanhas do Tumucumaque é a maior unidade de conservação em floresta tropical contínua do mundo.',
  },

  // ==========================================
  // AMAZONAS (AM)
  // ==========================================
  {
    id: 'am_01',
    stateId: 'AM',
    category: 'geografia',
    questionPt: 'O Encontro das Águas em frente a Manaus é o espetacular fenômeno em que as águas de dois grandes rios correm lado a lado sem se misturar por quilômetros. Quais são esses rios?',
    optionsPt: ['Rio Negro e Rio Solimões', 'Rio Tapajós e Rio Xingu', 'Rio Madeira e Rio Amazonas', 'Rio Araguaia e Rio Tocantins'],
    correctIndex: 0,
    explanationPt: 'As águas escuras e ácidas do Rio Negro e as águas barrentas e densas do Solimões não se misturam imediatamente devido a diferenças de densidade, temperatura e velocidade.',
  },
  {
    id: 'am_02',
    stateId: 'AM',
    category: 'cultura_sabores',
    questionPt: 'Qual celebração folclórica no município de Parintins (AM) atrai multidões no Bumbódromo para assistir ao duelo entre dois bois?',
    optionsPt: ['Boi Caprichoso (azul) e Boi Garantido (vermelho)', 'Boi Mal-de-Amor e Boi Estrela', 'Boi Tatá e Boi Canarinho', 'Boi do Maranhão e Boi da Paraíba'],
    correctIndex: 0,
    explanationPt: 'O Festival Folclórico de Parintins é uma das maiores festas a céu aberto do mundo, disputada ferozmente entre o Boi Garantido e o Boi Caprichoso.',
  },
  {
    id: 'am_03',
    stateId: 'AM',
    category: 'historia_herois',
    questionPt: 'O majestoso Teatro Amazonas em Manaus, inaugurado em 1896, representa o auge arquitetônico e econômico de qual período histórico?',
    optionsPt: ['Ciclo da Borracha (Belle Époque Amazônica)', 'Ciclo do Ouro Imperial', 'Ciclo da Mineração de Carajás', 'Marcha para o Oeste'],
    correctIndex: 0,
    explanationPt: 'A extração do látex da seringueira gerou imensa riqueza no final do século XIX, permitindo a construção do Teatro Amazonas com materiais importados da Europa.',
  },

  // ==========================================
  // BAHIA (BA)
  // ==========================================
  {
    id: 'ba_01',
    stateId: 'BA',
    category: 'historia_herois',
    questionPt: 'Em 2 de Julho de 1823, a Bahia consolidou a Independência do Brasil ao expulsar as tropas portuguesas de Salvador. Qual heroína participou disfarçada de soldado?',
    optionsPt: ['Maria Quitéria de Jesus', 'Anita Garibaldi', 'Chiquinha Gonzaga', 'Bárbara de Alencar'],
    correctIndex: 0,
    explanationPt: 'Maria Quitéria alistou-se como "Soldado Medeiros", lutou com bravura nas batalhas pela independência na Bahia e foi condecorada com a Ordem Imperial do Cruzeiro.',
  },
  {
    id: 'ba_02',
    stateId: 'BA',
    category: 'cultura_sabores',
    questionPt: 'Qual prato tradicional das baianas de acarajé, tombado pelo IPHAN como Patrimônio Cultural Imaterial do Brasil, é feito com massa de feijão-fradinho frita em azeite de dendê?',
    optionsPt: ['Acarajé com vatapá e caruru', 'Moqueca Capixaba', 'Virado Paulista', 'Pão de Queijo'],
    correctIndex: 0,
    explanationPt: 'O ofício das baianas de acarajé preserva tradições religiosas e culinárias de matriz africana, frito no dendê e recheado com vatapá, camarão seco e vinagrete.',
  },
  {
    id: 'ba_03',
    stateId: 'BA',
    category: 'geografia',
    questionPt: 'Qual parque nacional no coração da Bahia é conhecido por cachoeiras monumentais, grutas submersas e platôs como o Morro do Pai Inácio?',
    optionsPt: ['Parque Nacional da Chapada Diamantina', 'Parque Nacional de Jericoacoara', 'Parque Nacional de Aparados da Serra', 'Parque Nacional do Caparaó'],
    correctIndex: 0,
    explanationPt: 'A Chapada Diamantina abriga o Morro do Pai Inácio, a Cachoeira da Fumaça e poços de águas cristalinas como o Poço Azul e Poço Encantado.',
  },

  // ==========================================
  // CEARÁ (CE)
  // ==========================================
  {
    id: 'ce_01',
    stateId: 'CE',
    category: 'historia_herois',
    questionPt: 'O Ceará foi a primeira província brasileira a abolir a escravidão, em 1884 (4 anos antes da Lei Áurea). Qual jangadeiro abolicionista liderou o fechamento do porto aos negreiros?',
    optionsPt: ['Dragão do Mar (Francisco José do Nascimento)', 'Sepé Tiaraju', 'Tiradentes', 'Zumbi dos Palmares'],
    correctIndex: 0,
    explanationPt: 'Francisco José do Nascimento, o Dragão do Mar, comandou a greve dos jangadeiros em Fortaleza: "No porto do Ceará não se embarcam mais escravos!", rendendo ao Ceará o título de Terra da Luz.',
  },
  {
    id: 'ce_02',
    stateId: 'CE',
    category: 'biodiversidade',
    questionPt: 'Qual bioma semiárido exclusivamente brasileiro cobre a maior parte do território cearense, com vegetação adaptada a longos períodos de seca?',
    optionsPt: ['Caatinga', 'Pampa', 'Pantanal', 'Mata Atlântica'],
    correctIndex: 0,
    explanationPt: 'A Caatinga é um bioma 100% brasileiro, marcado por cactáceas como o mandacaru e arbustos que perdem as folhas na estiagem e florescem intensamente com as chuvas.',
  },
  {
    id: 'ce_03',
    stateId: 'CE',
    category: 'cultura_sabores',
    questionPt: 'Qual combinação culinária cearense de feijão-de-corda cozido com arroz, queijo coalho e manteiga da terra é adorada em todo o país?',
    optionsPt: ['Baião de Dois', 'Feijoada Completa', 'Barreado', 'Arroz Carreteiro'],
    correctIndex: 0,
    explanationPt: 'O Baião de Dois nasceu do reaproveitamento criativo no sertão cearense e foi eternizado em canção por Humberto Teixeira e Luiz Gonzaga.',
  },

  // ==========================================
  // DISTRITO FEDERAL (DF)
  // ==========================================
  {
    id: 'df_01',
    stateId: 'DF',
    category: 'historia_herois',
    questionPt: 'Em 21 de abril de 1960, Brasília foi inaugurada como a nova capital do Brasil. Quem foram os dois mestres responsáveis pelo Plano Piloto e pelas obras arquitetônicas modernistas?',
    optionsPt: ['Lúcio Costa (urbanismo) e Oscar Niemeyer (arquitetura)', 'Burle Marx e Affonso Eduardo Reidy', 'Lina Bo Bardi e Paulo Mendes da Rocha', 'Tom Jobim e Vinicius de Moraes'],
    correctIndex: 0,
    explanationPt: 'Lúcio Costa concebeu o traçado urbanístico em forma de avião/cruz (Plano Piloto) e Oscar Niemeyer projetou os monumentos cívicos tombados pela UNESCO.',
  },
  {
    id: 'df_02',
    stateId: 'DF',
    category: 'biodiversidade',
    questionPt: 'Qual bioma savânico predomina no Distrito Federal, conhecido como o "berço das águas" do Brasil por abrigar nascentes de três grandes bacias hidrográficas?',
    optionsPt: ['Cerrado', 'Pampa', 'Caatinga', 'Mata dos Cocais'],
    correctIndex: 0,
    explanationPt: 'O Cerrado abriga árvores de casca grossa e raízes profundas que recarregam os aquíferos das bacias Amazônica, Platina e do São Francisco.',
  },
  {
    id: 'df_03',
    stateId: 'DF',
    category: 'simbolos',
    questionPt: 'Qual presidente da República cumpriu o dispositivo constitucional transferindo a capital do litoral para o interior com a campanha "50 anos em 5"?',
    optionsPt: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Marechal Deodoro da Fonseca', 'Prudente de Morais'],
    correctIndex: 0,
    explanationPt: 'JK liderou a construção de Brasília entre 1956 e 1960, integrando o território nacional com os trabalhadores pioneiros chamados de "candangos".',
  },

  // ==========================================
  // ESPÍRITO SANTO (ES)
  // ==========================================
  {
    id: 'es_01',
    stateId: 'ES',
    category: 'cultura_sabores',
    questionPt: 'O que diz o célebre aforismo capixaba sobre a verdadeira moqueca feita em panela de barro de Goiabeiras?',
    optionsPt: ['"Moqueca é capixaba, o resto é peixada!"', '"Moqueca boa leva leite de coco e azeite de dendê"', '"Moqueca é prato de sertão"', '"Moqueca se come apenas com farinha de trigo"'],
    correctIndex: 0,
    explanationPt: 'A Moqueca Capixaba tradicional não leva água, nem leite de coco, nem dendê; é cozida apenas com urucum, azeite de oliva, peixe fresco, tomate, cebola e coentro em panela de barro.',
  },
  {
    id: 'es_02',
    stateId: 'ES',
    category: 'historia_herois',
    questionPt: 'Localizado no topo de uma colina em Vila Velha, qual convento fundado em 1558 por Frei Pedro Palácios é um dos monumentos religiosos mais antigos do Brasil?',
    optionsPt: ['Convento da Penha', 'Igreja de São Francisco de Assis', 'Basílica de Nossa Senhora Aparecida', 'Mosteiro de São Bento'],
    correctIndex: 0,
    explanationPt: 'O Convento da Penha fica a 154 metros de altitude debruçado sobre a Baía de Vitória, sendo o principal santuário mariano do Espírito Santo.',
  },
  {
    id: 'es_03',
    stateId: 'ES',
    category: 'geografia',
    questionPt: 'O Pico da Bandeira, com 2.892 metros (3º ponto mais alto do Brasil), localiza-se na divisa do Espírito Santo com qual estado vizinho?',
    optionsPt: ['Minas Gerais', 'Rio de Janeiro', 'Bahia', 'São Paulo'],
    correctIndex: 0,
    explanationPt: 'O Pico da Bandeira situa-se no Parque Nacional do Caparaó, na divisa entre o Espírito Santo e Minas Gerais.',
  },

  // ==========================================
  // GOIÁS (GO)
  // ==========================================
  {
    id: 'go_01',
    stateId: 'GO',
    category: 'biodiversidade',
    questionPt: 'Qual parque nacional goiano, Patrimônio Mundial Natural pela UNESCO, abriga formações rochosas milenares de quartzo e o Vale da Lua?',
    optionsPt: ['Parque Nacional da Chapada dos Veadeiros', 'Parque Nacional de Sete Quedas', 'Parque Nacional do Pantanal Matogrossense', 'Parque Nacional da Serra da Canastra'],
    correctIndex: 0,
    explanationPt: 'A Chapada dos Veadeiros em Goiás é famosa por suas cachoeiras de águas límpidas, campos rupestres e as rochas esculpidas pelo Rio São Miguel no Vale da Lua.',
  },
  {
    id: 'go_02',
    stateId: 'GO',
    category: 'cultura_sabores',
    questionPt: 'Qual fruto nativo de aroma marcante e espinhos internos é o símbolo culinário indiscutível de Goiás no arroz temperado?',
    optionsPt: ['Pequi', 'Buriti', 'Açaí', 'Pinhão'],
    correctIndex: 0,
    explanationPt: 'O pequi é o rei da gastronomia goiana. Deve ser roído com cuidado para não ferir a boca nos espinhos internos que protegem a amêndoa.',
  },
  {
    id: 'go_03',
    stateId: 'GO',
    category: 'historia_herois',
    questionPt: 'Qual cidade histórica goiana, tombada pela UNESCO, preserva casario colonial setecentista e foi o lar da doceira e poetisa Cora Coralina?',
    optionsPt: ['Cidade de Goiás (Goiás Velho)', 'Pirenópolis', 'Caldas Novas', 'Cristalina'],
    correctIndex: 0,
    explanationPt: 'A Cidade de Goiás, antiga capital estadual, é berço de Cora Coralina e palco da secular Procissão do Fogaréu na Semana Santa.',
  },

  // ==========================================
  // MARANHÃO (MA)
  // ==========================================
  {
    id: 'ma_01',
    stateId: 'MA',
    category: 'geografia',
    questionPt: 'Qual parque nacional no litoral maranhense é famoso mundialmente pelo imenso campo de dunas de areia branca pontuado por lagoas de água doce cristalina?',
    optionsPt: ['Parque Nacional dos Lençóis Maranhenses', 'Parque Nacional de Jericoacoara', 'Parque Nacional do Jaú', 'Parque Nacional Marinho dos Abrolhos'],
    correctIndex: 0,
    explanationPt: 'Os Lençóis Maranhenses formam um ecossistema único no mundo onde as chuvas de primeiro semestre enchem lagoas azuis e verdes entre as dunas móveis.',
  },
  {
    id: 'ma_02',
    stateId: 'MA',
    category: 'cultura_sabores',
    questionPt: 'Qual celebração cultural com os sotaques de zabumba, matraca e orquestra narra a lenda de Catirina e Pai Francisco no Maranhão?',
    optionsPt: ['Bumba Meu Boi do Maranhão', 'Maracatu Nação', 'Festa do Divino', 'Cavalhadas'],
    correctIndex: 0,
    explanationPt: 'O Complexo Cultural do Bumba Meu Boi do Maranhão é Patrimônio Cultural Imaterial da Humanidade pela UNESCO.',
  },
  {
    id: 'ma_03',
    stateId: 'MA',
    category: 'historia_herois',
    questionPt: 'São Luís, capital do Maranhão, é a única capital brasileira que foi fundada por navegadores de qual país europeu em 1612?',
    optionsPt: ['França (Daniel de La Touche)', 'Holanda (Maurício de Nassau)', 'Espanha (Felipe II)', 'Inglaterra (Sir Walter Raleigh)'],
    correctIndex: 0,
    explanationPt: 'São Luís foi fundada em 1612 pelos franceses na expedição da "França Equinocial", nomeada em homenagem ao rei Luís XIII da França.',
  },

  // ==========================================
  // MATO GROSSO (MT)
  // ==========================================
  {
    id: 'mt_01',
    stateId: 'MT',
    category: 'biodiversidade',
    questionPt: 'Mato Grosso é o único estado brasileiro a abrigar simultaneamente três biomas expressivos em seu território. Quais são eles?',
    optionsPt: ['Amazônia, Cerrado e Pantanal', 'Mata Atlântica, Pampa e Caatinga', 'Caatinga, Cerrado e Pantanal', 'Mata de Cocais, Pampa e Amazônia'],
    correctIndex: 0,
    explanationPt: 'Mato Grosso reúne o norte amazônico florestal, o planalto central de Cerrado e o sudoeste da planície inundável do Pantanal.',
  },
  {
    id: 'mt_02',
    stateId: 'MT',
    category: 'geografia',
    questionPt: 'Em Cuiabá, capital mato-grossense, encontra-se qual ponto geodésico de grande relevância cartográfica continental?',
    optionsPt: ['Centro Geodésico da América do Sul', 'Extremo Oriental das Américas', 'Linha de Greenwich Brasileira', 'Ponto Central do Hemisfério Sul'],
    correctIndex: 0,
    explanationPt: 'Calculado pelo Marechal Cândido Rondon em 1909, o Centro Geodésico da América do Sul localiza-se na Praça Pascoal Moreira Cabral em Cuiabá.',
  },
  {
    id: 'mt_03',
    stateId: 'MT',
    category: 'cultura_sabores',
    questionPt: 'Qual peixe nobre dos rios pantaneiros é servido assado, frito ou em mojica com mandioca na mesa cuiabana?',
    optionsPt: ['Pintado (ou Cachara)', 'Salmão', 'Bacalhau', 'Tainha'],
    correctIndex: 0,
    explanationPt: 'A mojica de pintado e o pacu frito são os pratos fundamentais da culinária tradicional pantaneira de Mato Grosso.',
  },

  // ==========================================
  // MATO GROSSO DO SUL (MS)
  // ==========================================
  {
    id: 'ms_01',
    stateId: 'MS',
    category: 'biodiversidade',
    questionPt: 'Qual cidade sul-mato-grossense na Serra da Bodoquena é a capital nacional do ecoturismo, famosa pelo Rio da Prata e o Rio Sucuri de águas ultratransparentes?',
    optionsPt: ['Bonito', 'Corumbá', 'Ponta Porã', 'Três Lagoas'],
    correctIndex: 0,
    explanationPt: 'O calcário das rochas de Bonito atua como filtro natural, decantando impurezas e criando rios de visibilidade impressionante repletos de piraputangas e dourados.',
  },
  {
    id: 'ms_02',
    stateId: 'MS',
    category: 'cultura_sabores',
    questionPt: 'Qual bebida tradicional sul-mato-grossense, consumida gelada com água ou suco em guampa com bomba de metal, foi declarada patrimônio imaterial da UNESCO?',
    optionsPt: ['Tereré', 'Quentão', 'Cachaça de Alambique', 'Mate Doce'],
    correctIndex: 0,
    explanationPt: 'O Tereré é parte indissociável do dia a dia no Mato Grosso do Sul, compartilhado em rodas de conversa para amenizar as tardes quentes.',
  },
  {
    id: 'ms_03',
    stateId: 'MS',
    category: 'historia_herois',
    questionPt: 'Durante a Guerra da Tríplice Aliança (1864–1870), qual episódio histórico marcou o recuo heroico das forças imperiais brasileiras através dos pântanos do atual MS?',
    optionsPt: ['A Retirada da Laguna', 'Batalha dos Guararapes', 'Batalha do Jenipapo', 'Combate de Seival'],
    correctIndex: 0,
    explanationPt: 'A Retirada da Laguna, eternizada no livro de Visconde de Taunay, narra a marcha extenuante de tropas brasileiras em território pantaneiro hostil.',
  },

  // ==========================================
  // MINAS GERAIS (MG)
  // ==========================================
  {
    id: 'mg_01',
    stateId: 'MG',
    category: 'historia_herois',
    questionPt: 'Quem foi o alferes e mártir da Inconfidência Mineira (1789) que se tornou o patrono cívico da Nação Brasileira?',
    optionsPt: ['Tiradentes (Joaquim José da Silva Xavier)', 'Aleijadinho', 'Tomás Antônio Gonzaga', 'Cláudio Manuel da Costa'],
    correctIndex: 0,
    explanationPt: 'Tiradentes foi o único inconfidente condenado à morte em 1792 por defender a independência do Brasil e o fim dos tributos escorchantes da Coroa ("o quinto").',
  },
  {
    id: 'mg_02',
    stateId: 'MG',
    category: 'cultura_sabores',
    questionPt: 'Qual queijo artesanal mineiro de casca amarelada e cura tradicional foi reconhecido pela UNESCO como Patrimônio Cultural Imaterial da Humanidade em 2024?',
    optionsPt: ['Queijo Minas Artesanal da Canastra e Serro', 'Queijo Gorgonzola', 'Queijo Gouda', 'Queijo Cheddar'],
    correctIndex: 0,
    explanationPt: 'A tradição do Queijo Minas Artesanal, produzido com leite cru, pingo e cura em tábuas de madeira, é transmitida por famílias há mais de dois séculos.',
  },
  {
    id: 'mg_03',
    stateId: 'MG',
    category: 'simbolos',
    questionPt: 'Antônio Francisco Lisboa, o "Aleijadinho", esculpiu em pedra-sabão os Doze Profetas no adro de qual célebre santuário barroco mineiro?',
    optionsPt: ['Santuário do Bom Jesus de Matosinhos (Congonhas)', 'Igreja da Sé de Mariana', 'Igreja de São Francisco em Ouro Preto', 'Basílica de Diamantina'],
    correctIndex: 0,
    explanationPt: 'Em Congonhas do Campo, o conjunto dos Doze Profetas de Aleijadinho representa a obra máxima do barroco e rococó das Américas.',
  },

  // ==========================================
  // PARÁ (PA)
  // ==========================================
  {
    id: 'pa_01',
    stateId: 'PA',
    category: 'cultura_sabores',
    questionPt: 'No segundo domingo de outubro, Belém acolhe mais de dois milhões de fiéis para acompanhar a imagem da Virgem atada à tradicional Corda no:',
    optionsPt: ['Círio de Nazaré', 'Festa do Bonfim', 'Festa do Divino', 'Congada de Belém'],
    correctIndex: 0,
    explanationPt: 'O Círio de Nazaré é uma das maiores procissões religiosas do mundo, tombada pela UNESCO como Patrimônio Cultural Imaterial da Humanidade.',
  },
  {
    id: 'pa_02',
    stateId: 'PA',
    category: 'biodiversidade',
    questionPt: 'Qual arquipélago fluvial-marítimo no Pará, na foz do Rio Amazonas, é a maior ilha fluviomarítima do planeta?',
    optionsPt: ['Ilha do Marajó', 'Ilha de Fernando de Noronha', 'Ilha Grande', 'Ilha de Santa Catarina'],
    correctIndex: 0,
    explanationPt: 'A Ilha do Marajó possui tamanho superior ao da Suíça, famosa pela cerâmica marajoara ancestral e pela imensa criação de búfalos.',
  },
  {
    id: 'pa_03',
    stateId: 'PA',
    category: 'cultura_sabores',
    questionPt: 'Qual ingrediente da folha de mandioca-brava cozida por 7 dias inteiros para eliminar o ácido cianídrico é a base da autêntica maniçoba paraense?',
    optionsPt: ['Maniva', 'Tucupi', 'Jambu', 'Urucum'],
    correctIndex: 0,
    explanationPt: 'A maniva é moída e fervida rigorosamente por sete dias antes de receber carnes suínas, criando a lendária feijoada paraense (Maniçoba).',
  },

  // ==========================================
  // PARAÍBA (PB)
  // ==========================================
  {
    id: 'pb_01',
    stateId: 'PB',
    category: 'geografia',
    questionPt: 'A Ponta do Seixas, em João Pessoa, possui qual distinção geográfica oficial em todo o continente americano?',
    optionsPt: ['Ponto mais oriental (a leste) das Américas onde o sol nasce primeiro', 'Ponto mais alto do Brasil', 'Ponto mais ocidental da América do Sul', 'Centro geográfico do Atlântico'],
    correctIndex: 0,
    explanationPt: 'A Ponta do Seixas (longitude 34° 47\' W) é o extremo leste de toda a massa continental das Américas, dando a João Pessoa o lema "Onde o Sol nasce primeiro".',
  },
  {
    id: 'pb_02',
    stateId: 'PB',
    category: 'cultura_sabores',
    questionPt: 'Qual município do agreste paraibano realiza no Parque do Povo o evento autoproclamado "O Maior São João do Mundo"?',
    optionsPt: ['Campina Grande', 'Patos', 'Sousa', 'Guarabira'],
    correctIndex: 0,
    explanationPt: 'Campina Grande realiza 30 dias ininterruptos de festa junina no Parque do Povo com centenas de quadrilhas e trios de forró pé-de-serra.',
  },
  {
    id: 'pb_03',
    stateId: 'PB',
    category: 'biodiversidade',
    questionPt: 'No sertão da Paraíba, o Monumento Natural Vale dos Dinossauros em Sousa preserva qual raridade paleontológica internacional?',
    optionsPt: ['Centenas de pegadas fossilizadas de dinossauros do Cretáceo', 'Fósseis de preguiças gigantes marinhas', 'Árvores petrificadas da era jurássica', 'Crânios de tigres dente-de-sabre'],
    correctIndex: 0,
    explanationPt: 'O Vale dos Dinossauros em Sousa possui a mais longa trilha contínua de pegadas de dinossauros carnívoros e herbívoros do mundo.',
  },

  // ==========================================
  // PARANÁ (PR)
  // ==========================================
  {
    id: 'pr_01',
    stateId: 'PR',
    category: 'geografia',
    questionPt: 'Localizadas em Foz do Iguaçu (PR), na fronteira com a Argentina, qual conjunto de 275 quedas d’água foi eleito uma das Novas 7 Maravilhas da Natureza?',
    optionsPt: ['Cataratas do Iguaçu', 'Salto Yucumã', 'Cachoeira do Tabuleiro', 'Salto São Francisco'],
    correctIndex: 0,
    explanationPt: 'As Cataratas do Iguaçu, no Parque Nacional do Iguaçu, formam uma das maiores descargas de água do planeta, abrigando a célebre Garganta do Diabo.',
  },
  {
    id: 'pr_02',
    stateId: 'PR',
    category: 'cultura_sabores',
    questionPt: 'Qual prato típico do litoral paranaense (Antonina e Morretes) é preparado com carne bovina cozida por mais de 12 horas em panela de barro selada com pirão de farinha?',
    optionsPt: ['Barreado', 'Churrasco Fogo de Chão', 'Feijão Tropeiro', 'Arroz com Suã'],
    correctIndex: 0,
    explanationPt: 'O Barreado é servido fervendo com farinha de mandioca e fatias de banana, originário dos tropeiros e fandangueiros litorâneos.',
  },
  {
    id: 'pr_03',
    stateId: 'PR',
    category: 'biodiversidade',
    questionPt: 'Qual ave de plumagem azul cobalto e cabeça preta é a ave símbolo do Paraná, famosa por plantar sementes de pinhão na Mata de Araucárias?',
    optionsPt: ['Gralha-Azul (Cyanocorax caeruleus)', 'Tuiuiú', 'Uirapuru', 'Carcará'],
    correctIndex: 0,
    explanationPt: 'A Gralha-Azul enterra pinhões no solo para consumir depois; as sementes esquecidas germinam, mantendo viva a Floresta de Araucárias.',
  },

  // ==========================================
  // PERNAMBUCO (PE)
  // ==========================================
  {
    id: 'pe_01',
    stateId: 'PE',
    category: 'cultura_sabores',
    questionPt: 'Qual ritmo e dança acrobática centenária de som acelerado de metais e guarda-chuvas coloridos é Patrimônio Cultural Imaterial da Humanidade pela UNESCO?',
    optionsPt: ['Frevo de Olinda e Recife', 'Bossa Nova', 'Sertanejo', 'Vanerão'],
    correctIndex: 0,
    explanationPt: 'O Frevo nasceu no final do século XIX nas ruas de Recife da rivalidade entre bandas marciais e capoeiristas com passos ágeis que "fervem" o asfalto.',
  },
  {
    id: 'pe_02',
    stateId: 'PE',
    category: 'historia_herois',
    questionPt: 'A Revolução Pernambucana de 1817 proclamou uma república independente do domínio colonial português durante mais de 70 dias. Qual era sua inspiração?',
    optionsPt: ['Os ideais iluministas de liberdade, igualdade e imprensa livre', 'A restauração monárquica espanhola', 'A união militar com a Inglaterra', 'O absolutismo luso'],
    correctIndex: 0,
    explanationPt: 'A Revolução de 1817 fundou uma república em Pernambuco com constituição provisória e liberdade religiosa, marcando a história libertária do estado.',
  },
  {
    id: 'pe_03',
    stateId: 'PE',
    category: 'biodiversidade',
    questionPt: 'Qual arquipélago vulcânico paradisíaco pertencente a Pernambuco é considerado santuário ecológico de golfinhos-rotadores e tartarugas-marinhas?',
    optionsPt: ['Fernando de Noronha', 'Atol das Rocas', 'Ilha de Marajó', 'Ilhas Cagarras'],
    correctIndex: 0,
    explanationPt: 'Fernando de Noronha tem a Baía do Sancho (eleita repetidas vezes a melhor praia do mundo) e rigoroso controle ambiental de visitação.',
  },

  // ==========================================
  // PIAUÍ (PI)
  // ==========================================
  {
    id: 'pi_01',
    stateId: 'PI',
    category: 'historia_herois',
    questionPt: 'Qual parque nacional no Piauí, tombado pela UNESCO, guarda a maior concentração de sítios pré-históricos e pinturas rupestres das Américas?',
    optionsPt: ['Parque Nacional Serra da Capivara', 'Parque Nacional de Ubajara', 'Parque Nacional da Chapada das Mesas', 'Parque Nacional do Catimbau'],
    correctIndex: 0,
    explanationPt: 'Pesquisado pela arqueóloga Niède Guidon, a Serra da Capivara revolucionou a teoria do povoamento das Américas com vestígios milenares.',
  },
  {
    id: 'pi_02',
    stateId: 'PI',
    category: 'historia_herois',
    questionPt: 'Em 13 de março de 1823, sertanejos piauienses enfrentaram armados de foices e facões as tropas portuguesas do Major Fidié em qual sangrenta batalha pela independência?',
    optionsPt: ['Batalha do Jenipapo', 'Batalha dos Guararapes', 'Batalha do Seival', 'Guerra dos Mascates'],
    correctIndex: 0,
    explanationPt: 'A Batalha do Jenipapo em Campo Maior/PI foi decisiva para manter a unidade territorial e consolidar a independência do Norte do Brasil.',
  },
  {
    id: 'pi_03',
    stateId: 'PI',
    category: 'geografia',
    questionPt: 'O Rio Parnaíba forma na divisa do Piauí com o Maranhão o único delta em mar aberto de todas as Américas, conhecido como:',
    optionsPt: ['Delta das Américas (Delta do Parnaíba)', 'Delta do Amazonas', 'Delta do São Francisco', 'Delta do Prata'],
    correctIndex: 0,
    explanationPt: 'O Delta do Parnaíba se abre em cinco braços fluviais em direção ao Oceano Atlântico, formando mais de 70 ilhas entre dunas e manguezais.',
  },

  // ==========================================
  // RIO DE JANEIRO (RJ)
  // ==========================================
  {
    id: 'rj_01',
    stateId: 'RJ',
    category: 'simbolos',
    questionPt: 'Erguida no alto do Morro do Corcovado no Parque Nacional da Tijuca, qual estátua art déco foi eleita uma das 7 Maravilhas do Mundo Moderno?',
    optionsPt: ['Cristo Redentor', 'Estátua da Liberdade', 'Monumento aos Pracinhas', 'Colosso da Guanabara'],
    correctIndex: 0,
    explanationPt: 'Inaugurado em 12 de outubro de 1931, o Cristo Redentor tem 38 metros de altura e braços abertos sobre a Baía de Guanabara.',
  },
  {
    id: 'rj_02',
    stateId: 'RJ',
    category: 'cultura_sabores',
    questionPt: 'Qual gênero musical genuinamente carioca do final do século XIX floresceu nas rodas da Praça Onze e Tia Ciata, considerado Patrimônio Imaterial do Brasil?',
    optionsPt: ['Samba Urbano Carioca', 'Frevo', 'Vanerão', 'Baião'],
    correctIndex: 0,
    explanationPt: 'Na casa de Tia Ciata nasceu "Pelo Telefone" (1916), consolidando o samba como a grande identidade musical brasileira.',
  },
  {
    id: 'rj_03',
    stateId: 'RJ',
    category: 'historia_herois',
    questionPt: 'Por que o Rio de Janeiro foi a única cidade fora do continente europeu a sediar oficialmente a corte e a capital de um império europeu?',
    optionsPt: ['Pela transferência da Família Real Portuguesa fugindo das Guerras Napoleônicas em 1808', 'Por conquista militar dos franceses', 'Por um acordo comercial com a Espanha', 'Pelo Tratado de Versalhes'],
    correctIndex: 0,
    explanationPt: 'D. João VI instalou a sede do Império Português no Rio de Janeiro em 1808, abrindo os portos às nações amigas e criando o Banco do Brasil e o Jardim Botânico.',
  },

  // ==========================================
  // RIO GRANDE DO NORTE (RN)
  // ==========================================
  {
    id: 'rn_01',
    stateId: 'RN',
    category: 'geografia',
    questionPt: 'Qual cidade do litoral sul potiguar (Pirangi do Norte) abriga o Maior Cajueiro do Mundo, cobrindo cerca de 8.500 m² de copa verde?',
    optionsPt: ['Parnamirim', 'Mossoró', 'Caicó', 'Ceará-Mirim'],
    correctIndex: 0,
    explanationPt: 'Uma anomalia genética faz os galhos do cajueiro crescerem para os lados e tocarem o solo, criando novas raízes como se fossem múltiplos troncos.',
  },
  {
    id: 'rn_02',
    stateId: 'RN',
    category: 'historia_herois',
    questionPt: 'Qual cidade potiguar expulsou a tiros o bando de Lampião em 1927 e foi pioneira no voto feminino na América Latina com Celina Guimarães Viana?',
    optionsPt: ['Mossoró', 'Natal', 'Touros', 'Macau'],
    correctIndex: 0,
    explanationPt: 'Mossoró derrotou o rei do cangaço em 1927 e garantiu o primeiro voto feminino do Brasil em 1928, marcando a história dos direitos civis.',
  },
  {
    id: 'rn_03',
    stateId: 'RN',
    category: 'historia_herois',
    questionPt: 'Durante a Segunda Guerra Mundial, Natal (RN) recebeu a maior base aérea militar dos EUA fora do território americano, conhecida como:',
    optionsPt: ['O Trampolim da Vitória (Parnamirim Field)', 'Base de Guanabara', 'Campo de Marte', 'Base de Alcântara'],
    correctIndex: 0,
    explanationPt: 'Pela posição estratégica no extremo nordeste próxima à África, Natal serviu de ponte aérea vital para os aviões aliados abastecerem o front europeu.',
  },

  // ==========================================
  // RIO GRANDE DO SUL (RS)
  // ==========================================
  {
    id: 'rs_01',
    stateId: 'RS',
    category: 'historia_herois',
    questionPt: 'Qual conflito armado republicano durou de 1835 a 1845 no Rio Grande do Sul, sendo a mais longa revolta civil da história do Brasil?',
    optionsPt: ['Revolução Farroupilha (Guerra dos Farrapos)', 'Revolta da Chibata', 'Cabanagem', 'Balaiada'],
    correctIndex: 0,
    explanationPt: 'Liderada por Bento Gonçalves, Giuseppe Garibaldi e Davi Canabarro, a Guerra dos Farrapos proclamou a República Rio-Grandense e durou dez anos.',
  },
  {
    id: 'rs_02',
    stateId: 'RS',
    category: 'cultura_sabores',
    questionPt: 'Qual ritual gaúcho herdado dos povos originários guaranis é consumido em cuia com bomba de prata e água quente a 75°C?',
    optionsPt: ['O Chimarrão', 'O Café de Cambona', 'O Quentão de Vinho', 'O Tereré'],
    correctIndex: 0,
    explanationPt: 'O Chimarrão é símbolo oficial de hospitalidade e amizade do povo gaúcho, regulamentado como bebida cívica do Rio Grande do Sul.',
  },
  {
    id: 'rs_03',
    stateId: 'RS',
    category: 'biodiversidade',
    questionPt: 'Qual bioma campestre brasileiro é exclusivo do Rio Grande do Sul, caracterizado por planícies com gramíneas e rica avifauna?',
    optionsPt: ['Pampa (Campos Sulinos)', 'Cerrado', 'Pantanal', 'Caatinga'],
    correctIndex: 0,
    explanationPt: 'O Pampa cobre mais de 60% do território gaúcho e abriga o habitat de quero-queros, veados-campeiros e do gado pastando solto nas estâncias.',
  },

  // ==========================================
  // RONDÔNIA (RO)
  // ==========================================
  {
    id: 'ro_01',
    stateId: 'RO',
    category: 'historia_herois',
    questionPt: 'Qual histórica ferrovia de 366 km foi construída entre 1907 e 1912 na selva amazônica para escoar a borracha boliviana, conhecida como a "Ferrovia do Diabo"?',
    optionsPt: ['Estrada de Ferro Madeira-Mamoré (EFMM)', 'Estrada de Ferro Vitória a Minas', 'Estrada de Ferro Central do Brasil', 'Ferrovia Norte-Sul'],
    correctIndex: 0,
    explanationPt: 'A Madeira-Mamoré custou milhares de vidas de operários do mundo inteiro devido a febres tropicais, tornando-se epopeia da engenharia no coração da Amazônia.',
  },
  {
    id: 'ro_02',
    stateId: 'RO',
    category: 'historia_herois',
    questionPt: 'Rondônia deve seu nome a qual militar, sertanista e indigenista brasileiro que estendeu linhas telegráficas pela Amazônia com o lema "Morrer se preciso for, matar nunca"?',
    optionsPt: ['Marechal Cândido Mariano da Silva Rondon', 'Barão de Mauá', 'Duque de Caxias', 'Euclides da Cunha'],
    correctIndex: 0,
    explanationPt: 'O Marechal Rondon desbravou o interior do Brasil respeitando os povos indígenas e fundou o Serviço de Proteção aos Índios.',
  },
  {
    id: 'ro_03',
    stateId: 'RO',
    category: 'geografia',
    questionPt: 'Qual colossal fortaleza em formato de estrela, erguida às margens do Rio Guaporé em 1783, é um dos mais imponentes fortes militares do interior brasileiro?',
    optionsPt: ['Forte Príncipe da Beira', 'Fortaleza de São José', 'Forte de Santa Catarina', 'Forte dos Reis Magos'],
    correctIndex: 0,
    explanationPt: 'O Real Forte Príncipe da Beira, no município de Costa Marques, defendia a fronteira entre os domínios de Portugal e Espanha na bacia do Guaporé.',
  },

  // ==========================================
  // RORAIMA (RR)
  // ==========================================
  {
    id: 'rr_01',
    stateId: 'RR',
    category: 'geografia',
    questionPt: 'Qual imponente montanha de topo plano (tepui) com 2.810 metros localiza-se na tríplice fronteira entre Brasil, Venezuela e Guiana?',
    optionsPt: ['Monte Roraima', 'Pico da Neblina', 'Pico das Agulhas Negras', 'Pedra da Mina'],
    correctIndex: 0,
    explanationPt: 'O Monte Roraima é uma das formações geológicas mais antigas da Terra (cerca de 2 bilhões de anos), inspirando a obra "O Mundo Perdido" de Arthur Conan Doyle.',
  },
  {
    id: 'rr_02',
    stateId: 'RR',
    category: 'geografia',
    questionPt: 'Boa Vista, capital de Roraima, detém qual distinção geográfica única entre todas as capitais estaduais do Brasil?',
    optionsPt: ['É a única capital brasileira localizada inteiramente ao norte da Linha do Equador', 'É a capital mais fria do Brasil', 'É a capital com menor extensão territorial', 'É a única capital sem rios navegáveis'],
    correctIndex: 0,
    explanationPt: 'Boa Vista situa-se a 2° 49\' de latitude norte, sendo a única capital estadual do Brasil no Hemisfério Setentrional.',
  },
  {
    id: 'rr_03',
    stateId: 'RR',
    category: 'biodiversidade',
    questionPt: 'Qual ecossistema de savana aberta cobre grande parte do nordeste de Roraima, contrastando com a densa Floresta Amazônica ao redor?',
    optionsPt: ['Lavrado (Campos de Roraima)', 'Pampa Sulino', 'Pantanal', 'Caatinga'],
    correctIndex: 0,
    explanationPt: 'O Lavrado de Roraima abriga buritizais, lagoas sazonais e espécies endêmicas adaptadas ao solo arenoso de savana.',
  },

  // ==========================================
  // SANTA CATARINA (SC)
  // ==========================================
  {
    id: 'sc_01',
    stateId: 'SC',
    category: 'clima',
    questionPt: 'Cidades como São Joaquim e Urupema, no planalto serrano catarinense, são conhecidas nacionalmente por qual fenômeno meteorológico de inverno?',
    optionsPt: ['Queda regular de neve e temperaturas negativas', 'Formação de furacões tropicais de verão', 'Secas severas que secam rios', 'Tempestades de areia'],
    correctIndex: 0,
    explanationPt: 'A altitude superior a 1.300 metros combinada a frentes polares faz da Serra Catarinense a região mais fria do Brasil, com registros frequentes de neve e geadas severas.',
  },
  {
    id: 'sc_02',
    stateId: 'SC',
    category: 'historia_herois',
    questionPt: 'Anita Garibaldi, heroína catarinense nascida em Laguna, lutou com bravura na Revolução Farroupilha e na unificação de qual país europeu?',
    optionsPt: ['Itália', 'França', 'Espanha', 'Portugal'],
    correctIndex: 0,
    explanationPt: 'Ao lado de Giuseppe Garibaldi, Anita lutou nas batalhas do Risorgimento italiano, recebendo o título honorífico de "Heroína dos Dois Mundos".',
  },
  {
    id: 'sc_03',
    stateId: 'SC',
    category: 'biodiversidade',
    questionPt: 'O litoral de Santa Catarina (como Garopaba e Imbituba) recebe anualmente entre julho e novembro qual gigante dos mares para reprodução e amamentação?',
    optionsPt: ['Baleia-Franca-Austral (Eubalaena australis)', 'Tubarão-Branco', 'Peixe-Boi-da-Amazônia', 'Foca-Monge'],
    correctIndex: 0,
    explanationPt: 'A Área de Proteção Ambiental da Baleia-Franca acolhe fêmeas que migram da Antártica para ter seus filhotes nas enseadas abrigadas catarinenses.',
  },

  // ==========================================
  // SÃO PAULO (SP)
  // ==========================================
  {
    id: 'sp_01',
    stateId: 'SP',
    category: 'historia_herois',
    questionPt: 'Em 7 de setembro de 1822, às margens do Riacho do Ipiranga em São Paulo, qual brado histórico proclamou a Independência do Brasil?',
    optionsPt: ['"Independência ou Morte!" por D. Pedro I', '"Liberdade ainda que tardia" por Tiradentes', '"Abaixo a Coroa" por Bento Gonçalves', '"Ordem e Progresso" por Benjamin Constant'],
    correctIndex: 0,
    explanationPt: 'O Príncipe Regente D. Pedro proferiu o Grito do Ipiranga rompendo os laços coloniais com Portugal e fundando o Império do Brasil.',
  },
  {
    id: 'sp_02',
    stateId: 'SP',
    category: 'cultura_sabores',
    questionPt: 'Realizada no Theatro Municipal de São Paulo em fevereiro de 1922, qual evento revolucionou as artes plásticas, literatura e música no Brasil?',
    optionsPt: ['Semana de Arte Moderna (Modernismo)', 'Festa do Choro Paulista', 'Bienal do Livro Imperial', 'Movimento da Tropicália'],
    correctIndex: 0,
    explanationPt: 'Mário de Andrade, Oswald de Andrade, Anita Malfatti, Tarsila do Amaral e Villa-Lobos romperam com o academicismo e fundaram a estética moderna brasileira.',
  },
  {
    id: 'sp_03',
    stateId: 'SP',
    category: 'geografia',
    questionPt: 'Qual rodovia pioneira venceu a escarpa íngreme da Serra do Mar ligando a capital paulista ao Porto de Santos com túneis e viadutos arrojados?',
    optionsPt: ['Rodovia dos Imigrantes e Rodovia Anchieta', 'Rodovia Presidente Dutra', 'Rodovia Castelo Branco', 'Rodovia Transamazônica'],
    correctIndex: 0,
    explanationPt: 'O Sistema Anchieta-Imigrantes é um triunfo da engenharia viária que desce mais de 700 metros de desnível conectando a metrópole ao maior porto da América Latina.',
  },

  // ==========================================
  // SERGIPE (SE)
  // ==========================================
  {
    id: 'se_01',
    stateId: 'SE',
    category: 'geografia',
    questionPt: 'Sergipe detém qual particularidade territorial em relação a todas as demais Unidades Federativas do Brasil?',
    optionsPt: ['É o menor estado brasileiro em extensão territorial', 'É o estado com maior número de municípios', 'É o único estado sem litoral marinho', 'É o estado com maior população rural'],
    correctIndex: 0,
    explanationPt: 'Com cerca de 21.900 km², Sergipe é o menor estado da federação, conhecido por suas belezas coloniais, praias tranquilas e culinária de caranguejo.',
  },
  {
    id: 'se_02',
    stateId: 'SE',
    category: 'historia_herois',
    questionPt: 'A cidade sergipana de São Cristóvão abriga a Praça São Francisco, tombada pela UNESCO, que preserva qual período histórico único?',
    optionsPt: ['O período da União Ibérica (quando Portugal e Espanha foram unificados sob a mesma coroa)', 'O ciclo da borracha', 'A época de fundação de Brasília', 'O ciclo do café paulista'],
    correctIndex: 0,
    explanationPt: 'A Praça São Francisco em São Cristóvão (antiga capital de Sergipe) é um modelo ímpar de traçado urbano espanhol instituído em território luso.',
  },
  {
    id: 'se_03',
    stateId: 'SE',
    category: 'cultura_sabores',
    questionPt: 'Na Passarela do Caranguejo, na Praia de Atalaia em Aracaju, qual crustáceo é o ícone da culinária servido na água e sal com vinagrete e pirão?',
    optionsPt: ['Caranguejo-Uçá', 'Lagosta Real', 'Camarão-Pitu', 'Ostra de Mangue'],
    correctIndex: 0,
    explanationPt: 'O caranguejo-uçá quebrado com martelinhos de madeira na orla de Aracaju é uma paixão e tradição cultural de todos os sergipanos.',
  },

  // ==========================================
  // TOCANTINS (TO)
  // ==========================================
  {
    id: 'to_01',
    stateId: 'TO',
    category: 'historia_herois',
    questionPt: 'O estado do Tocantins foi criado por qual marco legal da história democrática brasileira, emancipando-se do norte de Goiás?',
    optionsPt: ['Constituição Cidadã de 1988', 'Proclamação da República em 1889', 'Revolução de 1930', 'Golpe de 1964'],
    correctIndex: 0,
    explanationPt: 'A Constituição Federal de 1988 consagrou a criação do Tocantins, o estado mais jovem do Brasil, cuja capital planejada (Palmas) foi fundada em 1989.',
  },
  {
    id: 'to_02',
    stateId: 'TO',
    category: 'biodiversidade',
    questionPt: 'Qual parque estadual tocantinense é famoso pelas dunas alaranjadas de quartzo, fervedouros de água que impedem o corpo de afundar e artesanato de capim-dourado?',
    optionsPt: ['Jalapão', 'Serra da Canastra', 'Chapada dos Guimarães', 'Parque do Cantão'],
    correctIndex: 0,
    explanationPt: 'O Jalapão é um dos principais destinos ecoturísticos do Brasil, com fervedouros límpidos e o capim-dourado que só brota nos campos úmidos do cerrado tocantinense.',
  },
  {
    id: 'to_03',
    stateId: 'TO',
    category: 'geografia',
    questionPt: 'Localizada no sudoeste do Tocantins entre os rios Araguaia e Javaés, qual é a maior ilha fluvial do mundo?',
    optionsPt: ['Ilha do Bananal', 'Ilha de Marajó', 'Ilha Grande', 'Ilha de Tupinambarana'],
    correctIndex: 0,
    explanationPt: 'A Ilha do Bananal tem cerca de 20.000 km², cercada por rios de água doce e protegida pelo Parque Nacional do Araguaia e terras indígenas Karajá e Javaé.',
  },
];

/**
 * Retorna 1 pergunta aleatória isolada, estritamente do estado solicitado
 */
export function getRandomStateHonorQuestion(stateId: string): StateQuizQuestion {
  const normState = stateId.toUpperCase();
  const list = STATE_DEDICATED_QUESTIONS.filter((q) => q.stateId === normState);

  if (list.length > 0) {
    const randIdx = Math.floor(Math.random() * list.length);
    return shuffleQuestionOptions(list[randIdx]);
  }

  // Fallback seguro pegando das perguntas do próprio guardião se houver
  const guardian = GUARDIANS_DATA.find((g) => g.id === normState);
  if (guardian && guardian.questions && guardian.questions.length > 0) {
    const q = guardian.questions[Math.floor(Math.random() * guardian.questions.length)];
    return shuffleQuestionOptions({
      id: `${normState.toLowerCase()}_honor_fallback`,
      stateId: normState,
      category: 'cultura_sabores',
      questionPt: q.questionPt,
      optionsPt: [...q.optionsPt],
      correctIndex: q.correctIndex,
      explanationPt: q.explanationPt,
    });
  }

  // Fallback genérico garantido
  return shuffleQuestionOptions({
    id: `${normState}_generic`,
    stateId: normState,
    category: 'geografia',
    questionPt: `Qual é a capital e principal centro administrativo do estado (${normState})?`,
    optionsPt: [
      guardian?.capitalPt || 'Capital do Estado',
      'Porto Alegre',
      'Salvador',
      'Manaus',
    ],
    correctIndex: 0,
    explanationPt: `A capital de ${guardian?.stateNamePt || normState} é ${guardian?.capitalPt}.`,
  });
}

/**
 * Retorna uma lista de perguntas paginadas para a Campanha Estadual Completa
 */
export function getStateCampaignQuestions(stateId: string, count = 5): StateQuizQuestion[] {
  const normState = stateId.toUpperCase();
  let pool = STATE_DEDICATED_QUESTIONS.filter((q) => q.stateId === normState);

  // Se o estado tiver menos perguntas que o desejado, complementa com as perguntas do Guardião
  const guardian = GUARDIANS_DATA.find((g) => g.id === normState);
  if (guardian && guardian.questions) {
    guardian.questions.forEach((gq, idx) => {
      if (!pool.some((p) => p.questionPt === gq.questionPt)) {
        pool.push({
          id: `${normState.toLowerCase()}_gq_${idx}`,
          stateId: normState,
          category: idx % 2 === 0 ? 'historia_herois' : 'cultura_sabores',
          questionPt: gq.questionPt,
          optionsPt: [...gq.optionsPt],
          correctIndex: gq.correctIndex,
          explanationPt: gq.explanationPt,
        });
      }
    });
  }

  // Se ainda precisar de mais perguntas para completar o lote solicitado, gera perguntas adicionais baseadas no rico acervo do estado
  if (pool.length < count && guardian) {
    if (guardian.faunaPt) {
      pool.push({
        id: `${normState.toLowerCase()}_synth_fauna`,
        stateId: normState,
        category: 'biodiversidade',
        questionPt: `Qual espécie emblemática da fauna nativa é protegida nos ecossistemas de ${guardian.stateNamePt}?`,
        optionsPt: [guardian.faunaPt, 'Urso Polar', 'Canguru Australiano', 'Pinguim Imperador'],
        correctIndex: 0,
        explanationPt: `Os ecossistemas de ${guardian.stateNamePt} abrigam ${guardian.faunaPt}.`,
      });
    }

    if (guardian.typicalDishPt) {
      pool.push({
        id: `${normState.toLowerCase()}_synth_dish`,
        stateId: normState,
        category: 'cultura_sabores',
        questionPt: `Qual é o prato típico tradicional que consagra a gastronomia e a identidade de ${guardian.stateNamePt}?`,
        optionsPt: [guardian.typicalDishPt, 'Hambúrguer Fast Food', 'Sushi Japonês', 'Croissant Francês'],
        correctIndex: 0,
        explanationPt: `${guardian.typicalDishPt} é o prato clássico apreciado em ${guardian.stateNamePt}.`,
      });
    }

    if (guardian.anthemTitle) {
      pool.push({
        id: `${normState.toLowerCase()}_synth_anthem`,
        stateId: normState,
        category: 'simbolos',
        questionPt: `O que entoam os versos solenes da canção cívica "${guardian.anthemTitle}" em ${guardian.stateNamePt}?`,
        optionsPt: [
          guardian.anthemLyricsPt || 'Versos de exaltação ao brio e à glória da terra natal',
          'Letra comercial de rádio estrangeiro',
          'Cantigas infantis de ninar',
          'Sons eletrônicos modernos sem letra cívica',
        ],
        correctIndex: 0,
        explanationPt: `O hino estadual de ${guardian.stateNamePt} ressalta as virtudes, lutas históricas e o amor à pátria de sua gente.`,
      });
    }
  }

  // Shuffle das questões da campanha
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Retorna com as alternativas de cada pergunta embaralhadas aleatoriamente
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q) => shuffleQuestionOptions(q));
}
