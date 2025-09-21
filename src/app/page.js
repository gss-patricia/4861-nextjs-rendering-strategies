import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { fetchCategories, fetchProducts } from "../../lib/data-layer.js";
import { unstable_cache } from "next/cache";

// =================================================================
// 🎯 ESTRATÉGIAS DE RENDERIZAÇÃO MISTAS - NEXT.JS 15
// =================================================================

/* 
📂 CATEGORIAS = SSG PURO (Static Site Generation)
  ✅ Geradas no BUILD TIME
  ✅ Dados estáticos (raramente mudam)
  ✅ Performance MÁXIMA (HTML pré-gerado)
  ✅ Zero queries após build
  ❌ Só atualiza com novo deploy

🛍️ PRODUTOS = ISR (Incremental Static Regeneration) 
  ✅ Cache inteligente com revalidação automática
  ✅ Performance + dados frescos
  ✅ Stale-while-revalidate (serve cache enquanto atualiza)
  ✅ Economia de recursos (só regenera com visitas)
*/

// =================================================================
// 🔧 UNSTABLE_CACHE - CACHE PARA QUALQUER FUNÇÃO
// =================================================================

/* 
O QUE É unstable_cache?
  → Transforma QUALQUER função em função com cache
  → Diferente do fetch cache (que é só para HTTP)
  → Ideal para: Database, Supabase, Prisma, cálculos pesados
  → "unstable" = experimental mas funciona perfeitamente

🆚 DIFERENÇA DO FETCH CACHE:

❌ SE FOSSE UMA API HTTP INTERNA (não é nosso caso):
const fetchProducts = async () => {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.PRODUCTS}?limit=6`,
    {
      next: { revalidate: 10 }, // ISR: revalida a cada 10s
      // cache: "no-store" ← REMOVE ISSO para ativar cache
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar produtos: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

// E depois usar diretamente:
const produtos = await fetchProducts();

✅ PARA DATABASE/SUPABASE (nosso caso atual):  
const getCachedProducts = unstable_cache(
  () => fetchProducts({ limit: 6 }), // ← função do data-layer
  ["products-home"],                  // ← cache key único
  { revalidate: 10 }                  // ← ISR config
);

🔍 RESUMO DAS DIFERENÇAS:

FETCH CACHE (APIs HTTP):
  ✅ Sintaxe mais simples
  ✅ Cache automático do Next.js
  ❌ Só funciona com HTTP requests
  ❌ Não funciona com database/Supabase

UNSTABLE_CACHE (Qualquer função):
  ✅ Funciona com database, Supabase, Prisma
  ✅ Cache para cálculos pesados, funções próprias  
  ✅ Controle total via cache keys
  ❌ Sintaxe um pouco mais complexa
  ⚠️  "unstable" = experimental (mas estável)

COMO FUNCIONA?
  1️⃣ Function: A função que queremos cachear
  2️⃣ Cache Key: Identificador único do cache  
  3️⃣ Options: Configurações (revalidate, tags, etc.)
*/

const getCachedProducts = unstable_cache(
  // 1️⃣ FUNÇÃO: Busca produtos do Supabase via data-layer
  () => fetchProducts({ limit: 6 }),

  // 2️⃣ CACHE KEY: Identificador único - MUITO IMPORTANTE!
  // → Deve ser único por variação da função
  // → ["products-home"] diferente de ["products-category-1"]
  ["products-home"],

  // 3️⃣ OPTIONS: Configurações do cache
  {
    revalidate: 10, // ISR: revalida a cada 10 segundos (teste)
    // revalidate: 300 // Produção: 5 minutos seria mais realista
  }
);

// =================================================================
// 🏠 COMPONENTE HOME - ESTRATÉGIAS MISTAS
// =================================================================

