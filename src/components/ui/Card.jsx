import styles from './Card.module.css';

/**
 * Card — base panel wrapper used everywhere
 *
 * Props:
 *   title      (string)  — shown in card header, optional
 *   badge      (node)    — optional badge element in the header right side
 *   children   (node)    — card body content
 *   className  (string)  — extra class on root for one-off overrides
 *   noPadding  (bool)    — skips body padding (for full-bleed images etc.)
 *   accent     (string)  — 'cyan' | 'green' | 'orange' | 'yellow' — top border color
 */
export default function Card({
  title,
  badge,
  children,
  className = '',
  noPadding = false,
  accent    = '',
}) {
  return (
    <div className={`${styles.card} ${accent ? styles[`accent_${accent}`] : ''} ${className}`}>
      {title && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {badge && <div className={styles.badge}>{badge}</div>}
        </div>
      )}
      <div className={`${styles.body} ${noPadding ? styles.noPadding : ''}`}>
        {children}
      </div>
    </div>
  );
}