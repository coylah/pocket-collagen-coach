import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import { formatAiResponse } from '../utils/formatAiResponse'
import { getStoredToken } from '../utils/useAuthToken'
import {
  FOOD_GROUPS, FOOD_LABEL, RESTRICTIONS, COOK_TIME, STYLE_OPTIONS, USUALS,
  MILK_OPTIONS, BONE_BROTH_OPTIONS,
  EMPTY_PROFILE, type CoachProfile, type FoodPref, type FoodLog,
} from '../data/matrixFoods'

export const Route = createFileRoute('/')({ component: App })

/* =============================================================
 * COACH BRAIN — Matrix v3
 * ============================================================= */
const CORE_BRAIN = `You are Coylah — a British skin specialist in the user's pocket. This product is "Pocket Collagen Coach" (by Love Coylah). Don't call yourself "AI". Don't market yourself.

MATRIX v3 (internal reasoning — never a checklist to cram into a meal):
BUILD: 1) Protein / raw materials (glycine, proline, lysine). Hydroxyproline & hydroxylysine are hydroxylated forms produced via vit C + iron — not raw materials.
ACTIVATE: 2) Vitamin C  3) Iron.
SUPPORT: 4) Zinc  5) Copper  6) Manganese  7) Silica.
PROTECT: 8) Vitamin A  9) Omega-3  10) Antioxidants  11) Blood sugar stability.

SCORING (100 pts): Protein 20 | Vit C 15 | Iron 5 | Zinc 7 | Copper 7 | Manganese 4 | Silica 2 | Vit A 10 | Omega-3 10 | Antioxidants 10 | Blood sugar 10.
Only score individual dishes / products / snacks / recipes. NEVER a single score for a whole fridge / menu / shelf / buffet — instead give up to 3 individually scored picks.

ALWAYS emit the scored line exactly as: Collagen Score: <n>/100 (so the app can render the badge). Score once per scorable item.

SCORE CONTEXT — critical:
A low score does NOT mean bad food. The score = Collagen Matrix completeness, not overall health. Judge the item by what it is:
- COMPLETE MEAL → score matrix completeness as a meal.
- SINGLE FOOD (e.g. egg, broccoli) → explain its Matrix role. Don't fail it for not being a full dinner. "On its own an egg won't score like a meal. That's not its job. For BUILD though? Very useful."
- SNACK → judge as a snack; say what it contributes.
- PACKAGED PRODUCT → assess Matrix contribution + visible ingredients/nutrition. Do NOT invent ingredients you can't see. Don't blanket-label all bread/pasta as ultra-processed — read the actual label.

HONESTY over politeness. If a product is barely contributing to the Matrix, say so plainly: "As a collagen food? It's not doing much, if we're honest." Then offer a practical next move (better swap / build the meal around it / turn it into something). No shaming, no purity culture, no "toxic / clean eating / bad food".

TRACE NUTRIENTS: Don't praise a food as "hits protein" or "antioxidant-rich" for a trivial amount (e.g. ~2 g protein). Meaningful contribution only.

CULINARY-FIRST:
The Matrix is your brain, not a checklist. Optimise: 1) delicious 2) realistic 3) suits the user 4) collagen-supportive. A coherent 65/100 dinner beats an absurd 90/100 dish with chia thrown at chicken for points. Before adding any ingredient ask: "would a good recipe writer genuinely put this in this dish?" — if no, don't. It's fine to name a gap and let another meal handle it.

VOICE:
British, direct, warm, cheeky, practical. Short sentences. Vary openings. "My lovely / behave / don't panic" are occasional flavour, not catchphrases — do NOT start every reply with "Right, my lovely" or repeat "cracking / for your skin / here's how we're doing it". Never say "babe".

NAME: You know the user's first name from the profile. Use it occasionally and naturally — not every reply, not every sentence. Never end recipe steps with their name.

SAFETY:
Never diagnose. Use "quiet / missing today / not showing up / may be low in". Not "deficient / clinically low". Keep sensible warnings (liver + preformed vit A, Brazil nut selenium, GP referral for real concerns).

PERSONALISATION HIERARCHY:
MUST-AVOID = hard safety rule. Never suggest, ever. (Different from dislikes.)
COOK TIME = strong constraint. "15" means no 30-40 min recipes. "ask" → ask one short question if time materially affects the meal.
FOOD PREFERENCES: LOVE prioritise · LIKE use freely · IF IT FITS only when genuinely coherent · NOT FOR ME don't routinely recommend.
MILK PREFERENCE: respect it. When recommending or comparing plant milks, favour UNSWEETENED where suitable. Don't claim all plant milks or all sweetened versions are "bad" — explain sugar impact plainly.
BONE BROTH PREFERENCE: if user is using / would buy / would make / open — feel free to suggest broth where it's culinarily right (stocks, quinoa, rice, soups, stews, braises). If "absolutely not", don't push it. Never force it in where it makes no culinary sense.
USUALS = pantry staples they already have. Favour them in recipes for personalisation. Still list them in the recipe ingredients (unless the user tells you not to).

NEVER surface preference labels in output. No "(loves)" / "(likes)" tags anywhere. Use preferences silently to shape suggestions.

MEMORY HONESTY — critical:
You do NOT remember previous chats, old recipes, or old meal plans across sessions. You only remember what's in the persistent profile block below (name, must-avoid, food prefs, cook prefs, milk, bone broth, usuals) and any food log data supplied in this message. If asked "will you remember this plan tomorrow?" — be honest: "Not yet — if you close this chat I won't reliably keep the plan. Screenshot it for now. I'm not going to pretend I've got a memory I haven't." (Don't repeat that exact phrasing mechanically.) Never say "come back and I'll pick up where we left off".

DEFAULT ANSWER STYLE: Concise. Answer the actual question. No bloated intros. No signature phrases. Recipes and daily analyses may be longer because they were asked for.

RECIPE OUTPUT — when giving an actual recipe, emit exactly this fenced block (nothing else inside):

===RECIPE===
name: <name>
time: <e.g. 20 minutes>
serves: <e.g. 2>
score: <0-100>
intro: <one short optional sentence — may be empty>
ingredients:
- <ingredient with real quantity, e.g. "150g dry quinoa" — never "a decent amount">
- <ingredient>
method:
1. <step>
2. <step>
why:
- BUILD — <only if relevant>
- ACTIVATE — <only if relevant>
- SUPPORT — <only if relevant>
- PROTECT — <only if relevant>
boost:
- <max 2, only if genuinely coherent — otherwise omit this whole section>
===END===

Never prefix ingredients with BUILD/ACTIVATE tags. Never add preference labels to ingredients.

MEAL / SCAN RESPONSES (non-recipe) — compact:
<Optional 1-line Coylah reaction>
Collagen Score: <n>/100
Why it works: <one line>
Hits: <matrix factors present>
Missing: <matrix factors quiet>
Fix (optional): <one short idea if it makes sense>

For photos of multiple items, give up to 3 individually scored picks.

MULTI-DAY PLAN — if user asks for several days / a week:
Use a clear structured plan (DAY 1 / LUNCH / DINNER, DAY 2 …). Then a PREP ONCE section with real quantities. Then WHAT CARRIES OVER. Then ask "Want the shopping list?". If yes, produce a deduplicated shopping list EXCLUDING USUALS. Warn honestly that the plan won't be remembered next session — screenshot it.

PRODUCT SCAN NEXT ACTION: after a packaged product, offer ONE concise contextual next action (Just checking it / Show me a better swap / I'm eating it — build around it / Turn it into a meal). Don't return a giant paragraph after.`

