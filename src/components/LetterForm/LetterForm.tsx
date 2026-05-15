import { useState } from 'react';
import styles from './LetterForm.module.css';
import type { CreateLetterDTO } from '../../types/letter';

interface LetterFormProps {
  onSubmit: (dto: CreateLetterDTO) => void;
  onClose: () => void;
}

const LetterForm = ({ onSubmit, onClose }: LetterFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !content || !unlockDate) return;
    
    onSubmit({
      recipient,
      content,
      unlockDate: new Date(unlockDate).toISOString(),
    });
  };

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() + 1); // Minimum 1 minute in the future
  const minDateStr = minDate.toISOString().slice(0, 16);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>Seal a New Letter</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="recipient">To Whom?</label>
            <input
              id="recipient"
              type="text"
              placeholder="A name, or 'My Future Self'"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="content">The Message</label>
            <textarea
              id="content"
              placeholder="What must wait to be said?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="unlockDate">Unlock Date & Time</label>
            <input
              id="unlockDate"
              type="datetime-local"
              min={minDateStr}
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submit}>
            Seal with Wax
          </button>
        </form>
      </div>
    </div>
  );
};

export default LetterForm;
