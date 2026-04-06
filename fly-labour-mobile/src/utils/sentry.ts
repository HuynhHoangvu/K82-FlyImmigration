import * as Sentry from '@sentry/react-native'

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN

export function initSentry() {
  if (!DSN) {
    if (__DEV__) console.warn('[Sentry] EXPO_PUBLIC_SENTRY_DSN chưa được cấu hình')
    return
  }

  Sentry.init({
    dsn: DSN,
    // Chỉ bật debug trong development
    debug: __DEV__,
    // Gửi 100% lỗi trong production, 0% trong dev (tránh spam)
    tracesSampleRate: __DEV__ ? 0 : 1.0,
    // Tự động gắn thông tin thiết bị, OS, app version
    enableNativeFramesTracking: true,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
  })
}

/** Gắn thông tin user vào báo cáo lỗi sau khi đăng nhập */
export function setSentryUser(user: { id: string; email: string; role: string } | null) {
  if (!DSN) return
  Sentry.setUser(user)
}

/** Ghi log breadcrumb thủ công (navigation, action quan trọng) */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  if (!DSN) return
  Sentry.addBreadcrumb({ message, data, level: 'info' })
}

/** Capture lỗi thủ công (dùng trong catch block) */
export function captureError(err: unknown, context?: Record<string, any>) {
  if (!DSN) {
    if (__DEV__) console.error('[Sentry capture]', err)
    return
  }
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context)
    Sentry.captureException(err)
  })
}
