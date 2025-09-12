import type { ButtonProps } from "@/types/quiz";
import styles from "./Button.module.scss";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
}: ButtonProps) => (
  <button
    className={`${styles.btn} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]}`}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading ? <div className={styles.spinner} /> : children}
  </button>
);
