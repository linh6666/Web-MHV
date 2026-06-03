import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub?: string;
  jti?: string;
  [key: string]: any;
}

let socket: Socket | null = null;
let pingIntervalId: NodeJS.Timeout | null = null;

// HÀM LẤY INSTANCE SOCKET HIỆN TẠI
export const getSocket = (): Socket | null => socket;

// 1. HÀM KẾT NỐI (Gọi sau khi Login thành công hoặc khi F5 trang web mà đã có Token)
export const connectSocket = (accessToken: string): void => {
  // Nếu đã kết nối rồi thì không kết nối lại nữa
  if (socket?.connected) return;

  try {
    // Giải mã Token để lấy user_id và jti
    const decoded = jwtDecode<DecodedToken>(accessToken);
    const userId = decoded.sub; // Thường FastAPI lưu user_id vào trường 'sub'
    const jti = decoded.jti;     // Session ID duy nhất

    if (!userId || !jti) {
      console.error("❌ Token thiếu thông tin userId hoặc jti");
      return;
    }

    // Khởi tạo kết nối đến CONTAINER SOCKET.IO (Cấu hình qua Nginx/Traefik URL hoặc port trực tiếp 8010)
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://mohinhviet.com.vn";

    socket = io(SOCKET_URL, {
      auth: {
        user_id: userId,
        jti: jti
      },
      transports: ["websocket"], // Ép buộc dùng thẳng WebSocket, bỏ qua HTTP Long-polling để tối ưu
      autoConnect: true,
      reconnection: true,        // Tự động kết nối lại nếu mất mạng
      reconnectionAttempts: 5    // Thử lại tối đa 5 lần
    });

    // Lắng nghe sự kiện kết nối thành công
    socket.on("connect", () => {
      console.log(`✅ Socket connected thành công với SID: ${socket?.id}`);

      // KÍCH HOẠT VÒNG LẶP PING GIA HẠN
      startPingLoop();
    });

    // Lắng nghe khi bị ngắt kết nối (Do mất mạng hoặc BỊ SERVER TRỤC XUẤT)
    socket.on("disconnect", (reason) => {
      console.warn(`🔌 Socket disconnected. Lý do: ${reason}`);

      // DỪNG VÒNG LẶP PING NGAY LẬP TỨC
      stopPingLoop();

      // Nếu lý do là server chủ động đuổi (io server disconnect) -> Có thể user đã logout ở thiết bị khác
      if (reason === "io server disconnect") {
        // Xử lý xóa token ở FE và đẩy ra trang login nếu cần
        console.log("🔒 Bạn đã bị đăng xuất khỏi hệ thống.");
      }
    });

    // Lắng nghe phản hồi từ server sau khi ping (Không bắt buộc, dùng để debug)
    socket.on("q", (data) => {
      console.log("📡 Server phản hồi heartbeat:", data);
    });

  } catch (error) {
    console.error("❌ Lỗi cấu hình kết nối Socket:", error);
  }
};

// 2. CƠ CHẾ PING GIỮ KẾT NỐI (Heartbeat tầng ứng dụng)
const startPingLoop = (): void => {
  // Đảm bảo không bị lặp timer
  if (pingIntervalId) clearInterval(pingIntervalId);

  console.log("⏱️ Bắt đầu vòng lặp Ping gia hạn Online...");

  // Vòng lặp Ping ngầm (300 giây/lần) bằng cách gửi sự kiện "p"
  pingIntervalId = setInterval(() => {
    if (socket && socket.connected) {
      console.log("📤 Đang gửi gói ping 'p' lên server...");

      // Gửi sự kiện tên là "p", kèm data trạng thái hiện tại (online/idle/busy)
      // Bạn có thể viết logic check nếu user treo máy 5 phút thì gửi lên chữ "idle"
      socket.emit("p", "online");
    }
  }, 300000); // 300 giây (5 phút)
};

// 3. HÀM DỪNG PING
const stopPingLoop = (): void => {
  if (pingIntervalId) {
    clearInterval(pingIntervalId);
    pingIntervalId = null;
    console.log("🛑 Đã dừng vòng lặp Ping.");
  }
};

// 4. HÀM CHỦ ĐỘNG NGẮT KẾT NỐI (Gọi khi bấm nút Logout)
export const disconnectSocket = (): void => {
  stopPingLoop();
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔒 Đã chủ động hủy kết nối Socket.");
  }
};
