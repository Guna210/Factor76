export type MealCategory = 'Protein' | 'Plant'

export interface Meal {
  id: string
  name: string
  description: string
  category: MealCategory
  note: string
  price: number
  color: string
  accent: string
}

export const meals: Meal[] = [
  {
    id: 'pepper-chicken',
    name: 'Black pepper chicken',
    description: 'Roasted chicken, red rice, charred greens.',
    category: 'Protein',
    note: 'THE EVERYDAY HERO',
    price: 1490,
    color: '#d9e1aa',
    accent: '#ab653c',
  },
  {
    id: 'coconut-dhal',
    name: 'Coconut dhal bowl',
    description: 'Creamy dhal, turmeric rice, coconut sambol.',
    category: 'Plant',
    note: 'COMFORT, REMIXED',
    price: 1490,
    color: '#e9c49f',
    accent: '#d49a32',
  },
  {
    id: 'curry-leaf-fish',
    name: 'Curry-leaf fish',
    description: 'Spiced fish, lime rice, sautéed beans.',
    category: 'Protein',
    note: 'COASTAL ENERGY',
    price: 1490,
    color: '#c3d5d7',
    accent: '#d5a55d',
  },
  {
    id: 'pumpkin-chickpea',
    name: 'Roast pumpkin & chickpea',
    description: 'Caramelised pumpkin, chickpeas, herby rice.',
    category: 'Plant',
    note: 'PLANTS WITH PERSONALITY',
    price: 1490,
    color: '#e3b99c',
    accent: '#de723b',
  },
  {
    id: 'lime-chilli-chicken',
    name: 'Lime & chilli chicken',
    description: 'Citrus chicken, coconut rice, crunchy slaw.',
    category: 'Protein',
    note: 'A LITTLE EXTRA FIRE',
    price: 1490,
    color: '#d4c1d2',
    accent: '#bb613d',
  },
  {
    id: 'cashew-mushroom',
    name: 'Cashew & mushroom curry',
    description: 'Roasted cashews, mushrooms, fragrant rice.',
    category: 'Plant',
    note: 'THE SLOW-LUNCH FEELING',
    price: 1490,
    color: '#c6d0ad',
    accent: '#a48760',
  },
]

export const formatLkr = (amount: number) =>
  `LKR ${new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(amount)}`
