export interface CityData {
  name: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  region: string;
}

export const citiesData: CityData[] = [
  // Região Metropolitana de Campinas - DESTAQUE MÁXIMO
  { name: "Campinas", priority: "primary", region: "rmc" },
  { name: "Americana", priority: "primary", region: "rmc" },
  { name: "Indaiatuba", priority: "primary", region: "rmc" },
  { name: "Sumaré", priority: "primary", region: "rmc" },
  { name: "Hortolândia", priority: "primary", region: "rmc" },
  { name: "Valinhos", priority: "primary", region: "rmc" },
  { name: "Vinhedo", priority: "primary", region: "rmc" },
  { name: "Santa Bárbara d'Oeste", priority: "primary", region: "rmc" },
  { name: "Paulínia", priority: "primary", region: "rmc" },
  { name: "Jaguariúna", priority: "primary", region: "rmc" },
  { name: "Itatiba", priority: "primary", region: "rmc" },
  { name: "Pedreira", priority: "primary", region: "rmc" },
  { name: "Monte Mor", priority: "primary", region: "rmc" },
  { name: "Nova Odessa", priority: "primary", region: "rmc" },
  { name: "Artur Nogueira", priority: "primary", region: "rmc" },
  { name: "Cosmópolis", priority: "primary", region: "rmc" },
  { name: "Engenheiro Coelho", priority: "primary", region: "rmc" },
  { name: "Holambra", priority: "primary", region: "rmc" },
  { name: "Morungaba", priority: "primary", region: "rmc" },
  { name: "Santo Antônio de Posse", priority: "primary", region: "rmc" },
  
  // São Paulo - Interior e Capital
  { name: "São Paulo", priority: "secondary", region: "sudeste" },
  { name: "Guarulhos", priority: "secondary", region: "sudeste" },
  { name: "Santos", priority: "secondary", region: "sudeste" },
  { name: "São José dos Campos", priority: "secondary", region: "sudeste" },
  { name: "Sorocaba", priority: "secondary", region: "sudeste" },
  { name: "Ribeirão Preto", priority: "secondary", region: "sudeste" },
  { name: "São Bernardo do Campo", priority: "secondary", region: "sudeste" },
  { name: "Santo André", priority: "secondary", region: "sudeste" },
  { name: "Osasco", priority: "secondary", region: "sudeste" },
  { name: "Mauá", priority: "secondary", region: "sudeste" },
  { name: "Diadema", priority: "secondary", region: "sudeste" },
  { name: "Barueri", priority: "secondary", region: "sudeste" },
  { name: "Piracicaba", priority: "secondary", region: "sudeste" },
  { name: "Limeira", priority: "secondary", region: "sudeste" },
  { name: "Jundiaí", priority: "secondary", region: "sudeste" },
  { name: "Bauru", priority: "secondary", region: "sudeste" },
  { name: "São Caetano do Sul", priority: "secondary", region: "sudeste" },
  { name: "Jacareí", priority: "secondary", region: "sudeste" },
  { name: "Atibaia", priority: "secondary", region: "sudeste" },
  { name: "Cotia", priority: "secondary", region: "sudeste" },
  { name: "Embu das Artes", priority: "secondary", region: "sudeste" },
  { name: "Marília", priority: "secondary", region: "sudeste" },
  { name: "Mogi das Cruzes", priority: "secondary", region: "sudeste" },
  { name: "São Carlos", priority: "secondary", region: "sudeste" },
  { name: "Ibitinga", priority: "secondary", region: "sudeste" },
  { name: "Santana de Parnaíba", priority: "secondary", region: "sudeste" },
  { name: "Taboão da Serra", priority: "secondary", region: "sudeste" },
  { name: "São José do Rio Preto", priority: "secondary", region: "sudeste" },
  
  // Rio de Janeiro
  { name: "Rio de Janeiro", priority: "secondary", region: "sudeste" },
  { name: "Duque de Caxias", priority: "secondary", region: "sudeste" },
  { name: "Niterói", priority: "secondary", region: "sudeste" },
  { name: "Nova Iguaçu", priority: "secondary", region: "sudeste" },
  
  // Minas Gerais
  { name: "Belo Horizonte", priority: "secondary", region: "sudeste" },
  { name: "Contagem", priority: "secondary", region: "sudeste" },
  { name: "Uberlândia", priority: "secondary", region: "sudeste" },
  
  // Espírito Santo
  { name: "Vitória", priority: "secondary", region: "sudeste" },
  
  // Paraná
  { name: "Curitiba", priority: "secondary", region: "sul" },
  { name: "Londrina", priority: "secondary", region: "sul" },
  { name: "Maringá", priority: "secondary", region: "sul" },
  { name: "Pinhais", priority: "secondary", region: "sul" },
  
  // Santa Catarina
  { name: "Blumenau", priority: "secondary", region: "sul" },
  { name: "Florianópolis", priority: "secondary", region: "sul" },
  
  // Rio Grande do Sul
  { name: "Porto Alegre", priority: "secondary", region: "sul" },
  
  // Nordeste
  { name: "Salvador", priority: "tertiary", region: "outras" },
  { name: "Fortaleza", priority: "tertiary", region: "outras" },
  { name: "Recife", priority: "tertiary", region: "outras" },
  { name: "Natal", priority: "tertiary", region: "outras" },
  { name: "João Pessoa", priority: "tertiary", region: "outras" },
  { name: "Maceió", priority: "tertiary", region: "outras" },
  { name: "Aracaju", priority: "tertiary", region: "outras" },
  { name: "São Luís", priority: "tertiary", region: "outras" },
  { name: "Teresina", priority: "tertiary", region: "outras" },
  
  // Centro-Oeste
  { name: "Brasília", priority: "tertiary", region: "outras" },
  { name: "Goiânia", priority: "tertiary", region: "outras" },
  { name: "Campo Grande", priority: "tertiary", region: "outras" },
  { name: "Cuiabá", priority: "tertiary", region: "outras" },
  
  // Norte
  { name: "Manaus", priority: "tertiary", region: "outras" },
  { name: "Belém", priority: "tertiary", region: "outras" },
];

export const rmcCities = citiesData.filter(c => c.region === "rmc");
export const sulSudesteCities = citiesData.filter(c => c.region === "sudeste" || c.region === "sul" || c.region === "rmc");
export const outrasCities = citiesData.filter(c => c.region === "outras");

export type FilterType = 'todas' | 'rmc' | 'sul-sudeste' | 'outras';