const buildProfileBlock = (p: CoachProfile | null) => {
  if (!p || !p.completed) return ''
  const L = FOOD_LABEL
  const bySet = (v: FoodPref) => Object.entries(p.foods).filter(([, x]) => x === v).map(([id]) => L[id] || id)
  const restr = p.restrictions.filter(r => r !== 'none').map(id => RESTRICTIONS.find(o => o.id === id)?.label).filter(Boolean)
  if (p.restrictionsOther) restr.push(p.restrictionsOther)
  const styleTxt = p.style.map(id => STYLE_OPTIONS.find(o => o.id === id)?.label).filter(Boolean).join('; ')
  const usualsTxt = [...p.usuals.map(id => USUALS.find(o => o.id === id)?.label).filter(Boolean), ...(p.usualsCustom ? [p.usualsCustom] : [])].join(', ')
  const cookTime = COOK_TIME.find(o => o.id === p.cookTime)?.label || ''
  const milk = p.milk === 'other' ? (p.milkOther || 'Other') : (MILK_OPTIONS.find(o => o.id === p.milk)?.label || '')
  const broth = BONE_BROTH_OPTIONS.find(o => o.id === p.boneBroth)?.label || ''
  const love = bySet('love'), like = bySet('like'), iff = bySet('if_it_fits'), no = bySet('not_for_me')
  const out: string[] = ['\n\nPERSISTENT PROFILE (invisible to user; never surface labels; use silently):']
  if (p.firstName) out.push(`FIRST NAME: ${p.firstName}`)
  if (restr.length) out.push(`MUST-AVOID (never suggest — safety): ${restr.join(', ')}`)
  if (cookTime) out.push(`COOK TIME: ${cookTime}`)
  if (styleTxt) out.push(`STYLE: ${styleTxt}`)
  if (milk) out.push(`MILK: ${milk}`)
  if (broth) out.push(`BONE BROTH: ${broth}`)
  if (usualsTxt) out.push(`USUALS (pantry staples — favour but still list in recipes): ${usualsTxt}`)
  if (love.length) out.push(`LOVE: ${love.join(', ')}`)
  if (like.length) out.push(`LIKE: ${like.join(', ')}`)
  if (iff.length) out.push(`IF IT FITS: ${iff.join(', ')}`)
  if (no.length) out.push(`NOT FOR ME (dislike — don't routinely recommend): ${no.join(', ')}`)
  return out.join('\n')
}

/* =============================================================
 * DESIGN TOKENS
 * ============================================================= */
const PINK = '#FF2E8A'
const PINK_DEEP = '#D6156B'
const BABY = '#FCE4EE'
const BABY_SOFT = '#FFF7FA'
const INK = '#0A0A0A'
const INK_SOFT = '#1F1F1F'
const MUTE = '#6B6B6B'
const LINE = '#E9E9EC'
const LINE_SOFT = '#F2F2F4'
const SANS = "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const SERIF = "'Playfair Display', Georgia, serif"

const GLOBAL_CSS = `*,*::before,*::after{box-sizing:border-box}body{margin:0;padding:0;font-family:${SANS};color:${INK};-webkit-font-smoothing:antialiased;background:#FFF}button{font-family:${SANS}}@keyframes blink{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}.pcc-fade{animation:fade .25s ease both}.pcc-pulse{animation:pulse 1.4s ease-in-out infinite}`

/* =============================================================
 * Storage
 * ============================================================= */
const PROFILE_KEY = 'pcc_profile_v5'
const LEGACY_KEY = 'pcc_profile_v4'
const LOG_KEY = 'pcc_food_log_v1'

function loadProfile(): CoachProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem(LEGACY_KEY)
    if (!raw) return { ...EMPTY_PROFILE }
    return { ...EMPTY_PROFILE, ...JSON.parse(raw), version: 5 }
  } catch { return { ...EMPTY_PROFILE } }
}
function saveProfile(p: CoachProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }))
}
function loadLogs(): FoodLog[] {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') } catch { return [] }
}
function saveLogs(l: FoodLog[]) { localStorage.setItem(LOG_KEY, JSON.stringify(l)) }
function todayISO() { return new Date().toISOString().slice(0, 10) }

/* =============================================================
 * Primitives
 * ============================================================= */
function Chip({ selected, onClick, children, size = 'md' }: { selected: boolean; onClick: () => void; children: ReactNode; size?: 'sm' | 'md' }) {
  return (
    <button onClick={onClick} style={{
      padding: size === 'sm' ? '7px 12px' : '10px 15px',
      borderRadius: 50,
      border: `1.5px solid ${selected ? INK : LINE}`,
      background: selected ? INK : '#FFF',
      color: selected ? '#FFF' : INK_SOFT,
      fontSize: size === 'sm' ? 12 : 13,
      fontWeight: selected ? 600 : 500,
      cursor: 'pointer',
      transition: 'all .12s',
    }}>{selected ? '✓ ' : ''}{children}</button>
  )
}

function PrimaryBtn({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{
    flex: 1, background: disabled ? '#D0D0D3' : INK, color: '#FFF', border: 'none', borderRadius: 50,
    padding: '15px 20px', fontSize: 14, fontWeight: 700, letterSpacing: '.03em', cursor: disabled ? 'not-allowed' : 'pointer',
  }}>{children}</button>
}
function GhostBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} style={{
    background: '#FFF', color: INK, border: `1.5px solid ${LINE}`, borderRadius: 50,
    padding: '15px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  }}>{children}</button>
}

function BrandHeader({ small }: { small?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: SERIF, fontSize: small ? 14 : 16, fontWeight: 800, color: INK, letterSpacing: '-.005em', lineHeight: 1 }}>Pocket Collagen Coach</div>
      <div style={{ color: PINK, fontSize: 9, letterSpacing: '.24em', fontWeight: 700, marginTop: 3 }}>BY LOVE COYLAH ✦</div>
    </div>
  )
}

