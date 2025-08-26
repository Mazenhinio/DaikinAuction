"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { BidInput } from '@/types/events'

const BUNDLE_OPTIONS = [
  { 
    value: 'vrf-indoor' as const, 
    label: 'Complete VRF Indoor Units Package', 
    description: 'Indoor units & cassettes'
  },
  { 
    value: 'vrf-outdoor' as const, 
    label: 'Complete VRF Outdoor Units Package', 
    description: 'Outdoor condensers & heat pumps'
  },
  { 
    value: 'accessories' as const, 
    label: 'Accessories & Controls Bundle', 
    description: 'Controls, remotes, and accessories'
  },
  { 
    value: 'split' as const, 
    label: 'Split Units Collection', 
    description: 'Split AC unit bundle'
  },
  { 
    value: 'spare' as const, 
    label: 'Spare Parts Inventory', 
    description: 'Genuine Daikin replacement parts'
  },
]

export function BidForm() {
  const [formData, setFormData] = useState<BidInput>({
    bids: {},
    notes: ''
  })
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleBundle = (bundleKey: string) => {
    setSelectedBundles(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(bundleKey)) {
        newSelected.delete(bundleKey)
        // Also clear the bid amount when deselecting
        setFormData(prevForm => ({
          ...prevForm,
          bids: {
            ...prevForm.bids,
            [bundleKey]: undefined
          }
        }))
      } else {
        newSelected.add(bundleKey)
      }
      return newSelected
    })
  }

  const handleBidAmountChange = (bundleKey: keyof BidInput['bids'], amount: string) => {
    const numAmount = parseFloat(amount) || undefined
    setFormData(prev => ({
      ...prev,
      bids: {
        ...prev.bids,
        [bundleKey]: numAmount
      }
    }))
  }

  const getSelectedBids = () => {
    return Object.entries(formData.bids).filter(([_, amount]) => amount && amount > 0)
  }

  const getSelectedBundles = () => {
    return Array.from(selectedBundles.values())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Allow submitting with selected bundles even without bid amounts
    const selected = getSelectedBundles()
    if (selected.length === 0) {
      toast.error('Please select at least one bundle')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit each selected bundle separately; bidAmount may be undefined
      for (const bundleSlug of selected) {
        const bidAmount = formData.bids[bundleSlug as keyof BidInput['bids']]
        const response = await fetch('/api/bids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bundleSlug,
            bidAmount,
            notes: formData.notes || ''
          }),
        })

        const result = await response.json()
        if (!result.ok) {
          throw new Error(result.error || 'Bid submission failed')
        }
      }
      toast.success(`Successfully submitted ${selected.length} selection(s)! Redirecting to booking...`)
      // Reset state
      setFormData({ bids: {}, notes: '' })
      setSelectedBundles(new Set())
      // Redirect to Calendly
      window.location.href = 'https://calendly.com/m-amin-smarttradingscc'
    } catch (error) {
      console.error('Bid submission error:', error)
      toast.error('Bid submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Submit Your Bids</h2>
        <p className="text-blue-700">Select the bundles you want and enter your bid for each. The more bundles you choose, the better your deal and the higher your priority in the auction.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Choose Your Bundles & Submit Your Bids</h3>
          
          <div className="space-y-4">
            {BUNDLE_OPTIONS.map((option) => {
              const currentBid = formData.bids[option.value]
              const isSelected = selectedBundles.has(option.value)
              const hasBidAmount = currentBid && currentBid > 0

              return (
                <div 
                  key={option.value} 
                  className={`rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? 'bg-green-50 border-green-500 shadow-md' 
                      : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm'
                  }`}
                  onClick={() => toggleBundle(option.value)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-colors ${
                      isSelected ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                      
                      {!isSelected && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">Click to select. Bid amount optional.</p>
                      )}
                      
                      {isSelected && (
                        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                          <Label className="text-sm font-medium text-gray-700">Your Bid Amount in USD (optional)</Label>
                          <Input
                            type="number"
                            placeholder="Enter amount (e.g. 30000)"
                            value={currentBid || ''}
                            onChange={(e) => handleBidAmountChange(option.value, e.target.value)}
                            className="mt-2 bg-white border-2 border-green-300 focus:border-green-500"
                            min="0.01"
                            step="0.01"
                            autoFocus
                            // optional
                          />
                          {hasBidAmount && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              ✓ Bid: ${currentBid?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Bundles Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-blue-500">
          <h4 className="font-semibold text-gray-900 mb-2">Selected Bundles Summary:</h4>
          <div className="space-y-1">
            {Array.from(selectedBundles.values()).map((bundleKey) => {
              const bundle = BUNDLE_OPTIONS.find(b => b.value === bundleKey)
              const amount = formData.bids[bundleKey as keyof BidInput['bids']]
              return (
                <div key={bundleKey} className="flex justify-between text-sm">
                  <span className="text-gray-700">{bundle?.label}</span>
                  <span className="text-green-600 font-medium">{amount ? `$${(amount as number).toLocaleString()}` : 'No bid amount'}</span>
                </div>
              )
            })}
            {selectedBundles.size === 0 && (
              <p className="text-gray-500 text-sm">No bundles selected yet</p>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <h4 className="font-semibold text-blue-900 mb-3">Additional Notes/Questions</h4>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any specific requirements, delivery preferences, or questions..."
            rows={4}
            maxLength={2000}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.notes?.length || 0}/2000 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting || selectedBundles.size === 0}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting 
            ? 'Submitting...' 
            : `Submit (${selectedBundles.size} selected)`}
        </Button>
      </form>
    </div>
  )
}
