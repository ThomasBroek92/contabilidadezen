

# Plano: Reestruturar Footer com Navegação Espelhada do Header

## Resumo

Atualizar o componente Footer.tsx para:
1. Alterar o texto descritivo da marca
2. Reorganizar os links em estrutura de tópicos e subtópicos que espelha o Header

---

## Alterações

### 1. Texto Descritivo (Coluna 1)

**De:**
```
Contabilidade especializada para profissionais da saúde. 
Você cuida da saúde dos seus pacientes, nós cuidamos da saúde financeira do seu negócio.
```

**Para:**
```
Mais de 100 profissionais e empresas em todo Brasil já reduziram sua carga tributária 
com nossa contabilidade digital nichada. 100% online, 0% burocracia.
```

---

### 2. Nova Estrutura de Links (Grid 5 Colunas)

```text
+---------------------------------------------------------------------------------+
| FOOTER GRID - 5 COLUNAS (desktop)                                               |
+---------------------------------------------------------------------------------+
| COLUNA 1        | COLUNA 2       | COLUNA 3       | COLUNA 4    | COLUNA 5      |
| Logo + Desc     | Soluções       | Conteúdos      | Empresa     | Contato       |
+-----------------|----------------|----------------|-------------|---------------|
| [Logo]          | Para Médicos   | Blog           | Sobre       | Telefone      |
|                 | Para Dentistas | Calc. PJ/CLT   | Serviços    | (19) 97415... |
| Texto novo      | Para Psicólog. | Gerador RPA    | Abrir Empr. |               |
| atualizado      | Para Repres.   | Gerador Invoic.| Contato     | E-mail        |
|                 | Todos Serviços | Contrato PJ    |             | contato@...   |
| [LinkedIn]      |                | Tabela CNAEs   |             |               |
| [Instagram]     |                |                |             | Endereço      |
|                 |                |                |             | São Paulo, SP |
+---------------------------------------------------------------------------------+
```

---

### 3. Mapeamento Completo dos Links

**Coluna 2 - Soluções:**
| Link | Destino |
|------|---------|
| Para Médicos | /segmentos/contabilidade-para-medicos |
| Para Dentistas | /segmentos/contabilidade-para-dentistas |
| Para Psicólogos | /segmentos/contabilidade-para-psicologos |
| Para Representantes | /segmentos/contabilidade-para-representantes-comerciais |
| Todos os Serviços | /servicos |

**Coluna 3 - Conteúdos:**
| Link | Destino |
|------|---------|
| Blog | /blog |
| Calculadora PJ x CLT | /conteudo/calculadora-pj-clt |
| Gerador de RPA | /conteudo/gerador-rpa |
| Gerador de Invoice | /conteudo/gerador-invoice |
| Modelo de Contrato PJ | /conteudo/modelo-contrato-pj |
| Tabela CNAEs | /conteudo/tabela-simples-nacional |

**Coluna 4 - Empresa:**
| Link | Destino |
|------|---------|
| Sobre | /sobre |
| Abrir Empresa | /abrir-empresa |
| Indique e Ganhe | /indique-e-ganhe |
| Contato | /contato |

**Coluna 5 - Contato:**
- Telefone: (19) 97415-8342
- E-mail: contato@contabilidadezen.com.br
- Endereço: São Paulo, SP

---

### 4. Layout Responsivo

**Desktop (lg+):** Grid 5 colunas
**Tablet (md):** Grid 2x2 + 1 (Logo full width, depois 2 colunas)
**Mobile:** Stack vertical com todas as colunas empilhadas

---

## Arquivo a Modificar

`src/components/Footer.tsx`

### Mudanças Específicas:

1. **Linha 21-24**: Alterar texto do parágrafo descritivo
2. **Linha 9**: Alterar grid de `lg:grid-cols-4` para `lg:grid-cols-5`
3. **Linhas 47-68**: Substituir seção "Links Rápidos" por "Soluções"
4. **Linhas 70-91**: Substituir seção "Serviços" por "Conteúdos"
5. **Adicionar**: Nova coluna "Empresa" com links institucionais
6. **Manter**: Coluna de Contato (ajustar layout)

