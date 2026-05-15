import type { Letter } from '../types/letter';

const STORAGE_KEY = 'time_locked_letters';

export const saveLetters = (letters: Letter[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getLetters = (): Letter[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return [];
  }
};
