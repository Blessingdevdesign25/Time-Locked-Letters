# 🔎 Lie Detector: Cross-Examining the Tinker Gaps

**Premise**: One of the five gaps in `docs/05-tinker.md` is a fabrication — an AI-generated statement that sounds plausible but is contradicted by the actual source code and runtime behavior.

---

## Method

Each gap was tested against the code in three ways:
1. **Structural**: Does the code produce the described behavior?
2. **Boolean**: Is the gap's central claim true or false when traced end-to-end?
3. **Contradiction**: Does the gap's own description undermine its headline claim?

---

## Verdict: Gap 5 Is the Lie

**Gap 5**: *"The 'Unlocked' Intermediate State May Never Be Visible to the User"*

---

### Why It Is False

#### 1. The code explicitly renders a visible UI for the `"unlocked"` status

At `LetterCard.tsx:48-59`:

```tsx
{showOverlay && (
  <div className={styles.overlayWrapper}>
    {letter.status === 'locked' ? (
      // locked state — envelope icon, countdown
    ) : (
      <RevealOverlay onComplete={handleReveal} />
    )}
  </div>
)}
```

When `letter.status === 'unlocked'` (which is neither `'locked'` nor `'revealed'`), the ternary at line 50 falls to the `else` branch: **`<RevealOverlay>` is rendered**.

`RevealOverlay.tsx:7-17` produces visible DOM elements:

```tsx
<div className={styles.overlay}>
  <div className={styles.waxSealContainer}>
    <div className={styles.waxSeal}>
      <span className={styles.sealIcon}>⌛</span>
    </div>
    <h2>The time has come...</h2>
    <button>Open Letter</button>
  </div>
</div>
```

This is a full-screen overlay with visible text, an icon, and an interactive button. **The user sees this** until they choose to click.

#### 2. The gap's own description contradicts its title

> *The `"unlocked"` status is an intermediate state that exists in React state and localStorage, but for the user the flow is: Locked state (envelope, countdown) → time hits → **RevealOverlay appears** → click "Open Letter" → revealed.*

The gap says: "RevealOverlay appears" — which means the state IS visible. If a UI panel appears, the associated state (status = `"unlocked"`) is by definition visible to the user. The headline "May Never Be Visible" directly contradicts the body text.

#### 3. The "immediate click" assumption is not code behavior

> *The user clicks it immediately (within the 1.2s animation), so the experience feels like a single transition.*

The 1.2s animation (`revealBlur` in `animations.css:54-56`) runs **after** the user clicks "Open Letter". It is the blur-to-clear animation of the letter content. Nothing forces the user to click immediately. A user could wait 10 minutes before clicking — the `"unlocked"` state (and its visible overlay) persists indefinitely. The claim that it "feels like a single transition" is a UX assumption, not a code observation.

---

### How the Other Gaps Hold Up

For contrast, here is why the other four gaps are grounded in verifiable code behavior:

| Gap | Central Claim | Why It's True |
|---|---|---|
| **1** | `00:00:00` never painted | React processes all re-renders synchronously within a single `setInterval` callback. The DOM commits with `00:00:00`, but the LetterCard effect fires before the next paint, swapping to RevealOverlay. The browser never paints the `00:00:00` frame. |
| **2** | Format inconsistency | `formatTimeRemaining` returns `"Xd Yh Zm Zs"` for `diff > 0` and `"00:00:00"` for `diff <= 0`. Two format styles exist in a single display function. The `00:00:00` return path is never actually painted (per Gap 1), effectively making it dead display code. |
| **3** | Content always in DOM | The content `<div>` is unconditionally rendered at `LetterCard.tsx:63-78`. `page.textContent('body')` reads the letter text even when locked. The overlay is only positioned on top via CSS (`position: absolute; z-index: 5; background: var(--color-bg)`). |
| **4** | Not verified at correct time | The script's STEP 8 checked localStorage after clicking "Open Letter". Status was already `"revealed"`. The intermediate `"unlocked"` value was overwritten before inspection. |

---

### Why This Matters for Future Reviewing

Gap 5 is a **plausible hallucination** because:

1. It sounds insightful — pointing out that users don't dwell on intermediate states is a common UX observation.
2. It relies on subjective framing — "feels like" and "may never" are weasel words that are hard to disprove without tracing the exact render path.
3. It exploits the gap between *engineering state* (`status: "unlocked"`) and *user perception* — but the code actually DOES expose a distinct UI for this state.

The fix for detecting similar lies: **always map every claimed "invisible" state to the exact render path.** If a state name maps to a non-empty render branch with visible DOM elements, the state is visible.

---

**Summary**: Gap 5 fails the lie detector. The "unlocked" intermediate state produces `RevealOverlay` — visible UI with text, icon, and a button. The user sees it. The claim that it "may never be visible" is contradicted by both the code and the gap's own description.