const PREF_META: Record<FoodPref, { label: string; bg: string; fg: string; border: string }> = {
  love:       { label: 'Love',       bg: PINK,     fg: '#FFF', border: PINK },
  like:       { label: 'Like',       bg: BABY,     fg: INK,    border: PINK_DEEP },
  if_it_fits: { label: 'If it fits', bg: INK_SOFT, fg: '#FFF', border: INK },
  not_for_me: { label: 'Not for me', bg: '#FFF',   fg: INK,    border: INK },
}

function FoodPrefRow({ label, note, value, onChange }: { label: string; note?: string; value: FoodPref | undefined; onChange: (v: FoodPref) => void }) {
  const opts: FoodPref[] = ['love', 'like', 'if_it_fits', 'not_for_me']
  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${LINE_SOFT}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: note ? 4 : 8 }}>{label}</div>
      {note && <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.5, marginBottom: 8, fontStyle: 'italic' }}>{note}</div>}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {opts.map(o => {
          const active = value === o
          const m = PREF_META[o]
          return (
            <button key={o} onClick={() => onChange(o)} style={{
              padding: '8px 12px', borderRadius: 50,
              border: `1.5px solid ${active ? m.border : LINE}`,
              background: active ? m.bg : '#FFF',
              color: active ? m.fg : MUTE,
              fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer',
              boxShadow: active ? '0 2px 6px rgba(0,0,0,.09)' : 'none',
            }}>{active ? '✓ ' : ''}{m.label}</button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================================================
 * DISCLAIMER / WELCOME
 * ============================================================= */
function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: BABY_SOFT, display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ padding: '56px 24px 40px', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        <div style={{ color: PINK, fontSize: 10, letterSpacing: '.28em', fontWeight: 700, marginBottom: 12 }}>BY LOVE COYLAH ✦</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 800, color: INK, margin: '0 0 8px', letterSpacing: '-.02em', lineHeight: 1 }}>Pocket<br/>Collagen Coach</h1>
        <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 12px', background: '#FFF', border: `1.5px solid ${INK}`, borderRadius: 50, fontSize: 12, fontWeight: 700, color: INK }}>You're in ✦</div>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, color: INK_SOFT, margin: '24px 0 18px', lineHeight: 1.4 }}>Before I start learning how you eat, one important bit…</p>
        <div style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.7, background: '#FFF', padding: '18px 20px', borderRadius: 16, border: `1px solid ${LINE}` }}>
          <p style={{ margin: '0 0 10px' }}>Pocket Collagen Coach is an educational food tool.</p>
          <p style={{ margin: '0 0 10px' }}>It does not provide medical or personalised nutritional advice and does not diagnose deficiencies, allergies or health conditions.</p>
          <p style={{ margin: '0 0 10px' }}>If you have allergies, significant dietary requirements, a health condition, take medication, or have concerns about your nutrient intake, speak to your GP or a registered nutrition professional.</p>
          <p style={{ margin: 0 }}>You are responsible for checking ingredients, allergens and whether a food is suitable for you.</p>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 20, padding: '16px 18px', background: '#FFF', borderRadius: 14, border: `2px solid ${checked ? PINK : LINE}`, cursor: 'pointer' }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: PINK, cursor: 'pointer' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>I understand and want to continue</span>
        </label>
        <div style={{ marginTop: 20, display: 'flex' }}>
          <PrimaryBtn disabled={!checked} onClick={onAccept}>Let's set up my Coach →</PrimaryBtn>
        </div>
      </div>
    </div>
  )
}

/* =============================================================
 * NAME SCREEN — first-things-first personal moment
 * ============================================================= */
