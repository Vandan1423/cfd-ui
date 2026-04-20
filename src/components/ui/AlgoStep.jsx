import { useState, useRef, useEffect } from 'react';
import styles from './AlgoStep.module.css';

/**
 * AlgoStep — single accordion item for the Algorithm tab
 *
 * Props:
 *   number      (number)   — step number 1–6
 *   title       (string)   — step title
 *   equation    (string)   — short equation/formula shown inline e.g. "∇²u = 0"
 *   children    (node)     — expanded body content (paragraphs + code blocks)
 *   defaultOpen (bool)     — open on first render
 */
export default function AlgoStep({ number, title, equation, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef         = useRef(null);
  const [height, setHeight]   = useState(defaultOpen ? 'auto' : '0px');

  // Animate height on toggle
  useEffect(() => {
    if (!bodyRef.current) return;
    if (open) {
      // Measure scrollHeight then transition to it
      const sh = bodyRef.current.scrollHeight;
      setHeight(`${sh}px`);
      // After transition ends, set to 'auto' so content can resize freely
      const id = setTimeout(() => setHeight('auto'), 320);
      return () => clearTimeout(id);
    } else {
      // Snap from 'auto' to measured px first, then to 0
      const sh = bodyRef.current.scrollHeight;
      setHeight(`${sh}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight('0px'));
      });
    }
  }, [open]);

  return (
    <div className={`${styles.step} ${open ? styles.open : ''}`}>

      {/* ── Header (always visible, clickable) ── */}
      <button
        className={styles.header}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {/* Step number circle */}
        <div className={styles.circle}>
          <span className={styles.circleNum}>{number}</span>
          {/* Rotating ring on open */}
          <div className={styles.circleRing} aria-hidden="true" />
        </div>

        {/* Title + equation */}
        <div className={styles.meta}>
          <span className={styles.title}>{title}</span>
          {equation && (
            <span className={styles.equation}>{equation}</span>
          )}
        </div>

        {/* Chevron */}
        <div className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          ›
        </div>
      </button>

      {/* ── Body (animated height) ── */}
      <div
        ref={bodyRef}
        className={styles.body}
        style={{ height, overflow: height === 'auto' ? 'visible' : 'hidden' }}
        aria-hidden={!open}
      >
        <div className={styles.bodyInner}>
          {children}
        </div>
      </div>

    </div>
  );
}