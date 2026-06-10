import { createHash, timingSafeEqual } from 'crypto'

export function hashPin(pin: string) {
  return createHash('sha256').update(pin.trim().toLowerCase()).digest('hex')
}

export function verifyPinHash(pin: string, hash: string) {
  const left = Buffer.from(hashPin(pin))
  const right = Buffer.from(hash)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}
