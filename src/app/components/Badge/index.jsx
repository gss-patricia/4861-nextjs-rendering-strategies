import styles from "./badge.module.css";

export const Badge = ({ children }) => {
  return <span className={styles.badge}>{children}</span>;
};
