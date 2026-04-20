/**
 * meshMath.js
 *
 * Pure functions for canvas-based mesh drawing and wave chart.
 * Zero React, zero state — just math + Canvas 2D API.
 *
 * Exported functions:
 *   drawMesh(ctx, W, H, N, amplitude, tVal, deformed)
 *   drawWave(ctx, W, H, amplitude, tVal)
 *   getNodePos(i, j, N, PAD, cw, ch, amplitude, tVal, deformed)
 *   computeTimeFactor(t)
 *   computeVMax(amplitude, t)
 *   padStep(step)               — "3" → "0003"
 *   stepToTime(step, total)     — step index → normalised t ∈ [0,1]
 *   timeToLabel(t)              — 0.333... → "0.33"
 */

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
export const CANVAS_PAD = 36; // pixels of padding around mesh
export const WAVE_NPTS = 300; // curve resolution for wave chart
export const MESH_SPEED = 0.004; // t increment per animation frame

// Colour palette (matches CSS variables)
export const COLOR = {
    bg: "#010c18",
    gridFaint: "rgba(0,212,255,0.035)",
    axisLabel: "rgba(74,112,144,0.65)",
    meshOrigH: "rgba(160,185,210,0.42)", // original horizontal lines
    meshOrigV: "rgba(160,185,210,0.28)", // original vertical lines
    meshDefV: "rgba(0,150,220,0.28)", // deformed vertical lines
    meshTopLine: "rgba(255,80,80,0.95)", // top BC line (deformed)
    meshTopDot: "rgba(255,80,80,0.95)", // top BC node dots
    zeroLine: "rgba(74,112,144,0.30)",
    ampGuide: "rgba(255,107,53,0.22)",
    waveLine: "rgba(0,212,255,0.92)",
    waveLabel: "rgba(0,212,255,0.75)",
    waveFillTop: "rgba(0,212,255,0.18)",
    waveFillBot: "rgba(255,107,53,0.18)",
};

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

/**
 * Pad step index to 4 digits: 3 → "0003"
 */
export function padStep(step) {
    return String(step).padStart(4, "0");
}

/**
 * Convert step index to normalised time t ∈ [0,1]
 */
export function stepToTime(step, total = 10) {
    return step / total;
}

/**
 * Format t for display: 0.3333 → "0.33"
 */
export function timeToLabel(t) {
    return t.toFixed(2);
}

/**
 * sin(2πt) — the oscillation multiplier used in the BC formula
 */
export function computeTimeFactor(t) {
    return Math.sin(2 * Math.PI * t);
}

/**
 * Maximum top-wall vertical displacement at time t
 *   v_max = −amplitude × sin(2πt)
 */
export function computeVMax(amplitude, t) {
    return -(amplitude * computeTimeFactor(t));
}

// ─────────────────────────────────────────────────────────────────
// MESH NODE POSITION
// ─────────────────────────────────────────────────────────────────

/**
 * getNodePos
 *
 * Returns [px, py] canvas pixel coordinates for grid node (i, j).
 *
 * For the DEFORMED mesh we apply the simplified Laplace-inspired model:
 *   Δy = −A · sin(πξ) · sin(2πt) · η
 * where ξ = i/N, η = j/N.
 * This is linear interpolation in η from zero at the bottom (η=0)
 * to full sinusoidal displacement at the top (η=1) — a good approximation
 * of the Laplace solution for moderate amplitudes.
 *
 * @param {number} i        — column index 0..N
 * @param {number} j        — row index    0..N  (j=N is top)
 * @param {number} N        — grid resolution
 * @param {number} PAD      — canvas padding in px
 * @param {number} cw       — canvas width  minus 2×PAD
 * @param {number} ch       — canvas height minus 2×PAD
 * @param {number} amplitude
 * @param {number} tVal     — current time 0..1
 * @param {boolean} deformed
 * @returns {[number, number]} [px, py]
 */
export function getNodePos(i, j, N, PAD, cw, ch, amplitude, tVal, deformed) {
    const xi = i / N;
    const eta = j / N;
    let y = eta;

    if (deformed) {
        const tf = computeTimeFactor(tVal);
        y = eta + -amplitude * Math.sin(Math.PI * xi) * tf * eta;
    }

    // Canvas y-axis is flipped: η=0 (bottom) → PAD + ch, η=1 (top) → PAD
    return [PAD + xi * cw, PAD + (1 - y) * ch];
}

// ─────────────────────────────────────────────────────────────────
// DRAW MESH
// ─────────────────────────────────────────────────────────────────

/**
 * drawMesh
 *
 * Draws the original or deformed structured mesh onto a Canvas 2D context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W          — canvas pixel width
 * @param {number} H          — canvas pixel height
 * @param {number} N          — grid resolution (lines = N+1)
 * @param {number} amplitude
 * @param {number} tVal       — current time 0..1
 * @param {boolean} deformed  — true → apply displacement model
 */
