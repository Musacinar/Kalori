interface FoodItem {
  id: number;
  name: string;
  caloriesPer100g: number;
  defaultPortion: number; // in grams
}

export const foodDatabase: FoodItem[] = [
  { id: 1, name: "Tavuk Göğsü (Izgara)", caloriesPer100g: 165, defaultPortion: 150 },
  { id: 2, name: "Pilav", caloriesPer100g: 130, defaultPortion: 200 },
  { id: 3, name: "Tam Buğday Ekmeği", caloriesPer100g: 247, defaultPortion: 50 },
  { id: 4, name: "Yoğurt", caloriesPer100g: 61, defaultPortion: 200 },
  { id: 5, name: "Taze Meyve Salatası", caloriesPer100g: 50, defaultPortion: 150 },
  { id: 6, name: "Ton Balığı", caloriesPer100g: 184, defaultPortion: 100 },
  { id: 7, name: "Mercimek Çorbası", caloriesPer100g: 65, defaultPortion: 300 },
  { id: 8, name: "Peynir (Beyaz)", caloriesPer100g: 264, defaultPortion: 30 },
  { id: 9, name: "Yumurta (Haşlanmış)", caloriesPer100g: 155, defaultPortion: 50 },
  { id: 10, name: "Zeytin", caloriesPer100g: 115, defaultPortion: 30 },
  // Add more foods as needed
];

export function searchFoods(query: string): FoodItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(normalizedQuery)
  );
}

export function calculateCalories(food: FoodItem, amount: number, isGrams: boolean): number {
  if (isGrams) {
    return (food.caloriesPer100g * amount) / 100;
  } else {
    // amount is in portions
    return (food.caloriesPer100g * food.defaultPortion * amount) / 100;
  }
}