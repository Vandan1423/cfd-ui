import { useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import PipelineStep from "../ui/PipelineStep";
import Card from "../ui/Card";
import ImageFrame from "../ui/ImageFrame";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import styles from "./PipelineTab.module.css";
import { STAGE1_STEPS, STAGE2_STEPS } from "../../data/pipelineSteps";

export default function PipelineTab() {
    const [modal, setModal] = useState(null);

    return (
        <div className={styles.root}>
            <SectionHeader
                title="Full Pipeline"
                sub="Unstructured → Structured → Deformed"
            />

            {/* ── Stage 1 ── */}
            <div className={styles.stageBlock}>
                <div className={styles.stageLabel} data-accent="cyan">
                    <span
                        className={styles.stageDot}
                        style={{ background: "var(--cyan)" }}
                    />
                    Stage 1 — Grid Generation
                    <span className={styles.stageFile}>
                        pinn_structured_grids.py
                    </span>
                </div>

                <div className={styles.pipeline}>
                    {STAGE1_STEPS.map((step, i) => (
                        <PipelineStep
                            key={step.number}
                            {...step}
                            accent="cyan"
                            isLast={i === STAGE1_STEPS.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* ── Stage 2 ── */}
            <div className={styles.stageBlock}>
                <div className={styles.stageLabel} data-accent="orange">
                    <span
                        className={styles.stageDot}
                        style={{ background: "var(--orange)" }}
                    />
                    Stage 2 — Mesh Deformation
                    <span className={styles.stageFile}>
                        pinn_mesh_deformation.py
                    </span>
                </div>

                <div className={styles.pipeline}>
                    {STAGE2_STEPS.map((step, i) => (
                        <PipelineStep
                            key={step.number}
                            {...step}
                            accent="orange"
                            isLast={i === STAGE2_STEPS.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* ── Pipeline visual image ── */}
            <Card
                title="Grid Generation Pipeline — Visual"
                badge={
                    <Badge variant="cyan">
                        pinn_structured_grids.py output
                    </Badge>
                }
                noPadding
            >
                <div className={styles.imgBody}>
                    <ImageFrame
                        src="/assets/imge.jpeg"
                        alt="Grid generation pipeline: unstructured to structured"
                        caption="Unstructured → Computational (ξ,η) → Physical (x,y)"
                        onClick={() =>
                            setModal({
                                src: "/assets/imge.jpeg",
                                caption:
                                    "Grid Generation Pipeline — Unstructured → Computational (ξ,η) → Structured Physical (x,y)",
                            })
                        }
                        minHeight="220px"
                    />
                </div>
            </Card>

            {/* ── Side by side: unstructured + mapped ── */}
            <div className={styles.twoCol}>
                <Card
                    title="Unstructured Input Grid"
                    badge={<Badge variant="orange">Delaunay</Badge>}
                    noPadding
                >
                    <div className={styles.imgBody}>
                        <ImageFrame
                            src="/assets/Original_Unstructured_Grid.jpeg"
                            alt="Original unstructured grid"
                            caption="Jittered 30×30 Delaunay triangulation"
                            onClick={() =>
                                setModal({
                                    src: "/assets/Original_Unstructured_Grid.jpeg",
                                    caption:
                                        "Original Unstructured Grid — Delaunay triangulation",
                                })
                            }
                            minHeight="260px"
                        />
                    </div>
                </Card>

                <Card
                    title="Structured Physical Grid"
                    badge={<Badge variant="cyan">PINN Output</Badge>}
                    noPadding
                >
                    <div className={styles.imgBody}>
                        <ImageFrame
                            src="/assets/Mapped_Grid.jpeg"
                            alt="Structured physical grid from PINN"
                            caption="60×60 structured grid — Laplace-smoothed"
                            onClick={() =>
                                setModal({
                                    src: "/assets/Mapped_Grid.jpeg",
                                    caption:
                                        "Structured Physical Grid — 60×60 node PINN output, Laplace-smoothed",
                                })
                            }
                            minHeight="260px"
                        />
                    </div>
                </Card>
            </div>

            <Modal
                src={modal?.src}
                caption={modal?.caption}
                onClose={() => setModal(null)}
            />
        </div>
    );
}
