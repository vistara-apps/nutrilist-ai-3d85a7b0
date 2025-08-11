
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HealthProfile {
  condition: string
  subCondition?: string
  targets?: string
  preferences: string[]
  allergies?: string
  dislikes?: string
}

interface User {
  id: string
  healthProfile: HealthProfile
  preferences: Record<string, any>
  createdAt: string
}

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  updateHealthProfile: (profile: Partial<HealthProfile>) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateHealthProfile: (profile) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                healthProfile: { ...state.user.healthProfile, ...profile },
              }
            : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'nutrilist-user',
    }
  )
)

// Shopping List Store
interface ShoppingItem {
  id: string
  name: string
  category: string
  quantity?: string
  notes?: string
  checked?: boolean
}

interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: string
  updatedAt: string
}

interface ShoppingStore {
  lists: ShoppingList[]
  currentList: ShoppingList | null
  addList: (list: ShoppingList) => void
  updateList: (id: string, updates: Partial<ShoppingList>) => void
  deleteList: (id: string) => void
  setCurrentList: (list: ShoppingList | null) => void
}

export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set) => ({
      lists: [],
      currentList: null,
      addList: (list) =>
        set((state) => ({ lists: [...state.lists, list] })),
      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list
          ),
        })),
      deleteList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),
      setCurrentList: (list) => set({ currentList: list }),
    }),
    {
      name: 'nutrilist-shopping',
    }
  )
)
