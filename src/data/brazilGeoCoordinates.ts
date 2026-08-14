export interface StateGeoInfo {
  id: string;
  name: string;
  capital: string;
  region: string;
  biome: string;
  lat: number;
  lon: number;
}

export const BRAZIL_STATES_GEO: Record<string, StateGeoInfo> = {
  AC: { id: 'AC', name: 'Acre', capital: 'Rio Branco', region: 'Norte', biome: 'Amazônia', lat: -9.02, lon: -70.81 },
  AL: { id: 'AL', name: 'Alagoas', capital: 'Maceió', region: 'Nordeste', biome: 'Caatinga / Mata Atlântica', lat: -9.57, lon: -36.78 },
  AP: { id: 'AP', name: 'Amapá', capital: 'Macapá', region: 'Norte', biome: 'Amazônia', lat: 0.90, lon: -52.00 },
  AM: { id: 'AM', name: 'Amazonas', capital: 'Manaus', region: 'Norte', biome: 'Amazônia', lat: -3.41, lon: -65.85 },
  BA: { id: 'BA', name: 'Bahia', capital: 'Salvador', region: 'Nordeste', biome: 'Caatinga / Cerrado / Mata Atlântica', lat: -12.57, lon: -41.70 },
  CE: { id: 'CE', name: 'Ceará', capital: 'Fortaleza', region: 'Nordeste', biome: 'Caatinga', lat: -5.49, lon: -39.32 },
  DF: { id: 'DF', name: 'Distrito Federal', capital: 'Brasília', region: 'Centro-Oeste', biome: 'Cerrado', lat: -15.79, lon: -47.88 },
  ES: { id: 'ES', name: 'Espírito Santo', capital: 'Vitória', region: 'Sudeste', biome: 'Mata Atlântica', lat: -19.18, lon: -40.30 },
  GO: { id: 'GO', name: 'Goiás', capital: 'Goiânia', region: 'Centro-Oeste', biome: 'Cerrado', lat: -15.82, lon: -49.83 },
  MA: { id: 'MA', name: 'Maranhão', capital: 'São Luís', region: 'Nordeste', biome: 'Amazônia / Cerrado / Caatinga', lat: -4.96, lon: -45.27 },
  MT: { id: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', region: 'Centro-Oeste', biome: 'Amazônia / Cerrado / Pantanal', lat: -12.68, lon: -55.89 },
  MS: { id: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', region: 'Centro-Oeste', biome: 'Cerrado / Pantanal', lat: -20.77, lon: -54.78 },
  MG: { id: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', region: 'Sudeste', biome: 'Cerrado / Mata Atlântica', lat: -18.51, lon: -44.55 },
  PA: { id: 'PA', name: 'Pará', capital: 'Belém', region: 'Norte', biome: 'Amazônia', lat: -1.99, lon: -54.93 },
  PB: { id: 'PB', name: 'Paraíba', capital: 'João Pessoa', region: 'Nordeste', biome: 'Caatinga / Mata Atlântica', lat: -7.23, lon: -36.78 },
  PR: { id: 'PR', name: 'Paraná', capital: 'Curitiba', region: 'Sul', biome: 'Mata Atlântica / Pampas', lat: -25.25, lon: -52.02 },
  PE: { id: 'PE', name: 'Pernambuco', capital: 'Recife', region: 'Nordeste', biome: 'Caatinga / Mata Atlântica', lat: -8.81, lon: -36.95 },
  PI: { id: 'PI', name: 'Piauí', capital: 'Teresina', region: 'Nordeste', biome: 'Caatinga / Cerrado', lat: -7.71, lon: -42.72 },
  RJ: { id: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', region: 'Sudeste', biome: 'Mata Atlântica', lat: -22.90, lon: -43.17 },
  RN: { id: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', region: 'Nordeste', biome: 'Caatinga / Mata Atlântica', lat: -5.79, lon: -36.56 },
  RS: { id: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', region: 'Sul', biome: 'Pampa / Mata Atlântica', lat: -30.03, lon: -51.21 },
  RO: { id: 'RO', name: 'Rondônia', capital: 'Porto Velho', region: 'Norte', biome: 'Amazônia / Cerrado', lat: -11.50, lon: -63.58 },
  RR: { id: 'RR', name: 'Roraima', capital: 'Boa Vista', region: 'Norte', biome: 'Amazônia / Cerrado', lat: 2.73, lon: -62.05 },
  SC: { id: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', region: 'Sul', biome: 'Mata Atlântica', lat: -27.24, lon: -50.21 },
  SP: { id: 'SP', name: 'São Paulo', capital: 'São Paulo', region: 'Sudeste', biome: 'Mata Atlântica / Cerrado', lat: -23.55, lon: -46.63 },
  SE: { id: 'SE', name: 'Sergipe', capital: 'Aracaju', region: 'Nordeste', biome: 'Caatinga / Mata Atlântica', lat: -10.57, lon: -37.38 },
  TO: { id: 'TO', name: 'Tocantins', capital: 'Palmas', region: 'Norte', biome: 'Cerrado / Amazônia', lat: -10.17, lon: -48.29 },
};

/**
 * Converts Geographic Latitude and Longitude to 3D Cartesian Coordinates on a Sphere
 */
export function latLonToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}
