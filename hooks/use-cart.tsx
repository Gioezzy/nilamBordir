/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"


export function useCart() {
  const [items] = useState([
    { id: '1', name: 'Salempang Bordir', quantity: 2},
    { id: '2', name: 'Bordir Logo', quantity: 1},
  ])

  return {
    items,
    addItem: (item: any) => {},
    removeItem: (id: string) => {},
    clearCart: () => {},
  }
}