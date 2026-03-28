import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

let socket: Socket | null = null

function getSocket(): Socket {
  if (!socket) {
    socket = io(`${BASE_URL}/chores`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

/**
 * Kết nối WebSocket namespace /chores.
 * Khi server emit chore:created / chore:updated / chore:deleted,
 * hook tự động invalidate React Query cache để UI cập nhật ngay lập tức.
 *
 * Dùng: gọi useChoreSocket() một lần trong component cha của calendar.
 */
export function useChoreSocket() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const s = getSocket()

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
    }

    s.on('chore:created', refresh)
    s.on('chore:updated', refresh)
    s.on('chore:deleted', refresh)

    return () => {
      s.off('chore:created', refresh)
      s.off('chore:updated', refresh)
      s.off('chore:deleted', refresh)
    }
  }, [queryClient])
}
