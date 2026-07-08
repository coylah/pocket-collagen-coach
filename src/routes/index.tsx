import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, type ReactElement, type ReactNode, type CSSProperties } from 'react'
import { formatAiResponse } from '../utils/formatAiResponse'
import { getStoredToken } from '../utils/useAuthToken'
import {
  FOOD_GROUPS, FOOD_LABEL, RESTRICTIONS, COOK_TIME, STYLE_OPTIONS, USUALS,
  EMPTY_PROFILE, type CoachProfile, type FoodPref, type FoodLog,
} from '../data/matrixFoods'

export const Route = createFileRoute('/')({ component: App })

/* =============================================================
 * COACH BRAIN — Matrix v3 (11-factor, 100pt). Culinary-first.
 * ============================================================= */

const CORE_BRAIN = `You are Coylah — a British skin specialist in the user's pocket. Not "AI". Don't market yourself as AI.

MATRIX v3 (internal reasoning framework — never a checklist to cram into every meal):
BUILD: 1) Protein/raw materials — glycine, proline, lysine (hydroxyproline & hydroxylysine are hydroxylated forms produced via vit C + iron; not raw materials).
ACTIVATE: 2) Vitamin C  3) Iron (both cofactors for hydroxylation).
SUPPORT: 4) Zinc  5) Copper  6) Manganese  7) Silica.
PROTECT: 8) Vitamin A  9) Omega-3  10) Antioxidants  11) Blood sugar stability.

SCORING (100 pts): Protein 20 | Vit C 15 | Iron 5 | Zinc 7 | Copper 7 | Manganese 4 | Silica 2 | Vit A 10 | Omega-3 10 | Antioxidants 10 | Blood sugar 10.
Score individual dishes/products/recipes only. NEVER a group score for a whole fridge/menu/shelf.

CULINARY-FIRST RULE (critical):
The Matrix is your BRAIN, not a checklist. Optimise in this order: 1) delicious 2) realistic 3) suits the user 4) collagen-supportive. A great 65/100 dinner beats an absurd 90/100 stuffed with sweet potato, seeds, citrus & every matrix food. Before adding any ingredient, ask internally: "would a good recipe writer genuinely put this in this dish?" If no, don't. Do NOT sprinkle seeds/nuts onto savoury meals just for SUPPORT points. Do NOT chase all 11 factors in one meal. It's fine to name a gap and let the week handle it — e.g. "Omega-3 isn't doing much here — that's fine, we'll get it elsewhere." Don't repeat that line mechanically.

VOICE:
British, direct, warm, cheeky, practical. Short sentences. Vary openings. Never start every reply with "Right, my lovely". "My lovely / behave / don't panic / girls, we need to have a word" are occasional flavour, not catchphrases. Never say "babe". Avoid: blueprint, reset, cure, anti-ageing, optimise your wellness, unlock, "here's the thing", "cracking", "for your skin".

SAFETY:
Never diagnose deficiencies — use "quiet / missing today / not showing up much / may be low in". Never "deficient / clinically low". Keep sensible warnings around liver + preformed vit A, Brazil nut selenium, GP referral for real concerns. Collagen powders: useful but not the whole matrix — never shame.

PERSONALISATION:
Respect MUST-AVOID absolutely (safety/allergy). Never suggest them. Do NOT confuse with dislikes.
LOVE — prioritise when useful. LIKE — use freely. IF IT FITS — use only when genuinely suits the dish or fills a real gap. NOT FOR ME — don't routinely recommend.
Never surface preference labels in output. No "(loves)" or "(likes)" tags.
Reference preferences occasionally & naturally, not every reply.
Match COOK TIME strictly: "15" means don't routinely propose 30-40 min recipes. "ask" → ask one short question when time materially affects the meal.
USUALS = pantry staples they already have. Use freely without adding to any shopping list.

DEFAULT ANSWER STYLE:
Concise. Answer the actual question. Don't lecture. No bloated intros. No forced signature phrases.

RECIPE OUTPUT FORMAT (only when giving an actual recipe):
When you give a recipe, emit exactly this fenced block (nothing else inside the fences):

===RECIPE===
name: <name>
time: <e.g. 20 minutes>
serves: <e.g. 2>
score: <0-100>
intro: <one short optional sentence, may be empty>
ingredients:
- <ingredient>
- <ingredient>
method:
1. <step>
2. <step>
why:
- BUILD — <factor(s) present, e.g. chicken>
- ACTIVATE — <only if genuinely relevant>
- SUPPORT — <only if genuinely relevant>
- PROTECT — <only if genuinely relevant>
boost:
- <max 2, only if genuinely coherent with the dish — otherwise omit this line>
===END===

Do NOT prefix ingredients with BUILD/ACTIVATE/SUPPORT/PROTECT. Do NOT add "(loves)" tags. Only include why-lines for factors that are actually present.

MEAL / SCAN RESPONSES (not full recipes) — use this compact structure:

<Optional 1-line Coylah reaction>
Collagen Score: <n>/100
Why it works: <one line>
Hits: <framework — factor list>
Missing: <framework — factor list>
Fix (optional): <one short idea, only if it makes sense>

For photos of multiple items (menu / fridge / shelf), give up to 3 individual scored picks — never a whole-image score.`

