import React from 'react'
import { useRouter } from 'next/router'

export default function ProfileCard({ user }) {
  const router = useRouter()

  function handleLogout() {
    try {
      localStorage.removeItem('token')
    } catch (err) {
      // ignore
    }
    // Navigate to login
    router.push('/auth/login')
  }

  if (!user) return null

  const created = user.createdAt ? new Date(user.createdAt).toLocaleString() : ''

  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>{user.name}</h2>
      <div style={{ color: '#6b7280' }}>{user.email}</div>
      <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>Created: {created}</div>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  )
}
