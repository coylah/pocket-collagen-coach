import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, type ReactElement } from 'react'
import { formatAiResponse } from '../utils/formatAiResponse'
import { getStoredToken } from '../utils/useAuthToken'
import {
  FOOD_GROUPS,
  FOOD_LABEL,
  DIET_OPTIONS,
  STYLE_OPTIONS,
  PROTEIN_FREQ,
  OILY_FISH_FREQ,
  VITC_FREQ,
  SUPPLEMENT_USE,
  HELP_AREAS,
  EMPTY_PROFILE,
  type CoachProfile,
  type FoodPref,
} from '../data/matrixFoods'

export const Route = createFileRoute('/')({
  component: App,
})

/* ------------------------------------------------------------------ */
/* Coach brain — Matrix v3, 11 factors, 100-point score               */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are the Pocket Collagen Coach — Coylah in the user's pocket. Coylah is a British skin specialist with 10+ years experience and 4 years building the Collagen Kitchen Food Matrix.

Your job: help women eat for collagen every single day. At restaurants, supermarkets, hotels, at home.

THE COLLAGEN MATRIX v3 — BUILD / ACTIVATE / SUPPORT / PROTECT (11 factors)

BUILD — the raw materials for collagen.
 1. PROTEIN / collagen amino-acid raw materials — glycine, proline and lysine.
    Hydroxyproline and hydroxylysine are HYDROXYLATED forms produced through vitamin C and iron-dependent processes. They are not among the three core raw-material amino acids.
    Best sources: bone broth, gelatin, chicken skin, tuna, turkey, chicken, beef, salmon, sardines, prawns, eggs, Greek yoghurt, cottage cheese.

ACTIVATE — the two cofactors that switch collagen synthesis on.
 2. VITAMIN C — cofactor for prolyl hydroxylase and lysyl hydroxylase.
    Best sources: red pepper, yellow pepper, kale, kiwi, broccoli, strawberries, oranges. Raw preserves more.
 3. IRON — cofactor for the same hydroxylation enzymes as vitamin C.
    Best sources: liver (see safety), red meat, sardines, lentils, spinach (pair with vit C).

SUPPORT — the cofactors that build, cross-link and finish collagen tissue.
 4. ZINC — enzyme activity for collagen formation and tissue repair. Oysters, pumpkin seeds, beef, cashews, lentils, dark chocolate 70%+.
 5. COPPER — lysyl oxidase and collagen cross-linking. Oysters, sesame/tahini, cashews, dark chocolate 70%+, walnuts.
 6. MANGANESE — amino-acid metabolism and extracellular matrix processes. Pumpkin seeds, oats, walnuts, pineapple, chickpeas.
 7. SILICA — supports connective tissue and collagen-related structure. Do NOT overstate silica as an essential direct collagen synthesis cofactor. Oats, brown rice, cucumber, sweet potato, strawberries.

PROTECT — the wider environment around collagen maintenance. These reduce drivers of collagen breakdown (oxidative stress, inflammation, glycation). Do NOT claim they directly synthesise collagen.
 8. VITAMIN A — sweet potato, carrots, butternut squash, spinach, egg yolk. Fat-soluble — pair with a healthy fat.
 9. OMEGA-3 — mackerel, salmon, sardines, chia seeds, flaxseed, walnuts.
10. ANTIOXIDANTS — cooked tomatoes (lycopene), pomegranate, berries, dark chocolate, olive oil, green tea, herbs.
11. BLOOD SUGAR STABILITY — oats, lentils, chickpeas, quinoa, brown rice, sweet potato, leafy greens.

SCORING — 100-POINT COLLAGEN SCORE
BUILD:    Protein / raw materials 20
ACTIVATE: Vitamin C 15, Iron 5
SUPPORT:  Zinc 7, Copper 7, Manganese 4, Silica 2
PROTECT:  Vitamin A 10, Omega-3 10, Antioxidants 10, Blood sugar stability 10
TOTAL = 100.

Score every individual meal, dish, product or recipe. NEVER score a whole menu, whole fridge, whole supermarket shelf or a group of options overall.

Assess against all 11 factors, but do NOT invent laboratory-level nutrient precision from a photo or vague menu description. Scores are practical comparative estimates based on visible or stated ingredients.

Think through BUILD / ACTIVATE / SUPPORT / PROTECT internally. In the user-facing answer keep it short and useful.

RECOMMENDATION FORMAT — use this exact structure for each recommended dish/product/recipe:

1. Dish or product name
Collagen Score: 82/100

Why it's good:
Short explanation.

How to maximise it:
Short practical improvement.

Hits: BUILD — protein | ACTIVATE — vitamin C | PROTECT — omega-3

Missing: SUPPORT — copper | PROTECT — antioxidants

Where useful, tag Hits and Missing with both the framework position and the nutrient/factor. Do not turn every answer into a science lecture.

COYLAH VOICE
British English. Warm, direct, cheeky, practical, knowledgeable. Short answers. Never preachy. Never clinical unless safety requires it. Never generic wellness language.

Signature phrases you MAY use where they genuinely fit — do not force them into every reply:
 "Girls, we need to have a word." · "Don't panic." · "Behave." · "My lovely." · "Don't hate me but…" · "Right. Here's what we're doing."

Never call the user "babe".

Avoid: blueprint, reset, cure, anti-ageing, optimise your wellness, unlock your potential, "here's the thing".

Food-first. Science-led. Practical. Do NOT market or repeatedly describe yourself as AI.

