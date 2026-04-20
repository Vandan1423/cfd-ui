import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import MetricCard    from '../ui/MetricCard';
import Card          from '../ui/Card';
import ImageFrame    from '../ui/ImageFrame';
import Badge         from '../ui/Badge';
import Modal         from '../ui/Modal';
import styles        from './QualityTab.module.css';

const METRICS = [
  { value: '0',    label: 'Inverted Triangles', sub: 'All elements have positive signed area',       accent: 'green'  },
  { value: '0.31', label: 'Max  f_A',           sub: 'Peak area change — near top boundary',         accent: 'cyan'   },
  { value: '0.87', label: 'Max  f_AR',          sub: 'Peak shape change — at top corners',           accent: 'orange' },
  { value: '100%', label: 'Valid Elements',      sub: 'Zero mesh tangling detected after deformation', accent: 'yellow' },
];

export default function QualityTab() {
  const [modal, setModal] = useState(null);

  return (
    <div className={styles.root}>

      <SectionHeader
        title="Mesh Quality Analysis"
        sub="Stein et al. 2003 — area change f_A and shape change f_AR"
      />

      {/* ── Metrics ── */}
      <div className={styles.metricsGrid}>
        {METRICS.map(m => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* ── Quality heatmaps + overlay ── */}
      <div className={styles.twoCol}>
        <Card
          title="Mesh Quality Metrics (Stein et al. 2003)"
          badge={<Badge variant="orange">f_A · f_AR heatmaps</Badge>}
          noPadding
        >
          <div className={styles.imgBody}>
            <ImageFrame
              src="/assets/imga.jpeg"
              alt="Mesh quality metrics — area change and shape change"
              caption="Area Change f_A | Shape Change f_AR"
              onClick={() => setModal({
                src:     '/assets/imga.jpeg',
                caption: 'Mesh Quality Metrics — Area Change f_A and Shape Change f_AR (Stein et al. 2003)',
              })}
              minHeight="280px"
            />
            <div className={styles.metricNote}>
              <div className={styles.noteRow}>
                <span className={styles.noteLabel}>f_A</span>
                <span className={styles.noteText}>
                  Measures how much each triangle's area changed relative to original.
                  Highest near top boundary where deformation is greatest.
                </span>
              </div>
              <div className={styles.noteRow}>
                <span className={styles.noteLabel}>f_AR</span>
                <span className={styles.noteText}>
                  Aspect ratio change. Highest at top corners where shear is concentrated.
                  Low values in the interior confirm good mesh quality.
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Original vs Deformed Overlay"
          badge={<Badge variant="cyan">Full overlay + y-displacement</Badge>}
          noPadding
        >
          <div className={styles.imgBody}>
            <ImageFrame
              src="/assets/imgd.jpeg"
              alt="Mesh overlay and y-displacement field"
              caption="Original (grey) overlaid with deformed (blue)"
              onClick={() => setModal({
                src:     '/assets/imgd.jpeg',
                caption: 'Original vs Deformed Mesh Overlay + y-Displacement Field v(x,y)',
              })}
              minHeight="280px"
            />
          </div>
        </Card>
      </div>

      {/* ── Displacement statistics ── */}
      <Card
        title="Displacement Statistics"
        badge={<Badge variant="cyan">Node distribution across all 3600 nodes</Badge>}
        noPadding
      >
        <div className={styles.imgBody}>
          <ImageFrame
            src="/assets/imgc.jpeg"
            alt="Displacement statistics histograms"
            caption="Distribution of u (x-displacement) and v (y-displacement)"
            onClick={() => setModal({
              src:     '/assets/imgc.jpeg',
              caption: 'Displacement Statistics — Distribution of u and v across all 3600 nodes',
            })}
            minHeight="200px"
          />
          <div className={styles.statsNote}>
            u (x-displacement) is essentially zero for all nodes — the wall only moves vertically.
            v (y-displacement) shows a smooth distribution from 0 down to −0.20, confirming the
            sinusoidal boundary condition is correctly propagated into the interior.
          </div>
        </div>
      </Card>

      <Modal
        src={modal?.src}
        caption={modal?.caption}
        onClose={() => setModal(null)}
      />
    </div>
  );
}