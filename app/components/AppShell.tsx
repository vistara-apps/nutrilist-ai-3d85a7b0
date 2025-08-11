
'use client'

import type { ReactNode } from 'react'
import { Settings, User, Home, ShoppingCart, Store, Database } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
  saveFrameButton?: ReactNode
  onClose: () => void
  onViewProfile: () => void
  onSettings: () => void
  showNavigation?: boolean
  currentView?: string
  onNavigate?: (view: string) => void
}

export function AppShell({
  children,
  saveFrameButton,
  onClose,
  onViewProfile,
  onSettings,
  showNavigation = false,
  currentView,
  onNavigate,
}: AppShellProps) {
  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'generator', icon: ShoppingCart, label: 'Lists' },
    { id: 'store', icon: Store, label: 'Stores' },
    { id: 'database', icon: Database, label: 'Foods' },
  ]

  return (
    <div className="min-h-screen bg-bg minikit-safe-area flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white text-sm">🥗</span>
          </div>
          <span className="font-semibold text-text">NutriList AI</span>
        </div>
        
        <div className="flex items-center gap-2">
          {saveFrameButton}
          <button
            onClick={onViewProfile}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <User size={16} />
          </button>
          <button
            onClick={onSettings}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-text/60 hover:text-text font-semibold text-sm ml-2"
          >
            CLOSE
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && onNavigate && (
        <nav className="bg-surface border-t border-border px-4 py-2">
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const isActive = currentView === item.id
              const Icon = item.icon
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-text/60 hover:text-text hover:bg-bg'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
