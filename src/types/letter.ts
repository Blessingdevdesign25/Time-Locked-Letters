export type LetterStatus = 'locked' | 'unlocked' | 'revealed';

export interface Letter {
  id: string;
  recipient: string;
  content: string;
  unlockDate: string; // ISO string
  createdAt: string; // ISO string
  status: LetterStatus;
}

export interface CreateLetterDTO {
  recipient: string;
  content: string;
  unlockDate: string;
}
