'use client'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token])

  if (!token) return null

  return children
}