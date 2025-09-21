import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { fetchCategories, fetchProducts } from "../../lib/data-layer";
import { unstable_cache } from "next/cache";

// CATEGORIAS = SSG
// PRODUTOS = ISR

const getCachedProducts = unstable_cache(
  () => fetchProducts({ limit: 6 }),
  ["products-home"],
  {
    revalidate: 10,
  }
);

export default async function Home() {
  const [categorias, produtos] = await Promise.all([
    fetchCategories(),
    getCachedProducts(),
  ]);

  console.log("A pagina é carregada no navegador");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {categorias.length > 0 && <Categorias categorias={categorias} />}
        {produtos.length > 0 && <Produtos produtos={produtos} />}
      </main>
    </div>
  );
}

//Metadata para SEO
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
