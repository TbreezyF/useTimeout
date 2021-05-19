import { useState, useRef, useEffect } from "react";

export const useTimeout = (cb, timeoutDelayMs) => {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [timerId, setTimerId] = useState();
  const [startTime, setStartTime] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const savedRefCallback = useRef();

  useEffect(() => {
    savedRefCallback.current = cb;
  }, [cb]);

  const callback = () => {
    savedRefCallback.current && savedRefCallback.current();
    stopTimeout();
  };

  const startTimeout = () => {
    setIsTimeoutActive(true);
  };

  const stopTimeout = () => {
    setIsTimeoutActive(false);
  };

  const pauseTimeout = () => {
    stopTimeout();

    setRemainingTime(-(Date.now() - startTime));
  };

  const resumeTimeout = () => {
    startTimeout();
  };

  useEffect(() => {
    if (isTimeoutActive) {
      setStartTime(Date.now());

      setTimerId(setTimeout(callback, remainingTime ?? timeoutDelayMs));

      return () => {
        clearTimeout(timerId);
      };
    } else if (!isTimeoutActive && timerId) {
      clearTimeout(timerId);
    }
  }, [isTimeoutActive, timeoutDelayMs]);

  return {
    stopTimeout,
    startTimeout,
    pauseTimeout,
    resumeTimeout,
    isActive: isTimeoutActive,
  };
};
