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
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0705] flex flex-col justify-between select-none">
      {/* Background Image with Deep Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/scenes/counter_attack.jpg"
          alt="Đại Thắng Bạch Đằng"
          className="w-full h-full object-cover object-center filter brightness-30 contrast-115 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-[#0a0705]/80 to-[#0a0705]/95" />
      </div>

      {/* Top Header - Solid Wood Bar with Bronze Trim */}
      <header className="relative z-10 w-full px-6 py-3.5 flex items-center justify-between border-b-2 border-[#422c1b] bg-[#120d09] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg btn-material-bronze flex items-center justify-center text-[#faebd7]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-[#f5ebd9] uppercase">
              SỬ VIỆT HÙNG CA
            </h1>
            <p className="text-[10px] text-[#b89f88] uppercase tracking-widest font-bold">
              Interactive History Game Engine
            </p>
          </div>
        </div>

        <button
          onClick={onToggleMute}
          className="btn-material-iron flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-[#e06d53]" />
              <span>Âm thanh: Tắt</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#86b595]" />
              <span>Âm thanh: Bật</span>
            </>
          )}
        </button>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-3 flex flex-col md:flex-row items-center gap-8 justify-center my-auto">
        {/* Left Side: Game Intro & Setup */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Solid Bronze Timeline Badge */}
          <div className="btn-material-bronze inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#faebd7] shadow-sm" />
            Năm 938 SCN • Khai Sinh Kỷ Nguyên Tự Chủ
          </div>

          <h2 className="text-3xl md:text-5xl font-black metallic-gold-title leading-tight mb-3">
            ĐẠI THẮNG BẠCH ĐẰNG
          </h2>

          <p className="text-[#d6c7ba] text-sm md:text-base leading-relaxed mb-6 max-w-lg font-medium">
            Hóa thân vào dòng chảy lịch sử, cùng Tiết Độ Sứ <strong className="text-[#faebd7]">Ngô Quyền</strong> bày trận địa cọc ngầm lim bọc sắt, đo lường con nước thủy triều để đập tan đạo quân Nam Hán xâm lược.
          </p>

          {/* Player Name Input - Solid Carved Wood Frame */}
          <div className="w-full max-w-md mb-6 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
              Danh Xưng Chỉ Huy
            </label>
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập tên người chơi..."
                className="w-full px-4 py-3 rounded-lg input-solid-carved text-sm font-bold shadow-inner"
              />
              <Sword className="absolute right-3.5 top-3.5 w-4 h-4 text-[#d4af37] pointer-events-none" />
            </div>
          </div>

          {/* Start Button - Heavy Solid Forged Bronze Plate */}
          <button
            onClick={handleStart}
            className="btn-material-bronze group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-xl text-base md:text-lg tracking-wider uppercase cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current text-[#faebd7]" />
            <span>Bước Vào Lịch Sử</span>
          </button>
        </div>

        {/* Right Side: Hero Roster Preview - Solid Carved Lim Wood Chest Panel */}
        <div className="w-full md:w-1/2 max-w-md wood-panel-solid rounded-2xl p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3 text-center border-b-2 border-[#3b2718] pb-2">
            NHÂN VẬT LỊCH SỬ
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
                  className={`group relative flex flex-col items-center p-2.5 rounded-xl transition cursor-pointer ${
                    isSelected
                      ? 'card-solid-selected scale-105 ring-2 ring-[#d4af37]'
                      : 'card-solid-dark hover:border-[#735032] opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-[#5a3d28] mb-2 bg-[#0c0805] shadow-md">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-xs font-black text-[#faebd7] text-center leading-tight truncate w-full">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-[#b89f88] font-bold text-center truncate w-full mt-0.5">
                    {char.faction === 'viet' ? 'Đại Việt' : 'Nam Hán'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Character Detail Card - Solid Dark Wood Box */}
          {previewChar && (
            <div className="card-solid-dark rounded-xl p-3.5 flex gap-3 items-center border-2 border-[#5a3d28]">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[#8e7343] shadow-md">
                <img
                  src={CHARACTERS[previewChar].avatar}
                  alt={CHARACTERS[previewChar].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-sm font-black text-[#d4af37] truncate">
                  {CHARACTERS[previewChar].name}
                </h4>
                <p className="text-xs text-[#c4a682] font-bold mb-1 truncate">
                  {CHARACTERS[previewChar].title}
                </p>
                <p className="text-[11px] text-[#b09e8f] line-clamp-2 leading-relaxed font-medium">
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
      <footer className="relative z-10 w-full px-6 py-2.5 border-t-2 border-[#2b1c11] bg-[#0c0805] text-center text-xs text-[#8c7867] font-semibold">
        Interactive History Game Engine • Thiết kế 100% Vật Liệu Sắt Thép Rèn & Gỗ Lim Đặc Khối
      </footer>
    </div>
  );
};