function NameScreen({ initial, onNext }: { initial: string; onNext: (name: string) => void }) {
  const [name, setName] = useState(initial)
  return (
    <div style={{ minHeight: '100vh', background: '#FFF', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ padding: '56px 24px 24px', maxWidth: 520, margin: '0 auto', width: '100%', flex: 1 }}>
        <BrandHeader />
        <div style={{ marginTop: 40 }}>
          <div style={{ color: PINK, fontSize: 10, letterSpacing: '.24em', fontWeight: 700, marginBottom: 10 }}>FIRST THINGS FIRST ✦</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 800, color: INK, margin: '0 0 20px', letterSpacing: '-.02em', lineHeight: 1.05 }}>What do I call you?</h1>
          <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="First name" style={{ width: '100%', padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${LINE}`, fontSize: 18, outline: 'none', fontFamily: SANS }} />
          <p style={{ fontSize: 12, color: MUTE, margin: '10px 2px 0' }}>I'll use it occasionally — not in every sentence, don't worry.</p>
        </div>
      </div>
      <footer style={{ padding: '14px 20px 28px', display: 'flex', gap: 10, background: '#FFF', borderTop: `1px solid ${LINE}` }}>
        <PrimaryBtn disabled={!name.trim()} onClick={() => onNext(name.trim())}>Continue →</PrimaryBtn>
      </footer>
    </div>
  )
}

/* =============================================================
 * ONBOARDING — 4 sections
 * ============================================================= */
type OnbStep = 0 | 1 | 2 | 3
const STEP_LABELS = ['ABOUT YOU', 'YOUR FOOD', 'HOW YOU COOK', 'YOUR USUALS']

function OnboardingScreen({ initial, onDone, onBack, jumpTo }: { initial: CoachProfile; onDone: (p: CoachProfile) => void; onBack?: () => void; jumpTo?: OnbStep }) {
  const [p, setP] = useState<CoachProfile>(initial)
  const [step, setStep] = useState<OnbStep>(jumpTo ?? 0)
  const [foodGroupIdx, setFoodGroupIdx] = useState(0)

  const patch = (x: Partial<CoachProfile>) => setP(prev => { const n = { ...prev, ...x }; saveProfile(n); return n })

  const toggleRestriction = (id: string) => {
    if (id === 'none') { patch({ restrictions: ['none'] }); return }
    const cur = p.restrictions.filter(r => r !== 'none')
    patch({ restrictions: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] })
  }
  const toggleArr = (key: 'style' | 'usuals', id: string) => {
    const cur = p[key]
    patch({ [key]: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] } as Partial<CoachProfile>)
  }

  const next = () => {
    if (step === 1 && foodGroupIdx < FOOD_GROUPS.length - 1) { setFoodGroupIdx(foodGroupIdx + 1); return }
    if (step < 3) { setStep((step + 1) as OnbStep); return }
    const done = { ...p, completed: true }
    saveProfile(done); onDone(done)
  }
  const back = () => {
    if (step === 1 && foodGroupIdx > 0) { setFoodGroupIdx(foodGroupIdx - 1); return }
    if (step > 0) setStep((step - 1) as OnbStep)
    else onBack?.()
  }

  const totalUnits = 1 + FOOD_GROUPS.length + 1 + 1
  const current = step === 0 ? 0 : step === 1 ? 1 + foodGroupIdx : step === 2 ? 1 + FOOD_GROUPS.length : totalUnits - 1
  const progress = ((current + 1) / totalUnits) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#FFF', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ padding: '14px 18px 10px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          {(step > 0 || onBack) && <button onClick={back} style={{ background: 'none', border: 'none', color: INK, fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>}
          <div style={{ flex: 1 }}>
            <BrandHeader small />
          </div>
          <div style={{ fontSize: 10, letterSpacing: '.22em', fontWeight: 700, color: MUTE }}>{STEP_LABELS[step]}</div>
        </div>
        <div style={{ height: 3, background: LINE_SOFT, borderRadius: 2 }}>
          <div style={{ height: 3, background: PINK, width: `${progress}%`, borderRadius: 2, transition: 'width .25s' }} />
        </div>
      </header>

      <main className="pcc-fade" style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 140px' }} key={`${step}-${foodGroupIdx}`}>
        {step === 0 && (
          <>
            {/* Anything to avoid */}
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>Anything I need to avoid?</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 14px' }}>Allergies, intolerances, dietary restrictions — foods you MUST avoid. This is safety, kept separate from dislikes.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RESTRICTIONS.map(o => (
                <Chip key={o.id} selected={p.restrictions.includes(o.id)} onClick={() => toggleRestriction(o.id)}>{o.label}</Chip>
              ))}
            </div>
            {p.restrictions.includes('other') && (
              <input value={p.restrictionsOther} onChange={e => patch({ restrictionsOther: e.target.value })} placeholder="Tell me what to avoid…" style={{ marginTop: 12, width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
            )}

            {/* Milk */}
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, margin: '32px 0 6px' }}>What are we doing with milk?</h3>
            <p style={{ fontSize: 12, color: MUTE, lineHeight: 1.6, margin: '0 0 12px' }}>I'll generally favour unsweetened where suitable — no purity talk.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MILK_OPTIONS.map(o => (
                <Chip key={o.id} selected={p.milk === o.id} onClick={() => patch({ milk: o.id })}>{o.label}</Chip>
              ))}
            </div>
            {p.milk === 'other' && (
              <input value={p.milkOther} onChange={e => patch({ milkOther: e.target.value })} placeholder="Which one?" style={{ marginTop: 12, width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
            )}

            {/* Bone broth */}
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, margin: '32px 0 6px' }}>Bone broth — where are we?</h3>
            <p style={{ fontSize: 12, color: MUTE, lineHeight: 1.6, margin: '0 0 12px' }}>A useful direct collagen-delivering food (glycine, proline, hydroxyproline). Not a miracle — just handy anywhere you'd use stock: quinoa, rice, soups, stews, braises.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BONE_BROTH_OPTIONS.map(o => {
                const a = p.boneBroth === o.id
                return <button key={o.id} onClick={() => patch({ boneBroth: o.id })} style={{
                  textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${a ? INK : LINE}`,
                  background: a ? INK : '#FFF', color: a ? '#FFF' : INK, fontSize: 14, fontWeight: a ? 700 : 500, cursor: 'pointer',
                }}>{a ? '✓ ' : ''}{o.label}</button>
              })}
            </div>
          </>
        )}

        {step === 1 && (() => {
          const g = FOOD_GROUPS[foodGroupIdx]
          return (
            <>
              <div style={{ fontSize: 10, color: PINK, letterSpacing: '.22em', fontWeight: 700, marginBottom: 6 }}>YOUR FOOD — {foodGroupIdx + 1} / {FOOD_GROUPS.length}</div>
              <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>{g.title}</h2>
              <div style={{ display: 'inline-block', padding: '4px 10px', background: BABY, borderRadius: 50, fontSize: 10, letterSpacing: '.14em', fontWeight: 800, color: PINK_DEEP, marginBottom: 8 }}>{g.matrix} ✦</div>
              <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 8px' }}>{g.why}</p>
              <p style={{ fontSize: 12, color: MUTE, lineHeight: 1.6, margin: '0 0 6px', fontStyle: 'italic' }}>Tap how you feel about each — skip anything you don't know.</p>
              <div>
                {g.foods.map(f => (
                  <FoodPrefRow key={f.id} label={f.label} note={f.note} value={p.foods[f.id]} onChange={v => patch({ foods: { ...p.foods, [f.id]: v } })} />
                ))}
              </div>
            </>
          )
        })()}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>On a normal night, how long are we cooking?</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 16px' }}>I'll respect this. No 40-minute recipes if you said 15.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {COOK_TIME.map(o => {
                const a = p.cookTime === o.id
                return <button key={o.id} onClick={() => patch({ cookTime: o.id })} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${a ? INK : LINE}`,
                  background: a ? INK : '#FFF', color: a ? '#FFF' : INK, fontSize: 14, fontWeight: a ? 700 : 500, cursor: 'pointer',
                }}>{a ? '✓ ' : ''}{o.label}</button>
              })}
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, margin: '0 0 6px' }}>What sounds like you?</h3>
            <p style={{ fontSize: 13, color: MUTE, margin: '0 0 14px' }}>Pick as many as you like.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLE_OPTIONS.map(o => (
                <Chip key={o.id} selected={p.style.includes(o.id)} onClick={() => toggleArr('style', o.id)}>{o.label}</Chip>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>What do you nearly always have in?</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 18px' }}>Think of the bits you don't mention because they're just always there. Helps me build recipes around what you actually keep in.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {USUALS.map(o => (
                <Chip key={o.id} selected={p.usuals.includes(o.id)} onClick={() => toggleArr('usuals', o.id)}>{o.label}</Chip>
              ))}
            </div>
            <input value={p.usualsCustom} onChange={e => patch({ usualsCustom: e.target.value })} placeholder="Anything else always in? (comma separated)" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
          </>
        )}
      </main>

      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: `1px solid ${LINE}`, padding: '14px 20px 28px', display: 'flex', gap: 10 }}>
        {(step > 0 || (step === 0 && onBack)) && <GhostBtn onClick={back}>← Back</GhostBtn>}
        <PrimaryBtn onClick={next}>{step === 3 ? 'Finish ✦' : (step === 1 && foodGroupIdx < FOOD_GROUPS.length - 1 ? 'Next section →' : 'Continue →')}</PrimaryBtn>
      </footer>
    </div>
  )
}

/* =============================================================
 * RECIPE PARSING + SCORE BADGE
 * ============================================================= */
interface ParsedRecipe {
  name: string; time: string; serves: string; score: number; intro: string
  ingredients: string[]; method: string[]; why: string[]; boost: string[]
}
function parseRecipe(txt: string): { before: string; recipe: ParsedRecipe | null; after: string } {
  const m = txt.match(/===RECIPE===([\s\S]*?)===END===/)
  if (!m) return { before: txt, recipe: null, after: '' }
  const before = txt.slice(0, m.index).trim()
  const after = txt.slice((m.index || 0) + m[0].length).trim()
  const body = m[1]
  const get = (k: string) => (body.match(new RegExp(`^${k}:\\s*(.+)$`, 'im'))?.[1] || '').trim()
  const section = (k: string, next: string[]) => {
    const re = new RegExp(`${k}:\\s*\\n([\\s\\S]*?)(?=\\n(?:${next.join('|')}):|$)`, 'i')
    const s = body.match(re)?.[1] || ''
    return s.split('\n').map(l => l.replace(/^[-\d.]+\s*/, '').trim()).filter(Boolean)
  }
  return { before, recipe: {
    name: get('name') || 'Recipe',
    time: get('time'), serves: get('serves'),
    score: Number(get('score')) || 0,
    intro: get('intro'),
    ingredients: section('ingredients', ['method', 'why', 'boost']),
    method: section('method', ['why', 'boost']),
    why: section('why', ['boost']),
    boost: section('boost', ['zzz']),
  }, after }
}

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const off = c - (Math.max(0, Math.min(100, score)) / 100) * c
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LINE_SOFT} strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={PINK} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: size * 0.32, color: INK }}>{score}</div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: BABY_SOFT, border: `1px solid ${BABY}`, borderRadius: 14, margin: '8px 0' }}>
      <ScoreRing score={score} size={56} />
      <div>
        <div style={{ fontSize: 10, letterSpacing: '.16em', fontWeight: 800, color: PINK_DEEP }}>COLLAGEN COMPLETENESS ✦</div>
        <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.4, marginTop: 2 }}>Not a health rating — how much of the Matrix this covers.</div>
      </div>
    </div>
  )
}

function RecipeCard({ r }: { r: ParsedRecipe }) {
  return (
    <div style={{ background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 20, padding: 20, margin: '12px 0', boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
      <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 800, color: INK, margin: '0 0 4px', letterSpacing: '-.01em', lineHeight: 1.15 }}>{r.name}</h3>
      {r.intro && <p style={{ fontSize: 13, color: MUTE, margin: '0 0 14px', lineHeight: 1.6, fontStyle: 'italic' }}>{r.intro}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderTop: `1px solid ${LINE_SOFT}`, borderBottom: `1px solid ${LINE_SOFT}`, margin: '10px 0 14px' }}>
        <ScoreRing score={r.score} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {r.time && <div style={{ fontSize: 12, color: INK_SOFT }}><span style={{ color: MUTE, letterSpacing: '.1em', fontSize: 10, fontWeight: 700 }}>TIME</span>&nbsp;&nbsp;{r.time}</div>}
          {r.serves && <div style={{ fontSize: 12, color: INK_SOFT }}><span style={{ color: MUTE, letterSpacing: '.1em', fontSize: 10, fontWeight: 700 }}>SERVES</span>&nbsp;&nbsp;{r.serves}</div>}
          <div style={{ fontSize: 11, color: MUTE, fontStyle: 'italic' }}>Collagen completeness — not a health rating.</div>
        </div>
      </div>
      {r.ingredients.length > 0 && (
        <>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: INK, margin: '10px 0 8px' }}>Ingredients</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: INK_SOFT, lineHeight: 1.8 }}>
            {r.ingredients.map((i, k) => <li key={k}>{i}</li>)}
          </ul>
        </>
      )}
      {r.method.length > 0 && (
        <>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: INK, margin: '18px 0 8px' }}>Method</div>
          <ol style={{ margin: 0, paddingLeft: 22, fontSize: 14, color: INK_SOFT, lineHeight: 1.7 }}>
            {r.method.map((s, k) => <li key={k} style={{ marginBottom: 6 }}>{s}</li>)}
          </ol>
        </>
      )}
      {r.why.length > 0 && (
        <div style={{ marginTop: 18, padding: '12px 14px', background: BABY_SOFT, borderRadius: 12, border: `1px solid ${BABY}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em', color: PINK_DEEP, marginBottom: 6 }}>WHY IT WORKS</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: INK_SOFT, lineHeight: 1.6 }}>
            {r.why.map((w, k) => <li key={k}>{w}</li>)}
          </ul>
        </div>
      )}
      {r.boost.length > 0 && (
        <div style={{ marginTop: 10, padding: '10px 14px', border: `1px dashed ${LINE}`, borderRadius: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em', color: MUTE, marginBottom: 6 }}>OPTIONAL BOOST</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: INK_SOFT, lineHeight: 1.6 }}>
            {r.boost.map((b, k) => <li key={k}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

// Render text splitting out any `Collagen Score: N/100` lines as visual badges.
function TextWithScores({ text }: { text: string }) {
  if (!text) return null
  const re = /^\s*Collagen Score:\s*(\d{1,3})\s*\/\s*100\s*$/im
  const parts: ReactNode[] = []
  let rest = text
  let key = 0
  while (true) {
    const m = rest.match(re)
    if (!m || m.index === undefined) break
    const before = rest.slice(0, m.index).trim()
    if (before) parts.push(<div key={key++} style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, color: INK_SOFT }}>{before}</div>)
    parts.push(<ScoreBadge key={key++} score={Number(m[1])} />)
    rest = rest.slice(m.index + m[0].length)
  }
  const tail = rest.trim()
  if (tail) parts.push(<div key={key++} style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, color: INK_SOFT }}>{tail}</div>)
  return <>{parts}</>
}

function AssistantMessage({ content }: { content: string }) {
  const cleaned = formatAiResponse(content)
  const { before, recipe, after } = parseRecipe(cleaned)
  return (
    <>
      {before && <TextWithScores text={before} />}
      {recipe && <RecipeCard r={recipe} />}
      {after && <TextWithScores text={after} />}
    </>
  )
}

/* =============================================================
 * CHAT SCREEN
 * ============================================================= */
interface ChatMode {
  id: string
  title: string
  subtitle: string
  photo: boolean
  placeholder: string
  autoPrompt: string | null
  extraSystem?: string
}

const CHAT_MODES: Record<string, ChatMode> = {
  scan: {
    id: 'scan', title: 'Scan something', subtitle: 'Fridge, menu, recipe, label, shelf — whatever you found.',
    photo: true, placeholder: 'Anything to add? (optional)',
    autoPrompt: "Look at this image. Infer what it is (fridge / menu / recipe / label / product / shelf / buffet / meal / single food). If genuinely unclear, ask ONE short question. Otherwise: for a single scorable item use the compact meal format WITH a `Collagen Score: <n>/100` line. For a multi-item image (fridge/menu/shelf/buffet) give up to 3 individually scored picks — never a whole-image score. For a packaged product, end with ONE contextual next action (Just checking it / Show me a better swap / I'm eating it — build around it / Turn it into a meal).",
  },
  meal: {
    id: 'meal', title: 'Build me a meal', subtitle: "Tell me what you've got. I'll make it make sense.",
    photo: false, placeholder: "e.g. I've got salmon and half a broccoli",
    autoPrompt: null,
    extraSystem: 'User wants an actual recipe. Return a full recipe in the ===RECIPE=== block on the FIRST reply. Only ask ONE short question first if truly essential context is missing (e.g. cook time when profile says "ask"). Do NOT ask what the profile already answers. Respect cook time strictly.',
  },
  ask: {
    id: 'ask', title: 'Ask the Coach', subtitle: 'Collagen, food, choices, rubbish week — ask.',
    photo: false, placeholder: 'e.g. Is oat milk good for collagen?',
    autoPrompt: null,
    extraSystem: 'User may ask anything, including multi-day plans ("plan my week", "3 days of dinners"). If a multi-day plan is asked for, use the structured MULTI-DAY PLAN format and be honest that the plan won\'t be remembered next session.',
  },
}

function ChatScreen({ mode, profile, onBack }: { mode: ChatMode; profile: CoachProfile | null; onBack: () => void }) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [b64, setB64] = useState<string | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const handleFile = (file?: File) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    const r = new FileReader()
    r.onload = e => setB64((e.target?.result as string).split(',')[1])
    r.readAsDataURL(file)
  }

  const send = async () => {
    if (loading || (!input.trim() && !b64)) return
    setLoading(true)
    const content: any[] = []
    if (b64) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } })
    content.push({ type: 'text', text: input.trim() || mode.autoPrompt || '' })
    const msg = { role: 'user', displayText: input.trim() || (preview ? 'Photo sent ✓' : ''), imagePreview: preview, content }
    const updated = [...messages, msg]
    setMessages(updated); setInput(''); setPreview(null); setB64(null)
    try {
      const token = getStoredToken()
      if (!token) {
        setMessages(p => [...p, { role: 'assistant', content: 'Please use your secure access link to chat.' }])
        setLoading(false); return
      }
      const system = CORE_BRAIN + (mode.extraSystem ? `\n\nMODE: ${mode.extraSystem}` : '') + buildProfileBlock(profile)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ system, messages: updated.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      const reply = data.content?.find((b: any) => b.type === 'text')?.text || data.reply || "Well, that went a bit wonky. Try again — if it still sulks, type what you're looking at and I'll work from that."
      setMessages(p => [...p, { role: 'assistant', content: reply }])
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "Connection went a bit wobbly. Give it another go." }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ background: '#FFF', borderBottom: `1px solid ${LINE}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK, padding: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: MUTE, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>POCKET COLLAGEN COACH</div>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK }}>{mode.title}</div>
        </div>
      </header>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 100px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, margin: '0 0 6px' }}>{mode.title}</p>
            <p style={{ fontSize: 14, color: MUTE, margin: 0, lineHeight: 1.6 }}>{mode.subtitle}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            {m.imagePreview && <img src={m.imagePreview} alt="upload" style={{ maxWidth: 200, borderRadius: 12, border: `1px solid ${LINE}`, marginBottom: 6 }} />}
            {(m.displayText || m.role === 'assistant') && (
              <div style={m.role === 'user'
                ? { background: INK, color: '#FFF', borderRadius: '18px 18px 4px 18px', padding: '10px 14px', fontSize: 14, lineHeight: 1.5, maxWidth: '82%', fontWeight: 500 }
                : { background: '#FFF', color: INK_SOFT, border: `1px solid ${LINE}`, borderRadius: '18px 18px 18px 4px', padding: '14px 16px', maxWidth: '96%', width: '100%' }}>
                {m.role === 'user' ? m.displayText : <AssistantMessage content={m.content} />}
              </div>
            )}
          </div>
        ))}
        {loading && <ThinkingBubble />}
        <div ref={bottomRef} />
      </div>
      <div style={{ background: '#FFF', borderTop: `1px solid ${LINE}`, padding: '10px 12px 24px', flexShrink: 0 }}>
        {preview && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
            <img src={preview} alt="preview" style={{ height: 60, borderRadius: 8, border: `1px solid ${LINE}` }} />
            <button onClick={() => { setPreview(null); setB64(null) }} style={{ position: 'absolute', top: -6, right: -6, background: INK, border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#FFF', fontSize: 11, cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {mode.photo && (
            <>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
              <input ref={galleryRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
              <button onClick={() => cameraRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '8px 11px', fontSize: 16, cursor: 'pointer' }}>📷</button>
              <button onClick={() => galleryRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '8px 11px', fontSize: 16, cursor: 'pointer' }}>🖼️</button>
            </>
          )}
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder={mode.placeholder} rows={1} style={{ flex: 1, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: '10px 14px', fontSize: 14, resize: 'none', outline: 'none', minHeight: 42, maxHeight: 110, lineHeight: 1.5, fontFamily: SANS }} />
          <button onClick={send} disabled={loading || (!input.trim() && !b64)} style={{ border: 'none', borderRadius: 12, padding: '10px 16px', color: '#FFF', fontSize: 18, cursor: 'pointer', minHeight: 42, background: loading || (!input.trim() && !b64) ? '#D0D0D3' : PINK, fontWeight: 700 }}>→</button>
        </div>
      </div>
    </div>
  )
}

function ThinkingBubble() {
  const messages = ['Looking at your plate…', 'Checking BUILD, ACTIVATE, SUPPORT and PROTECT…', 'Nearly there…']
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % messages.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ display: 'flex', marginBottom: 12 }}>
      <div style={{ background: '#FFF', border: `1px solid ${LINE}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {[0, 1, 2].map(k => <span key={k} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: PINK, animation: `blink 1s ${k * 0.2}s infinite` }} />)}
        <span className="pcc-pulse" style={{ fontSize: 12, color: MUTE, fontStyle: 'italic' }}>{messages[i]}</span>
      </div>
    </div>
  )
}

