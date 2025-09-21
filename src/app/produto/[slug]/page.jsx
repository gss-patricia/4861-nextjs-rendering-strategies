import styles from "./page.module.css";
import Produto from "@/app/components/Produto";
import { fetchProductById, fetchProducts } from "../../../../lib/data-layer.js";

// =================================================================
// 🎯 ISR (Incremental Static Regeneration) - PÁGINAS DE PRODUTO
// =================================================================

/* 
🔄 ESTRATÉGIA ISR PARA PRODUTOS INDIVIDUAIS:

✅ generateStaticParams() = Gera páginas no build time
✅ export const revalidate = ISR global (revalida página inteira)

📊 RESULTADO:
  → Build: Páginas pré-geradas (rápidas)
  → Runtime: Revalidação automática (dados frescos)
  → SEO: Metadata dinâmica sempre atualizada
*/

// ISR GLOBAL - revalida TODA a página a cada 10 segundos
export const revalidate = 10;

/* 
⚖️ ANÁLISE: 10 SEGUNDOS DE DELAY É ACEITÁVEL?

✅ PARA MAIORIA DOS E-COMMERCES: SIM
  → Produtos não mudam preço constantemente
  → Performance é prioridade (páginas pré-geradas)
  → Usuários não percebem delay de 10s
  → Consistência eventual entre home e produto

❌ CENÁRIOS ONDE NÃO SERIA SUFICIENTE:
  → Flash sales (preços mudam por minuto)
  → Estoque crítico (últimas unidades)
  → Live shopping / transmissões
  → Plataformas de trading

🔧 SE 10s NÃO FOSSE ACEITÁVEL, OPÇÕES DISPONÍVEIS:

1️⃣ WEBHOOK + REVALIDATION ON-DEMAND (mais robusta):
   → Criar API /api/revalidate
   → Webhook Supabase chama API quando produto muda
   → revalidatePath(`/produto/${id}`) instantâneo
   → Complexidade: Média | Delay: 0s

2️⃣ SSR - SERVER-SIDE RENDERING (mais simples):
   → Remover export const revalidate
   → Sempre busca dados frescos a cada request
   → Complexidade: Baixa | Delay: 0s
   → Trade-off: Latência maior (query todo request)

3️⃣ MANTER ISR + CLIENT UPDATES:
   → ISR como base + polling client-side
   → Melhor UX mas mais complexidade

💡 DECISÃO ATUAL: 
   ISR 10s é o sweet spot para este tipo de produto
   Balance ideal entre performance e dados frescos
*/

// 🏗️ GERAÇÃO ESTÁTICA - generateStaticParams
export async function generateStaticParams() {
  try {
    // 📦 Buscar todos os produtos para pré-gerar páginas
    const products = await fetchProducts({ limit: 100 });

    // 🔢 ID como slug - simples e eficiente
    return products.map((product) => ({
      slug: product.id.toString(), // /produto/1, /produto/2, etc.
    }));
  } catch (error) {
    console.error("❌ Erro ao gerar params estáticos:", error);
    return []; // Array vazio = gera on-demand quando acessado
  }
}

