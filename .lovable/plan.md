
# Pocket Collagen Coach — Matrix v3 + Deep Personalisation + Coylah Reskin

Scope: Pocket Collagen Coach only. Collagen Kitchen & Old Audit Glow stay untouched (read-only reference).

## Memory model (answering your question)
- Profile is saved to `localStorage` under `pcc_preferences` — persists per browser across sessions.
- Every message sent to the Coach includes the profile inside `buildSystemPrompt`, so answers get more personal over time.
- Users can retake the quiz any time from the home tile; answers merge into the same profile.
- Not synced across devices (would need accounts — out of scope for this build).

## What stays untouched
`src/routes/api/chat.ts`, `src/utils/formatAiResponse.ts`, all five modes (fridge / menu / supermarket / recipe / Ask Me Anything), image pipeline, recommendation card format, "individual items score, groups don't" rule.

## 1. Coach brain (Matrix v3)
Rewrite the system prompt to reason via **BUILD / ACTIVATE / SUPPORT / PROTECT** using the 11-factor matrix:

- BUILD — protein / collagen raw materials (glycine, proline, lysine; hydroxyproline & hydroxylysine framed as hydroxylated forms, not raw materials).
- ACTIVATE — vitamin C, iron.
- SUPPORT — zinc, copper, manganese, silica (silica worded carefully).
- PROTECT — vitamin A, omega-3, antioxidants, blood sugar stability (framed as environment/protection).

100-point scoring baked into prompt: Protein 20 · Vit C 15 · Iron 5 · Zinc 7 · Copper 7 · Manganese 4 · Silica 2 · Vit A 10 · Omega-3 10 · Antioxidants 10 · Blood sugar 10.

Rules in prompt: think framework internally, answer short; comparative estimates only; Hits/Missing tagged by framework position (e.g. `Hits: BUILD — protein | ACTIVATE — vit C`); groups not scored; British-English Coylah voice with signature phrases used sparingly; never "babe"; avoid blueprint/reset/cure/anti-ageing/optimise/unlock/"here's the thing"; safety language ("may be low in…"), keep liver+vit A/pregnancy, Brazil-nut selenium, GP referral warnings; collagen peptides = "useful but not the whole matrix" (never "don't work"); don't market as AI.

Copy sweep: replace "10 collagen co-factors" wherever it appears with "11-factor Collagen Matrix".

## 2. Deep onboarding — three-layer Coach Profile

Saved in one `localStorage` object; grouped into short, tap-friendly steps so it never feels clinical.

### Layer A — MATRIX HABITS (identifies gaps)
1. Dietary pattern / restrictions (keep existing options).
2. Proper protein meals per day: Rarely/<1 · Usually 1 · Usually 2 · 3+.
3. Oily fish (salmon/sardines/mackerel): Never · <1×/wk · 1×/wk · 2+×/wk.
4. Vit C-rich foods with meals (peppers/kiwi/berries/broccoli/citrus): Rarely · Some days · Most days · Daily.
5. Collagen powder/supplement use: No · Sometimes · Most days · Daily.
6. Where you most need help (multi-select): Meals at home · Fridge · Restaurants · Supermarket · More protein · More oily fish · Better collagen meals · Recovery after a rubbish week.

### Layer B — COOKING & EATING STYLE (identifies *how* to deliver advice)
Multi-select "select all that sound like you" chips, exact copy & emoji:

🔥 I like a bit of heat · 🌶️ The hotter the better · ⏱️ Under 20 minutes, please · 🍳 I don't mind proper cooking · 🫠 Minimal effort is ideal · 🍲 I love batch cooking · 🍽️ Usually cooking for other people too · 🥡 I eat out / grab on the go a lot · 🍫 Absolute sweet tooth · 🥨 More savoury · 🥗 Fresh, lighter meals · 🍝 Give me comfort food · 💷 Keep it budget-friendly · ✨ I'll spend more if it's worth it.

Stored as `style: string[]`.

### Layer C — FOOD PREFERENCE MAP (identifies *what* to solve gaps with)
The full Matrix v3 food universe, deduplicated (one entry per food even when it appears under multiple nutrients). Presented in swipe-style sections so it feels quick, not clinical:

- Meat & eggs
- Fish & seafood
- Dairy
- Fruit
- Vegetables & greens
- Beans, grains & carbs
- Nuts & seeds
- Extras / flavour / collagen heroes (e.g. bone broth, gelatin, chicken skin, citrus zest, herbs, dark chocolate, olive oil)

Per food, one tap sets preference:

😍 LOVE IT · 🙂 HAPPY TO EAT IT · 🤷 IF IT WORKS · 🚫 ABSOLUTELY NOT