const buildProfileBlock = (p: CoachProfile | null) => {
  if (!p || !p.completed) return ''
  const L = FOOD_LABEL
  const bySet = (v: FoodPref) => Object.entries(p.foods).filter(([, x]) => x === v).map(([id]) => L[id] || id)
  const restr = p.restrictions.filter(r => r !== 'none').map(id => RESTRICTIONS.find(o => o.id === id)?.label).filter(Boolean)
  if (p.restrictionsOther) restr.push(p.restrictionsOther)
  const styleTxt = p.style.map(id => STYLE_OPTIONS.find(o => o.id === id)?.label).filter(Boolean).join('; ')
  const usualsTxt = [...p.usuals.map(id => USUALS.find(o => o.id === id)?.label).filter(Boolean), ...(p.usualsCustom ? [p.usualsCustom] : [])].join(', ')
  const cookTime = COOK_TIME.find(o => o.id === p.cookTime)?.label || ''
  const love = bySet('love'), like = bySet('like'), iff = bySet('if_it_fits'), no = bySet('not_for_me')
  const out: string[] = ['\n\nUSER PROFILE (invisible; do not name; do not surface preference labels):']
  if (restr.length) out.push(`MUST-AVOID (never suggest — safety): ${restr.join(', ')}`)
  if (cookTime) out.push(`COOK TIME PREFERENCE: ${cookTime}`)
  if (styleTxt) out.push(`STYLE: ${styleTxt}`)
  if (usualsTxt) out.push(`USUALS (pantry — free to use, do not add to shopping lists): ${usualsTxt}`)
  if (love.length) out.push(`LOVE: ${love.join(', ')}`)
  if (like.length) out.push(`LIKE: ${like.join(', ')}`)
  if (iff.length) out.push(`IF IT FITS: ${iff.join(', ')}`)
  if (no.length) out.push(`NOT FOR ME (dislike — don't routinely recommend, may acknowledge lightly): ${no.join(', ')}`)
  return out.join('\n')
}

/* =============================================================
 * DESIGN TOKENS — white-first, pink as accent
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

const GLOBAL_CSS = `*,*::before,*::after{box-sizing:border-box}body{margin:0;padding:0;font-family:${SANS};color:${INK};-webkit-font-smoothing:antialiased;background:#FFF}button{font-family:${SANS}}@keyframes blink{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.pcc-fade{animation:fade .25s ease both}`

/* =============================================================
 * Storage
 * ============================================================= */
const PROFILE_KEY = 'pcc_profile_v4'
const LOG_KEY = 'pcc_food_log_v1'

function loadProfile(): CoachProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...EMPTY_PROFILE }
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) }
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

const PREF_META: Record<FoodPref, { label: string; bg: string; fg: string; border: string }> = {
  love:       { label: 'Love',       bg: PINK,     fg: '#FFF', border: PINK },
  like:       { label: 'Like',       bg: BABY,     fg: INK,    border: PINK },
  if_it_fits: { label: 'If it fits', bg: '#EEE',   fg: INK,    border: INK_SOFT },
  not_for_me: { label: 'Not for me', bg: INK,      fg: '#FFF', border: INK },
}

