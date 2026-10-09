export type MealCategory = "Protein" | "Plant"

export interface Meal {
  id: string
  name: string
  description: string
  category: MealCategory
  note: string
  price: number
  photoId: string
  photoAlt: string
  photoPage: string
  photographer: string
  photographerPage: string
}

export const meals: Meal[] = [
  {
    id: "pepper-chicken",
    name: "Pepper-crisp chicken",
    description: "Charred greens, red rice & a bright lime sambol.",
    category: "Protein",
    note: "THE EVERYDAY FAVOURITE",
    price: 1490,
    photoId: "photo-1762631383815-784c04533802",
    photoAlt: "Grilled chicken, rice, beans and fresh salsa in a wooden bowl",
    photoPage: "https://unsplash.com/photos/a-wooden-bowl-filled-with-chicken-rice-and-beans-GVJAkiE71Kg",
    photographer: "Joe Boshra",
    photographerPage: "https://unsplash.com/@joestudios",
  },
  {
    id: "coconut-dhal",
    name: "Hoppers, greens & dhal",
    description: "A little island comfort, with all the greens.",
    category: "Plant",
    note: "COLOMBO-MADE IN SPIRIT",
    price: 1390,
    photoId: "photo-1742281095661-29de44440bb6",
    photoAlt: "A Sri Lankan vegan meal with hoppers, greens and yellow rice",
    photoPage: "https://unsplash.com/photos/delicious-sri-lankan-breakfast-is-served-on-platters-9iMvxXPtFCU",
    photographer: "Zoshua Colah",
    photographerPage: "https://unsplash.com/@zoshua",
  },
  {
    id: "curry-leaf-fish",
    name: "Coconut-lime fish curry",
    description: "Bright coconut curry, rice, greens & fresh lime.",
    category: "Protein",
    note: "A LITTLE COASTAL ENERGY",
    price: 1590,
    photoId: "photo-1761314037238-e4da5023e844",
    photoAlt: "Golden fish curry with rice, greens, bean sprouts and lime",
    photoPage: "https://unsplash.com/photos/fish-curry-with-broccoli-tofu-and-rice-23PG8pCgn_Y",
    photographer: "Diego Arenas de Rodrigo",
    photographerPage: "https://unsplash.com/@diegoarenasderodrigo",
  },
  {
    id: "pumpkin-chickpea",
    name: "Chickpea, lentil & greens",
    description: "Comforting dhal, leafy greens and warm spiced rice.",
    category: "Plant",
    note: "PLANT POWER, FULL FLAVOUR",
    price: 1390,
    photoId: "photo-1756821753226-c0fc88056cf7",
    photoAlt: "Lentil curry, steamed rice and cooked greens",
    photoPage: "https://unsplash.com/photos/dal-bhat-with-greens-and-lentil-curry-EvxE8j6lfyY",
    photographer: "Frederick Shaw",
    photographerPage: "https://unsplash.com/@dropfastcollective",
  },
  {
    id: "lime-chilli-chicken",
    name: "Lime-chilli chicken",
    description: "Grilled chicken, steamed rice and a bright chilli sauce.",
    category: "Protein",
    note: "A LITTLE EXTRA FIRE",
    price: 1490,
    photoId: "photo-1766050587783-1c90751275dd",
    photoAlt: "Grilled chicken, rice, egg and fresh salad on a dark plate",
    photoPage: "https://unsplash.com/photos/a-plate-of-rice-with-grilled-chicken-and-fried-egg-g0Xbz3bVrSA",
    photographer: "You Le",
    photographerPage: "https://unsplash.com/@le_y0u",
  },
  {
    id: "cashew-mushroom",
    name: "Coconut curry & rice",
    description: "Rice and a slow-cooked, golden curry with herbs.",
    category: "Plant",
    note: "THE SLOW-LUNCH FEELING",
    price: 1390,
    photoId: "photo-1742599361552-4acba86acc22",
    photoAlt: "A bowl of rice with curry, herbs and peppercorns",
    photoPage: "https://unsplash.com/photos/rice-curry-and-herbs-in-pretty-bowls-a4ztecxFXPg",
    photographer: "Imad 786",
    photographerPage: "https://unsplash.com/@imad8321",
  },
]

export function mealPhotoUrl(meal: Pick<Meal, "photoId">, width = 960) {
  return "https://images.unsplash.com/" + meal.photoId + "?auto=format&fit=crop&crop=entropy&w=" + width + "&q=84"
}

export const photoCredits = Array.from(new Map(meals.map((meal) => [
  meal.photographer,
  { name: meal.photographer, url: meal.photographerPage, page: meal.photoPage },
])).values())

export const formatLkr = (amount: number) =>
  "LKR " + new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(amount)
