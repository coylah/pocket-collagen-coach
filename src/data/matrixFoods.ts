// Deduped Matrix v3 food universe grouped for the onboarding food preference map.
// Each food has a stable slug used as the profile key.

export type FoodPref = 'love' | 'happy' | 'if_it_works' | 'no'

export interface FoodItem { id: string; label: string }
export interface FoodGroup { key: string; title: string; blurb: string; foods: FoodItem[] }

export const FOOD_GROUPS: FoodGroup[] = [
  {
    key: 'meat_eggs',
    title: 'Meat & eggs',
    blurb: 'Proper protein — the raw material for collagen.',
    foods: [
      { id: 'chicken', label: 'Chicken' },
      { id: 'turkey', label: 'Turkey' },
      { id: 'beef', label: 'Beef' },
      { id: 'lamb', label: 'Lamb' },
      { id: 'pork', label: 'Pork' },
      { id: 'liver', label: 'Liver' },
      { id: 'eggs', label: 'Eggs' },
    ],
  },
  {
    key: 'fish_seafood',
    title: 'Fish & seafood',
    blurb: 'Omega-3, protein and the zinc/copper hero: oysters.',
    foods: [
      { id: 'salmon', label: 'Salmon' },
      { id: 'mackerel', label: 'Mackerel' },
      { id: 'sardines', label: 'Sardines' },
      { id: 'tuna', label: 'Tuna' },
      { id: 'cod', label: 'Cod' },
      { id: 'trout', label: 'Trout' },
      { id: 'prawns', label: 'Prawns' },
      { id: 'oysters', label: 'Oysters' },
    ],
  },
  {
    key: 'dairy',
    title: 'Dairy',
    blurb: 'Easy protein wins for busy days.',
    foods: [
      { id: 'greek_yoghurt', label: 'Greek yoghurt' },
      { id: 'skyr', label: 'Skyr' },
      { id: 'cottage_cheese', label: 'Cottage cheese' },
      { id: 'halloumi', label: 'Halloumi' },
      { id: 'feta', label: 'Feta' },
      { id: 'hard_cheese', label: 'Hard cheese' },
      { id: 'milk', label: 'Milk' },
    ],
  },
  {
    key: 'fruit',
    title: 'Fruit',
    blurb: 'Vitamin C, antioxidants, protection.',
    foods: [
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
    ],
  },
  {
    key: 'veg_greens',
    title: 'Vegetables & greens',
    blurb: 'Vitamin A, C, antioxidants and silica.',
    foods: [
      { id: 'red_pepper', label: 'Red pepper' },
      { id: 'yellow_pepper', label: 'Yellow pepper' },
      { id: 'broccoli', label: 'Broccoli' },
      { id: 'kale', label: 'Kale' },
      { id: 'spinach', label: 'Spinach' },
      { id: 'sweet_potato', label: 'Sweet potato' },
      { id: 'carrots', label: 'Carrots' },
      { id: 'butternut_squash', label: 'Butternut squash' },
      { id: 'tomatoes', label: 'Tomatoes (cooked)' },
      { id: 'cucumber', label: 'Cucumber' },
      { id: 'avocado', label: 'Avocado' },
      { id: 'brussels_sprouts', label: 'Brussels sprouts' },
      { id: 'cauliflower', label: 'Cauliflower' },
    ],
  },
  {
    key: 'beans_grains',
    title: 'Beans, grains & carbs',
    blurb: 'Blood sugar stability, silica and plant protein.',
    foods: [
      { id: 'oats', label: 'Oats' },
      { id: 'brown_rice', label: 'Brown rice' },
      { id: 'quinoa', label: 'Quinoa' },
      { id: 'lentils', label: 'Lentils' },
      { id: 'chickpeas', label: 'Chickpeas' },
      { id: 'black_beans', label: 'Black beans' },
      { id: 'wholegrain_bread', label: 'Wholegrain bread' },
    ],
  },
  {
    key: 'nuts_seeds',
    title: 'Nuts & seeds',
    blurb: 'Zinc, copper, manganese and healthy fats.',
    foods: [
      { id: 'pumpkin_seeds', label: 'Pumpkin seeds' },
      { id: 'sunflower_seeds', label: 'Sunflower seeds' },
      { id: 'chia_seeds', label: 'Chia seeds' },
      { id: 'flaxseed', label: 'Flaxseed' },
      { id: 'walnuts', label: 'Walnuts' },
      { id: 'cashews', label: 'Cashews' },
      { id: 'almonds', label: 'Almonds' },
      { id: 'brazil_nuts', label: 'Brazil nuts' },
      { id: 'tahini', label: 'Tahini / sesame' },
    ],
  },
  {
    key: 'extras',
    title: 'Extras & collagen heroes',
    blurb: 'The little things that pull a matrix together.',
    foods: [
      { id: 'bone_broth', label: 'Bone broth' },
      { id: 'gelatin', label: 'Gelatin' },
      { id: 'chicken_skin', label: 'Chicken skin' },
      { id: 'dark_chocolate', label: 'Dark chocolate 70%+' },
      { id: 'olive_oil', label: 'Olive oil' },
      { id: 'ginger', label: 'Ginger' },
      { id: 'turmeric', label: 'Turmeric' },
      { id: 'green_tea', label: 'Green tea' },
      { id: 'herbs', label: 'Fresh herbs' },
      { id: 'citrus_zest', label: 'Citrus zest' },
    ],
  },
]

