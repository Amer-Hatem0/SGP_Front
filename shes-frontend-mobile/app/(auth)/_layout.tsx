// app/(auth)/_layout.tsx
import { Slot, Redirect, useSegments } from 'expo-router'
import { useAuthContext } from '@/context/AuthContext'

export default function AuthLayout() {
  const { user, loading } = useAuthContext()
  const segments = useSegments()        // e.g. ['login'] or ['doctor','home']
  const first = segments[0] ?? ''

  // list all your auth‐page slugs here:
  const authRoutes = ['login', 'register', 'forgot-password', 'verifyemail']
  const isAuthRoute = authRoutes.includes(first)

  if (loading) {
    // still checking AsyncStorage?
    return null
  }

  // 1) logged in but still on an auth page → out to your app
  if (user && isAuthRoute) {
    console.log("user role is:", user.role);
    const dest = user.role === 'Doctor'
      ? '/doctor/home'
      : '/patient/home'
    return <Redirect href={dest} />
  }

  // 2) not logged in but on an app page → back into auth
  if (!user && !isAuthRoute) {
    return <Redirect href="/login" />
  }

  // 3) otherwise you’re in the right place—render the auth screen
  return <Slot />
}
