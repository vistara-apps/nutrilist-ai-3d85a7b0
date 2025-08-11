
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Search, Heart, AlertTriangle, CheckCircle } from 'lucide-react'

interface FoodDatabaseProps {
  onBack: () => void
}

interface FoodItem {
  id: string
  name: string
  category: string
  suitability: 'excellent' | 'good' | 'caution' | 'avoid'
  reason: string
  nutrition: {
    calories: number
    carbs: number
    protein: number
    fat: number
    sodium: number
  }
}

const mockFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Quinoa',
    category: 'Grains',
    suitability: 'excellent',
    reason: 'High protein, gluten-free, low glycemic index',
    nutrition: { calories: 222, carbs: 39, protein: 8, fat: 4, sodium: 13 },
  },
  {
    id: '2',
    name: 'Salmon',
    category: 'Protein',
    suitability: 'excellent',
    reason: 'Rich in omega-3 fatty acids, heart-healthy',
    nutrition: { calories: 206, carbs: 0, protein: 22, fat: 12, sodium: 59 },
  },
  {
    id: '3',
    name: 'White Bread',
    category: 'Grains',
    suitability: 'avoid',
    reason: 'High glycemic index, low nutritional value',
    nutrition: { calories: 265, carbs: 49, protein: 9, fat: 3, sodium: 491 },
  },
  {
    id: '4',
    name: 'Avocado',
    category: 'Fruits',
    suitability: 'good',
    reason: 'Healthy fats, fiber, but high in calories',
    nutrition: { calories: 160, carbs: 9, protein: 2, fat: 15, sodium: 7 },
  },
]

const categories = ['All', 'Grains', 'Protein', 'Fruits', 'Vegetables', 'Dairy', 'Snacks']

export function FoodDatabase({ onBack }: FoodDatabaseProps) {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFoods(mockFoods)
      setFilteredFoods(mockFoods)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = foods

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(food => food.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFoods(filtered)
  }, [foods, selectedCategory, searchTerm])

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return <CheckCircle className="text-green-500" size={20} />
      case 'good':
        return <Heart className="text-blue-500" size={20} />
      case 'caution':
        return <AlertTriangle className="text-yellow-500" size={20} />
      case 'avoid':
        return <AlertTriangle className="text-red-500" size={20} />
      default:
        return null
    }
  }

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return 'text-green-600 bg-green-50'
      case 'good':
        return 'text-blue-600 bg-blue-50'
      case 'caution':
        return 'text-yellow-600 bg-yellow-50'
      case 'avoid':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-text/70 bg-bg'
    }
  }

  if (selectedFood) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedFood(null)}
            className="p-2 hover:bg-bg rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-heading">{selectedFood.name}</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {getSuitabilityIcon(selectedFood.suitability)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(selectedFood.suitability)}`}>
                {selectedFood.suitability.charAt(0).toUpperCase() + selectedFood.suitability.slice(1)}
              </span>
            </div>
            <p className="text-body">{selectedFood.reason}</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Nutrition Facts (per 100g)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedFood.nutrition.calories}</div>
                <div className="text-sm text-text/70">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedFood.nutrition.protein}g</div>
                <div className="text-sm text-text/70">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedFood.nutrition.carbs}g</div>
                <div className="text-sm text-text/70">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedFood.nutrition.fat}g</div>
                <div className="text-sm text-text/70">Fat</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span>Sodium</span>
                <span className="font-medium">{selectedFood.nutrition.sodium}mg</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium">
            Add to Shopping List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-bg rounded-md"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading">Food Database</h1>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search foods..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-surface"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border hover:shadow-card'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-border rounded mb-2 w-1/3"></div>
              <div className="h-3 bg-border rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <button
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="w-full bg-surface border border-border rounded-lg p-4 text-left hover:shadow-card transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{food.name}</h3>
                  <p className="text-sm text-text/70">{food.category}</p>
                </div>
                {getSuitabilityIcon(food.suitability)}
              </div>
              <p className="text-sm text-text/70 line-clamp-2">{food.reason}</p>
            </button>
          ))}
          
          {filteredFoods.length === 0 && (
            <div className="text-center py-8 text-text/70">
              <p>No foods found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