Stored as `foods: { [slug]: "love" | "happy" | "if_it_works" | "no" }`. Untapped foods stay unset (treated as neutral). Users can skip any section and return later.

### Profile shape (localStorage `pcc_preferences`)
```
{
  version: 3,
  completed: boolean,
  updatedAt: ISO string,
  restrictions: string[],
  proteinFrequency, oilyFishFrequency, vitCFrequency, supplementUse: string,
  helpAreas: string[],
  style: string[],
  foods: { salmon: "love", brussels_sprouts: "no", ... }
}
```

## 3. How the Coach uses the profile
`buildSystemPrompt` injects a compact "USER PROFILE" block plus explicit rules:

- Combine all three layers when suggesting foods.
- Prioritise LOVE IT foods that close matrix gaps; use HAPPY freely; suggest IF IT WORKS only when genuinely useful and pair with a practical prep tip; never recommend ABSOLUTELY NOT foods as the normal answer.
- Respect restrictions absolutely (never conflict).
- Match delivery to style tags — e.g. "⏱️ Under 20 minutes" + "🫠 Minimal effort" → quick, low-faff answers; "💷 Budget" → cheap options first; "🍲 Batch cooking" → scale-up tips; "🥡 On the go" → grab-and-go swaps.
- Reference preferences conversationally and sparingly, in Coylah voice — never mechanically, never in every reply. Examples the prompt models (not scripts):
  - Sprouts = no → "Don't panic, I'm not about to make you eat Brussels sprout purée."
  - Sardines = no → "Right, sardines are clearly not entering the building. We'll get your omega-3 elsewhere."
  - Salmon = love → "You love salmon, so I'm using that to our advantage."
- Combined-signal examples baked into the prompt so the model internalises the pattern:
  - Low oily fish + salmon LOVE + under-20-min → quick salmon omega-3 idea.
  - Low ACTIVATE + red pepper NO + kiwi LOVE → kiwi (or other liked vit C food), not red pepper.
  - Low protein + minimal effort + Greek yoghurt LOVE → yoghurt/skyr/cottage cheese, not "cook steak".
- Never shame supplement users; explain what the wider matrix adds.
- Never diagnose deficiencies.

## 4. Quiz UX
- Segmented into small steps with a progress dots row (Habits → Style → Foods by section).
- Each step skippable; profile saves incrementally so partial completions still personalise.
- Food chips are big, tappable, one-tap cycles through the four states (or explicit emoji buttons per row on mobile — final choice during build, whichever tests cleaner).
- "Retake / update preferences" entry from the quiz home tile.

## 5. Visual reskin — Love Coylah / Collagen Kitchen family
- Palette tokens in `src/styles.css`: hot pink (primary accent), baby pink (soft surfaces), black (contrast/text), clean white (background). Retire burgundy #8B1A2B and beige/pink wellness look. No hardcoded hex in components — semantic tokens only.
- Fonts via `<link>` in `src/routes/__root.tsx` head: Montserrat (UI/body), Playfair Display (editorial headings & brand moments).
- Style: editorial, clean, modern, feminine-not-twee, strong type, hot pink accents on black/white, subtle stars/sparkles where they earn it.
- Avoid: navy, gold, coral, teal, flowers, beige wellness, empty white voids.
- Reskin home tiles, quiz screens, chat bubbles, score cards, badges, install prompt — same layout & behaviour, new skin only.

## 6. Verification before hand-off
Fridge · Menu · Supermarket · Recipe · Ask Me Anything · Full quiz completion + reload restores profile · Partial quiz save · Score parsing & badge render · Coylah voice sanity check · "11-factor" copy sweep · A prompt using a LOVE + NO combo returns an appropriate personalised suggestion.

## Files that will change
- `src/routes/index.tsx` — `buildSystemPrompt`, new multi-step `QuizScreen` (Habits/Style/Foods), tile copy, "10 co-factors" → "11-factor", visual classes.
- `src/styles.css` — Coylah palette tokens, radii.
- `src/routes/__root.tsx` — Montserrat + Playfair links, title/description.
- New small presentation components under `src/components/` if it keeps `index.tsx` readable (e.g. `ScoreBadge`, `FoodChip`, `StepDots`) — presentation only.
- New `src/data/matrixFoods.ts` — deduped Matrix v3 food list grouped by section, single source of truth for the food preference step.

## Out of scope
- No changes to `api/chat.ts`, `formatAiResponse.ts`, image pipeline, auth, or Cloud/Supabase config.
- No cross-device sync / accounts.
- No importing Collagen Kitchen recipes or logic.
- No edits to Collagen Kitchen or Old Audit Glow projects.

## Deliverable
Concise end-of-build summary: files changed · brain/scoring changes · quiz/profile changes · visual changes · anything unfinished.

Approve and I'll build in one focused pass.
