

## Plano: Redirecionar /servicos para / e remover a página

### Situação Atual

A página `/servicos` é referenciada em **8 arquivos**:

| Arquivo | Tipo de referência |
|---|---|
| `src/App.tsx` | Rota + import lazy |
| `src/pages/Servicos.tsx` | Página em si |
| `src/components/Header.tsx` | Link "Todos os Serviços" no menu |
| `src/components/Footer.tsx` | Link "Todos os Serviços" no rodapé |
| `src/components/sections/Services.tsx` | Links de 3 cards + CTA |
| `src/components/sections/NichesCarousel.tsx` | Botão "Ver todos os segmentos" |
| `src/pages/NotFound.tsx` | Link sugerido na 404 |
| `src/pages/CidadesAtendidas.tsx` | Botão "Ver Serviços" |
| Breadcrumbs (Medicos, Dentistas, Psicólogos, Representantes, AbrirEmpresa) | URL no schema breadcrumb |
| `src/components/LegacyRedirects.tsx` | Redirects legados apontando para /servicos |
| `supabase/functions/sitemap/index.ts` | Entrada no sitemap |
| `supabase/functions/google-search-console/index.ts` | Array de páginas estáticas |

### Alterações Planejadas

1. **App.tsx** — Remover import do `Servicos` e substituir a rota por redirect: `<Route path="/servicos" element={<Navigate to="/" replace />} />` (redirect 301 client-side para quem já tem a URL indexada)

2. **Atualizar links em 8 arquivos** — Trocar `/servicos` por `/`:
   - `Header.tsx` — link "Todos os Serviços" → `/`
   - `Footer.tsx` — link "Todos os Serviços" → `/`
   - `Services.tsx` — 3 cards + CTA → `/`
   - `NichesCarousel.tsx` — botão → `/`
   - `NotFound.tsx` — link sugerido → `/`
   - `CidadesAtendidas.tsx` — botão → `/`
   - Breadcrumbs (5 páginas de segmentos + AbrirEmpresa) — URL → `/`
   - `LegacyRedirects.tsx` — redirects legados → `/`

3. **Sitemap e indexação** — Remover `/servicos` do sitemap e do array de páginas estáticas do Google Search Console

4. **Deletar** `src/pages/Servicos.tsx`

### Observação
A rota `/servicos` será mantida temporariamente no App.tsx como redirect para `/`, garantindo que URLs já indexadas no Google ou bookmarks de usuários continuem funcionando.

