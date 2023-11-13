import React, { useState, useEffect } from 'react';

type useTimeoutReturn = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  number,
];

export const useTimeout = (time: number): useTimeoutReturn => {
  const [isCoolingOffPeriod, setIsCoolingOffPeriod] = useState<boolean>(false);
  const [coolingOffPeriod, setCoolingOffPeriod] = useState<number>(time);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isCoolingOffPeriod) {
      timer = setInterval(() => {
        setCoolingOffPeriod(prev => prev - 1);
      }, 1000);
    }

    if (!coolingOffPeriod && timer) {
      clearInterval(timer);
      setCoolingOffPeriod(time);
      setIsCoolingOffPeriod(false);
    }

    return () => clearInterval(timer);
  }, [isCoolingOffPeriod, coolingOffPeriod]);

  return [isCoolingOffPeriod, setIsCoolingOffPeriod, coolingOffPeriod];
};
