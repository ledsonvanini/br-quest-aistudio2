/**
 * Base de Dados Climatológica, Histórica, Hidrográfica e Topográfica dos 27 Estados do Brasil
 * Contém:
 * - Classificação Climática de Köppen e regime pluviométrico
 * - Histórico e vulnerabilidade a inundações / enchentes / secas
 * - Extremos históricos de temperatura (Recordes de Frio e Calor do INMET)
 * - Características do relevo, principais serras, planaltos e ponto culminante
 */

export interface StateClimatologyDetail {
  id: string;
  name: string;
  capital: string;
  region: string;
  koppenClimate: string;
  koppenDescription: string;
  annualRainfallMm: number;
  rainySeason: string;
  drySeason: string;
  floodHistory: {
    vulnerabilityLevel: 'Muito Alta' | 'Alta' | 'Moderada' | 'Baixa';
    mainBasins: string[];
    historicEvents: string[];
  };
  temperatureExtremes: {
    recordCold: { temp: number; location: string; date?: string; context: string };
    recordHeat: { temp: number; location: string; date?: string; context: string };
  };
  reliefGeography: {
    predominantRelief: string;
    highestPoint: { name: string; altitudeM: number };
    mainLandforms: string[];
    environmentalHighlights: string;
  };
}

export const STATE_CLIMATOLOGY_DATABASE: Record<string, StateClimatologyDetail> = {
  AC: {
    id: 'AC',
    name: 'Acre',
    capital: 'Rio Branco',
    region: 'Norte',
    koppenClimate: 'Am / Af',
    koppenDescription: 'Equatorial quente e úmido com elevada pluviosidade e fenômeno periódico de Friagem.',
    annualRainfallMm: 2200,
    rainySeason: 'Outubro a Abril (Inverno Amazônico)',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Acre', 'Bacia do Rio Juruá', 'Bacia do Rio Purus'],
      historicEvents: [
        'Cheia histórica de 2015 do Rio Acre atingiu 18,40m em Rio Branco, inundando bairros inteiros e afetando mais de 100 mil pessoas.',
        'Inundação de 2024: Transbordamento simultâneo do Rio Acre e Igarapé São Francisco com estado de calamidade pública.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 6.0, location: 'Rio Branco / Epitaciolândia', date: 'Julho de 1975', context: 'Friagem antártica intensa canalizada pela cordilheira dos Andes.' },
      recordHeat: { temp: 39.8, location: 'Cruzeiro do Sul', date: 'Setembro de 2023', context: 'Onda de calor extremo agravada por seca prolongada do El Niño.' },
    },
    reliefGeography: {
      predominantRelief: 'Depressão da Amazônia Ocidental e Planalto Dissecado',
      highestPoint: { name: 'Serra do Divisor', altitudeM: 609 },
      mainLandforms: ['Planície Aluvial do Rio Acre', 'Colinas Suaves da Amazônia Sul-Ocidental', 'Serra do Moa'],
      environmentalHighlights: 'Floresta tropical densa com bambus e rica biodiversidade de transição andino-amazônica.',
    },
  },
  AL: {
    id: 'AL',
    name: 'Alagoas',
    capital: 'Maceió',
    region: 'Nordeste',
    koppenClimate: 'As (Litoral) / BSh (Sertão)',
    koppenDescription: 'Tropical litorâneo com chuvas de outono/inverno e Semiárido quente no Agreste/Sertão.',
    annualRainfallMm: 1650,
    rainySeason: 'Abril a Julho (Leste do Nordeste)',
    drySeason: 'Outubro a Fevereiro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Mundaú', 'Bacia do Rio Paraíba do Meio', 'Bacia do Rio São Francisco'],
      historicEvents: [
        'Tragédia de Junho de 2010: Cheia devastadora dos rios Mundaú e Paraíba do Meio destruiu municípios de Branquinha, União dos Palmares e Murici.',
        'Enchentes de 2022 e 2023: Mais de 30 municípios em emergência com transbordamento de lagoas costeiras.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 11.3, location: 'Palmeira dos Índios / Mata Grande', date: 'Agosto de 1965', context: 'Ar frio polar impulsionado para o Agreste Alagoano em altitude.' },
      recordHeat: { temp: 41.2, location: 'Piranhas / Pão de Açúcar (Sertão)', date: 'Novembro de 2023', context: 'Calor tórrido no vale semiárido do Baixo São Francisco.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Litorânea, Tabuleiros Costeiros e Planalto da Borborema',
      highestPoint: { name: 'Serra Santa Cruz (Mata Grande)', altitudeM: 844 },
      mainLandforms: ['Cordão Lagunar Mundaú-Manguaba', 'Tabuleiros Areníticos', 'Depressão Sertaneja'],
      environmentalHighlights: 'Complexo estuarino-lagunar e resquícios valiosos de Mata Atlântica de Encosta e Caatinga Hiperxerófila.',
    },
  },
  AP: {
    id: 'AP',
    name: 'Amapá',
    capital: 'Macapá',
    region: 'Norte',
    koppenClimate: 'Af / Am',
    koppenDescription: 'Equatorial superúmido sob influência direta da ZCIT e do Oceano Atlântico Norte.',
    annualRainfallMm: 2850,
    rainySeason: 'Janeiro a Maio',
    drySeason: 'Setembro a Novembro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Oiapoque', 'Bacia do Rio Araguari', 'Bacia do Rio Amazonas / Foz'],
      historicEvents: [
        'Fenômeno da Pororoca no Rio Araguari e cheias periódicas na Bacia do Oiapoque e Calçoene.',
        'Alagamentos de ressaca urbana em Macapá e Santana decorrentes de marés equinociais e chuvas torrenciais.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 17.5, location: 'Serra do Navio', date: 'Julho de 1978', context: 'Nebulosidade contínua e massas de ar marítimo do Atlântico Norte.' },
      recordHeat: { temp: 38.6, location: 'Macapá', date: 'Outubro de 2023', context: 'Estiagem do segundo semestre na linha do Equador.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Litorânea Aluvial e Planalto das Guianas',
      highestPoint: { name: 'Serra do Tumucumaque', altitudeM: 701 },
      mainLandforms: ['Planície Costeira de Manguezais', 'Tabuleiros do Amapá', 'Maciço das Guianas'],
      environmentalHighlights: 'Estado mais preservado do Brasil (mais de 70% de áreas protegidas e Parque Nacional do Tumucumaque).',
    },
  },
  AM: {
    id: 'AM',
    name: 'Amazonas',
    capital: 'Manaus',
    region: 'Norte',
    koppenClimate: 'Af / Am',
    koppenDescription: 'Equatorial megatérmico e superúmido, maior produtor de vapor d’água (Rios Voadores) do planeta.',
    annualRainfallMm: 2500,
    rainySeason: 'Dezembro a Maio (Cheia dos Grandes Rios)',
    drySeason: 'Julho a Outubro (Vazante / Seca)',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Negro', 'Bacia do Rio Solimões / Amazonas', 'Bacia do Rio Madeira'],
      historicEvents: [
        'Supercheia Histórica de 2021: Rio Negro atingiu 30,02 metros no Porto de Manaus, o maior nível medido desde 1902.',
        'Seca Histórica de 2023 e 2024: Nível recorde mínimo de 12,70m com isolamento de comunidades ribeirinhas e morte de botos em Tefé.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 9.6, location: 'Boca do Acre / Guajará', date: 'Julho de 1975', context: 'Friagem antártica de grande intensidade descendo pelo vale do Purus.' },
      recordHeat: { temp: 40.0, location: 'Manaus', date: 'Outubro de 2023', context: 'Estiagem severa aliada à fumaça de queimadas e bloqueio térmico.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Amazônica, Baixo Planalto e Escudo das Guianas ao norte',
      highestPoint: { name: 'Pico da Neblina (Ponto Culminante do Brasil)', altitudeM: 2995 },
      mainLandforms: ['Várzeas e Igapós Inundáveis', 'Terra Firme Amazônica', 'Serra do Imeri / Neblina'],
      environmentalHighlights: 'Maior bacia hidrográfica e maior floresta tropical contínua do globo terrestre.',
    },
  },
  BA: {
    id: 'BA',
    name: 'Bahia',
    capital: 'Salvador',
    region: 'Nordeste',
    koppenClimate: 'Af (Litoral) / BSh (Sertão) / Cwb (Chapada)',
    koppenDescription: 'Grande diversidade: Tropical úmido atlântico, Semiárido no Sertão e Tropical de Altitude na Chapada.',
    annualRainfallMm: 1500,
    rainySeason: 'Novembro a Março (Interior) / Abril a Julho (Litoral)',
    drySeason: 'Agosto a Outubro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio São Francisco', 'Bacia do Rio Paraguaçu', 'Bacia do Rio de Contas'],
      historicEvents: [
        'Enchentes no Sul e Extremo Sul em Dezembro de 2021: Mais de 160 municípios em calamidade (Itabuna, Ilhéus, Jequié) por ZCAS persistente.',
        'Deslizamentos em encostas de Salvador em temporais de Maio de 2015 e 2020.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 4.6, location: 'Piatã (Chapada Diamantina)', date: 'Julho de 2021', context: 'Altitude acima de 1.280m combinada com ar polar canalizado.' },
      recordHeat: { temp: 42.8, location: 'Ibotirama / Cipó', date: 'Novembro de 2023', context: 'Onda de calor no sertão do Vale do Médio São Francisco.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto da Chapada Diamantina, Depressão Sertaneja e Tabuleiros Costeiros',
      highestPoint: { name: 'Pico do Barbado', altitudeM: 2033 },
      mainLandforms: ['Cânions e Serras da Chapada Diamantina', 'Planície Costeira de Recifes', 'Raso da Catarina'],
      environmentalHighlights: 'Coração hidrográfico do Nordeste abrigando Caatinga, Cerrado e Mata Atlântica.',
    },
  },
  CE: {
    id: 'CE',
    name: 'Ceará',
    capital: 'Fortaleza',
    region: 'Nordeste',
    koppenClimate: 'BSh / Aw',
    koppenDescription: 'Semiárido quente dominante no interior e Tropical subúmido no litoral e serras úmidas.',
    annualRainfallMm: 800,
    rainySeason: 'Fevereiro a Maio (Estação da Quadra Chuvosa)',
    drySeason: 'Julho a Dezembro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Jaguaribe', 'Bacia do Rio Acaraú', 'Bacia do Rio Curu'],
      historicEvents: [
        'Cheias de 2004 e 2009 com rompimento de açudes e inundações no Vale do Jaguaribe e Sobral.',
        'Seca do Milênio (2012-2017) que levou o Açude Castanhão a níveis críticos de volume morto.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 9.8, location: 'Guaramiranga (Maciço de Baturité)', date: 'Julho de 2017', context: 'Brejo de altitude com clima temperado de serra a 900m.' },
      recordHeat: { temp: 41.0, location: 'Sobral / Jaguaruana', date: 'Outubro de 2023', context: 'Radiação solar direta e estiagem no Sertão Central.' },
    },
    reliefGeography: {
      predominantRelief: 'Depressão Sertaneja com Insulares / Inselbergs e Chapada do Araripe',
      highestPoint: { name: 'Pico da Serra Branca (Monsenhor Tabosa)', altitudeM: 1154 },
      mainLandforms: ['Inselbergs do Sertão de Quixadá', 'Tabuleiros de Dunas e Falésias', 'Chapada do Araripe / Ibiapaba'],
      environmentalHighlights: 'Rico em fósseis do Cretáceo e brejos úmidos em meio ao semiárido.',
    },
  },
  DF: {
    id: 'DF',
    name: 'Distrito Federal',
    capital: 'Brasília',
    region: 'Centro-Oeste',
    koppenClimate: 'Aw / Cwa',
    koppenDescription: 'Tropical de altitude do Brasil Central com duas estações bem definidas (verão chuvoso e inverno seco).',
    annualRainfallMm: 1550,
    rainySeason: 'Outubro a Abril',
    drySeason: 'Maio a Setembro (Umidade < 15%)',
    floodHistory: {
      vulnerabilityLevel: 'Moderada',
      mainBasins: ['Bacia do Rio Paranoá', 'Bacia do Rio São Bartolomeu', 'Bacia do Rio Descoberto'],
      historicEvents: [
        'Enxurradas torrenciais na Asa Norte e Tesourinhas de Brasília durante tempestades convectivas de verão.',
        'Crise Hídrica de 2016-2018 com racionamento de água no Lago do Descoberto e Santa Maria.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 1.4, location: 'Gama / Águas Emendadas', date: 'Julho de 1975', context: 'Geada em baixadas com ar polar e forte perda radiativa noturna.' },
      recordHeat: { temp: 37.8, location: 'Brasília (Plano Piloto)', date: 'Outubro de 2020', context: 'Onda histórica de calor com bloqueio atmosférico no Planalto Central.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto Central Brasileiro e Chapadões',
      highestPoint: { name: 'Pico do Roncador (Serra do Sobradinho)', altitudeM: 1341 },
      mainLandforms: ['Chapadões Aplainados', 'Vales Fluviais Encaixados', 'Bacia do Lago Paranoá'],
      environmentalHighlights: 'Berço das Águas: divisor hidrográfico das bacias do Paraná, Tocantins e São Francisco.',
    },
  },
  ES: {
    id: 'ES',
    name: 'Espírito Santo',
    capital: 'Vitória',
    region: 'Sudeste',
    koppenClimate: 'Af / Am (Litoral) / Cfb (Montanhas Capixabas)',
    koppenDescription: 'Tropical litorâneo quente e Tropical de altitude nas montanhas de Domingos Martins e Pedra Azul.',
    annualRainfallMm: 1350,
    rainySeason: 'Outubro a Março',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Doce', 'Bacia do Rio Itapemirim', 'Bacia do Rio Jucu'],
      historicEvents: [
        'Dezembro de 2013: A maior enchente da história do ES afetou mais de 50 municípios (Linhares, Colatina, Baixo Guandu).',
        'Enchente devastadora de Março de 2024 em Mimoso do Sul e Apiacá no sul capixaba.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -1.0, location: 'Parque Nacional do Caparaó', date: 'Julho de 2017', context: 'Geada e sincelo nas cristas rochosas da Serra do Caparaó.' },
      recordHeat: { temp: 41.5, location: 'Afonso Cláudio / Cachoeiro de Itapemirim', date: 'Novembro de 2023', context: 'Calor pré-frontal comprimido nos vales do sul capixaba.' },
    },
    reliefGeography: {
      predominantRelief: 'Maciço da Serra do Mar / Mantiqueira e Planície Flúvio-Marinha',
      highestPoint: { name: 'Pico da Bandeira (Divisa ES/MG)', altitudeM: 2892 },
      mainLandforms: ['Pedra Azul e Pontões Rochosos', 'Foz do Rio Doce em Linhares', 'Tabuleiros Costeiros'],
      environmentalHighlights: 'Altíssima densidade de biodiversidade da Mata Atlântica de encosta e formações de granito monumentais.',
    },
  },
  GO: {
    id: 'GO',
    name: 'Goiás',
    capital: 'Goiânia',
    region: 'Centro-Oeste',
    koppenClimate: 'Aw / Cwa',
    koppenDescription: 'Tropical semiúmido com estação chuvosa no verão e estiagem severa no inverno.',
    annualRainfallMm: 1600,
    rainySeason: 'Outubro a Março',
    drySeason: 'Maio a Setembro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Araguaia', 'Bacia do Rio Tocantins', 'Bacia do Rio Paranaíba'],
      historicEvents: [
        'Enchente histórica de Dezembro de 2001 e 2021 no Rio Vermelho na histórica Cidade de Goiás.',
        'Cheias do Rio Araguaia inundando áreas de planície em Aruanã e São Miguel do Araguaia.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 0.0, location: 'Jataí / Cristalina', date: 'Julho de 1975', context: 'Geada em áreas agrícolas do planalto do sudoeste goiano.' },
      recordHeat: { temp: 42.4, location: 'Arlete / Porangatu', date: 'Outubro de 2020', context: 'Seca extrema e onda de calor no norte goiano.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto Central, Chapada dos Veadeiros e Depressão do Tocantins-Araguaia',
      highestPoint: { name: 'Pouso Alto (Chapada dos Veadeiros)', altitudeM: 1691 },
      mainLandforms: ['Cânions e Cachoeiras dos Veadeiros', 'Serra dos Pireneus', 'Planície do Araguaia'],
      environmentalHighlights: 'Cerrado sensu stricto, campos limpos e nascentes puras que alimentam três bacias continentais.',
    },
  },
  MA: {
    id: 'MA',
    name: 'Maranhão',
    capital: 'São Luís',
    region: 'Nordeste',
    koppenClimate: 'Aw / Am',
    koppenDescription: 'Transição entre o Tropical semiúmido, o Semiárido sertanejo e o Equatorial amazônico.',
    annualRainfallMm: 1900,
    rainySeason: 'Janeiro a Junho',
    drySeason: 'Agosto a Novembro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Mearim', 'Bacia do Rio Itapecuru', 'Bacia do Rio Parnaíba'],
      historicEvents: [
        'Enchentes catastróficas de 2009 e 2023: Mais de 60 municípios decretaram calamidade por cheia do Mearim e Itapecuru (Bacabal, Pedreiras).',
        'Inundação da Baixada Maranhense com formação de grandes lagos temporários.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 13.0, location: 'Balsas / Chapada das Mesas', date: 'Julho de 2011', context: 'Perda radiativa no planalto do sul maranhense sob ar seco polar.' },
      recordHeat: { temp: 41.8, location: 'Caxias / Balsas', date: 'Outubro de 2023', context: 'Veranico e estiagem na transição para o Cerrado.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Litorânea, Baixada Maranhense e Chapada das Mesas ao sul',
      highestPoint: { name: 'Serra da Cinta', altitudeM: 804 },
      mainLandforms: ['Lençóis Maranhenses (Campos de Dunas e Lagoas)', 'Cânions da Chapada das Mesas', 'Baixada Maranhense'],
      environmentalHighlights: 'Mata dos Cocais (babaçuais), manguezais exuberantes e os lendários Lençóis Maranhenses.',
    },
  },
  MT: {
    id: 'MT',
    name: 'Mato Grosso',
    capital: 'Cuiabá',
    region: 'Centro-Oeste',
    koppenClimate: 'Aw / Am',
    koppenDescription: 'Tropical continental quente com verões muito chuvosos e invernos com friagens repentinas.',
    annualRainfallMm: 1800,
    rainySeason: 'Novembro a Março',
    drySeason: 'Maio a Setembro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Paraguai (Pantanal)', 'Bacia do Rio Teles Pires / Tapajós', 'Bacia do Rio Xingu'],
      historicEvents: [
        'Ciclos de Inundação natural do Pantanal Mato-Grossense cobrindo até 80% da planície.',
        'Incêndios históricos de 2020 e 2024 na seca extrema com fumaça cobrindo a região centro-oeste.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 1.2, location: 'Chapada dos Guimarães / Cáceres', date: 'Julho de 1975', context: 'Friagem antártica derrubando a temperatura em mais de 25°C em poucas horas.' },
      recordHeat: { temp: 44.8, location: 'Nova Maringá / Cuiabá', date: 'Novembro de 2023', context: 'Recorde nacional de calor com domo térmico extremo e umidade < 10%.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto dos Parecis, Chapada dos Guimarães e Planície do Pantanal',
      highestPoint: { name: 'Serra Ricardo Franco', altitudeM: 1118 },
      mainLandforms: ['Planície Pantaneira', 'Farilhões de Arenito de Guimarães', 'Chapadão do Parecis'],
      environmentalHighlights: 'Único estado brasileiro com três biomas vitais: Amazônia, Cerrado e Pantanal.',
    },
  },
  MS: {
    id: 'MS',
    name: 'Mato Grosso do Sul',
    capital: 'Campo Grande',
    region: 'Centro-Oeste',
    koppenClimate: 'Aw / Cfa',
    koppenDescription: 'Tropical no centro-norte e Subtropical úmido no sul, sob forte rota de massas polares.',
    annualRainfallMm: 1500,
    rainySeason: 'Outubro a Março',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Paraguai', 'Bacia do Rio Paraná', 'Bacia do Rio Miranda / Taquari'],
      historicEvents: [
        'Desastre ecológico do assoreamento e arrombamentos do Rio Taquari no Pantanal.',
        'Enchentes e tempestades severas de vento com supercélulas em Campo Grande e Dourados.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -4.5, location: 'Ponta Porã / Amambai', date: 'Julho de 1975', context: 'Geada negra e congelamento de lavouras na fronteira sul com o Paraguai.' },
      recordHeat: { temp: 44.4, location: 'Água Clara / Corumbá', date: 'Outubro de 2020', context: 'Seca e calor sufocante no Pantanal e planalto sul-mato-grossense.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície do Pantanal, Serra da Bodoquena e Planalto de Maracaju',
      highestPoint: { name: 'Morro Grande (Santa Teresa)', altitudeM: 1065 },
      mainLandforms: ['Formações Calcárias de Bonito / Bodoquena', 'Pantanal do Nabileque e Paiaguás', 'Serra de Maracaju'],
      environmentalHighlights: 'Rios de águas cristalinas com travertinos calcários em Bonito e rica fauna pantaneira.',
    },
  },
  MG: {
    id: 'MG',
    name: 'Minas Gerais',
    capital: 'Belo Horizonte',
    region: 'Sudeste',
    koppenClimate: 'Aw / Cwa / Cwb',
    koppenDescription: 'Tropical semiúmido, Tropical de altitude nas serras e Semiárido no extremo norte do Vale do Jequitinhonha.',
    annualRainfallMm: 1450,
    rainySeason: 'Novembro a Março (ZCAS dominante)',
    drySeason: 'Maio a Setembro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio São Francisco', 'Bacia do Rio Doce', 'Bacia do Rio Grande / Paranaíba'],
      historicEvents: [
        'Janeiro de 2020: Temporal recorde em Belo Horizonte (171mm em 24h) com deslizamentos e transbordamento do Arrudas.',
        'Enchentes generalizadas de 2022 com mais de 300 municípios em situação de emergência.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -5.0, location: 'Monte Verde / Maria da Fé', date: 'Julho de 2011', context: 'Geada severa e gelo em campos da Serra da Mantiqueira acima de 1.500m.' },
      recordHeat: { temp: 43.5, location: 'Itaobim (Vale do Jequitinhonha)', date: 'Novembro de 2023', context: 'Calor extremo no semiárido mineiro sob onda de calor histórica.' },
    },
    reliefGeography: {
      predominantRelief: 'Serras e Planaltos do Atlântico Leste / Sudeste (Mantiqueira, Espinhaço e Canastra)',
      highestPoint: { name: 'Pico da Bandeira (Serra do Caparaó)', altitudeM: 2892 },
      mainLandforms: ['Serra do Espinhaço (Reserva da Biosfera)', 'Serra da Mantiqueira', 'Serra da Canastra (Nascente do Velho Chico)'],
      environmentalHighlights: 'Caixa d’água do Brasil: berço das grandes hidrelétricas e campos rupestres únicos.',
    },
  },
  PA: {
    id: 'PA',
    name: 'Pará',
    capital: 'Belém',
    region: 'Norte',
    koppenClimate: 'Af / Am',
    koppenDescription: 'Equatorial superúmido sob constante convergência de ventos alísios e convecção diária.',
    annualRainfallMm: 2800,
    rainySeason: 'Dezembro a Maio',
    drySeason: 'Agosto a Outubro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Tapajós', 'Bacia do Rio Xingu', 'Bacia do Rio Tocantins / Baixo Amazonas'],
      historicEvents: [
        'Enchentes históricas em Marabá pelo transbordamento dos rios Tocantins e Itacaiúnas em 2020 e 2022.',
        'Alagamentos de maré e chuvas torrenciais na Região Metropolitana de Belém e Ilha do Marajó.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 16.0, location: 'Altamira / Conceição do Araguaia', date: 'Julho de 1975', context: 'Friagem residual alcançando o sul do estado.' },
      recordHeat: { temp: 39.8, location: 'Santarém / Paragominas', date: 'Novembro de 2023', context: 'Seca do El Niño com aquecimento da água dos rios e praias de água doce.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Amazônica, Baixo Planalto e Serra dos Carajás',
      highestPoint: { name: 'Serra dos Carajás / Serra do Acari', altitudeM: 906 },
      mainLandforms: ['Ilha de Marajó (Maior arquipélago fluviomarítimo)', 'Cânions do Baixo Tapajós', 'Planície Fluvial do Amazonas'],
      environmentalHighlights: 'Maior província mineral do planeta (Carajás) e estuário amazônico gigantesco.',
    },
  },
  PB: {
    id: 'PB',
    name: 'Paraíba',
    capital: 'João Pessoa',
    region: 'Nordeste',
    koppenClimate: 'As (Litoral) / BSh (Sertão / Cariri)',
    koppenDescription: 'Tropical úmido na costa e Semiárido quente com a menor precipitação do Brasil no Cariri.',
    annualRainfallMm: 1100,
    rainySeason: 'Abril a Julho (Litoral) / Fevereiro a Maio (Sertão)',
    drySeason: 'Setembro a Janeiro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Paraíba', 'Bacia do Rio Piranhas-Açu', 'Bacia do Rio Mamanguape'],
      historicEvents: [
        'Inundação de 1985 e 2004 em João Pessoa e Vale do Mamanguape.',
        'Seca do Cariri (Cabaceiras) com médias anuais inferiores a 400mm.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 12.0, location: 'Areia / Bananeiras (Brejo)', date: 'Julho de 2017', context: 'Clima ameno em brejos de altitude da Serra da Borborema.' },
      recordHeat: { temp: 40.5, location: 'Patos / Sousa (Sertão)', date: 'Outubro de 2023', context: 'Calor extremo na depressão sertaneja do Vale dos Dinossauros.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto da Borborema e Depressão Sertaneja',
      highestPoint: { name: 'Pico do Jabre (Madre de Deus)', altitudeM: 1197 },
      mainLandforms: ['Lagedo de Pai Mateus (Matacões Graníticos)', 'Ponta do Seixas (Extremo Oriental das Américas)', 'Vale dos Dinossauros em Sousa'],
      environmentalHighlights: 'Monumento paleontológico com pegadas fósseis preservadas e ponto mais oriental do continente americano.',
    },
  },
  PR: {
    id: 'PR',
    name: 'Paraná',
    capital: 'Curitiba',
    region: 'Sul',
    koppenClimate: 'Cfb (Planalto de Curitiba) / Cfa (Norte/Oeste)',
    koppenDescription: 'Subtropical úmido com invernos frios, geadas regulares e verões amenos nas serras.',
    annualRainfallMm: 1750,
    rainySeason: 'Outubro a Março (Sem estação seca definida)',
    drySeason: 'Invernos com menor chuva, mas úmidos',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Iguaçu', 'Bacia do Rio Paraná', 'Bacia do Rio Tibagi / Paranapanema'],
      historicEvents: [
        'Supercheia das Cataratas do Iguaçu em Outubro de 2023: Vazão atingiu 24,2 milhões de litros/segundo (16x acima da média).',
        'Enchentes devastadoras de Junho de 2014 em União da Vitória pelo Rio Iguaçu.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -11.5, location: 'Palmas / General Carneiro', date: 'Julho de 1975', context: 'Geada histórica de 1975 que dizimou os cafezais do norte paranaense e congelou riachos.' },
      recordHeat: { temp: 42.0, location: 'Capanema / Paranavaí', date: 'Outubro de 2020', context: 'Calor pré-frontal no vale do Paranapanema e Noroeste.' },
    },
    reliefGeography: {
      predominantRelief: 'Primeiro, Segundo e Terceiro Planaltos Paranaenses e Serra do Mar',
      highestPoint: { name: 'Pico Paraná (Ponto mais alto do Sul do Brasil)', altitudeM: 1877 },
      mainLandforms: ['Cataratas do Iguaçu (Maravilha Mundial)', 'Cânion Guartelá (6º maior do mundo)', 'Serra do Mar Paranaense'],
      environmentalHighlights: 'Floresta de Araucárias (Pinhais), solos basálticos de terra roxa e patrimônio geológico único.',
    },
  },
  PE: {
    id: 'PE',
    name: 'Pernambuco',
    capital: 'Recife',
    region: 'Nordeste',
    koppenClimate: 'As (Zona da Mata) / BSh (Sertão) / Cwa (Garanhuns)',
    koppenDescription: 'Tropical litorâneo superúmido no leste, brejos serranos e Semiárido rigoroso no Sertão do Pajeú.',
    annualRainfallMm: 1500,
    rainySeason: 'Abril a Julho (Leste) / Fevereiro a Maio (Sertão)',
    drySeason: 'Outubro a Janeiro',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Capibaribe', 'Bacia do Rio Beberibe', 'Bacia do Rio Ipojuca / Una'],
      historicEvents: [
        'Tragédia das Chuvas de Maio de 2022: Mais de 130 mortes na Região Metropolitana do Recife por deslizamentos de barreiras e transbordamento.',
        'Cheia histórica do Capibaribe em 1975 e enchentes do Rio Una em 2010 e 2017.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 7.0, location: 'Triunfo / Garanhuns', date: 'Julho de 2021', context: 'Altitude de 1.000m na Serra da Baixa Verde no Sertão do Pajeú.' },
      recordHeat: { temp: 41.6, location: 'Petrolina / Floresta', date: 'Novembro de 2023', context: 'Onda de calor no vale do Submédio São Francisco.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto da Borborema, Depressão Sertaneja e Planície Aluvial do Recife',
      highestPoint: { name: 'Pico do Papagaio (Triunfo)', altitudeM: 1260 },
      mainLandforms: ['Arquipélago de Fernando de Noronha', 'Brejos de Altitude de Garanhuns', 'Planície Estuarina dos Rios Capibaribe e Beberibe'],
      environmentalHighlights: 'Arquipélago vulcânico de Fernando de Noronha (Santuário Marinho Mundial) e manguezais costeiros.',
    },
  },
  PI: {
    id: 'PI',
    name: 'Piauí',
    capital: 'Teresina',
    region: 'Nordeste',
    koppenClimate: 'Aw / BSh',
    koppenDescription: 'Tropical com estação seca marcante (B-R-O BRÓ) e Semiárido no sudeste.',
    annualRainfallMm: 1100,
    rainySeason: 'Janeiro a Abril',
    drySeason: 'Agosto a Novembro (Período B-R-O BRÓ com calor intenso)',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Parnaíba', 'Bacia do Rio Poti', 'Bacia do Rio Canindé'],
      historicEvents: [
        'Enchente de 1985 e 2009 com transbordamento do Rio Poti e Parnaíba em Teresina.',
        'Rompimento da Barragem de Algodões em Cocal em 2009.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 11.2, location: 'Corrente / Caracol (Sul)', date: 'Julho de 2017', context: 'Altitude nos chapadões do sul piauiense sob ar polar seco.' },
      recordHeat: { temp: 43.5, location: 'Bom Jesus / Oeiras', date: 'Novembro de 2023', context: 'Calor sufocante do B-R-O BRÓ com umidade relativa abaixo de 12%.' },
    },
    reliefGeography: {
      predominantRelief: 'Chapadões da Bacia do Parnaíba e Serra da Capivara',
      highestPoint: { name: 'Serra das Confusões / Serra Grande', altitudeM: 865 },
      mainLandforms: ['Cânion do Rio Poti', 'Boqueirões e Paredões da Serra da Capivara', 'Delta do Parnaíba (Único em mar aberto das Américas)'],
      environmentalHighlights: 'Berço do homem americano no Parque Nacional da Serra da Capivara (Patrimônio da UNESCO).',
    },
  },
  RJ: {
    id: 'RJ',
    name: 'Rio de Janeiro',
    capital: 'Rio de Janeiro',
    region: 'Sudeste',
    koppenClimate: 'Aw (Litoral) / Cfb (Serrana) / Am',
    koppenDescription: 'Tropical litorâneo quente e Tropical de altitude nas escarpas da Serra dos Órgãos.',
    annualRainfallMm: 1600,
    rainySeason: 'Novembro a Março',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Paraíba do Sul', 'Bacia da Baía de Guanabara', 'Bacia do Rio Piabanha / Macaé'],
      historicEvents: [
        'Megadesastre da Região Serrana em Janeiro de 2011: Maior tragédia climática da história do país (mais de 900 vítimas em Nova Friburgo, Teresópolis e Petrópolis).',
        'Temporal e Enxurrada de Petrópolis em Fevereiro de 2022 com mais de 230 mortes.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -10.0, location: 'Pico das Agulhas Negras (Itatiaia)', date: 'Julho de 2021', context: 'Congelamento de lagos de altitude e geada severa a 2.700m.' },
      recordHeat: { temp: 43.8, location: 'Guaratiba / Santa Cruz (Zona Oeste RJ)', date: 'Novembro de 2023', context: 'Sensação térmica recorde acima de 58°C sob efeito de compressão adiabática.' },
    },
    reliefGeography: {
      predominantRelief: 'Serra do Mar (Serra dos Órgãos / Mantiqueira) e Baixada Fluminense',
      highestPoint: { name: 'Pico das Agulhas Negras (Itatiaia)', altitudeM: 2791 },
      mainLandforms: ['Dedo de Deus e Serra dos Órgãos', 'Pão de Açúcar e Maciço da Tijuca', 'Baía de Guanabara e Ilha Grande'],
      environmentalHighlights: 'Mata Atlântica de encosta mais exuberante do país e primeira Unidade de Conservação do Brasil (PN Itatiaia).',
    },
  },
  RN: {
    id: 'RN',
    name: 'Rio Grande do Norte',
    capital: 'Natal',
    region: 'Nordeste',
    koppenClimate: 'As (Litoral) / BSh (Sertão / Seridó)',
    koppenDescription: 'Tropical litorâneo com ventos alísios constantes e Semiárido no Seridó.',
    annualRainfallMm: 1250,
    rainySeason: 'Março a Junho (Costa Leste)',
    drySeason: 'Setembro a Dezembro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Piranhas-Açu', 'Bacia do Rio Potengi', 'Bacia do Rio Apodi-Mossoró'],
      historicEvents: [
        'Inundação da Bacia do Piranhas-Açu em 2008 e 2009 com sangria da Barragem Armando Ribeiro Gonçalves.',
        'Crateras e alagamentos em Natal (Mãe Luiza) em 2014 por chuvas torrenciais.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 13.5, location: 'Martins / Serra de São Bento', date: 'Agosto de 2016', context: 'Serras de altitude do interior potiguar com festivais de inverno.' },
      recordHeat: { temp: 40.8, location: 'Caicó / Mossoró', date: 'Outubro de 2023', context: 'Calor tórrido no Seridó potiguar com solene aridez.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto da Borborema, Depressão Sertaneja e Dunas Costeiras',
      highestPoint: { name: 'Serra do Coqueiro (Venha-Ver)', altitudeM: 868 },
      mainLandforms: ['Dunas de Genipabu', 'Atol das Rocas (Único atol do Atlântico Sul)', 'Salinas do Rio Apodi-Mossoró'],
      environmentalHighlights: 'Maior polo eólico em terra do Brasil impulsionado pelos ventos alísios de leste.',
    },
  },
  RS: {
    id: 'RS',
    name: 'Rio Grande do Sul',
    capital: 'Porto Alegre',
    region: 'Sul',
    koppenClimate: 'Cfa / Cfb',
    koppenDescription: 'Subtropical úmido temperado, com 4 estações bem marcadas e elevada variabilidade por frentes polares e jatos de baixos níveis.',
    annualRainfallMm: 1800,
    rainySeason: 'Sem estação seca (Picos no Outono e Primavera)',
    drySeason: 'Chuvas distribuídas ao longo de todo o ano',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Guaíba', 'Bacia do Rio Taquari-Antas', 'Bacia do Rio Jacuí / Uruguai'],
      historicEvents: [
        'Megadesastre Climático de Maio de 2024: A maior catástrofe da história do estado. Rio Guaíba atingiu recorde histórico de 5,35m, submergindo Porto Alegre, Canoas, Eldorado do Sul e Vale do Taquari, afetando mais de 2,3 milhões de pessoas.',
        'Enchente histórica anterior de 1941 (4,76m) e ciclones extratropicais devastadores de Setembro de 2023 no Vale do Taquari.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -9.8, location: 'Bom Jesus / São José dos Ausentes', date: 'Julho de 1975', context: 'Nevasca e formação de estalactites de gelo nos Campos de Cima da Serra.' },
      recordHeat: { temp: 44.8, location: 'Uruguaiana / Porto Xavier', date: 'Janeiro de 2022', context: 'Superonda de calor com massas de ar quente do Chaco argentino.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto das Araucárias, Cânions dos Aparados da Serra e Pampa / Coxilhas',
      highestPoint: { name: 'Pico do Monte Negro (São José dos Ausentes)', altitudeM: 1403 },
      mainLandforms: ['Cânion do Itaimbezinho e Fortaleza', 'Coxilhas do Pampa Gaúcho', 'Complexo Lagunar da Lagoa dos Patos'],
      environmentalHighlights: 'Bioma Pampa com vastos campos naturais e cânions monumentais de basalto.',
    },
  },
  RO: {
    id: 'RO',
    name: 'Rondônia',
    capital: 'Porto Velho',
    region: 'Norte',
    koppenClimate: 'Am / Aw',
    koppenDescription: 'Equatorial úmido no norte e Tropical semiúmido ao sul com friagens de inverno.',
    annualRainfallMm: 2100,
    rainySeason: 'Novembro a Abril',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Madeira', 'Bacia do Rio Guaporé', 'Bacia do Rio Ji-Paraná'],
      historicEvents: [
        'Cheia Histórica do Rio Madeira em 2014: Nível atingiu 19,74m em Porto Velho, isolando o estado do Acre e inundando centenas de comunidades.',
        'Seca extrema de 2023 e 2024 com paralisação da navegação na Hidrovia do Madeira.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 7.4, location: 'Vilhena (Cone Sul)', date: 'Julho de 1975', context: 'Friagem antártica intensa no planalto dos Parecis a 600m de altitude.' },
      recordHeat: { temp: 40.2, location: 'Porto Velho', date: 'Outubro de 2023', context: 'Seca prolongada e queimadas densas.' },
    },
    reliefGeography: {
      predominantRelief: 'Depressão do Guaporé-Madeira e Chapadão dos Parecis',
      highestPoint: { name: 'Pico Trinta de Julho (Serra dos Pacaás Novos)', altitudeM: 1123 },
      mainLandforms: ['Serra dos Pacaás Novos', 'Cachoeiras e Corredeiras do Rio Madeira', 'Forte Príncipe da Beira no Guaporé'],
      environmentalHighlights: 'Transição Amazônia-Cerrado com rica hidrografia de rios navegáveis e terras indígenas protegidas.',
    },
  },
  RR: {
    id: 'RR',
    name: 'Roraima',
    capital: 'Boa Vista',
    region: 'Norte',
    koppenClimate: 'Am / Aw',
    koppenDescription: 'Equatorial no sul e Tropical de savana no norte (Lavrado), com regime de chuvas invertido em relação ao resto do Brasil (hemisfério norte).',
    annualRainfallMm: 1800,
    rainySeason: 'Maio a Agosto (Inverno do Hemisfério Norte)',
    drySeason: 'Dezembro a Março',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Branco', 'Bacia do Rio Mucajaí', 'Bacia do Rio Uraricoera'],
      historicEvents: [
        'Enchente histórica de 2011 do Rio Branco atingindo 10,28m em Boa Vista.',
        'Incêndio florestal monumental de 1998 e seca extrema de 2024 no Lavrado.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 1.0, location: 'Topo do Monte Roraima', date: 'Janeiro de 2019', context: 'Platô do Monte Roraima a 2.700m sob ventos congelantes e nevoeiro permanente.' },
      recordHeat: { temp: 40.5, location: 'Boa Vista', date: 'Fevereiro de 2024', context: 'Seca extrema do El Niño no Lavrado com baixa umidade.' },
    },
    reliefGeography: {
      predominantRelief: 'Maciço das Guianas e Planalto de Tepuis ao norte',
      highestPoint: { name: 'Monte Roraima (Tepui Tríplice Brasil/Venezuela/Guiana)', altitudeM: 2734 },
      mainLandforms: ['Tepuis e Formações Primitivas de Arenito', 'Campos do Lavrado de Boa Vista', 'Serra do Tepequém'],
      environmentalHighlights: 'Uma das formações geológicas mais antigas do planeta Terra (Tepuis do Pré-Cambriano).',
    },
  },
  SC: {
    id: 'SC',
    name: 'Santa Catarina',
    capital: 'Florianópolis',
    region: 'Sul',
    koppenClimate: 'Cfa (Litoral/Oeste) / Cfb (Planalto Serrano)',
    koppenDescription: 'Subtropical úmido, estado com os maiores índices de neve e geadas do Brasil nos planaltos.',
    annualRainfallMm: 1700,
    rainySeason: 'Sem estação seca (Alta frequência de ciclones e frentes frias)',
    drySeason: 'Sem seca sazonal definida',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Itajaí-Açu', 'Bacia do Rio Tubarão', 'Bacia do Rio Uruguai / Tijucas'],
      historicEvents: [
        'Tragédia Climática de Novembro de 2008 no Vale do Itajaí: Deslizamentos maciços em Blumenau, Ilhota e Gaspar após semanas de chuva ininterrupta.',
        'Grande Enchente de 1983 e 1984 e passagens de furacões/ciclones (Furacão Catarina em 2004).',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -14.0, location: 'Caçador / Urupema / Urubici', date: 'Junho de 1952', context: 'Recorde absoluto oficial de menor temperatura do Brasil pelo INMET, com congelamento total de cachoeiras.' },
      recordHeat: { temp: 41.3, location: 'Criciúma / Itapiranga', date: 'Janeiro de 2022', context: 'Ar quente tropical comprimido contra a Serra Geral.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto Serrano, Serra Geral e Planície Litorânea Recortada',
      highestPoint: { name: 'Morro da Boa Vista', altitudeM: 1827 },
      mainLandforms: ['Serra do Rio do Rastro (Escarpa Monumental)', 'Morro da Igreja e Pedra Furada', 'Vale Europeu do Itajaí'],
      environmentalHighlights: 'Região mais fria do Brasil, com turismo de neve em São Joaquim, Urupema e Urubici.',
    },
  },
  SP: {
    id: 'SP',
    name: 'São Paulo',
    capital: 'São Paulo',
    region: 'Sudeste',
    koppenClimate: 'Cwa / Cwb / Af (Litoral)',
    koppenDescription: 'Tropical de altitude no centro-leste, Subtropical no sul e Tropical superúmido na Baixada Santista e Litoral Norte.',
    annualRainfallMm: 1550,
    rainySeason: 'Dezembro a Março',
    drySeason: 'Junho a Agosto',
    floodHistory: {
      vulnerabilityLevel: 'Muito Alta',
      mainBasins: ['Bacia do Rio Tietê', 'Bacia do Rio Pinheiros', 'Bacia do Rio Paraíba do Sul / Piracicaba'],
      historicEvents: [
        'Desastre do Litoral Norte em Fevereiro de 2023: São Sebastião registrou 683mm em 24h (maior chuva acumulada da história do Brasil), causando centenas de deslizamentos na Serra do Mar.',
        'Crise Hídrica do Sistema Cantareira de 2014-2015 com uso de volume morto.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: -3.9, location: 'Campos do Jordão / Itapeva', date: 'Julho de 1975', context: 'Geada negra e formação de camadas grossas de gelo na Mantiqueira.' },
      recordHeat: { temp: 43.5, location: 'Lins / Dracena (Oeste)', date: 'Outubro de 2020', context: 'Onda histórica de calor com bloqueio continental prolongado.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto Atlântico, Depressão Periférica Paulista e Planalto Ocidental',
      highestPoint: { name: 'Pedra da Mina (Serra da Mantiqueira)', altitudeM: 2798 },
      mainLandforms: ['Serra do Mar e Serra da Mantiqueira', 'Cuestas Basálticas de Botucatu', 'Vale do Ribeira'],
      environmentalHighlights: 'Maior polo econômico e demográfico, abrigando o maior remanescente contínuo de Mata Atlântica no Parque Estadual da Serra do Mar.',
    },
  },
  SE: {
    id: 'SE',
    name: 'Sergipe',
    capital: 'Aracaju',
    region: 'Nordeste',
    koppenClimate: 'As (Litoral) / BSh (Sertão do São Francisco)',
    koppenDescription: 'Tropical litorâneo com chuvas de outono/inverno e Semiárido quente no Alto Sertão.',
    annualRainfallMm: 1400,
    rainySeason: 'Abril a Julho',
    drySeason: 'Outubro a Fevereiro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio São Francisco', 'Bacia do Rio Sergipe', 'Bacia do Rio Vaza-Barris'],
      historicEvents: [
        'Enchentes de Julho de 2019 e 2022 com transbordamento do Rio Sergipe e alagamentos em Aracaju e Estância.',
        'Cânions do Xingó e controle de vazão das usinas hidrelétricas do São Francisco.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 13.8, location: 'Simão Dias / Poço Verde', date: 'Agosto de 1978', context: 'Ar polar seco penetrando no agreste sergipano.' },
      recordHeat: { temp: 41.0, location: 'Canindé de São Francisco / Poço Redondo', date: 'Novembro de 2023', context: 'Calor extremo nos cânions rochosos do semiárido.' },
    },
    reliefGeography: {
      predominantRelief: 'Planície Costeira, Tabuleiros Areníticos e Depressão Sertaneja',
      highestPoint: { name: 'Serra Negra (Poço Redondo)', altitudeM: 742 },
      mainLandforms: ['Cânion do Rio São Francisco em Xingó', 'Foz do Rio São Francisco (Brejo Grande)', 'Manguezais do Rio Vaza-Barris'],
      environmentalHighlights: 'Menor estado em extensão territorial com imenso patrimônio estuarino e os majestosos cânions do Velho Chico.',
    },
  },
  TO: {
    id: 'TO',
    name: 'Tocantins',
    capital: 'Palmas',
    region: 'Norte',
    koppenClimate: 'Aw',
    koppenDescription: 'Tropical semiúmido com verões torrenciais e 5 meses de estiagem pronunciada no inverno.',
    annualRainfallMm: 1700,
    rainySeason: 'Outubro a Abril',
    drySeason: 'Maio a Setembro',
    floodHistory: {
      vulnerabilityLevel: 'Alta',
      mainBasins: ['Bacia do Rio Tocantins', 'Bacia do Rio Araguaia', 'Bacia do Rio Sono / Formoso'],
      historicEvents: [
        'Cheias de 2021 e 2022 no Rio Tocantins e Araguaia com desalojamento de comunidades ribeirinhas.',
        'Ilha do Bananal (Maior ilha fluvial do mundo) com alagamentos anuais sazonais.',
      ],
    },
    temperatureExtremes: {
      recordCold: { temp: 8.8, location: 'Arraias / Dianópolis (Serras Gerais)', date: 'Julho de 1975', context: 'Altitude nas escarpas calcárias das Serras Gerais.' },
      recordHeat: { temp: 43.2, location: 'Peixe / Paranã', date: 'Outubro de 2020', context: 'Calor tórrido no vale do Tocantins com umidade < 10%.' },
    },
    reliefGeography: {
      predominantRelief: 'Planalto Residual do Tocantins, Jalapão e Planície do Araguaia',
      highestPoint: { name: 'Serra das Traíras (Paranã)', altitudeM: 1340 },
      mainLandforms: ['Dunas Douradas e Fervedouros do Jalapão', 'Ilha do Bananal', 'Serras Gerais e Cânions de Aurora do Tocantins'],
      environmentalHighlights: 'Oásis do Jalapão com nascentes cristalinas (fervedouros) que nunca secam em meio ao Cerrado.',
    },
  },
};
