# 🎨 Design System

The visual language of Time-Locked Letters is built on the principles of **Patience**, **Permanence**, and **Elegance**.

## 🎨 Color Palette

| Token | Value | Description |
| :--- | :--- | :--- |
| `--color-bg` | `#0f172a` | Deep Slate (Night Sky) |
| `--color-paper` | `#fefce8` | Aged Cream (Yellow 50) |
| `--color-ink` | `#1e293b` | Midnight Blue (Slate 800) |
| `--color-wax` | `#991b1b` | Crimson Red (Red 800) |
| `--color-accent` | `#d97706` | Amber Gold |

## Typography

- **Serif**: `Playfair Display` (Headings, Letter Content)
- **Sans**: `Inter` (UI elements, labels, buttons)

## 🎞 Motion & Animations

### 1. The Soft Reveal (`revealBlur`)
- **Duration**: 1.2s
- **Curve**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Sequence**: Blur 20px -> 0px \| Opacity 0 -> 1 \| Scale 0.95 -> 1

### 2. The Wax Seal Pulse
- **Frequency**: 3s
- **Effect**: Subtle scaling (1.05x) and a glowing red box-shadow to signify "Ready to open".

### 3. Shimmer Effect
- Used for loading states or background highlights. 2s infinite linear gradient slide.

## 🏗 Card Anatomy

1. **Overlay Layer**: (Locked/Unlocked)
   - Background matching the app background.
   - Centered icon and countdown.
2. **Paper Layer**: (Revealed)
   - High contrast Ink-on-Cream.
   - Subtle inset box-shadow to simulate depth.
   - Traditional header/footer layout.

## 📐 Breakpoints

- **Mobile**: < 640px (Single column, centered headers)
- **Desktop**: > 640px (Multi-column grid, spaced layout)

## 📜 Design Principles

1. **Slow is Smooth**: Interactions should feel deliberate, not rushed.
2. **Tactile Digital**: Use shadows and gradients to make elements feel like physical stationery.
3. **Typography First**: The words are the focus. UI should recede into the background.
4. **Emotional Feedback**: Colors like Wax Red and Amber Gold evoke a sense of tradition and importance.
