import styles from './Badge.module.css';

/**
 * Badge — small labeled pill
 *
 * Props:
 *   variant  (string) — 'cyan' | 'green' | 'orange' | 'yellow'  (default: 'cyan')
 *   children (node)   — text inside the badge
 */
export default function Badge({ variant = 'cyan', children }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}