# 🧪 Tinker Test: Live Observation of the Unlock Transition

**Date**: 2026-05-15
**Test**: Create a letter unlocking 1-minute in the future, predict behavior, observe, and document gaps.

---

## Setup

Used Playwright (Chromium, headed) to open the dev server at `localhost:5173`.

- Created letter with recipient "Future Self", content "Hello from the past! This is a test letter to observe the unlock transition."
- Unlock date set to 1 minute in the future.
- Verified initial state: envelope icon visible, countdown showed `00m 51s`, status `locked`.

---

## Prediction (written before the minute elapsed)

1. Countdown will show `00:00:00`.
2. `useCountdown` returns `unlocked: true`.
3. `useEffect` in LetterCard fires `onStatusUpdate(letter.id, "unlocked")`.
4. Locked state overlay (envelope icon, countdown, "Locked since...") disappears.
5. RevealOverlay appears with hourglass icon and "The time has come...".
6. Wax seal animation container is visible.
7. Actual letter content remains hidden behind the overlay.
8. Letter's status transitions `locked → unlocked` in localStorage.

---

## Reality (what actually happened)

All items tracked correctly — the `useEffect` fired, overlay swapped, and the "Open Letter" button appeared. After clicking it, the content was revealed and status saved as `revealed`.

**However, 5 gaps were found between prediction and reality:**

---

### Gap 1: Countdown Never Visibly Shows `00:00:00`

**Prediction**: "The countdown will show `00:00:00`."

**Reality**: The countdown *never* displays `00:00:00` as visible text on screen.

Here is the precise sequence at the unlock boundary:

1. `useNow` fires at `t = unlockTimestamp + 0ms` → `diff = 0`
2. `formatTimeRemaining` hits `if (diff <= 0) return '00:00:00'`
3. `useCountdown` re-renders with both `timeLeft: "00:00:00"` **and** `unlocked: true`
4. LetterCard's `useEffect` fires immediately after render: calls `onStatusUpdate(id, "unlocked")`
5. React re-renders: `letter.status` is now `"unlocked"`, so the `lockedState` branch (which contains `<Countdown>`) is replaced by `<RevealOverlay>`
6. The `<Countdown>` DOM node displaying `00:00:00` is unmounted before the next paint

**Root cause**: `formatTimeRemaining` and `isUnlocked` share the same `diff` calculation and change simultaneously. When one says "time's up", so does the other. The component tree changes on the same render cycle, removing the `<span>` that would display `00:00:00`.

**Impact**: Cosmetic only. The user sees the locked state switch directly to the reveal overlay without ever seeing a "zero" countdown.

---

### Gap 2: Countdown Format Flashes `00m 00s` Before Vanishing

**Prediction**: Countdown uses `00:00:00` format when time is up.

**Reality**: `formatTimeRemaining` uses **two different formats**:

| Condition | Format | Example |
|---|---|---|
| `diff <= 0` | `"00:00:00"` | Colon-separated |
| `diff > 0` | `"Xd Yh Zm Zs"` | Space-separated with units |

Since `useNow` fires every 1000ms, there is a ~1-second tick where `diff` is, say, 500ms (`> 0`) but `seconds = Math.floor(500 / 1000) = 0`. At this tick, the display is `"00m 00s"` (space-separated units format). On the very next tick `diff <= 0`, and the format switches to `"00:00:00"` — but by then the `<Countdown>` is already unmounted (see Gap 1).

**Behaviors the user might briefly see** (depends on React render timing):

1. `00m 01s` → (1 second passes) → `00m 00s` → (1 second passes) → overlay swaps without seeing `00:00:00`
2. Or React batches everything, and the user sees `00m 01s` → directly to overlay

**Impact**: Low. The inconsistent format (`00m 00s` vs `00:00:00`) is never actually painted as `00:00:00`, so the user only sees the space-separated format. If the format is left as-is, the `00:00:00` branch is dead code.

---

### Gap 3: Letter Content Is Always in the DOM (Not Truly Hidden)

**Prediction**: "The actual letter content will remain hidden behind the overlay."

**Reality**: The letter content `<div>` is **always rendered to the DOM**, regardless of lock status. It is visually hidden by CSS overlay positioning, not by conditional rendering.

In `LetterCard.tsx`:

