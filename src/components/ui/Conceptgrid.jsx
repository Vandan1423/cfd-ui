import styles from "./Conceptgrid.module.css";

/**
 * ConceptGrid — lays ConceptBox blocks in a responsive grid
 *
 * Props:
 *   cols      1 | 2 | 3   — number of columns (default 2)
 *   children  node
 *   className string
 */
export default function ConceptGrid({ cols = 2, children, className = "" }) {
    return (
        <div className={`${styles.grid} ${styles[`cols${cols}`]} ${className}`}>
            {children}
        </div>
    );
}
