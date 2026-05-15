import styles from './DeleteConfirm.module.css';

interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirm = ({ onConfirm, onCancel }: DeleteConfirmProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Destroy this letter?</h3>
        <p className={styles.message}>
          This action cannot be undone. The words will be lost to time forever.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Keep it
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Destroy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
