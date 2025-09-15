import styles from "./page.module.css";
import { Categorias } from "./components/Categorias";
import { Produtos } from "./components/Produtos";

export default async function Home() {
  const categorias = [];
  const produtos = [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {categorias.length > 0 && <Categorias categorias={categorias} />}
        {produtos.length > 0 && <Produtos produtos={produtos} />}
      </main>
    </div>
  );
}
