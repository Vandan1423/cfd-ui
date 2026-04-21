import { useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import ImageFrame from "../ui/ImageFrame";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import styles from "./QualityTab.module.css";

/**
 * ════════════════════════════════════════════════════
 * IMAGE DIRECTORY — put all files in:
 *   public/assets/quality/
 *
 * NAMING CONVENTION:
 *   Area Change    →  area_t000.png  area_t020.png  area_t040.png
 *                     area_t060.png  area_t080.png  area_t100.png
 *
 *   Aspect Ratio   →  ar_t000.png    ar_t020.png    ar_t040.png
 *                     ar_t060.png    ar_t080.png    ar_t100.png
 *
 *   Min Angle      →  angle_t000.png angle_t020.png angle_t040.png
 *                     angle_t060.png angle_t080.png angle_t100.png
 *
 * These are the 18 heatmap images from your slides (6 per metric).
 * Export them from your PPT / matplotlib and drop them in that folder.
 * ════════════════════════════════════════════════════
 */

const T_LABELS = ["0.00", "0.20", "0.40", "0.60", "0.80", "1.00"];
const T_FILES = ["000", "020", "040", "060", "080", "100"];

const PANELS = [
    {
        id: "area",
        label: "Area Change",
        slide: "Slide 10",
        badge: "green",
        prefix: "area",
        title: "Area Change Across the Entire Cycle",
        sub: "Element area variation stays bounded even at peak deformation. Zero inverted triangles at every timestep.",
        metrics: [
            {
                value: "0",
                label: "Inverted Elements",
                sub: "Across all timesteps",
                accent: "green",
            },
            {
                value: "~1.75×",
                label: "Peak Area Ratio",
                sub: "At t = 0.2 extremum",
                accent: "cyan",
            },
            {
                value: "3.6K",
                label: "Nodes Tracked",
                sub: "With consistent topology",
                accent: "orange",
            },
        ],
        note: "Area ratio = deformed element area ÷ original element area. Values close to 1.0 mean minimal distortion. Ratio up to ~1.75× at peak is acceptable — no negative areas (inverted triangles) were produced at any timestep.",
    },
    {
        id: "ar",
        label: "Aspect Ratio",
        slide: "Slide 11",
        badge: "orange",
        prefix: "ar",
        title: "Aspect Ratio Variation Across the Entire Cycle",
        sub: "Most elements maintain moderate aspect ratio. High values appear near the moving boundary and regions with large deformation gradients.",
        metrics: [
            {
                value: "28.50",
                label: "Peak Aspect Ratio",
                sub: "Across all timesteps",
                accent: "orange",
            },
            {
                value: "~1.50",
                label: "Nominal Aspect Ratio",
                sub: "At t = 0.2 extremum",
                accent: "cyan",
            },
            {
                value: "3.6K",
                label: "Elements Tracked",
                sub: "With consistent topology",
                accent: "green",
            },
        ],
        note: "Aspect ratio = longest edge ÷ shortest edge per triangle. Peak value of 28.50 appears at top-corner regions where shear concentration is highest. Interior elements remain near the nominal ~1.50 throughout the cycle.",
    },
    {
        id: "angle",
        label: "Min Angle",
        slide: "Slide 12",
        badge: "cyan",
        prefix: "angle",
        title: "Min. Angle Variation Across the Entire Cycle",
        sub: "Minimum angle highlights element skewness — near-zero values indicate local collapse during peak deformation.",
        metrics: [
            {
                value: "~0.02°",
                label: "Min Angle (Worst)",
                sub: "Near mesh collapse region",
                accent: "orange",
            },
            {
                value: "~43°",
                label: "Typical Min Angle",
                sub: "In well-conditioned states",
                accent: "cyan",
            },
            {
                value: "6,962",
                label: "Triangles Tracked",
                sub: "Across all timesteps",
                accent: "green",
            },
        ],
        note: "Minimum interior angle per triangle. Values near ~43° indicate well-shaped, nearly equilateral elements. The worst-case ~0.02° occurs in collapse regions near the top boundary at peak deformation — a known limitation of purely harmonic mesh motion.",
    },
];

export default function QualityTab() {
    const [modal, setModal] = useState(null);
    const [activePanel, setActivePanel] = useState("area");

    const panel = PANELS.find((p) => p.id === activePanel);

    return (
        <div className={styles.root}>
            <SectionHeader
                title="Mesh Quality Analysis"
                sub="Tracking quality metrics across the full deformation cycle"
            />

            {/* ── Top 4 summary cards ── */}
            <div className={styles.summaryRow}>
                {[
                    {
                        icon: "✓",
                        val: "0",
                        label: "Inverted Elements",
                        sub: "Across all timesteps",
                        color: "var(--green)",
                    },
                    {
                        icon: "△",
                        val: "6,962",
                        label: "Triangles Tracked",
                        sub: "Consistent topology",
                        color: "var(--cyan)",
                    },
                    {
                        icon: "◈",
                        val: "~1.75×",
                        label: "Peak Area Ratio",
                        sub: "At t = 0.2 extremum",
                        color: "var(--orange)",
                    },
                    {
                        icon: "∠",
                        val: "~43°",
                        label: "Typical Min Angle",
                        sub: "Well-conditioned interior",
                        color: "var(--yellow)",
                    },
                ].map(({ icon, val, label, sub, color }) => (
                    <div
                        key={label}
                        className={styles.summaryCard}
                        style={{ "--card-color": color }}
                    >
                        <div className={styles.summaryIcon}>{icon}</div>
                        <div className={styles.summaryVal}>{val}</div>
                        <div className={styles.summaryLabel}>{label}</div>
                        <div className={styles.summarySub}>{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Panel switcher tabs ── */}
            <div className={styles.switcher}>
                {PANELS.map((p) => (
                    <button
                        key={p.id}
                        className={`${styles.switchBtn} ${activePanel === p.id ? styles.switchActive : ""}`}
                        data-accent={p.badge}
                        onClick={() => setActivePanel(p.id)}
                    >
                        <span className={styles.switchNum}>{p.slide}</span>
                        <span className={styles.switchLabel}>{p.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Active panel ── */}
            <div className={styles.panel}>
                {/* Panel header */}
                <div className={styles.panelTop}>
                    <div className={styles.panelTitles}>
                        <h2 className={styles.panelTitle}>{panel.title}</h2>
                        <p className={styles.panelSub}>{panel.sub}</p>
                    </div>
                    <Badge variant={panel.badge}>{panel.slide}</Badge>
                </div>

                {/* 6-image heatmap grid + headline metrics side panel */}
                <div className={styles.panelBody}>
                    {/* Heatmap grid — 3 columns × 2 rows */}
                    <div className={styles.heatmapGrid}>
                        {T_FILES.map((tf, i) => {
                            const src = `/assets/quality/${panel.prefix}_t${tf}.png`;
                            const caption = `${panel.label} t = ${T_LABELS[i]}`;
                            return (
                                <div key={tf} className={styles.heatmapCell}>
                                    <ImageFrame
                                        src={src}
                                        alt={caption}
                                        caption={`Click to expand — ${caption}`}
                                        onClick={() =>
                                            setModal({ src, caption })
                                        }
                                        minHeight="180px"
                                    />
                                    <div className={styles.heatmapLabel}>
                                        t = {T_LABELS[i]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Headline metrics sidebar */}
                    <div className={styles.headlineSidebar}>
                        <div className={styles.headlineTitle}>
                            Headline Metrics
                        </div>

                        {panel.metrics.map(({ value, label, sub, accent }) => (
                            <div
                                key={label}
                                className={`${styles.headlineMetric} ${styles[`hl_${accent}`]}`}
                            >
                                <div className={styles.hlVal}>{value}</div>
                                <div className={styles.hlLabel}>{label}</div>
                                <div className={styles.hlSub}>{sub}</div>
                            </div>
                        ))}

                        <div className={styles.headlineNote}>{panel.note}</div>
                    </div>
                </div>
            </div>

            <Modal
                src={modal?.src}
                caption={modal?.caption}
                onClose={() => setModal(null)}
            />
        </div>
    );
}
