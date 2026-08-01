# Expo homepage scripts

**Source of truth:** `../index.html` (plus `assets/js/home.js`, `assets/js/expo-boot.js`, `assets/css/home*.css`).

## Safe commands

```bash
node scripts/verify-home.mjs
```

Validates S/A/B/C release gates (hero, a11y links, selective boot, IA length, axe hook, surface stages, fair compare, community in footer).

## Dangerous / legacy

These rewrite or regenerate the homepage and are **blocked by default**:

| Script | Purpose |
|--------|---------|
| `build-expo-home.mjs` | Full HTML regenerate |
| `polish-expo.mjs` | In-place polish patches |
| `patch-expo-home.mjs` | Overlay attribute renames |
| `sync-expo-generator.mjs` | Rewrites the generator itself |

Pass `--force` only when you intentionally accept wiping live fixes.

Prefer small patches via `fix-*-blockers.mjs` or direct edits to `index.html`.