export default async function Home() {
  /* 
  🎯 DUAS ESTRATÉGIAS EM UMA PÁGINA:
  
  📂 fetchCategories() = SSG PURO
     → Sem cache, dados do build
     → Chamada direta da função
     → Ideal para dados estáveis
  
  🛍️ getCachedProducts() = ISR  
     → Com cache e revalidação
     → Função envolvida no unstable_cache
     → Ideal para dados dinâmicos
  */

  // 🚀 BUSCA PARALELA: Categorias + Produtos ao mesmo tempo
  const [categorias, produtos] = await Promise.all([
    fetchCategories(), // SSG: sem cache, build time
    getCachedProducts(), // ISR: com cache, revalidação 10s
  ]);

  // 🖼️ RENDERIZAÇÃO: Componentes condicionais
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* 📂 Categorias: SSG - dados estáticos do build */}
        {categorias.length > 0 && <Categorias categorias={categorias} />}

        {/* 🛍️ Produtos: ISR - cache com revalidação de 10s */}
        {produtos.length > 0 && <Produtos produtos={produtos} />}
      </main>
    </div>
  );
}

// =================================================================
// 🧪 COMO TESTAR ISR vs SSG
// =================================================================

/* 
📋 PASSO A PASSO PARA TESTAR:

1️⃣ RODAR EM PRODUÇÃO (ISR só funciona 100% em produção):
   → npm run build
   → npm start (NÃO npm run dev!)

2️⃣ TESTAR CATEGORIAS (SSG):
   → Adicione nova categoria no Supabase
   → Refresh da página → categoria NÃO aparece
   → Só aparece com novo build/deploy

3️⃣ TESTAR PRODUTOS (ISR):  
   → Adicione novo produto no Supabase
   → Refresh da página → produto NÃO aparece ainda
   → Espere 10+ segundos
   → Refresh novamente → produto aparece!

4️⃣ VERIFICAR LOGS DO CONSOLE:
   → Veja os timestamps no terminal
   → ISR: timestamp muda após revalidação
   → SSG: timestamp fixo do build

⚠️ IMPORTANTE: 
   - ISR funciona com "stale-while-revalidate"
   - Primeira visita após 10s = cache antigo + regenera background
   - Segunda visita = dados atualizados
*/

// =================================================================
// 📊 METADATA PARA SEO - ESTÁTICA
// =================================================================

export const metadata = {
  title: "Meteora | Loja de Roupas",
  description:
    "Descubra as últimas tendencias em moda na Meteora. Camisetas, blusas, calçados em muito mais com qualidade e estilo.",
  keywords: "moda, roupas, camisetas, bolsas, calçados, meteora",
  openGraph: {
    title: "Meteora - Loja de Roupas",
    description: "As últimas tendências em moda você encontra aqui!",
    type: "website",
  },
};

// =================================================================
// 💡 PRÓXIMOS PASSOS E MELHORIAS
// =================================================================

/* 
🚀 OPTIMIZAÇÕES PARA PRODUÇÃO:

1️⃣ AJUSTAR TEMPOS DE REVALIDAÇÃO:
   → Produtos: revalidate: 300 (5 minutos)
   → Categorias: manter SSG mesmo

2️⃣ ADICIONAR TAGS PARA REVALIDAÇÃO ON-DEMAND:
   → { revalidate: 300, tags: ['products'] }
   → revalidateTag('products') via API

3️⃣ CACHE KEYS MAIS ESPECÍFICOS:
   → ["products", "home", "limit-6"] 
   → ["products", "category", categoryId]

4️⃣ MONITORAMENTO:
   → NEXT_PRIVATE_DEBUG_CACHE=1 no .env
   → Logs detalhados de cache hits/misses

📈 BENEFÍCIOS ALCANÇADOS:
   ✅ Categorias: Performance máxima (SSG)
   ✅ Produtos: Dados frescos (ISR)  
   ✅ SEO: Páginas indexáveis
   ✅ UX: Sem loading states
   ✅ Custo: Menos queries no Supabase
*/
