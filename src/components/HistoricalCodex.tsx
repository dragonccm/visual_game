import React from 'react';
import { X, BookOpen, Scroll, Anchor, Shield } from 'lucide-react';

interface HistoricalCodexProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoricalCodex: React.FC<HistoricalCodexProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl max-h-[85vh] wood-panel-solid rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b-2 border-[#3b2718] flex items-center justify-between bg-[#120c08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg btn-material-bronze flex items-center justify-center text-[#faebd7]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg md:text-xl font-black metallic-gold-title">
              SỬ KÝ TOÀN THƯ: TRẬN BẠCH ĐẰNG 938
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Rich History Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[#d6c8bc] text-sm leading-relaxed">
          {/* Card 1 */}
          <div className="card-solid-dark rounded-xl p-4.5 border-2 border-[#5a3d28]">
            <div className="flex items-center gap-2 text-[#d4af37] font-black text-base mb-2">
              <Shield className="w-5 h-5 text-[#d4af37]" />
              1. Tiền Ngô Vương - Ngô Quyền (897 – 944)
            </div>
            <p className="text-[#c4b3a3] font-medium leading-relaxed">
              Ngô Quyền sinh ra ở Đường Lâm (Ba Vì, Hà Nội ngày nay), là bậc anh hùng có trí dũng kiệt xuất. Sau khi phản thần Kiều Công Tiễn rước giặc Nam Hán sang xâm lấn, Ngô Quyền đã thống nhất lòng dân tiến quân ra Bắc, chuẩn bị kế sách diệt giặc trên sông Bạch Đằng.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-solid-dark rounded-xl p-4.5 border-2 border-[#5a3d28]">
            <div className="flex items-center gap-2 text-[#d4af37] font-black text-base mb-2">
              <Anchor className="w-5 h-5 text-[#8fa5c4]" />
              2. Địa Thế Sông Bạch Đằng & Quy Luật Thủy Triều
            </div>
            <p className="text-[#c4b3a3] font-medium leading-relaxed">
              Sông Bạch Đằng là con đường thủy huyết mạch vào trung tâm châu thổ. Chế độ nhật triều tại đây có độ chênh mực nước lên tới gần <strong>3 – 4 mét</strong>. Khi triều dâng ngập mênh mông che giấu mọi bãi cọc; khi triều rút, nước chảy xiết như thác đổ làm lộ đáy sông và cọc nhọn.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-solid-dark rounded-xl p-4.5 border-2 border-[#5a3d28]">
            <div className="flex items-center gap-2 text-[#d4af37] font-black text-base mb-2">
              <Scroll className="w-5 h-5 text-[#d4af37]" />
              3. Nghệ Thuật Bãi Cọc Ngầm Độc Nhất Vô Nhị
            </div>
            <p className="text-[#c4b3a3] font-medium leading-relaxed">
              Hàng vạn thân gỗ lim, gỗ sến cổ thụ cứng như đá được vót nhọn, bịt sắt sắc bén và cắm nghiêng xuôi dòng chảy. Sự kết hợp giữa thiên thời (con nước), địa lợi (sông Bạch Đằng) và nhân hòa (chiến thuật dụ địch) đã làm nên thắng lợi vĩ đại.
            </p>
          </div>

          {/* Card 4 */}
          <div className="btn-material-bronze rounded-xl p-5 border-2 border-[#d4af37]">
            <div className="text-[#faebd7] font-black text-base mb-1">
              ⚔️ Ý Nghĩa Lịch Sử Trọng Đại
            </div>
            <p className="text-[#faebd7] font-semibold leading-relaxed">
              Chiến thắng Bạch Đằng năm 938 chính thức chấm dứt hơn <strong>1.000 năm Bắc thuộc</strong>, mở ra kỷ nguyên độc lập tự chủ lâu dài và vẻ vang cho dân tộc Việt Nam.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t-2 border-[#3b2718] bg-[#120c08] text-right">
          <button
            onClick={onClose}
            className="btn-material-bronze px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            Đóng Sử Ký
          </button>
        </div>
      </div>
    </div>
  );
};
