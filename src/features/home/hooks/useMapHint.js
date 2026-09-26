import { useState, useRef, useEffect, useCallback } from "react";

export function useMapHint() {
    const [showHint, setShowHint] = useState(false);
    const [hintKey, setHintKey] = useState(0);
    const hintDismissedRef = useRef(false);
    const hintInitTimerRef = useRef(null);
    const hintHideTimerRef = useRef(null);
    const hintIntervalRef = useRef(null);

    const stopHintTimers = useCallback(() => {
        clearTimeout(hintInitTimerRef.current);
        clearTimeout(hintHideTimerRef.current);
        clearInterval(hintIntervalRef.current);
    }, []);

    const dismissHint = useCallback(() => {
        if (!hintDismissedRef.current) {
            hintDismissedRef.current = true;
            setShowHint(false);
            stopHintTimers();
        }
    }, [stopHintTimers]);

    const triggerHintCycle = useCallback(() => {
        if (hintDismissedRef.current) return;
        setHintKey((k) => k + 1);
        setShowHint(true);
        hintHideTimerRef.current = setTimeout(() => {
            setShowHint(false);
        }, 4000);
    }, []);

    useEffect(() => {
        hintInitTimerRef.current = setTimeout(() => {
            if (!hintDismissedRef.current) {
                triggerHintCycle();
                hintIntervalRef.current = setInterval(() => {
                    if (!hintDismissedRef.current) triggerHintCycle();
                }, 14000);
            }
        }, 4000);

        return () => stopHintTimers();
    }, [triggerHintCycle, stopHintTimers]);

    return {
        showHint,
        hintKey,
        dismissHint
    };
}
