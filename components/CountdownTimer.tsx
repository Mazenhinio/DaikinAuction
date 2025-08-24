"use client"

import { useState, useEffect } from 'react'

// Daikin VRV Auction ends on October 9th, 2025
const AUCTION_END_DATE = new Date('2025-10-09T23:59:59Z').getTime()

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = AUCTION_END_DATE - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-900 to-cyan-600 text-white p-6 rounded-lg shadow-xl">
      <h3 className="text-lg font-semibold text-center mb-4">Daikin VRV Auction Closes In</h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-cyan-500/30 backdrop-blur-sm rounded-lg p-3 border border-cyan-300/30">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-sm">Days</div>
        </div>
        <div className="bg-cyan-500/30 backdrop-blur-sm rounded-lg p-3 border border-cyan-300/30">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm">Hours</div>
        </div>
        <div className="bg-cyan-500/30 backdrop-blur-sm rounded-lg p-3 border border-cyan-300/30">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm">Minutes</div>
        </div>
        <div className="bg-cyan-500/30 backdrop-blur-sm rounded-lg p-3 border border-cyan-300/30">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm">Seconds</div>
        </div>
      </div>
    </div>
  )
}
