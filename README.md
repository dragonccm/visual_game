# Sử Việt Hùng Ca - Interactive History Game (Đại Thắng Bạch Đằng 938)

Trò chơi tương tác lịch sử (Interactive Story Game) tái hiện đại chiến **Bạch Đằng năm 938** dưới sự chỉ huy của **Tiết Độ Sứ Ngô Quyền** đập tan quân Nam Hán xâm lược.

![Đại Thắng Bạch Đằng](public/assets/images/scenes/counter_attack.jpg)

---

## 🌟 Tính Năng Nổi Bật

- 🌳 **Cây Kịch Bản Phi Tuyến Tính (Graph Story Tree)**:
  - 18 phân cảnh chiến thuật với **10 kết cục lịch sử hoàn toàn khác nhau** (từ Đại thắng S+, Hỏa thiêu sông đêm, Trảm tướng soái hạm, đến Bại trận cửa biển và Rút lui chiến lược).
  - Bản đồ Cây Kịch Bản trực quan (Story Flowchart Modal) theo dõi tiến độ khám phá và cho phép Warp/Chơi lại nhanh từng nhánh rẽ.
- 🎙️ **Lồng Tiếng AI Chuẩn Tiếng Việt (Standard Vietnamese Voice)**:
  - Giọng đọc tự nhiên 100% (Standard Neural HD Voice) theo thời gian thực.
  - Sắc thái âm điệu riêng cho từng nhân vật (Ngô Quyền trầm hùng, Hoằng Tháo ngạo mạn, Nguyễn Tất Tố dứt khoát).
- 🔊 **Kho Âm Thanh Chiến Trận (Web Audio SFX)**:
  - Tiếng trống trận, tù và, bão lửa bùng cháy, cồng lệnh, tiếng cọc gỗ lim đâm toạc mạn thuyền giặc và sóng nước Bạch Đằng.
- 🎓 **Chế Độ Học Tập Chính Sử (Study Mode)**:
  - Nút bật/tắt gợi ý chính sử (`👑 CHÍNH SỬ - TỐI ƯU`) kèm phân tích lý do quân sự ngắn gọn cho học sinh, sinh viên.
- 📖 **Sổ Tay Sử Ký (Historical Codex)**:
  - Tra cứu kiến thức lịch sử chính thống về bãi cọc ngầm, quy luật thủy triều 3-4m và thân thế Tiền Ngô Vương.
- 📱 **Giao Diện Responsive Toàn Diện**:
  - Tối ưu mượt mà cho Mobile, Tablet và Desktop.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4.
- **Icon & Hiệu ứng**: Lucide Icons, Canvas Confetti.
- **Audio Engine**: Web Audio API Synthesizer & Vietnamese Speech Synthesis.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Trực Tiếp

1. **Clone repository:**
   ```bash
   git clone https://github.com/dragonccm/visual_game.git
   cd visual_game
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Chạy môi trường phát triển (Dev):**
   ```bash
   npm run dev
   ```

4. **Build đóng gói sản phẩm (Production):**
   ```bash
   npm run build
   npm run preview
   ```