---

## Código das Novas Seções

### Seção Soluções (Coluna 2):
```tsx
<div>
  <h3 className="font-semibold text-lg mb-4">Soluções</h3>
  <ul className="space-y-3">
    {[
      { name: "Para Médicos", href: "/segmentos/contabilidade-para-medicos" },
      { name: "Para Dentistas", href: "/segmentos/contabilidade-para-dentistas" },
      { name: "Para Psicólogos", href: "/segmentos/contabilidade-para-psicologos" },
      { name: "Para Representantes", href: "/segmentos/contabilidade-para-representantes-comerciais" },
      { name: "Todos os Serviços", href: "/servicos" },
    ].map((link) => (
      <li key={link.name}>
        <Link to={link.href} className="...">
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

### Seção Conteúdos (Coluna 3):
```tsx
<div>
  <h3 className="font-semibold text-lg mb-4">Conteúdos</h3>
  <ul className="space-y-3">
    {[
      { name: "Blog", href: "/blog" },
      { name: "Calculadora PJ x CLT", href: "/conteudo/calculadora-pj-clt" },
      { name: "Gerador de RPA", href: "/conteudo/gerador-rpa" },
      { name: "Gerador de Invoice", href: "/conteudo/gerador-invoice" },
      { name: "Modelo de Contrato PJ", href: "/conteudo/modelo-contrato-pj" },
      { name: "Tabela CNAEs", href: "/conteudo/tabela-simples-nacional" },
    ].map((link) => (
      <li key={link.name}>
        <Link to={link.href} className="...">
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

### Seção Empresa (Coluna 4 - NOVA):
```tsx
<div>
  <h3 className="font-semibold text-lg mb-4">Empresa</h3>
  <ul className="space-y-3">
    {[
      { name: "Sobre Nós", href: "/sobre" },
      { name: "Abrir Empresa", href: "/abrir-empresa" },
      { name: "Indique e Ganhe", href: "/indique-e-ganhe" },
      { name: "Contato", href: "/contato" },
    ].map((link) => (
      <li key={link.name}>
        <Link to={link.href} className="...">
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

---

## Resultado Visual Esperado

```text
+-----------------------------------------------------------------------------------+
|  [LOGO]                                                                           |
|                                                                                   |
|  Mais de 100 profissionais e empresas em todo Brasil já reduziram sua carga      |
|  tributária com nossa contabilidade digital nichada. 100% online, 0% burocracia. |
|                                                                                   |
|  [in] [ig]                                                                        |
+-----------------------------------------------------------------------------------+
|  Soluções           | Conteúdos              | Empresa          | Contato         |
|---------------------|------------------------|------------------|-----------------|
|  Para Médicos       | Blog                   | Sobre Nós        | Telefone        |
|  Para Dentistas     | Calculadora PJ x CLT   | Abrir Empresa    | (19) 97415-8342 |
|  Para Psicólogos    | Gerador de RPA         | Indique e Ganhe  |                 |
|  Para Representantes| Gerador de Invoice     | Contato          | E-mail          |
|  Todos os Serviços  | Modelo de Contrato PJ  |                  | contato@...     |
|                     | Tabela CNAEs           |                  |                 |
|                     |                        |                  | Endereço        |
|                     |                        |                  | São Paulo, SP   |
+-----------------------------------------------------------------------------------+
|  CNPJ: 46.466.747/0001-30 | CRC-SP 337693/O-7                                     |
|  © 2026 Contabilidade Zen | Política de Privacidade | Termos de Uso              |
+-----------------------------------------------------------------------------------+
```

---

## Ordem de Implementação

1. Alterar texto descritivo (linha 21-24)
2. Atualizar grid para 5 colunas
3. Refatorar coluna "Links Rápidos" → "Soluções" com links corretos
4. Refatorar coluna "Serviços" → "Conteúdos" com links de ferramentas
5. Adicionar nova coluna "Empresa"
6. Ajustar coluna "Contato" (manter estrutura atual)
7. Testar responsividade em mobile/tablet