SAFETY / SCIENCE
Do not diagnose nutrient deficiencies from photos, quiz answers or conversations. Use language such as "may be low in", "this meal is missing", "you don't seem to be getting much of" — NOT "you are deficient".

Preserve sensible safety warnings around:
 - liver and preformed vitamin A
 - pregnancy and liver / vitamin A
 - Brazil nuts and excessive selenium
 - significant dietary or health concerns requiring a GP or registered nutrition professional

On collagen powders: collagen peptides may provide useful collagen-derived peptides and amino acids, but they are not the whole collagen nutrition picture and do not replace the wider food matrix. Do NOT claim they "don't work". Never shame someone who takes them.

PERSONALISATION — read the USER PROFILE block if provided.
Combine the three layers when recommending:
 MATRIX HABITS  — identifies likely gaps
 FOOD PREFERENCES — identifies what to use to close those gaps
 COOKING & EATING STYLE — identifies how to deliver the advice

Rules:
 - Respect restrictions absolutely. Never suggest anything that conflicts.
 - LOVE IT foods: prioritise when they close a matrix gap.
 - HAPPY TO EAT IT: use freely.
 - IF IT WORKS: suggest occasionally when genuinely useful, ideally with a practical prep or pairing.
 - ABSOLUTELY NOT: do not recommend as the normal solution. Acknowledge lightly in Coylah voice when it fits (e.g. "Don't panic, I'm not about to make you eat Brussels sprout purée."). Do not do this in every reply.
 - Match the delivery to their style: under-20-min / minimal effort → quick, low-faff. Budget → cheap options. Batch cooking → scale-up. On the go → grab-and-go swaps.
 - Combine signals. Low oily fish + salmon LOVE + under-20-min → quick salmon omega-3 idea. Low ACTIVATE + red pepper NO + kiwi LOVE → kiwi (or another liked vitamin C food), not red pepper. Low protein + minimal effort + Greek yoghurt LOVE → yoghurt / skyr / cottage cheese, not "cook steak".
 - Never shame supplement users. If they use collagen powder, explain what the wider matrix adds.
 - Never diagnose. Never lecture.

WHEN ANALYSING PHOTOS: identify factors present, what's missing, and give clear practical recommendations. Score individual dishes/products only — never one overall score for the whole photo.`

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const PINK = '#FF2E8A'
const PINK_DEEP = '#E01B75'
const BABY = '#FFE4EF'
const BABY_SOFT = '#FFF3F8'
const INK = '#0A0A0A'
const INK_SOFT = '#1A1A1A'
const MUTE = '#6B6B6B'
const LINE = '#F0D9E4'
const SANS = "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const SERIF = "'Playfair Display', Georgia, serif"

const GLOBAL_CSS = `*, *::before, *::after { box-sizing: border-box; } body { margin: 0; padding: 0; font-family: ${SANS}; color: ${INK}; -webkit-font-smoothing: antialiased; } @keyframes blink { 0%,100%{opacity:.25;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }`

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function makeIcon(size: number, path: ReactElement) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={PINK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  )
}

const ICON_PATHS: Record<string, ReactElement> = {
  fridge: (<><rect x="6" y="3" width="16" height="22" rx="2"/><line x1="6" y1="11" x2="22" y2="11"/><line x1="11" y1="7" x2="11" y2="9"/><line x1="11" y1="15" x2="11" y2="20"/></>),
  menu: (<><rect x="5" y="3" width="18" height="22" rx="2"/><line x1="9" y1="9" x2="19" y2="9"/><line x1="9" y1="14" x2="19" y2="14"/><line x1="9" y1="19" x2="15" y2="19"/></>),
  supermarket: (<><rect x="4" y="6" width="20" height="16" rx="2"/><line x1="4" y1="11" x2="24" y2="11"/><line x1="9" y1="6" x2="9" y2="22"/><line x1="14" y1="6" x2="14" y2="22"/><line x1="19" y1="6" x2="19" y2="22"/></>),
  recipe: (<><path d="M8 20 C8 20 7 12 14 12 C21 12 20 20 20 20"/><line x1="6" y1="20" x2="22" y2="20"/><line x1="14" y1="12" x2="14" y2="8"/><path d="M11 8 C11 8 11 5 14 5 C17 5 17 8 17 8"/></>),
  ask: (<><path d="M5 4 H23 A2 2 0 0 1 25 6 V17 A2 2 0 0 1 23 19 H15 L9 24 V19 H5 A2 2 0 0 1 3 17 V6 A2 2 0 0 1 5 4 Z"/><line x1="14" y1="9" x2="14" y2="14"/><circle cx="14" cy="16.5" r="0.75" fill={PINK}/></>),
  quiz: (<><rect x="4" y="3" width="20" height="22" rx="2"/><line x1="9" y1="9" x2="19" y2="9"/><polyline points="9,14 11.5,16.5 15.5,12"/><polyline points="9,20 11.5,22.5 15.5,18"/></>),
}

const ICONS: Record<string, ReactElement> = Object.fromEntries(
  Object.entries(ICON_PATHS).map(([k, p]) => [k, makeIcon(48, p)]),
)
const CARD_ICONS: Record<string, ReactElement> = Object.fromEntries(
  Object.entries(ICON_PATHS).map(([k, p]) => [k, makeIcon(28, p)]),
)

/* ------------------------------------------------------------------ */
/* Modes                                                               */
/* ------------------------------------------------------------------ */

interface Mode {
  id: string
  badge: string
  label: string
  description: string
  photo: boolean
  placeholder: string | null
  autoPrompt: string | null
}

