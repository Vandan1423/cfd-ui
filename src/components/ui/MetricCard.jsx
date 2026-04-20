import { useEffect, useRef } from 'react';
import styles from './MetricCard.module.css';

/**
 * MetricCard — single stat tile with accent color + optional count-up
 *
 * Props:
 *   value      (string)  — main displayed number / value e.g. "3600" or "∇²=0"
 *   label      (string)  — uppercase label below the value
 *   sub        (string)  — small descriptive line at the bottom
 *   accent     (string)  — 'cyan' | 'green' | 'orange' | 'yellow'
 *   countUp    (bool)    — if true AND value is a plain integer, animates from 0
 */
export default function MetricCard({
  value,
  label,
  sub,
  accent   = 'cyan',
  countUp  = false,
}) {
  const valRef = useRef(null);

  useEffect(() => {
    if (!countUp || !valRef.current) return;
    const target = parseInt(value, 10);
    if (isNaN(target)) return;

    let start = null;
    const duration = 1200;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      valRef.current.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value, countUp]);

  return (
    <div className={`${styles.card} ${styles[`accent_${accent}`]}`}>
      <div className={styles.value} ref={valRef}>
        {value}
      </div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}