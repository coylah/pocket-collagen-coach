// Collagen Matrix v3 — profile schema + food universe.
// Culinary-first. Bone broth & milk get dedicated questions.
// Fruit is a single "any strong opinions" question (no per-fruit rating).

export type FoodPref = 'love' | 'like' | 'if_it_fits' | 'not_for_me'

export interface Opt { id: string; label: string }
export interface FoodItem { id: string; label: string; note?: string; why?: string }
export interface FoodGroup {
  key: string
  title: string
  matrix: string
  why: string
  foods: FoodItem[]
}

// Fruit removed as a rating group — replaced by a single FRUIT_FLAGS question.
export const FOOD_GROUPS: FoodGroup[] = [
  { key: 'meat_eggs', title: 'Meat & eggs', matrix: 'BUILD',
    why: 'Protein and collagen amino-acid raw materials — glycine, proline, lysine.',
    foods: [
      { id: 'chicken', label: 'Chicken' },
      { id: 'turkey', label: 'Turkey' },
      { id: 'beef', label: 'Beef' },
      { id: 'lamb', label: 'Lamb' },
      { id: 'pork', label: 'Pork' },
      { id: 'liver', label: 'Liver', why: 'Very high vitamin A + iron.' },
      { id: 'eggs', label: 'Eggs' },
    ]},
  { key: 'fish', title: 'Fish & seafood', matrix: 'BUILD + PROTECT',
    why: 'Protein plus useful omega-3 and protective nutrients.',
    foods: [
      { id: 'salmon', label: 'Salmon' },
      { id: 'mackerel', label: 'Mackerel' },
      { id: 'sardines', label: 'Sardines' },
      { id: 'tuna', label: 'Tuna' },
      { id: 'cod', label: 'Cod' },
      { id: 'trout', label: 'Trout' },
      { id: 'prawns', label: 'Prawns' },
      { id: 'oysters', label: 'Oysters' },
    ]},
  { key: 'dairy', title: 'Dairy', matrix: 'BUILD',
    why: 'Useful protein-rich options.',
    foods: [
      { id: 'greek_yoghurt_skyr', label: 'Greek yoghurt / Skyr' },
      { id: 'cottage_cheese', label: 'Cottage cheese' },
      { id: 'halloumi', label: 'Halloumi' },
      { id: 'feta', label: 'Feta' },
      { id: 'hard_cheese', label: 'Hard cheese' },
    ]},
  { key: 'veg', title: 'Vegetables & greens', matrix: 'ACTIVATE + PROTECT',
    why: 'Vitamin C, vitamin A and antioxidant support.',
    foods: [
      { id: 'red_pepper', label: 'Red pepper', why: 'One of the highest vitamin C foods around.' },
      { id: 'yellow_pepper', label: 'Yellow pepper' },
      { id: 'broccoli', label: 'Broccoli' },
      { id: 'kale', label: 'Kale', why: 'Vitamin C, vitamin A and manganese support.' },
      { id: 'spinach', label: 'Spinach' },
      { id: 'sweet_potato', label: 'Sweet potato' },
      { id: 'carrots', label: 'Carrots' },
      { id: 'butternut_squash', label: 'Butternut squash' },
      { id: 'tomatoes', label: 'Tomatoes' },
      { id: 'cucumber', label: 'Cucumber' },
      { id: 'avocado', label: 'Avocado' },
      { id: 'brussels_sprouts', label: 'Brussels sprouts' },
      { id: 'cauliflower', label: 'Cauliflower' },
      { id: 'mushrooms', label: 'Mushrooms' },
    ]},
  { key: 'grains', title: 'Beans, grains & carbs', matrix: 'SUPPORT + PROTECT',
    why: 'Minerals, fibre and blood sugar stability where it fits.',
    foods: [
      { id: 'oats', label: 'Oats' },
      { id: 'brown_rice', label: 'Brown rice' },
      { id: 'quinoa', label: 'Quinoa' },
      { id: 'lentils', label: 'Lentils' },
      { id: 'chickpeas', label: 'Chickpeas' },
      { id: 'black_beans', label: 'Black beans' },
    ]},
  { key: 'nuts', title: 'Nuts & seeds', matrix: 'SUPPORT + PROTECT',
    why: 'Useful minerals and protective nutrients.',
    foods: [
      { id: 'pumpkin_seeds', label: 'Pumpkin seeds', why: 'Strong zinc source.' },
      { id: 'sunflower_seeds', label: 'Sunflower seeds' },
      { id: 'chia_seeds', label: 'Chia seeds' },
      { id: 'flaxseed', label: 'Flaxseed' },
      { id: 'walnuts', label: 'Walnuts' },
      { id: 'cashews', label: 'Cashews' },
      { id: 'almonds', label: 'Almonds' },
      { id: 'brazil_nuts', label: 'Brazil nuts', why: 'Selenium — one a day, no more.' },
      { id: 'tahini', label: 'Tahini' },
    ]},
  { key: 'extras', title: 'Extras & collagen heroes', matrix: 'BUILD + PROTECT',
    why: 'Small but useful additions.',
    foods: [
      { id: 'gelatin', label: 'Gelatin' },
      { id: 'chicken_skin', label: 'Chicken skin' },
      { id: 'dark_chocolate', label: 'Dark chocolate 70%+' },
      { id: 'olive_oil', label: 'Olive oil' },
      { id: 'green_tea', label: 'Green tea' },
    ]},
]

