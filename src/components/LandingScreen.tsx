import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterId } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { Shield, Volume2, VolumeX, Sword, Play } from 'lucide-react';

interface LandingScreenProps {
  onStartGame: (playerName: string, selectedHero: CharacterId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
}) => {
  const [playerName, setPlayerName] = useState<string>('Dũng Sĩ Đại Việt');
  const [selectedHero, setSelectedHero] = useState<CharacterId>('ngo_quyen');
  const [previewChar, setPreviewChar] = useState<CharacterId>('ngo_quyen');

  const handleStart = () => {
    soundEngine.unlockAudio();
    soundEngine.playSFX('horn');
    soundEngine.playSFX('drum');
    onStartGame(playerName.trim() || 'Dũng Sĩ Đại Việt', selectedHero);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0c0907] flex flex-col justify-between select-none">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/scenes/counter_attack.jpg"
          alt="Đại Thắng Bạch Đằng"
          className="w-full h-full object-cover object-center filter brightness-35 contrast-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0907] via-[#0c0907]/75 to-[#0c0907]/90" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#3a291c] bg-[#140e0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-[#8e7343] bg-[#22160e] flex items-center justify-center text-[#d4af37] shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#e6d5c3] font-serif-epic">
              SỬ VIỆT HÙNG CA
            </h1>
            <p className="text-[11px] text-[#9c8978] uppercase tracking-widest font-medium">
              Interactive History Game Engine
            </p>
          </div>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#4a3525] bg-[#1a120c] text-[#c7b7a6] hover:text-[#f0e4d6] hover:border-[#8e7343] transition text-xs font-semibold cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-[#a85848]" />
              <span>Âm thanh: Tắt</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#6e9b7b]" />
              <span>Âm thanh: Bật</span>
            </>
          )}
        </button>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-4 flex flex-col md:flex-row items-center gap-8 justify-center my-auto">
        {/* Left Side: Game Intro & Setup */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#7a5832] bg-[#24170e] text-[#d4b483] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c8963e]" />
            Năm 938 SCN • Khai Sinh Kỷ Nguyên Tự Chủ
          </div>

          <h2 className="text-3xl md:text-5xl font-black metallic-gold-text font-serif-epic leading-tight mb-3 drop-shadow">
            ĐẠI THẮNG BẠCH ĐẰNG
          </h2>

          <p className="text-[#c4b3a3] text-sm md:text-base leading-relaxed mb-6 max-w-lg">
            Hóa thân vào dòng chảy lịch sử, cùng Tiết Độ Sứ <strong>Ngô Quyền</strong> bày trận địa cọc ngầm lim bọc sắt, đo lường con nước thủy triều để đập tan đạo quân Nam Hán xâm lược.
          </p>

          {/* Player Name Input */}
          <div className="w-full max-w-md mb-6 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b89f88] mb-2">
              Danh Xưng Chỉ Huy
            </label>
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập tên người chơi..."
                className="w-full px-4 py-3 rounded-lg border border-[#4d3827] bg-[#18110c] text-[#f2e8de] placeholder-[#665241] focus:outline-none focus:border-[#a37a3e] text-sm font-medium shadow-inner"
              />
              <Sword className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8c6d3b] pointer-events-none" />
            </div>
          </div>

          {/* Start Button - Forged Iron & Antique Bronze Style */}
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#5a3e26] via-[#7d5632] to-[#5a3e26] text-[#f5ebd9] font-bold text-base md:text-lg tracking-wider uppercase font-serif-epic border border-[#b8934a] hover:brightness-115 active:scale-98 transition cursor-pointer shadow-xl shadow-black/80"
          >
            <Play className="w-5 h-5 fill-current text-[#e8c77b]" />
            <span>Bước Vào Lịch Sử</span>
          </button>
        </div>

        {/* Right Side: Hero Roster Preview - Carved Dark Wood Panel */}
        <div className="w-full md:w-1/2 max-w-md wood-panel rounded-2xl p-5 shadow-2xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-3 text-center border-b border-[#422c1b] pb-2 font-serif-epic">
            Nhân Vật Lịch Sử
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {(['ngo_quyen', 'nguyen_tat_to', 'hoang_thao'] as CharacterId[]).map((cid) => {
              const char = CHARACTERS[cid];
              const isSelected = selectedHero === cid;
              return (
                <button
                  key={cid}
                  onClick={() => {
                    setSelectedHero(cid);
                    setPreviewChar(cid);
                    soundEngine.playSFX('drum');
                  }}
                  className={`group relative flex flex-col items-center p-2 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-[#c8963e] bg-[#362215] shadow-lg scale-105'
                      : 'border-[#382618] bg-[#140d08] opacity-75 hover:opacity-100 hover:border-[#5e4129]'
                  }`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-[#5c4028] mb-2 bg-[#0c0805]">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#e6d8cb] text-center leading-tight truncate w-full">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-[#998370] text-center truncate w-full mt-0.5">
                    {char.faction === 'viet' ? 'Đại Việt' : 'Nam Hán'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Character Detail Card */}
          {previewChar && (
            <div className="bg-[#120b07] rounded-xl p-3.5 border border-[#3b2718] flex gap-3 items-center">
              <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 border border-[#7a5832]">
                <img
                  src={CHARACTERS[previewChar].avatar}
                  alt={CHARACTERS[previewChar].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#d4af37] truncate font-serif-epic">
                  {CHARACTERS[previewChar].name}
                </h4>
                <p className="text-xs text-[#a6866b] font-medium mb-1 truncate">
                  {CHARACTERS[previewChar].title}
                </p>
                <p className="text-[11px] text-[#8c7867] line-clamp-2 leading-relaxed">
                  {previewChar === 'ngo_quyen' &&
                    'Bậc anh hùng kiệt xuất mưu lược định giang sơn, người khai sinh kế sách cọc ngầm Bạch Đằng.'}
                  {previewChar === 'nguyen_tat_to' &&
                    'Tướng tài thông thuộc sông nước duyên hải, trực tiếp chỉ huy đội thuyền tiên phong nhử địch.'}
                  {previewChar === 'hoang_thao' &&
                    'Vạn vương Nam Hán trẻ tuổi ngạo mạn, thống lĩnh soái hạm khổng lồ kéo sang xâm lấn.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full px-6 py-3 border-t border-[#26190f] bg-[#0c0805]/90 text-center text-xs text-[#736050]">
        Interactive History Game Engine • Thiết kế phong cách Sắt Thép Rèn & Gỗ Lim Cổ Kính
      </footer>
    </div>
  );
};
