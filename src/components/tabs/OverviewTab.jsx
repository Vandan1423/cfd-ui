import { useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import MetricCard from "../ui/MetricCard";
import Card from "../ui/Card";
import ImageFrame from "../ui/ImageFrame";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import styles from "./OverviewTab.module.css";
import { TEAM_MEMBERS } from "../../data/teamMembers";

const METRICS = [
    {
        value: "3600",
        label: "Mesh Nodes",
        sub: "60×60 structured grid",
        accent: "cyan",
        countUp: true,
    },
    {
        value: "0",
        label: "Inverted Triangles",
        sub: "Zero tangled elements",
        accent: "green",
        countUp: false,
    },
    {
        value: "∇²=0",
        label: "PDE Solved",
        sub: "Laplace equations for u, v",
        accent: "orange",
        countUp: false,
    },
    {
        value: "2-Stage",
        label: "PINN Architecture",
        sub: "Soft-BC → Hard-BC",
        accent: "yellow",
        countUp: false,
    },
];

const SPECS = [
    { label: "Framework", value: "PyTorch + autograd" },
    { label: "Network", value: "MLP 128×4 · Tanh" },
    { label: "Optimizer", value: "Adam · LR 1e-3" },
    { label: "Stage 1 Iters", value: "4 000" },
    { label: "Stage 2 Iters", value: "6 000" },
    { label: "BC Enforcement", value: "Hard (exact)" },
];

export default function OverviewTab() {
    const [modal, setModal] = useState(null);

    return (
        <div className={styles.root}>
            <SectionHeader
                title="Project Overview"
                sub="AI-Aided Grid Generation using PINNs"
            />

            {/* ── Metrics row ── */}
            <div className={styles.metricsGrid}>
                {METRICS.map((m) => (
                    <MetricCard key={m.label} {...m} />
                ))}
            </div>

            {/* ── Main images ── */}
            <div className={styles.imagesGrid}>
                <Card
                    title="Original Unstructured Grid"
                    badge={<Badge variant="cyan">Input</Badge>}
                    noPadding
                >
                    <div className={styles.imgBody}>
                        <ImageFrame
                            src="/assets/Original_Unstructured_Grid.jpeg"
                            alt="Original unstructured Delaunay grid"
                            caption="Delaunay triangulation of jittered point cloud"
                            onClick={() =>
                                setModal({
                                    src: "/assets/Original_Unstructured_Grid.jpeg",
                                    caption:
                                        "Original Unstructured Grid — Delaunay triangulation of jittered 30×30 point cloud",
                                })
                            }
                            minHeight="280px"
                        />
                        <p className={styles.imgNote}>
                            Delaunay triangulation of a jittered 30×30 point
                            cloud. Irregular element sizes — unsuitable for
                            structured CFD solvers.
                        </p>
                    </div>
                </Card>

                <Card
                    title="PINN Deformed Mesh"
                    badge={<Badge variant="green">Output</Badge>}
                    noPadding
                >
                    <div className={styles.imgBody}>
                        <ImageFrame
                            src="/assets/imgb.jpeg"
                            alt="PINN mesh deformation overview"
                            caption="Original · Deformed · Displacement field"
                            onClick={() =>
                                setModal({
                                    src: "/assets/imgb.jpeg",
                                    caption:
                                        "PINN Mesh Deformation — Original, Deformed, and Displacement Field",
                                })
                            }
                            minHeight="280px"
                        />
                        <p className={styles.imgNote}>
                            Top wall pushed down sinusoidally: v =
                            −0.20·sin(πx). Interior nodes smoothly follow via
                            Laplace solution.
                        </p>
                    </div>
                </Card>
            </div>

            {/* ── Team + Specs ── */}
            <div className={styles.bottomGrid}>
                {/* Team */}
                <Card title="Team Members">
                    <div className={styles.teamList}>
                        {TEAM_MEMBERS.map(({ initial, name, role, accent }) => (
                            <div key={name} className={styles.teamMember}>
                                <div
                                    className={`${styles.avatar} ${styles[`avatar_${accent}`]}`}
                                >
                                    {initial}
                                </div>
                                <div className={styles.memberInfo}>
                                    <div className={styles.memberName}>
                                        {name}
                                    </div>
                                    <div className={styles.memberRole}>
                                        {role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Reference & Specs */}
                <Card title="Reference & Method">
                    <div className={styles.refBlock}>
                        <div className={styles.refLabel}>Paper</div>
                        <div className={styles.refValue}>
                            Aygun, Maulik &amp; Karakus
                            <span className={styles.arxiv}>
                                {" "}
                                arXiv:2301.05926
                            </span>
                        </div>
                    </div>

                    <div className={styles.specList}>
                        {SPECS.map(({ label, value }) => (
                            <div key={label} className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    {label}
                                </span>
                                <span className={styles.specValue}>
                                    {value}
                                </span>
                            </div>
                        ))}
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
