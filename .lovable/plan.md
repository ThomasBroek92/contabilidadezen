

# Plano: Integração de Avaliações do Google Meu Negócio

## Resumo

Este plano implementa a sincronização automática de avaliações do Google Meu Negócio (GMB) com o site, exibindo apenas avaliações com **4 ou 5 estrelas** na seção de depoimentos, incluindo selo oficial do Google para reforçar credibilidade.

---

## Arquitetura da Solução

```text
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│   Google My Business │ ──▶ │   Edge Function     │ ──▶ │   Tabela gmb_reviews │
│   Reviews API        │      │   sync-gmb-reviews  │      │   (Cache local)      │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────────┐
                                                          │   Testimonials.tsx  │
                                                          │   (Componente React)│
                                                          └─────────────────────┘
```

**Estratégia**: Sincronização periódica (cache) ao invés de chamadas em tempo real para garantir performance e evitar limites de rate da API.

---

## O que será implementado

### 1. Tabela de Cache para Avaliações
- **Nome**: `gmb_reviews`
- **Campos**: ID do Google, nome do autor, foto, rating, texto da avaliação, data, etc.
- **Filtro automático**: Apenas avaliações com rating >= 4 são armazenadas

### 2. Edge Function para Sincronização
- **Nome**: `sync-gmb-reviews`
- **Função**: Buscar avaliações da API do Google e salvar no banco
- **Ações**:
  - Autenticar via Service Account (já configurado)
  - Chamar endpoint `/v4/accounts/{accountId}/locations/{locationId}/reviews`
  - Filtrar apenas rating >= 4
  - Inserir/atualizar no banco de dados
  - Retornar também nota média e total de avaliações

### 3. Componente React Atualizado
- **Arquivo**: `src/components/sections/Testimonials.tsx`
- **Mudanças**:
  - Carregar avaliações do banco via Supabase
  - Manter depoimentos manuais como fallback
  - Exibir selo "Google Reviews" oficial
  - Mostrar nota média e quantidade de avaliações
  - Link para o perfil do Google Meu Negócio

---

## Passo a Passo de Implementação

### Etapa 1: Criar tabela `gmb_reviews`

**SQL Migration:**
```sql
CREATE TABLE public.gmb_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_review_id TEXT UNIQUE NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_time TIMESTAMPTZ NOT NULL,
  reply_comment TEXT,
  reply_time TIMESTAMPTZ,
  is_visible BOOLEAN DEFAULT true,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_gmb_reviews_rating ON public.gmb_reviews(rating);
CREATE INDEX idx_gmb_reviews_visible ON public.gmb_reviews(is_visible);
CREATE INDEX idx_gmb_reviews_time ON public.gmb_reviews(review_time DESC);

-- Trigger para updated_at
CREATE TRIGGER update_gmb_reviews_updated_at
  BEFORE UPDATE ON public.gmb_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Leitura pública para exibir no site
ALTER TABLE public.gmb_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avaliações visíveis são públicas"
  ON public.gmb_reviews FOR SELECT
  USING (is_visible = true AND rating >= 4);

CREATE POLICY "Admins podem gerenciar avaliações"
  ON public.gmb_reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
```

