// Collagen Matrix v3 — Pocket Collagen Coach profile + preference data.
// Keep this file culinary-first and recommendation-useful.
// Fruit is deliberately compressed. Milk is multi-select.
// Track My Day includes drinks/hydration.

export type FoodPref = "love" | "like" | "if_it_fits" | "not_for_me";
export type TextSize = "standard" | "larger";
export type FoodLogType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "drinks";

export interface Opt {
  id: string;
  label: string;
}

export interface FoodItem {
  id: string;
  label: string;
  note?: string;
  why?: string;
}

export interface FoodGroup {
  key: string;
  title: string;
  matrix: string;
  why: string;
  foods: FoodItem[];
}

export const FOOD_GROUPS: FoodGroup[] = [
  {
    key: "meat_eggs",
    title: "Meat & eggs",
    matrix: "BUILD",
    why: "Protein and useful collagen amino-acid raw materials.",
    foods: [
      { id: "chicken", label: "Chicken" },
      { id: "turkey", label: "Turkey" },
      { id: "beef", label: "Beef" },
      { id: "lamb", label: "Lamb" },
      { id: "pork", label: "Pork" },
      {
        id: "liver",
        label: "Liver",
        why: "A useful source of vitamin A, iron and copper.",
      },
      { id: "eggs", label: "Eggs" },
    ],
  },
  {
    key: "fish",
    title: "Fish & seafood",
    matrix: "BUILD + PROTECT",
    why: "Protein plus useful omega-3 and protective nutrients.",
    foods: [
      { id: "salmon", label: "Salmon" },
      { id: "mackerel", label: "Mackerel" },
      { id: "sardines", label: "Sardines" },
      { id: "tuna", label: "Tuna" },
      { id: "cod", label: "Cod" },
      { id: "trout", label: "Trout" },
      { id: "prawns", label: "Prawns" },
      {
        id: "oysters",
        label: "Oysters",
        note:
          "Don't panic — I'm not sending you to Waitrose for £700 of oysters 😂 This helps me when we're scanning menus and eating out too.",
        why: "Particularly useful for zinc and copper.",
      },
    ],
  },
  {
    key: "dairy",
    title: "Dairy",
    matrix: "BUILD",
    why: "Useful protein-rich options.",
    foods: [
      { id: "greek_yoghurt_skyr", label: "Greek yoghurt / Skyr" },
      { id: "cottage_cheese", label: "Cottage cheese" },
      { id: "halloumi", label: "Halloumi" },
      { id: "feta", label: "Feta" },
      { id: "hard_cheese", label: "Hard cheese" },
    ],
  },
  {
    key: "veg",
    title: "Vegetables & greens",
    matrix: "ACTIVATE + PROTECT",
    why: "Vitamin C, vitamin A and protective plant compounds.",
    foods: [
      {
        id: "red_pepper",
        label: "Red pepper",
        why: "A particularly useful vitamin C source.",
      },
      { id: "yellow_pepper", label: "Yellow pepper" },
      { id: "broccoli", label: "Broccoli" },
      {
        id: "kale",
        label: "Kale",
        why: "Vitamin C, vitamin A and manganese support.",
      },
      { id: "spinach", label: "Spinach" },
      { id: "sweet_potato", label: "Sweet potato" },
      { id: "carrots", label: "Carrots" },
      { id: "butternut_squash", label: "Butternut squash" },
      { id: "tomatoes", label: "Tomatoes" },
      { id: "cucumber", label: "Cucumber" },
      { id: "avocado", label: "Avocado" },
      { id: "brussels_sprouts", label: "Brussels sprouts" },
      { id: "cauliflower", label: "Cauliflower" },
      { id: "mushrooms", label: "Mushrooms" },
    ],
  },
  {
    key: "grains",
    title: "Beans, grains & useful carbs",
    matrix: "SUPPORT + PROTECT",
    why: "Fibre, minerals and useful supporting nutrients where they fit.",
    foods: [
      { id: "oats", label: "Oats" },
      { id: "brown_rice", label: "Brown rice" },
      { id: "quinoa", label: "Quinoa" },
      { id: "lentils", label: "Lentils" },
      { id: "chickpeas", label: "Chickpeas" },
      { id: "black_beans", label: "Black beans" },
      { id: "sourdough", label: "Sourdough" },
    ],
  },
  {
    key: "nuts",
    title: "Nuts & seeds",
    matrix: "SUPPORT + PROTECT",
    why: "Useful minerals, fats and protective nutrients.",
    foods: [
      {
        id: "pumpkin_seeds",
        label: "Pumpkin seeds",
        why: "A useful zinc-containing seed.",
      },
      { id: "sunflower_seeds", label: "Sunflower seeds" },
      { id: "chia_seeds", label: "Chia seeds" },
      { id: "flaxseed", label: "Flaxseed" },
      { id: "walnuts", label: "Walnuts" },
      { id: "cashews", label: "Cashews" },
      { id: "almonds", label: "Almonds" },
      {
        id: "brazil_nuts",
        label: "Brazil nuts",
        why: "Very selenium-rich — more is not automatically better.",
      },
      { id: "tahini", label: "Tahini" },
    ],
  },
  {
    key: "extras",
    title: "Collagen extras",
    matrix: "BUILD + SUPPORT + PROTECT",
    why: "Useful additions the Coach may use when they genuinely fit.",
    foods: [
      {
        id: "gelatin",
        label: "Gelatin",
        why: "Provides collagen-derived amino acids.",
      },
      {
        id: "chicken_skin",
        label: "Chicken skin",
        why: "A direct food source of collagen.",
      },
      { id: "dark_chocolate", label: "Dark chocolate 70%+" },
      { id: "olive_oil", label: "Olive oil" },
    ],
  },
];

