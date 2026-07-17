# Two fixes

## 1. The bug — AuthGate is blocking your app

Your last few commits added `src/components/ui/AuthGate.tsx` and wired it into `src/routes/__root.tsx` around `<Outlet />`. It requires a `?token=...` value in the URL (stored in localStorage as `app_token`). With no token, it renders:

> **Access Required** — Please use your secure access link.

That's exactly what your session replay is showing on the preview, and it's why the app looks broken. The Gemini `/api/chat` route already has its own token check server-side, so this frontend gate is duplicate and, in its current form, locks everyone out.

**Fix (safest, minimal):** unwrap `<AuthGate>` in `src/routes/__root.tsx` so `<Outlet />` renders directly inside `<QueryClientProvider>`. Leave `AuthGate.tsx` and `useAuthToken.ts` on disk (untouched) in case you want to reintroduce a proper gated flow later. No other files change. No changes to Collagen Matrix, Gemini route, scoring, onboarding, or profile logic.

If you'd rather **keep** the gate but stop it blocking normal users, tell me the intended access model (e.g. everyone in unless `?token=` is explicitly required for premium) and I'll wire that instead — but based on the symptom you described, removing the wrap is the right call.

## 2. Hide the "Edit with Lovable" badge

Your plan supports hiding it. I'll call `publish_settings--set_badge_visibility` with `hide_badge: true`. Takes effect on the next publish.

## Files changed
- `src/routes/__root.tsx` — remove `<AuthGate>` wrapper + its import (2 lines).

## Not touched
- `src/routes/api/chat.ts`, `src/routes/index.tsx`, `src/data/matrixFoods.ts`, styles, onboarding, scoring — all untouched.
