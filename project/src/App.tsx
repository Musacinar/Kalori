import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Plus, Trash2, Scale, UtensilsCrossed } from 'lucide-react';
import { foodDatabase, searchFoods, calculateCalories } from './foodDatabase';
import { Combobox } from '@headlessui/react';

interface FoodEntry {
  id: number;
  name: string;
  portion: number;
  grams: number;
  calories: number;
}

function App() {
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [goal, setGoal] = useState<'gain' | 'lose'>('lose');
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState(foodDatabase[0]);
  const [query, setQuery] = useState('');
  const [isGramMode, setIsGramMode] = useState(false);
  const [amount, setAmount] = useState<number>(1);

  const filteredFoods = query === '' ? [] : searchFoods(query);
  
  // Calculate BMI
  const bmi = height && weight ? (weight / ((height / 100) ** 2)) : 0;
  
  // Calculate daily calorie needs (Basic BMR * Activity Level)
  const bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; // Using average age of 25
  const dailyCalorieNeeds = Math.round(bmr * 1.4); // Assuming light activity
  
  // Adjust based on goal
  const targetCalories = goal === 'lose' 
    ? dailyCalorieNeeds - 500 
    : dailyCalorieNeeds + 500;

  // Calculate total calories consumed
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);

  const addFood = () => {
    if (selectedFood) {
      const calories = calculateCalories(selectedFood, amount, isGramMode);
      const grams = isGramMode ? amount : selectedFood.defaultPortion * amount;
      const portion = isGramMode ? amount / selectedFood.defaultPortion : amount;

      setFoods([...foods, {
        id: Date.now(),
        name: selectedFood.name,
        portion,
        grams,
        calories: Math.round(calories)
      }]);

      setAmount(1);
      setQuery('');
    }
  };

  const removeFood = (id: number) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Kalori Takip</h1>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boy (cm)
              </label>
              <input
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Boyunuzu girin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilo (kg)
              </label>
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Kilonuzu girin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as 'gain' | 'lose')}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="lose">Kilo Vermek</option>
                <option value="gain">Kilo Almak</option>
              </select>
            </div>
          </div>

          {/* BMI and Calorie Goals */}
          {bmi > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8">
              <div>
                <div className="text-sm font-medium text-gray-600">Vücut Kitle İndeksi</div>
                <div className="text-2xl font-bold text-gray-800">{bmi.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Günlük Hedef</div>
                <div className="text-2xl font-bold text-gray-800">{targetCalories} kcal</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Kalan Kalori</div>
                <div className={`text-2xl font-bold ${targetCalories - totalCalories < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {(targetCalories - totalCalories).toFixed(0)} kcal
                </div>
              </div>
            </div>
          )}

          {/* Add Food Form */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-semibold mb-6">Yemek Ekle</h2>
            <div className="space-y-4">
              <div className="relative">
                <Combobox value={selectedFood} onChange={setSelectedFood}>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      onChange={(event) => setQuery(event.target.value)}
                      displayValue={(food: any) => food?.name || ''}
                      placeholder="Yemek adı"
                    />
                    {filteredFoods.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-auto">
                        {filteredFoods.map((food) => (
                          <Combobox.Option
                            key={food.id}
                            value={food}
                            className={({ active }) =>
                              `p-3 cursor-pointer ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-800'}`
                            }
                          >
                            {food.name}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsGramMode(false)}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition ${
                    !isGramMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <UtensilsCrossed size={20} />
                  Porsiyon
                </button>
                <button
                  onClick={() => setIsGramMode(true)}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition ${
                    isGramMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Scale size={20} />
                  Gram
                </button>
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder={isGramMode ? "Gram" : "Porsiyon"}
                  min="0"
                />
                <button
                  onClick={addFood}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Food List */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Bugünkü Yemek Listesi</h2>
            <div className="space-y-3">
              {foods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      {food.portion.toFixed(1)} porsiyon • {food.grams}g • {food.calories} kcal
                    </div>
                  </div>
                  <button
                    onClick={() => removeFood(food.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {foods.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="mx-auto mb-3" size={32} />
                  <p>Henüz yemek eklenmedi. Yemeklerinizi takip etmeye başlayın!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;