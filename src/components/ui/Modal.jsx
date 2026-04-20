import { useEffect, useCallback } from 'react';
import styles from './Modal.module.css';

/**
 * Modal — fullscreen image lightbox
 *
 * Props:
 *   src      (string)  — image src to display
 *   caption  (string)  — caption shown below image
 *   onClose  (fn)      — called to close the modal
 *
 * Usage in parent:
 *   const [modal, setModal] = useState(null);
 *   <ImageFrame onClick={() => setModal({ src, caption })} />
 *   <Modal src={modal?.src} caption={modal?.caption} onClose={() => setModal(null)} />
 */
export default function Modal({ src, caption, onClose }) {
  const isOpen = Boolean(src);

  // Close on Escape key
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      // Prevent body scroll while open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div
        className={styles.content}
        onClick={e => e.stopPropagation()} // prevent closing when clicking image
      >
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close preview"
        >
          <span className={styles.closeIcon}>✕</span>
          <span className={styles.closeLabel}>ESC to close</span>
        </button>

        {/* Image */}
        <div className={styles.imgWrap}>
          <img src={src} alt={caption || ''} className={styles.img} />

          {/* Corner brackets */}
          <div className={styles.cornerTL} aria-hidden="true" />
          <div className={styles.cornerTR} aria-hidden="true" />
          <div className={styles.cornerBL} aria-hidden="true" />
          <div className={styles.cornerBR} aria-hidden="true" />
        </div>

        {/* Caption */}
        {caption && (
          <p className={styles.caption}>{caption}</p>
        )}
      </div>
    </div>
  );
}