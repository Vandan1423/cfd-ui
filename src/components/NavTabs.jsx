import { useRef, useEffect } from 'react';
import styles from './NavTabs.module.css';

const TABS = [
  { id: 'overview',    icon: '⬡', label: 'Overview'            },
  { id: 'pipeline',    icon: '⟶', label: 'Pipeline'            },
  { id: 'deformation', icon: '◈', label: 'Deformation Explorer' },
  { id: 'quality',     icon: '◎', label: 'Mesh Quality'         },
  { id: 'algorithm',   icon: '∇', label: 'PINN Algorithm'       },
  { id: 'live',        icon: '▶', label: 'Live Simulation'      },
];

export default function NavTabs({ activeTab, onTabChange }) {
  const indicatorRef = useRef(null);
  const navRef       = useRef(null);
  const btnRefs      = useRef({});

  // Move the sliding indicator under the active tab
  useEffect(() => {
    const activeBtn = btnRefs.current[activeTab];
    const indicator = indicatorRef.current;
    const nav       = navRef.current;
    if (!activeBtn || !indicator || !nav) return;

    const btnRect = activeBtn.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    indicator.style.width  = `${btnRect.width}px`;
    indicator.style.left   = `${btnRect.left - navRect.left + nav.scrollLeft}px`;
  }, [activeTab]);

  return (
    <nav className={styles.nav} ref={navRef}>
      {/* Sliding active indicator */}
      <div className={styles.indicator} ref={indicatorRef} />

      <div className={styles.tabList} role="tablist">
        {TABS.map(({ id, icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              ref={el => (btnRefs.current[id] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${id}`}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => onTabChange(id)}
            >
              <span className={styles.tabIcon} aria-hidden="true">
                {icon}
              </span>
              <span className={styles.tabLabel}>{label}</span>

              {/* Per-tab glow dot — only on active */}
              {isActive && <span className={styles.activeDot} />}
            </button>
          );
        })}
      </div>

      {/* Right-side fade for overflow scroll hint */}
      <div className={styles.fadeRight} aria-hidden="true" />
    </nav>
  );
}

// Export tab list so other files can reference IDs without duplication
export { TABS };