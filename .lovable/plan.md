

## Plano: Aprimorar Exit Intent Popup

### Problemas atuais

1. **Muitos campos** -- 5 campos + 2 botoes criam fricção alta; usuario saindo tem pressa
2. **Sem prova social** -- nenhum numero, depoimento ou urgência
3. **Headline fraca** -- "Ficou com alguma dúvida?" é genérico
4. **Sem proteção anti-bot** -- honeypot existe no projeto mas não é usado aqui
5. **Mobile ruim** -- grid 2 colunas não funciona bem no viewport atual (432px)
6. **Sem estado de sucesso** -- fecha direto após envio, perde oportunidade de CTA secundário
7. **Imagem em JPG** -- deveria ser WebP (regra do projeto)
8. **Dois botões de close** -- o custom X + o do DialogContent padrão

### Melhorias planejadas

**A. Reduzir fricção (mais conversão)**
- Reduzir para 3 campos obrigatórios: Nome, WhatsApp, Email
- Remover cidade e atividade do popup (coletar depois no contato)
- CTA principal único: botão WhatsApp grande e destacado (verde)
- CTA secundário menor: "Prefiro ligação"

**B. Copy persuasiva**
- Headline: "Espere! Fale com um especialista agora"
- Subtítulo com prova social: "Mais de 500 empresas já reduziram impostos com a Contabilidade Zen"
- Adicionar badge/selo de confiança (ex: "Resposta em até 2h")

**C. Layout mobile-first**
- No mobile: layout single column, esconder imagem lateral
- No desktop: manter grid 2 colunas com imagem
- Botão WhatsApp full-width e mais alto

**D. Estado de sucesso**
- Após envio, mostrar tela de confirmação com:
  - Checkmark animado
  - "Entraremos em contato em até 2 horas!"
  - Botão "Falar agora no WhatsApp" (click-to-chat direto)

**E. Proteção e qualidade**
- Integrar hook `useHoneypot` existente
- Remover botão X duplicado (usar apenas o do DialogContent)

**F. Detecção mobile**
- No mobile, disparar popup após 30s de inatividade (scroll idle) em vez de mouseleave (que não existe em touch)

### Arquivo editado

- `src/components/ExitIntentPopup.tsx` -- refactor completo

### Estrutura do novo popup

```text
┌──────────────────────────────────────────┐
│  DESKTOP (2 cols)        │  MOBILE (1 col)│
│                          │                │
│  [Imagem + prova social] │  [headline]    │
│  "500+ empresas..."      │  [prova social]│
│  ★★★★★ selo             │  [3 campos]    │
│                          │  [CTA WhatsApp]│
│  [Nome]  [WhatsApp]      │  [link ligação]│
│  [Email]                 │                │
│  [████ WHATSAPP ████]    │                │
│  Prefiro ligação         │                │
└──────────────────────────────────────────┘
```