function FoodPrefRow({ label, value, onChange }: { label: string; value: FoodPref | undefined; onChange: (v: FoodPref) => void }) {
  const opts: FoodPref[] = ['love', 'like', 'if_it_fits', 'not_for_me']
  return (
    <div style={{ padding: '12px 0', borderBottom: `1px solid ${LINE_SOFT}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {opts.map(o => {
          const active = value === o
          const m = PREF_META[o]
          return (
            <button key={o} onClick={() => onChange(o)} style={{
              padding: '7px 12px', borderRadius: 50,
              border: `1.5px solid ${active ? m.border : LINE}`,
              background: active ? m.bg : '#FFF',
              color: active ? m.fg : MUTE,
              fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer',
              boxShadow: active ? '0 2px 6px rgba(0,0,0,.08)' : 'none',
            }}>{active ? '✓ ' : ''}{m.label}</button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================================================
 * DISCLAIMER
 * ============================================================= */
function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: '#FFF', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ padding: '48px 24px 24px', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        <div style={{ color: PINK, fontSize: 10, letterSpacing: '.24em', fontWeight: 700, marginBottom: 12 }}>LOVE COYLAH ✦</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 800, color: INK, margin: '0 0 18px', letterSpacing: '-.02em', lineHeight: 1.05 }}>Before we get nosy…</h1>
        <div style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.7 }}>
          <p>Pocket Collagen Coach is an educational food tool.</p>
          <p>It does not provide medical or personalised nutritional advice and does not diagnose deficiencies, allergies or health conditions.</p>
          <p>If you have allergies, significant dietary requirements, a health condition, take medication, or have concerns about your nutrient intake, speak to your GP or a registered nutrition professional.</p>
          <p>You are responsible for checking ingredients, allergens and whether a food is suitable for you.</p>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 24, padding: '16px 18px', background: BABY_SOFT, borderRadius: 14, border: `1.5px solid ${checked ? PINK : LINE}`, cursor: 'pointer' }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: PINK, cursor: 'pointer' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>I understand and want to continue</span>
        </label>
        <div style={{ marginTop: 24, display: 'flex' }}>
          <PrimaryBtn disabled={!checked} onClick={onAccept}>Continue →</PrimaryBtn>
        </div>
      </div>
    </div>
  )
}

/* =============================================================
 * ONBOARDING — 4 sections: YOU, YOUR FOOD, HOW YOU COOK, YOUR USUALS
 * ============================================================= */
type OnbStep = 0 | 1 | 2 | 3
const STEP_LABELS = ['YOU', 'YOUR FOOD', 'HOW YOU COOK', 'YOUR USUALS']

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
  const prev = () => {
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
      <header style={{ padding: '18px 20px 10px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          {(step > 0 || onBack) && <button onClick={prev} style={{ background: 'none', border: 'none', color: INK, fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>}
          <div>
            <div style={{ color: PINK, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>SETTING YOU UP ✦</div>
            <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, marginTop: 2 }}>{STEP_LABELS[step]}</div>
          </div>
        </div>
        <div style={{ height: 3, background: LINE_SOFT, borderRadius: 2 }}>
          <div style={{ height: 3, background: PINK, width: `${progress}%`, borderRadius: 2, transition: 'width .25s' }} />
        </div>
      </header>

      <main className="pcc-fade" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 140px' }} key={`${step}-${foodGroupIdx}`}>
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>Anything I need to avoid?</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 18px' }}>Allergies, intolerances, dietary restrictions, or foods you MUST avoid. This is safety — separate from dislikes.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RESTRICTIONS.map(o => (
                <Chip key={o.id} selected={p.restrictions.includes(o.id)} onClick={() => toggleRestriction(o.id)}>{o.label}</Chip>
              ))}
            </div>
            {p.restrictions.includes('other') && (
              <input value={p.restrictionsOther} onChange={e => patch({ restrictionsOther: e.target.value })} placeholder="Tell me what to avoid…" style={{ marginTop: 14, width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize: 11, color: PINK, letterSpacing: '.18em', fontWeight: 700, marginBottom: 6 }}>YOUR FOOD — {foodGroupIdx + 1} / {FOOD_GROUPS.length}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>{FOOD_GROUPS[foodGroupIdx].title}</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 8px' }}>Tap how you feel about each — skip anything you don't know.</p>
            <div>
              {FOOD_GROUPS[foodGroupIdx].foods.map(f => (
                <FoodPrefRow key={f.id} label={f.label} value={p.foods[f.id]} onChange={v => patch({ foods: { ...p.foods, [f.id]: v } })} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-.01em' }}>On a normal night, how long are we cooking?</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 18px' }}>I'll respect this. No 40-minute recipes if you said 15.</p>
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
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 18px' }}>Think of the bits you don't mention because they're just always there. I'll use them without adding them to shopping lists.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {USUALS.map(o => (
                <Chip key={o.id} selected={p.usuals.includes(o.id)} onClick={() => toggleArr('usuals', o.id)}>{o.label}</Chip>
              ))}
            </div>
            <input value={p.usualsCustom} onChange={e => patch({ usualsCustom: e.target.value })} placeholder="Anything else always in your kitchen? (comma separated)" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
          </>
        )}
      </main>

      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: `1px solid ${LINE}`, padding: '14px 20px 28px', display: 'flex', gap: 10 }}>
        {(step > 0 || (step === 0 && onBack)) && <GhostBtn onClick={prev}>← Back</GhostBtn>}
        <PrimaryBtn onClick={next}>{step === 3 ? 'Finish ✦' : (step === 1 && foodGroupIdx < FOOD_GROUPS.length - 1 ? 'Next section →' : 'Continue →')}</PrimaryBtn>
      </footer>
    </div>
  )
}

/* =============================================================
 * RECIPE CARD (parses ===RECIPE=== ... ===END===)
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
  const recipe: ParsedRecipe = {
    name: get('name') || 'Recipe',
    time: get('time'),
    serves: get('serves'),
    score: Number(get('score')) || 0,
    intro: get('intro'),
    ingredients: section('ingredients', ['method', 'why', 'boost']),
    method: section('method', ['why', 'boost']),
    why: section('why', ['boost']),
    boost: section('boost', ['zzz']),
  }
  return { before, recipe, after }
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
          <div style={{ fontSize: 12, color: INK_SOFT }}><span style={{ color: MUTE, letterSpacing: '.1em', fontSize: 10, fontWeight: 700 }}>COLLAGEN SCORE</span>&nbsp;&nbsp;{r.score}/100</div>
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

function AssistantMessage({ content }: { content: string }) {
  const cleaned = formatAiResponse(content)
  const { before, recipe, after } = parseRecipe(cleaned)
  return (
    <>
      {before && <div style={{ fontSize: 14, lineHeight: 1.7, color: INK_SOFT, whiteSpace: 'pre-wrap' }}>{before}</div>}
      {recipe && <RecipeCard r={recipe} />}
      {after && <div style={{ fontSize: 14, lineHeight: 1.7, color: INK_SOFT, whiteSpace: 'pre-wrap', marginTop: 8 }}>{after}</div>}
    </>
  )
}

/* =============================================================
 * CHAT SCREEN — used by scan / build / ask / plan modes
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
    photo: true, placeholder: "Anything to add? (optional)",
    autoPrompt: "Look at this image. Infer what it is (fridge / menu / recipe / label / product / supermarket shelf / buffet / meal / other). If genuinely unclear, ask ONE short question. Otherwise give up to 3 individually scored picks or a single meal analysis using the compact meal format. Never a whole-image score.",
  },
  meal: {
    id: 'meal', title: 'Build me a meal', subtitle: "Tell me what you've got. I'll make it make sense.",
    photo: false, placeholder: "e.g. I've got salmon and half a broccoli",
    autoPrompt: null,
    extraSystem: 'The user wants an actual recipe. Return a full recipe in the ===RECIPE=== block on the first reply. If ONE essential piece of context is missing (e.g. meal type when unclear, or time budget when profile says "ask"), ask ONE short question first — otherwise just cook. Do not ask what the profile already answers.',
  },
  ask: {
    id: 'ask', title: 'Ask the Coach', subtitle: 'Collagen, food, choices, rubbish week — ask.',
    photo: false, placeholder: 'e.g. Is oat milk good for collagen?',
    autoPrompt: null,
  },
  plan: {
    id: 'plan', title: 'Plan my food', subtitle: 'Today, a few days, or the week.',
    photo: false, placeholder: 'e.g. Plan the week, dinners only, feeding 2',
    autoPrompt: null,
    extraSystem: 'The user wants a meal plan. Ask only the minimum missing context (horizon: today / 3 days / week; people; all meals or just dinners; any busy days; rough budget). Then produce a plan using ingredient overlap and sensible leftovers. After the plan, ask: "Want the shopping list?" — and if they say yes, produce a deduplicated shopping list EXCLUDING their USUALS.',
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
      const system = CORE_BRAIN + (mode.extraSystem ? `\n\nMODE: ${mode.extraSystem}` : '') + buildProfileBlock(profile)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ system, messages: updated.map(m => ({ role: m.role, content: m.content })) }),
      })
      if (!token) { setMessages(p => [...p, { role: 'assistant', content: 'Please use your secure access link to chat.' }]); setLoading(false); return }
      const data = await res.json()
      const reply = data.content?.find((b: any) => b.type === 'text')?.text || data.reply || 'Something went wrong.'
      setMessages(p => [...p, { role: 'assistant', content: reply }])
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection error. Try again.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ background: '#FFF', borderBottom: `1px solid ${LINE}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK, padding: 0 }}>←</button>
        <div>
          <div style={{ color: PINK, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>COACH ✦</div>
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
        {loading && (
          <div style={{ display: 'flex', marginBottom: 12 }}>
            <div style={{ background: '#FFF', border: `1px solid ${LINE}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px' }}>
              {[0, 1, 2].map(i => <span key={i} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: PINK, marginRight: 4, animation: `blink 1s ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
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
              <button onClick={() => cameraRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '8px 11px', fontSize: 18, cursor: 'pointer' }}>📷</button>
              <button onClick={() => galleryRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '8px 11px', fontSize: 18, cursor: 'pointer' }}>🖼️</button>
            </>
          )}
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder={mode.placeholder} rows={1} style={{ flex: 1, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: '10px 14px', fontSize: 14, resize: 'none', outline: 'none', minHeight: 42, maxHeight: 110, lineHeight: 1.5 }} />
          <button onClick={send} disabled={loading || (!input.trim() && !b64)} style={{ border: 'none', borderRadius: 12, padding: '10px 16px', color: '#FFF', fontSize: 18, cursor: 'pointer', minHeight: 42, background: loading || (!input.trim() && !b64) ? '#D0D0D3' : PINK, fontWeight: 700 }}>→</button>
        </div>
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

  const add = () => {
    if (!text.trim()) return
    const entry: FoodLog = { id: crypto.randomUUID(), date: todayISO(), meal, text: text.trim(), createdAt: new Date().toISOString() }
    const next = [entry, ...logs]; setLogs(next); saveLogs(next); setText('')
  }
  const remove = (id: string) => { const n = logs.filter(l => l.id !== id); setLogs(n); saveLogs(n) }

  const today = logs.filter(l => l.date === todayISO())
  const last7Dates = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10) })
  const weekLogs = logs.filter(l => last7Dates.includes(l.date))

  const analyse = async (scope: 'today' | 'week') => {
    const source = scope === 'today' ? today : weekLogs
    if (!source.length) { setAnalysis(`Nothing logged ${scope === 'today' ? 'today' : 'this week'} yet — pop something in and I'll take a look.`); return }
    setLoading(true); setAnalysis('')
    const summary = source.map(l => `${l.date} ${l.meal}: ${l.text}`).join('\n')
    const prompt = scope === 'today'
      ? `Here is what I logged today:\n${summary}\n\nGive me my DAILY COLLAGEN PICTURE. Practical, not clinical. Include:\n- TODAY'S SCORE (rough /100 based on what I logged)\n- BUILD / ACTIVATE / SUPPORT / PROTECT — a short line each\n- WHAT WENT WELL\n- WHAT WAS QUIET\n- ONE OR TWO EASY MOVES FOR TOMORROW (using my profile)\nUse "quiet / not showing up" language. Never "deficient".`
      : `Here is what I logged in the last 7 days:\n${summary}\n\nGive me my WEEKLY COLLAGEN PICTURE. Practical, based on what I actually logged. Include:\n- WEEKLY SCORE (rough /100)\n- STRONGEST AREA\n- WHAT'S BEEN QUIET\n- THE PATTERN I NOTICED\n- MY THREE JOBS NEXT WEEK (use my LOVE/LIKE foods and cook time)\nUse "practical score / food pattern / based on what you've logged". Never diagnose.`
    try {
      const token = getStoredToken()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ system: CORE_BRAIN + buildProfileBlock(profile), messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }] }),
      })
      const data = await res.json()
      setAnalysis(formatAiResponse(data.content?.find((b: any) => b.type === 'text')?.text || data.reply || ''))
    } catch { setAnalysis('Connection error. Try again in a moment.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ padding: '14px 18px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK }}>←</button>
        <div>
          <div style={{ color: PINK, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>COACH ✦</div>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK }}>Track my food</div>
        </div>
      </header>
      <main style={{ padding: '20px 18px 40px', maxWidth: 620, margin: '0 auto' }}>
        <p style={{ fontSize: 14, color: MUTE, margin: '0 0 14px', lineHeight: 1.6 }}>Tell me what you ate — conversationally. I'll spot the pattern.</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(m => (
            <Chip key={m} size="sm" selected={meal === m} onClick={() => setMeal(m)}>{m[0].toUpperCase() + m.slice(1)}</Chip>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') add() }} placeholder="e.g. Greek yoghurt & berries" style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14, outline: 'none' }} />
          <button onClick={add} style={{ background: PINK, border: 'none', color: '#FFF', borderRadius: 12, padding: '0 18px', fontWeight: 700, cursor: 'pointer' }}>+</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <PrimaryBtn onClick={() => analyse('today')}>Today's picture</PrimaryBtn>
          <PrimaryBtn onClick={() => analyse('week')}>How did my week look?</PrimaryBtn>
        </div>

        {loading && <div style={{ color: MUTE, fontSize: 13, marginBottom: 14 }}>Coylah's looking at your food…</div>}
        {analysis && (
          <div style={{ padding: 16, background: BABY_SOFT, border: `1px solid ${BABY}`, borderRadius: 14, marginBottom: 24, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, color: INK_SOFT }}>{analysis}</div>
        )}

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: MUTE, marginBottom: 10 }}>TODAY</div>
        {today.length === 0 && <div style={{ fontSize: 13, color: MUTE, marginBottom: 20 }}>Nothing logged yet.</div>}
        {today.map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${LINE}`, borderRadius: 12, marginBottom: 8 }}>
            <div><div style={{ fontSize: 10, color: PINK, fontWeight: 700, letterSpacing: '.14em' }}>{l.meal.toUpperCase()}</div><div style={{ fontSize: 14 }}>{l.text}</div></div>
            <button onClick={() => remove(l.id)} style={{ background: 'none', border: 'none', color: MUTE, cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        ))}

        {weekLogs.filter(l => l.date !== todayISO()).length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: MUTE, margin: '24px 0 10px' }}>EARLIER THIS WEEK</div>
            {weekLogs.filter(l => l.date !== todayISO()).map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: `1px solid ${LINE_SOFT}`, borderRadius: 12, marginBottom: 6 }}>
                <div><div style={{ fontSize: 10, color: MUTE, fontWeight: 700, letterSpacing: '.14em' }}>{l.date} · {l.meal.toUpperCase()}</div><div style={{ fontSize: 13 }}>{l.text}</div></div>
                <button onClick={() => remove(l.id)} style={{ background: 'none', border: 'none', color: MUTE, cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  )
}

/* =============================================================
 * PROFILE EDIT SCREEN
 * ============================================================= */
function ProfileScreen({ profile, onBack, onEdit, onStartOver }: { profile: CoachProfile; onBack: () => void; onEdit: (step: OnbStep) => void; onStartOver: () => void }) {
  const summary = {
    avoid: (profile.restrictions.filter(r => r !== 'none').map(id => RESTRICTIONS.find(o => o.id === id)?.label).filter(Boolean).join(', ') + (profile.restrictionsOther ? `, ${profile.restrictionsOther}` : '')) || 'No restrictions',
    food: `${Object.keys(profile.foods).length} foods rated`,
    cook: (COOK_TIME.find(o => o.id === profile.cookTime)?.label || '—') + ' · ' + profile.style.length + ' style tags',
    usuals: profile.usuals.length + (profile.usualsCustom ? ' + custom' : '') + ' staples',
  }
  const sections: { step: OnbStep; title: string; sub: string }[] = [
    { step: 0, title: 'Allergies & must-avoids', sub: summary.avoid },
    { step: 1, title: 'My food', sub: summary.food },
    { step: 2, title: 'How I cook', sub: summary.cook },
    { step: 3, title: 'My usuals', sub: summary.usuals },
  ]
  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ padding: '14px 18px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK }}>←</button>
        <div>
          <div style={{ color: PINK, fontSize: 10, letterSpacing: '.22em', fontWeight: 700 }}>COACH ✦</div>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK }}>My profile</div>
        </div>
      </header>
      <main style={{ padding: '20px 18px', maxWidth: 560, margin: '0 auto' }}>
        {sections.map(s => (
          <button key={s.step} onClick={() => onEdit(s.step)} style={{
            width: '100%', textAlign: 'left', background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 16,
            padding: '16px 18px', marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: MUTE }}>{s.sub}</div>
            </div>
            <span style={{ color: PINK, fontSize: 22 }}>›</span>
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
  { id: 'scan',  label: 'Scan something', sub: 'Fridge, menu, recipe, label, shelf.' },
  { id: 'meal',  label: 'Build me a meal', sub: "Tell me what you've got." },
  { id: 'plan',  label: 'Plan my food', sub: 'Today, a few days, or the week.' },
  { id: 'track', label: 'Track my food', sub: "Tell me what you ate. I'll spot the pattern." },
  { id: 'ask',   label: 'Ask the Coach', sub: 'Collagen, food, choices, rubbish week.' },
]

function HomeScreen({ profile, onOpen, onProfile }: { profile: CoachProfile; onOpen: (id: string) => void; onProfile: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF' }}>
      <style>{GLOBAL_CSS}</style>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${LINE_SOFT}` }}>
        <div>
          <div style={{ color: PINK, fontSize: 10, letterSpacing: '.24em', fontWeight: 700 }}>LOVE COYLAH ✦</div>
          <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: INK, marginTop: 2 }}>Pocket Collagen Coach</div>
        </div>
        <button onClick={onProfile} aria-label="My profile" style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 50, width: 40, height: 40, cursor: 'pointer', fontSize: 16, fontWeight: 700, color: INK }}>✦</button>
      </nav>

      <section style={{ padding: '28px 20px 12px', maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 800, color: INK, margin: '0 0 6px', letterSpacing: '-.02em', lineHeight: 1 }}>
          Hello.<br /><span style={{ color: PINK, fontStyle: 'italic' }}>What do you need?</span>
        </h1>
        <div style={{ width: 40, height: 3, background: INK, margin: '14px 0 12px' }} />
        <p style={{ fontSize: 13, color: MUTE, margin: 0, lineHeight: 1.6 }}>Five things I do. Pick one.</p>
      </section>

      <section style={{ padding: '16px 16px 40px', maxWidth: 620, margin: '0 auto' }}>
        {HOME_ACTIONS.map((a, i) => (
          <button key={a.id} onClick={() => onOpen(a.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 14,
            padding: '14px 16px', marginBottom: 10, textAlign: 'left', cursor: 'pointer',
          }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: i === 0 ? PINK : BABY_SOFT, color: i === 0 ? '#FFF' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{a.label}</span>
              <span style={{ display: 'block', fontSize: 12, color: MUTE, marginTop: 2 }}>{a.sub}</span>
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
 * APP shell — routes by state
 * ============================================================= */
type Screen =
  | { kind: 'loading' }
  | { kind: 'disclaimer' }
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
    else if (!p.completed) setScreen({ kind: 'onboarding' })
    else setScreen({ kind: 'home' })
  }, [])

  if (screen.kind === 'loading' || !profile) return <div style={{ minHeight: '100vh', background: '#FFF' }} />

  if (screen.kind === 'disclaimer') return <DisclaimerScreen onAccept={() => {
    const p = { ...profile, disclaimerAcceptedAt: new Date().toISOString() }
    saveProfile(p); setProfile(p); setScreen({ kind: 'onboarding' })
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
    onStartOver={() => {
      const fresh = { ...EMPTY_PROFILE, disclaimerAcceptedAt: profile.disclaimerAcceptedAt }
      saveProfile(fresh); setProfile(fresh); setScreen({ kind: 'onboarding' })
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

// suppress unused warnings for helper types
export type _Unused = CSSProperties | ReactElement
