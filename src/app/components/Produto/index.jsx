"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../Button";
import styles from "./page.module.css";

const Produto = ({ produto }) => {
  const [selectedColor, setSelectedColor] = useState(produto.colors?.[0]?.name);
  const [selectedSize, setSelectedSize] = useState(produto?.sizes?.[0] ?? "");

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Detalhes de {produto.name}</h2>
      <div className={styles.divider}></div>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            width={350}
            height={422}
            src={produto.imageSrc}
            alt={produto.name}
            className={styles.productImage}
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{produto.name}</h1>
          <p className={styles.description}>{produto.description}</p>
          <hr className={styles.divider} />
          <p className={styles.price}>{produto.price}</p>
          <div className={styles.options}>
            <div className={styles.colors}>
              {produto.colors?.map((color) => (
                <button
                  key={color.name}
                  style={{ backgroundColor: color.hexa }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  className={`${styles.colorOption} ${
                    selectedColor === color.name && styles.selectedColor
                  }`}
                />
              ))}
            </div>
            {produto?.sizes?.length > 0 && (
              <div className={styles.sizes}>
                {produto?.sizes.map((size) => (
                  <Button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    variant={selectedSize === size ? "primary" : "secondary"}
                    size="small"
                    className={styles.sizeOption}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="large"
            className={styles.addToCart}
            onClick={() =>
              console.log("Adicionar ao carrinho:", {
                produto: produto.name,
                cor: selectedColor,
                tamanho: selectedSize,
              })
            }
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Produto;
