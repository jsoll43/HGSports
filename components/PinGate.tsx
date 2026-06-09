'use client'

import { useState } from 'react'

export function PinGate({
  label,
  password = 'Glen',
  children,
}: {
  label: string
  password?: string
  children: React.ReactNode
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  if (unlocked) return <>{children}</>

  return (
    <form
      className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault()
        if (pin.trim().toLowerCase() === password.toLowerCase()) {
          setUnlocked(true)
          setError('')
        } else {
          setError('That PIN did not match.')
        }
      }}
    >
      <label className="grid gap-2 text-sm font-bold text-navy">
        {label}
        <input
          className="min-h-12 rounded-lg border border-cyan-200 px-3 text-base"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="Enter PIN"
          type="password"
        />
      </label>
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="submit">
        Unlock
      </button>
    </form>
  )
}
