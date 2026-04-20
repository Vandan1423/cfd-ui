import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

const LINKS = [
  { label: 'Aygun, Maulik & Karakus', value: 'arXiv:2301.05926' },
  { label: 'Framework',               value: 'PyTorch + autograd' },
  { label: 'PDE',                     value: '∇²u = 0,  ∇²v = 0' },
  { label: 'BC Enforcement',          value: 'Hard-BC (exact)'    },
];

export default function Footer() {
  const [time, setTime] = useState(() => new Date());

  // Live clock — ticks every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <footer className={styles.footer}>

      {/* Left — course info */}
      <div className={styles.left}>
        <span className={styles.course}>AA374</span>
        <span className={styles.divider}>·</span>
        <span className={styles.info}>Computational Fluid &amp; Structures</span>
      </div>

      {/* Center — reference tags */}
      <div className={styles.center}>
        {LINKS.map(({ label, value }) => (
          <div key={label} className={styles.tag}>
            <span className={styles.tagLabel}>{label}</span>
            <span className={styles.tagValue}>{value}</span>
          </div>
        ))}
      </div>

      {/* Right — live clock */}
      <div className={styles.right}>
        <span className={styles.clockLabel}>SESSION TIME</span>
        <span className={styles.clock}>{timeStr}</span>
      </div>

      {/* Top border glow line */}
      <div className={styles.borderGlow} />

    </footer>
  );
}