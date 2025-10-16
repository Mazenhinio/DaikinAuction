"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQ_DATA = [
  {
    question: "Can you deliver to my country?",
    answer: "Yes. Stock is in Cairo, Egypt, and we can arrange shipping to Europe, Africa, the Middle East, and Russia through your preferred freight forwarder or our logistics partners."
  },
  {
    question: "What are the prices for each item?",
    answer: "Pricing is based on bundles, not individual units. The more bundles you select, the stronger your deal and priority in allocation. Exact pricing is shared once you submit your interest form."
  },
  {
    question: "Can I buy individual pieces instead of bundles?",
    answer: "No. To keep the process fast and efficient, stock is only available in bundles (Indoor Units, Outdoor Units, Splits, Accessories, Spare Parts)."
  },
  {
    question: "Are these products brand new?",
    answer: "Yes. All stock is original Daikin 'New Old Stock', kept in excellent condition and never used. Some items are rare models no longer available from distributors."
  },
  {
    question: "How do I secure stock before others?",
    answer: "By registering your interest early and selecting multiple bundles. First buyers get priority. Once stock is allocated, it will not be replenished."
  },
  {
    question: "Can I get a better price if I buy more?",
    answer: "Yes. Buyers who commit to multiple bundles are eligible for tiered discounts and stronger allocation priority."
  },
  {
    question: "How long is the auction open?",
    answer: "The auction closes on October 30, 2025. After that date, allocation will be finalized and confirmed buyers will be contacted directly."
  },
  {
    question: "Can you help with shipping documents and export papers?",
    answer: "Yes. We provide full support with invoices, packing lists, and export documentation to make customs clearance smooth in your country."
  }
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])) // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-blue-600">Everything you need to know about the Daikin VRV auction process</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openItems.has(index)
          
          return (
            <div
              key={index}
              className={`border rounded-lg transition-all duration-200 ${
                isOpen 
                  ? 'border-blue-300 bg-blue-50/50' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${isOpen ? 'text-blue-900' : 'text-gray-900'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 ml-4 ${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
