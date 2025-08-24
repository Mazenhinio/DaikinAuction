import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daikin VRV Auction - Private Stock Sale',
  description: 'Exclusive auction for Daikin VRV stock. Register for access to catalogues and bidding.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        
                       {/* Chatbase Chatbot Integration - Updated with Custom Styling */}
               <Script 
                 id="chatbase-widget"
                 strategy="lazyOnload"
                 dangerouslySetInnerHTML={{
                   __html: `
                     (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="dzg6J2Op-cWjwLFGnAoTO";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
                   `
                 }}
               />
      </body>
    </html>
  )
}
