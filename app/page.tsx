
'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useClose,
  useViewProfile,
  useNotification,
} from '@coinbase/onchainkit/minikit'
import { AppShell } from './components/AppShell'
import { ProfileSetup } from './components/ProfileSetup'
import { ShoppingListGenerator } from './components/ShoppingListGenerator'
import { StoreFinder } from './components/StoreFinder'
import { FoodDatabase } from './components/FoodDatabase'
import { SettingsPanel } from './components/SettingsPanel'
import { useUserStore } from './lib/store'

export default function Home() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const [currentView, setCurrentView] = useState<'onboarding' | 'profile' | 'dashboard' | 'generator' | 'store' | 'database' | 'settings'>('onboarding')
  const [frameAdded, setFrameAdded] = useState(false)
  
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const close = useClose()
  const viewProfile = useViewProfile()
  const sendNotification = useNotification()
  
  const { user, setUser } = useUserStore()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  useEffect(() => {
    if (user) {
      setCurrentView('dashboard')
    }
  }, [user])

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame()
    if (result) {
      setFrameAdded(true)
      console.log('Frame added:', result.url, result.token)
    }
  }, [addFrame])

  const handleCompleteProfile = useCallback((profileData: any) => {
    setUser({
      id: Date.now().toString(),
      healthProfile: profileData,
      preferences: {},
      createdAt: new Date().toISOString(),
    })
    setCurrentView('dashboard')
  }, [setUser])

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added && !frameAdded) {
      return (
        <button
          onClick={handleAddFrame}
          className="text-primary hover:text-primary/80 font-semibold text-sm"
        >
          SAVE
        </button>
      )
    }
    return null
  }, [context, frameAdded, handleAddFrame])

  const renderContent = () => {
    switch (currentView) {
      case 'onboarding':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-lg mb-6 flex items-center justify-center">
              <span className="text-white text-2xl">🥗</span>
            </div>
            <h1 className="text-display mb-4">NutriList AI</h1>
            <p className="text-body text-text/70 mb-8 max-w-sm">
              Your personalized food shopper for a healthier you. Get AI-powered nutrition recommendations tailored to your specific health needs.
            </p>
            <button
              onClick={() => setCurrentView('profile')}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        )
      
      case 'profile':
        return <ProfileSetup onComplete={handleCompleteProfile} />
      
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-heading mb-2">Welcome back!</h1>
              <p className="text-body text-text/70">Ready to create your personalized shopping list?</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setCurrentView('generator')}
                className="bg-surface border border-border rounded-lg p-6 text-left hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📝</span>
                  <h3 className="text-heading">Generate Shopping List</h3>
                </div>
                <p className="text-body text-text/70">Create AI-powered shopping lists tailored to your health needs</p>
              </button>
              
              <button
                onClick={() => setCurrentView('store')}
                className="bg-surface border border-border rounded-lg p-6 text-left hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏪</span>
                  <h3 className="text-heading">Find Local Stores</h3>
                </div>
                <p className="text-body text-text/70">Locate nearby stores with products that match your dietary needs</p>
              </button>
              
              <button
                onClick={() => setCurrentView('database')}
                className="bg-surface border border-border rounded-lg p-6 text-left hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🍎</span>
                  <h3 className="text-heading">Food Database</h3>
                </div>
                <p className="text-body text-text/70">Browse and track foods suitable for your condition</p>
              </button>
            </div>
          </div>
        )
      
      case 'generator':
        return <ShoppingListGenerator onBack={() => setCurrentView('dashboard')} />
      
      case 'store':
        return <StoreFinder onBack={() => setCurrentView('dashboard')} />
      
      case 'database':
        return <FoodDatabase onBack={() => setCurrentView('dashboard')} />
      
      case 'settings':
        return <SettingsPanel onBack={() => setCurrentView('dashboard')} />
      
      default:
        return null
    }
  }

  return (
    <AppShell
      saveFrameButton={saveFrameButton}
      onClose={close}
      onViewProfile={viewProfile}
      onSettings={() => setCurrentView('settings')}
      showNavigation={currentView === 'dashboard'}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </AppShell>
  )
}
