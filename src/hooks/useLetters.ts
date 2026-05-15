import { useState, useEffect, useCallback } from 'react';
import type { Letter, CreateLetterDTO } from '../types/letter';
import { getLetters, saveLetters } from '../utils/storage';
import { generateId } from '../utils/idUtils';

export const useLetters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);

  // Load on mount
  useEffect(() => {
    setLetters(getLetters());
  }, []);

  // Sync to storage
  const syncLetters = useCallback((newLetters: Letter[]) => {
    setLetters(newLetters);
    saveLetters(newLetters);
  }, []);

  const addLetter = useCallback((dto: CreateLetterDTO) => {
    const newLetter: Letter = {
      ...dto,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'locked'
    };
    syncLetters([newLetter, ...letters]);
  }, [letters, syncLetters]);

  const deleteLetter = useCallback((id: string) => {
    syncLetters(letters.filter(l => l.id !== id));
  }, [letters, syncLetters]);

  const updateLetterStatus = useCallback((id: string, status: Letter['status']) => {
    syncLetters(letters.map(l => l.id === id ? { ...l, status } : l));
  }, [letters, syncLetters]);

  return {
    letters,
    addLetter,
    deleteLetter,
    updateLetterStatus
  };
};
