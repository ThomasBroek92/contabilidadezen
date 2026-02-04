

# Plano: Criar Pagina de Cidades Atendidas

## Resumo

Criar uma nova pagina dedicada em `/cidades-atendidas` que exibe todas as cidades onde a Contabilidade Zen oferece servicos, organizada por regioes. A pagina seguira o layout padrao do site (similar a pagina Abrir Empresa) e sera acessada via link no Footer.

---

## Arquivos a Criar/Modificar

### 1. CRIAR: `src/pages/CidadesAtendidas.tsx`

Nova pagina completa seguindo o padrao do site.

### 2. MODIFICAR: `src/components/Footer.tsx`

Adicionar link "Cidades Atendidas" na secao "Empresa".

### 3. MODIFICAR: `src/App.tsx`

Adicionar rota `/cidades-atendidas`.

---

## Estrutura da Pagina CidadesAtendidas.tsx

### Hero Section

```text
+--------------------------------------------------+
|  HERO SECTION (fundo gradiente)                  |
+--------------------------------------------------+
|  [Badge] Atendimento Nacional                    |
|                                                  |
|  H1: Cidades Atendidas pela                      |
|      Contabilidade Zen                           |
|                                                  |
|  Subtitulo: Atendemos em todo o Brasil, com      |
|  especializacao nas regioes Sul e Sudeste,       |
|  especialmente na Regiao de Campinas.            |
|                                                  |
|  [ FALAR COM ESPECIALISTA ] [ VER SERVICOS ]     |
+--------------------------------------------------+
```

### Secao: Regiao Metropolitana de Campinas (Destaque)

```text
+--------------------------------------------------+
|  SECAO RMC - DESTAQUE MAXIMO                     |
+--------------------------------------------------+
|  [MapPin] Regiao de Campinas - Nossa Sede        |
|                                                  |
|  Subtitulo: Atendimento especializado e          |
|  personalizado para as 20 cidades da RMC         |
|                                                  |
|  +----------------------------------------------+|
|  |  WORD CLOUD GRANDE (todas as 20 cidades)    ||
|  |  Campinas (maior destaque)                  ||
|  |  Americana, Indaiatuba, Sumare...           ||
|  +----------------------------------------------+|
+--------------------------------------------------+
```

### Secao: Sul e Sudeste

```text
+--------------------------------------------------+
|  SECAO SUL E SUDESTE                             |
+--------------------------------------------------+
|  [MapPin] Regioes Sul e Sudeste                  |
|                                                  |
|  Cards por Estado:                               |
|  +----------+ +----------+ +----------+          |
|  | SAO PAULO| | RIO DE   | | MINAS    |          |
|  | 28 cidades| | JANEIRO | | GERAIS   |          |
|  |          | | 4 cidades| | 3 cidades|          |
|  +----------+ +----------+ +----------+          |
|                                                  |
|  +----------+ +----------+ +----------+          |
|  | PARANA   | | SANTA    | | RIO GDE  |          |
|  | 4 cidades| | CATARINA | | DO SUL   |          |
|  |          | | 2 cidades| | 1 cidade |          |
|  +----------+ +----------+ +----------+          |
|                                                  |
|  (lista completa de cidades por estado)          |
+--------------------------------------------------+
```

### Secao: Outras Regioes

```text
+--------------------------------------------------+
|  SECAO OUTRAS REGIOES                            |
+--------------------------------------------------+
|  [Globe] Atendimento Nacional                    |
|                                                  |
|  Tambem atendemos clientes em:                   |
|                                                  |
|  NORDESTE: Salvador, Fortaleza, Recife, Natal,   |
|            Joao Pessoa, Maceio, Aracaju, Sao Luis|
|                                                  |
|  CENTRO-OESTE: Brasilia, Goiania, Campo Grande,  |
|                Cuiaba                            |
|                                                  |
|  NORTE: Manaus, Belem                            |
+--------------------------------------------------+
```

### Secao: Por que Contabilidade Digital?

