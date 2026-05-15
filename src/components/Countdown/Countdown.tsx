import styles from './Countdown.module.css';

interface CountdownProps {
  timeLeft: string;
}

const Countdown = ({ timeLeft }: CountdownProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Unlocking in</span>
      <span className={styles.timer}>{timeLeft}</span>
    </div>
  );
};

export default Countdown;
