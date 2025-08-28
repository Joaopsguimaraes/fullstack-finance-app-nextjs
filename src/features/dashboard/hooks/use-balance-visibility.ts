'use client'

import { useState } from 'react'

export function useBalanceVisibility(initialValue: boolean = true) {
  const [showBalance, setShowBalance] = useState(initialValue)

  const toggleBalance = () => {
    setShowBalance(prev => !prev)
  }

  return {
    showBalance,
    toggleBalance,
    setShowBalance,
  }
}