export const FOOD_LABEL: Record<string, string> = Object.fromEntries(
  FOOD_GROUPS.flatMap((group) =>
    group.foods.map((food) => [food.id, food.label] as const),
  ),
);

export const RESTRICTIONS: Opt[] = [
  { id: "none", label: "No restrictions" },
  { id: "gluten", label: "Gluten" },
  { id: "dairy", label: "Dairy" },
  { id: "eggs", label: "Eggs" },
  { id: "fish", label: "Fish" },
  { id: "shellfish", label: "Shellfish" },
  { id: "nuts", label: "Nuts" },
  { id: "sesame", label: "Sesame" },
  { id: "soy", label: "Soya" },
  { id: "other", label: "Other — tell me" },
];

export const COOK_TIME: Opt[] = [
  { id: "15", label: "15 minutes. Feed me." },
  { id: "30", label: "30 minutes is fine." },
  { id: "proper", label: "I don't mind proper cooking." },
  { id: "ask", label: "Depends on the day — ask me." },
];

export const STYLE_OPTIONS: Opt[] = [
  { id: "spice_bit", label: "I like a bit of spice" },
  { id: "spice_max", label: "The hotter the better" },
  { id: "minimal", label: "Minimal effort is ideal" },
  { id: "batch", label: "I love batch cooking" },
  {
    id: "cook_others",
    label: "I'm usually cooking for other people too",
  },
  { id: "on_go", label: "I eat out or grab food on the go a lot" },
  { id: "sweet", label: "I've got a sweet tooth" },
  { id: "savoury", label: "I'm more savoury" },
  { id: "fresh", label: "I like fresh, lighter meals" },
  { id: "comfort", label: "Give me comfort food" },
  { id: "depends", label: "Depends on the day — ask me" },
];

export const USUALS: Opt[] = [
  { id: "olive_oil", label: "Olive oil" },
  { id: "soy_sauce", label: "Soy sauce" },
  { id: "garlic", label: "Garlic" },
  { id: "ginger", label: "Ginger" },
  { id: "turmeric", label: "Turmeric" },
  { id: "chilli", label: "Chilli" },
  { id: "honey", label: "Honey" },
  { id: "mustard", label: "Mustard" },
  { id: "tahini", label: "Tahini" },
  { id: "peanut_butter", label: "Peanut butter" },
  { id: "greek_yoghurt_skyr", label: "Greek yoghurt / Skyr" },
  { id: "eggs", label: "Eggs" },
  { id: "lemons", label: "Lemons" },
  { id: "limes", label: "Limes" },
  { id: "dried_herbs", label: "Dried herbs" },
  { id: "spices", label: "Spices" },
  { id: "rice", label: "Rice" },
  { id: "oats", label: "Oats" },
  { id: "frozen_berries", label: "Frozen berries" },
  { id: "nuts", label: "Nuts" },
  { id: "seeds", label: "Seeds" },
];

export const MILK_OPTIONS: Opt[] = [
  { id: "dairy", label: "Dairy milk" },
  { id: "soya", label: "Soya" },
  { id: "almond", label: "Almond" },
  { id: "oat", label: "Oat" },
  { id: "coconut", label: "Coconut" },
  { id: "any", label: "I don't mind" },
];

export const BONE_BROTH_OPTIONS: Opt[] = [
  { id: "using", label: "I already use it" },
  { id: "buy", label: "I'd buy it" },
  { id: "make", label: "I'd make it" },
  { id: "open", label: "I'm open to it" },
  { id: "no", label: "Not for me" },
];

export const FRUIT_FLAGS: Opt[] = [
  { id: "grapefruit", label: "Grapefruit" },
  { id: "kiwi", label: "Kiwi" },
  { id: "blackcurrants", label: "Blackcurrants" },
  { id: "guava", label: "Guava" },
  { id: "mango", label: "Mango" },
  { id: "citrus", label: "Citrus" },
  { id: "not_a_fruit_person", label: "I'm not really a fruit person" },
  { id: "none", label: "No strong opinions" },
];

export interface CoachProfile {
  version: 7;
  completed: boolean;
  disclaimerAcceptedAt: string | null;
  updatedAt: string;
  firstName: string;
  restrictions: string[];
  restrictionsOther: string;
  foods: Record<string, FoodPref>;
  cookTime: string | null;
  style: string[];
  usuals: string[];
  usualsCustom: string;
  milks: string[];
  boneBroth: string | null;
  fruitFlags: string[];
  textSize: TextSize;
}

export const EMPTY_PROFILE: CoachProfile = {
  version: 7,
  completed: false,
  disclaimerAcceptedAt: null,
  updatedAt: "",
  firstName: "",
  restrictions: [],
  restrictionsOther: "",
  foods: {},
  cookTime: null,
  style: [],
  usuals: [],
  usualsCustom: "",
  milks: [],
  boneBroth: null,
  fruitFlags: [],
  textSize: "standard",
};

export interface FoodLog {
  id: string;
  date: string;
  meal: FoodLogType;
  text: string;
  createdAt: string;
}
