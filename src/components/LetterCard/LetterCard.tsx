import { useState, useEffect } from 'react';
import styles from './LetterCard.module.css';
import type { Letter } from '../../types/letter';
import { useCountdown } from '../../hooks/useCountdown';
import { formatDate } from '../../utils/dateUtils';
import Countdown from '../Countdown/Countdown';
import RevealOverlay from '../RevealOverlay/RevealOverlay';

interface LetterCardProps {
  letter: Letter;
  now: number;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: Letter['status']) => void;
}

const LetterCard = ({ letter, now, onDelete, onStatusUpdate }: LetterCardProps) => {
  const { timeLeft, unlocked } = useCountdown(letter.unlockDate, now);
  const [isRevealing, setIsRevealing] = useState(false);

  // Update status to unlocked automatically when timer hits zero
  useEffect(() => {
    if (unlocked && letter.status === 'locked') {
      onStatusUpdate(letter.id, 'unlocked');
    }
  }, [unlocked, letter.status, letter.id, onStatusUpdate]);

  const handleReveal = () => {
    setIsRevealing(true);
    // After animation delay, set status to revealed
    setTimeout(() => {
      onStatusUpdate(letter.id, 'revealed');
      setIsRevealing(false);
    }, 1200); // Matches animation duration
  };

  const showOverlay = letter.status !== 'revealed';

  return (
    <div className={`${styles.card} ${letter.status === 'revealed' ? styles.revealed : ''}`}>
      <button 
        className={styles.deleteBtn} 
        onClick={() => onDelete(letter.id)}
        aria-label="Delete letter"
      >
        &times;
      </button>

      {showOverlay && (
        <div className={styles.overlayWrapper}>
          {letter.status === 'locked' ? (
            <div className={styles.lockedState}>
              <div className={styles.envelopeIcon}>✉️</div>
              <h3 className={styles.recipient}>For {letter.recipient}</h3>
              <Countdown timeLeft={timeLeft} />
              <p className={styles.dateInfo}>Locked since {formatDate(letter.createdAt)}</p>
            </div>
          ) : (
            <RevealOverlay onComplete={handleReveal} />
          )}
        </div>
      )}

      <div className={`${styles.content} ${isRevealing ? 'animate-reveal' : ''}`}>
        <div className={styles.paper}>
          <header className={styles.header}>
            <span className={styles.date}>{formatDate(letter.createdAt)}</span>
            <span className={styles.to}>To: {letter.recipient}</span>
          </header>
          <div className={styles.body}>
            {letter.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <footer className={styles.footer}>
            <div className={styles.seal}></div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LetterCard;
