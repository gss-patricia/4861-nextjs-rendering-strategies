import Image from "next/image";
import { Button } from "../Button";
import { Badge } from "../Badge";
import styles from "./productCard.module.css";

export const ProductCard = ({ product }) => {
  return (
    <div className={styles.card}>
      <figure style={{ position: "relative" }}>
        <Image
          width={350}
          height={422}
          src={product.imageSrc}
          alt={product.name}
          style={{
            objectFit: "cover",
          }}
          className={styles.image}
        />
        {product.isFeatured && <Badge>⭐ Destaque</Badge>}
      </figure>
      <section className={styles.info}>
        <p className={styles.title}>{product.name}</p>
        <div className={styles.description}>{product.description}</div>
        <div className={styles.price}>{product.price}</div>
        <Button variant="primary" size="medium" href={`/produto/${product.id}`}>
          Ver mais
        </Button>
      </section>
    </div>
  );
};
