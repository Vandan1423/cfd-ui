import styles from './PipelineStep.module.css';

/**
 * PipelineStep — single step box in the pipeline flow
 *
 * Props:
 *   number   (string | number) — step number e.g. "01"
 *   label    (string)          — short uppercase label
 *   desc     (string)          — 1-2 line description
 *   accent   (string)          — 'cyan' | 'orange' (matches stage color)
 *   isLast   (bool)            — if true, no arrow is rendered after
 */
export default function PipelineStep({ number, label, desc, accent = 'cyan', isLast = false }) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.step} ${styles[`accent_${accent}`]}`}>

        {/* Background watermark number */}
        <div className={styles.watermark} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </div>

        {/* Content */}
        <div className={styles.num}>
          {String(number).padStart(2, '0')}
        </div>
        <div className={styles.label}>{label}</div>
        <div className={styles.desc}>{desc}</div>

        {/* Bottom accent line — animates in on hover */}
        <div className={styles.accentLine} aria-hidden="true" />
      </div>

      {/* Arrow between steps */}
      {!isLast && (
        <div className={`${styles.arrow} ${styles[`arrow_${accent}`]}`} aria-hidden="true">
          <div className={styles.arrowLine} />
          <div className={styles.arrowHead}>›</div>
        </div>
      )}
    </div>
  );
}