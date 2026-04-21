import styles from "./ConceptBox.module.css";

/**
 * ConceptBox — reusable block for conceptual content
 *
 * Props:
 *   variant   'theory' | 'equation' | 'takeaway' | 'methodology'
 *   title     string — heading text
 *   children  node   — body content
 *   className string — optional extra class
 */
export default function ConceptBox({
    variant = "theory",
    title,
    children,
    className = "",
}) {
    const icons = {
        theory: "◈",
        equation: "∇",
        takeaway: "→",
        methodology: "⬡",
    };

    return (
        <div className={`${styles.box} ${styles[variant]} ${className}`}>
            <div className={styles.header}>
                <span className={styles.icon}>{icons[variant]}</span>
                <span className={styles.title}>{title}</span>
                <span className={styles.tag}>{variant}</span>
            </div>
            <div className={styles.body}>{children}</div>
        </div>
    );
}