export default async function ProdutoPage({ params }) {
  // 📋 params contém os parâmetros dinâmicos da URL ([slug] → { slug: "123" })
  // 🔄 Next.js 15: params virou Promise, deve ser awaited para melhor performance
  const { slug } = await params;

  // 🔄 ISR Global: export const revalidate revalida a página inteira
  // → Dados + metadata atualizados automaticamente a cada 10s
  const produto = await fetchProductById(slug);

  if (!produto) {
    return (
      <main className={styles.main}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Produto não encontrado</h1>
          <p>O produto que você está procurando não existe ou foi removido.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Produto produto={produto} />
    </main>
  );
}

export async function generateMetadata({ params }) {
  // 📋 params = parâmetros da URL • 🔄 Next.js 15: virou Promise
  const { slug } = await params;

  try {
    // 📊 ISR Global: metadata revalidada junto com a página (10s)
    // → SEO sempre atualizado com dados frescos do produto
    const produto = await fetchProductById(slug);

    if (!produto) {
      return {
        title: "Produto não encontrado | Meteora",
        description: "O produto que você procura não foi encontrado.",
      };
    }

    // 📊 SEO dinâmico baseado nos dados do produto
    return {
      title: `${produto.name} | Meteora`,
      description: produto.description || `Confira ${produto.name} na Meteora`,
      openGraph: {
        title: produto.name,
        description: produto.description,
        images: [produto.imageSrc],
      },
    };
  } catch (error) {
    return {
      title: "Produto | Meteora",
      description: "Produto da Meteora",
    };
  }
}

// =================================================================
// 🎯 ESTRATÉGIAS PARA E-COMMERCE: CONSISTÊNCIA DE DADOS
// =================================================================

/* 
🛒 PROBLEMA DE CONSISTÊNCIA:
   → Home: Produto por R$ 100 (ISR atualizado)
   → Página produto: R$ 80 (SSG desatualizado)
   → Usuário confuso e carrinho inconsistente! 😱

📊 CENÁRIOS POSSÍVEIS:

❌ CENÁRIO 1: Home ISR + Produto SSG
   → Inconsistência garantida
   → Home atualizada, produto desatualizado

✅ CENÁRIO 2: Home ISR + Produto ISR (ATUAL - RECOMENDADO)
   → Consistência garantida (ambos revalidam)  
   → Delay máximo de 10s (aceitável para e-commerce)
   → Performance excelente + dados frescos
   → Implementação simples

⚡ ALTERNATIVAS SE 10s NÃO FOSSE SUFICIENTE:
   → Revalidação On-Demand (webhooks + API)
   → SSR puro (sempre dados frescos)
   → Hybrid (ISR + client-side updates)
*/

// =================================================================
// 📊 RESUMO DA ESTRATÉGIA ATUAL
// =================================================================

/* 
🎯 ESTRATÉGIA ESCOLHIDA: ISR 10s (Home + Produto)

✅ VANTAGENS:
   → Performance: Páginas pré-geradas (velocidade máxima)
   → Dados frescos: Revalidação automática a cada 10s  
   → Simplicidade: Uma linha de código (export const revalidate)
   → Consistência: Ambas as páginas seguem mesmo padrão
   → SEO: Páginas sempre indexáveis
   → Custo: Reduz queries no Supabase

⚖️ TRADE-OFF ACEITÁVEL:
   → Delay máximo de 10s para mudanças aparecerem
   → Para e-commerce padrão, isso é perfeitamente aceitável
   → Usuários raramente notam esse delay

📈 QUANDO EVOLUIR:
   → Se precisar de dados instantâneos → Webhook + revalidateTag()
   → Se precisar de simplicidade máxima → SSR puro
   → Se precisar de UX premium → ISR + client-side polling
*/

// =================================================================
// 🧪 TESTANDO A ESTRATÉGIA ISR
// =================================================================

/* 
📋 COMO TESTAR O COMPORTAMENTO ATUAL:

1️⃣ BUILD EM PRODUÇÃO:
   → npm run build (gera páginas estáticas)
   → npm start (ISR só funciona 100% em produção)

2️⃣ TESTAR REVALIDAÇÃO:
   → Acesse home e página de produto
   → Altere preço/dados no Supabase  
   → Espere 10+ segundos
   → Refresh nas páginas → dados atualizados! ✅

3️⃣ VERIFICAR CONSISTÊNCIA:
   → Home e produto devem mostrar mesmo preço
   → Ambos revalidam no mesmo intervalo (10s)
   → Usuário final tem experiência consistente

💡 RESULTADO ESPERADO:
   ✅ Primeira visita: Velocidade máxima (HTML pré-gerado)
   ✅ Dados atualizados: Automaticamente a cada 10s
   ✅ SEO perfeito: Páginas sempre indexáveis  
   ✅ Custo baixo: Cache reduz queries desnecessárias
*/
