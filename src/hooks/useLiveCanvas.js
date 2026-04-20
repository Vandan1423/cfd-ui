import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useLiveCanvas
 *
 * Drives the three canvas elements in LiveSimTab:
 *   - Original mesh (static grid, redrawn only on res change)
 *   - Deformed mesh (redrawn every animation frame)
 *   - Wave chart    (redrawn every animation frame)
 *
 * Parameters:
 *   initialAmp (number) — starting amplitude  (default 0.20)
 *   initialRes (number) — starting resolution (default 20)
 *
 * Returns:
 *   canvasOrigRef  (ref)    — attach to original mesh <canvas>
 *   canvasDefRef   (ref)    — attach to deformed mesh <canvas>
 *   canvasWaveRef  (ref)    — attach to wave chart <canvas>
 *   amp            (number)
 *   res            (number)
 *   t              (number) — current animation time 0..1
 *   isPlaying      (bool)
 *   setAmp         (fn)
 *   setRes         (fn)
 *   togglePlay     (fn)
 */

export function useLiveCanvas(initialAmp = 0.2, initialRes = 20) {
    const [amp, setAmp] = useState(initialAmp);
    const [res, setRes] = useState(initialRes);
    const [isPlaying, setIsPlaying] = useState(false);
    const [t, setT] = useState(0);

    // Stable refs so draw functions never go stale inside rAF
    const canvasOrigRef = useRef(null);
    const canvasDefRef = useRef(null);
    const canvasWaveRef = useRef(null);
    const animRef = useRef(null);
    const tRef = useRef(0);
    const ampRef = useRef(amp);
    const resRef = useRef(res);

    useEffect(() => {
        ampRef.current = amp;
    }, [amp]);
    useEffect(() => {
        resRef.current = res;
    }, [res]);

    /* ════════════════════════════════════════
     DRAW — Original / Deformed mesh
  ════════════════════════════════════════ */
    const drawMesh = useCallback((canvas, deformed, tVal) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.offsetWidth || 460;
        const H = canvas.offsetHeight || 360;
        canvas.width = W;
        canvas.height = H;

        const PAD = 36;
        const cw = W - PAD * 2;
        const ch = H - PAD * 2;
        const N = resRef.current;
        const A = ampRef.current;

        // Background
        ctx.fillStyle = "#010c18";
        ctx.fillRect(0, 0, W, H);

        // Faint background grid lines
        ctx.strokeStyle = "rgba(0,212,255,0.035)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const x = PAD + (i / 5) * cw;
            const y = PAD + (i / 5) * ch;
            ctx.beginPath();
            ctx.moveTo(x, PAD);
            ctx.lineTo(x, PAD + ch);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(PAD, y);
            ctx.lineTo(PAD + cw, y);
            ctx.stroke();
        }

        // Node position function
        // Deformed: Laplace-inspired smooth mapping — displacement decays linearly
        // from top (eta=1, full amplitude) to bottom (eta=0, zero displacement)
        const nodePos = (i, j) => {
            const xi = i / N;
            const eta = j / N;
            let y = eta;
            if (deformed) {
                const tf = Math.sin(2 * Math.PI * tVal);
                y = eta + -A * Math.sin(Math.PI * xi) * tf * eta;
            }
            return [PAD + xi * cw, PAD + (1 - y) * ch];
        };

        // ── Horizontal lines (constant j = row) ──
        for (let j = 0; j <= N; j++) {
            const isTop = deformed && j === N;
            ctx.beginPath();
            for (let i = 0; i <= N; i++) {
                const [px, py] = nodePos(i, j);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            if (isTop) {
                ctx.strokeStyle = "rgba(255,80,80,0.95)";
                ctx.lineWidth = 2;
            } else if (deformed) {
                // Colour intensity grows toward top — highlights deformation gradient
                const alpha = 0.15 + 0.5 * (j / N);
                ctx.strokeStyle = `rgba(0,180,255,${alpha.toFixed(2)})`;
                ctx.lineWidth = 0.9;
            } else {
                ctx.strokeStyle = "rgba(160,185,210,0.42)";
                ctx.lineWidth = 0.9;
            }
            ctx.stroke();
        }

        // ── Vertical lines (constant i = column) ──
        ctx.lineWidth = 0.9;
        for (let i = 0; i <= N; i++) {
            ctx.beginPath();
            for (let j = 0; j <= N; j++) {
                const [px, py] = nodePos(i, j);
                j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.strokeStyle = deformed
                ? "rgba(0,150,220,0.28)"
                : "rgba(160,185,210,0.28)";
            ctx.stroke();
        }

        // ── Top BC node dots (deformed only) ──
        if (deformed) {
            for (let i = 0; i <= N; i++) {
                const [px, py] = nodePos(i, N);
                ctx.beginPath();
                ctx.arc(px, py, 2.8, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,80,80,0.95)";
                ctx.fill();
            }
        }

        // ── Axis labels ──
        ctx.fillStyle = "rgba(74,112,144,0.65)";
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText("0", PAD - 10, H - PAD + 14);
        ctx.fillText("1", PAD + cw - 4, H - PAD + 14);
        ctx.fillText("x", PAD + cw / 2 - 4, H - 10);
        ctx.fillText("0", 6, H - PAD + 4);
        ctx.fillText("1", 6, PAD + 4);
        ctx.fillText("y", 8, PAD + ch / 2);
    }, []);

    /* ════════════════════════════════════════
     DRAW — Wave chart
  ════════════════════════════════════════ */
    const drawWave = useCallback((canvas, tVal) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.offsetWidth || 800;
        const H = canvas.offsetHeight || 180;
        canvas.width = W;
        canvas.height = H;

        const PAD = 36;
        const cw = W - PAD * 2;
        const ch = H - PAD * 2;
        const midY = PAD + ch * 0.5;
        const scaleY = (ch * 0.42) / 0.4;
        const A = ampRef.current;
        const tf = Math.sin(2 * Math.PI * tVal);

        ctx.fillStyle = "#010c18";
        ctx.fillRect(0, 0, W, H);

        // Zero line
        ctx.beginPath();
        ctx.moveTo(PAD, midY);
        ctx.lineTo(PAD + cw, midY);
        ctx.strokeStyle = "rgba(74,112,144,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Amplitude guides
        ctx.setLineDash([4, 4]);
        [1, -1].forEach((sign) => {
            ctx.beginPath();
            ctx.moveTo(PAD, midY - sign * A * scaleY);
            ctx.lineTo(PAD + cw, midY - sign * A * scaleY);
            ctx.strokeStyle = "rgba(255,107,53,0.22)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Filled area under wave
        const NPTS = 300;
        ctx.beginPath();
        ctx.moveTo(PAD, midY);
        for (let i = 0; i <= NPTS; i++) {
            const x = i / NPTS;
            const v = -A * Math.sin(Math.PI * x) * tf;
            ctx.lineTo(PAD + x * cw, midY - v * scaleY);
        }
        ctx.lineTo(PAD + cw, midY);
        ctx.closePath();
        const grad = ctx.createLinearGradient(
            0,
            midY - A * scaleY,
            0,
            midY + A * scaleY,
        );
        grad.addColorStop(0, "rgba(0,212,255,0.18)");
        grad.addColorStop(1, "rgba(255,107,53,0.18)");
        ctx.fillStyle = grad;
        ctx.fill();

        // Wave line
        ctx.beginPath();
        for (let i = 0; i <= NPTS; i++) {
            const x = i / NPTS;
            const v = -A * Math.sin(Math.PI * x) * tf;
            const px = PAD + x * cw;
            const py = midY - v * scaleY;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(0,212,255,0.92)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = "rgba(74,112,144,0.65)";
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText("x = 0", PAD, H - 8);
        ctx.fillText("x = 1", PAD + cw - 32, H - 8);
        ctx.fillStyle = "rgba(0,212,255,0.75)";
        ctx.fillText(
            `v(x,t) = −${A.toFixed(2)}·sin(πx)·sin(2πt)   |   t = ${tVal.toFixed(3)}   |   v_max = ${(-A * tf).toFixed(3)}`,
            PAD,
            15,
        );
    }, []);

    /* ════════════════════════════════════════
     Full redraw (all 3 canvases)
  ════════════════════════════════════════ */
    const redraw = useCallback(
        (tVal) => {
            drawMesh(canvasOrigRef.current, false, tVal);
            drawMesh(canvasDefRef.current, true, tVal);
            drawWave(canvasWaveRef.current, tVal);
        },
        [drawMesh, drawWave],
    );

    // Redraw on amp / res change (not during animation — rAF handles that)
    useEffect(() => {
        if (!isPlaying) redraw(tRef.current);
    }, [amp, res, isPlaying, redraw]);

    /* ════════════════════════════════════════
     Animation loop (requestAnimationFrame)
  ════════════════════════════════════════ */
    useEffect(() => {
        if (!isPlaying) {
            cancelAnimationFrame(animRef.current);
            return;
        }
        const loop = () => {
            tRef.current = (tRef.current + 0.004) % 1;
            setT(tRef.current);
            redraw(tRef.current);
            animRef.current = requestAnimationFrame(loop);
        };
        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, [isPlaying, redraw]);

    /* ════════════════════════════════════════
     ResizeObserver — redraws canvases when
     the panel resizes (e.g. window resize)
  ════════════════════════════════════════ */
    useEffect(() => {
        const obs = new ResizeObserver(() => {
            if (!isPlaying) redraw(tRef.current);
        });
        const el = canvasOrigRef.current?.parentElement;
        if (el) obs.observe(el);
        return () => obs.disconnect();
    }, [isPlaying, redraw]);

    // Initial draw on mount
    useEffect(() => {
        redraw(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

    return {
        // Refs — attach directly to <canvas> elements
        canvasOrigRef,
        canvasDefRef,
        canvasWaveRef,
        // State
        amp,
        res,
        t,
        isPlaying,
        // Setters
        setAmp,
        setRes,
        togglePlay,
    };
}
