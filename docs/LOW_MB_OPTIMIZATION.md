# PHARMA RUSH — Low-MB Strategy

Target: **core under 1 MB** (budget is 10 MB). Final Android package as small as practical.

## Size budget

| Item | Estimated size | Approach |
|---|---|---|
| Code (all JS) | ~150–250 KB | Vanilla, no libraries, minifiable |
| CSS | ~40–60 KB | One file, CSS variables |
| Graphics | **0 KB** | Inline SVG + CSS shapes; no image files |
| Sounds | **0 KB** | WebAudio synthesized |
| Content data | ~80–200 KB | Compact JS records (20 meds / 30 cases) |
| Fonts | 0 KB | System font stack |
| Save data | ~10–50 KB | localStorage JSON |
| index.html | ~3 KB | — |
| **Core total** | **under 1 MB** | — |
| Capacitor wrapper | ~6–10 MB | One-time, added at packaging phase |

## Hard rules

1. No image files in v1. Icons are inline SVG; characters are CSS/SVG shapes.
2. No external fonts. Use a system font stack.
3. No frameworks, no libraries, no external APIs, no cloud.
4. Sounds synthesized with the Web Audio API (zero files).
5. If images become unavoidable later: WebP + lazy loading, or image sprites.
6. Data files stay compact (short keys, no duplicated blobs).
7. No analytics, no telemetry payloads.

## Keeping it small over time

- One CSS file, one build-free codebase.
- Reusable UI components instead of per-screen duplication.
- Content additions are data (KB-scale), not code.
- Optional: a simple minifier pass at release time.
