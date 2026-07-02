import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a Pocket Collagen Coach built on the complete Collagen Kitchen food matrix, created by Coylah — a British skin specialist with over 10 years experience and 4 years building this matrix.

Your job: help women eat for collagen every single day. In restaurants, supermarkets, hotels, at home. Wherever they are.

THE COMPLETE COLLAGEN FOOD MATRIX — 10 CO-FACTORS:

1. PROTEIN (glycine, proline, hydroxyproline) — the raw material
Best sources: Tuna (30g/100g), Turkey (29g), Chicken (27g), Beef (26g), Salmon (25g), Sardines (25g), Prawns (24g), Eggs (13g), Greek yoghurt (10g)

2. VITAMIN C — the spark plug. Without it collagen synthesis stops completely.
Best sources: Red pepper (190mg/100g), Yellow pepper (184mg), Kale (120mg), Kiwi (93mg), Broccoli (89mg), Strawberries, Pineapple, Orange. Raw always better — heat destroys it.

3. ZINC — activates enzymes that build and stabilise collagen.
Best sources: Oysters (79mg/100g), Pumpkin seeds (7.8mg), Beef (4-5mg), Cashews (5.6mg), Lentils (3.3mg), Dark chocolate 70%+ (3.3mg)

4. COPPER — makes collagen strong. Activates lysyl oxidase.
Best sources: Oysters (5.7mg/100g), Sesame/tahini (4.1mg), Cashews (2.2mg), Dark chocolate 70%+ (1.8mg), Walnuts (1.6mg)

5. VITAMIN A — protects collagen from breakdown, stimulates new production.
Best sources: Sweet potato (961mcg/100g), Carrots (835mcg), Butternut squash (532mcg), Spinach (469mcg), Red pepper (157mcg), Egg yolk. Fat-soluble — always pair with healthy fats.

6. OMEGA-3 — reduces inflammation that destroys collagen.
Best sources: Mackerel (2.3g/100g), Salmon (2.2g), Sardines (1.5g), Flaxseed (5.9g ALA), Chia seeds (5.1g ALA), Walnuts (2.6g ALA). Plant ALA converts at only 5-10% efficiency.

7. ANTIOXIDANTS — protect existing collagen from damage.
Lycopene: Cooked tomatoes (16mg/100g), Watermelon. Ellagic acid: Pomegranate seeds (236mg/100g), Raspberries, Strawberries. Vitamin E: Sunflower seeds (35mg), Almonds (26mg), Avocado. Resveratrol: Red grapes, Blueberries, Dark chocolate.

8. SILICA — supports connective tissue framework.
Best sources: Brown rice (1240mg/100g), Oats (595mg), Cucumber, Sweet potato, Strawberries.

9. MANGANESE — amino acid metabolism for collagen.
Best sources: Pumpkin seeds (4.5mg/100g), Oats (3.6mg), Walnuts (3.4mg), Pineapple (1.6mg), Chickpeas (1.7mg)

10. BLOOD SUGAR STABILITY — sugar glycates and damages collagen.
Best foods: Oats, Lentils, Chickpeas, Quinoa, Brown rice, Sweet potato, Leafy greens.

HERO FOODS: Oysters (Zinc+Copper+Protein+Omega3), Mackerel (Protein+Omega3+VitA), Pumpkin seeds (Zinc+Copper+Manganese), Sweet potato (VitA+Silica+Manganese), Red pepper (VitC+VitA+Lycopene), Eggs (Protein+VitA+Zinc), Oats (Silica+Manganese+BloodSugar), Dark chocolate 70%+ (Zinc+Copper+Resveratrol), Tahini (Zinc+Copper+VitE), Avocado (VitE+Copper+absorbs fat-soluble vitamins).

KEY TRUTHS TO SHARE WHEN RELEVANT:
- A collagen powder provides protein peptides — ONE co-factor out of TEN.
- Without vitamin C, collagen synthesis stops completely.
- Fat-soluble vitamins (A, E) need fat to absorb.
- Sugar glycates collagen — blood sugar stability matters as much as nutrients.

