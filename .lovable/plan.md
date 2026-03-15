

# Melhorias Restantes do Playbook de SEO

Analisando o que ja foi implementado e o que o playbook ainda recomenda, identifiquei 3 melhorias de alto impacto que ainda nao foram feitas:

---

## 1. Navegacao Prev/Next entre Posts (SEO + Engajamento)

O playbook destaca que manter o usuario navegando internamente e um sinal forte de qualidade. Adicionar botoes "Artigo Anterior" / "Proximo Artigo" no final de cada post (dentro da mesma categoria) reduz bounce rate e aumenta pageviews por sessao.

**Implementacao:** No `BlogPost.tsx`, buscar o post anterior e proximo (por `published_at`) na mesma categoria e renderizar links no rodape do artigo.

---

## 2. Schema CollectionPage + ItemList no Blog Listing

O playbook menciona rich results para paginas de listagem. Atualmente o blog ja usa `generateBlogListingSchema`, mas podemos enriquecer com `CollectionPage` + `ItemList` completo com posicao de cada artigo, o que facilita sitelinks e carroseis no Google.

**Implementacao:** Atualizar `src/lib/seo-schemas.ts` para gerar schema `CollectionPage` com `mainEntity` do tipo `ItemList` contendo cada post com `ListItem` e `position`.

---

## 3. Imagem Destacada nos Cards da Listagem do Blog

O playbook destaca que imagens sao fator de engajamento. A listagem do blog ja recebe `featured_image_url` mas nao renderiza nos cards (exceto no featured post). Exibir a imagem nos cards aumenta CTR e tempo de permanencia.

**Implementacao:** Atualizar os cards em `Blog.tsx` para renderizar `featured_image_url` quando disponivel.

---

## Detalhes Tecnicos

### Arquivos a editar:
1. **`src/pages/BlogPost.tsx`** — Adicionar query para prev/next posts + componente de navegacao
2. **`src/lib/seo-schemas.ts`** — Enriquecer `generateBlogListingSchema` com CollectionPage + ItemList
3. **`src/pages/Blog.tsx`** — Renderizar imagens nos cards dos posts

### Estimativa: 3 alteracoes em arquivos existentes, zero novos arquivos.