export function drawMesh(ctx, W, H, N, amplitude, tVal, deformed) {
    const PAD = CANVAS_PAD;
    const cw = W - PAD * 2;
    const ch = H - PAD * 2;

    // ── Background ──
    ctx.fillStyle = COLOR.bg;
    ctx.fillRect(0, 0, W, H);

    // ── Faint background grid ──
    ctx.strokeStyle = COLOR.gridFaint;
    ctx.lineWidth = 1;
    for (let k = 0; k <= 5; k++) {
        const x = PAD + (k / 5) * cw;
        const y = PAD + (k / 5) * ch;
        ctx.beginPath();
        ctx.moveTo(x, PAD);
        ctx.lineTo(x, PAD + ch);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(PAD, y);
        ctx.lineTo(PAD + cw, y);
        ctx.stroke();
    }

    // ── Horizontal lines (constant j) ──
    for (let j = 0; j <= N; j++) {
        const isTop = deformed && j === N;

        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
            const [px, py] = getNodePos(
                i,
                j,
                N,
                PAD,
                cw,
                ch,
                amplitude,
                tVal,
                deformed,
            );
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }

        if (isTop) {
            ctx.strokeStyle = COLOR.meshTopLine;
            ctx.lineWidth = 2;
        } else if (deformed) {
            // Intensity gradient: brighter near top boundary
            const alpha = (0.15 + 0.5 * (j / N)).toFixed(2);
            ctx.strokeStyle = `rgba(0,180,255,${alpha})`;
            ctx.lineWidth = 0.9;
        } else {
            ctx.strokeStyle = COLOR.meshOrigH;
            ctx.lineWidth = 0.9;
        }
        ctx.stroke();
    }

    // ── Vertical lines (constant i) ──
    ctx.lineWidth = 0.9;
    for (let i = 0; i <= N; i++) {
        ctx.beginPath();
        for (let j = 0; j <= N; j++) {
            const [px, py] = getNodePos(
                i,
                j,
                N,
                PAD,
                cw,
                ch,
                amplitude,
                tVal,
                deformed,
            );
            j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = deformed ? COLOR.meshDefV : COLOR.meshOrigV;
        ctx.stroke();
    }

    // ── Top BC node dots (deformed only) ──
    if (deformed) {
        for (let i = 0; i <= N; i++) {
            const [px, py] = getNodePos(
                i,
                N,
                N,
                PAD,
                cw,
                ch,
                amplitude,
                tVal,
                deformed,
            );
            ctx.beginPath();
            ctx.arc(px, py, 2.8, 0, Math.PI * 2);
            ctx.fillStyle = COLOR.meshTopDot;
            ctx.fill();
        }
    }

    // ── Axis labels ──
    ctx.fillStyle = COLOR.axisLabel;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText("0", PAD - 10, H - PAD + 14);
    ctx.fillText("1", PAD + cw - 4, H - PAD + 14);
    ctx.fillText("x", PAD + cw / 2 - 4, H - 10);
    ctx.fillText("0", 6, H - PAD + 4);
    ctx.fillText("1", 6, PAD + 4);
    ctx.fillText("y", 8, PAD + ch / 2);
}

// ─────────────────────────────────────────────────────────────────
// DRAW WAVE CHART
// ─────────────────────────────────────────────────────────────────

/**
 * drawWave
 *
 * Draws the top-boundary displacement profile:
 *   v(x, t) = −amplitude · sin(πx) · sin(2πt)
 * as a filled area + line chart.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 * @param {number} amplitude
 * @param {number} tVal
 */
export function drawWave(ctx, W, H, amplitude, tVal) {
    const PAD = CANVAS_PAD;
    const cw = W - PAD * 2;
    const ch = H - PAD * 2;
    const midY = PAD + ch * 0.5;
    const scaleY = (ch * 0.42) / 0.4; // maps amplitude 0.40 → 42% of chart height
    const tf = computeTimeFactor(tVal);

    // ── Background ──
    ctx.fillStyle = COLOR.bg;
    ctx.fillRect(0, 0, W, H);

    // ── Zero line ──
    ctx.beginPath();
    ctx.moveTo(PAD, midY);
    ctx.lineTo(PAD + cw, midY);
    ctx.strokeStyle = COLOR.zeroLine;
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Amplitude guide lines (dashed) ──
    ctx.setLineDash([4, 4]);
    [1, -1].forEach((sign) => {
        ctx.beginPath();
        ctx.moveTo(PAD, midY - sign * amplitude * scaleY);
        ctx.lineTo(PAD + cw, midY - sign * amplitude * scaleY);
        ctx.strokeStyle = COLOR.ampGuide;
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    ctx.setLineDash([]);

    // ── Filled area ──
    ctx.beginPath();
    ctx.moveTo(PAD, midY);
    for (let i = 0; i <= WAVE_NPTS; i++) {
        const x = i / WAVE_NPTS;
        const v = -amplitude * Math.sin(Math.PI * x) * tf;
        ctx.lineTo(PAD + x * cw, midY - v * scaleY);
    }
    ctx.lineTo(PAD + cw, midY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(
        0,
        midY - amplitude * scaleY,
        0,
        midY + amplitude * scaleY,
    );
    grad.addColorStop(0, COLOR.waveFillTop);
    grad.addColorStop(1, COLOR.waveFillBot);
    ctx.fillStyle = grad;
    ctx.fill();

    // ── Wave line ──
    ctx.beginPath();
    for (let i = 0; i <= WAVE_NPTS; i++) {
        const x = i / WAVE_NPTS;
        const v = -amplitude * Math.sin(Math.PI * x) * tf;
        const px = PAD + x * cw;
        const py = midY - v * scaleY;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = COLOR.waveLine;
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Labels ──
    ctx.fillStyle = COLOR.axisLabel;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText("x = 0", PAD, H - 8);
    ctx.fillText("x = 1", PAD + cw - 32, H - 8);

    ctx.fillStyle = COLOR.waveLabel;
    ctx.fillText(
        `v(x,t) = −${amplitude.toFixed(2)}·sin(πx)·sin(2πt)` +
            `   |   t = ${tVal.toFixed(3)}` +
            `   |   v_max = ${(-amplitude * tf).toFixed(3)}`,
        PAD,
        15,
    );
}