TONE: Warm, direct, no-nonsense British. Knowledgeable best friend. Never preachy. Short punchy answers. Always name which co-factors a food hits. Real food over supplements every time.

WHEN ANALYSING PHOTOS: Identify co-factors present, what's missing, give clear practical recommendations.`;

const ICONS = {
  fridge: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="16" height="22" rx="2"/>
      <line x1="6" y1="11" x2="22" y2="11"/>
      <line x1="11" y1="7" x2="11" y2="9"/>
      <line x1="11" y1="15" x2="11" y2="20"/>
    </svg>
  ),
  menu: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="18" height="22" rx="2"/>
      <line x1="9" y1="9" x2="19" y2="9"/>
      <line x1="9" y1="14" x2="19" y2="14"/>
      <line x1="9" y1="19" x2="15" y2="19"/>
    </svg>
  ),
  supermarket: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="20" height="16" rx="2"/>
      <line x1="4" y1="11" x2="24" y2="11"/>
      <line x1="9" y1="6" x2="9" y2="22"/>
      <line x1="14" y1="6" x2="14" y2="22"/>
      <line x1="19" y1="6" x2="19" y2="22"/>
    </svg>
  ),
  recipe: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20 C8 20 7 12 14 12 C21 12 20 20 20 20"/>
      <line x1="6" y1="20" x2="22" y2="20"/>
      <line x1="14" y1="12" x2="14" y2="8"/>
      <path d="M11 8 C11 8 11 5 14 5 C17 5 17 8 17 8"/>
    </svg>
  ),
  ask: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4 H23 A2 2 0 0 1 25 6 V17 A2 2 0 0 1 23 19 H15 L9 24 V19 H5 A2 2 0 0 1 3 17 V6 A2 2 0 0 1 5 4 Z"/>
      <line x1="14" y1="9" x2="14" y2="14"/>
      <circle cx="14" cy="16.5" r="0.75" fill="#8B1A2B"/>
    </svg>
  ),
  quiz: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8B1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="20" height="22" rx="2"/>
      <line x1="9" y1="9" x2="19" y2="9"/>
      <polyline points="9,14 11.5,16.5 15.5,12"/>
      <polyline points="9,20 11.5,22.5 15.5,18"/>
    </svg>
  ),
};

const MODES = [
  { id: "fridge", badge: "PHOTO", label: "What's in my fridge?", description: "Snap your fridge or cupboard and I'll build you a collagen-rich meal from whatever's in there.", photo: true, placeholder: "Or tell me what you've got...", autoPrompt: "I've taken a photo of my fridge/cupboard. What collagen-rich meals can I build? Tell me which co-factors each ingredient hits and what I'm missing." },
  { id: "menu", badge: "PHOTO", label: "Scan a menu", description: "At a restaurant or hotel buffet? Photo the menu and I'll tell you exactly what to order for maximum collagen co-factors.", photo: true, placeholder: "Or paste the menu items...", autoPrompt: "I've taken a photo of this menu. What should I order to maximise collagen co-factors? Give me your top picks and why." },
  { id: "supermarket", badge: "PHOTO", label: "Supermarket scan", description: "Snap a product label in the aisle and I'll tell you whether it earns a place in your collagen kitchen.", photo: true, placeholder: "Or describe the product...", autoPrompt: "I've taken a photo of this product. Is it worth buying for collagen? What co-factors does it hit and what does it miss?" },
  { id: "recipe", badge: "CHAT", label: "Build me a recipe", description: "Tell me what you've got in your kitchen and I'll create a collagen-first recipe built around the complete matrix.", photo: false, placeholder: "e.g. I've got salmon, red pepper, spinach and some seeds...", autoPrompt: null },
  { id: "ask", badge: "CHAT", label: "Ask me anything", description: "Collagen questions answered in plain English. No fluff, no industry spin — just what actually works.", photo: false, placeholder: "e.g. Is oat milk good for collagen?", autoPrompt: null },
  { id: "quiz", badge: "PERSONALISE", label: "Take the food quiz", description: "Tell me what you love, what you hate and any foods you avoid — I'll tailor every recommendation around you.", photo: false, placeholder: null, autoPrompt: null },
];

