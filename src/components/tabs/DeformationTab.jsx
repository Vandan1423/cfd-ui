import { useState } from "react";

import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import ImageFrame from "../ui/ImageFrame";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { useTimePlayer } from "../../hooks/useTimePlayer";
import { EXAMPLES, getExampleImagePath } from "../../data/examples";
import ConceptBox from "../ui/ConceptBox";
import ConceptGrid from "../ui/ConceptGrid";

import styles from "./DeformationTab.module.css";

export default function DeformationTab() {
    const [exampleIdx, setExampleIdx] = useState(0);
    const [modal, setModal] = useState(null);

    const currentExample = EXAMPLES[exampleIdx];

    const {
        step,
        t,
        timeFactor,
        vMax,
        isPlaying,
        speed,
        pct,
        totalSteps,
        togglePlay,
        setStep,
        setSpeed,
        stepForward,
        stepBackward,
        reset,
        SPEED_OPTIONS,
    } = useTimePlayer(currentExample.totalSteps);

    const deformedSrc = getExampleImagePath(currentExample, step);

    const handleSlider = (e) => setStep(Number(e.target.value));

    const handleExampleChange = (idx) => {
        if (!EXAMPLES[idx].ready) return;
        reset(); // jump back to step 0 when switching example
        setExampleIdx(idx);
    };

    return (
        <div className={styles.root}>
            <SectionHeader
                title="Deformation Explorer"
                sub="Scrub through time — see the mesh evolve"
            />

            {/* ── Example selector ── */}
            <div className={styles.exampleRow}>
                {EXAMPLES.map((ex, idx) => (
                    <button
                        key={ex.id}
                        className={[
                            styles.exBtn,
                            exampleIdx === idx ? styles.exBtnActive : "",
                            !ex.ready ? styles.exBtnDisabled : "",
                        ].join(" ")}
                        onClick={() => handleExampleChange(idx)}
                        disabled={!ex.ready}
                        title={ex.ready ? ex.notes : "Not yet available"}
                    >
                        <span className={styles.exDot} />
                        <span className={styles.exLabel}>{ex.label}</span>
                        <span className={styles.exDesc}>{ex.desc}</span>
                    </button>
                ))}
            </div>

            {/* ── BC formula banner ── */}
            <div className={styles.formulaBanner}>
                <span className={styles.formulaKey}>Boundary Condition</span>
                <span className={styles.formulaVal}>
                    {currentExample.bcFormula}
                </span>
                {currentExample.notes && (
                    <span className={styles.formulaNote}>
                        {currentExample.notes}
                    </span>
                )}
            </div>

            {/* ── Time slider card ── */}
            <div className={styles.sliderCard}>
                {/* Top row — time display + derived stats */}
                <div className={styles.sliderTop}>
                    <div>
                        <div className={styles.timeLabel}>Simulation Time</div>
                        <div className={styles.timeValue}>
                            t = {t.toFixed(2)}
                        </div>
                    </div>

                    <div className={styles.sliderStats}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Step</span>
                            <span className={styles.statVal}>
                                {step} / {totalSteps}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>sin(2πt)</span>
                            <span
                                className={styles.statVal}
                                style={{ color: "var(--yellow)" }}
                            >
                                {timeFactor.toFixed(3)}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>
                                v_max on top
                            </span>
                            <span
                                className={styles.statVal}
                                style={{ color: "var(--orange)" }}
                            >
                                {vMax.toFixed(3)}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Amplitude</span>
                            <span
                                className={styles.statVal}
                                style={{ color: "var(--cyan)" }}
                            >
                                {currentExample.amplitude.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Range slider */}
                <div className={styles.rangeWrap}>
                    <input
                        type="range"
                        min={0}
                        max={totalSteps}
                        value={step}
                        step={1}
                        onChange={handleSlider}
                        className={styles.range}
                        style={{ "--pct": `${pct}%` }}
                        aria-label="Time step"
                    />
                </div>

                {/* Tick marks */}
                <div className={styles.ticks}>
                    {Array.from({ length: totalSteps + 1 }, (_, i) => (
                        <span
                            key={i}
                            className={`${styles.tick} ${i === step ? styles.tickActive : ""}`}
                        >
                            {(i / totalSteps).toFixed(1)}
                        </span>
                    ))}
                </div>

                {/* Controls row */}
                <div className={styles.controls}>
                    <button
                        className={styles.stepBtn}
                        onClick={stepBackward}
                        aria-label="Step backward"
                    >
                        ‹
                    </button>

                    <button
                        className={`${styles.playBtn} ${isPlaying ? styles.playing : ""}`}
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button
                        className={styles.stepBtn}
                        onClick={stepForward}
                        aria-label="Step forward"
                    >
                        ›
                    </button>

                    <button
                        className={styles.resetBtn}
                        onClick={reset}
                        aria-label="Reset to step 0"
                    >
                        ↺
                    </button>

                    <div className={styles.speedWrap}>
                        <span className={styles.statLabel}>Speed</span>
                        <select
                            className={styles.speedSelect}
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                        >
                            {SPEED_OPTIONS.map((ms) => (
                                <option key={ms} value={ms}>
                                    {ms === 1400
                                        ? "0.5×"
                                        : ms === 800
                                          ? "1×"
                                          : ms === 400
                                            ? "2×"
                                            : "4×"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Side-by-side viewer ── */}
            <div className={styles.viewerGrid}>
                {/* Original — always fixed at t=0 */}
                <div className={styles.viewerPanel}>
                    <div className={styles.viewerHeader}>
                        <span className={styles.viewerLabel}>
                            Original Mesh
                        </span>
                        <Badge variant="cyan">t = 0 · fixed reference</Badge>
                    </div>
                    <div className={styles.viewerBody}>
                        <ImageFrame
                            src={currentExample.originalImg}
                            alt="Original structured mesh"
                            caption="Structured 60×60 grid — undeformed"
                            onClick={() =>
                                setModal({
                                    src: currentExample.originalImg,
                                    caption:
                                        "Original Structured Mesh — 60×60 node grid at t = 0",
                                })
                            }
                            minHeight="300px"
                        />
                    </div>
                </div>

                {/* Deformed — updates with slider */}
                <div className={styles.viewerPanel}>
                    <div className={styles.viewerHeader}>
                        <span className={styles.viewerLabel}>
                            Deformed Mesh
                        </span>
                        <Badge variant="orange">t = {t.toFixed(2)}</Badge>
                    </div>
                    <div className={styles.viewerBody}>
                        <ImageFrame
                            src={deformedSrc}
                            alt={`Deformed mesh at t = ${t.toFixed(2)}`}
                            caption={`Step ${step} of ${totalSteps} — t = ${t.toFixed(2)}`}
                            onClick={() =>
                                setModal({
                                    src: deformedSrc,
                                    caption: `Deformed Mesh — ${currentExample.label} — t = ${t.toFixed(2)} (step ${step}/${totalSteps})`,
                                })
                            }
                            minHeight="300px"
                        />
                    </div>
                </div>
            </div>

            {/* ── Conceptual content ── */}
            <ConceptGrid cols={3}>
                <ConceptBox variant="theory" title="ALE Mesh Motion">
                    <p>
                        Arbitrary Lagrangian-Eulerian (ALE) formulations require
                        the mesh to move with a prescribed boundary while
                        keeping interior nodes non-tangled. The PINN solves for
                        nodal displacements (u,v) rather than positions
                        directly, making it easy to compose with any CFD solver.
                    </p>
                </ConceptBox>

                <ConceptBox variant="equation" title="Time-Dependent BC">
                    <code>v(x,t) = −A · sin(πx) · sin(2πt)</code>
                    <p>Top wall oscillates sinusoidally over one period T=1.</p>
                    <code>t = 0, 0.5, 1.0 → v = 0 (flat wall)</code>
                    <code>t = 0.25 → v = −A (max dip)</code>
                    <code>t = 0.75 → v = +A (max push)</code>
                </ConceptBox>

                <ConceptBox variant="takeaway" title="Warm Starting Advantage">
                    <p>
                        From step 2 onward, both Stage-1 and Stage-2 networks
                        are initialised from the previous timestep's weights.
                        Since consecutive meshes differ only slightly, the
                        network is already near the solution — convergence
                        requires roughly 3× fewer iterations than cold-starting,
                        making the full time loop feasible on a laptop CPU.
                    </p>
                </ConceptBox>
            </ConceptGrid>

            {/* ── Displacement overview image (from current example) ── */}
            {currentExample.overviewImg && (
                <Card
                    title="Displacement Field — Static Snapshot"
                    badge={
                        <Badge variant="orange">
                            Plasma colormap · Quiver vectors
                        </Badge>
                    }
                    noPadding
                >
                    <div className={styles.imgBody}>
                        <ImageFrame
                            src={currentExample.overviewImg}
                            alt="Displacement field overview"
                            caption="Original · Deformed · Displacement magnitude"
                            onClick={() =>
                                setModal({
                                    src: currentExample.overviewImg,
                                    caption: `${currentExample.label} — Displacement Field Overview`,
                                })
                            }
                            minHeight="200px"
                        />
                    </div>
                </Card>
            )}

            {/* ── Folder structure hint ── */}
            <div className={styles.folderNote}>
                <span className={styles.folderIcon}>📂</span>
                <div>
                    <div className={styles.folderTitle}>
                        Timestep images location
                    </div>
                    <code className={styles.folderPath}>
                        {currentExample.assetDir
                            ? `public/assets/timesteps/${currentExample.assetDir}/step_0000/ … /deformed_mesh.png`
                            : "public/assets/timesteps/step_0000/ … step_0010/deformed_mesh.png"}
                    </code>
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
