
# Plano: Sitemap Dinamico com Lastmod Preciso

## Resumo Executivo

Vou implementar um sistema de sitemap dinamico que garante que o Google sempre receba datas de atualizacao precisas para todas as paginas. Isso melhora significativamente a priorizacao do Googlebot, pois ele sabera exatamente quais paginas foram alteradas recentemente.

---

## Situacao Atual

| Aspecto | Status |
|---------|--------|
| Sitemap estatico | `public/sitemap.xml` com 69 URLs |
| Datas de lastmod | Fixas em `2025-01-27` para paginas estaticas |
| Blog posts | Usam `updated_at` do banco (correto) |
| Edge Function | Existe em `supabase/functions/sitemap` mas nao esta sendo usada |

**Problema**: O Google Search Console exige que o sitemap esteja no mesmo dominio verificado, por isso usamos o arquivo estatico. Porem, as datas `lastmod` ficam desatualizadas.

---

## Solucao Proposta

### Estrategia Hibrida

Manter o arquivo estatico `public/sitemap.xml` mas criar um sistema de regeneracao automatica que atualiza as datas sempre que o site for publicado ou um post for modificado.

```text
+------------------+       +-------------------+       +------------------+
|  Blog Post       | ----> | Edge Function     | ----> | sitemap.xml      |
|  Publicado/Edit  |       | regenerate-sitemap|       | Atualizado       |
+------------------+       +-------------------+       +------------------+
                                    |
                                    v
                           +-------------------+
                           | Tabela: page_meta |
                           | (datas de modif.) |
                           +-------------------+
```

---

## Implementacao

### Etapa 1: Criar Tabela `page_metadata`

Nova tabela para armazenar as datas de modificacao das paginas estaticas:

```sql
CREATE TABLE page_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT UNIQUE NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority DECIMAL(2,1) DEFAULT 0.5,
  changefreq TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Dados iniciais**: Inserir as 17 paginas estaticas com a data de hoje.

### Etapa 2: Atualizar Edge Function do Sitemap

Modificar `supabase/functions/sitemap/index.ts` para:

1. Buscar datas de `page_metadata` para paginas estaticas
2. Buscar `updated_at` de `blog_posts` para posts
3. Retornar XML dinamico com datas precisas

### Etapa 3: Criar Endpoint de Regeneracao

Adicionar uma action `regenerate` na Edge Function que:

1. Atualiza a data de uma pagina especifica na tabela `page_metadata`
2. Permite atualizar todas as paginas de uma vez
3. Pode ser chamado pelo admin ou por triggers

### Etapa 4: Trigger Automatico para Blog Posts

Criar trigger que atualiza a tabela `page_metadata` quando:
- Um blog post e publicado
- Um blog post e atualizado

### Etapa 5: Sincronizacao com Arquivo Estatico

Como o sitemap precisa estar em `/sitemap.xml` no dominio principal:

**Opcao A (Recomendada)**: Configurar redirect/proxy no servidor
- Redirecionar `/sitemap.xml` para a Edge Function

**Opcao B**: Regenerar arquivo estatico periodicamente
- CRON job diario que atualiza `public/sitemap.xml`

---

## Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `supabase/functions/sitemap/index.ts` | Atualizar para usar tabela `page_metadata` |
| Nova migracao SQL | Criar tabela `page_metadata` com dados iniciais |
| `supabase/config.toml` | Nenhuma alteracao necessaria |

---

## Detalhes Tecnicos

### Estrutura da Tabela page_metadata

```sql
-- Inserir paginas estaticas com datas de hoje
INSERT INTO page_metadata (path, priority, changefreq) VALUES
  ('/', 1.0, 'weekly'),
  ('/servicos', 0.9, 'monthly'),
  ('/sobre', 0.8, 'monthly'),
  ('/contato', 0.8, 'monthly'),
  ('/blog', 0.9, 'daily'),
  ('/abrir-empresa', 0.9, 'monthly'),
  ('/medicos', 0.8, 'monthly'),
  ('/indique-e-ganhe', 0.7, 'monthly'),
  ('/segmentos/contabilidade-para-medicos', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-dentistas', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-psicologos', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-representantes-comerciais', 0.9, 'monthly'),
  ('/conteudo/calculadora-pj-clt', 0.8, 'monthly'),
  ('/conteudo/comparativo-tributario', 0.8, 'monthly'),
  ('/conteudo/gerador-rpa', 0.8, 'monthly'),
  ('/politica-de-privacidade', 0.3, 'yearly'),
  ('/termos', 0.3, 'yearly');
```

### Edge Function Atualizada

A funcao vai:
1. Consultar `page_metadata` para obter `last_modified` de cada pagina
2. Consultar `blog_posts` para obter `updated_at` de cada post
3. Gerar XML com datas precisas
4. Aceitar action `update-page` para atualizar uma pagina especifica

### Trigger para Blog Posts

```sql
CREATE OR REPLACE FUNCTION update_sitemap_on_blog_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza a data do /blog quando qualquer post muda
  UPDATE page_metadata 
  SET last_modified = NOW() 
  WHERE path = '/blog';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_sitemap_trigger
AFTER INSERT OR UPDATE ON blog_posts
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION update_sitemap_on_blog_change();
```

---

## Beneficios

| Beneficio | Impacto |
|-----------|---------|
| Lastmod preciso | Google prioriza paginas recem-atualizadas |
| Automacao | Nenhuma manutencao manual necessaria |
| Controle granular | Possibilidade de atualizar paginas individualmente |
| Historico | Registro de quando cada pagina foi modificada |

---

## Proximos Passos Apos Implementacao

1. Submeter sitemap atualizado no Google Search Console
2. Monitorar indexacao nas proximas 48h
3. Configurar alerta quando novas paginas forem adicionadas

---

## Estimativa de Tempo

- Etapa 1 (Tabela): 5 minutos
- Etapa 2 (Edge Function): 10 minutos
- Etapa 3 (Trigger): 5 minutos
- Testes: 5 minutos

**Total**: ~25 minutos
