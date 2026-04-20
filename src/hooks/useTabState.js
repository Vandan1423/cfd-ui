import { useState, useCallback } from "react";

/**
 * useTabState
 *
 * Manages the active tab ID with optional persistence in sessionStorage
 * so the tab survives a hot-reload during development.
 *
 * Returns:
 *   activeTab   (string)   — current tab id
 *   setTab      (fn)       — change active tab
 *   isActive    (fn)       — boolean helper: isActive('overview')
 */

const VALID_TABS = [
    "overview",
    "pipeline",
    "deformation",
    "quality",
    "algorithm",
    "live",
];

const STORAGE_KEY = "pinn_dashboard_tab";

function getInitialTab(defaultTab) {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored && VALID_TABS.includes(stored)) return stored;
    } catch {
        // sessionStorage unavailable (private browsing etc.) — silently ignore
    }
    return defaultTab;
}

export function useTabState(defaultTab = "overview") {
    const [activeTab, setActiveTab] = useState(() => getInitialTab(defaultTab));

    const setTab = useCallback((tabId) => {
        if (!VALID_TABS.includes(tabId)) {
            console.warn(`[useTabState] Unknown tab id: "${tabId}"`);
            return;
        }
        setActiveTab(tabId);
        try {
            sessionStorage.setItem(STORAGE_KEY, tabId);
        } catch {
            // ignore
        }
    }, []);

    const isActive = useCallback((tabId) => activeTab === tabId, [activeTab]);

    return { activeTab, setTab, isActive };
}