const detectPlatform = () => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
};

function InstallModal({ onDismiss }: { onDismiss: () => void }) {
  const [platform, setPlatform] = useState<string | null>(null);
  useEffect(() => { setPlatform(detectPlatform()); }, []);

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.scriptSm}>Love Coylah</div>
        <h2 style={S.modalH}>Add to your home screen</h2>
        <p style={S.modalP}>Get the full app experience — one tap from your home screen, no browser bar needed.</p>

        {platform === null && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
            <button style={S.platBtn} onClick={() => setPlatform("ios")}>📱 I'm on iPhone / iPad</button>
            <button style={S.platBtn} onClick={() => setPlatform("android")}>🤖 I'm on Android</button>
            <button style={S.platBtn} onClick={() => setPlatform("other")}>💻 I'm on desktop / other</button>
          </div>
        )}

        {platform === "ios" && (
          <div style={S.steps}>
            <div style={S.step}><span style={S.stepN}>1</span><span>Tap the <strong>Share button ⎋</strong> at the bottom of Safari</span></div>
            <div style={S.step}><span style={S.stepN}>2</span><span>Scroll down and tap <strong>"Add to Home Screen"</strong></span></div>
            <div style={S.step}><span style={S.stepN}>3</span><span>Tap <strong>Add</strong> in the top right corner</span></div>
            <p style={S.stepNote}>The app icon will appear on your home screen just like a native app.</p>
          </div>
        )}

        {platform === "android" && (
          <div style={S.steps}>
            <div style={S.step}><span style={S.stepN}>1</span><span>Tap the <strong>menu icon ⋮</strong> in the top right of Chrome</span></div>
            <div style={S.step}><span style={S.stepN}>2</span><span>Tap <strong>"Add to Home screen"</strong></span></div>
            <div style={S.step}><span style={S.stepN}>3</span><span>Tap <strong>Add</strong> to confirm</span></div>
            <p style={S.stepNote}>The app icon will appear on your home screen just like a native app.</p>
          </div>
        )}

        {platform === "other" && (
          <div style={S.steps}>
            <div style={S.step}><span style={S.stepN}>✓</span><span>Bookmark this page, or open it on your phone to add it to your home screen.</span></div>
          </div>
        )}

        <button style={S.dismissBtn} onClick={onDismiss}>{platform ? "Got it — let's go ✦" : "Maybe later"}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOD QUIZ SCREEN
// ─────────────────────────────────────────────
const FOOD_OPTIONS = [
  { id: "salmon", label: "Salmon" }, { id: "mackerel", label: "Mackerel" },
  { id: "sardines", label: "Sardines" }, { id: "tuna", label: "Tuna" },
  { id: "chicken", label: "Chicken" }, { id: "beef", label: "Beef" },
  { id: "prawns", label: "Prawns" }, { id: "eggs", label: "Eggs" },
  { id: "oysters", label: "Oysters" }, { id: "greek_yoghurt", label: "Greek yoghurt" },
  { id: "cottage_cheese", label: "Cottage cheese" }, { id: "halloumi", label: "Halloumi" },
  { id: "red_pepper", label: "Red pepper" }, { id: "broccoli", label: "Broccoli" },
  { id: "kale", label: "Kale" }, { id: "spinach", label: "Spinach" },
  { id: "sweet_potato", label: "Sweet potato" }, { id: "carrots", label: "Carrots" },
  { id: "avocado", label: "Avocado" }, { id: "tomatoes", label: "Tomatoes" },
  { id: "cucumber", label: "Cucumber" }, { id: "kiwi", label: "Kiwi" },
  { id: "strawberries", label: "Strawberries" }, { id: "blueberries", label: "Blueberries" },
  { id: "mango", label: "Mango" }, { id: "pineapple", label: "Pineapple" },
  { id: "oats", label: "Oats" }, { id: "brown_rice", label: "Brown rice" },
  { id: "quinoa", label: "Quinoa" }, { id: "lentils", label: "Lentils" },
  { id: "chickpeas", label: "Chickpeas" }, { id: "pumpkin_seeds", label: "Pumpkin seeds" },
  { id: "walnuts", label: "Walnuts" }, { id: "cashews", label: "Cashews" },
  { id: "almonds", label: "Almonds" }, { id: "dark_chocolate", label: "Dark chocolate" },
  { id: "tahini", label: "Tahini / sesame" }, { id: "olive_oil", label: "Olive oil" },
];

