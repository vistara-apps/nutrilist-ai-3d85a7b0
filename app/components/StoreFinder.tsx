
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, MapPin, Clock, Star, Phone } from 'lucide-react'

interface StoreFinderProps {
  onBack: () => void
}

interface Store {
  id: string
  name: string
  address: string
  distance: string
  hours: string
  rating: number
  phone: string
  hasProducts: boolean
  matchingProducts: number
}

// Mock store data
const mockStores: Store[] = [
  {
    id: '1',
    name: 'Whole Foods Market',
    address: '123 Health St, Your City',
    distance: '0.8 miles',
    hours: '7 AM - 10 PM',
    rating: 4.5,
    phone: '(555) 123-4567',
    hasProducts: true,
    matchingProducts: 15,
  },
  {
    id: '2',
    name: 'Fresh Market',
    address: '456 Organic Ave, Your City',
    distance: '1.2 miles',
    hours: '8 AM - 9 PM',
    rating: 4.3,
    phone: '(555) 234-5678',
    hasProducts: true,
    matchingProducts: 12,
  },
  {
    id: '3',
    name: 'SuperMart',
    address: '789 Main St, Your City',
    distance: '1.5 miles',
    hours: '6 AM - 11 PM',
    rating: 4.1,
    phone: '(555) 345-6789',
    hasProducts: true,
    matchingProducts: 8,
  },
]

export function StoreFinder({ onBack }: StoreFinderProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores)
      setLoading(false)
    }, 1000)
  }, [])

  if (selectedStore) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedStore(null)}
            className="p-2 hover:bg-bg rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-heading">{selectedStore.name}</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <p className="font-medium">{selectedStore.address}</p>
                <p className="text-sm text-text/70">{selectedStore.distance} away</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-text/70">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {selectedStore.hours}
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" />
                {selectedStore.rating}
              </div>
              <div className="flex items-center gap-1">
                <Phone size={16} />
                {selectedStore.phone}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Available Products for Your Diet</h3>
            <p className="text-primary font-medium mb-4">
              {selectedStore.matchingProducts} products match your dietary needs
            </p>
            
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-3">
                <h4 className="font-medium">Gluten-Free Bread Section</h4>
                <p className="text-sm text-text/70">Aisle 3, shelf B</p>
                <p className="text-sm text-primary">3 suitable options available</p>
              </div>
              
              <div className="border border-border rounded-lg p-3">
                <h4 className="font-medium">Low-Sodium Soups</h4>
                <p className="text-sm text-text/70">Aisle 7, shelf A</p>
                <p className="text-sm text-primary">5 suitable options available</p>
              </div>
              
              <div className="border border-border rounded-lg p-3">
                <h4 className="font-medium">Fresh Produce</h4>
                <p className="text-sm text-text/70">Front of store</p>
                <p className="text-sm text-primary">All fresh vegetables available</p>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium">
            Get Directions
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
        <h1 className="text-heading">Find Local Stores</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-border rounded mb-2 w-1/3"></div>
              <div className="h-3 bg-border rounded mb-2 w-2/3"></div>
              <div className="h-3 bg-border rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-body text-text/70 mb-4">
            Found {stores.length} stores near you with products matching your dietary needs
          </p>
          
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="w-full bg-surface border border-border rounded-lg p-4 text-left hover:shadow-card transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{store.name}</h3>
                <span className="text-sm text-text/70">{store.distance}</span>
              </div>
              
              <p className="text-sm text-text/70 mb-2">{store.address}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-text/70">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {store.hours}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {store.rating}
                  </div>
                </div>
                
                <span className="text-sm text-primary font-medium">
                  {store.matchingProducts} products
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
