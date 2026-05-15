# 🔍 Engineering Audit: Time-Locked Letters

This audit evaluates the robustness, security, and edge-case handling of the application.

---

## 🛡️ Security Audit: XSS (Cross-Site Scripting)
**Finding**: **SAFE**

React automatically escapes variables rendered within JSX curly braces `{}`. In [LetterCard.tsx](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/components/LetterCard/LetterCard.tsx):
```tsx
// Line 71: {line} is rendered as plain text content
<p key={i}>{line}</p>
```
Even if a user enters `<script>alert('XSS')</script>`, it will be displayed as literal text on the paper. No `dangerouslySetInnerHTML` is utilized in this project.

---

## 📦 Persistence Edge Cases

### 1. `localStorage` is Full
**Finding**: **CRITICAL VULNERABILITY**
Currently, [storage.ts](file:///c:/Users/BLESSING%20ALEONOMOH/Desktop/Time-Locked%20Letters/src/utils/storage.ts) does not use `try/catch`. If the browser's 5-10MB quota is exceeded:
- `localStorage.setItem` will throw a `QuotaExceededError`.
- The `syncLetters` callback in `useLetters.ts` will crash.
- **Fix Required**: Wrap `saveLetters` in a `try/catch` and provide user feedback.

### 2. `localStorage` is Disabled
**Finding**: **VULNERABILITY**
In "Incognito" mode or with strict privacy settings, `localStorage` might be `null` or throw access errors.
- **Result**: The app will fail to load or save any letters.
- **Fix Required**: Add a check for `localStorage` availability on app boot.

---

## 🕰️ Time & Synchronization

### 1. System Clock Manipulation
**Finding**: **LIMITATION (BY DESIGN)**
The app uses `Date.now()` which follows the user's system clock. 
- **Exploit**: A user can "time travel" by manually changing their computer's clock to the future to unlock a letter early.
- **Mitigation**: In a no-backend architecture, this is unavoidable. To prevent this, a server-side timestamp would be required.

### 2. Colliding Unlock Minutes
**Finding**: **STABLE**
If two letters share the exact same unlock time:
- The `letter-grid` will correctly render both.
- `useCountdown` will correctly calculate `00:00:00` for both.
- Since we use unique IDs (`generateId`) for the `key` prop, React will manage them independently without conflict.

---

## 🧩 Principle Violations & Refactoring Needs

### 1. Lack of Error Boundaries
The app assumes all `localStorage` reads will return valid JSON. If the storage is corrupted (e.g., edited manually by a user), `JSON.parse` will throw and the app will go blank.

### 2. Prop Drilling vs. Context
`now` is passed from `App -> LetterCard -> useCountdown`. In v1.0 with a small tree, this is fine. If the component tree grows, this violates the principle of **Clean Composition**.

---

## 📊 Summary Table

| Edge Case | Risk Level | Status | Notes |
| :--- | :--- | :--- | :--- |
| **XSS Injection** | Low | ✅ Secure | React auto-escaping handles this. |
| **Storage Full** | High | ❌ Vulnerable | Needs `try/catch` in `storage.ts`. |
| **Storage Disabled** | Medium | ❌ Vulnerable | App will crash on load. |
| **Time Travel** | Low | ⚠️ Known | Known limitation of client-side apps. |
| **ID Collisions** | Low | ✅ Secure | `generateId` uses random + timestamp. |

---

## 🛠️ Recommended Hardening
1.  **Storage Wrapper**: Update `storage.ts` with error handling.
2.  **Zod Validation**: Use a library like `Zod` to validate JSON coming out of `localStorage`.
3.  **Graceful Degradation**: If `localStorage` is missing, allow the app to run in "Session Only" mode with a warning.
