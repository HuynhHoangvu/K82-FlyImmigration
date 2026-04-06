import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { api } from '@/services/api'

// Cấu hình hiển thị notification khi app đang mở
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

/**
 * Yêu cầu quyền notification và lấy Expo Push Token.
 * Trả về token string hoặc null nếu bị từ chối / không phải thiết bị thật.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notification chỉ hoạt động trên thiết bị thật
  if (!Device.isDevice) {
    console.warn('[Notifications] Push không hoạt động trên simulator/emulator')
    return null
  }

  // Android cần tạo notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Thông báo chung',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#fdd52f',
      sound: 'default',
    })
  }

  // Kiểm tra / xin quyền
  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Người dùng từ chối quyền notification')
    return null
  }

  // Lấy Expo Push Token
  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId

    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    )
    const token = tokenData.data
    console.log('[Notifications] Push token:', token)

    // Gửi token lên backend (nếu backend có endpoint)
    try {
      await api.post('/users/me/push-token', { token, platform: Platform.OS })
    } catch {
      // Backend chưa có endpoint này → bỏ qua, không crash app
    }

    return token
  } catch (err) {
    console.warn('[Notifications] Không lấy được push token:', err)
    return null
  }
}

/**
 * Đăng ký lắng nghe notification.
 * Gọi trong useEffect — trả về cleanup function.
 */
export function setupNotificationListeners(options?: {
  onReceive?: (n: Notifications.Notification) => void
  onTap?: (r: Notifications.NotificationResponse) => void
}): () => void {
  const subs: Notifications.EventSubscription[] = []

  if (options?.onReceive) {
    subs.push(
      Notifications.addNotificationReceivedListener(options.onReceive),
    )
  }

  if (options?.onTap) {
    subs.push(
      Notifications.addNotificationResponseReceivedListener(options.onTap),
    )
  }

  return () => subs.forEach((s) => s.remove())
}

/** Xóa badge count (iOS) */
export function clearBadge() {
  Notifications.setBadgeCountAsync(0).catch(() => {})
}
