import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CatalogueCards } from '@/components/CatalogueCards'
import { CountdownTimer } from '@/components/CountdownTimer'
import { FAQ } from '@/components/FAQ'
import { Download, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/Smart%20Logo.png" alt="Smart Logo" width={56} height={56} priority />
              <h1 className="text-base font-bold text-white">Daikin VRV Auction</h1>
            </div>
            <Button asChild className="bg-black hover:bg-gray-900 text-white">
              <Link href="/access">Access Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="Daikin VRF Equipment"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-cyan-700/70"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Exclusive Daikin VRV
              <span className="block text-cyan-300">Stock Auction</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Private auction for premium Daikin VRV equipment, accessories, and spare parts. 
              <strong className="text-white"> Limited stock available to registered participants only.</strong>
            </p>
          </div>
          
          <div className="mb-12">
            <CountdownTimer />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="bg-black hover:bg-gray-900 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/access">
                Register for Access
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Link href="https://calendly.com/tawfik-rady-egicat/30min">Book a call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">1. Register</h4>
              <p className="text-gray-600">
                Complete registration with your company details and product interests to gain exclusive access.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">2. View Catalogues</h4>
              <p className="text-gray-600">
                Access detailed product catalogues including specifications, quantities, and condition reports.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">3. Submit Bids</h4>
              <p className="text-gray-600">
                Choose your preferred bundles and submit competitive bids with any special requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalogues (copied from access page) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Product Catalogues</h2>
          </div>
          <CatalogueCards />
        </div>
      </section>

      

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-xl font-semibold mb-4">Ready to Participate?</h4>
          <p className="text-gray-400 mb-6">
            Register now to access exclusive Daikin VRV equipment at competitive prices.
          </p>
          <Button size="lg" asChild>
            <Link href="/access">Get Started</Link>
          </Button>
        </div>
      </footer>
    </div>
  )
}
