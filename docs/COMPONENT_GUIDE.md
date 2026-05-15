# 🧩 Component Guide

Detailed reference for the components used in Time-Locked Letters.

## `LetterCard`
The primary unit of the application. Manages three distinct visual states.

**Props:**
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `letter` | `Letter` | Yes | The letter data object. |
| `now` | `number` | Yes | Current timestamp (from `useNow`). |
| `onDelete` | `(id: string) => void` | Yes | Callback to trigger deletion flow. |
| `onStatusUpdate` | `(id, status) => void` | Yes | Callback to update letter state. |

**Internal State:**
- `isRevealing`: Boolean. Controls the transition animation between `unlocked` and `revealed`.

---

## `LetterForm`
Modal interface for creating a new letter.

**Props:**
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `onSubmit` | `(dto) => void` | Yes | Called with the form data. |
| `onClose` | `() => void` | Yes | Dismisses the modal. |

**Behavior:**
- Validates that `unlockDate` is at least 1 minute in the future.
- Automatically converts inputs to `CreateLetterDTO` format.

---

## `RevealOverlay`
The interactive "Seal" displayed on unlocked but unread letters.

**Behavior:**
- Displays a pulsating "Wax Seal".
- Triggers a 1.2s reveal sequence on click.

---

## ♿ Accessibility

| Component | ARIA / Behavior |
| :--- | :--- |
| `DeleteBtn` | `aria-label="Delete letter"` |
| `LetterForm` | Focus trapping and keyboard escape handling (native behavior). |
| `Countdown` | `tabular-nums` for stable visual layout. |

## 🎨 Visual Interaction Map

1. **User clicks "New Letter"** -> `App` sets `isFormOpen: true` -> `LetterForm` renders.
2. **Form submitted** -> `App` calls `useLetters.addLetter()` -> `localStorage` updated -> `LetterGrid` re-renders.
3. **Timer hits zero** -> `LetterCard` detects `unlocked` via `useCountdown` -> Calls `onStatusUpdate(id, 'unlocked')`.
4. **User clicks "Open Letter"** -> `LetterCard` triggers `isRevealing` animation -> After 1.2s, status becomes `revealed`.