export const FOOD_LABEL: Record<string, string> = Object.fromEntries(
  FOOD_GROUPS.flatMap(g => g.foods.map(f => [f.id, f.label] as const)),
)

export const DIET_OPTIONS: FoodItem[] = [
  { id: 'none', label: 'No restrictions' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'gluten_free', label: 'Gluten free' },
  { id: 'dairy_free', label: 'Dairy free' },
  { id: 'nut_allergy', label: 'Nut allergy' },
  { id: 'pregnant', label: 'Pregnant / trying' },
]

export const STYLE_OPTIONS: FoodItem[] = [
  { id: 'heat_bit', label: '🔥 I like a bit of heat' },
  { id: 'heat_max', label: '🌶️ The hotter the better' },
  { id: 'under_20', label: '⏱️ Under 20 minutes, please' },
  { id: 'proper_cooking', label: "🍳 I don't mind proper cooking" },
  { id: 'minimal_effort', label: '🫠 Minimal effort is ideal' },
  { id: 'batch_cooking', label: '🍲 I love batch cooking' },
  { id: 'cook_for_others', label: "🍽️ Usually cooking for others too" },
  { id: 'on_the_go', label: '🥡 I eat out / grab on the go a lot' },
  { id: 'sweet_tooth', label: "🍫 Absolute sweet tooth" },
  { id: 'savoury', label: '🥨 More savoury' },
  { id: 'fresh_light', label: '🥗 Fresh, lighter meals' },
  { id: 'comfort', label: '🍝 Give me comfort food' },
  { id: 'budget', label: '💷 Keep it budget-friendly' },
  { id: 'quality', label: "✨ I'll spend more if it's worth it" },
]

export const PROTEIN_FREQ = [
  { id: 'rare', label: 'Rarely / less than one' },
  { id: 'one', label: 'Usually one' },
  { id: 'two', label: 'Usually two' },
  { id: 'three_plus', label: 'Three or more' },
]

export const OILY_FISH_FREQ = [
  { id: 'never', label: 'Never' },
  { id: 'lt_weekly', label: 'Less than once a week' },
  { id: 'weekly', label: 'Once a week' },
  { id: 'twice_plus', label: 'Two or more times a week' },
]

export const VITC_FREQ = [
  { id: 'rare', label: 'Rarely' },
  { id: 'some', label: 'Some days' },
  { id: 'most', label: 'Most days' },
  { id: 'daily', label: 'Daily' },
]

export const SUPPLEMENT_USE = [
  { id: 'no', label: 'No' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'most', label: 'Most days' },
  { id: 'daily', label: 'Daily' },
]

export const HELP_AREAS = [
  { id: 'home', label: 'Choosing meals at home' },
  { id: 'fridge', label: 'Using what’s in my fridge' },
  { id: 'restaurants', label: 'Restaurants and menus' },
  { id: 'supermarket', label: 'Supermarket choices' },
  { id: 'more_protein', label: 'Getting more protein' },
  { id: 'more_oily_fish', label: 'Eating more oily fish' },
  { id: 'better_meals', label: 'Building better collagen-supporting meals' },
  { id: 'recovery', label: 'Recovering after a rubbish food week' },
]

export interface CoachProfile {
  version: 3
  completed: boolean
  updatedAt: string
  restrictions: string[]
  proteinFrequency: string | null
  oilyFishFrequency: string | null
  vitCFrequency: string | null
  supplementUse: string | null
  helpAreas: string[]
  style: string[]
  foods: Record<string, FoodPref>
}

export const EMPTY_PROFILE: CoachProfile = {
  version: 3,
  completed: false,
  updatedAt: '',
  restrictions: [],
  proteinFrequency: null,
  oilyFishFrequency: null,
  vitCFrequency: null,
  supplementUse: null,
  helpAreas: [],
  style: [],
  foods: {},
}