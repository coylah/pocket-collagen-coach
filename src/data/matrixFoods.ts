// Collagen Matrix v3 — profile schema, food universe, options.
// Deduped for user preference tapping (no derivative duplicates like citrus zest).

export type FoodPref = 'love' | 'like' | 'if_it_fits' | 'not_for_me'

export interface Opt { id: string; label: string }
export interface FoodItem { id: string; label: string }
export interface FoodGroup { key: string; title: string; foods: FoodItem[] }

export const FOOD_GROUPS: FoodGroup[] = [
  { key: 'meat_eggs', title: 'Meat & eggs', foods: [
    { id: 'chicken', label: 'Chicken' },
    { id: 'turkey', label: 'Turkey' },
    { id: 'beef', label: 'Beef' },
    { id: 'lamb', label: 'Lamb' },
    { id: 'pork', label: 'Pork' },
    { id: 'liver', label: 'Liver' },
    { id: 'eggs', label: 'Eggs' },
  ]},
  { key: 'fish', title: 'Fish & seafood', foods: [
    { id: 'salmon', label: 'Salmon' },
    { id: 'mackerel', label: 'Mackerel' },
    { id: 'sardines', label: 'Sardines' },
    { id: 'tuna', label: 'Tuna' },
    { id: 'cod', label: 'Cod' },
    { id: 'trout', label: 'Trout' },
    { id: 'prawns', label: 'Prawns' },
    { id: 'oysters', label: 'Oysters' },
  ]},
  { key: 'dairy', title: 'Dairy', foods: [
    { id: 'greek_yoghurt', label: 'Greek yoghurt' },
    { id: 'skyr', label: 'Skyr' },
    { id: 'cottage_cheese', label: 'Cottage cheese' },
    { id: 'halloumi', label: 'Halloumi' },
    { id: 'feta', label: 'Feta' },
    { id: 'hard_cheese', label: 'Hard cheese' },
    { id: 'milk', label: 'Milk' },
  ]},
  { key: 'fruit', title: 'Fruit', foods: [
    { id: 'kiwi', label: 'Kiwi' },
    { id: 'strawberries', label: 'Strawberries' },
    { id: 'blueberries', label: 'Blueberries' },
    { id: 'raspberries', label: 'Raspberries' },
    { id: 'oranges', label: 'Oranges' },
    { id: 'pineapple', label: 'Pineapple' },
    { id: 'mango', label: 'Mango' },
    { id: 'watermelon', label: 'Watermelon' },
    { id: 'pomegranate', label: 'Pomegranate' },
    { id: 'red_grapes', label: 'Red grapes' },
  ]},
  { key: 'veg', title: 'Vegetables & greens', foods: [
    { id: 'red_pepper', label: 'Red pepper' },
    { id: 'yellow_pepper', label: 'Yellow pepper' },
    { id: 'broccoli', label: 'Broccoli' },
    { id: 'kale', label: 'Kale' },
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
  { key: 'grains', title: 'Beans, grains & carbs', foods: [
    { id: 'oats', label: 'Oats' },
    { id: 'brown_rice', label: 'Brown rice' },
    { id: 'quinoa', label: 'Quinoa' },
    { id: 'lentils', label: 'Lentils' },
    { id: 'chickpeas', label: 'Chickpeas' },
    { id: 'black_beans', label: 'Black beans' },
    { id: 'wholegrain_bread', label: 'Wholegrain bread' },
  ]},
  { key: 'nuts', title: 'Nuts & seeds', foods: [
    { id: 'pumpkin_seeds', label: 'Pumpkin seeds' },
    { id: 'sunflower_seeds', label: 'Sunflower seeds' },
    { id: 'chia_seeds', label: 'Chia seeds' },
    { id: 'flaxseed', label: 'Flaxseed' },
    { id: 'walnuts', label: 'Walnuts' },
    { id: 'cashews', label: 'Cashews' },
    { id: 'almonds', label: 'Almonds' },
    { id: 'brazil_nuts', label: 'Brazil nuts' },
    { id: 'tahini', label: 'Tahini' },
  ]},
  { key: 'extras', title: 'Extras & collagen heroes', foods: [
    { id: 'bone_broth', label: 'Bone broth' },
    { id: 'gelatin', label: 'Gelatin' },
    { id: 'chicken_skin', label: 'Chicken skin' },
    { id: 'dark_chocolate', label: 'Dark chocolate 70%+' },
    { id: 'olive_oil', label: 'Olive oil' },
    { id: 'green_tea', label: 'Green tea' },
    { id: 'fresh_herbs', label: 'Fresh herbs' },
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
  { id: 'budget', label: 'Keep it budget-friendly' },
  { id: 'quality', label: "I'll spend more if it's genuinely worth it" },
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
  { id: 'greek_yoghurt', label: 'Greek yoghurt' },
  { id: 'skyr', label: 'Skyr' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'lemons', label: 'Lemons' },
  { id: 'limes', label: 'Limes' },
  { id: 'fresh_herbs', label: 'Fresh herbs' },
  { id: 'dried_herbs', label: 'Dried herbs' },
  { id: 'spices', label: 'Spices' },
  { id: 'rice', label: 'Rice' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'oats', label: 'Oats' },
  { id: 'frozen_berries', label: 'Frozen berries' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'seeds', label: 'Seeds' },
]

export interface CoachProfile {
  version: 4
  completed: boolean
  disclaimerAcceptedAt: string | null
  updatedAt: string
  restrictions: string[]
  restrictionsOther: string
  foods: Record<string, FoodPref>
  cookTime: string | null
  style: string[]
  usuals: string[]
  usualsCustom: string
}

export const EMPTY_PROFILE: CoachProfile = {
  version: 4,
  completed: false,
  disclaimerAcceptedAt: null,
  updatedAt: '',
  restrictions: [],
  restrictionsOther: '',
  foods: {},
  cookTime: null,
  style: [],
  usuals: [],
  usualsCustom: '',
}

export interface FoodLog {
  id: string
  date: string // YYYY-MM-DD
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  text: string
  createdAt: string
}
