
# Plano: Atualizar Favicon para Logo da Contabilidade Zen

## Problema Identificado

O site está usando um favicon que pode ser o logo do Lovable em vez do logo oficial da Contabilidade Zen. O favicon correto deve ser o ícone "CZ" (Contabilidade Zen) que já existe no projeto.

## Arquivos a Modificar

### 1. Copiar o Logo Correto para a Pasta Public

**Ação:** Copiar o arquivo `src/assets/logo-icon.png` (o ícone "CZ" da Contabilidade Zen) para `public/favicon.png`

O arquivo `logo-icon.png` contém o ícone circular com as letras "CZ" em azul/verde, que é o logo oficial da Contabilidade Zen - perfeito para favicon.

### 2. Atualizar `index.html`

O arquivo já está configurado corretamente para usar `/favicon.png`, então após copiar a imagem, funcionará automaticamente.

**Configuração atual (já correta):**
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

### 3. Criar Favicon ICO (Opcional mas Recomendado)

Substituir também o `public/favicon.ico` com uma versão .ico do logo da Contabilidade Zen para compatibilidade máxima com navegadores antigos.

### 4. Verificar OG:Image

O `og-image.png` referenciado no index.html e SEOHead também deve usar o branding correto da Contabilidade Zen para resultados de busca e compartilhamentos sociais.

**Referência atual em `index.html`:**
```html
<meta property="og:image" content="https://www.contabilidadezen.com.br/og-image.png" />
```

**Referência em `src/lib/seo-schemas.ts`:**
```typescript
const LOGO_URL = `${SITE_URL}/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png`;
```

A URL do logo nos schemas já está usando a imagem correta da Contabilidade Zen (lovable-uploads).

---

## Implementação

### Passo 1: Copiar Favicon
Copiar `src/assets/logo-icon.png` → `public/favicon.png`

### Passo 2: Atualizar Favicon ICO
Copiar `src/assets/logo-icon.png` → `public/favicon.ico` (ou converter para formato .ico)

### Passo 3: Verificar og-image.png
Garantir que existe um arquivo `public/og-image.png` com o branding correto da Contabilidade Zen para compartilhamentos sociais.

---

## Resumo de Mudanças

| Arquivo | Ação |
|---------|------|
| `public/favicon.png` | Substituir pelo logo-icon.png da Contabilidade Zen |
| `public/favicon.ico` | Substituir pelo logo-icon da Contabilidade Zen |
| `public/og-image.png` | Verificar/criar com branding correto (para resultados de busca) |

## Impacto

- **Favicon em abas do navegador:** Mostrará o logo "CZ" da Contabilidade Zen
- **Resultados de busca (Google):** Favicon correto aparecerá nos resultados
- **Favoritos/Bookmarks:** Ícone correto salvo
- **Apple Touch Icon:** Ícone correto para iOS
- **Compartilhamentos sociais:** OG:image com branding correto
