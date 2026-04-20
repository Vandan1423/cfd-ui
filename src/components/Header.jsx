import { useEffect, useRef } from "react";
import styles from "./Header.module.css";

const badges = [
    { label: "Physics-Informed NN", variant: "cyan" },
    { label: "Laplace Equations", variant: "green" },
    { label: "ALE Mesh Motion", variant: "orange" },
];

export default function Header() {
    const statusRef = useRef(null);

    // Scramble animation on the logo mark
    const logoRef = useRef(null);
    useEffect(() => {
        const chars = "PNΔΨ∇◈⬡";
        let frame;
        let count = 0;
        const scramble = () => {
            if (!logoRef.current) return;
            if (count < 12) {
                logoRef.current.textContent =
                    chars[Math.floor(Math.random() * chars.length)];
                count++;
                frame = setTimeout(scramble, 60);
            } else {
                logoRef.current.textContent = "PN";
            }
        };
        scramble();
        return () => clearTimeout(frame);
    }, []);

    return (
        <header className={styles.header}>
            {/* Left — logo + title */}
            <div className={styles.left}>
                <div className={styles.logoMark}>
                    <span ref={logoRef} className={styles.logoText}>
                        PN
                    </span>
                    <div className={styles.logoRing} />
                </div>

                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>PINN Mesh Deformation</h1>
                    <p className={styles.subtitle}>
                        AA374 &nbsp;·&nbsp; Computational Fluid &amp; Structures
                        &nbsp;·&nbsp; IIT Indore
                    </p>
                </div>
            </div>

            {/* Right — badges + status */}
            <div className={styles.right}>
                <div className={styles.badges}>
                    {badges.map(({ label, variant }) => (
                        <span
                            key={label}
                            className={`${styles.badge} ${styles[`badge_${variant}`]}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <div className={styles.statusRow} ref={statusRef}>
                    <span className={styles.statusDot} />
                    <span className={styles.statusLabel}>SOLVER READY</span>
                </div>
            </div>

            {/* Decorative scan line */}
            <div className={styles.scanLine} />
        </header>
    );
}