export const FOOD_LABEL: Record<string, string> = Object.fromEntries(
  FOOD_GROUPS.flatMap(g => g.foods.map(f => [f.id, f.label] as const)),
)

export const RESTRICTIONS: Opt[] = [
  { id: 'none', label: 'No restrictions' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'soy', label: 'Soy' },
  { id: 'other', label: 'Other — tell me' },
]

export const COOK_TIME: Opt[] = [
  { id: '15', label: '15 minutes. Feed me.' },
  { id: '30', label: '30 minutes is fine.' },
  { id: 'proper', label: "I don't mind proper cooking." },
  { id: 'ask', label: 'Depends on the day — ask me.' },
]

export const STYLE_OPTIONS: Opt[] = [
  { id: 'spice_bit', label: 'I like a bit of spice' },
  { id: 'spice_max', label: 'The hotter the better' },
  { id: 'minimal', label: 'Minimal effort is ideal' },
  { id: 'batch', label: 'I love batch cooking' },
  { id: 'cook_others', label: "I'm usually cooking for other people too" },
  { id: 'on_go', label: 'I eat out or grab food on the go a lot' },
  { id: 'sweet', label: "I've got a sweet tooth" },
  { id: 'savoury', label: "I'm more savoury" },
  { id: 'fresh', label: 'I like fresh, lighter meals' },
  { id: 'comfort', label: 'Give me comfort food' },
  { id: 'depends', label: 'Depends on the day — ask me' },
]

export const USUALS: Opt[] = [
  { id: 'olive_oil', label: 'Olive oil' },
  { id: 'soy_sauce', label: 'Soy sauce' },
  { id: 'garlic', label: 'Garlic' },
  { id: 'ginger', label: 'Ginger' },
  { id: 'turmeric', label: 'Turmeric' },
  { id: 'chilli', label: 'Chilli' },
  { id: 'honey', label: 'Honey' },
  { id: 'mustard', label: 'Mustard' },
  { id: 'tahini', label: 'Tahini' },
  { id: 'peanut_butter', label: 'Peanut butter' },
  { id: 'greek_yoghurt_skyr', label: 'Greek yoghurt / Skyr' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'lemons', label: 'Lemons' },
  { id: 'limes', label: 'Limes' },
  { id: 'fresh_herbs', label: 'Fresh herbs' },
  { id: 'dried_herbs', label: 'Dried herbs' },
  { id: 'spices', label: 'Spices' },
  { id: 'rice', label: 'Rice' },
  { id: 'oats', label: 'Oats' },
  { id: 'frozen_berries', label: 'Frozen berries' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'seeds', label: 'Seeds' },
]

// Milk options — MULTI-SELECT. "any" = I don't mind (exclusive).
export const MILK_OPTIONS: Opt[] = [
  { id: 'dairy', label: 'Dairy milk' },
  { id: 'soya', label: 'Soya' },
  { id: 'almond', label: 'Almond' },
  { id: 'oat', label: 'Oat' },
  { id: 'coconut', label: 'Coconut' },
  { id: 'any', label: "I don't mind" },
]

export const BONE_BROTH_OPTIONS: Opt[] = [
  { id: 'using', label: 'I already use it' },
  { id: 'buy', label: "I'd buy it" },
  { id: 'make', label: "I'd make it" },
  { id: 'open', label: "I'm open to it" },
  { id: 'no', label: 'Not for me' },
]

// Fruit — single "any strong opinions" multi-select. "none" = exclusive.
export const FRUIT_FLAGS: Opt[] = [
  { id: 'grapefruit', label: 'Grapefruit' },
  { id: 'kiwi', label: 'Kiwi' },
  { id: 'blackcurrants', label: 'Blackcurrants' },
  { id: 'guava', label: 'Guava' },
  { id: 'mango', label: 'Mango' },
  { id: 'citrus', label: 'Citrus' },
  { id: 'not_a_fruit_person', label: "I'm not really a fruit person" },
  { id: 'none', label: 'No strong opinions' },
]

export type TextSize = 'standard' | 'larger'

export interface CoachProfile {
  version: 6
  completed: boolean
  disclaimerAcceptedAt: string | null
  updatedAt: string
  firstName: string
  restrictions: string[]
  restrictionsOther: string
  foods: Record<string, FoodPref>
  cookTime: string | null
  style: string[]
  usuals: string[]
  usualsCustom: string
  milks: string[]
  boneBroth: string | null
  fruitFlags: string[]
  textSize: TextSize
}

export const EMPTY_PROFILE: CoachProfile = {
  version: 6,
  completed: false,
  disclaimerAcceptedAt: null,
  updatedAt: '',
  firstName: '',
  restrictions: [],
  restrictionsOther: '',
  foods: {},
  cookTime: null,
  style: [],
  usuals: [],
  usualsCustom: '',
  milks: [],
  boneBroth: null,
  fruitFlags: [],
  textSize: 'standard',
}

export interface FoodLog {
  id: string
  date: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  text: string
  createdAt: string
}