import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>✉️</div>
      <h2 className={styles.title}>No letters waiting...</h2>
      <p className={styles.description}>
        The future is a blank page. Write a letter to your future self or a friend, and lock it away until the right moment.
      </p>
      <button className={styles.button} onClick={onCreateClick}>
        Write Your First Letter
      </button>
    </div>
  );
};

export default EmptyState;