const MODES: Mode[] = [
  { id: 'fridge', badge: 'PHOTO', label: "What's in my fridge?", description: "Snap your fridge or cupboard and I'll build you a collagen-rich meal from whatever's in there.", photo: true, placeholder: "Tell me what you've got...", autoPrompt: "I've taken a photo of my fridge or cupboard. What collagen-rich meals can I build? Walk me through BUILD, ACTIVATE, SUPPORT, PROTECT — what's there and what's missing." },
  { id: 'menu', badge: 'PHOTO', label: 'Scan a menu', description: "At a restaurant or hotel buffet? Photo the menu and I'll tell you exactly what to order for maximum collagen.", photo: true, placeholder: 'Or paste menu items here...', autoPrompt: "I've taken a photo of this menu. What should I order to hit the most collagen matrix factors? Give me your top picks and why — score each recommendation individually." },
  { id: 'supermarket', badge: 'PHOTO', label: 'Supermarket scan', description: "Snap a product label in the aisle and I'll tell you whether it earns a place in your collagen kitchen.", photo: true, placeholder: 'Or describe the product...', autoPrompt: "I've taken a photo of this product. Is it worth buying for collagen? What matrix factors does it hit and what does it miss?" },
  { id: 'recipe', badge: 'CHAT', label: 'Build me a recipe', description: "Tell me what you've got and I'll create a collagen-first recipe built around the matrix.", photo: false, placeholder: "e.g. salmon, red pepper, spinach, seeds...", autoPrompt: null },
  { id: 'ask', badge: 'CHAT', label: 'Ask me anything', description: 'Collagen questions answered in plain English. No fluff, no industry spin — just what actually works.', photo: false, placeholder: 'e.g. Is oat milk good for collagen?', autoPrompt: null },
  { id: 'quiz', badge: 'PERSONALISE', label: 'Your Coach profile', description: "The more you tell me, the more this feels like Coylah in your pocket. Set your habits, style and food preferences.", photo: false, placeholder: null, autoPrompt: null },
]

/* ------------------------------------------------------------------ */
/* Platform / install helpers                                          */
/* ------------------------------------------------------------------ */

const detectPlatform = () => {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as { standalone?: boolean }).standalone === true

function InstallModal({ onDismiss }: { onDismiss: () => void }) {
  const [platform, setPlatform] = useState<string | null>(null)
  useEffect(() => { setPlatform(detectPlatform()) }, [])

  const stepStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 14, fontFamily: SANS, fontSize: 14, color: INK_SOFT, lineHeight: 1.5 }
  const numStyle: React.CSSProperties = { background: PINK, color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.55)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: '#FFF', borderRadius: '24px 24px 0 0', padding: '32px 28px 48px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ fontFamily: SANS, color: PINK, fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, marginBottom: 8 }}>LOVE COYLAH ✦</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, marginBottom: 10, letterSpacing: '-0.01em' }}>Add me to your home screen</h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: MUTE, lineHeight: 1.6, marginBottom: 20 }}>One tap from your home screen. No browser bar. Feels like an app because it is one.</p>

        {platform === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {['📱 I\'m on iPhone / iPad', '🤖 I\'m on Android', '💻 I\'m on desktop'].map((label, i) => (
              <button key={i} onClick={() => setPlatform(['ios', 'android', 'other'][i])} style={{ background: BABY_SOFT, border: `1.5px solid ${BABY}`, borderRadius: 12, padding: '14px 18px', fontFamily: SANS, fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left', color: INK }}>{label}</button>
            ))}
          </div>
        )}

        {platform === 'ios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={stepStyle}><span style={numStyle}>1</span><span>Tap the <strong>Share button ⎋</strong> at the bottom of Safari</span></div>
            <div style={stepStyle}><span style={numStyle}>2</span><span>Tap <strong>"Add to Home Screen"</strong></span></div>
            <div style={stepStyle}><span style={numStyle}>3</span><span>Tap <strong>Add</strong> to confirm</span></div>
          </div>
        )}
        {platform === 'android' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={stepStyle}><span style={numStyle}>1</span><span>Tap the <strong>menu icon ⋮</strong> in Chrome</span></div>
            <div style={stepStyle}><span style={numStyle}>2</span><span>Tap <strong>"Add to Home screen"</strong></span></div>
            <div style={stepStyle}><span style={numStyle}>3</span><span>Rename to <strong>Collagen Coach</strong> then tap Add</span></div>
          </div>
        )}
        {platform === 'other' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={stepStyle}><span style={numStyle}>✓</span><span>Bookmark this page, or open on your phone to add to home screen.</span></div>
          </div>
        )}

        <button onClick={onDismiss} style={{ width: '100%', background: INK, color: '#fff', border: 'none', borderRadius: 50, padding: '16px 24px', fontFamily: SANS, fontSize: 15, fontWeight: 700, letterSpacing: '0.02em', cursor: 'pointer' }}>
          {platform ? "Got it — let's go ✦" : 'Maybe later'}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Chip primitives                                                     */
/* ------------------------------------------------------------------ */

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 50,
        border: `1.5px solid ${selected ? PINK : LINE}`,
        background: selected ? PINK : '#FFF',
        color: selected ? '#FFF' : INK_SOFT,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '0.005em',
      }}
    >
      {selected ? '✓ ' : ''}{children}
    </button>
  )
}

