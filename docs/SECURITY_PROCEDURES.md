# Procedimentos de Segurança - Contabilidade Zen

Este documento define os procedimentos padrões de segurança para o desenvolvimento e manutenção do projeto.

## 📋 Checklist de Segurança para Novas Features

### 1. Banco de Dados (RLS Policies)

- [ ] **NUNCA** use `WITH CHECK (true)` ou `USING (true)` para INSERT, UPDATE ou DELETE
- [ ] **SEMPRE** valide dados no servidor usando triggers ou funções
- [ ] **SEMPRE** restrinja acesso por `auth.uid()` ou funções de role (`has_role`, `can_view_leads`)
- [ ] Para dados públicos (SELECT), `USING (true)` é aceitável apenas com justificativa

```sql
-- ❌ ERRADO: Permite qualquer inserção
CREATE POLICY "Anyone can insert" ON table FOR INSERT WITH CHECK (true);

-- ✅ CORRETO: Valida dados mínimos
CREATE POLICY "Validated insert" ON table FOR INSERT 
WITH CHECK (
  length(trim(campo_obrigatorio)) >= 2 AND
  campo_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
```

### 2. Formulários de Lead/Contato

- [ ] **SEMPRE** use validação Zod no cliente antes de submeter
- [ ] **SEMPRE** use o hook `useHoneypot` para proteção contra bots
- [ ] **NUNCA** confie apenas na validação client-side
- [ ] O trigger `validate_lead_input` faz validação server-side

```typescript
// Schema de validação padrão para leads
import { z } from 'zod';

export const leadFormSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').toLowerCase(),
  whatsapp: z.string().regex(/^[0-9+\s()-]{10,20}$/, 'WhatsApp inválido'),
  segmento: z.string().min(1).max(50),
  fonte: z.string().min(1).max(100),
});
```

### 3. Views e Funções

- [ ] **NUNCA** crie views com SECURITY DEFINER (use `security_invoker = true`)
- [ ] Funções SECURITY DEFINER devem ter `search_path` fixo
- [ ] Documente todas as funções SECURITY DEFINER com COMMENT

```sql
-- ✅ View segura
CREATE VIEW public.my_view 
WITH (security_invoker = true) AS
SELECT ...;

-- ✅ Função segura
CREATE FUNCTION my_func() 
SECURITY DEFINER
SET search_path = public
AS $$ ... $$;

COMMENT ON FUNCTION my_func IS 'Descrição da função e seus controles de segurança';
```

### 4. Exposição de Dados

- [ ] **NUNCA** exponha IDs internos (user_id, author_id) em endpoints públicos
- [ ] Use views para filtrar campos sensíveis de tabelas públicas
- [ ] Emails de usuários só devem ser visíveis para o próprio usuário ou admins

```sql
-- View que oculta campos sensíveis
CREATE VIEW public.blog_posts_public AS
SELECT id, title, content, published_at  -- SEM author_id
FROM blog_posts
WHERE status = 'published';
```

### 5. Storage (Arquivos)

- [ ] Buckets públicos: apenas para conteúdo realmente público (imagens de blog publicados)
- [ ] Arquivos de rascunho devem ficar em buckets privados ou com política condicional
- [ ] **SEMPRE** valide tipo de arquivo e tamanho no upload

### 6. Edge Functions

- [ ] **NUNCA** armazene secrets no código
- [ ] Use `Deno.env.get('SECRET_NAME')` para acessar secrets
- [ ] Valide todos os inputs recebidos
- [ ] Adicione rate limiting quando apropriado
- [ ] Sempre inclua CORS headers para funções chamadas pelo frontend

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### 7. Autenticação

- [ ] **NUNCA** use anonymous sign-ups
- [ ] **SEMPRE** habilite auto-confirm para desenvolvimento (configurado)
- [ ] Em produção, considere email verification
- [ ] Habilite "Leaked Password Protection" no dashboard

## 🔐 Estrutura de Segurança Atual

### Camadas de Proteção para Leads

1. **Client-Side**
   - Validação Zod (feedback imediato)
   - Honeypot (detecta bots)
   - Rate limiting visual

2. **Database**
   - Trigger `validate_lead_input` (validação server-side)
   - Rate limit: 3 submissões por email/hora
   - RLS policies com validação

3. **Monitoramento**
   - Tabela `security_audit_log` para eventos
   - Logs do Supabase

### Funções de Controle de Acesso

- `has_role(user_id, role)`: Verifica se usuário tem role específica
- `can_view_leads(user_id)`: Verifica se pode ver leads (admin, sales_manager, sales_rep)

### Roles do Sistema

| Role | Permissões |
|------|-----------|
| `admin` | Acesso total, gerencia usuários e roles |
| `sales_manager` | Visualiza e edita leads, gerencia cadências |
| `sales_rep` | Visualiza leads, cria interações e tarefas |

## 🚨 Respondendo a Incidentes

1. Verifique `security_audit_log` para eventos suspeitos
2. Revise logs do Postgres para erros de permissão
3. Verifique rate limits sendo atingidos (pode indicar ataque)
4. Em caso de vazamento, revogue tokens e notifique usuários

## 📊 Auditoria Periódica

- [ ] Executar linter do Supabase mensalmente
- [ ] Revisar policies RLS trimestralmente
- [ ] Atualizar dependências semanalmente
- [ ] Verificar secrets e rotacionar anualmente
