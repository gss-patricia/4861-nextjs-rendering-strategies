import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";
import { API_BASE_URL, API_ENDPOINTS } from "../../lib/config";

//Função para buscar categorias da API interna(BFF) - SSR PURO
const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.CATEGORIES}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar categorias: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.PRODUCTS}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar produtos: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

export default async function Home() {
  const [categorias, produtos] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
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
