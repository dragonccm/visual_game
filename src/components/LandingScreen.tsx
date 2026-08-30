import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterId } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { Shield, Volume2, VolumeX, Sword, Play, ListOrdered, Sliders, Lock, LogOut, FastForward } from 'lucide-react';

interface LandingScreenProps {
  onStartGame: (playerName: string, selectedHero: CharacterId) => void;
  onResumeGame?: () => void;
  hasSavedSession?: boolean;
  savedSessionLevelTitle?: string;
  onOpenLevelSelect: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  onResumeGame,
  hasSavedSession,
  savedSessionLevelTitle,
  onOpenLevelSelect,
  onOpenAdmin,
  onOpenLogin,
  onLogout,
  isAdmin,
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

  const handleResume = () => {
    if (onResumeGame) {
      soundEngine.unlockAudio();
      soundEngine.playSFX('horn');
      soundEngine.playSFX('drum');
      onResumeGame();
    }
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
      <header className="relative z-10 w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b-2 border-[#422c1b] bg-[#120d09] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg btn-material-bronze flex items-center justify-center text-[#faebd7]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-widest text-[#faebd7] uppercase">
              Sử Ký Đại Việt
            </h1>
            <p className="text-[11px] text-[#b89f88] font-bold tracking-wider">
              Nền Tảng Game Nhập Vai Lịch Sử Tương Tác
            </p>
          </div>
        </div>

        {/* Right Header: Admin / Login / Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="btn-material-bronze px-3 py-1.5 rounded-lg text-xs font-bold text-amber-100 flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Mở Studio Quản Trị để tạo và sửa màn chơi"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Studio Quản Trị</span>
              </button>

              <button
                onClick={onLogout}
                className="btn-material-iron p-2 rounded-lg text-stone-400 hover:text-red-300 transition cursor-pointer"
                title="Đăng xuất quyền Quản trị"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-material-wood px-3 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1.5 border border-[#5c4028] cursor-pointer"
              title="Đăng nhập dành cho Quản trị viên tạo màn chơi"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            className="btn-material-iron p-2 rounded-lg text-[#faebd7] hover:text-[#ffd700] transition cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Center Hero Section */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {/* Left Side: Game Title & Controls */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
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

          {/* Action Buttons: Resume, Play New & Level Select */}
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start w-full">
            {hasSavedSession && onResumeGame && (
              <button
                onClick={handleResume}
                className="btn-material-bronze group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-base md:text-lg tracking-wider uppercase cursor-pointer shadow-xl ring-2 ring-amber-400/80 animate-pulse"
                title={`Tiếp tục ván chơi dở dang: ${savedSessionLevelTitle || ''}`}
              >
                <FastForward className="w-5 h-5 fill-current text-amber-200" />
                <span>Tiếp Tục Chơi</span>
              </button>
            )}

            <button
              onClick={handleStart}
              className={`${
                hasSavedSession
                  ? 'btn-material-wood px-6 py-3.5 text-sm md:text-base border border-[#5c4028]'
                  : 'btn-material-bronze px-8 py-3.5 text-base md:text-lg'
              } group inline-flex items-center justify-center gap-2.5 rounded-xl tracking-wider uppercase cursor-pointer shadow-lg`}
            >
              <Play className="w-4 h-4 fill-current text-[#faebd7]" />
              <span>{hasSavedSession ? 'Chơi Ván Mới' : 'Bước Vào Lịch Sử'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.unlockAudio();
                soundEngine.playSFX('horn');
                onOpenLevelSelect();
              }}
              className="btn-material-iron inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm md:text-base tracking-wider uppercase cursor-pointer text-stone-200 hover:text-white shadow-md"
            >
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>Chọn Chiến Dịch</span>
            </button>
          </div>
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
                </button>
              );
            })}
          </div>

          {/* Hero Bio Details Card */}
          {CHARACTERS[previewChar] && (
            <div className="bg-[#120b07] p-3.5 rounded-xl border-2 border-[#3d2717] text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-[#faebd7] block">
                  {CHARACTERS[previewChar].name}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: CHARACTERS[previewChar].themeColor + '33',
                    color: '#faebd7',
                    border: `1px solid ${CHARACTERS[previewChar].themeColor}`,
                  }}
                >
                  {CHARACTERS[previewChar].title}
                </span>
              </div>
              <p className="text-xs text-[#b89f88] leading-relaxed font-semibold">
                {previewChar === 'ngo_quyen'
                  ? 'Bậc anh hùng dũng lược, trí mưu tột bực. Thống lĩnh toàn quân Đại Việt, thiết lập thế trận cọc ngầm định mệnh.'
                  : previewChar === 'nguyen_tat_to'
                  ? 'Tướng tiên phong mưu trí, thông thạo luồng lạch sông Bạch Đằng, trực tiếp chỉ huy đội thuyền nhẹ nhử địch vào bẫy cọc.'
                  : 'Hoàng tử Nam Hán, chỉ huy vạn chiến hạm kiêu ngạo tràn sang xâm lược, cuối cùng chịu diệt vong nơi cửa sông.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="relative z-10 w-full px-6 py-2.5 text-center text-xs text-[#8c735d] border-t-2 border-[#382414] bg-[#0c0704] flex items-center justify-between">
        <span>© 2026 Sử Ký Đại Việt • Kỷ Nguyên Độc Lập</span>
        <span className="text-[#d4af37] font-bold">Phiên bản Tương Tác Sử Học 2.0</span>
      </footer>
    </div>
  );
};
