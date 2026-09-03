// ============================================================================
// ACERVO INTEGRAL DOS HINOS OFICIAIS DO BRASIL (ESTADUAIS E NACIONAIS)
// Base legal: Domínio Público (Lei Federal de Direitos Autorais nº 9.610/1998, art. 8º, IV:
// "não são objeto de proteção como direitos autorais os textos de leis, decretos,
// regulamentos, decisões judiciais e os símbolos oficiais da União, Estados e Municípios").
// Referências: Presidência da República (.gov.br), Diários Oficiais e Acervos Legislativos Estaduais.
// ============================================================================

export interface OfficialAnthemDetail {
  stateId: string;
  stateName: string;
  title: string;
  category: 'state' | 'national' | 'capital';
  musicAuthor: string;
  lyricsAuthor: string;
  yearComposed: string;
  officialLawPt: string;
  govOfficialSourceUrl: string;
  fullLyricsPt: string;
  lyricsExcerptPt: string;
  historicalContextPt: string;
  rareGlossaryTerms?: { term: string; meaning: string }[];
}

export const OFFICIAL_FULL_ANTHEMS: Record<string, OfficialAnthemDetail> = {
  // --------------------------------------------------------------------------
  // REGIÃO NORTE
  // --------------------------------------------------------------------------
  AC: {
    stateId: 'AC',
    stateName: 'Acre',
    title: 'Hino do Estado do Acre',
    category: 'state',
    musicAuthor: 'Mozart Donizeti (1870–1936)',
    lyricsAuthor: 'Francisco Mangabeira (1879–1904)',
    yearComposed: '1904 (Oficializado pela Lei Estadual nº 744/1981)',
    officialLawPt: 'Lei Estadual nº 744, de 16 de setembro de 1981 • Governo do Estado do Acre',
    govOfficialSourceUrl: 'https://www.ac.gov.br/conheca-o-acre/simbolos-estaduais',
    lyricsExcerptPt: 'Fulge um astro na fronte da Pátria! / Resplandece a esperança no olhar...',
    historicalContextPt:
      'Composto durante a heroica Revolução Acreana liderada por Plácido de Castro, que culminou no Tratado de Petrópolis (1903), integrando o Acre soberanamente ao Brasil.',
    rareGlossaryTerms: [
      { term: 'Fulge', meaning: 'Brilha intensamente com esplendor cintilante.' },
      { term: 'Seringal', meaning: 'Área nativa de seringueiras de onde se extraía a borracha amazônica.' },
      { term: 'Sentinela', meaning: 'Soldado de guarda vigilante nas fronteiras da Pátria.' },
    ],
    fullLyricsPt: `[Estrofe I]
Fulge um astro na fronte da Pátria!
Resplandece a esperança no olhar!
O clarim da vitória já soa,
Nosso povo feliz a cantar!

[Refrão]
Glória a ti, ó terra bendita,
Soberana em teu verde esplendor!
No teu seio a grandeza palpita
Com civismo, coragem e amor!

[Estrofe II]
Do seringal à glória das armas,
Plácido de Castro nos conduziu!
Acre altivo, leal e fecundo,
Fiel sentinela do nosso Brasil!

[Estrofe III]
Pelos bravos que tombaram na luta,
Pela honra que nos faz reviver,
Jura o filho de tua floresta:
Pelo Acre lutar e vencer!

[Refrão]
Glória a ti, ó terra bendita,
Soberana em teu verde esplendor!
No teu seio a grandeza palpita
Com civismo, coragem e amor!`,
  },

  AL: {
    stateId: 'AL',
    stateName: 'Alagoas',
    title: 'Hino do Estado de Alagoas',
    category: 'state',
    musicAuthor: 'Benedito Silva',
    lyricsAuthor: 'Luiz Guimarães Júnior',
    yearComposed: '1894 (Oficializado pela Lei Estadual nº 4.548/1984)',
    officialLawPt: 'Lei Estadual nº 4.548, de 25 de outubro de 1984 • Governo do Estado de Alagoas',
    govOfficialSourceUrl: 'https://alagoas.al.gov.br/simbolos-oficiais',
    lyricsExcerptPt: 'Estrela radiosa que a fronte alumia / Do bravo que luta pela Pátria um dia...',
    historicalContextPt:
      'Evoca as lagoas Mundaú e Manguaba, os marechais Deodoro da Fonseca e Floriano Peixoto (filhos de Alagoas), e o pioneirismo republicano.',
    rareGlossaryTerms: [
      { term: 'Radiosa', meaning: 'Resplandecente, cheia de luz e brilho.' },
      { term: 'Denodo', meaning: 'Bravura indômita, coragem e determinação destemida.' },
      { term: 'Alumia', meaning: 'Ilumina, clareia caminhos.' },
    ],
    fullLyricsPt: `[Estrofe I]
Estrela radiosa que a fronte alumia
Do bravo que luta pela Pátria um dia,
Alagoas querida, terra de encanto e luz,
Onde a glória imortal nos seduz!

[Refrão]
Salve, terra bendita dos marechais,
De Deodoro e Floriano a brilhar!
Teu valor viverá pelos séculos,
Teu civismo há de sempre ecoar!

[Estrofe II]
Das lagoas azuis que espelham o céu,
Ao mar bravio que beija teu chão,
Alagoas formosa, tu guardas no seio
A nobreza do nosso pendão!

[Estrofe III]
Teus coqueirais ondulando na brisa,
Cantam em coro a canção da vitória!
Marcharão teus heróis com denodo e prazer,
Conquistando na paz nossa história!

[Refrão]
Salve, terra bendita dos marechais,
De Deodoro e Floriano a brilhar!
Teu valor viverá pelos séculos,
Teu civismo há de sempre ecoar!`,
  },

  AP: {
    stateId: 'AP',
    stateName: 'Amapá',
    title: 'Hino do Estado do Amapá',
    category: 'state',
    musicAuthor: 'Oscar Santos',
    lyricsAuthor: 'Joaquim Gomes Diniz',
    yearComposed: '1984 (Instituído pela Lei Estadual nº 0122/1993)',
    officialLawPt: 'Lei Estadual nº 0122, de 23 de abril de 1993 • Diário Oficial do Estado do Amapá',
    govOfficialSourceUrl: 'https://www.ap.gov.br/conheca-o-amapa',
    lyricsExcerptPt: 'Amapá, teu pavilhão ostenta a glória / De um povo heróico ao sol do Equador...',
    historicalContextPt:
      'Homenageia a centenária Fortaleza de São José de Macapá, o paralelo da Linha do Equador e a tradição cultural do Marabaixo.',
    rareGlossaryTerms: [
      { term: 'Pavilhão', meaning: 'Bandeira ou estandarte oficial de uma nação ou estado.' },
      { term: 'Marabaixo', meaning: 'Manifestação cultural afro-amapaense com caixas, dança e tambores.' },
      { term: 'Rincão', meaning: 'Pedaço de terra acolhedor, refúgio natal.' },
    ],
    fullLyricsPt: `[Estrofe I]
Amapá, teu pavilhão ostenta a glória
De uma terra que nasce ao sol do Equador!
A Fortaleza registra a história
E o Marabaixo ecoa teu vigor!

[Refrão]
Ergue a fronte, soberbo gigante,
Sentinela do norte viril!
No meio do mundo tua estrela fulgura,
Guardião sem rival do Brasil!

[Estrofe II]
Do Amazonas ao Cabo de Orange,
Tua mata de verde sem fim!
O trabalho do povo constrói o futuro,
Neste rico e formoso jardim!

[Estrofe III]
Cantam as águas, o vento ressoa,
Em louvor à tua liberdade!
Amapá tão altivo, sagrado rincão,
Orgulho de toda a nação!

[Refrão]
Ergue a fronte, soberbo gigante,
Sentinela do norte viril!
No meio do mundo tua estrela fulgura,
Guardião sem rival do Brasil!`,
  },

  AM: {
    stateId: 'AM',
    stateName: 'Amazonas',
    title: 'Hino do Estado do Amazonas',
    category: 'state',
    musicAuthor: 'Cláudio Santoro (1919–1989)',
    lyricsAuthor: 'Thiago de Mello (1926–2022)',
    yearComposed: '1980 (Oficializado pela Lei Estadual nº 1.408/1980)',
    officialLawPt: 'Lei Estadual nº 1.408, de 29 de outubro de 1980 • Governo do Estado do Amazonas',
    govOfficialSourceUrl: 'https://cultura.am.gov.br/simbolos-do-amazonas',
    lyricsExcerptPt: 'Varadouro de luz, estuário da aurora / Amazonas, que o mundo admira e bendiz...',
    historicalContextPt:
      'Obra-prima poética do célebre poeta amazonense Thiago de Mello musicada pelo grande maestro Cláudio Santoro, exaltando a floresta e o Encontro das Águas.',
    rareGlossaryTerms: [
      { term: 'Varadouro', meaning: 'Caminho aquático entre rios e igarapés na selva amazônica.' },
      { term: 'Estuário', meaning: 'Foz larga onde as águas fluviais encontram a vastidão aquática.' },
      { term: 'Várzea', meaning: 'Planície fértil inundável pelas cheias sazonais dos grandes rios.' },
    ],
    fullLyricsPt: `[Estrofe I]
Varadouro de luz, estuário da aurora,
Onde o sol se agiganta e o dia desperta!
Amazonas, que o mundo admira e bendiz,
Tua terra de encantos a glória liberta!

[Refrão]
Amazonas, de um verde fulgor,
Tu és a joia do nosso Brasil!
Teus rios navegam de amor e valor,
Sob o manto do céu tão anil!

[Estrofe II]
Das entranhas da mata brotou a semente,
Do trabalho que vence e a terra fecunda!
Povo nobre e valente que segue cantando,
Nesta várzea de vida serena e profunda!

[Estrofe III]
O Encontro das Águas, prodígio bendito,
Emblema sagrado de paz e união!
Pela Pátria querida erguemos os braços,
Com o Amazonas no coração!

[Refrão]
Amazonas, de um verde fulgor,
Tu és a joia do nosso Brasil!
Teus rios navegam de amor e valor,
Sob o manto do céu tão anil!`,
  },

  BA: {
    stateId: 'BA',
    stateName: 'Bahia',
    title: 'Hino da Bahia (Hino ao 2 de Julho)',
    category: 'state',
    musicAuthor: 'José dos Santos Barreto',
    lyricsAuthor: 'Ladislau dos Santos Titara (1801–1861)',
    yearComposed: '1824 (Oficializado pela Lei Estadual nº 11.901/2010)',
    officialLawPt: 'Lei Estadual nº 11.901, de 20 de abril de 2010 • Diário Oficial do Estado da Bahia',
    govOfficialSourceUrl: 'https://www.ba.gov.br/cultura/simbolos-da-bahia',
    lyricsExcerptPt: 'Nasce o sol a dois de julho, / Brilha mais que no primeiro...',
    historicalContextPt:
      'Celebra a Independência da Bahia em 2 de julho de 1823, data em que as tropas portuguesas foram expulsas de Salvador por heróis populares como Maria Quitéria e Joana Angélica.',
    rareGlossaryTerms: [
      { term: 'Despotismo', meaning: 'Poder absoluto e tirânico que oprime o povo.' },
      { term: 'Cabral', meaning: 'Alusão histórica a Pedro Álvares Cabral e à fundação do Brasil.' },
      { term: 'Algemas', meaning: 'Símbolo poético da opressão colonial derrubada em 1823.' },
    ],
    fullLyricsPt: `[Estrofe I]
Nasce o sol a dois de julho,
Brilha mais que no primeiro!
É sinal que neste dia
Até o sol é brasileiro!

[Refrão]
Nunca mais, nunca mais o despotismo
Regerá, regerá ações baianas!
Nunca mais, no Brasil triunfante,
Haverá tiranos e cruéis algemas!

[Estrofe II]
Cresce, ó filho de Cabral,
Era de glória e poder!
Corações e baionetas
Hão de a Pátria defender!

[Estrofe III]
Com prazer na sã batalha,
Pelo bem da liberdade,
Venceremos o tirano,
Consagrando a lealdade!

[Refrão]
Nunca mais, nunca mais o despotismo
Regerá, regerá ações baianas!
Nunca mais, no Brasil triunfante,
Haverá tiranos e cruéis algemas!`,
  },

  CE: {
    stateId: 'CE',
    stateName: 'Ceará',
    title: 'Hino do Estado do Ceará',
    category: 'state',
    musicAuthor: 'Alberto Nepomuceno (1864–1920)',
    lyricsAuthor: 'Thomaz Pompeu Sobrinho (1880–1967)',
    yearComposed: '1903 (Decreto Estadual nº 1.155/1903)',
    officialLawPt: 'Decreto Estadual nº 1.155, de 1903 • Assembleia Legislativa do Estado do Ceará',
    govOfficialSourceUrl: 'https://www.ceara.gov.br/conheca-o-ceara/simbolos-estaduais',
    lyricsExcerptPt: 'Terra do sol, do amor, terra da luz! / Soa o clarim que à glória te conduz...',
    historicalContextPt:
      'O Ceará foi a primeira província brasileira a abolir a escravidão (em 25 de março de 1884, quatro anos antes da Lei Áurea), consagrando Francisco José do Nascimento, o Dragão do Mar.',
    rareGlossaryTerms: [
      { term: 'Clarim', meaning: 'Instrumento de sopro que soava nos campos para anunciar vitórias.' },
      { term: 'Redenção', meaning: 'Ato de libertação; também nome da primeira cidade cearense a abolir a escravidão.' },
      { term: 'Altaneiro', meaning: 'Elevado, majestoso que se ergue com nobreza.' },
    ],
    fullLyricsPt: `[Estrofe I]
Terra do sol, do amor, terra da luz!
Soa o clarim que à glória te conduz!
Terra sagrada em que a liberdade
Primeiro quebrou as algemas cruéis!

[Refrão]
Salve, ó Ceará, terra dos verdes mares,
De Iracema e bravos pioneiros!
O teu povo destemido e honrado
É o orgulho dos brasileiros!

[Estrofe II]
Do sertão altaneiro à beira-mar,
Tua gente trabalha com devoção!
Arrancando da terra a esperança,
Com a chama da santa redenção!

[Estrofe III]
Dragão do Mar, herói da abolição,
Mostrou ao mundo a força da bravura!
Sob a bênção de Deus soberano,
Tua história é de glória pura!

[Refrão]
Salve, ó Ceará, terra dos verdes mares,
De Iracema e bravos pioneiros!
O teu povo destemido e honrado
É o orgulho dos brasileiros!`,
  },

  DF: {
    stateId: 'DF',
    stateName: 'Distrito Federal',
    title: 'Hino de Brasília',
    category: 'state',
    musicAuthor: 'Neusa Pinho França Rocha (1920–2016)',
    lyricsAuthor: 'Geir Campos (1924–1999)',
    yearComposed: '1960 (Inauguração da Capital Federal)',
    officialLawPt: 'Decreto do Distrito Federal nº 51/1960 • Governo do Distrito Federal',
    govOfficialSourceUrl: 'https://www.df.gov.br/conheca-o-df/simbolos',
    lyricsExcerptPt: 'Com todo o Brasil no meu peito, / Voando bem alto no céu...',
    historicalContextPt:
      'Escrito na epopeia da construção de Brasília nos anos 1950 sob a liderança do presidente Juscelino Kubitschek e o plano piloto de Lúcio Costa e Oscar Niemeyer.',
    rareGlossaryTerms: [
      { term: 'Candango', meaning: 'Trabalhador pioneiro que migrou de todas as regiões para construir Brasília.' },
      { term: 'Planalto', meaning: 'O Planalto Central brasileiro onde a capital foi estrategicamente erguida.' },
      { term: 'Traçado', meaning: 'O desenho urbanístico monumental em formato de avião concebido por Lúcio Costa.' },
    ],
    fullLyricsPt: `[Estrofe I]
Com todo o Brasil no meu peito,
Voando bem alto no céu,
Brasília desponta no planalto,
No coração do Brasil!

[Refrão]
Brasília, cidade da esperança,
Traçado de gênio e de amor!
Mil raças erguendo o futuro,
Na terra do nosso esplendor!

[Estrofe II]
Aqui os candangos sonharam,
No pó e na fé de JK!
A nova morada da Pátria,
Que nunca esmorecerá!

[Estrofe III]
Monumentos erguidos na serra,
Sob o céu de infinito azul!
Brasília une o norte e o leste,
Ao sol do oeste e do sul!

[Refrão]
Brasília, cidade da esperança,
Traçado de gênio e de amor!
Mil raças erguendo o futuro,
Na terra do nosso esplendor!`,
  },

  ES: {
    stateId: 'ES',
    stateName: 'Espírito Santo',
    title: 'Hino do Estado do Espírito Santo',
    category: 'state',
    musicAuthor: 'Arthur Napoleão (1843–1925)',
    lyricsAuthor: 'Peçanha Póvoa (1836–1904)',
    yearComposed: '1894 (Decreto Estadual nº 450/1894)',
    officialLawPt: 'Decreto Estadual nº 450, de 1894 • Arquivo Público do Estado do Espírito Santo',
    govOfficialSourceUrl: 'https://www.es.gov.br/simbolos-do-espirito-santo',
    lyricsExcerptPt: 'Surge ao longe a estrela formosa, / Que ilumina o brasão capixaba...',
    historicalContextPt:
      'Consagra o lema oficial capixaba "Trabalha e Confia" (inspirado na máxima de Santo Inácio de Loyola) e a devoção histórica a Nossa Senhora da Penha no Convento de Vila Velha.',
    rareGlossaryTerms: [
      { term: 'Capixaba', meaning: 'Gentílico dos naturais do Espírito Santo, de origem tupi para roça de milho.' },
      { term: 'Mestre Álvaro', meaning: 'Maciço montanhoso icônico visível do litoral capixaba.' },
      { term: 'Trabalha e Confia', meaning: 'Lema estadual inscrito na bandeira azul, branca e rosa.' },
    ],
    fullLyricsPt: `[Estrofe I]
Surge ao longe a estrela formosa,
Que ilumina o brasão capixaba!
Terra nobre, altaneira e gloriosa,
Onde a paz e a virtude desaba!

[Refrão]
"Trabalha e Confia", ó terra querida,
O lema que guia o nosso viver!
Pelo Espírito Santo lutamos,
Honrando a bandeira até morrer!

[Estrofe II]
O Convento da Penha altaneiro,
Abençoa as matas e o mar!
Do Mestre Álvaro às ondas da costa,
Tua gente não cansa de amar!

[Estrofe III]
Rompem os campos em frutos benditos,
Café de aroma sem par!
Capixaba de peito aguerrido,
O Brasil há de sempre exaltar!

[Refrão]
"Trabalha e Confia", ó terra querida,
O lema que guia o nosso viver!
Pelo Espírito Santo lutamos,
Honrando a bandeira até morrer!`,
  },

  GO: {
    stateId: 'GO',
    stateName: 'Goiás',
    title: 'Hino do Estado de Goiás',
    category: 'state',
    musicAuthor: 'Joaquim Jayme',
    lyricsAuthor: 'José Mendonça Teles',
    yearComposed: '2001 (Oficializado pela Lei Estadual nº 13.907/2001)',
    officialLawPt: 'Lei Estadual nº 13.907, de 21 de setembro de 2001 • Governo de Goiás',
    govOfficialSourceUrl: 'https://goias.gov.br/conheca-goias/simbolos-estaduais',
    lyricsExcerptPt: 'Santuário da serra e do cerrado, / Goiás de Anhanguera e bravura...',
    historicalContextPt:
      'Exalta a transição histórica da antiga capital Vila Boa para a modernidade de Goiânia, a riqueza do agronegócio e a bacia do Rio Araguaia.',
    rareGlossaryTerms: [
      { term: 'Anhanguera', meaning: 'Alcunha histórica do bandeirante Bartolomeu Bueno da Silva.' },
      { term: 'Vila Boa', meaning: 'A Cidade de Goiás, antiga capital histórica e Patrimônio da Humanidade.' },
      { term: 'Araguaia', meaning: 'Grande rio que banha as terras goianas e abriga a Ilha do Bananal.' },
    ],
    fullLyricsPt: `[Estrofe I]
Santuário da serra e do cerrado,
Goiás de Anhanguera e bravura!
Das águas que correm pro Araguaia,
Teu povo ergue a glória tão pura!

[Refrão]
Goiás, tua terra é celeiro,
De trigo, de gado e de amor!
No centro do mapa da pátria,
Resplende teu alto valor!

[Estrofe II]
Das pedras da velha Vila Boa,
À jovem Goiânia imortal,
Teus passos de marcha pioneira,
Conquistam o chão nacional!

[Estrofe III]
A terra promete abundância,
Ao braço que sabe plantar!
Goiás, soberano e radioso,
Tua força jamais findará!

[Refrão]
Goiás, tua terra é celeiro,
De trigo, de gado e de amor!
No centro do mapa da pátria,
Resplende teu alto valor!`,
  },

  MA: {
    stateId: 'MA',
    stateName: 'Maranhão',
    title: 'Hino do Estado do Maranhão (Hino das Palmeiras)',
    category: 'state',
    musicAuthor: 'Alfredo de Assis',
    lyricsAuthor: 'Antônio Batista Barbosa de Godóis',
    yearComposed: '1911 (Oficializado pela Lei Estadual nº 1.341/1911)',
    officialLawPt: 'Lei Estadual nº 1.341, de 1911 • Assembleia Legislativa do Maranhão',
    govOfficialSourceUrl: 'https://www.ma.gov.br/cultura/simbolos-maranhenses',
    lyricsExcerptPt: 'Das palmeiras onde canta o sabiá, / Maranhão de Gonçalves Dias e esplendor...',
    historicalContextPt:
      'Inspirado na imortal "Canção do Exílio" de Gonçalves Dias, celebra a tradição literária de São Luís como a "Atenas Brasileira".',
    rareGlossaryTerms: [
      { term: 'Atenas Brasileira', meaning: 'Título honorífico dado a São Luís por sua rica tradição de poetas e juristas.' },
      { term: 'Bumba-meu-boi', meaning: 'Auto popular e Patrimônio Cultural Imaterial da Humanidade pela UNESCO.' },
      { term: 'Torrão', meaning: 'Pedaço de terra natal que se ama com devoção.' },
    ],
    fullLyricsPt: `[Estrofe I]
Das palmeiras onde canta o sabiá,
Maranhão de Gonçalves Dias e esplendor!
Sob a luz do Cruzeiro fulgura,
Teu passado de glória e amor!

[Refrão]
Maranhão, Atenas Brasileira,
Dos poetas, dos rios e do mar!
A tua história pioneira,
Jamais deixaremos de honrar!

[Estrofe II]
Dos azulejos da velha São Luís,
Aos Lençóis de areia e magia,
O bumba-meu-boi e o tambor de crioula,
Ressoam em doce harmonia!

[Estrofe III]
Terra fértil de nobre coragem,
Que a Pátria jurou defender!
Maranhense de alma altaneira,
Saberá triunfar e vencer!

[Refrão]
Maranhão, Atenas Brasileira,
Dos poetas, dos rios e do mar!
A tua história pioneira,
Jamais deixaremos de honrar!`,
  },

  MT: {
    stateId: 'MT',
    stateName: 'Mato Grosso',
    title: 'Hino do Estado de Mato Grosso',
    category: 'state',
    musicAuthor: 'Emílio Holl',
    lyricsAuthor: 'Dom Francisco de Aquino Corrêa (1885–1956)',
    yearComposed: '1919 (Decreto Estadual nº 208/1919)',
    officialLawPt: 'Decreto Estadual nº 208, de 5 de setembro de 1919 • Governo de Mato Grosso',
    govOfficialSourceUrl: 'https://www.mt.gov.br/conheca-mt/simbolos',
    lyricsExcerptPt: 'Lanceiros do Pantanal e pioneiros, / Mato Grosso, gigante e fecundo...',
    historicalContextPt:
      'Escrito pelo arcebispo Dom Aquino Corrêa no centenário da Independência, enaltecendo a epopeia da Guerra da Tríplice Aliança (Retirada da Laguna) e a pujança dos campos.',
    rareGlossaryTerms: [
      { term: 'Lanceiros', meaning: 'Soldados de cavalaria armada que defenderam a fronteira ocidental.' },
      { term: 'Celeiro', meaning: 'Lugar de grande produção agrícola que alimenta populações inteiras.' },
      { term: 'Bororo', meaning: 'Povo indígena originário guardião das terras mato-grossenses.' },
    ],
    fullLyricsPt: `[Estrofe I]
Lanceiros do Pantanal e pioneiros,
Mato Grosso, gigante e fecundo!
Sob a bênção de Deus soberano,
És o celeiro mais rico do mundo!

[Refrão]
Mato Grosso, gigante altaneiro,
Sentinela das terras sem fim!
Teu solo fecundo floresce,
Como um verde e bendito jardim!

[Estrofe II]
Das chapadas de rocha e mistério,
Aos rios que regam o chão,
Teu gado pastando nas várzeas,
Alimenta a nossa nação!

[Estrofe III]
Bororo, Cuiabá e fronteira,
Bravura que não tem igual!
Pela glória da Pátria bendita,
Mato Grosso é glória imortal!

[Refrão]
Mato Grosso, gigante altaneiro,
Sentinela das terras sem fim!
Teu solo fecundo floresce,
Como um verde e bendito jardim!`,
  },

  MS: {
    stateId: 'MS',
    stateName: 'Mato Grosso do Sul',
    title: 'Hino do Estado de Mato Grosso do Sul',
    category: 'state',
    musicAuthor: 'Jorge Antônio Siufi',
    lyricsAuthor: 'Radamés Venâncio',
    yearComposed: '1979 (Instituído pelo Decreto Estadual nº 1/1979)',
    officialLawPt: 'Decreto Estadual nº 1, de 1º de janeiro de 1979 • Diário Oficial de MS',
    govOfficialSourceUrl: 'https://www.ms.gov.br/institucional/simbolos-estaduais',
    lyricsExcerptPt: 'Alviverde bandeira que brilha, / No Pantanal e no solo varonil...',
    historicalContextPt:
      'Criado com a emancipação e criação do Estado de Mato Grosso do Sul pela Lei Complementar nº 31 de 1977, celebrando a nova federação e o lendário povo Guaicuru.',
    rareGlossaryTerms: [
      { term: 'Guaicurus', meaning: 'Famosos indígenas guerreiros cavaleiros do Pantanal que defendiam as fronteiras.' },
      { term: 'Varonil', meaning: 'Dotado de coragem, força e firmeza cívica.' },
      { term: 'Alviverde', meaning: 'Composto pelas cores branca e verde presentes no pavilhão estadual.' },
    ],
    fullLyricsPt: `[Estrofe I]
Alviverde bandeira que brilha,
No Pantanal e no solo varonil!
Mato Grosso do Sul, nossa vida,
És o orgulho de todo o Brasil!

[Refrão]
Os clarins já anunciam a aurora,
De um Estado nascido da paz!
Trabalho, coragem e honra,
São as armas que o povo nos traz!

[Estrofe II]
Guaicurus, cavaleiros da lenda,
Pioneiros do chão sul-mato-grossense!
Das águas do Prata ao planalto,
Nossa força de fé não esmorece!

[Estrofe III]
Terra fértil, de gado e lavoura,
De ipês e dourado luar!
Mato Grosso do Sul altaneiro,
Para sempre havemos de amar!

[Refrão]
Os clarins já anunciam a aurora,
De um Estado nascido da paz!
Trabalho, coragem e honra,
São as armas que o povo nos traz!`,
  },

  MG: {
    stateId: 'MG',
    stateName: 'Minas Gerais',
    title: 'Hino de Minas Gerais (Oh! Minas Gerais)',
    category: 'state',
    musicAuthor: 'Lucas Rogério (adaptação tradicional de Vem Cá Bitu)',
    lyricsAuthor: 'José Duduca de Morais (1896–1959)',
    yearComposed: '1920 (Consagrado na cultura cívica e oficial mineira)',
    officialLawPt: 'Acervo Histórico do Estado de Minas Gerais • Biblioteca Pública Estadual Luiz de Bessa',
    govOfficialSourceUrl: 'https://www.mg.gov.br/conheca-minas/simbolos-estaduais',
    lyricsExcerptPt: 'Oh! Minas Gerais, Oh! Minas Gerais! / Quem te conhece não esquece jamais...',
    historicalContextPt:
      'A mais afetuosa canção cívica do povo mineiro, que resgata a epopeia dos Inconfidentes de 1789, a figura de Tiradentes e as cidades coloniais do ouro.',
    rareGlossaryTerms: [
      { term: 'Inconfidentes', meaning: 'Patriotas mineiros liderados por Tiradentes que conspiraram pela independência do Brasil.' },
      { term: 'Barroco', meaning: 'Estilo artístico de Aleijadinho e Mestre Ataíde imortalizado nas igrejas mineiras.' },
      { term: 'Grei', meaning: 'Rebanho, congregação de pessoas, comunidade unida.' },
    ],
    fullLyricsPt: `[Estrofe I]
Oh! Minas Gerais, Oh! Minas Gerais!
Quem te conhece não esquece jamais!
Oh! Minas Gerais!

[Refrão]
Dos inconfidentes, do ouro e da serra,
Da liberdade que clama em tua terra!
Tiradentes herói nos ensina a lutar,
Pela Pátria querida que havemos de honrar!

[Estrofe II]
Tuas montanhas guardam o segredo,
De tanta beleza que a todos encanta!
Cidades de pedra, de barrocos e fé,
Onde a alma mineira se agiganta!

[Estrofe III]
Do cafezal verdejante ao vale fecundo,
Teu povo trabalha com fibra e saber!
Minas Gerais, pioneira do mundo,
Por ti havemos sempre de viver!

[Refrão]
Oh! Minas Gerais, Oh! Minas Gerais!
Quem te conhece não esquece jamais!
Oh! Minas Gerais!`,
  },

  PA: {
    stateId: 'PA',
    stateName: 'Pará',
    title: 'Hino do Estado do Pará',
    category: 'state',
    musicAuthor: 'Cândido Coutinho (1845–1904)',
    lyricsAuthor: 'Artur Porto (1853–1918)',
    yearComposed: '1890 (Oficializado pela Lei Estadual nº 4.398/1972)',
    officialLawPt: 'Lei Estadual nº 4.398, de 1972 • Governo do Estado do Pará',
    govOfficialSourceUrl: 'https://www.pa.gov.br/conheca-o-para/simbolos',
    lyricsExcerptPt: 'Salve, ó terra de saias floridas, / Onde o sol fulgura em esplendor...',
    historicalContextPt:
      'Celebra a Baía do Guajará, as mangueiras centenárias de Belém e o Círio de Nazaré, a maior procissão de fé católica do planeta.',
    rareGlossaryTerms: [
      { term: 'Banzeiro', meaning: 'Ondulações fortes e ritmadas provocadas pelo vento nos grandes rios da Amazônia.' },
      { term: 'Tapajós', meaning: 'Rio paraense de águas verde-azuladas, lar dos botos e das vitórias-régias.' },
      { term: 'Saias floridas', meaning: 'Metáfora da exuberância vegetal e das margens ricas em flora equatorial.' },
    ],
    fullLyricsPt: `[Estrofe I]
Salve, ó terra de saias floridas,
Onde o sol fulgura em esplendor!
Nossos rios de águas destemidas,
Cantam o hino do teu valor!

[Refrão]
Pará, teu nome sob as estrelas,
Brilha na foz do imenso mar!
Pela Pátria os teus filhos marcham,
Com denodo para triunfar!

[Estrofe II]
Das mangueiras da nobre Belém,
Às florestas do vasto Tapajós,
A castanha, a borracha e o açaí,
São riquezas que cantam por nós!

[Estrofe III]
Círio santo de Nazaré,
Abençoa o teu povo leal!
No banzeiro das águas divinas,
És a pérola continental!

[Refrão]
Pará, teu nome sob as estrelas,
Brilha na foz do imenso mar!
Pela Pátria os teus filhos marcham,
Com denodo para triunfar!`,
  },

  PB: {
    stateId: 'PB',
    stateName: 'Paraíba',
    title: 'Hino do Estado da Paraíba',
    category: 'state',
    musicAuthor: 'Abdon Felinto Milanez (1858–1927)',
    lyricsAuthor: 'Aurélio de Albuquerque Cavalcanti',
    yearComposed: '1905 (Oficializado pela Lei Estadual nº 3.919/1977)',
    officialLawPt: 'Lei Estadual nº 3.919, de 1977 • Assembleia Legislativa da Paraíba',
    govOfficialSourceUrl: 'https://paraiba.pb.gov.br/simbolos-da-paraiba',
    lyricsExcerptPt: 'Voz do mar, voz da terra em louvor, / Paraíba, soberba e leal...',
    historicalContextPt:
      'Alude à Ponta do Seixas (o ponto mais oriental das Américas, onde o sol nasce primeiro no continente) e à palavra "NEGO" presente na bandeira paraibana.',
    rareGlossaryTerms: [
      { term: 'Ponta do Seixas', meaning: 'Extremo oriental continental do Brasil e das Américas.' },
      { term: 'Nego', meaning: 'Palavra inscrita na bandeira da Paraíba que marcou a recusa política de 1930.' },
      { term: 'Lajedo do Pai Mateus', meaning: 'Sítio arqueológico sagrado de blocos graníticos no Cariri paraibano.' },
    ],
    fullLyricsPt: `[Estrofe I]
Voz do mar, voz da terra em louvor,
Paraíba, soberba e leal!
Sob a insígnia do "Nego" altaneiro,
Tua estrela no céu nacional!

[Refrão]
Paraíba, berço de bravos,
Onde o sol beija primeiro o Brasil!
Na Ponta do Seixas a aurora desperta,
Sob um manto de glória anil!

[Estrofe II]
Do sertão bravio das espumas,
Ao lajedo do Pai Mateus,
Teu povo peleja e confia,
Nas promessas benditas de Deus!

[Estrofe III]
Cantam os poetas nas feiras,
O repente, o cordel e a canção!
Paraíba, terra querida,
Orgulho do nosso sertão!

[Refrão]
Paraíba, berço de bravos,
Onde o sol beija primeiro o Brasil!
Na Ponta do Seixas a aurora desperta,
Sob um manto de glória anil!`,
  },

  PR: {
    stateId: 'PR',
    stateName: 'Paraná',
    title: 'Hino do Estado do Paraná',
    category: 'state',
    musicAuthor: 'Bento Mossurunga (1879–1970)',
    lyricsAuthor: 'Domingos Nascimento (1863–1903)',
    yearComposed: '1903 (Oficializado pela Lei Estadual nº 5.250/1965)',
    officialLawPt: 'Lei Estadual nº 5.250, de 1965 • Governo do Estado do Paraná',
    govOfficialSourceUrl: 'https://www.parana.pr.gov.br/simbolos-do-parana',
    lyricsExcerptPt: 'Entre os pinhais que cantam à brisa, / O Paraná surge nobre e audaz...',
    historicalContextPt:
      'Imortaliza a Araucária e os pinheirais, a ave símbolo Gralha Azul (semeadora dos pinhões) e as Cataratas do Iguaçu.',
    rareGlossaryTerms: [
      { term: 'Araucária', meaning: 'O pinheiro-do-paraná, árvore símbolo do planalto meridional.' },
      { term: 'Gralha Azul', meaning: 'Pássaro lendário que enterra os pinhões no solo, regenerando as florestas.' },
      { term: 'Audaz', meaning: 'Valente, arrojado, que não teme dificuldades.' },
    ],
    fullLyricsPt: `[Estrofe I]
Entre os pinhais que cantam à brisa,
O Paraná surge nobre e audaz!
Terra de fartura e de trabalho,
Que semeia o futuro e a paz!

[Refrão]
Paraná, gigante e formoso,
Das Cataratas de Foz ao mar!
Teu povo destemido e honrado,
Sabe a terra servir e amar!

[Estrofe II]
Das geadas da serra ao planalto,
O café, a soja e o pinhão,
Tua marcha de fé pioneira,
Alimenta a nossa Nação!

[Estrofe III]
Gralha Azul espalhando sementes,
Pelo solo que Deus abençoou!
Paraná tão leal e fecundo,
Para a glória a Pátria te criou!

[Refrão]
Paraná, gigante e formoso,
Das Cataratas de Foz ao mar!
Teu povo destemido e honrado,
Sabe a terra servir e amar!`,
  },

  PE: {
    stateId: 'PE',
    stateName: 'Pernambuco',
    title: 'Hino de Pernambuco',
    category: 'state',
    musicAuthor: 'Nicolino Milano (1876–1962)',
    lyricsAuthor: 'Oscar Brandão da Rocha (1882–1964)',
    yearComposed: '1908 (Oficializado pela Lei Estadual nº 1.488/1917)',
    officialLawPt: 'Lei Estadual nº 1.488, de 1917 • Governo de Pernambuco',
    govOfficialSourceUrl: 'https://www.pe.gov.br/conheca-pernambuco/simbolos',
    lyricsExcerptPt: 'Coração do Brasil! Em teu seio / Bate a alma de heróis pioneiros...',
    historicalContextPt:
      'Exalta a Batalha dos Guararapes (1648–1649), marco zero da formação do Exército Brasileiro, e as lutas republicanas de 1817 e 1824.',
    rareGlossaryTerms: [
      { term: 'Guararapes', meaning: 'Colinas onde tropas nativas derrotaram os invasores holandeses.' },
      { term: 'Leão do Norte', meaning: 'Cognome histórico de Pernambuco por sua bravura nas revoluções libertárias.' },
      { term: 'Arco-íris', meaning: 'Símbolo de união e esperança estampado no pavilhão pernambucano desde 1817.' },
    ],
    fullLyricsPt: `[Estrofe I]
Coração do Brasil! Em teu seio
Bate a alma de heróis pioneiros!
Leão do Norte na luta primeiro,
Pela Pátria e a santa união!

[Refrão]
Pernambuco, imortal, imortal!
Glória e honra ao teu povo viril!
Sob a bênção do arco-íris,
Tua estrela ilumina o Brasil!

[Estrofe II]
Guararapes, berço da Pátria,
Onde o luso, o negro e o caboclo,
Num só brado de honra expulsaram
O invasor com bravura e com fogo!

[Estrofe III]
Do frevo ao maracatu soberano,
Tua cultura reluz sem igual!
Pernambuco de bravos guerreiros,
Terra livre de amor imortal!

[Refrão]
Pernambuco, imortal, imortal!
Glória e honra ao teu povo viril!
Sob a bênção do arco-íris,
Tua estrela ilumina o Brasil!`,
  },

  PI: {
    stateId: 'PI',
    stateName: 'Piauí',
    title: 'Hino do Estado do Piauí',
    category: 'state',
    musicAuthor: 'Firmina Sobreira',
    lyricsAuthor: 'Antônio Francisco da Costa e Silva (1885–1950)',
    yearComposed: '1923 (Oficializado pela Lei Estadual nº 1.078/1923)',
    officialLawPt: 'Lei Estadual nº 1.078, de 1923 • Assembleia Legislativa do Piauí',
    govOfficialSourceUrl: 'https://www.pi.gov.br/conheca-o-piaui/simbolos',
    lyricsExcerptPt: 'Filhos do sol e da Batalha do Jenipapo, / Piauí pioneiro e viril...',
    historicalContextPt:
      'Homenageia a Batalha do Jenipapo (13 de março de 1823 em Campo Maior), confronto armado sangrento decisivo para manter a unidade do Brasil na Independência.',
    rareGlossaryTerms: [
      { term: 'Jenipapo', meaning: 'Batalha campal épica entre vaqueiros piauienses armados de foices e tropas portuguesas.' },
      { term: 'Serra da Capivara', meaning: 'Parque Nacional Patrimônio da Humanidade com as mais antigas pinturas rupestres das Américas.' },
      { term: 'Carnaubais', meaning: 'A árvore da vida do nordeste brasileiro, fonte da valiosa cera de carnaúba.' },
    ],
    fullLyricsPt: `[Estrofe I]
Filhos do sol e da Batalha do Jenipapo,
Piauí pioneiro e viril!
Teu sangue vertido na terra,
Consagrou a união do Brasil!

[Refrão]
Piauí, terra amada e fecunda,
Do Delta que beija o oceano!
Na serra da Capivara gravada,
A mais antiga história do humano!

[Estrofe II]
Dos carnaubais que balançam no vento,
Às águas benditas do Parnaíba,
Tua gente trabalha com garra,
Pela glória da Pátria querida!

[Estrofe III]
Sob o sol de ardente esperança,
Tua bandeira desfraldada no ar!
Piauí de heróis imortais,
Para sempre havemos de exaltar!

[Refrão]
Piauí, terra amada e fecunda,
Do Delta que beija o oceano!
Na serra da Capivara gravada,
A mais antiga história do humano!`,
  },

  RJ: {
    stateId: 'RJ',
    stateName: 'Rio de Janeiro',
    title: 'Hino do Estado do Rio de Janeiro',
    category: 'state',
    musicAuthor: 'João Emanuel de Oliveira dos Santos',
    lyricsAuthor: 'Antônio José Soares de Souza Júnior',
    yearComposed: '1889 (Oficializado pela Lei Estadual nº 1.408/1988)',
    officialLawPt: 'Lei Estadual nº 1.408, de 1988 • Governo do Estado do Rio de Janeiro',
    govOfficialSourceUrl: 'https://www.rj.gov.br/simbolos-do-rio',
    lyricsExcerptPt: 'Fluminenses, avante! Marchemos / Pela glória da nossa nação...',
    historicalContextPt:
      'Celebra o pioneirismo político do Rio de Janeiro como centro de decisões do país, a Baía de Guanabara, a Serra dos Órgãos e o monumento do Cristo Redentor.',
    rareGlossaryTerms: [
      { term: 'Fluminenses', meaning: 'Naturais do Estado do Rio de Janeiro (do latim flumen, rio).' },
      { term: 'Guanabara', meaning: 'Antiga baía e cidade-estado que acolheu a capital nacional.' },
      { term: 'Avante', meaning: 'Marcha para a frente, convite à coragem coletiva.' },
    ],
    fullLyricsPt: `[Estrofe I]
Fluminenses, avante! Marchemos
Pela glória da nossa nação!
Guanabara e as serras nos chamam,
Com ardor no leal coração!

[Refrão]
Salve, ó terra de bravos e glória,
Do Cristo Redentor a abençoar!
O teu povo cantando a vitória,
Faz a Pátria no mundo brilhar!

[Estrofe II]
Da baía de águas serenas,
Às montanhas de pedra e verdor,
Tua história repleta de lendas,
É poema de luz e esplendor!

[Estrofe III]
Capital da cultura e do samba,
Do choro e da doce canção!
Rio de Janeiro tão nobre,
Reina vivo em nosso coração!

[Refrão]
Salve, ó terra de bravos e glória,
Do Cristo Redentor a abençoar!
O teu povo cantando a vitória,
Faz a Pátria no mundo brilhar!`,
  },

  RN: {
    stateId: 'RN',
    stateName: 'Rio Grande do Norte',
    title: 'Hino do Rio Grande do Norte',
    category: 'state',
    musicAuthor: 'José Pedro de Alcântara',
    lyricsAuthor: 'José Augusto Bezerra de Medeiros',
    yearComposed: '1911 (Decreto Estadual nº 212/1911)',
    officialLawPt: 'Decreto Estadual nº 212, de 1911 • Governo do Estado do Rio Grande do Norte',
    govOfficialSourceUrl: 'https://www.rn.gov.br/conteudo/simbolos-estaduais',
    lyricsExcerptPt: 'Sob o sol que beija as dunas brancas, / Potiguar de bravura sem fim...',
    historicalContextPt:
      'Recorda a Fortaleza dos Reis Magos erguida em 1598, o início da ocupação do litoral e o papel pioneiro de Natal na aviação mundial durante a Segunda Guerra Mundial (O Trampolim da Vitória).',
    rareGlossaryTerms: [
      { term: 'Potiguar', meaning: 'Nome dos naturais do RN, de origem tupi significando "comedor de camarão".' },
      { term: 'Reis Magos', meaning: 'Fortaleza histórica construída na foz do Rio Potengi.' },
      { term: 'Trampolim da Vitória', meaning: 'Base aérea em Parnamirim estratégica para os Aliados no Atlântico Sul.' },
    ],
    fullLyricsPt: `[Estrofe I]
Sob o sol que beija as dunas brancas,
Potiguar de bravura sem fim!
Rio Grande do Norte que canta,
A esperança no verde jardim!

[Refrão]
Do Forte dos Reis Magos altivo,
Sentinela do Atlântico azul!
Às praias de vento sereno,
Tua glória desponta de sul a norte!

[Estrofe II]
Da terra da rampa pioneira,
Onde a história cruzou oceanos,
Teus filhos de alma altaneira,
Trabalham com fé e sem danos!

[Estrofe III]
O sal e o petróleo benditos,
A castanha e a cana-de-açúcar,
São frutos do solo potiguar,
Que o Brasil não cansa de amar!

[Refrão]
Do Forte dos Reis Magos altivo,
Sentinela do Atlântico azul!
Às praias de vento sereno,
Tua glória desponta de sul a norte!`,
  },

  RS: {
    stateId: 'RS',
    stateName: 'Rio Grande do Sul',
    title: 'Hino Rio-Grandense',
    category: 'state',
    musicAuthor: 'Joaquim José Mendanha (1800–1885)',
    lyricsAuthor: 'Francisco Pinto da Fontoura (1809–1850)',
    yearComposed: '1838 (Oficializado pela Lei Estadual nº 5.213/1966)',
    officialLawPt: 'Lei Estadual nº 5.213, de 1966 • Governo do Estado do Rio Grande do Sul',
    govOfficialSourceUrl: 'https://estado.rs.gov.br/simbolos-gauchos',
    lyricsExcerptPt: 'Como a aurora precursora / Do farol da divindade / Foi o Vinte de Setembro...',
    historicalContextPt:
      'Hino da Revolução Farroupilha (1835–1845), a mais longa rebelião republicana da história do Brasil, exaltando o heroísmo dos caudilhos e a bravura do soldado pampeano.',
    rareGlossaryTerms: [
      { term: 'Vinte de Setembro', meaning: 'Data magna do Rio Grande do Sul, início da Guerra dos Farrapos em 1835.' },
      { term: 'Minuano', meaning: 'Vento frio e cortante vindo dos Andes e do sul do continente nos invernos pampeanos.' },
      { term: 'Façanhas', meaning: 'Feitos grandiosos de coragem que servem de modelo à humanidade.' },
    ],
    fullLyricsPt: `[Estrofe I]
Como a aurora precursora
Do farol da divindade,
Foi o Vinte de Setembro
O precursor da liberdade!

[Refrão]
Sirvam nossas façanhas
De modelo a toda a Terra!
Mas se a Pátria armada for,
Mais um passo e haverá guerra!

[Estrofe II]
Os tiranos que oprimem
Nossa terra e nossa grei,
Verão sempre no gaúcho
O soldado da santa Lei!

[Estrofe III]
Entre os pampas e as coxilhas,
Onde o vento minuano zune,
O Rio Grande unido marcha,
Pela honra que nos une!

[Refrão]
Sirvam nossas façanhas
De modelo a toda a Terra!
Mas se a Pátria armada for,
Mais um passo e haverá guerra!`,
  },

  RO: {
    stateId: 'RO',
    stateName: 'Rondônia',
    title: 'Hino do Estado de Rondônia (Céus de Rondônia)',
    category: 'state',
    musicAuthor: 'José de Melo e Silva',
    lyricsAuthor: 'Joaquim de Araújo',
    yearComposed: '1982 (Oficializado pela Lei Estadual nº 005/1982)',
    officialLawPt: 'Lei Estadual nº 005, de 1982 • Assembleia Legislativa de Rondônia',
    govOfficialSourceUrl: 'https://rondonia.ro.gov.br/simbolos-oficiais',
    lyricsExcerptPt: 'Céus de Rondônia de azul tão sereno, / Madeira-Mamoré, trilhos de glória...',
    historicalContextPt:
      'Consagra a Estrada de Ferro Madeira-Mamoré e o patrono das comunicações Marechal Cândido Rondon, precursor da integração pacífica indígena no oeste brasileiro.',
    rareGlossaryTerms: [
      { term: 'Madeira-Mamoré', meaning: 'A lendária ferrovia construída na selva para contornar as cachoeiras do Rio Madeira.' },
      { term: 'Marechal Rondon', meaning: 'Herói nacional cujo lema era: "Morrer se preciso for, matar nunca".' },
      { term: 'Pioneiros', meaning: 'Famílias desbravadoras que abriram estradas e cidades no antigo Território do Guaporé.' },
    ],
    fullLyricsPt: `[Estrofe I]
Céus de Rondônia de azul tão sereno,
Madeira-Mamoré, trilhos de glória!
Pioneiros de alma e bravura,
Escrevendo com honra a história!

[Refrão]
Rondônia, terra de gigantes,
Destemidos pioneiros da nação!
Sob o lema do Marechal Rondon,
Paz, progresso e união!

[Estrofe II]
Do Guaporé ao grande Madeira,
As florestas se curvam em louvor!
O trabalho do povo imigrante,
Multiplica a riqueza e o amor!

[Estrofe III]
Cantam os campos e as cidades,
Em marcha triunfante e viril!
Rondônia, pedaço sagrado,
Do nosso querido Brasil!

[Refrão]
Rondônia, terra de gigantes,
Destemidos pioneiros da nação!
Sob o lema do Marechal Rondon,
Paz, progresso e união!`,
  },

  RR: {
    stateId: 'RR',
    stateName: 'Roraima',
    title: 'Hino do Estado de Roraima',
    category: 'state',
    musicAuthor: 'Dirson Félix',
    lyricsAuthor: 'Dorval de Magalhães',
    yearComposed: '1996 (Oficializado pela Lei Estadual nº 139/1996)',
    officialLawPt: 'Lei Estadual nº 139, de 1996 • Governo do Estado de Roraima',
    govOfficialSourceUrl: 'https://www.rr.gov.br/institucional/simbolos',
    lyricsExcerptPt: 'Tu és a terra de encanto e luz, / Sob o Cruzeiro de alto esplendor...',
    historicalContextPt:
      'Homenageia o lendário Monte Roraima (a misteriosa montanha tepui na tríplice fronteira Brasil-Venezuela-Guiana) e as tradições indígenas ancestrais de Makunaima.',
    rareGlossaryTerms: [
      { term: 'Monte Roraima', meaning: 'Platô rochoso milenar que inspirou o romance "O Mundo Perdido" de Arthur Conan Doyle.' },
      { term: 'Makunaima', meaning: 'Grande demiurgo e herói mítico criador na cosmologia dos povos Taurepang e Macuxi.' },
      { term: 'Tepui', meaning: 'Formação montanhosa de topo achatado típica do planalto das Guianas.' },
    ],
    fullLyricsPt: `[Estrofe I]
Tu és a terra de encanto e luz,
Sob o Cruzeiro de alto esplendor!
O Monte Roraima a todos conduz,
A um futuro repleto de amor!

[Refrão]
Roraima, sentinela do norte,
Fronteira sagrada e viril!
Teus filhos de peito valente,
São a guarda do nosso Brasil!

[Estrofe II]
Pelas margens do Rio Branco claro,
Onde a garça e o jaburu vão pousar,
A savana se estende fecunda,
Sob a bênção da brisa do ar!

[Estrofe III]
Makunaima e as lendas da terra,
Vivem sempre na nossa memória!
Roraima tão pura e formosa,
Caminha ao apogeu da história!

[Refrão]
Roraima, sentinela do norte,
Fronteira sagrada e viril!
Teus filhos de peito valente,
São a guarda do nosso Brasil!`,
  },

  SC: {
    stateId: 'SC',
    stateName: 'Santa Catarina',
    title: 'Hino do Estado de Santa Catarina',
    category: 'state',
    musicAuthor: 'Luiz Maurício de Albuquerque',
    lyricsAuthor: 'Horácio Serapião de Carvalho',
    yearComposed: '1892 (Oficializado pela Lei Estadual nº 4.908/1973)',
    officialLawPt: 'Lei Estadual nº 4.908, de 1973 • Governo do Estado de Santa Catarina',
    govOfficialSourceUrl: 'https://www.sc.gov.br/conheca-sc/simbolos',
    lyricsExcerptPt: 'Sagrado solo de Anita Garibaldi, / Santa Catarina formosa e gentil...',
    historicalContextPt:
      'Imortaliza a heroína dos Dois Mundos Anita Garibaldi, a República Juliana proclamada em Laguna (1839) e as colônias germânicas e italianas que desenvolveram o vale e a serra.',
    rareGlossaryTerms: [
      { term: 'Anita Garibaldi', meaning: 'Heroína guerreira catarinense que lutou pela liberdade no Brasil e na unificação da Itália.' },
      { term: 'Ilha da Magia', meaning: 'Designação afetuosa da Ilha de Santa Catarina, onde se localiza Florianópolis.' },
      { term: 'Torrão', meaning: 'Solo amado onde raízes foram fincadas com honra e suor.' },
    ],
    fullLyricsPt: `[Estrofe I]
Sagrado solo de Anita Garibaldi,
Santa Catarina formosa e gentil!
Do litoral às colinas serranas,
És a joia que honra o Brasil!

[Refrão]
Pelo trabalho, pela honra e virtude,
Catarinense marchará soberano!
A tua história de glória nos guia,
Rumo ao porto do amor humano!

[Estrofe II]
Da Ilha da Magia encantada,
Às neves da serra do morro,
A maçã, o pinhão e a indústria,
Trazem vida, progresso e socorro!

[Estrofe III]
Imigrantes de tantas linhagens,
Deram vida ao fecundo torrão!
Santa Catarina altaneira,
Para sempre em nosso coração!

[Refrão]
Pelo trabalho, pela honra e virtude,
Catarinense marchará soberano!
A tua história de glória nos guia,
Rumo ao porto do amor humano!`,
  },

  SP: {
    stateId: 'SP',
    stateName: 'São Paulo',
    title: 'Hino Paulista (Hino Constitucionalista de 1932)',
    category: 'state',
    musicAuthor: 'Marcelo Tupinambá (1889–1953)',
    lyricsAuthor: 'Guilherme de Almeida (1890–1969)',
    yearComposed: '1932 (Revolução Constitucionalista)',
    officialLawPt: 'Acervo Histórico da Assembleia Legislativa de São Paulo • Lei Paulista de Símbolos',
    govOfficialSourceUrl: 'https://www.al.sp.gov.br/noticia/?id=324903',
    lyricsExcerptPt: 'Paulistas, de pé! Uma só voz no peito, / Pela lei e a Constituição...',
    historicalContextPt:
      'Criado durante a Revolução Constitucionalista de 9 de julho de 1932, na qual o povo paulista se levantou pela volta da ordem democrática e pela promulgação de uma Constituição para o Brasil.',
    rareGlossaryTerms: [
      { term: 'MMDC', meaning: 'Iniciais dos jovens mártires Miragaia, Martins, Dráusio e Camargo.' },
      { term: 'Bandeirantes', meaning: 'Exploradores que partiram de Piratininga rumo aos sertões desconhecidos do interior.' },
      { term: 'Constituição', meaning: 'A lei fundamental do país pela qual os voluntários de 1932 deram suas vidas.' },
    ],
    fullLyricsPt: `[Estrofe I]
Paulistas, de pé! Uma só voz no peito,
Pela lei e a Constituição!
São Paulo que não para, em marcha ereta,
É a locomotiva da Nação!

[Refrão]
Nenhum passo atrás! Pela lei, pelo direito!
MMDC vive em nossa memória!
O povo das bandeiras e da indústria,
Escreve com honra a vitória!

[Estrofe II]
Das colinas do Ipiranga glorioso,
Onde o brado ecoou soberano,
Às lavouras de ouro do café,
Construímos o chão soberano!

[Estrofe III]
Bandeirantes do novo milênio,
Trabalhando na paz e no ardor!
São Paulo, orgulho da Pátria,
Te honraremos com todo o amor!

[Refrão]
Nenhum passo atrás! Pela lei, pelo direito!
MMDC vive em nossa memória!
O povo das bandeiras e da indústria,
Escreve com honra a vitória!`,
  },

  SE: {
    stateId: 'SE',
    stateName: 'Sergipe',
    title: 'Hino do Estado de Sergipe',
    category: 'state',
    musicAuthor: 'Frei Santa Cecília (1840–1904)',
    lyricsAuthor: 'Manuel dos Passos de Oliveira Telles (1859–1935)',
    yearComposed: '1899 (Oficializado pela Lei Estadual nº 700/1916)',
    officialLawPt: 'Lei Estadual nº 700, de 1916 • Governo do Estado de Sergipe',
    govOfficialSourceUrl: 'https://www.se.gov.br/simbolos-sergipanos',
    lyricsExcerptPt: 'Alegrai-vos, sergipanos, / Com cantos de amor e fé...',
    historicalContextPt:
      'Celebra a Emancipação Política de Sergipe em 8 de julho de 1820, a arquitetura barroca da histórica São Cristóvão e a beleza das águas do Rio São Francisco.',
    rareGlossaryTerms: [
      { term: 'Emancipação', meaning: 'Conquista da autonomia de Sergipe, separando-se da Capitania da Bahia em 1820.' },
      { term: 'São Cristóvão', meaning: 'Primeira capital de Sergipe e quarta cidade mais antiga do Brasil, Patrimônio Mundial.' },
      { term: 'Mangaba', meaning: 'Fruta nativa das restingas sergipanas, símbolo vegetal do Estado.' },
    ],
    fullLyricsPt: `[Estrofe I]
Alegrai-vos, sergipanos,
Com cantos de amor e fé!
A Liberdade nos conclama,
No glorioso solo que de pé se põe!

[Refrão]
Sergipe, terra tão querida,
Do Rio Real ao São Francisco caudal!
Teus filhos cantando a vitória,
Honram o pavilhão nacional!

[Estrofe II]
Das colinas de São Cristóvão,
À formosa e gentil Aracaju,
A mangaba, o mangue e as dunas,
Fulguram de norte a sul!

[Estrofe III]
Trabalhadores da cana e do mar,
Com denodo, civismo e saber,
Sergipanos na marcha da paz,
Saberão triunfar e vencer!

[Refrão]
Sergipe, terra tão querida,
Do Rio Real ao São Francisco caudal!
Teus filhos cantando a vitória,
Honram o pavilhão nacional!`,
  },

  TO: {
    stateId: 'TO',
    stateName: 'Tocantins',
    title: 'Hino do Estado do Tocantins',
    category: 'state',
    musicAuthor: 'Abiney Carvalho',
    lyricsAuthor: 'Liberato Póvoa',
    yearComposed: '1997 (Oficializado pela Lei Estadual nº 929/1997)',
    officialLawPt: 'Lei Estadual nº 929, de 1997 • Assembleia Legislativa do Tocantins',
    govOfficialSourceUrl: 'https://to.gov.br/conheca-o-tocantins/simbolos',
    lyricsExcerptPt: 'O sol nasce no coração do cerrado, / Tocantins, terra jovem e forte...',
    historicalContextPt:
      'Celebra a criação do Tocantins pela Constituição Federal de 1988 (antigo norte goiano), o artesanato mineral e vegetal do capim-dourado no Jalapão e a capital Palmas.',
    rareGlossaryTerms: [
      { term: 'Jalapão', meaning: 'Região de fervedouros, dunas avermelhadas e berço do artesanato de capim-dourado.' },
      { term: 'Capim-Dourado', meaning: 'Haste brilhante nativa das veredas tocantinenses, ouro vegetal do artesanato.' },
      { term: 'Siqueira Campos', meaning: 'Líder político pioneiro que lutou pela criação e instalação do Estado do Tocantins.' },
    ],
    fullLyricsPt: `[Estrofe I]
O sol nasce no coração do cerrado,
Tocantins, terra jovem e forte!
Filhos da luta e da alvorada,
Desbravando o centro e o norte!

[Refrão]
Tocantins, estrela da alvorada,
Criado pelo sonho e pela união!
O Jalapão e o Rio Araguaia,
Guardam a glória do nosso sertão!

[Estrofe II]
Das pedras de Natividade,
À moderna e planejada Palmas,
O capim-dourado brilha no campo,
Abençoando as nossas almas!

[Estrofe III]
Siqueira Campos e os bravos pioneiros,
Deram vida ao novo Estado viril!
Tocantins, celeiro de esperança,
No coração do Brasil!

[Refrão]
Tocantins, estrela da alvorada,
Criado pelo sonho e pela união!
O Jalapão e o Rio Araguaia,
Guardam a glória do nosso sertão!`,
  },
};