const DIET_OPTIONS = [
  { id: "none", label: "No restrictions" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "gluten_free", label: "Gluten free" },
  { id: "dairy_free", label: "Dairy free" },
  { id: "nut_allergy", label: "Nut allergy" },
];

const QUIZ_STEPS = [
  { key: "diet", title: "Any dietary needs?", subtitle: "Select all that apply — I'll never suggest something that doesn't work for you.", multi: true, options: DIET_OPTIONS },
  { key: "loves", title: "Foods you love ❤️", subtitle: "Pick everything you enjoy eating — the more you tell me, the better I can build around you.", multi: true, options: FOOD_OPTIONS },
  { key: "dislikes", title: "Foods you'd rather avoid 🙅‍♀️", subtitle: "Pick anything you dislike or won't eat — I'll keep these out of every recommendation.", multi: true, options: FOOD_OPTIONS },
];

function QuizScreen({ onDone, onBack }: { onDone: (prefs: any) => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ diet: string[]; loves: string[]; dislikes: string[] }>({ diet: [], loves: [], dislikes: [] });
  const current = QUIZ_STEPS[step];

  const toggle = (id: string) => {
    setAnswers((prev) => {
      const key = current.key as keyof typeof prev;
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });
  };

  const isSelected = (id: string) => (answers[current.key as keyof typeof answers] as string[]).includes(id);

  const next = () => {
    if (step < QUIZ_STEPS.length - 1) { setStep(step + 1); }
    else {
      const loves = answers.loves.map((id) => FOOD_OPTIONS.find((f) => f.id === id)?.label).filter(Boolean);
      const dislikes = answers.dislikes.map((id) => FOOD_OPTIONS.find((f) => f.id === id)?.label).filter(Boolean);
      const diet = answers.diet.map((id) => DIET_OPTIONS.find((d) => d.id === id)?.label).filter(Boolean);
      const prefs = { loves, dislikes, diet, completed: true };
      localStorage.setItem("pcc_preferences", JSON.stringify(prefs));
      onDone(prefs);
    }
  };

  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div style={{ minHeight:"100vh", background:"#FFF", fontFamily:"'Georgia','Times New Roman',serif", display:"flex", flexDirection:"column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>

      {/* Header */}
      <div style={{ background:"#FFF", borderBottom:"1px solid #F0E8E4", padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#8B1A2B", padding:"0 4px" }}>←</button>
        <div>
          <div style={{ fontFamily:"'Great Vibes',cursive", color:"#8B1A2B", fontSize:18, lineHeight:1 }}>Love Coylah</div>
          <div style={{ fontFamily:"-apple-system,sans-serif", fontSize:13, fontWeight:"600", color:"#111", marginTop:2 }}>Your food preferences</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:"#F0E8E4" }}>
        <div style={{ height:3, background:"#8B1A2B", width:`${progress}%`, transition:"width 0.3s" }} />
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"28px 20px 120px" }}>
        <div style={{ marginBottom:6, fontFamily:"-apple-system,sans-serif", fontSize:11, color:"#BBB", letterSpacing:"0.1em" }}>STEP {step+1} OF {QUIZ_STEPS.length}</div>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:24, fontWeight:"bold", color:"#111", marginBottom:8, lineHeight:1.25 }}>{current.title}</h2>
        <p style={{ fontFamily:"-apple-system,sans-serif", fontSize:13, color:"#888", lineHeight:1.6, marginBottom:24 }}>{current.subtitle}</p>

        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {current.options.map((opt) => {
            const sel = isSelected(opt.id);
            return (
              <button key={opt.id} onClick={() => toggle(opt.id)} style={{
                padding:"9px 16px", borderRadius:50, border:`1.5px solid ${sel ? "#8B1A2B" : "#EDDFDB"}`,
                background: sel ? "#8B1A2B" : "#FFF", color: sel ? "#FFF" : "#333",
                fontFamily:"-apple-system,sans-serif", fontSize:13, cursor:"pointer",
                transition:"all 0.15s",
              }}>
                {sel ? "✓ " : ""}{opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#FFF", borderTop:"1px solid #F0E8E4", padding:"16px 20px", paddingBottom:"max(16px, env(safe-area-inset-bottom))" }}>
        <button onClick={next} style={{ width:"100%", background:"#8B1A2B", color:"#FFF", border:"none", borderRadius:50, padding:"16px 24px", fontFamily:"'Georgia',serif", fontSize:16, fontWeight:"bold", cursor:"pointer" }}>
          {step < QUIZ_STEPS.length - 1 ? "Next →" : "Save my preferences ✦"}
        </button>
        {step > 0 && (
          <button onClick={() => setStep(step-1)} style={{ width:"100%", background:"none", border:"none", color:"#BBB", fontFamily:"-apple-system,sans-serif", fontSize:13, cursor:"pointer", marginTop:10 }}>← Back</button>
        )}
      </div>
    </div>
  );
}

function PocketCollagenCoach() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState<typeof MODES[number] | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingB64, setPendingB64] = useState<string | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [userPrefs, setUserPrefs] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem("pcc_preferences") || "null") || null; } catch { return null; }
  });

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Install prompt is opt-in via the "+ Add to home" button — never auto-shown,
  // so the home screen renders immediately with no async dependency.

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const dismissInstall = () => {
    setShowInstall(false);
    localStorage.setItem("pcc_install_dismissed", "true");
  };

  const selectMode = (m: typeof MODES[number]) => {
    if (m.id === "quiz") { setScreen("quiz"); return; }
    setMode(m); setMessages([]); setPendingImage(null); setPendingB64(null); setInput(""); setScreen("chat");
  };

  const buildSystemPrompt = () => {
    let prompt = SYSTEM_PROMPT;
    if (userPrefs?.completed) {
      prompt += "\n\nUSER FOOD PREFERENCES (personalise every response around these):";
      if (userPrefs.diet?.length) prompt += `\nDietary requirements: ${userPrefs.diet.join(", ")}. Never suggest anything that conflicts with these.`;
      if (userPrefs.loves?.length) prompt += `\nFoods this person loves and enjoys: ${userPrefs.loves.join(", ")}. Prioritise these wherever possible.`;
      if (userPrefs.dislikes?.length) prompt += `\nFoods this person dislikes or avoids: ${userPrefs.dislikes.join(", ")}. Never include these in recipes or recommendations.`;
      prompt += "\nAlways build suggestions around their preferences. If a hero food is on their dislike list, find the next best alternative and explain why.";
    }
    return prompt;
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPendingImage(URL.createObjectURL(file));
    const r = new FileReader();
    r.onload = (e) => setPendingB64((e.target?.result as string).split(",")[1]);
    r.readAsDataURL(file);
  };

  const send = async () => {
    if (loading || (!input.trim() && !pendingB64)) return;
    setLoading(true);
    const content: any[] = [];
    if (pendingB64) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: pendingB64 } });
    content.push({ type: "text", text: input.trim() || mode?.autoPrompt });
    const msg = { role: "user", displayText: input.trim() || (pendingImage ? "Photo sent ✓" : ""), imagePreview: pendingImage, content };
    const updated = [...messages, msg];
    setMessages(updated);
    setInput(""); setPendingImage(null); setPendingB64(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000, system: buildSystemPrompt(),
          messages: updated.map((m) => ({ role: m.role, content: m.role === "user" ? m.content : m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b: any) => b.type === "text")?.text || "Something went wrong.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch { setMessages((p) => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const CRIMSON = "#8B1A2B";

  if (screen === "quiz") return (
    <QuizScreen
      onBack={() => setScreen("home")}
      onDone={(prefs) => { setUserPrefs(prefs); setScreen("home"); }}
    />
  );

  if (screen === "home") return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      {showInstall && <InstallModal onDismiss={dismissInstall} />}

      <nav style={S.nav}>
        <div>
          <div style={S.navScript}>Love Coylah</div>
          <div style={S.navBrand}>Pocket Collagen Coach</div>
        </div>
        <button style={S.addBtn} onClick={() => setShowInstall(true)} title="Add to home screen">+ Add to home</button>
      </nav>

      <div style={S.hero}>
        <div style={S.eyebrow}>— YOUR SKIN-FOOD COACH —</div>
        <div style={S.heroScript}>Love Coylah</div>
        <h1 style={S.heroH}>Pocket<br />Collagen<br />Coach</h1>
        <div style={S.heroDivider} />
        <p style={S.heroP}>Your complete collagen food matrix in your pocket. At the restaurant, the supermarket, in your kitchen.</p>
      </div>

      <div style={S.modeList}>
        {MODES.map((m) => (
          <button key={m.id} onClick={() => selectMode(m)} style={S.modeCard}>
            {/* Top row: badge + SVG icon */}
            <div style={S.cardTop}>
              <span style={S.cardBadge}>{m.badge}</span>
              <span style={{ opacity: 0.85 }}>{ICONS[m.id as keyof typeof ICONS]}</span>
            </div>
            {/* Title */}
            <div style={S.cardTitle}>{m.label}</div>
            {/* Description */}
            <div style={S.cardDesc}>{m.description}</div>
            {/* Divider */}
            <div style={S.cardDivider} />
            {/* Footer */}
            <div style={S.cardFooter}>
              <span style={S.cardFooterText}>
                {m.id === "quiz" && userPrefs?.completed
                  ? "✓ Preferences saved — tap to update"
                  : m.photo ? "📷 Photo or text" : m.id === "quiz" ? "Takes 2 minutes" : "💬 Chat"}
              </span>
              <span style={S.cardArrow}>›</span>
            </div>
          </button>
        ))}
      </div>

      <p style={S.footer}>Built on the complete Collagen Kitchen matrix by Coylah</p>
    </div>
  );

  return (
    <div style={S.chatPage}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes blink { 0%,100%{opacity:.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }`}</style>

      <div style={S.chatNav}>
        <button onClick={() => setScreen("home")} style={S.backBtn}>←</button>
        <div>
          <div style={S.navScript}>Love Coylah</div>
          <div style={S.chatNavTitle}>{ICONS[mode?.id as keyof typeof ICONS]} {mode?.label}</div>
        </div>
      </div>

      <div style={S.msgArea}>
        {messages.length === 0 && (
          <div style={S.empty}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>{ICONS[mode?.id as keyof typeof ICONS]}</div>
            <p style={S.emptyT}>{mode?.label}</p>
            <p style={S.emptyS}>{mode?.photo ? "Take a photo or describe what you're looking at below." : "Type your question below."}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems: m.role==="user"?"flex-end":"flex-start", marginBottom:14 }}>
            {m.imagePreview && <img src={m.imagePreview} alt="upload" style={S.imgMsg} />}
            {(m.displayText || m.role==="assistant") && (
              <div style={m.role==="user" ? S.bUser : S.bBot}>{m.role==="user" ? m.displayText : m.content}</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", marginBottom:14 }}>
            <div style={S.bBot}>
              <span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#8B1A2B",marginRight:4,animation:"blink 1s 0s infinite" }} />
              <span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#8B1A2B",marginRight:4,animation:"blink 1s 0.2s infinite" }} />
              <span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#8B1A2B",animation:"blink 1s 0.4s infinite" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={S.inputArea}>
        {pendingImage && (
          <div style={{ position:"relative",display:"inline-block",marginBottom:10 }}>
            <img src={pendingImage} alt="preview" style={{ height:64,borderRadius:8,border:"1px solid #EDE0DC",display:"block" }} />
            <button onClick={() => { setPendingImage(null); setPendingB64(null); }} style={S.removeImg}>✕</button>
          </div>
        )}
        <div style={S.inputRow}>
          {mode?.photo && (
            <>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
              <input ref={galleryRef} type="file" accept="image/*" style={{ display:"none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
              <button onClick={() => cameraRef.current?.click()} style={S.iconBtn}>📷</button>
              <button onClick={() => galleryRef.current?.click()} style={S.iconBtn}>🖼️</button>
            </>
          )}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }} placeholder={mode?.placeholder || ""} rows={1} style={S.textarea} />
          <button onClick={send} disabled={loading||(!input.trim()&&!pendingB64)} style={{ ...S.sendBtn, background: loading||(!input.trim()&&!pendingB64)?"#D9C9C6":"#8B1A2B" }}>→</button>
        </div>
      </div>
    </div>
  );
}

const CRIMSON = "#8B1A2B";
const SCRIPT = "'Great Vibes', 'Dancing Script', cursive";
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const S: Record<string, React.CSSProperties> = {
  page: { minHeight:"100vh", background:"#FFF", color:"#111", fontFamily:SERIF, display:"flex", flexDirection:"column" },
  nav: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px 10px", borderBottom:"1px solid #F0E8E4" },
  navScript: { fontFamily:SCRIPT, color:CRIMSON, fontSize:20, lineHeight:1 },
  navBrand: { fontFamily:SERIF, color:"#111", fontSize:12, fontWeight:"600", marginTop:3, letterSpacing:"0.02em" },
  addBtn: { background:"none", border:`1.5px solid ${CRIMSON}`, color:CRIMSON, borderRadius:50, padding:"6px 14px", fontSize:11, fontFamily:SANS, fontWeight:"600", cursor:"pointer", letterSpacing:"0.03em", whiteSpace:"nowrap" },
  hero: { padding:"32px 28px 20px" },
  eyebrow: { fontSize:10, letterSpacing:"0.18em", color:CRIMSON, fontFamily:SANS, marginBottom:10 },
  heroScript: { fontFamily:SCRIPT, color:CRIMSON, fontSize:32, lineHeight:1.1, marginBottom:4 },
  heroH: { fontFamily:SERIF, fontSize:46, fontWeight:"bold", color:"#111", lineHeight:1.1, marginBottom:14 },
  heroDivider: { width:36, height:2, background:CRIMSON, marginBottom:16 },
  heroP: { fontFamily:SANS, fontSize:14, color:"#555", lineHeight:1.7 },
  modeList: { padding:"8px 20px 20px" },
  modeCard: { width:"100%", background:"#FFF", border:"1px solid #EDDFDB", borderRadius:16, padding:"18px 18px 14px", marginBottom:14, display:"flex", flexDirection:"column", cursor:"pointer", textAlign:"left", boxShadow:"0 1px 6px rgba(139,26,43,0.05)" },
  cardTop: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 },
  cardBadge: { background:"#F9ECEE", color:CRIMSON, fontSize:10, fontFamily:SANS, fontWeight:"700", letterSpacing:"0.1em", padding:"4px 10px", borderRadius:50 },
  cardTitle: { fontFamily:SERIF, fontSize:20, fontWeight:"bold", color:"#111", lineHeight:1.25, marginBottom:10 },
  cardDesc: { fontFamily:SANS, fontSize:13, color:"#666", lineHeight:1.6, marginBottom:14 },
  cardDivider: { width:"100%", height:1, background:"#F0E8E4", marginBottom:12 },
  cardFooter: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  cardFooterText: { fontFamily:SANS, fontSize:12, color:"#999" },
  cardArrow: { color:CRIMSON, fontSize:20, fontWeight:"bold" },
  footer: { textAlign:"center", fontFamily:SANS, fontSize:11, color:"#BBB", padding:"8px 20px 32px" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end" },
  modal: { background:"#FFF", borderRadius:"24px 24px 0 0", padding:"32px 28px 40px", width:"100%", maxHeight:"85vh", overflowY:"auto" },
  scriptSm: { fontFamily:SCRIPT, color:CRIMSON, fontSize:22, marginBottom:4 },
  modalH: { fontFamily:SERIF, fontSize:22, fontWeight:"bold", color:"#111", marginBottom:10 },
  modalP: { fontFamily:SANS, fontSize:14, color:"#555", lineHeight:1.6, marginBottom:20 },
  platBtn: { width:"100%", background:"#FBF7F6", border:"1.5px solid #EDDFDB", borderRadius:12, padding:"14px 18px", fontFamily:SERIF, fontSize:15, cursor:"pointer", textAlign:"left", color:"#111", marginBottom:0 },
  steps: { display:"flex", flexDirection:"column", gap:14, marginBottom:24 },
  step: { display:"flex", alignItems:"flex-start", gap:14, fontFamily:SANS, fontSize:14, color:"#333", lineHeight:1.5 },
  stepN: { background:CRIMSON, color:"#fff", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:"bold", flexShrink:0 },
  stepNote: { fontFamily:SANS, fontSize:12, color:"#888", fontStyle:"italic", marginTop:4 },
  dismissBtn: { width:"100%", background:CRIMSON, color:"#fff", border:"none", borderRadius:50, padding:"16px 24px", fontFamily:SERIF, fontSize:16, fontWeight:"bold", cursor:"pointer" },
  chatPage: { height:"100vh", display:"flex", flexDirection:"column", background:"#FDFAF9", fontFamily:SERIF },
  chatNav: { background:"#FFF", borderBottom:"1px solid #F0E8E4", padding:"12px 18px", display:"flex", alignItems:"center", gap:12, flexShrink:0 },
  backBtn: { background:"none", border:"none", fontSize:22, cursor:"pointer", color:CRIMSON, padding:"0 4px" },
  chatNavTitle: { fontFamily:SANS, fontSize:14, fontWeight:"600", color:"#111", marginTop:2 },
  msgArea: { flex:1, overflowY:"auto", padding:"20px 16px" },
  empty: { textAlign:"center", padding:"40px 24px" },
  emptyT: { fontFamily:SERIF, fontSize:18, fontWeight:"bold", color:"#111", marginBottom:10 },
  emptyS: { fontFamily:SANS, fontSize:14, color:"#888", lineHeight:1.6 },
  bUser: { background:CRIMSON, color:"#FFF", borderRadius:"18px 18px 4px 18px", padding:"12px 16px", fontSize:14, fontFamily:SANS, lineHeight:1.6, whiteSpace:"pre-wrap", maxWidth:"82%" },
  bBot: { background:"#FFF", color:"#111", border:"1px solid #EDE0DC", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", fontSize:14, fontFamily:SANS, lineHeight:1.7, whiteSpace:"pre-wrap", maxWidth:"82%", boxShadow:"0 1px 4px rgba(139,26,43,0.05)" },
  imgMsg: { maxWidth:200, borderRadius:12, border:"1px solid #EDE0DC", marginBottom:6 },
  inputArea: { background:"#FFF", borderTop:"1px solid #EDE0DC", padding:"12px 14px", paddingBottom:"max(12px, env(safe-area-inset-bottom))", flexShrink:0 },
  inputRow: { display:"flex", alignItems:"flex-end", gap:8 },
  iconBtn: { background:"#FBF7F6", border:"1.5px solid #EDE0DC", borderRadius:12, padding:"9px 11px", fontSize:18, cursor:"pointer", flexShrink:0, lineHeight:1 },
  textarea: { flex:1, border:"1.5px solid #EDE0DC", borderRadius:14, padding:"10px 14px", fontSize:14, fontFamily:SANS, resize:"none", outline:"none", background:"#FDFAF9", color:"#111", minHeight:42, maxHeight:110, lineHeight:1.5 },
  sendBtn: { border:"none", borderRadius:12, padding:"10px 16px", color:"#FFF", fontSize:18, cursor:"pointer", flexShrink:0, minHeight:42 },
  removeImg: { position:"absolute", top:-7, right:-7, background:CRIMSON, border:"none", borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pocket Collagen Coach — Love Coylah" },
      { name: "description", content: "Your complete collagen food matrix in your pocket. At the restaurant, the supermarket, in your kitchen." },
      { property: "og:title", content: "Pocket Collagen Coach — Love Coylah" },
      { property: "og:description", content: "Your complete collagen food matrix in your pocket. At the restaurant, the supermarket, in your kitchen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PocketCollagenCoach,
});