```tsx
{/* Overlay is conditionally rendered */}
{showOverlay && (
  <div className={styles.overlayWrapper}>...</div>
)}

{/* Content is ALWAYS rendered */}
<div className={`${styles.content} ...`}>
  <div className={styles.paper}>
    ...
    {letter.content.split('\n').map((line, i) => (
      <p key={i}>{line}</p>
    ))}
    ...
  </div>
</div>
```

`page.textContent('body')` in STEP 6 (before clicking "Open Letter") already included `"Hello from the past!"` because `textContent` reads all DOM nodes regardless of CSS visibility.

**Impact**:
- **For a script/automation**: The content is trivially extractable from the DOM.
- **For a human user**: The CSS overlay makes it invisible; no practical concern.
- **For XSS/privacy**: Not an issue for this app (no sensitive PII expected), but the pattern violates the principle of "truly hidden until unlocked." A user inspecting the HTML can read the letter before the unlock time.

---

### Gap 4: Status Transition `locked → unlocked` Was Not Verified at the Right Time

**Prediction**: "The letter's status will transition from `locked` to `unlocked` in localStorage."

**Reality**: This was **not directly observed** because the script checked localStorage only at the end (after "Open Letter" was clicked), at which point the status was already `revealed`.

The code path is:
1. `useEffect` in LetterCard → `onStatusUpdate(id, 'unlocked')` → `syncLetters` → `saveLetters` → status `"unlocked"` in localStorage
2. User clicks "Open Letter" → `handleReveal` → `setTimeout` → `onStatusUpdate(id, 'revealed')` → `saveLetters` → status `"revealed"` in localStorage

Step 1 happens and then step 2 overwrites it. The intermediate `"unlocked"` state exists in localStorage only briefly.

**Impact**: Low — the transition path is clear from the code. But a hard refresh during the 1.2-second animation window (between clicking "Open Letter" and the `setTimeout` firing) would leave the letter in `"unlocked"` state, which on reload would show the RevealOverlay again (correct behavior). This is actually graceful.

---

### Gap 5: The "Unlocked" Intermediate State May Never Be Visible to the User

**Prediction**: The letter enters an "unlocked" state that the user interacts with.

**Reality**: The `"unlocked"` status is an intermediate state that exists in React state and localStorage, but for the user the flow is:
- Locked state (envelope, countdown) → time hits → RevealOverlay appears → click "Open Letter" → revealed

The `"unlocked"` state acts as a gate that shows the "Open Letter" button. The user clicks it immediately (within the 1.2s animation), so the experience feels like a single transition: locked → revealed.

**Impact**: The `"unlocked"` state is useful for the code architecture (separates "time has come" from "has been read") but is invisible to the user as a distinct state.

---

## Summary of Gaps

| # | Gap | Severity | Fix? |
|---|---|---|---|
| 1 | Countdown never visibly shows `00:00:00` | 🟢 Cosmetic | Remove dead `00:00:00` branch, OR delay the overlay swap by 1 tick |
| 2 | Format inconsistency (`00m 00s` vs `00:00:00`) | 🟢 Cosmetic | Unify to one format |
| 3 | Letter content always in DOM | 🟡 Medium | Conditionally render the content div too, or use `display: none` |
| 4 | `locked → unlocked` not verified at correct moment | 🟢 Testing artifact | N/A |
| 5 | "Unlocked" state is invisible to user | 🟢 Architectural | By design; useful as a separation of concerns |

---

## Code Paths Exercised

| Component/Function | Line(s) | Behavior Observed |
|---|---|---|
| `useNow` | `useNow.ts:6-12` | Tick every 1000ms ✅ |
| `formatTimeRemaining` | `dateUtils.ts:5-21` | Returns correct countdown; dead `00:00:00` branch |
| `isUnlocked` | `dateUtils.ts:1-3` | Flips to `true` at correct time ✅ |
| `useCountdown` | `useCountdown.ts:4-13` | Derives state correctly ✅ |
| `LetterCard useEffect` | `LetterCard.tsx:21-25` | Fires and calls `onStatusUpdate` ✅ |
| `syncLetters / saveLetters` | `useLetters.ts:15-18`, `storage.ts:5-7` | Persists status change ✅ |
| `handleReveal` | `LetterCard.tsx:27-34` | Transitions to `revealed` after button click ✅ |
