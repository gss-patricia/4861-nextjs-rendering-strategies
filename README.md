![Thumbnail escrito React: explorando estratégias de renderização do Next.js](https://github.com/gss-patricia/4861-nextjs-rendering-strategies/blob/main/thumbnail.png?raw=true)

![](https://img.shields.io/github/license/alura-cursos/android-com-kotlin-personalizando-ui)

# React: explorando estratégias de renderização do Next.js

E-commerce de roupas desenvolvido para demonstrar diferentes estratégias de renderização do Next.js 15, explorando SSG, ISR, SSR e CSR em uma aplicação real.

## 🔨 Funcionalidades do projeto

O projeto implementa um e-commerce completo com:

- **Home Page**: Lista de categorias (SSG) e produtos em destaque (ISR)
- **Página de Produto**: Detalhes individuais com ISR usando `generateStaticParams`
- **Busca em Tempo Real**: Sistema de busca client-side com hook personalizado
- **API Routes**: Endpoints para produtos e busca
- **Camada de Dados**: Abstração para interação com Supabase

![Página home do projet listando categorias e produtos](https://raw.githubusercontent.com/gss-patricia/4861-nextjs-rendering-strategies/main/meteora-home.png)

## ✔️ Estratégias de Renderização Implementadas

### 🏗️ **SSG (Static Site Generation)**

- **Categorias** na home page - dados estáticos gerados no build
- **Páginas de produto** - pré-renderização usando `generateStaticParams`

```javascript
// src/app/produto/[slug]/page.jsx
export async function generateStaticParams() {
  const products = await fetchProducts({ limit: 100 });
  return products.map((product) => ({
    slug: product.id.toString(),
  }));
}
```

### 🔄 **ISR (Incremental Static Regeneration)**

- **Produtos na home** - revalidação a cada 10 segundos usando `unstable_cache`
- **Páginas de produto** - revalidação global com `export const revalidate = 10`

```javascript
// src/app/page.js
const getCachedProducts = unstable_cache(
  () => fetchProducts({ limit: 6 }),
  ["products-home"],
  { revalidate: 10 }
);
```

### 🖥️ **CSR (Client-Side Rendering)**

- **Página de busca** - interatividade completa com `"use client"`
- **Hook personalizado** - `useSearch` para gerenciamento de estado reativo

```javascript
// src/hooks/useSearch.js
export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // Busca automática com useEffect
  useEffect(() => {
    // Lógica de busca reativa
  }, [query]);
};
```

### 🎯 **Arquitetura Híbrida**

Combinação de diferentes estratégias na mesma aplicação:

- **Server Components** por padrão (performance)
- **Client Components** quando necessário (interatividade)
- **Mixed rendering** - SSG/ISR + CSR na mesma página

## 🏛️ Arquitetura do Projeto

### **Camada de Dados** (`lib/data-layer.js`)

Abstração centralizada para todas as interações com Supabase:

```javascript
export const fetchProducts = async (options = {}) => {
  // Lógica Supabase centralizada
};

export const fetchCaetgories = async (options = {}) => {
  // Lógica Supabase centralizada
};

export const fetchProductById = async (id) => {
  // Busca individual otimizada
};

export const fetchProductsBySearch = async (searchTerm, options = {}) => {
  // Busca com filtros
};
```

### **API Routes**

- `/api/products` - Listagem de produtos com filtros
- `/api/categories` - Listagem de categorias
- `/api/search` - Endpoint de busca integrado com o hook

### **Componentes**

- **Server Components**: Header, Footer, ProductCard, Categorias
- **Client Components**: Página de busca, hook useSearch
- **Híbridos**: Páginas que misturam ambos

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **React 18** - Hooks, Server/Client Components
- **Supabase** - Backend as a Service
- **CSS Modules** - Estilização modular
- **Node.js 20+** - Runtime JavaScript

### **APIs Next.js Específicas**

- `generateStaticParams` - SSG para rotas dinâmicas
- `generateMetadata` - SEO dinâmico
- `unstable_cache` - Cache flexível para ISR
- `export const revalidate` - ISR global
- `"use client"` - Client Components

## 🏃‍♂️ Como executar

### **Pré-requisitos**

- Node.js 20+
- NPM ou Yarn
- Conta Supabase (configurada)

## 📁 Acesso ao projeto

Você pode [acessar o código fonte do projeto inicial](https://github.com/gss-patricia/4861-nextjs-rendering-strategies/tree/projeto-base) ou [baixá-lo](https://github.com/gss-patricia/4861-nextjs-rendering-strategies/archive/refs/heads/projeto-base.zip).

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nextjs-rendering-strategies

# Entre no diretório
cd nextjs-rendering-strategies

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run seed    # Popular banco de dados
npm run build:clean #gera o bundle já removendo o cache
```

## 🎯 Conceitos Demonstrados

### **Performance**

- **SSG**: Páginas rápidas servidas como HTML estático
- **SSR**: Páginas gerados do lado do servidor
- **ISR**: Balanço entre performance e dados atualizados
- **CSR**: Integratividade do lado do cliente

### **SEO**

- **Server-Side**: Meta tags geradas no servidor
- **Static HTML**: Conteúdo indexável pelos motores de busca

## 🔗 Recursos Úteis

- [Documentação Next.js 15](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)
- [Supabase Docs](https://supabase.com/docs)

## 📚 Mais informações

Este projeto foi desenvolvido para demonstrar as diferentes estratégias de renderização do Next.js de forma prática e educativa, mostrando quando e como usar cada uma delas em cenários reais.

---

**Desenvolvido com ❤️ usando Next.js 15**
