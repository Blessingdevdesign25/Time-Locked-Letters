import styles from './RevealOverlay.module.css';

interface RevealOverlayProps {
  onComplete: () => void;
}

const RevealOverlay = ({ onComplete }: RevealOverlayProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.waxSealContainer}>
        <div className={styles.waxSeal}>
          <span className={styles.sealIcon}>⌛</span>
        </div>
        <h2 className={styles.title}>The time has come...</h2>
        <button className={styles.button} onClick={onComplete}>
          Open Letter
        </button>
      </div>
    </div>
  );
};

export default RevealOverlay;