const PREF_META: Record<FoodPref, { label: string; emoji: string; bg: string; fg: string; border: string }> = {
  love:         { label: 'Love it',    emoji: '😍', bg: PINK,       fg: '#FFF', border: PINK },
  happy:        { label: 'Happy',      emoji: '🙂', bg: BABY,       fg: INK,    border: PINK },
  if_it_works:  { label: 'If it works',emoji: '🤷', bg: '#FFF',     fg: INK_SOFT, border: LINE },
  no:           { label: 'Nope',       emoji: '🚫', bg: INK,        fg: '#FFF', border: INK },
}

function FoodRow({ label, value, onChange }: { label: string; value: FoodPref | undefined; onChange: (v: FoodPref) => void }) {
  const opts: FoodPref[] = ['love', 'happy', 'if_it_works', 'no']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 0', borderBottom: `1px solid ${LINE}` }}>
      <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: INK, flex: 1, minWidth: 0 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {opts.map(o => {
          const active = value === o
          const meta = PREF_META[o]
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              aria-label={meta.label}
              title={meta.label}
              style={{
                width: 40, height: 40, borderRadius: 12,
                border: `1.5px solid ${active ? meta.border : LINE}`,
                background: active ? meta.bg : '#FFF',
                color: active ? meta.fg : INK_SOFT,
                fontSize: 18, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 2px 6px rgba(255,46,138,0.25)' : 'none',
                transition: 'all .12s',
              }}
            >
              {meta.emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* QuizScreen — three phases (Habits / Style / Foods)                  */
/* ------------------------------------------------------------------ */

function loadProfile(): CoachProfile {
  try {
    const raw = localStorage.getItem('pcc_preferences')
    if (!raw) return { ...EMPTY_PROFILE }
    const parsed = JSON.parse(raw)
    return { ...EMPTY_PROFILE, ...parsed, foods: { ...(parsed.foods || {}) } }
  } catch {
    return { ...EMPTY_PROFILE }
  }
}

function saveProfile(p: CoachProfile) {
  localStorage.setItem('pcc_preferences', JSON.stringify({ ...p, updatedAt: new Date().toISOString() }))
}

type Phase = 'habits' | 'style' | 'foods' | 'done'

function QuizScreen({ initial, onDone, onBack }: { initial: CoachProfile; onDone: (p: CoachProfile) => void; onBack: () => void }) {
  const [profile, setProfile] = useState<CoachProfile>(initial)
  const [phase, setPhase] = useState<Phase>('habits')
  const [habitStep, setHabitStep] = useState(0)
  const [foodGroup, setFoodGroup] = useState(0)

  const patch = (p: Partial<CoachProfile>) => setProfile(prev => {
    const next = { ...prev, ...p }
    saveProfile(next)
    return next
  })

  const toggleArray = (key: 'restrictions' | 'helpAreas' | 'style', id: string) => {
    const arr = profile[key]
    patch({ [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] } as Partial<CoachProfile>)
  }

  const setFood = (id: string, v: FoodPref) => {
    patch({ foods: { ...profile.foods, [id]: v } })
  }

  const complete = () => {
    const next = { ...profile, completed: true }
    saveProfile(next)
    onDone(next)
  }

  const habitSteps = [
    {
      title: 'Any dietary needs?',
      subtitle: "Select all that apply — I'll never suggest something that doesn't work for you.",
      body: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DIET_OPTIONS.map(o => (
            <Chip key={o.id} selected={profile.restrictions.includes(o.id)} onClick={() => toggleArray('restrictions', o.id)}>{o.label}</Chip>
          ))}
        </div>
      ),
    },
    {
      title: 'How many proper protein-containing meals a day?',
      subtitle: 'Meat, fish, eggs, dairy, tofu, decent legumes — the real stuff.',
      body: <SingleChoice options={PROTEIN_FREQ} value={profile.proteinFrequency} onChange={v => patch({ proteinFrequency: v })} />,
    },
    {
      title: 'How often oily fish?',
      subtitle: 'Salmon, sardines, mackerel, trout.',
      body: <SingleChoice options={OILY_FISH_FREQ} value={profile.oilyFishFrequency} onChange={v => patch({ oilyFishFrequency: v })} />,
    },
    {
      title: 'Vitamin C-rich food with meals?',
      subtitle: 'Peppers, kiwi, berries, broccoli, citrus.',
      body: <SingleChoice options={VITC_FREQ} value={profile.vitCFrequency} onChange={v => patch({ vitCFrequency: v })} />,
    },
    {
      title: 'Collagen powder or supplements?',
      subtitle: 'No judgement either way — helps me talk to you honestly.',
      body: <SingleChoice options={SUPPLEMENT_USE} value={profile.supplementUse} onChange={v => patch({ supplementUse: v })} />,
    },
    {
      title: 'Where do you most need help?',
      subtitle: 'Pick as many as you like.',
      body: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HELP_AREAS.map(o => (
            <Chip key={o.id} selected={profile.helpAreas.includes(o.id)} onClick={() => toggleArray('helpAreas', o.id)}>{o.label}</Chip>
          ))}
        </div>
      ),
    },
  ]

  const totalHabits = habitSteps.length
  const overallProgress =
    phase === 'habits' ? (habitStep / totalHabits) * 33 :
    phase === 'style' ? 33 + 10 :
    phase === 'foods' ? 55 + (foodGroup / FOOD_GROUPS.length) * 40 :
    100

  const currentHabit = habitSteps[habitStep]
  const currentGroup = FOOD_GROUPS[foodGroup]

  const nextHabit = () => {
    if (habitStep < totalHabits - 1) setHabitStep(habitStep + 1)
    else setPhase('style')
  }
  const prevHabit = () => {
    if (habitStep > 0) setHabitStep(habitStep - 1)
  }

  const nextFood = () => {
    if (foodGroup < FOOD_GROUPS.length - 1) setFoodGroup(foodGroup + 1)
    else complete()
  }
  const prevFood = () => {
    if (foodGroup > 0) setFoodGroup(foodGroup - 1)
    else setPhase('style')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF', fontFamily: SANS, display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>

      <header style={{ background: '#FFF', borderBottom: `1px solid ${LINE}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: PINK, padding: '0 4px' }}>←</button>
        <div>
          <div style={{ fontFamily: SANS, color: PINK, fontSize: 10, letterSpacing: '0.22em', fontWeight: 700 }}>LOVE COYLAH ✦</div>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: INK, marginTop: 2 }}>Your Coach profile</div>
        </div>
      </header>

      <div style={{ height: 3, background: BABY }}>
        <div style={{ height: 3, background: PINK, width: `${overallProgress}%`, transition: 'width .3s' }} />
      </div>

      <PhaseStrip phase={phase} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 160px' }}>
        {phase === 'habits' && currentHabit && (
          <>
            <div style={{ fontSize: 11, color: PINK, letterSpacing: '0.18em', fontWeight: 700, marginBottom: 8 }}>
              MATRIX HABITS — {habitStep + 1} of {totalHabits}
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{currentHabit.title}</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, marginBottom: 22 }}>{currentHabit.subtitle}</p>
            {currentHabit.body}
          </>
        )}

        {phase === 'style' && (
          <>
            <div style={{ fontSize: 11, color: PINK, letterSpacing: '0.18em', fontWeight: 700, marginBottom: 8 }}>COOKING & EATING STYLE</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Tell me how you actually eat.</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, marginBottom: 22 }}>Select all that sound like you. Pick as many as you like.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLE_OPTIONS.map(o => (
                <Chip key={o.id} selected={profile.style.includes(o.id)} onClick={() => toggleArray('style', o.id)}>{o.label}</Chip>
              ))}
            </div>
          </>
        )}

        {phase === 'foods' && currentGroup && (
          <>
            <div style={{ fontSize: 11, color: PINK, letterSpacing: '0.18em', fontWeight: 700, marginBottom: 8 }}>
              FOOD PREFERENCES — {foodGroup + 1} of {FOOD_GROUPS.length}
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, marginBottom: 6, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{currentGroup.title}</h2>
            <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, marginBottom: 6 }}>{currentGroup.blurb}</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 11, color: MUTE, fontWeight: 500, flexWrap: 'wrap' }}>
              <span>😍 Love</span><span>🙂 Happy</span><span>🤷 If it works</span><span>🚫 Nope</span>
            </div>
            <div>
              {currentGroup.foods.map(f => (
                <FoodRow key={f.id} label={f.label} value={profile.foods[f.id]} onChange={v => setFood(f.id, v)} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: `1px solid ${LINE}`, padding: '14px 20px 32px' }}>
        {phase === 'habits' && (
          <div style={{ display: 'flex', gap: 10 }}>
            {habitStep > 0 && <SecondaryBtn onClick={prevHabit}>← Back</SecondaryBtn>}
            <PrimaryBtn onClick={nextHabit}>{habitStep < totalHabits - 1 ? 'Next →' : 'Continue to style →'}</PrimaryBtn>
          </div>
        )}
        {phase === 'style' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <SecondaryBtn onClick={() => setPhase('habits')}>← Back</SecondaryBtn>
            <PrimaryBtn onClick={() => setPhase('foods')}>Continue to food map →</PrimaryBtn>
          </div>
        )}
        {phase === 'foods' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <SecondaryBtn onClick={prevFood}>← Back</SecondaryBtn>
            <PrimaryBtn onClick={nextFood}>{foodGroup < FOOD_GROUPS.length - 1 ? 'Next section →' : 'Save my profile ✦'}</PrimaryBtn>
          </div>
        )}
      </footer>
    </div>
  )
}

function PhaseStrip({ phase }: { phase: Phase }) {
  const items: { key: Phase; label: string }[] = [
    { key: 'habits', label: 'Habits' },
    { key: 'style', label: 'Style' },
    { key: 'foods', label: 'Foods' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, padding: '10px 20px', borderBottom: `1px solid ${LINE}`, background: BABY_SOFT }}>
      {items.map(it => {
        const active = it.key === phase
        return (
          <div key={it.key} style={{
            flex: 1, textAlign: 'center', padding: '6px 8px', borderRadius: 50,
            fontSize: 11, letterSpacing: '0.12em', fontWeight: 700,
            background: active ? PINK : 'transparent',
            color: active ? '#FFF' : MUTE,
          }}>{it.label.toUpperCase()}</div>
        )
      })}
    </div>
  )
}

function SingleChoice({ options, value, onChange }: { options: { id: string; label: string }[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(o => {
        const active = value === o.id
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            textAlign: 'left', padding: '14px 16px', borderRadius: 14,
            border: `1.5px solid ${active ? PINK : LINE}`,
            background: active ? PINK : '#FFF',
            color: active ? '#FFF' : INK,
            fontFamily: SANS, fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>{active ? '✓ ' : ''}{o.label}</button>
        )
      })}
    </div>
  )
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: INK, color: '#FFF', border: 'none', borderRadius: 50,
      padding: '16px 20px', fontFamily: SANS, fontSize: 14, fontWeight: 700,
      letterSpacing: '0.03em', cursor: 'pointer',
    }}>{children}</button>
  )
}
function SecondaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      background: '#FFF', color: INK, border: `1.5px solid ${LINE}`, borderRadius: 50,
      padding: '16px 18px', fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    }}>{children}</button>
  )
}

/* ------------------------------------------------------------------ */
/* Score badge, recommendation card, assistant message parsing         */
/* ------------------------------------------------------------------ */

function CollagenScoreBadge({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)))
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeScore / 100) * circumference
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke={BABY} strokeWidth="8" />
          <circle cx="36" cy="36" r={radius} fill="none" stroke={PINK} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 36 36)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1 }}>{safeScore}</div>
          <div style={{ fontFamily: SANS, fontSize: 9, color: MUTE, lineHeight: 1 }}>/100</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: INK, marginBottom: 2 }}>Collagen Score</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: MUTE, lineHeight: 1.4 }}>Across the 11-factor Collagen Matrix.</div>
      </div>
    </div>
  )
}

function parseAssistantResponse(content: string) {
  const formatted = formatAiResponse(content)
  const lines = formatted.split('\n').map(l => l.trim()).filter(Boolean)
  const intro: string[] = []
  const cards: Array<{ title: string; score: number; body: string[] }> = []
  let current: { title: string; score: number; body: string[] } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const scoreMatch = line.match(/^Collagen Score:\s*(\d{1,3})\/100$/i)
    const numberedTitleMatch = line.match(/^(\d+)\.\s*(.+)$/)

    if (numberedTitleMatch && lines[i + 1]?.match(/^Collagen Score:\s*\d{1,3}\/100$/i)) {
      if (current) cards.push(current)
      const nextScore = lines[i + 1].match(/^Collagen Score:\s*(\d{1,3})\/100$/i)
      current = { title: numberedTitleMatch[2], score: Number(nextScore?.[1] || 0), body: [] }
      i++
      continue
    }
    if (scoreMatch && current) { current.score = Number(scoreMatch[1]); continue }
    if (current) current.body.push(line)
    else intro.push(line)
  }
  if (current) cards.push(current)
  return { intro: intro.join('\n\n'), cards }
}

function RecommendationCard({ title, score, body }: { title: string; score: number; body: string[] }) {
  const bodyText = body.join('\n\n')
    .replace(/^Why it’s good:/gim, 'Why it’s good')
    .replace(/^Why it's good:/gim, "Why it's good")
    .replace(/^How to maximise it:/gim, 'How to maximise it')
    .replace(/^How to maximise:/gim, 'How to maximise it')
    .replace(/^Hits:/gim, 'Hits')
    .replace(/^Missing:/gim, 'Missing')

  return (
    <div style={{
      background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 18,
      padding: '16px 16px 18px', margin: '16px 0',
      boxShadow: '0 6px 18px rgba(255,46,138,0.08)',
    }}>
      <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</div>
      <CollagenScoreBadge score={score} />
      <div style={{ height: 1, background: LINE, margin: '12px 0 14px' }} />
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.7, color: INK_SOFT, whiteSpace: 'pre-wrap' }}>{bodyText}</div>
    </div>
  )
}

function AssistantMessage({ content }: { content: string }) {
  const { intro, cards } = parseAssistantResponse(content)
  if (!cards.length) return <span>{formatAiResponse(content)}</span>
  return (
    <>
      {intro && (
        <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.7, color: INK_SOFT, whiteSpace: 'pre-wrap', marginBottom: 8 }}>{intro}</div>
      )}
      {cards.map((card, i) => (
        <RecommendationCard key={i} title={card.title} score={card.score} body={card.body} />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Profile → prompt block                                              */
/* ------------------------------------------------------------------ */

function labelsFromIds(ids: string[], opts: { id: string; label: string }[]) {
  return ids.map(id => opts.find(o => o.id === id)?.label).filter(Boolean).join(', ')
}
function labelFromId(id: string | null, opts: { id: string; label: string }[]) {
  if (!id) return ''
  return opts.find(o => o.id === id)?.label ?? ''
}

function buildProfileBlock(p: CoachProfile | null): string {
  if (!p || !p.completed) return ''
  const lines: string[] = ['\n\nUSER PROFILE — personalise around this without mentioning the profile itself.']

  lines.push('\nMATRIX HABITS:')
  if (p.restrictions.length) lines.push(`- Restrictions: ${labelsFromIds(p.restrictions, DIET_OPTIONS)}. Never suggest anything conflicting.`)
  if (p.proteinFrequency) lines.push(`- Protein meals per day: ${labelFromId(p.proteinFrequency, PROTEIN_FREQ)}`)
  if (p.oilyFishFrequency) lines.push(`- Oily fish frequency: ${labelFromId(p.oilyFishFrequency, OILY_FISH_FREQ)}`)
  if (p.vitCFrequency) lines.push(`- Vit C-rich food with meals: ${labelFromId(p.vitCFrequency, VITC_FREQ)}`)
  if (p.supplementUse) lines.push(`- Collagen supplements: ${labelFromId(p.supplementUse, SUPPLEMENT_USE)}`)
  if (p.helpAreas.length) lines.push(`- Wants help with: ${labelsFromIds(p.helpAreas, HELP_AREAS)}`)

  if (p.style.length) {
    lines.push('\nCOOKING & EATING STYLE:')
    lines.push(`- ${labelsFromIds(p.style, STYLE_OPTIONS)}`)
  }

  const groupPref = (v: FoodPref) => Object.entries(p.foods)
    .filter(([, val]) => val === v)
    .map(([id]) => FOOD_LABEL[id] || id)

  const love = groupPref('love')
  const happy = groupPref('happy')
  const meh = groupPref('if_it_works')
  const no = groupPref('no')

  if (love.length || happy.length || meh.length || no.length) {
    lines.push('\nFOOD PREFERENCES:')
    if (love.length) lines.push(`- LOVES (prioritise when it closes a gap): ${love.join(', ')}`)
    if (happy.length) lines.push(`- HAPPY (use freely): ${happy.join(', ')}`)
    if (meh.length) lines.push(`- IF IT WORKS (suggest occasionally, ideally with a prep tip): ${meh.join(', ')}`)
    if (no.length) lines.push(`- ABSOLUTELY NOT (do not recommend as the normal solution): ${no.join(', ')}`)
  }

  lines.push('\nCombine these three layers. Do not name the profile. Do not repeat food-preference references in every reply.')
  return lines.join('\n')
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  const [screen, setScreen] = useState<'home' | 'chat' | 'quiz'>('home')
  const [mode, setMode] = useState<Mode | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [pendingB64, setPendingB64] = useState<string | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [userPrefs, setUserPrefs] = useState<CoachProfile | null>(null)

  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHydrated(true)
    setUserPrefs(loadProfile())
    if (!isStandalone()) {
      const dismissed = localStorage.getItem('pcc_install_dismissed')
      if (!dismissed) setTimeout(() => setShowInstall(true), 1200)
    }
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const dismissInstall = () => {
    setShowInstall(false)
    localStorage.setItem('pcc_install_dismissed', 'true')
  }

  const selectMode = (m: Mode) => {
    if (m.id === 'quiz') { setScreen('quiz'); return }
    setMode(m); setMessages([]); setPendingImage(null); setPendingB64(null); setInput(''); setScreen('chat')
  }

  const buildSystemPrompt = () => SYSTEM_PROMPT + buildProfileBlock(userPrefs)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setPendingImage(URL.createObjectURL(file))
    const r = new FileReader()
    r.onload = e => setPendingB64((e.target?.result as string).split(',')[1])
    r.readAsDataURL(file)
  }

  const send = async () => {
    if (loading || (!input.trim() && !pendingB64)) return
    setLoading(true)
    const content: any[] = []
    if (pendingB64) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: pendingB64 } })
    content.push({ type: 'text', text: input.trim() || mode?.autoPrompt || '' })
    const msg = { role: 'user', displayText: input.trim() || (pendingImage ? 'Photo sent ✓' : ''), imagePreview: pendingImage, content }
    const updated = [...messages, msg]
    setMessages(updated)
    setInput(''); setPendingImage(null); setPendingB64(null)
    try {
      const token = getStoredToken()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          system: buildSystemPrompt(),
          messages: updated.map(m => ({ role: m.role, content: m.role === 'user' ? m.content : m.content })),
        }),
      })
      const data = await res.json()
      if (!token) {
        setMessages(p => [...p, { role: 'assistant', content: 'Please use your secure access link to chat.' }])
        setLoading(false)
        return
      }
      const reply = data.content?.find((b: any) => b.type === 'text')?.text || data.reply || 'Something went wrong.'
      setMessages(p => [...p, { role: 'assistant', content: reply }])
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  if (screen === 'quiz') return (
    <QuizScreen
      initial={userPrefs ?? { ...EMPTY_PROFILE }}
      onBack={() => setScreen('home')}
      onDone={prefs => { setUserPrefs(prefs); setScreen('home') }}
    />
  )

  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', background: '#FFF', fontFamily: SANS, display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      {showInstall && <InstallModal onDismiss={dismissInstall} />}

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px 12px', borderBottom: `1px solid ${LINE}`, background: '#FFF' }}>
        <div>
          <div style={{ fontFamily: SANS, color: PINK, fontSize: 10, letterSpacing: '0.24em', fontWeight: 700 }}>LOVE COYLAH ✦</div>
          <div style={{ fontFamily: SERIF, color: INK, fontSize: 14, fontWeight: 700, marginTop: 3, letterSpacing: '-0.01em' }}>Pocket Collagen Coach</div>
        </div>
        <button onClick={() => setShowInstall(true)} style={{ background: INK, border: `1.5px solid ${INK}`, color: '#FFF', borderRadius: 50, padding: '7px 14px', fontSize: 11, fontFamily: SANS, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>+ ADD TO HOME</button>
      </nav>

      <section style={{ padding: '36px 24px 20px', background: `linear-gradient(180deg, ${BABY_SOFT} 0%, #FFF 100%)` }}>
        <div style={{ fontSize: 10, letterSpacing: '0.24em', color: PINK, fontFamily: SANS, marginBottom: 12, fontWeight: 700 }}>— YOUR SKIN-FOOD COACH —</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 54, fontWeight: 800, color: INK, lineHeight: 0.98, marginBottom: 18, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
          Pocket<br />Collagen<br /><span style={{ color: PINK, fontStyle: 'italic' }}>Coach.</span>
        </h1>
        <div style={{ width: 44, height: 3, background: PINK, marginBottom: 18 }} />
        <p style={{ fontFamily: SANS, fontSize: 14, color: INK_SOFT, lineHeight: 1.7, margin: 0, maxWidth: 380 }}>
          Your complete collagen food matrix in your pocket. At the restaurant, the supermarket, in your kitchen — Coylah's voice, on demand.
        </p>
      </section>

      <section style={{ padding: '20px 20px 40px' }}>
        {MODES.map(m => {
          const isQuiz = m.id === 'quiz'
          const done = hydrated && userPrefs?.completed
          return (
            <button key={m.id} onClick={() => selectMode(m)} style={{
              width: '100%', background: '#FFF', border: `1px solid ${LINE}`, borderRadius: 18,
              padding: '18px 18px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column',
              cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(255,46,138,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ background: isQuiz && done ? INK : BABY, color: isQuiz && done ? '#FFF' : PINK_DEEP, fontSize: 10, fontFamily: SANS, fontWeight: 800, letterSpacing: '0.14em', padding: '5px 11px', borderRadius: 50 }}>
                  {isQuiz && done ? 'PROFILE SAVED ✦' : m.badge}
                </span>
                <span>{CARD_ICONS[m.id]}</span>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.01em' }}>{m.label}</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: MUTE, lineHeight: 1.6, marginBottom: 14 }}>{m.description}</div>
              <div style={{ width: '100%', height: 1, background: LINE, marginBottom: 12 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: SANS, fontSize: 12, color: MUTE, fontWeight: 500 }}>
                  {isQuiz
                    ? (hydrated && done ? '✓ Tap to update your Coach profile' : hydrated ? 'Habits, style, food map' : 'Habits, style, food map')
                    : m.photo ? '📷 Photo or text' : '💬 Chat'}
                </span>
                <span style={{ color: PINK, fontSize: 20, fontWeight: 700 }}>›</span>
              </div>
            </button>
          )
        })}
      </section>

      <p style={{ textAlign: 'center', fontFamily: SANS, fontSize: 11, color: MUTE, padding: '8px 20px 36px', letterSpacing: '0.06em' }}>
        Built on Coylah's 11-factor Collagen Matrix ✦
      </p>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: BABY_SOFT, fontFamily: SANS }}>
      <style>{GLOBAL_CSS}</style>

      <header style={{ background: '#FFF', borderBottom: `1px solid ${LINE}`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: PINK, padding: '0 4px' }}>←</button>
        <div>
          <div style={{ fontFamily: SANS, color: PINK, fontSize: 10, letterSpacing: '0.22em', fontWeight: 700 }}>LOVE COYLAH ✦</div>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: INK, marginTop: 2, letterSpacing: '-0.01em' }}>{mode?.label}</div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>{mode && ICONS[mode.id]}</div>
            <p style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8, letterSpacing: '-0.01em' }}>{mode?.label}</p>
            <p style={{ fontFamily: SANS, fontSize: 14, color: MUTE, lineHeight: 1.6, margin: 0 }}>
              {mode?.photo ? "Take a photo or describe what you're looking at below." : 'Type your question below.'}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
            {m.imagePreview && <img src={m.imagePreview} alt="upload" style={{ maxWidth: 200, borderRadius: 12, border: `1px solid ${LINE}`, marginBottom: 6 }} />}
            {(m.displayText || m.role === 'assistant') && (
              <div style={m.role === 'user'
                ? { background: PINK, color: '#FFF', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', fontSize: 14, fontFamily: SANS, lineHeight: 1.6, whiteSpace: 'pre-wrap', maxWidth: '82%', fontWeight: 500 }
                : { background: '#FFF', color: INK_SOFT, border: `1px solid ${LINE}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', fontSize: 14, fontFamily: SANS, lineHeight: 1.7, whiteSpace: 'pre-wrap', maxWidth: '94%', width: '100%', boxShadow: '0 1px 4px rgba(255,46,138,0.06)' }
              }>
                {m.role === 'user' ? m.displayText : <AssistantMessage content={m.content} />}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', marginBottom: 14 }}>
            <div style={{ background: '#FFF', border: `1px solid ${LINE}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px' }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: PINK, marginRight: 4, animation: 'blink 1s 0s infinite' }} />
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: PINK, marginRight: 4, animation: 'blink 1s 0.2s infinite' }} />
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: PINK, animation: 'blink 1s 0.4s infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: '#FFF', borderTop: `1px solid ${LINE}`, padding: '12px 14px 32px', flexShrink: 0 }}>
        {pendingImage && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
            <img src={pendingImage} alt="preview" style={{ height: 64, borderRadius: 8, border: `1px solid ${LINE}`, display: 'block' }} />
            <button onClick={() => { setPendingImage(null); setPendingB64(null) }} style={{ position: 'absolute', top: -7, right: -7, background: INK, border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {mode?.photo && (
            <>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
              <input ref={galleryRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
              <button onClick={() => cameraRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '9px 11px', fontSize: 18, cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}>📷</button>
              <button onClick={() => galleryRef.current?.click()} style={{ background: BABY_SOFT, border: `1.5px solid ${LINE}`, borderRadius: 12, padding: '9px 11px', fontSize: 18, cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}>🖼️</button>
            </>
          )}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={mode?.placeholder ?? ''}
            rows={1}
            style={{ flex: 1, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: '10px 14px', fontSize: 14, fontFamily: SANS, resize: 'none', outline: 'none', background: '#FFF', color: INK, minHeight: 42, maxHeight: 110, lineHeight: 1.5 }}
          />
          <button
            onClick={send}
            disabled={loading || (!input.trim() && !pendingB64)}
            style={{ border: 'none', borderRadius: 12, padding: '10px 16px', color: '#FFF', fontSize: 18, cursor: 'pointer', flexShrink: 0, minHeight: 42, background: loading || (!input.trim() && !pendingB64) ? '#F1BFD4' : PINK, fontWeight: 700 }}
          >→</button>
        </div>
      </div>
    </div>
  )
}