import styles from "./page.module.css";
import Produto from "@/app/components/Produto";
import { fetchProductById, fetchProducts } from "../../../../lib/data-layer.js";

// 🚀 GERAÇÃO ESTÁTICA - generateStaticParams para SSG
export async function generateStaticParams() {
  try {
    // Usar fetchProducts para buscar todos os produtos
    const products = await fetchProducts({ limit: 100 });

    // Usar ID como slug - muito mais simples!
    return products.map((product) => ({
      slug: product.id.toString(),
    }));
  } catch (error) {
    console.error("❌ Erro ao gerar params estáticos:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

export default async function ProdutoPage({ params }) {
  // 📋 params contém os parâmetros dinâmicos da URL ([slug] → { slug: "123" })
  // 🔄 Next.js 15: params virou Promise, deve ser awaited para melhor performance
  const { slug } = await params;

  // slug é na verdade o ID do produto
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

// 📄 Metadata dinâmica para SEO
export async function generateMetadata({ params }) {
  // 📋 params = parâmetros da URL • 🔄 Next.js 15: virou Promise
  const { slug } = await params;

  try {
    // slug é na verdade o ID do produto
    const produto = await fetchProductById(slug);

    if (!produto) {
      return {
        title: "Produto não encontrado | Meteora",
        description: "O produto que você procura não foi encontrado.",
      };
    }

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