```text
+--------------------------------------------------+
|  SECAO BENEFICIOS                                |
+--------------------------------------------------+
|  +----------+ +----------+ +----------+          |
|  | 100%     | | Atend.   | | Economia |          |
|  | Digital  | | Nacional | | de       |          |
|  |          | |          | | Impostos |          |
|  +----------+ +----------+ +----------+          |
|                                                  |
|  +----------+ +----------+ +----------+          |
|  | Suporte  | | Sem      | | Especial.|          |
|  | Humano   | | Desloc.  | | p/ Saude |          |
|  +----------+ +----------+ +----------+          |
+--------------------------------------------------+
```

### Secao: FAQ

```text
+--------------------------------------------------+
|  SECAO FAQ (Accordion)                           |
+--------------------------------------------------+
|  1. Voces atendem minha cidade?                  |
|  2. Preciso ir ao escritorio presencialmente?    |
|  3. Como funciona o atendimento digital?         |
|  4. Qual a diferenca de atender presencial/online|
|  5. Posso migrar minha contabilidade de outra?   |
+--------------------------------------------------+
```

### CTA Final

```text
+--------------------------------------------------+
|  CTA FINAL (fundo gradiente)                     |
|                                                  |
|  Pronto para ter uma contabilidade digital       |
|  de verdade?                                     |
|                                                  |
|  [ FALAR COM ESPECIALISTA ]                      |
|                                                  |
|  - Atendimento personalizado para sua cidade     |
|  - Sem compromisso                               |
+--------------------------------------------------+
```

---

## Dados Reutilizados

A pagina ira importar os dados de `src/components/sections/CitiesSection/citiesData.ts`:

- **RMC (20 cidades)**: Campinas, Americana, Indaiatuba, Sumare, Hortolandia, etc.
- **Sudeste (36 cidades)**: Sao Paulo, Guarulhos, Rio de Janeiro, Belo Horizonte, etc.
- **Sul (7 cidades)**: Curitiba, Florianopolis, Porto Alegre, etc.
- **Outras (15 cidades)**: Salvador, Brasilia, Manaus, etc.

---

## Organizacao Visual por Estado

Agrupar cidades do Sudeste por estado para melhor visualizacao:

| Estado | Cidades |
|--------|---------|
| Sao Paulo | Sao Paulo, Guarulhos, Santos, Sorocaba, Ribeirao Preto, etc. |
| Rio de Janeiro | Rio de Janeiro, Duque de Caxias, Niteroi, Nova Iguacu |
| Minas Gerais | Belo Horizonte, Contagem, Uberlandia |
| Espirito Santo | Vitoria |
| Parana | Curitiba, Londrina, Maringa, Pinhais |
| Santa Catarina | Blumenau, Florianopolis |
| Rio Grande do Sul | Porto Alegre |

---

## SEO

```typescript
<SEOHead
  title="Cidades Atendidas | Contabilidade Digital em Todo Brasil"
  description="A Contabilidade Zen atende empresas e profissionais em todo o Brasil. Veja a lista completa de cidades atendidas, com foco na regiao de Campinas, Sul e Sudeste."
  keywords="contabilidade Campinas, contabilidade Americana, contador digital, contabilidade online Brasil"
  canonical="/cidades-atendidas"
  pageType="service"
  includeLocalBusiness
  faqs={faqData}
/>
```

---

## Alteracao no Footer

Adicionar link na secao "Empresa":

```typescript
{[
  { name: "Sobre Nos", href: "/sobre" },
  { name: "Abrir Empresa", href: "/abrir-empresa" },
  { name: "Indique e Ganhe", href: "/indique-e-ganhe" },
  { name: "Cidades Atendidas", href: "/cidades-atendidas" },  // NOVO
  { name: "Contato", href: "/contato" },
]}
```

---

## Componentes Reutilizados

- Header, Footer
- SEOHead
- Button, Badge
- Accordion (para FAQ)
- StaggerContainer, StaggerItem (animacoes)
- citiesData (dados das cidades)

---

## Icones Lucide

- MapPin (regioes)
- Globe (atendimento nacional)
- MessageCircle (CTA WhatsApp)
- CheckCircle2 (beneficios)
- Building2 (escritorio)
- Laptop (digital)
- Users (atendimento)

---

## Ordem de Implementacao

1. Criar arquivo `src/pages/CidadesAtendidas.tsx` com todas as secoes
2. Adicionar rota em `src/App.tsx`
3. Adicionar link no Footer.tsx
4. Atualizar sitemap e page_metadata

