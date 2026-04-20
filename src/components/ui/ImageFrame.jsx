import styles from './ImageFrame.module.css';

/**
 * ImageFrame — image with hover overlay + click to fullscreen
 *
 * Props:
 *   src        (string)  — image path e.g. '/assets/Imga.jpeg'
 *   alt        (string)  — alt text
 *   caption    (string)  — shown on hover overlay at the bottom
 *   onClick    (fn)      — called when user clicks (pass openModal fn from parent)
 *   minHeight  (string)  — CSS min-height for placeholder state e.g. '280px'
 *   className  (string)  — optional extra class
 */
export default function ImageFrame({
  src,
  alt        = '',
  caption    = 'Click to expand',
  onClick,
  minHeight  = '260px',
  className  = '',
}) {
  return (
    <div
      className={`${styles.frame} ${className}`}
      style={{ minHeight }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={onClick ? `Expand image: ${alt}` : undefined}
    >
      <img
        src={src}
        alt={alt}
        className={styles.img}
        loading="lazy"
      />

      {/* Gradient overlay on hover */}
      <div className={styles.overlay} aria-hidden="true">
        <span className={styles.overlayCaption}>{caption}</span>
        {onClick && (
          <span className={styles.expandIcon} aria-hidden="true">⤢</span>
        )}
      </div>

      {/* Corner bracket decorations — pure CSS via ::before ::after on children */}
      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />
    </div>
  );
}