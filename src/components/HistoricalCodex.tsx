import React from 'react';
import { X, BookOpen, Scroll, Anchor, Shield } from 'lucide-react';

interface HistoricalCodexProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoricalCodex: React.FC<HistoricalCodexProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-600/70 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-900/50 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg md:text-xl font-bold text-amber-200 font-serif-epic">
              SỬ KÝ TOÀN THƯ: TRẬN BẠCH ĐẰNG 938
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-700 bg-stone-900 text-stone-400 hover:text-white hover:border-rose-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Rich History Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-300 text-sm leading-relaxed">
          {/* Card 1 */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-2 font-serif-epic">
              <Shield className="w-4 h-4 text-rose-500" />
              1. Tiền Ngô Vương - Ngô Quyền (897 – 944)
            </div>
            <p>
              Ngô Quyền sinh ra ở Đường Lâm (Ba Vì, Hà Nội ngày nay), là người khôi ngô tuấn tú, mắt sáng như chớp, dáng đi như cọp, có trí dũng phi thường. Ông là con rể của Tiết độ sứ Dương Đình Nghệ. Sau khi Kiều Công Tiễn phản nghịch giết Dương Đình Nghệ rồi rước quân Nam Hán sang xâm lược, Ngô Quyền đã tiến quân ra Bắc diệt trừ phản tặc, thống nhất lòng dân chuẩn bị kháng chiến.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-2 font-serif-epic">
              <Anchor className="w-4 h-4 text-cyan-400" />
              2. Địa Thế Sông Bạch Đằng & Quy Luật Thủy Triều
            </div>
            <p>
              Sông Bạch Đằng (còn gọi là sông Rừng) là con đường thủy huyết mạch từ biển Đông tiến vào trung tâm châu thổ sông Hồng. Chế độ nhật triều tại đây rất đặc biệt: chênh lệch mực nước giữa lúc triều lên và triều rút lên tới gần <strong>3 – 4 mét</strong>. Khi triều dâng, nước ngập mênh mông che giấu mọi chướng ngại vật; khi triều rút, nước chảy xiết như thác đổ làm lộ đáy sông hiểm trở.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-2 font-serif-epic">
              <Scroll className="w-4 h-4 text-amber-400" />
              3. Nghệ Thuật Bãi Cọc Ngầm Độc Nhất Vô Nhị
            </div>
            <p>
              Ngô Quyền đã huy động hàng vạn quân dân chặt những cây gỗ lim, gỗ sến cổ thụ cứng như đá, vót nhọn một đầu rồi bịt sắt sắc bén, cắm chếch theo hướng xuôi dòng. Đây là sự kết hợp thiên tài giữa thiên thời (thủy triều), địa lợi (lòng sông Bạch Đằng) và nhân hòa (dụ địch và phản công chuẩn xác theo từng con nước).
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-r from-amber-950/60 to-rose-950/60 border border-amber-500/50 rounded-xl p-4.5">
            <div className="text-amber-200 font-bold text-base mb-1 font-serif-epic">
              🌟 Ý Nghĩa Lịch Sử Trọng Đại
            </div>
            <p className="text-amber-100/90 font-medium">
              Chiến thắng Bạch Đằng năm 938 là mốc son chói lọi nhất trong lịch sử dựng nước và giữ nước, chính thức chấm dứt hơn <strong>1.000 năm Bắc thuộc</strong>, mở ra kỷ nguyên độc lập tự chủ lâu dài và vẻ vang cho dân tộc Việt Nam.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-amber-900/50 bg-stone-950/60 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition"
          >
            Đóng Sử Ký
          </button>
        </div>
      </div>
    </div>
  );
};
