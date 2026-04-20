import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useTimePlayer
 *
 * Encapsulates all play / pause / step / speed logic for the
 * Deformation Explorer time slider. Keeps DeformationTab.jsx clean.
 *
 * Parameters:
 *   totalSteps  (number)  — total number of steps (default 10)
 *   initialStep (number)  — starting step (default 0)
 *
 * Returns:
 *   step          (number)   — current step index 0..totalSteps
 *   t             (number)   — normalised time  step / totalSteps  ∈ [0,1]
 *   timeFactor    (number)   — sin(2πt) — the oscillation multiplier
 *   vMax          (number)   — −0.20 × timeFactor (top wall displacement)
 *   isPlaying     (bool)
 *   speed         (number)   — interval ms between steps
 *   pct           (number)   — slider fill percentage 0..100
 *
 *   play          ()         — start playback
 *   pause         ()         — stop playback
 *   togglePlay    ()         — toggle
 *   setStep       (n)        — jump to step n (also pauses)
 *   setSpeed      (ms)       — change playback speed
 *   stepForward   ()         — advance one step
 *   stepBackward  ()         — go back one step
 *   reset         ()         — jump to step 0
 */

const AMPLITUDE = 0.2;
const SPEED_OPTIONS = [1400, 800, 400, 200]; // ms

export function useTimePlayer(totalSteps = 10, initialStep = 0) {
    const [step, setStepState] = useState(initialStep);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);

    const intervalRef = useRef(null);

    // Derived values
    const t = step / totalSteps;
    const timeFactor = Math.sin(2 * Math.PI * t);
    const vMax = -(AMPLITUDE * timeFactor);
    const pct = (step / totalSteps) * 100;

    // Internal tick — advances step by 1, loops back to 0
    const tick = useCallback(() => {
        setStepState((s) => (s >= totalSteps ? 0 : s + 1));
    }, [totalSteps]);

    // Start / stop interval whenever isPlaying or speed changes
    useEffect(() => {
        clearInterval(intervalRef.current);
        if (isPlaying) {
            intervalRef.current = setInterval(tick, speed);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, speed, tick]);

    // Public controls
    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);
    const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

    const setStep = useCallback(
        (n) => {
            // Clamp and pause when user manually drags slider
            const clamped = Math.max(0, Math.min(totalSteps, Number(n)));
            setIsPlaying(false);
            setStepState(clamped);
        },
        [totalSteps],
    );

    const stepForward = useCallback(() => {
        setIsPlaying(false);
        setStepState((s) => Math.min(totalSteps, s + 1));
    }, [totalSteps]);

    const stepBackward = useCallback(() => {
        setIsPlaying(false);
        setStepState((s) => Math.max(0, s - 1));
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        setStepState(0);
    }, []);

    // Expose speed options so the UI doesn't need to define them
    const changeSpeed = useCallback((ms) => {
        if (!SPEED_OPTIONS.includes(ms)) {
            console.warn(`[useTimePlayer] Invalid speed: ${ms}ms`);
            return;
        }
        setSpeed(ms);
    }, []);

    return {
        // State
        step,
        t,
        timeFactor,
        vMax,
        isPlaying,
        speed,
        pct,
        totalSteps,
        // Controls
        play,
        pause,
        togglePlay,
        setStep,
        setSpeed: changeSpeed,
        stepForward,
        stepBackward,
        reset,
        // Constants exposed for convenience
        SPEED_OPTIONS,
        AMPLITUDE,
    };
}
