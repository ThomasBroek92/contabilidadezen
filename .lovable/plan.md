
# Corrigir Calculadora CLT x PJ -- Lead nao salva e resultado nao carrega

## Causa Raiz

O hook `use-lead-capture.ts` usa `.select('id').single()` apos o INSERT na tabela `leads`. Isso forca o Supabase a executar um SELECT apos a insercao para retornar o ID do lead criado. Porem, a politica RLS de SELECT da tabela `leads` exige usuario **autenticado** com role especifica (`can_view_leads`). Como visitantes anonimos nao sao autenticados, o SELECT falha com erro 42501, e o INSERT inteiro retorna como falha.

Consequencia: `saveLead()` retorna `false`, e a condicao `if (saved && resultado)` na linha 362 do `CalculadoraPJCLT.tsx` nunca e verdadeira -- o usuario nunca e redirecionado para a pagina de resultado.

## Plano de Correcao

### 1. Corrigir `use-lead-capture.ts`

Separar o INSERT em dois fluxos:

- **Fluxo padrao (calculadora, formularios):** INSERT simples sem `.select()`. Nao precisa do ID retornado.
- **Fluxo Exit Intent:** INSERT sem `.select()`, seguido de um INSERT separado na tabela `lead_interactions` usando uma abordagem alternativa (trigger ou RPC server-side).

Mudanca principal:

```text
ANTES:
  .insert({...})
  .select('id')
  .single()

DEPOIS:
  .insert({...})
```

Para o caso de Exit Intent que precisa criar a interacao automatica, a solucao mais segura e criar um **database trigger** que detecta leads com fonte contendo "exit intent" e cria automaticamente o registro em `lead_interactions`, eliminando a necessidade de retornar o ID para o frontend.

### 2. Criar trigger para interacao automatica de Exit Intent

Criar uma funcao e trigger no banco:

```sql
CREATE FUNCTION auto_log_exit_intent_interaction()
  RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.fonte) LIKE '%exit intent%' THEN
    INSERT INTO lead_interactions (lead_id, tipo, descricao, resultado)
    VALUES (
      NEW.id,
      'anotacao',
      'Lead capturado via Exit Intent Pop-up. Fonte: ' || NEW.fonte ||
        '. Segmento: ' || COALESCE(NEW.segmento, 'Nao informado') ||
        CASE WHEN NEW.empresa IS NOT NULL THEN '. Cidade: ' || NEW.empresa ELSE '' END ||
        CASE WHEN NEW.cargo IS NOT NULL THEN '. Atividade: ' || NEW.cargo ELSE '' END,
      'Lead novo - aguardando primeiro contato'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_exit_intent_interaction
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION auto_log_exit_intent_interaction();
```

### 3. Garantir que a navegacao funcione mesmo se o lead nao for salvo

Na `CalculadoraPJCLT.tsx`, alterar a logica para que o resultado seja exibido **independentemente** do sucesso do salvamento do lead. O salvamento e importante para o negocio, mas nao deve bloquear a experiencia do usuario.

```text
ANTES (linha 362):
  if (saved && resultado) {
    // track + navigate
  }

DEPOIS:
  // Tenta salvar lead (fire-and-forget para nao bloquear UX)
  saveLead({...}); // sem await

  if (resultado) {
    trackFormSubmit(...);
    dataLayer.push(...);
    navigate("/conteudo/calculadora-pj-clt/resultado", { state: {...} });
  }
```

Isso garante que mesmo em caso de rate limit, erro de rede ou falha no banco, o usuario ve o resultado e os eventos GTM sao disparados.

### 4. Rastreamento GTM (ja implementado, apenas validar)

O evento `ver_resultado_calculadora` ja esta sendo disparado via `dataLayer.push()`. Com a correcao acima, ele sera disparado corretamente pois nao dependera mais do `saved === true`.

O evento `envio_formulario` via `trackFormSubmit()` tambem sera disparado. Ambos permitem configurar conversoes no GTM/GA4.

## Arquivos Alterados

| Arquivo | Mudanca |
|---------|---------|
| `src/hooks/use-lead-capture.ts` | Remover `.select('id').single()`, mover logica de Exit Intent para trigger |
| `src/pages/conteudo/CalculadoraPJCLT.tsx` | Desacoplar navegacao do resultado de salvamento do lead |
| Migration SQL | Criar trigger `auto_exit_intent_interaction` |

## Resultado Esperado

1. Visitante preenche dados e clica "Ver Resultado"
2. Lead e salvo no banco (INSERT sem SELECT, compativel com RLS)
3. Usuario e redirecionado para `/conteudo/calculadora-pj-clt/resultado` com os dados
4. Eventos GTM `ver_resultado_calculadora` e `envio_formulario` sao disparados
5. Se o lead for de Exit Intent, o trigger cria automaticamente o log de interacao
