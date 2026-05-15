import { useState, useEffect } from 'react';
import { formatTimeRemaining, isUnlocked } from '../utils/dateUtils';

export const useCountdown = (unlockDate: string, now: number) => {
  const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(unlockDate));
  const [unlocked, setUnlocked] = useState(isUnlocked(unlockDate));

  useEffect(() => {
    setTimeLeft(formatTimeRemaining(unlockDate));
    setUnlocked(isUnlocked(unlockDate));
  }, [unlockDate, now]);

  return { timeLeft, unlocked };
};
