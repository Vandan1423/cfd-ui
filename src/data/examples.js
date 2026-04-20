/**
 * examples.js
 *
 * Config for the example selector in DeformationTab.
 * When you run the code for Example 2, 3 etc., add a new entry
 * here and set ready: true — the UI will unlock it automatically.
 *
 * Shape:
 *   {
 *     id          (number)   — index used for state comparison
 *     label       (string)   — button label e.g. "Example 2"
 *     desc        (string)   — short descriptor shown on button
 *     ready       (bool)     — false = greyed out / disabled
 *     totalSteps  (number)   — how many timestep images exist (default 10)
 *     amplitude   (number)   — amplitude used when running the solver
 *     bcFormula   (string)   — human-readable BC formula for display
 *     assetDir    (string)   — subfolder inside public/assets/timesteps/
 *                              e.g. 'example1' → /assets/timesteps/example1/step_0000/deformed_mesh.png
 *     originalImg (string)   — path to the reference (undeformed) mesh image
 *     overviewImg (string)   — path to the static overview/displacement image
 *     notes       (string)   — optional extra description shown in the UI
 *   }
 */

export const EXAMPLES = [
    {
        id: 0,
        label: "Example 1",
        desc: "Sine Wave BC",
        ready: true,
        totalSteps: 10,
        amplitude: 0.2,
        bcFormula: "v(x,t) = −0.20·sin(πx)·sin(2πt)",
        assetDir: "", // empty = root of timesteps/ (backward compatible)
        originalImg: "/assets/Mapped_Grid.jpeg",
        overviewImg: "/assets/imgb.jpeg",
        notes:
            "Standard sinusoidal top-wall deformation. Amplitude 0.20. " +
            "One full oscillation over T=1.0. Zero inverted triangles.",
    },

    // ── Add Example 2 here when ready ─────────────────────────────
    // {
    //   id:         1,
    //   label:      'Example 2',
    //   desc:       'Double Frequency BC',
    //   ready:      true,
    //   totalSteps: 10,
    //   amplitude:  0.15,
    //   bcFormula:  'v(x,t) = −0.15·sin(2πx)·sin(2πt)',
    //   assetDir:   'example2',
    //   originalImg: '/assets/Mapped_Grid.jpeg',
    //   overviewImg: '/assets/example2_overview.jpeg',
    //   notes: 'Double spatial frequency — two sine lobes on the top wall.',
    // },

    {
        id: 1,
        label: "Example 2",
        desc: "Coming Soon",
        ready: false,
        totalSteps: 10,
        amplitude: 0.15,
        bcFormula: "TBD",
        assetDir: "example2",
        originalImg: "/assets/Mapped_Grid.jpeg",
        overviewImg: "",
        notes: "",
    },

    {
        id: 2,
        label: "Example 3",
        desc: "Coming Soon",
        ready: false,
        totalSteps: 10,
        amplitude: 0.3,
        bcFormula: "TBD",
        assetDir: "example3",
        originalImg: "/assets/Mapped_Grid.jpeg",
        overviewImg: "",
        notes: "",
    },
];

/**
 * getExampleImagePath
 *
 * Returns the correct path to a timestep image for a given example and step.
 *
 * @param {object} example — one entry from EXAMPLES
 * @param {number} step    — 0..totalSteps
 * @returns {string} image src path
 */
export function getExampleImagePath(example, step) {
    const padded = String(step).padStart(4, "0");
    const dir = example.assetDir
        ? `/assets/timesteps/${example.assetDir}/step_${padded}`
        : `/assets/timesteps/step_${padded}`;
    return `${dir}/deformed_mesh.png`;
}
