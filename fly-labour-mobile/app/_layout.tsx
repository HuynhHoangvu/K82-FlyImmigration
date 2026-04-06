import '../global.css'
import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Colors } from '@/constants/colors'
import { initSentry, setSentryUser } from '@/utils/sentry'
import {
  registerForPushNotifications,
  setupNotificationListeners,
  clearBadge,
} from '@/utils/notifications'

// Khởi động Sentry trước mọi thứ
initSentry()

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

function AuthGuard() {
  const { isAuthenticated, isLoading, user, hydrate } = useAuthStore()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (isLoading) return
    SplashScreen.hideAsync()

    const inAuth     = segments[0] === '(auth)'
    const inEmployer = segments[0] === 'employer'
    const inProfile  = segments[0] === 'profile'

    if (isAuthenticated && inAuth) router.replace('/(tabs)')
    if (!isAuthenticated && (inEmployer || inProfile)) router.replace('/(auth)/login')
  }, [isAuthenticated, isLoading, segments])

  // Gắn user vào Sentry khi login/logout
  useEffect(() => {
    if (isAuthenticated && user) {
      setSentryUser({ id: user.id, email: user.email, role: user.role })
    } else {
      setSentryUser(null)
    }
  }, [isAuthenticated, user])

  if (isLoading) return <LoadingScreen />
  return null
}

function NotificationSetup() {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    // Xin quyền + đăng ký push token
    registerForPushNotifications()

    // Xóa badge khi mở app
    clearBadge()

    // Lắng nghe notification
    const cleanup = setupNotificationListeners({
      onReceive: (notification) => {
        console.log('[Notification]', notification.request.content.title)
      },
      onTap: (_response) => {
        // TODO: điều hướng theo data trong notification
      },
    })

    // Xóa badge khi app từ background → foreground
    const appStateListener = AppState.addEventListener('change', (next) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        clearBadge()
      }
      appState.current = next
    })

    return () => {
      cleanup()
      appStateListener.remove()
    }
  }, [])

  return null
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor={Colors.dark} />
        <AuthGuard />
        <NotificationSetup />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.dark },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="jobs/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Chi tiết việc làm',
              headerStyle: { backgroundColor: Colors.card },
              headerTintColor: Colors.text,
            }}
          />
          <Stack.Screen name="employer" />
          <Stack.Screen
            name="news/[slug]"
            options={{
              headerShown: true,
              headerTitle: 'Tin tức',
              headerStyle: { backgroundColor: Colors.card },
              headerTintColor: Colors.text,
            }}
          />
          <Stack.Screen
            name="profile/edit"
            options={{
              headerShown: true,
              headerTitle: 'Chỉnh sửa hồ sơ',
              headerStyle: { backgroundColor: Colors.card },
              headerTintColor: Colors.text,
            }}
          />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
