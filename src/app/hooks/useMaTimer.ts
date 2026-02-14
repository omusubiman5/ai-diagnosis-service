'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type MaPhase = 'inactive' | 'waiting' | 'gentle' | 'encourage' | 'tap_choices';

interface UseMaTimerOptions {
  gentleDelay?: number;    // ms until gentle prompt (default 3000)
  encourageDelay?: number; // ms until encourage prompt (default 8000)
  tapChoicesDelay?: number; // ms until tap choices appear (default 15000)
  onPhaseChange?: (phase: MaPhase) => void;
}

export const useMaTimer = (options: UseMaTimerOptions = {}) => {
  const {
    gentleDelay = 3000,
    encourageDelay = 8000,
    tapChoicesDelay = 15000,
    onPhaseChange,
  } = options;

  const [phase, setPhase] = useState<MaPhase>('inactive');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const updatePhase = useCallback((newPhase: MaPhase) => {
    setPhase(newPhase);
    onPhaseChangeRef.current?.(newPhase);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    updatePhase('waiting');

    // 3s: gentle prompt
    timersRef.current.push(
      setTimeout(() => updatePhase('gentle'), gentleDelay)
    );

    // 8s: encourage prompt
    timersRef.current.push(
      setTimeout(() => updatePhase('encourage'), encourageDelay)
    );

    // 15s: show tap choices
    timersRef.current.push(
      setTimeout(() => updatePhase('tap_choices'), tapChoicesDelay)
    );
  }, [clearTimers, updatePhase, gentleDelay, encourageDelay, tapChoicesDelay]);

  const reset = useCallback(() => {
    clearTimers();
    updatePhase('waiting');

    timersRef.current.push(
      setTimeout(() => updatePhase('gentle'), gentleDelay)
    );
    timersRef.current.push(
      setTimeout(() => updatePhase('encourage'), encourageDelay)
    );
    timersRef.current.push(
      setTimeout(() => updatePhase('tap_choices'), tapChoicesDelay)
    );
  }, [clearTimers, updatePhase, gentleDelay, encourageDelay, tapChoicesDelay]);

  const stop = useCallback(() => {
    clearTimers();
    updatePhase('inactive');
  }, [clearTimers, updatePhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return { start, reset, stop, phase };
};
