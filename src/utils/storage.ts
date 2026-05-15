import type { Letter } from '../types/letter';

const STORAGE_KEY = 'time_locked_letters';

export const saveLetters = (letters: Letter[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

export const getLetters = (): Letter[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
