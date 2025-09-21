import { fetchProductById, fetchProducts } from "../../../../lib/data-layer";
import styles from "./page.module.css";
import Produto from "@/app/components/Produto";

export const revalidate = 10;

export async function generateStaticParams() {
  try {
    const products = await fetchProducts({ limit: 100 });

    return products.map((product) => ({
      slug: product.id.toString(),
    }));
  } catch (error) {
    console.error("Erro ao gerar params estáticos:", error);
    return [];
  }
}

export default async function ProdutoPage({ params }) {
  const { slug } = await params;

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
