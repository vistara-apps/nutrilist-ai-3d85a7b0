
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Health condition utilities
export const healthConditions = {
  diabetes: {
    name: 'Diabetes',
    guidelines: [
      'Monitor carbohydrate intake',
      'Choose low glycemic index foods',
      'Include fiber-rich foods',
      'Limit processed sugars',
    ],
  },
  ibs: {
    name: 'IBS',
    guidelines: [
      'Follow low FODMAP diet if needed',
      'Include soluble fiber',
      'Identify trigger foods',
      'Stay hydrated',
    ],
  },
  celiac: {
    name: 'Celiac Disease',
    guidelines: [
      'Strictly avoid gluten',
      'Read all food labels carefully',
      'Choose certified gluten-free products',
      'Prevent cross-contamination',
    ],
  },
  hypertension: {
    name: 'Hypertension',
    guidelines: [
      'Limit sodium intake',
      'Include potassium-rich foods',
      'Choose lean proteins',
      'Limit processed foods',
    ],
  },
  heart: {
    name: 'Heart Disease',
    guidelines: [
      'Limit saturated fats',
      'Include omega-3 fatty acids',
      'Choose whole grains',
      'Limit cholesterol',
    ],
  },
  kidney: {
    name: 'Kidney Disease',
    guidelines: [
      'Limit protein if advised',
      'Monitor potassium intake',
      'Limit phosphorus',
      'Control fluid intake',
    ],
  },
}

export function getConditionGuidelines(condition: string): string[] {
  return healthConditions[condition as keyof typeof healthConditions]?.guidelines || []
}

export function getConditionName(condition: string): string {
  return healthConditions[condition as keyof typeof healthConditions]?.name || capitalizeFirst(condition)
}
