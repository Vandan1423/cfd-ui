import SectionHeader from "../ui/SectionHeader";
import AlgoStep from "../ui/AlgoStep";
import Card from "../ui/Card";
import { ALGO_STEPS, ARCH_SPECS } from "../../data/algoSteps";

import styles from "./AlgorithmTab.module.css";

/* ── Small helper: renders the code block inside an AlgoStep body ── */
function CodeBlock({ code }) {
    if (!code) return null;
    return <pre className={styles.pre}>{code}</pre>;
}

export default function AlgorithmTab() {
    return (
        <div className={styles.root}>
            <SectionHeader
                title="PINN Algorithm"
                sub="Physics-Informed Neural Network — step by step"
            />

            <div className={styles.layout}>
                {/* ── Left: accordion steps driven by data ── */}
                <div className={styles.steps}>
                    {ALGO_STEPS.map((step) => (
                        <AlgoStep
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            equation={step.equation}
                            defaultOpen={step.defaultOpen ?? false}
                        >
                            {/* Body prose */}
                            {step.body
                                .split("\n")
                                .map((line, i) =>
                                    line.trim() ? (
                                        <p key={i}>{line.trim()}</p>
                                    ) : null,
                                )}

                            {/* Code block */}
                            <CodeBlock code={step.code} />
                        </AlgoStep>
                    ))}
                </div>

                {/* ── Right: sticky sidebar cards ── */}
                <div className={styles.sidebar}>
                    {/* Why Laplace */}
                    <Card title="Why Laplace's Equation?" accent="cyan">
                        <div className={styles.sideText}>
                            <p>
                                ∇²u = 0 and ∇²v = 0 are the{" "}
                                <em>harmonic equations</em>. Their solutions are
                                the smoothest possible functions satisfying
                                given boundary conditions — they minimise the
                                "bending energy" of the displacement field.
                            </p>
                            <p>
                                This prevents mesh tangling: if the boundary
                                moves smoothly, the interior follows smoothly
                                with no sudden jumps or folds.
                            </p>
                            <div className={styles.highlight}>
                                <div className={styles.highlightTitle}>
                                    Maximum Principle
                                </div>
                                <p>
                                    Harmonic functions guarantee interior
                                    displacements are bounded by boundary values
                                    — large boundary motion cannot cause
                                    interior nodes to overshoot.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Why 2-stage */}
                    <Card title="Why 2-Stage Architecture?" accent="orange">
                        <div className={styles.stageCompare}>
                            <div className={styles.stageBox}>
                                <div
                                    className={styles.stageBoxLabel}
                                    style={{ color: "var(--orange)" }}
                                >
                                    Stage 1 — Soft BC
                                </div>
                                <p className={styles.stageBoxText}>
                                    Gets a good smooth starting point. BCs are
                                    approximately satisfied — neural network
                                    approximation error prevents exact
                                    enforcement.
                                </p>
                            </div>

                            <div className={styles.stageBox}>
                                <div
                                    className={styles.stageBoxLabel}
                                    style={{ color: "var(--cyan)" }}
                                >
                                    Stage 2 — Hard BC
                                </div>
                                <p className={styles.stageBoxText}>
                                    Corrects to exact BC satisfaction using the
                                    D·NN trick. Since D = 0 on the boundary
                                    analytically, BCs are satisfied to machine
                                    precision.
                                </p>
                            </div>

                            <div className={styles.stageResult}>
                                <div
                                    className={styles.stageBoxLabel}
                                    style={{ color: "var(--green)" }}
                                >
                                    Result
                                </div>
                                <p className={styles.stageBoxText}>
                                    Zero inverted triangles. Smooth interior.
                                    Exact boundary enforcement.
                                    Production-quality mesh for CFD simulation.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Network architecture — driven by ARCH_SPECS data */}
                    <Card title="Network Architecture">
                        <div className={styles.archTable}>
                            {ARCH_SPECS.map(({ key, value }) => (
                                <div key={key} className={styles.archRow}>
                                    <span className={styles.archKey}>
                                        {key}
                                    </span>
                                    <span className={styles.archVal}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Training summary */}
                    <Card title="Training Summary" accent="green">
                        <div className={styles.trainGrid}>
                            {[
                                {
                                    label: "Stage 1 iters",
                                    value: "4 000",
                                    color: "var(--orange)",
                                },
                                {
                                    label: "Stage 2 iters",
                                    value: "6 000",
                                    color: "var(--cyan)",
                                },
                                {
                                    label: "BC weight",
                                    value: "25.0",
                                    color: "var(--yellow)",
                                },
                                {
                                    label: "LR schedule",
                                    value: "StepLR",
                                    color: "var(--text)",
                                },
                                {
                                    label: "Warm start",
                                    value: "Yes ✓",
                                    color: "var(--green)",
                                },
                                {
                                    label: "GPU support",
                                    value: "Yes ✓",
                                    color: "var(--green)",
                                },
                            ].map(({ label, value, color }) => (
                                <div key={label} className={styles.trainCell}>
                                    <div
                                        className={styles.trainVal}
                                        style={{ color }}
                                    >
                                        {value}
                                    </div>
                                    <div className={styles.trainLabel}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
