"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./header.module.css";
import logo from "./logo.png";

export const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src={logo}
            alt="Meteora logo"
            width={100}
            height={22}
            priority
          />
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/search">🔍 Buscar</Link>
          </li>
          <li>Nossas Lojas</li>
          <li>Novidades</li>
          <li>Promoções</li>
        </ul>
      </nav>
      <div className={styles.search}>
        <form onSubmit={() => {}}>
          <Input
            variant="header"
            placeholder="Digite o produto"
            value={""}
            onChange={(e) => console.log(e.target.value)}
          />
          <Button type="submit" variant="primary" size="medium">
            Buscar
          </Button>
        </form>
      </div>
    </header>
  );
};
