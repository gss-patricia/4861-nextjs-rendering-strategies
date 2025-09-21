import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { fetchCategories, fetchProducts } from "../../lib/data-layer.js";

export default async function Home() {
  const [categorias, produtos] = await Promise.all([
    fetchCategories(),
    fetchProducts({ limit: 6 }), // Usando data-layer direto
  ]);

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
