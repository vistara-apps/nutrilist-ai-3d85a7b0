
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProfileSetupProps {
  onComplete: (profileData: any) => void
}

const healthConditions = [
  { id: 'diabetes', name: 'Diabetes', description: 'Type 1 or Type 2 diabetes management' },
  { id: 'ibs', name: 'IBS', description: 'Irritable Bowel Syndrome dietary needs' },
  { id: 'celiac', name: 'Celiac Disease', description: 'Gluten-free dietary requirements' },
  { id: 'hypertension', name: 'Hypertension', description: 'High blood pressure management' },
  { id: 'heart', name: 'Heart Disease', description: 'Cardiovascular health support' },
  { id: 'kidney', name: 'Kidney Disease', description: 'Renal diet requirements' },
  { id: 'other', name: 'Other', description: 'Custom dietary needs' },
]

const dietaryPreferences = [
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'keto', name: 'Ketogenic' },
  { id: 'paleo', name: 'Paleo' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'lowcarb', name: 'Low Carb' },
  { id: 'lowfat', name: 'Low Fat' },
]

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    condition: '',
    subCondition: '',
    targets: '',
    preferences: [] as string[],
    allergies: '',
    dislikes: '',
  })

  const handleConditionSelect = (conditionId: string) => {
    setFormData(prev => ({ ...prev, condition: conditionId }))
  }

  const handlePreferenceToggle = (preferenceId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preferenceId)
        ? prev.preferences.filter(p => p !== preferenceId)
        : [...prev.preferences, preferenceId]
    }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    onComplete(formData)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">What's your main health focus?</h2>
              <p className="text-body text-text/70">Select the condition you'd like help managing</p>
            </div>
            
            <div className="space-y-3">
              {healthConditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleConditionSelect(condition.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.condition === condition.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface hover:shadow-card'
                  }`}
                >
                  <h3 className="font-semibold mb-1">{condition.name}</h3>
                  <p className="text-sm text-text/70">{condition.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">Tell us more details</h2>
              <p className="text-body text-text/70">Help us understand your specific needs</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Specific type or stage</label>
                <input
                  type="text"
                  value={formData.subCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, subCondition: e.target.value }))}
                  placeholder="e.g., Type 2, IBS-D, Stage 3, etc."
                  className="w-full p-3 border border-border rounded-lg bg-surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Health targets or goals</label>
                <textarea
                  value={formData.targets}
                  onChange={(e) => setFormData(prev => ({ ...prev, targets: e.target.value }))}
                  placeholder="e.g., A1c under 7%, reduce inflammation, maintain weight, etc."
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg bg-surface resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">Dietary preferences</h2>
              <p className="text-body text-text/70">Select any dietary styles you follow</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {dietaryPreferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => handlePreferenceToggle(pref.id)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.preferences.includes(pref.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface hover:shadow-card'
                  }`}
                >
                  {pref.name}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">Final details</h2>
              <p className="text-body text-text/70">Help us avoid foods that don't work for you</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Food allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="e.g., nuts, shellfish, dairy"
                  className="w-full p-3 border border-border rounded-lg bg-surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Foods you dislike</label>
                <input
                  type="text"
                  value={formData.dislikes}
                  onChange={(e) => setFormData(prev => ({ ...prev, dislikes: e.target.value }))}
                  placeholder="e.g., mushrooms, spicy food, fish"
                  className="w-full p-3 border border-border rounded-lg bg-surface"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text/70">Step {step} of 4</span>
          <span className="text-sm text-text/70">{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 text-text/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && !formData.condition}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
          >
            Complete Setup
          </button>
        )}
      </div>
    </div>
  )
}
