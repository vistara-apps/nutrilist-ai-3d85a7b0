
'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, Loader2, Plus, X, ShoppingCart } from 'lucide-react'
import { useAI } from '../lib/ai'
import { useUserStore } from '../lib/store'

interface ShoppingListGeneratorProps {
  onBack: () => void
}

interface ShoppingItem {
  id: string
  name: string
  category: string
  quantity?: string
  notes?: string
}

export function ShoppingListGenerator({ onBack }: ShoppingListGeneratorProps) {
  const [listType, setListType] = useState<'weekly' | 'meal' | 'custom'>('weekly')
  const [mealType, setMealType] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedList, setGeneratedList] = useState<ShoppingItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showList, setShowList] = useState(false)
  
  const { generateShoppingList } = useAI()
  const { user } = useUserStore()

  const handleGenerate = useCallback(async () => {
    if (!user) return

    setIsGenerating(true)
    try {
      let prompt = ''
      
      switch (listType) {
        case 'weekly':
          prompt = `Generate a weekly shopping list for someone with ${user.healthProfile.condition}. Include breakfast, lunch, dinner, and healthy snacks for 7 days.`
          break
        case 'meal':
          prompt = `Generate a shopping list for ${mealType} meals suitable for someone with ${user.healthProfile.condition}.`
          break
        case 'custom':
          prompt = customPrompt
          break
      }

      const items = await generateShoppingList(prompt, user.healthProfile)
      setGeneratedList(items)
      setShowList(true)
    } catch (error) {
      console.error('Failed to generate shopping list:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [listType, mealType, customPrompt, user, generateShoppingList])

  const removeItem = (itemId: string) => {
    setGeneratedList(prev => prev.filter(item => item.id !== itemId))
  }

  const addCustomItem = () => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: 'New item',
      category: 'Other',
    }
    setGeneratedList(prev => [...prev, newItem])
  }

  const groupedItems = generatedList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  if (showList) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowList(false)}
            className="p-2 hover:bg-bg rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-heading">Your Shopping List</h1>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-primary">{category}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      {item.quantity && (
                        <span className="text-sm text-text/70 ml-2">({item.quantity})</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-bg rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={addCustomItem}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:shadow-card transition-all"
            >
              <Plus size={16} />
              Add Item
            </button>
            
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium">
              <ShoppingCart size={16} />
              Save List
            </button>
          </div>
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
        <h1 className="text-heading">Generate Shopping List</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">What type of list do you need?</h3>
          <div className="space-y-3">
            <button
              onClick={() => setListType('weekly')}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                listType === 'weekly'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:shadow-card'
              }`}
            >
              <h4 className="font-medium">Weekly Meal Plan</h4>
              <p className="text-sm text-text/70">Complete shopping for 7 days of meals</p>
            </button>
            
            <button
              onClick={() => setListType('meal')}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                listType === 'meal'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:shadow-card'
              }`}
            >
              <h4 className="font-medium">Specific Meals</h4>
              <p className="text-sm text-text/70">Target specific meal types or occasions</p>
            </button>
            
            <button
              onClick={() => setListType('custom')}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                listType === 'custom'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:shadow-card'
              }`}
            >
              <h4 className="font-medium">Custom Request</h4>
              <p className="text-sm text-text/70">Describe exactly what you need</p>
            </button>
          </div>
        </div>

        {listType === 'meal' && (
          <div>
            <label className="block text-sm font-medium mb-2">What meals are you planning?</label>
            <input
              type="text"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              placeholder="e.g., breakfast for the week, dinner party for 8 people"
              className="w-full p-3 border border-border rounded-lg bg-surface"
            />
          </div>
        )}

        {listType === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Describe what you need</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Low-sodium snacks for work, ingredients for keto meal prep"
              rows={3}
              className="w-full p-3 border border-border rounded-lg bg-surface resize-none"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || (listType === 'meal' && !mealType) || (listType === 'custom' && !customPrompt)}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Shopping List'
          )}
        </button>
      </div>
    </div>
  )
}
