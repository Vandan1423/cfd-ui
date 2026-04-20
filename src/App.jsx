import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import Footer from "./components/Footer";

// Tabs (imported lazily so unused tabs don't block initial paint)
import OverviewTab from "./components/tabs/OverviewTab";
import PipelineTab from "./components/tabs/PipelineTab";
import DeformationTab from "./components/tabs/DeformationTab";
import QualityTab from "./components/tabs/QualityTab";
import AlgorithmTab from "./components/tabs/AlgorithmTab";
import LiveSimTab from "./components/tabs/LiveSimTab";
import { useTabState } from "./hooks/useTabState";

import styles from "./App.module.css";

const TAB_MAP = {
    overview: <OverviewTab />,
    pipeline: <PipelineTab />,
    deformation: <DeformationTab />,
    quality: <QualityTab />,
    algorithm: <AlgorithmTab />,
    live: <LiveSimTab />,
};

export default function App() {
    const { activeTab, setTab } = useTabState();

    return (
        <div className={styles.app}>
            <Header />

            <NavTabs activeTab={activeTab} onTabChange={setTab} />

            <main className={styles.main}>
                {/* 
          Render all panels but only show the active one.
          This keeps live canvas state alive when switching tabs.
        */}
                {Object.entries(TAB_MAP).map(([id, panel]) => (
                    <div
                        key={id}
                        id={`panel-${id}`}
                        role="tabpanel"
                        aria-labelledby={id}
                        className={`${styles.tabPanel} ${activeTab === id ? styles.tabPanelActive : ""}`}
                    >
                        {panel}
                    </div>
                ))}
            </main>

            <Footer />
        </div>
    );
}
