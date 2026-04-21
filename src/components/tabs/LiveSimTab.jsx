import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useLiveCanvas } from "../../hooks/useLiveCanvas";
import ConceptBox from "../ui/ConceptBox";
import ConceptGrid from "../ui/ConceptGrid";

import styles from "./LiveSimTab.module.css";

export default function LiveSimTab() {
    const {
        canvasOrigRef,
        canvasDefRef,
        canvasWaveRef,
        amp,
        res,
        t,
        isPlaying,
        setAmp,
        setRes,
        togglePlay,
    } = useLiveCanvas(0.2, 20);

    const ampPct = ((amp - 0.05) / 0.35) * 100;
    const resPct = ((res - 10) / 20) * 100;

    return (
        <div className={styles.root}>
            <SectionHeader
                title="Live Simulation"
                sub="Real-time mesh deformation — computed in-browser via Laplace model"
            />

            {/* ── Controls card ── */}
            <Card
                title="Simulation Controls"
                badge={
                    <div className={styles.liveIndicator}>
                        <span className={styles.liveDot} />
                        <span>LIVE</span>
                    </div>
                }
            >
                <div className={styles.controlsGrid}>
                    {/* Amplitude */}
                    <div className={styles.sliderGroup}>
                        <div className={styles.sliderMeta}>
                            <span className={styles.sliderLabel}>
                                Amplitude — max wall displacement
                            </span>
                            <span
                                className={styles.sliderVal}
                                style={{ color: "var(--cyan)" }}
                            >
                                {amp.toFixed(2)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.05"
                            max="0.40"
                            step="0.01"
                            value={amp}
                            onChange={(e) => setAmp(parseFloat(e.target.value))}
                            className={styles.range}
                            style={{ "--pct": `${ampPct}%` }}
                            aria-label="Amplitude"
                        />
                        <div className={styles.rangeLimits}>
                            <span>0.05</span>
                            <span>0.40</span>
                        </div>
                    </div>

                    {/* Resolution */}
                    <div className={styles.sliderGroup}>
                        <div className={styles.sliderMeta}>
                            <span className={styles.sliderLabel}>
                                Grid resolution
                            </span>
                            <span
                                className={styles.sliderVal}
                                style={{ color: "var(--cyan)" }}
                            >
                                {res}×{res}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="30"
                            step="2"
                            value={res}
                            onChange={(e) => setRes(parseInt(e.target.value))}
                            className={styles.range}
                            style={{ "--pct": `${resPct}%` }}
                            aria-label="Grid resolution"
                        />
                        <div className={styles.rangeLimits}>
                            <span>10×10</span>
                            <span>30×30</span>
                        </div>
                    </div>

                    {/* Play button + time readout */}
                    <div className={styles.playGroup}>
                        <button
                            className={`${styles.playBtn} ${isPlaying ? styles.playing : ""}`}
                            onClick={togglePlay}
                            aria-label={
                                isPlaying
                                    ? "Pause simulation"
                                    : "Play simulation"
                            }
                        >
                            {isPlaying ? "⏸" : "▶"}
                        </button>
                        <div>
                            <div className={styles.sliderLabel}>Time</div>
                            <div className={styles.tDisplay}>
                                t = {t.toFixed(3)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info row below sliders */}
                <div className={styles.infoRow}>
                    <div className={styles.infoChip}>
                        <span className={styles.infoKey}>BC formula</span>
                        <span className={styles.infoVal}>
                            v(x,t) = −{amp.toFixed(2)}·sin(πx)·sin(2πt)
                        </span>
                    </div>
                    <div className={styles.infoChip}>
                        <span className={styles.infoKey}>v_max</span>
                        <span
                            className={styles.infoVal}
                            style={{ color: "var(--orange)" }}
                        >
                            {(-amp * Math.sin(2 * Math.PI * t)).toFixed(3)}
                        </span>
                    </div>
                    <div className={styles.infoChip}>
                        <span className={styles.infoKey}>sin(2πt)</span>
                        <span
                            className={styles.infoVal}
                            style={{ color: "var(--yellow)" }}
                        >
                            {Math.sin(2 * Math.PI * t).toFixed(3)}
                        </span>
                    </div>
                    <div className={styles.infoChip}>
                        <span className={styles.infoKey}>Nodes</span>
                        <span className={styles.infoVal}>
                            {(res + 1) * (res + 1)}
                        </span>
                    </div>
                </div>
            </Card>

            {/* ── Mesh canvases ── */}
            <div className={styles.canvasGrid}>
                <Card
                    title="Original Mesh"
                    badge={<Badge variant="cyan">Reference · t = 0</Badge>}
                    noPadding
                >
                    <div className={styles.canvasWrap}>
                        <canvas ref={canvasOrigRef} className={styles.canvas} />
                        <div className={styles.canvasTag}>Original · fixed</div>
                    </div>
                </Card>

                <Card
                    title="Deformed Mesh"
                    badge={
                        <Badge variant="orange">Live · Laplace solution</Badge>
                    }
                    noPadding
                >
                    <div className={styles.canvasWrap}>
                        <canvas ref={canvasDefRef} className={styles.canvas} />
                        <div className={styles.canvasTag}>
                            t = {t.toFixed(3)}
                        </div>
                        {/* Red legend for top boundary */}
                        <div className={styles.legend}>
                            <span className={styles.legendDot} />
                            <span className={styles.legendLabel}>
                                Top BC nodes
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── Wave chart ── */}
            <Card
                title="Top Boundary Displacement Profile"
                badge={
                    <Badge variant="cyan">v(x,t) = −A·sin(πx)·sin(2πt)</Badge>
                }
                noPadding
            >
                <div className={styles.waveWrap}>
                    <canvas ref={canvasWaveRef} className={styles.waveCanvas} />
                </div>
            </Card>

            {/* ── Conceptual content ── */}
            <ConceptGrid cols={2}>
                <ConceptBox variant="theory" title="What You Are Seeing">
                    <p>
                        This canvas computes a simplified Laplace-inspired
                        displacement model in real time. The displacement at
                        each interior node decays linearly from the top boundary
                        (full amplitude) to the bottom (zero) — a linear
                        interpolation that approximates the true Laplace
                        solution for moderate amplitudes. The actual PINN
                        computes a more accurate nonlinear solution offline
                        using 10,000 gradient descent iterations.
                    </p>
                </ConceptBox>

                <ConceptBox
                    variant="equation"
                    title="Browser Displacement Model"
                >
                    <code>v(x,y,t) = −A · sin(πx) · sin(2πt) · y</code>
                    <p>where y ∈ [0,1] is the normalised height of the node.</p>
                    <p>
                        This is linear in y — the Laplace solution is smoother
                        and nonlinear, but the qualitative deformation shape is
                        identical. Red dots mark the top boundary nodes whose
                        position is prescribed by the BC.
                    </p>
                </ConceptBox>
            </ConceptGrid>

            {/* ── Explainer note ── */}
            <div className={styles.note}>
                <div className={styles.noteIcon}>ℹ</div>
                <p className={styles.noteText}>
                    This is a <strong>browser-computed</strong> approximation
                    using the linearised Laplace displacement model —
                    displacement decays linearly from the top boundary (full
                    amplitude) to the bottom (zero). The actual PINN solver
                    computes a more accurate solution offline. Use the
                    <strong> Deformation Explorer</strong> tab to view the real
                    PINN output images.
                </p>
            </div>
        </div>
    );
}
