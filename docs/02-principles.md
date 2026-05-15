# 🏗 Engineering Principles in Time-Locked Letters

This document identifies the core software engineering principles applied in this project and highlights the specific lines of code that implement them.

---

## 1. Persistence
**Principle**: Ensuring data survives page refreshes and browser restarts.

*   **Implementation**: [storage.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/utils/storage.ts)
    ```typescript
    // Line 6-8: Writing to the permanent "box"
    export const saveLetters = (letters: Letter[]): void => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    };

    // Line 10-13: Reading from the "box"
    export const getLetters = (): Letter[] => {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    };
    ```

---

## 2. Side Effects Management
**Principle**: Handling operations that "reach outside" the component (timers, storage, API calls) in a controlled way.

*   **Implementation**: [useNow.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/hooks/useNow.ts) (External Ticker)
    ```typescript
    // Line 6-12: Managing a global side effect (browser timer)
    useEffect(() => {
      const timer = setInterval(() => {
        setNow(Date.now());
      }, interval);

      return () => clearInterval(timer); // Cleanup is crucial!
    }, [interval]);
    ```

*   **Implementation**: [useLetters.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/hooks/useLetters.ts) (Data Sync)
    ```typescript
    // Line 10-12: Side effect to load data on mount
    useEffect(() => {
      setLetters(getLetters());
    }, []);
    ```

---

## 3. Single Source of Truth (SSOT)
**Principle**: Maintaining one master copy of data to prevent inconsistencies.

*   **Implementation**: [useLetters.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/hooks/useLetters.ts)
    ```typescript
    // Line 7: The ONE master list of letters for the whole app
    const [letters, setLetters] = useState<Letter[]>([]);
    ```
    *All other components receive this data or callbacks to modify it, ensuring there is never a "second copy" that might get out of sync.*

---

## 4. Derived State
**Principle**: Calculating values from existing state rather than storing them separately. This prevents "State Explosion" and bugs.

*   **Implementation**: [useCountdown.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/hooks/useCountdown.ts)
    ```typescript
    // Line 7-10: 'timeLeft' and 'unlocked' are derived from 'unlockDate' and 'now'
    const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(unlockDate));
    const [unlocked, setUnlocked] = useState(isUnlocked(unlockDate));
    ```
    *Instead of storing `unlocked` as a static value in the letter object (which would grow stale), we calculate it dynamically every time the clock ticks.*

---

## 5. Unidirectional Data Flow
**Principle**: Data flows "down" (Props), and actions flow "up" (Callbacks).

*   **Implementation**: [App.tsx](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/App.tsx)
    ```typescript
    // Line 50-57: App passes data (letter) DOWN and callbacks (onDelete) UP
    <LetterCard
      key={letter.id}
      letter={letter}
      now={now}
      onDelete={(id) => setLetterToDelete(id)}
      onStatusUpdate={updateLetterStatus}
    />
    ```

---

## 6. Separation of Concerns (SoC)
**Principle**: Dividing the program into distinct sections, each addressing a separate concern.

*   **Implementation**: Directory Structure
    - `utils/`: Pure logic (Date math, ID generation). No React knowledge.
    - `hooks/`: State logic. No UI knowledge.
    - `components/`: UI/Layout. Doesn't care *how* letters are saved.

---

## 7. Atomic Synchronization
**Principle**: Updating the UI and the persistence layer simultaneously so they never disagree.

*   **Implementation**: [useLetters.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/hooks/useLetters.ts)
    ```typescript
    // Line 15-18: Atomic update
    const syncLetters = useCallback((newLetters: Letter[]) => {
      setLetters(newLetters); // Update React State
      saveLetters(newLetters); // Update localStorage
    }, []);
    ```
