import { getServerSession } from '@/lib/auth'
import { RegistrationForm } from '@/components/RegistrationForm'
import { CatalogueCards } from '@/components/CatalogueCards'
import { BidForm } from '@/components/BidForm'
import { CountdownTimer } from '@/components/CountdownTimer'
import { FAQ } from '@/components/FAQ'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AccessHeroActions } from '@/components/AccessHeroActions'

// Force dynamic rendering for this page (uses cookies for authentication)
export const dynamic = 'force-dynamic'

export default async function AccessPage() {
  const session = await getServerSession()

  if (!session) {
    // Show registration form for unauthenticated users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Access Required</h1>
            <p className="text-lg text-blue-700">
              Please register to access catalogues and participate in the auction
            </p>
          </div>
          
          <RegistrationForm />
        </div>
      </div>
    )
  }

  // Show authenticated dashboard
  const firstName = session.fullName.split(' ')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/Smart%20Logo.png" alt="Smart Logo" width={56} height={56} priority />
              <h1 className="text-base font-bold text-white">Daikin VRV Auction Portal</h1>
            </div>
            <Button variant="ghost" asChild className="text-white hover:text-cyan-200 hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2 text-white" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Outstanding Personalized Welcome Banner */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 border-2 border-cyan-400/30 welcome-glow">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 welcome-shimmer"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-cyan-400/20 backdrop-blur-sm rounded-full border border-cyan-300/30 mb-3 animate-pulse">
                  <span className="text-cyan-100 text-sm font-semibold">🎉 EXCLUSIVE ACCESS GRANTED</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Welcome Back, <span className="text-cyan-300">{firstName}</span>!
                </h2>
                <p className="text-cyan-100 text-lg leading-relaxed max-w-2xl">
                  You now have <strong className="text-white">exclusive access</strong> to our premium Daikin VRV auction. 
                  Download catalogues, review available stock, and submit your competitive bids below.
                </p>
              </div>

              {/* Actions */}
              <AccessHeroActions />
              
              
              
              {/* Highlighted Features */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl px-6 py-4 border-2 border-green-400/30 shadow-lg">
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg mb-1">GENUINE PARTS</h4>
                    <p className="text-green-200 text-sm font-medium">100% Original Daikin Stock</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-xl px-6 py-4 border-2 border-orange-400/30 shadow-lg">
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg mb-1">LIMITED TIME</h4>
                    <p className="text-orange-200 text-sm font-medium">Exclusive Auction Event</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-sm rounded-xl px-6 py-4 border-2 border-purple-400/30 shadow-lg">
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg mb-1">PREMIUM STOCK</h4>
                    <p className="text-purple-200 text-sm font-medium">Rare & High-Value Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalogues Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Product Catalogues</h2>
          </div>
          
          <CatalogueCards enableDownloads />
        </div>

        {/* Bid Submission Section */}
        <div id="bid-form" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Submit Your Bid</h2>
            <p className="text-sm text-blue-600">Choose your preferred bundle and submit your bid</p>
          </div>
          
          <BidForm />
        </div>

        {/* Countdown Section (moved from hero) */}
        <section className="mb-8">
          <div className="bg-black text-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Auction Countdown</h3>
            <div className="flex justify-center">
              <CountdownTimer />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="mb-8">
          <FAQ />
        </div>
      </div>
    </div>
  )
}
