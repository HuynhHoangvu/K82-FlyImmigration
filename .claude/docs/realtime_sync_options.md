# 3 Phương Án Real-Time Sync cho Chore (Công Việc Nhà)

> **Bối cảnh:** Tính năng Chore (công việc nhà/lịch phân công) chưa tồn tại trong codebase.
> Khi thêm vào, cần đảm bảo thay đổi (thêm/sửa/xóa chore) đồng bộ ngay lập tức sang các tab/client khác.
> Stack hiện tại: **NestJS (backend) + React + React Query (frontend)**.

---

## Phương Án 1: WebSocket với Socket.io

### Mô tả
Backend mở một WebSocket server (NestJS hỗ trợ native qua `@nestjs/websockets`). Mỗi khi chore thay đổi, server phát sự kiện `chore:updated` đến tất cả client đang kết nối.

### Cách hoạt động
```
[Tab A] thêm chore → POST /chores → ChoresService.create()
                                      ↓
                              gateway.emit('chore:updated', newChore)
                                      ↓
                    [Tab B] nhận event → cập nhật UI ngay lập tức
```

### Thay đổi cần làm
**Backend:**
- Cài: `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
- Tạo `ChoresGateway` (`@WebSocketGateway`)
- Trong `ChoresService`, sau mỗi create/update/delete gọi `gateway.server.emit('chore:updated', payload)`

**Frontend:**
- Cài: `socket.io-client`
- Tạo hook `useChoreSocket()` lắng nghe event và gọi `queryClient.invalidateQueries(['chores'])`

### Ưu điểm
- Thực sự real-time (không delay)
- Hai chiều: server có thể push bất cứ lúc nào
- NestJS hỗ trợ sẵn, ít boilerplate

### Nhược điểm
- Cần quản lý kết nối WebSocket (reconnect khi mất mạng)
- Phức tạp hơn khi scale ngang (cần Redis adapter để đồng bộ giữa nhiều server instance)
- Thêm một layer infrastructure

### Phù hợp khi
Cần real-time tuyệt đối, nhiều user cùng chỉnh sửa, hoặc sau này mở rộng thêm tính năng real-time khác (chat, notification).

---

## Phương Án 2: Server-Sent Events (SSE)

### Mô tả
Backend mở một HTTP endpoint SSE (`/chores/events`). Client kết nối một lần, server push sự kiện xuống bất cứ khi nào có thay đổi. Kết nối một chiều (server → client).

### Cách hoạt động
```
[Tab A] thêm chore → POST /chores → ChoresService.create()
                                      ↓
                              choreEventService.emit(newChore)
                                      ↓
              [Tab B] đang lắng nghe GET /chores/events
                      → nhận data → cập nhật UI
```

### Thay đổi cần làm
**Backend:**
- Tạo `ChoreEventsService` dùng RxJS `Subject` làm event bus
- Trong `ChoresController`, thêm endpoint `@Sse('events')` trả về `Observable`
- Trong `ChoresService`, sau mỗi mutation gọi `choreEventsService.emit(payload)`

**Frontend:**
- Dùng native `EventSource` API (không cần thư viện)
- Tạo hook `useChoreSSE()`: kết nối `new EventSource('/chores/events')`, khi nhận event gọi `queryClient.invalidateQueries(['chores'])`

### Ưu điểm
- Đơn giản hơn WebSocket (HTTP thuần, không cần upgrade protocol)
- NestJS hỗ trợ SSE native (`@Sse` decorator + `Observable`)
- Trình duyệt tự reconnect khi mất kết nối
- Không cần thư viện client

### Nhược điểm
- Chỉ một chiều (server → client), client muốn gửi vẫn phải dùng REST
- Giới hạn số kết nối HTTP/1.1 (không phải vấn đề với HTTP/2)
- Scale ngang vẫn cần Redis Pub/Sub để đồng bộ giữa các server

### Phù hợp khi
Đây là lựa chọn **cân bằng tốt nhất** cho use case này — chore chỉ cần push từ server xuống client, không cần giao tiếp hai chiều. Ít phức tạp hơn WebSocket, đủ dùng cho ứng dụng không cần cộng tác real-time cao.

---

## Phương Án 3: Polling với React Query `refetchInterval`

### Mô tả
Frontend tự động gọi lại API `GET /chores` theo chu kỳ cố định (ví dụ: mỗi 5 giây). Không cần thay đổi backend.

### Cách hoạt động
```
[Tab A] thêm chore → POST /chores → phản hồi ngay cho Tab A

[Tab B] đang chạy useQuery({ queryKey: ['chores'], refetchInterval: 5000 })
        → sau tối đa 5 giây → tự động fetch lại → cập nhật UI
```

### Thay đổi cần làm
**Backend:** Không cần thay đổi gì.

**Frontend:**
```typescript
// Chỉ thêm refetchInterval vào useQuery
const { data: chores } = useQuery({
  queryKey: ['chores'],
  queryFn: choresApi.getAll,
  refetchInterval: 5000, // 5 giây fetch lại một lần
  refetchIntervalInBackground: false, // không fetch khi tab không active
})
```

### Ưu điểm
- **Đơn giản nhất** — chỉ thêm một option vào `useQuery`
- Không cần thay đổi backend
- Không cần thư viện mới
- Dễ maintain

### Nhược điểm
- Không thực sự real-time — delay tối đa bằng interval (5 giây)
- Tốn tài nguyên hơn (gọi API liên tục dù không có thay đổi)
- Không scale tốt nếu interval ngắn và nhiều user

### Phù hợp khi
MVP hoặc khi "gần real-time" là đủ (5 giây delay chấp nhận được). Triển khai nhanh nhất để test tính năng trước khi đầu tư vào WebSocket/SSE.

---

## So sánh tổng quan

| Tiêu chí              | WebSocket      | SSE            | Polling        |
|-----------------------|----------------|----------------|----------------|
| Độ trễ                | Không delay    | Không delay    | Tối đa N giây  |
| Thay đổi backend      | Trung bình     | Ít             | Không cần      |
| Thay đổi frontend     | Trung bình     | Ít             | Rất ít         |
| Độ phức tạp           | Cao            | Trung bình     | Thấp           |
| Tốn tài nguyên server | Kết nối dài    | Kết nối dài    | Request định kỳ|
| Scale ngang           | Cần Redis      | Cần Redis      | Không cần      |
| Phù hợp use case      | Cộng tác cao   | Push từ server | MVP/đơn giản   |

## Khuyến nghị

- **Nếu muốn triển khai nhanh:** Bắt đầu với **Polling** (Phương án 3), interval 5-10 giây.
- **Nếu muốn production-ready:** Dùng **SSE** (Phương án 2) — cân bằng giữa đơn giản và thực sự real-time.
- **Nếu sau này cần real-time mạnh** (nhiều user cùng chỉnh sửa, chat, notification): **WebSocket** (Phương án 1).
