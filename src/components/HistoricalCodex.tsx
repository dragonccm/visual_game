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
      <div className="relative w-full max-w-3xl max-h-[85vh] wood-panel rounded-2xl flex flex-col shadow-2xl border-2 border-[#7a5832] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#3b2718] flex items-center justify-between bg-[#120c08]/90">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg md:text-xl font-bold metallic-gold-text font-serif-epic">
              SỬ KÝ TOÀN THƯ: TRẬN BẠCH ĐẰNG 938
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border border-[#3b2718] bg-[#1a110a] text-[#8c7867] hover:text-[#f0e4d6] hover:border-[#7a5832] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Rich History Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[#d6c8bc] text-sm leading-relaxed">
          {/* Card 1 */}
          <div className="bg-[#170f0a] border border-[#422c1b] rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-base mb-2 font-serif-epic">
              <Shield className="w-4 h-4 text-[#c8963e]" />
              1. Tiền Ngô Vương - Ngô Quyền (897 – 944)
            </div>
            <p className="text-[#bfaea0] leading-relaxed">
              Ngô Quyền sinh ra ở Đường Lâm (Ba Vì, Hà Nội ngày nay), là bậc anh hùng có trí dũng kiệt xuất. Sau khi phản thần Kiều Công Tiễn rước giặc Nam Hán sang xâm lấn, Ngô Quyền đã thống nhất lòng dân tiến quân ra Bắc, chuẩn bị kế sách diệt giặc trên sông Bạch Đằng.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#170f0a] border border-[#422c1b] rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-base mb-2 font-serif-epic">
              <Anchor className="w-4 h-4 text-[#8cb0cf]" />
              2. Địa Thế Sông Bạch Đằng & Quy Luật Thủy Triều
            </div>
            <p className="text-[#bfaea0] leading-relaxed">
              Sông Bạch Đằng là con đường thủy huyết mạch vào trung tâm châu thổ. Chế độ nhật triều tại đây có độ chênh mực nước lên tới gần <strong>3 – 4 mét</strong>. Khi triều dâng ngập mênh mông che giấu mọi bãi cọc; khi triều rút, nước chảy xiết như thác đổ làm lộ đáy sông và cọc nhọn.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#170f0a] border border-[#422c1b] rounded-xl p-4.5">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-base mb-2 font-serif-epic">
              <Scroll className="w-4 h-4 text-[#c8963e]" />
              3. Nghệ Thuật Bãi Cọc Ngầm Độc Nhất Vô Nhị
            </div>
            <p className="text-[#bfaea0] leading-relaxed">
              Hàng vạn thân gỗ lim, gỗ sến cổ thụ cứng như đá được vót nhọn, bịt sắt sắc bén và cắm nghiêng xuôi dòng chảy. Sự kết hợp giữa thiên thời (con nước), địa lợi (sông Bạch Đằng) và nhân hòa (chiến thuật dụ địch) đã làm nên thắng lợi vĩ đại.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#24170e] border border-[#7a5832] rounded-xl p-4.5">
            <div className="text-[#d4af37] font-bold text-base mb-1 font-serif-epic">
              ⚔️ Ý Nghĩa Lịch Sử Trọng Đại
            </div>
            <p className="text-[#ede3d8] font-medium leading-relaxed">
              Chiến thắng Bạch Đằng năm 938 chính thức chấm dứt hơn <strong>1.000 năm Bắc thuộc</strong>, mở ra kỷ nguyên độc lập tự chủ lâu dài và vẻ vang cho dân tộc Việt Nam.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#3b2718] bg-[#120c08]/90 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#5a3e26] hover:bg-[#7d5632] border border-[#8e6c38] text-[#f5ebd9] font-bold text-xs uppercase tracking-wider cursor-pointer transition shadow-md"
          >
            Đóng Sử Ký
          </button>
        </div>
      </div>
    </div>
  );
};
