"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { RegistrationInput } from '@/types/events'

const COUNTRIES = [
  // Europe
  'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 
  'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 
  'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 
  'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 
  'Portugal', 'Greece', 'Ireland', 'Luxembourg', 'Malta', 'Cyprus',
  
  // Russia
  'Russia',
  
  // Middle East
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 
  'Oman', 'Israel', 'Jordan', 'Lebanon', 'Turkey', 'Iran', 'Iraq', 'Yemen',
  
  // Africa
  'South Africa', 'Egypt', 'Morocco', 'Nigeria', 'Kenya', 'Ghana', 'Algeria', 
  'Tunisia', 'Libya', 'Ethiopia', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe', 
  'Botswana', 'Namibia', 'Angola', 'Mozambique', 'Madagascar', 'Cameroon',
  'Ivory Coast', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Sudan', 'Senegal',
  
  // Other (for any unlisted countries in these regions)
  'Other'
]

const INTERESTS = [
  { id: 'indoor', label: 'Indoor Units' },
  { id: 'outdoor', label: 'Outdoor Units' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'split', label: 'Split Units' },
  { id: 'spare', label: 'Spare Parts' },
] as const

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    interests: [] as Array<'indoor'|'outdoor'|'accessories'|'split'|'spare'>
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInterestChange = (interest: 'indoor'|'outdoor'|'accessories'|'split'|'spare', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Client-side validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp/Mobile number is required'
    }
    
    if (!formData.country) {
      newErrors.country = 'Country selection is required'
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one product interest'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.ok) {
        toast.success('Registration successful! Welcome to the auction.')
        window.location.reload() // Reload to show authenticated state
      } else {
        if (result.error && typeof result.error === 'object') {
          // Handle zod validation errors
          const validationErrors: Record<string, string> = {}
          Object.entries(result.error).forEach(([field, error]: [string, any]) => {
            if (error._errors && error._errors.length > 0) {
              validationErrors[field] = error._errors[0]
            }
          })
          setErrors(validationErrors)
        } else {
          toast.error(result.error || 'Registration failed')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Register for Daikin VRV Auction Access</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className={errors.fullName ? 'border-red-500' : ''}
            required
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className={errors.companyName ? 'border-red-500' : ''}
            required
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={errors.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">WhatsApp/Mobile *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+1234567890"
            className={errors.phone ? 'border-red-500' : ''}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.country ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select Country</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div>
          <Label>Product Interests *</Label>
          <div className="space-y-2 mt-2">
            {INTERESTS.map(interest => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox
                  id={interest.id}
                  checked={formData.interests.includes(interest.id)}
                  onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                />
                <Label htmlFor={interest.id}>{interest.label}</Label>
              </div>
            ))}
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Get Access Now'}
        </Button>
      </form>
    </div>
  )
}
