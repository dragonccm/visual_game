import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterId } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { Shield, Sparkles, Volume2, VolumeX, Sword, Play } from 'lucide-react';

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
    soundEngine.playSFX('horn');
    soundEngine.playSFX('drum');
    onStartGame(playerName.trim() || 'Dũng Sĩ Đại Việt', selectedHero);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-950 flex flex-col justify-between select-none">
      {/* Background Image with Cinematic Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/scenes/counter_attack.jpg"
          alt="Đại Thắng Bạch Đằng"
          className="w-full h-full object-cover object-center filter brightness-40 contrast-110 scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/40 to-stone-950" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-amber-900/30 bg-stone-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/60 bg-amber-950/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-amber-200 font-serif-epic">
              SỬ VIỆT HÙNG CA
            </h1>
            <p className="text-xs text-stone-400 uppercase tracking-widest">
              Interactive History Game Engine
            </p>
          </div>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-700 bg-stone-900/80 text-stone-300 hover:text-amber-300 hover:border-amber-500 transition text-sm cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span>Âm thanh: Tắt</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Âm thanh: Bật</span>
            </>
          )}
        </button>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-4 flex flex-col md:flex-row items-center gap-8 justify-center my-auto">
        {/* Left Side: Game Intro & Setup */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-950/60 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Chiến dịch Tiêu Biểu: Năm 938 SCN
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-rose-400 font-serif-epic leading-tight mb-3 drop-shadow-md">
            ĐẠI THẮNG BẠCH ĐẰNG
          </h2>

          <p className="text-stone-300 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
            Hóa thân vào dòng chảy lịch sử, cùng Tiết Độ Sứ <strong>Ngô Quyền</strong> và tướng sĩ Đại Việt bày trận địa cọc ngầm, tận dụng con nước thủy triều để đập tan đạo quân Nam Hán xâm lược, mở ra kỷ nguyên độc lập tự chủ nghìn năm.
          </p>

          {/* Player Name Input */}
          <div className="w-full max-w-md mb-6 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-2">
              Danh Xưng Nhân Vật Của Bạn
            </label>
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập tên người chơi..."
                className="w-full px-4 py-3 rounded-lg border border-amber-700/50 bg-stone-900/90 text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 text-sm shadow-inner"
              />
              <Sword className="absolute right-3.5 top-3.5 w-4 h-4 text-amber-500/60 pointer-events-none" />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white font-bold text-lg tracking-wider uppercase font-serif-epic shadow-xl shadow-rose-950/60 border border-amber-400/50 hover:brightness-110 active:scale-98 transition cursor-pointer overflow-hidden glow-crimson"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            <Play className="w-5 h-5 fill-current" />
            <span>Bước Vào Lịch Sử</span>
          </button>
        </div>

        {/* Right Side: Hero Roster Preview */}
        <div className="w-full md:w-1/2 max-w-md bg-stone-900/80 backdrop-blur-md rounded-2xl border border-amber-800/40 p-5 shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300 mb-3 text-center border-b border-amber-900/40 pb-2">
            Nhân Vật Chủ Chốt
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
                      ? 'border-amber-400 bg-amber-950/60 shadow-md shadow-amber-900/50 scale-105'
                      : 'border-stone-800 bg-stone-950/60 opacity-70 hover:opacity-100 hover:border-stone-600'
                  }`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-amber-600/30 mb-2">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-amber-100 text-center leading-tight truncate w-full">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-stone-400 text-center truncate w-full">
                    {char.faction === 'viet' ? 'Đại Việt' : 'Nam Hán'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Character Detail Card */}
          {previewChar && (
            <div className="bg-stone-950/80 rounded-xl p-3.5 border border-amber-900/50 flex gap-3 items-center">
              <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 border border-amber-500/40">
                <img
                  src={CHARACTERS[previewChar].avatar}
                  alt={CHARACTERS[previewChar].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-sm font-bold text-amber-300 truncate font-serif-epic">
                  {CHARACTERS[previewChar].name}
                </h4>
                <p className="text-xs text-rose-300/90 font-medium mb-1 truncate">
                  {CHARACTERS[previewChar].title}
                </p>
                <p className="text-[11px] text-stone-400 line-clamp-2">
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
      <footer className="relative z-10 w-full px-6 py-3 border-t border-amber-900/30 bg-stone-950/60 backdrop-blur-sm text-center text-xs text-stone-500">
        Bản thử nghiệm cốt truyện tương tác Lịch sử Việt Nam • Powered by Vite + React Story Engine
      </footer>
    </div>
  );
};
