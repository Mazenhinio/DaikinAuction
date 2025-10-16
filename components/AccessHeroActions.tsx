"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AccessHeroActions() {
  const handleScrollToBids = () => {
    document.getElementById('bid-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Button
        className="bg-black hover:bg-gray-900 text-white"
        onClick={handleScrollToBids}
      >
        Submit your bids now
      </Button>
      <Button variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
        <Link href="https://calendly.com/tawfik-rady-egicat/30min">
          Book a call
        </Link>
      </Button>
    </div>
  )
}