**Também criar tabela para cache de estatísticas:**
```sql
CREATE TABLE public.gmb_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  average_rating NUMERIC(2,1) NOT NULL,
  total_reviews INTEGER NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Leitura pública
ALTER TABLE public.gmb_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats são públicos" ON public.gmb_stats FOR SELECT USING (true);
CREATE POLICY "Admins podem atualizar stats" ON public.gmb_stats FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

---

### Etapa 2: Criar Edge Function `sync-gmb-reviews`

**Arquivo**: `supabase/functions/sync-gmb-reviews/index.ts`

**Funcionalidades**:
1. Reutilizar lógica de autenticação do `publish-to-gmb` (getAccessToken)
2. Chamar API: `GET /v4/accounts/{accountId}/locations/{locationId}/reviews`
3. Filtrar reviews com rating >= 4
4. Fazer upsert na tabela `gmb_reviews` (baseado em google_review_id)
5. Atualizar `gmb_stats` com averageRating e totalReviewCount
6. Pode ser chamada manualmente pelo admin ou via cron

**Resposta da API do Google:**
```json
{
  "reviews": [{
    "name": "accounts/xxx/locations/xxx/reviews/xxx",
    "reviewId": "xxx",
    "reviewer": {
      "profilePhotoUrl": "https://...",
      "displayName": "João Silva"
    },
    "starRating": "FIVE",
    "comment": "Excelente serviço...",
    "createTime": "2024-01-15T10:30:00Z",
    "updateTime": "2024-01-15T10:30:00Z",
    "reviewReply": {
      "comment": "Obrigado...",
      "updateTime": "2024-01-16T09:00:00Z"
    }
  }],
  "averageRating": 4.8,
  "totalReviewCount": 47
}
```

---

### Etapa 3: Atualizar `supabase/config.toml`

Adicionar configuração da nova função:
```toml
[functions.sync-gmb-reviews]
verify_jwt = false
```

---

### Etapa 4: Atualizar Componente `Testimonials.tsx`

**Mudanças visuais:**

1. **Header atualizado** com selo do Google:
   - Logo do Google colorido
   - Nota média (ex: "4.8")
   - Estrelas preenchidas
   - Total de avaliações (ex: "47 avaliações")
   - Link para o perfil no Google

2. **Cards de avaliação**:
   - Badge discreto "Via Google" no canto
   - Foto do autor (quando disponível)
   - Data relativa (ex: "há 2 semanas")
   - Manter layout atual com pequenas adaptações

3. **Fallback inteligente**:
   - Se não houver avaliações do Google, mostrar depoimentos manuais
   - Se houver menos de 3 do Google, complementar com manuais

**Novo fluxo de dados:**
```tsx
// Hook para buscar avaliações
const { data: reviews } = useQuery({
  queryKey: ['gmb-reviews'],
  queryFn: async () => {
    const { data } = await supabase
      .from('gmb_reviews')
      .select('*')
      .gte('rating', 4)
      .eq('is_visible', true)
      .order('review_time', { ascending: false })
      .limit(6);
    return data;
  }
});

const { data: stats } = useQuery({
  queryKey: ['gmb-stats'],
  queryFn: async () => {
    const { data } = await supabase
      .from('gmb_stats')
      .select('*')
      .order('synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }
});
```

---

### Etapa 5: Adicionar Botão de Sync no Admin

**Arquivo**: `src/components/admin/GoogleIntegrationGuide.tsx`

Adicionar seção "Google Reviews" com:
- Botão "Sincronizar Avaliações"
- Status da última sincronização
- Contagem de avaliações no banco
- Preview das avaliações importadas

---

## Layout Visual Proposto

```text
┌─────────────────────────────────────────────────────────────────┐
│                         DEPOIMENTOS                             │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  [G] Google Reviews   ★★★★★ 4.8  •  47 avaliações  →   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   O que nossos clientes dizem                                   │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │  [G] Google  │  │  [G] Google  │  │  [G] Google  │          │
│   │              │  │              │  │              │          │
│   │  ★★★★★       │  │  ★★★★☆       │  │  ★★★★★       │          │
│   │              │  │              │  │              │          │
│   │  "Excelente  │  │  "Ótimo      │  │  "Muito      │          │
│   │   serviço!"  │  │   atendim."  │  │   satisfeito"│          │
│   │              │  │              │  │              │          │
│   │  👤 João S.  │  │  👤 Maria L. │  │  👤 Pedro R. │          │
│   │  há 2 sem.   │  │  há 1 mês    │  │  há 3 dias   │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detalhes Técnicos

### Conversão de Rating
A API retorna rating como string (`"FIVE"`, `"FOUR"`, etc). Conversão:
```typescript
const ratingMap: Record<string, number> = {
  'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5
};
```

### Escopo necessário na Service Account
O escopo `https://www.googleapis.com/auth/business.manage` (já configurado) inclui permissão para leitura de reviews.

### Credenciais já configuradas
- `GOOGLE_SERVICE_ACCOUNT_JSON` ✅
- `GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID` ✅
- `GOOGLE_BUSINESS_PROFILE_LOCATION_ID` ✅

### Rate Limiting
- API permite ~1000 requests/dia
- Sincronização 1x por hora é mais que suficiente
- Implementar cache no banco evita chamadas desnecessárias

---

## Arquivos a serem criados/modificados

| Arquivo | Ação |
|---------|------|
| `supabase/functions/sync-gmb-reviews/index.ts` | Criar |
| `supabase/config.toml` | Modificar (adicionar função) |
| `src/components/sections/Testimonials.tsx` | Modificar |
| `src/components/admin/GoogleIntegrationGuide.tsx` | Modificar (adicionar sync) |
| **Migração SQL** | Criar tabelas `gmb_reviews` e `gmb_stats` |

---

## Benefícios

1. **Credibilidade**: Selo do Google aumenta confiança
2. **Prova social real**: Avaliações verificadas, não inventadas
3. **SEO**: Google valoriza sites que integram GMB
4. **Atualização automática**: Novas avaliações aparecem automaticamente
5. **Controle**: Admins podem ocultar avaliações específicas se necessário
6. **Performance**: Cache local evita latência da API

