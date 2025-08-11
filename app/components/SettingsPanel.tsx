
'use client'

import { useState } from 'react'
import { ChevronLeft, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react'
import { useUserStore } from '../lib/store'

interface SettingsPanelProps {
  onBack: () => void
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true)
  const { user, clearUser } = useUserStore()

  const settingsItems = [
    {
      icon: User,
      label: 'Profile & Health Info',
      description: 'Update your health conditions and preferences',
      action: () => console.log('Edit profile'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Shopping reminders and health tips',
      action: () => setNotifications(!notifications),
      toggle: true,
      value: notifications,
    },
    {
      icon: Shield,
      label: 'Privacy & Data',
      description: 'Manage your data and privacy settings',
      action: () => console.log('Privacy settings'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help with using NutriList AI',
      action: () => console.log('Help'),
    },
  ]

  const handleLogout = () => {
    clearUser()
    onBack()
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
        <h1 className="text-heading">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* User Profile Card */}
        {user && (
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Your Profile</h3>
                <p className="text-sm text-text/70">
                  Managing {user.healthProfile.condition}
                  {user.healthProfile.subCondition && ` - ${user.healthProfile.subCondition}`}
                </p>
              </div>
            </div>
            {user.healthProfile.targets && (
              <p className="text-sm text-text/70 bg-bg p-3 rounded-md">
                Goals: {user.healthProfile.targets}
              </p>
            )}
          </div>
        )}

        {/* Settings Items */}
        <div className="space-y-2">
          {settingsItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full bg-surface border border-border rounded-lg p-4 text-left hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-primary" />
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-text/70">{item.description}</p>
                    </div>
                  </div>
                  {item.toggle && (
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      item.value ? 'bg-primary' : 'bg-border'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform ${
                        item.value ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Subscription Info */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Subscription</h3>
          <p className="text-sm text-text/70 mb-3">Free Plan - Limited features</p>
          <button className="w-full bg-primary text-white py-2 rounded-lg font-medium">
            Upgrade to Premium
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-600 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        {/* App Info */}
        <div className="text-center text-sm text-text/50">
          <p>NutriList AI v1.0.0</p>
          <p>Built with ❤️ for healthier eating</p>
        </div>
      </div>
    </div>
  )
}
