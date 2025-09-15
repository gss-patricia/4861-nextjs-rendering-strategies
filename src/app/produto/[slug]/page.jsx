import styles from "./page.module.css";
import Produto from "@/app/components/Produto";

export default async function ProdutoPage({ params }) {
  const produto = null;

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
