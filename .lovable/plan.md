

# Fix: Puppeteer not found no GitHub Actions

## Problema

O erro `ERR_MODULE_NOT_FOUND: Cannot find package 'puppeteer'` ocorre porque o Puppeteer nao esta listado como dependencia no `package.json`. O step "Install Puppeteer" apenas instala o browser Chrome, mas nao o pacote Node.js em si.

## Solucao

Adicionar um step no workflow para instalar o pacote `puppeteer` antes do pre-rendering:

### `.github/workflows/static.yml`

Substituir o step atual "Install Puppeteer" por um que instale tanto o pacote quanto o browser:

```yaml
- name: Install Puppeteer
  run: npm install puppeteer
```

O `npm install puppeteer` ja instala o browser automaticamente (desde puppeteer v19+), entao o step `npx puppeteer browsers install chrome` pode ser removido ou mantido como fallback.

Alternativa: adicionar `puppeteer` como `devDependency` no `package.json`, assim o `npm ci` ja resolve tudo. Porem isso aumenta o tamanho do `node_modules` em dev local desnecessariamente. Instalar apenas no CI e mais limpo.

## Resultado esperado

O workflow passa pelo step de pre-rendering sem erro, gerando os 83 arquivos HTML (22 estaticos + 61 blog posts).

