"use client"

import { Button } from '@/components/ui/button'
import { CATALOGUES } from '@/lib/catalogues'
import { Download, FileText } from 'lucide-react'
import Image from 'next/image'

type CatalogueCardsProps = {
  enableDownloads?: boolean
}

export function CatalogueCards({ enableDownloads = false }: CatalogueCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CATALOGUES.map((catalogue) => (
        <div 
          key={catalogue.slug} 
          className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
        >
          {/* Background Image */}
          {catalogue.imageUrl && (
            <div className="absolute inset-0">
              <Image
                src={catalogue.imageUrl}
                alt={catalogue.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            {/* Top Section - Icon */}
            <div className="flex justify-start">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Bottom Section - Title, Description & Button */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl text-white mb-2 drop-shadow-lg">
                  {catalogue.title}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed drop-shadow-md">
                  {catalogue.description}
                </p>
              </div>
              
{catalogue.slug === 'bundles' ? (
                <Button 
                  className="w-full bg-orange-600/90 hover:bg-orange-700 backdrop-blur-sm border border-white/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    // Scroll to bid form section
                    document.getElementById('bid-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🎯</span>
                    Mix and Match
                  </div>
                </Button>
              ) : (
                <Button 
                  asChild 
                  className="w-full bg-blue-600/90 hover:bg-blue-700 backdrop-blur-sm border border-white/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {enableDownloads ? (
                    <a href={catalogue.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Catalogue
                    </a>
                  ) : (
                    <a href="/access">
                      <Download className="h-4 w-4 mr-2" />
                      Download Catalogue
                    </a>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