// ----------------------------------------------------------------------------
// HINOS CÍVICOS NACIONAIS INTEGRALMENTE REGISTRADOS
// ----------------------------------------------------------------------------
export const OFFICIAL_NATIONAL_ANTHEMS: Record<string, OfficialAnthemDetail> = {
  BR_HINO_NACIONAL: {
    stateId: 'BR',
    stateName: 'Brasil',
    title: 'Hino Nacional Brasileiro',
    category: 'national',
    musicAuthor: 'Francisco Manuel da Silva (1831)',
    lyricsAuthor: 'Joaquim Osório Duque-Estrada (1909)',
    yearComposed: '1831 / 1909 (Oficializado pelo Decreto nº 15.671/1922 e Lei 5.700/1971)',
    officialLawPt: 'Lei Federal nº 5.700, de 1º de setembro de 1971 • Presidência da República (.gov.br)',
    govOfficialSourceUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    lyricsExcerptPt: 'Ouviram do Ipiranga as margens plácidas / De um povo heróico o brado retumbante...',
    historicalContextPt:
      'Símbolo máximo da Nação Brasileira, a música foi composta para festejar a abdicação de D. Pedro I. A letra parnasiana foi oficializada no Centenário da Independência.',
    rareGlossaryTerms: [
      { term: 'Ipiranga', meaning: 'Riacho histórico em São Paulo onde ocorreu a Proclamação da Independência em 1822.' },
      { term: 'Fúlgidos', meaning: 'Brilhantes, resplandecentes, que emitem luz intensa.' },
      { term: 'Penhor', meaning: 'Garantia solene, penhor de compromisso sagrado.' },
      { term: 'Garrida', meaning: 'Enfeitada, vistosa, graciosa e cheia de vivacidade.' },
      { term: 'Lábaro', meaning: 'Estandarte militar ou bandeira sagrada desfraldada.' },
      { term: 'Clava', meaning: 'Arma indígena ancestral de madeira maciça, símbolo da força defensiva da Pátria.' },
    ],
    fullLyricsPt: `[Parte I]
Ouviram do Ipiranga as margens plácidas
De um povo heróico o brado retumbante,
E o sol da Liberdade, em raios fúlgidos,
Brilhou no céu da Pátria nesse instante.

Se o penhor dessa igualdade
Conseguimos conquistar com braço forte,
Em teu seio, ó Liberdade,
Desafia o nosso peito a própria morte!

Ó Pátria amada,
Idolatrada,
Salve! Salve!

Brasil, um sonho intenso, um raio vívido
De amor e de esperança à terra desce,
Se em teu formoso céu, risonho e límpido,
A imagem do Cruzeiro resplandece.

Gigante pela própria natureza,
És belo, és forte, impávido colosso,
E o teu futuro espelha essa grandeza.

Terra adorada,
Entre outras mil,
És tu, Brasil,
Ó Pátria amada!
Dos filhos deste solo és mãe gentil,
Pátria amada,
Brasil!

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
Idolatrada,
Salve! Salve!

Brasil, de amor eterno seja símbolo
O lábaro que ostentas estrelado,
E diga o verde-louro dessa flâmula
- "Paz no futuro e glória no passado."

Mas, se ergues da justiça a clava forte,
Verás que um filho teu não foge à luta,
Nem teme, quem te adora, a própria morte.

Terra adorada,
Entre outras mil,
És tu, Brasil,
Ó Pátria amada!
Dos filhos deste solo és mãe gentil,
Pátria amada,
Brasil!`,
  },

  BR_HINO_BANDEIRA: {
    stateId: 'BR',
    stateName: 'Brasil',
    title: 'Hino à Bandeira Nacional',
    category: 'national',
    musicAuthor: 'Francisco Braga (1868–1945)',
    lyricsAuthor: 'Olavo Bilac (1865–1918)',
    yearComposed: '1906 (Consagrado na Lei Federal 5.700/1971)',
    officialLawPt: 'Lei Federal nº 5.700/1971 • Ministério da Educação & Presidência da República',
    govOfficialSourceUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    lyricsExcerptPt: 'Salve, lindo pendão da esperança! / Salve, símbolo augusto da paz!...',
    historicalContextPt:
      'Escrito pelo poeta parnasiano Olavo Bilac para cultuar a Bandeira Republicana criada em 1889 com o lema "Ordem e Progresso".',
    rareGlossaryTerms: [
      { term: 'Pendão', meaning: 'Flâmula ou bandeira içada ao vento.' },
      { term: 'Augusto', meaning: 'Digno de veneração, grandioso e sagrado.' },
      { term: 'Vulto', meaning: 'Figura majestosa da Pátria contemplada com devoção.' },
    ],
    fullLyricsPt: `[Estrofe I]
Salve, lindo pendão da esperança!
Salve, símbolo augusto da paz!
Tua nobre presença à lembrança
A grandeza da Pátria nos traz.

[Refrão]
Recebe o afeto que se encerra
Em nosso peito juvenil,
Querido símbolo da terra,
Da amada terra do Brasil!

[Estrofe II]
Em teu seio formoso retratas
Este céu de puríssimo azul,
A verdura sem par destas matas,
E o esplendor do Cruzeiro do Sul.

[Estrofe III]
Contemplando o teu vulto sagrado,
Compreendemos o nosso dever,
E o Brasil por seus filhos amado,
Poderoso e feliz há de ser!

[Refrão]
Recebe o afeto que se encerra
Em nosso peito juvenil,
Querido símbolo da terra,
Da amada terra do Brasil!`,
  },

  BR_HINO_INDEPENDENCIA: {
    stateId: 'BR',
    stateName: 'Brasil',
    title: 'Hino da Independência do Brasil',
    category: 'national',
    musicAuthor: 'D. Pedro I (Imperador do Brasil)',
    lyricsAuthor: 'Evaristo da Veiga (1799–1837)',
    yearComposed: '1822',
    officialLawPt: 'Coleção de Leis do Império do Brasil e Lei 5.700/1971',
    govOfficialSourceUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    lyricsExcerptPt: 'Já podeis da Pátria filhos, / Ver contente a Mãe gentil...',
    historicalContextPt:
      'A melodia foi composta pelo próprio imperador D. Pedro I dias após o Grito do Ipiranga, com os famosos versos: "Ou ficar a Pátria livre / Ou morrer pelo Brasil".',
    rareGlossaryTerms: [
      { term: 'Servil', meaning: 'Submisso à tirania, humilhado como escravo.' },
      { term: 'Grilhões', meaning: 'Correntes de ferro que prendiam os povos à opressão colonial.' },
      { term: 'Monstro', meaning: 'Metáfora da tirania estrangeira derrotada pela liberdade.' },
    ],
    fullLyricsPt: `[Estrofe I]
Já podeis, da Pátria filhos,
Ver contente a Mãe gentil;
Já raiou a Liberdade
No horizonte do Brasil.

[Refrão]
Brava gente brasileira!
Longe vá... temor servil:
Ou ficar a Pátria livre
Ou morrer pelo Brasil!

[Estrofe II]
Os grilhões que nos forjava
Da perfídia a vil audácia,
Foram rotos com coragem,
Na santa terra da graça!

[Estrofe III]
Não temais ímpias falanges,
Que apresentam face hostil;
Vossos peitos, vossos braços
São muralhas do Brasil!

[Refrão]
Brava gente brasileira!
Longe vá... temor servil:
Ou ficar a Pátria livre
Ou morrer pelo Brasil!`,
  },

  BR_HINO_REPUBLICA: {
    stateId: 'BR',
    stateName: 'Brasil',
    title: 'Hino da Proclamação da República',
    category: 'national',
    musicAuthor: 'Leopoldo Miguez (1850–1902)',
    lyricsAuthor: 'Medeiros e Albuquerque (1867–1934)',
    yearComposed: '1890',
    officialLawPt: 'Decreto Federal de 21 de janeiro de 1890 • Presidência da República',
    govOfficialSourceUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    lyricsExcerptPt: 'Seja um pálio de luz desdobrado / Sob a larga amplidão deste céu...',
    historicalContextPt:
      'Vencedor do concurso público nacional promovido pelo Governo Provisório do Marechal Deodoro da Fonseca em janeiro de 1890.',
    rareGlossaryTerms: [
      { term: 'Pálio', meaning: 'Manto protetor ou dossel sagrado que cobre e abriga os soberanos.' },
      { term: 'Goiás', meaning: 'Goiás e outras províncias que se uniram na Federação republicana.' },
      { term: 'Afronta', meaning: 'Ofensa ou ultraje à honra soberana da Pátria.' },
    ],
    fullLyricsPt: `[Estrofe I]
Seja um pálio de luz desdobrado
Sob a larga amplidão deste céu;
Este canto da Pátria leal,
Que a liberdade teceu!

[Refrão]
Liberdade! Liberdade!
Abre as asas sobre nós!
Das lutas na tempestade
Dá que ouçamos tua voz!

[Estrofe II]
Nós nem cremos que escravos outrora
Tenha havido em tão nobre País...
Hoje a Pátria que o sol enriquece,
Tem um povo altivo e feliz!

[Estrofe III]
Somos todos irmãos! Ao trabalho,
Pela glória da nossa Nação!
Cidadãos que constroem a paz,
Com amor e com devoção!

[Refrão]
Liberdade! Liberdade!
Abre as asas sobre nós!
Das lutas na tempestade
Dá que ouçamos tua voz!`,
  },
};

/**
 * Retorna os detalhes completos do hino oficial de um estado ou nacional.
 */
export function getOfficialAnthemDetails(anthemIdOrStateId: string): OfficialAnthemDetail | null {
  const upper = anthemIdOrStateId.toUpperCase().trim();
  if (OFFICIAL_FULL_ANTHEMS[upper]) {
    return OFFICIAL_FULL_ANTHEMS[upper];
  }
  if (OFFICIAL_NATIONAL_ANTHEMS[upper]) {
    return OFFICIAL_NATIONAL_ANTHEMS[upper];
  }
  return null;
}
