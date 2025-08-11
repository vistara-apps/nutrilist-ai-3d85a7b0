
'use client'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

interface ShoppingItem {
  id: string
  name: string
  category: string
  quantity?: string
  notes?: string
}

interface HealthProfile {
  condition: string
  subCondition?: string
  targets?: string
  preferences: string[]
  allergies?: string
  dislikes?: string
}

export const useAI = () => {
  const generateShoppingList = async (
    prompt: string,
    healthProfile: HealthProfile
  ): Promise<ShoppingItem[]> => {
    try {
      const systemPrompt = `You are a nutrition expert AI assistant specializing in creating shopping lists for people with specific health conditions.

User Profile:
- Health condition: ${healthProfile.condition}
- Specific type/stage: ${healthProfile.subCondition || 'Not specified'}
- Health goals: ${healthProfile.targets || 'General health maintenance'}
- Dietary preferences: ${healthProfile.preferences.join(', ') || 'None specified'}
- Allergies: ${healthProfile.allergies || 'None specified'}
- Food dislikes: ${healthProfile.dislikes || 'None specified'}

Guidelines:
1. Only recommend foods that are safe and beneficial for their condition
2. Consider their dietary preferences and restrictions
3. Avoid any allergens they've mentioned
4. Provide practical quantities (e.g., "1 bag", "2 lbs", "1 bunch")
5. Group items by grocery store categories
6. Include brief notes about why specific items are beneficial

Return the response as a JSON array of objects with this structure:
{
  "name": "item name",
  "category": "category (Produce, Protein, Grains, Dairy, etc.)",
  "quantity": "suggested quantity",
  "notes": "brief note about benefits for their condition"
}

Generate 10-15 items unless specifically requested otherwise.`

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      try {
        const items = JSON.parse(response)
        return items.map((item: any, index: number) => ({
          id: (Date.now() + index).toString(),
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes,
        }))
      } catch (parseError) {
        // Fallback parsing if JSON is malformed
        console.error('Failed to parse AI response as JSON:', parseError)
        return []
      }
    } catch (error) {
      console.error('Error generating shopping list:', error)
      throw new Error('Failed to generate shopping list. Please try again.')
    }
  }

  const analyzeFoodSuitability = async (
    foodName: string,
    healthProfile: HealthProfile
  ): Promise<{
    suitability: 'excellent' | 'good' | 'caution' | 'avoid'
    reason: string
    alternatives?: string[]
  }> => {
    try {
      const systemPrompt = `You are a nutrition expert AI analyzing food suitability for specific health conditions.

User Profile:
- Health condition: ${healthProfile.condition}
- Specific type/stage: ${healthProfile.subCondition || 'Not specified'}
- Health goals: ${healthProfile.targets || 'General health maintenance'}
- Dietary preferences: ${healthProfile.preferences.join(', ') || 'None specified'}
- Allergies: ${healthProfile.allergies || 'None specified'}

Analyze the given food and return a JSON object with:
{
  "suitability": "excellent|good|caution|avoid",
  "reason": "explanation of why this food is/isn't suitable for their condition",
  "alternatives": ["alternative1", "alternative2"] // only if suitability is caution or avoid
}`

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Analyze this food: ${foodName}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      return JSON.parse(response)
    } catch (error) {
      console.error('Error analyzing food suitability:', error)
      return {
        suitability: 'caution',
        reason: 'Unable to analyze this food at the moment. Please consult with a healthcare provider.',
      }
    }
  }

  return {
    generateShoppingList,
    analyzeFoodSuitability,
  }
}
