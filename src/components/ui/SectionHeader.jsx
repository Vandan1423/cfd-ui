import styles from './SectionHeader.module.css';

/**
 * SectionHeader — title + subtitle + horizontal rule
 *
 * Props:
 *   title    (string) — large heading
 *   sub      (string) — small monospace subtitle below
 *   className (string) — optional override
 */
export default function SectionHeader({ title, sub, className = '' }) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
      <div className={styles.line}>
        <div className={styles.lineFill} />
        <div className={styles.lineDot} />
      </div>
    </div>
  );
}