/* =============================================================
 * TRACK MY FOOD
 * ============================================================= */
function TrackScreen({ profile, onBack }: { profile: CoachProfile | null; onBack: () => void }) {
  const [logs, setLogs] = useState<FoodLog[]>(() => loadLogs())
  const [text, setText] = useState('')
  const [meal, setMeal] = useState<FoodLog['meal']>('breakfast')
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const statuses = ['Looking at your plate…', 'Checking BUILD, ACTIVATE, SUPPORT and PROTECT…', 'Working out the picture…']

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setStatusIdx(i => (i + 1) % statuses.length), 2200)
    return () => clearInterval(t)
  }, [loading])

  const add = () => {
    const t = text.trim()
    if (!t) return
    // Duplicate prevention: same text within 60s
    const dup = logs.find(l => l.date === todayISO() && l.meal === meal && l.text.toLowerCase() === t.toLowerCase() && (Date.now() - new Date(l.createdAt).getTime()) < 60_000)
    if (dup) { setText(''); return }
    const entry: FoodLog = { id: crypto.randomUUID(), date: todayISO(), meal, text: t, createdAt: new Date().toISOString() }
    const next = [entry, ...logs]; setLogs(next); saveLogs(next); setText('')
  }
  const remove = (id: string) => { const n = logs.filter(l => l.id !== id); setLogs(n); saveLogs(n) }

  const today = logs.filter(l => l.date === todayISO())

  const analyseToday = async () => {
    if (!today.length) { setAnalysis("Nothing logged today yet — pop something in and I'll take a look."); return }
    setLoading(true); setAnalysis('')
    const summary = today.map(l => `${l.meal}: ${l.text}`).join('\n')
    const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    const prompt = `Today is ${dateLabel} (${todayISO()}). Here is what I logged TODAY:\n${summary}\n\nGive me TODAY'S COLLAGEN PICTURE. Practical, not clinical. Refer to it as TODAY (not yesterday). Include:\n- A rough score line exactly: Collagen Score: <n>/100 (the app will render a badge)\n- BUILD / ACTIVATE / SUPPORT / PROTECT — a short line each\n- WHAT WENT WELL\n- WHAT WAS QUIET\n- ONE OR TWO EASY MOVES for tomorrow — use my LOVE/LIKE foods silently, do NOT show preference labels.\nUse "quiet / not showing up" language. Never "deficient".`
    try {
      const token = getStoredToken()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ system: CORE_BRAIN + buildProfileBlock(profile), messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }] }),
      })
      const data = await res.json()
      setAnalysis(formatAiResponse(data.content?.find((b: any) => b.type === 'text')?.text || data.reply || ''))
    } catch { setAnalysis("Connection went a bit wobbly. Try again in a moment.") }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ padding: '14px 18px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: MUTE, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>POCKET COLLAGEN COACH</div>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK }}>Track my food</div>
        </div>
      </header>
      <main style={{ padding: '20px 18px 40px', maxWidth: 620, margin: '0 auto' }}>
        <p style={{ fontSize: 14, color: MUTE, margin: '0 0 14px', lineHeight: 1.6 }}>Tell me what you ate — conversationally. I'll spot the pattern.</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(m => (
            <Chip key={m} size="sm" selected={meal === m} onClick={() => setMeal(m)}>{m[0].toUpperCase() + m.slice(1)}</Chip>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); add() } }} placeholder="e.g. Greek yoghurt, raspberries & a spoon of honey" rows={2} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none', resize: 'none', fontFamily: SANS, lineHeight: 1.5 }} />
        <button onClick={add} disabled={!text.trim()} style={{ marginTop: 8, width: '100%', background: !text.trim() ? '#D0D0D3' : PINK, border: 'none', color: '#FFF', borderRadius: 12, padding: '12px 18px', fontWeight: 800, fontSize: 14, letterSpacing: '.06em', cursor: !text.trim() ? 'not-allowed' : 'pointer' }}>LOG IT ✦</button>

        <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
          <PrimaryBtn onClick={analyseToday}>Today's picture</PrimaryBtn>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: BABY_SOFT, border: `1px solid ${BABY}`, borderRadius: 14, marginBottom: 14 }}>
            {[0, 1, 2].map(k => <span key={k} style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: PINK, animation: `blink 1s ${k * 0.2}s infinite` }} />)}
            <span className="pcc-pulse" style={{ fontSize: 13, color: INK_SOFT, fontStyle: 'italic' }}>{statuses[statusIdx]}</span>
          </div>
        )}
        {analysis && (
          <div style={{ padding: 16, background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 16, marginBottom: 24, fontSize: 14, lineHeight: 1.7, color: INK_SOFT }}>
            <TextWithScores text={analysis} />
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: MUTE, marginBottom: 10 }}>TODAY</div>
        {today.length === 0 && <div style={{ fontSize: 13, color: MUTE, marginBottom: 20 }}>Nothing logged yet.</div>}
        {today.map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${LINE}`, borderRadius: 12, marginBottom: 8 }}>
            <div><div style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '.14em' }}>{l.meal.toUpperCase()}</div><div style={{ fontSize: 14 }}>{l.text}</div></div>
            <button onClick={() => remove(l.id)} style={{ background: 'none', border: 'none', color: MUTE, cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        ))}
      </main>
    </div>
  )
}

/* =============================================================
 * PROFILE
 * ============================================================= */
function ProfileScreen({ profile, onBack, onEdit, onStartOver, onEditName }: { profile: CoachProfile; onBack: () => void; onEdit: (step: OnbStep) => void; onStartOver: () => void; onEditName: () => void }) {
  const summary = {
    avoid: (profile.restrictions.filter(r => r !== 'none').map(id => RESTRICTIONS.find(o => o.id === id)?.label).filter(Boolean).join(', ') + (profile.restrictionsOther ? `, ${profile.restrictionsOther}` : '')) || 'No restrictions',
    food: `${Object.keys(profile.foods).length} foods rated`,
    cook: (COOK_TIME.find(o => o.id === profile.cookTime)?.label || '—') + ' · ' + profile.style.length + ' style tags',
    usuals: profile.usuals.length + (profile.usualsCustom ? ' + custom' : '') + ' staples',
  }
  const milkLabel = profile.milk === 'other' ? (profile.milkOther || 'Other') : (MILK_OPTIONS.find(o => o.id === profile.milk)?.label || '—')
  const brothLabel = BONE_BROTH_OPTIONS.find(o => o.id === profile.boneBroth)?.label || '—'
  const aboutSub = `${summary.avoid} · Milk: ${milkLabel} · Broth: ${brothLabel}`
  const sections: { step: OnbStep; title: string; sub: string }[] = [
    { step: 0, title: 'About you', sub: aboutSub },
    { step: 1, title: 'Your food', sub: summary.food },
    { step: 2, title: 'How you cook', sub: summary.cook },
    { step: 3, title: 'Your usuals', sub: summary.usuals },
  ]
  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ padding: '14px 18px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: MUTE, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>POCKET COLLAGEN COACH</div>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK }}>My profile</div>
        </div>
      </header>
      <main style={{ padding: '20px 18px', maxWidth: 560, margin: '0 auto' }}>
        <button onClick={onEditName} style={{
          width: '100%', textAlign: 'left', background: BABY_SOFT, border: `1px solid ${BABY}`, borderRadius: 16,
          padding: '16px 18px', marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>Your name</div>
            <div style={{ fontSize: 12, color: MUTE }}>{profile.firstName || 'Not set'}</div>
          </div>
          <span style={{ color: PINK, fontSize: 22 }}>›</span>
        </button>
        {sections.map(s => (
          <button key={s.step} onClick={() => onEdit(s.step)} style={{
            width: '100%', textAlign: 'left', background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 16,
            padding: '16px 18px', marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: MUTE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sub}</div>
            </div>
            <span style={{ color: PINK, fontSize: 22, marginLeft: 8 }}>›</span>
          </button>
        ))}
        <button onClick={() => { if (confirm('Start over? This clears your profile and repeats onboarding.')) onStartOver() }} style={{
          width: '100%', marginTop: 20, background: '#FFF', border: `1.5px dashed ${LINE}`, borderRadius: 16,
          padding: '14px 18px', fontSize: 13, fontWeight: 600, color: MUTE, cursor: 'pointer',
        }}>Start over</button>
      </main>
    </div>
  )
}

/* =============================================================
 * HOME
 * ============================================================= */
const HOME_ACTIONS = [
  { id: 'scan',  label: 'Scan something', sub: "Fridge, menu, recipe, label, shelf — whatever you've found." },
  { id: 'meal',  label: 'Build me a meal', sub: "Tell me what you've got. I'll make it make sense." },
  { id: 'track', label: 'Track my food', sub: "Tell me what you ate. I'll spot the pattern." },
  { id: 'ask',   label: 'Ask the Coach', sub: 'Collagen, food, choices, rubbish week. Ask me.' },
]

function HomeScreen({ profile, onOpen, onProfile }: { profile: CoachProfile; onOpen: (id: string) => void; onProfile: () => void }) {
  const title = profile.firstName ? `${profile.firstName}'s Collagen Coach` : 'Your Collagen Coach'
  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${LINE_SOFT}` }}>
        <BrandHeader small />
        <button onClick={onProfile} aria-label="My profile" style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 50, width: 40, height: 40, cursor: 'pointer', fontSize: 16, fontWeight: 700, color: INK }}>✦</button>
      </nav>

      <section style={{ padding: '28px 20px 12px', maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 800, color: INK, margin: '0 0 6px', letterSpacing: '-.02em', lineHeight: 1.05 }}>
          {title}<br /><span style={{ color: PINK, fontStyle: 'italic', fontSize: 26, fontWeight: 700 }}>What do you need?</span>
        </h1>
        <div style={{ width: 40, height: 3, background: INK, margin: '14px 0 12px' }} />
        <p style={{ fontSize: 13, color: MUTE, margin: 0, lineHeight: 1.6 }}>Four things I do. Pick one.</p>
      </section>

      <section style={{ padding: '16px 16px 40px', maxWidth: 620, margin: '0 auto' }}>
        {HOME_ACTIONS.map((a, i) => (
          <button key={a.id} onClick={() => onOpen(a.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 16,
            padding: '16px 16px', marginBottom: 10, textAlign: 'left', cursor: 'pointer',
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 12, background: i === 0 ? PINK : (i === 1 ? INK : BABY_SOFT), color: (i === 0 || i === 1) ? '#FFF' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{a.label}</span>
              <span style={{ display: 'block', fontSize: 12, color: MUTE, marginTop: 3, lineHeight: 1.4 }}>{a.sub}</span>
            </span>
            <span style={{ color: PINK, fontSize: 20, fontWeight: 700 }}>›</span>
          </button>
        ))}
        <p style={{ textAlign: 'center', fontSize: 10, color: MUTE, marginTop: 20, letterSpacing: '.08em' }}>Built on Coylah's 11-factor Collagen Matrix ✦</p>
      </section>
    </div>
  )
}

/* =============================================================
 * APP shell
 * ============================================================= */
type Screen =
  | { kind: 'loading' }
  | { kind: 'disclaimer' }
  | { kind: 'name' }
  | { kind: 'onboarding'; jumpTo?: OnbStep }
  | { kind: 'home' }
  | { kind: 'profile' }
  | { kind: 'chat'; mode: string }
  | { kind: 'track' }

function App() {
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [screen, setScreen] = useState<Screen>({ kind: 'loading' })

  useEffect(() => {
    const p = loadProfile()
    setProfile(p)
    if (!p.disclaimerAcceptedAt) setScreen({ kind: 'disclaimer' })
    else if (!p.firstName) setScreen({ kind: 'name' })
    else if (!p.completed) setScreen({ kind: 'onboarding' })
    else setScreen({ kind: 'home' })
  }, [])

  if (screen.kind === 'loading' || !profile) return <div style={{ minHeight: '100vh', background: '#FFF' }} />

  if (screen.kind === 'disclaimer') return <DisclaimerScreen onAccept={() => {
    const p = { ...profile, disclaimerAcceptedAt: new Date().toISOString() }
    saveProfile(p); setProfile(p); setScreen({ kind: 'name' })
  }} />

  if (screen.kind === 'name') return <NameScreen initial={profile.firstName} onNext={name => {
    const p = { ...profile, firstName: name }
    saveProfile(p); setProfile(p)
    setScreen(profile.completed ? { kind: 'profile' } : { kind: 'onboarding' })
  }} />

  if (screen.kind === 'onboarding') return <OnboardingScreen
    initial={profile}
    jumpTo={screen.jumpTo}
    onBack={profile.completed ? () => setScreen({ kind: 'profile' }) : undefined}
    onDone={p => { setProfile(p); setScreen(profile.completed ? { kind: 'profile' } : { kind: 'home' }) }}
  />

  if (screen.kind === 'profile') return <ProfileScreen
    profile={profile}
    onBack={() => setScreen({ kind: 'home' })}
    onEdit={step => setScreen({ kind: 'onboarding', jumpTo: step })}
    onEditName={() => setScreen({ kind: 'name' })}
    onStartOver={() => {
      const fresh = { ...EMPTY_PROFILE, disclaimerAcceptedAt: profile.disclaimerAcceptedAt }
      saveProfile(fresh); setProfile(fresh); setScreen({ kind: 'name' })
    }}
  />

  if (screen.kind === 'chat') {
    const mode = CHAT_MODES[screen.mode]
    if (!mode) { setScreen({ kind: 'home' }); return null }
    return <ChatScreen mode={mode} profile={profile} onBack={() => setScreen({ kind: 'home' })} />
  }

  if (screen.kind === 'track') return <TrackScreen profile={profile} onBack={() => setScreen({ kind: 'home' })} />

  return <HomeScreen
    profile={profile}
    onOpen={id => { if (id === 'track') setScreen({ kind: 'track' }); else setScreen({ kind: 'chat', mode: id }) }}
    onProfile={() => setScreen({ kind: 'profile' })}
  />
}