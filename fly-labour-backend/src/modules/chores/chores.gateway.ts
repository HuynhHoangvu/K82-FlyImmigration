import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { Chore } from './chore.entity'

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
      'https://flylabour.up.railway.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
  namespace: '/chores',
})
export class ChoresGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(ChoresGateway.name)

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  emitChoreCreated(chore: Chore) {
    this.server.emit('chore:created', chore)
  }

  emitChoreUpdated(chore: Chore) {
    this.server.emit('chore:updated', chore)
  }

  emitChoreDeleted(choreId: string) {
    this.server.emit('chore:deleted', { id: choreId })
  }
}
