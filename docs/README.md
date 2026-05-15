# ⏳ Time-Locked Letters

> Patience as a product. Notes that refuse to open until the future arrives.

Time-Locked Letters is a single-page React application that allows you to write letters to your future self or others, locking them away until a specific date. Once sealed, a letter cannot be read until its time has come.

## ✨ Features

- **Sealed Storage**: Letters are stored locally in your browser and locked with a digital wax seal.
- **Live Countdown**: Every locked letter shows a real-time countdown to its unlock moment.
- **Soft Reveal**: An elegant unfolding animation greets you when a letter is finally ready to be read.
- **Paper Aesthetic**: A premium design inspired by traditional stationery and timeless elegance.
- **Privacy First**: No backend, no accounts. Your letters never leave your browser.

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React** | Component-based UI |
| **Vite** | Fast development server & bundling |
| **TypeScript** | Type safety and documentation |
| **CSS Modules** | Scoped, vanilla styling |
| **LocalStorage** | Persistent local data |

## 📁 Directory Structure

```text
time-locked-letters/
├── public/                # Static assets
├── src/
│   ├── components/        # UI Components
│   ├── hooks/             # Custom React Hooks
│   ├── utils/             # Helper functions
│   ├── types/             # TS Interfaces
│   ├── styles/            # Global & Design System
│   ├── App.tsx            # Main Application
│   └── main.tsx           # Entry Point
├── docs/                  # Detailed Documentation
└── index.html             # HTML Template
```

## 🚀 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📜 LocalStorage Schema

Letters are stored under the key `time_locked_letters` as a JSON array:

```json
[
  {
    "id": "abc123xyz",
    "recipient": "Future Me",
    "content": "Remember to take a breath.",
    "unlockDate": "2026-12-25T00:00:00.000Z",
    "createdAt": "2026-05-15T12:00:00.000Z",
    "status": "locked"
  }
]
```

## 🗺 Roadmap v1.0

- [x] Core CRUD operations
- [x] Live countdown tickers
- [x] Soft reveal animations
- [x] Responsive layout
- [ ] Export/Import letters (v1.1)
- [ ] Rich text editor (v1.2)
- [ ] Multiple paper textures (v1.3)
