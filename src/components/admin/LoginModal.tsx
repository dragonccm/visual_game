import React, { useState } from 'react';
import { X, Lock, KeyRound, User, AlertCircle } from 'lucide-react';
import { authService } from '../../utils/auth';
import { soundEngine } from '../../utils/soundEngine';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = authService.login(username, password);
    if (res.success) {
      soundEngine.playSFX('gong');
      onLoginSuccess();
      onClose();
    } else {
      soundEngine.playSFX('drum');
      setErrorMsg(res.message);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="wood-panel-solid w-full max-w-md rounded-2xl p-6 sm:p-8 border-2 border-[#5c4028] shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors p-1"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl btn-material-bronze flex items-center justify-center mx-auto text-amber-200 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-wide">
            ĐĂNG NHẬP QUẢN TRỊ VIÊN
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
            Xác thực quyền quản trị để truy cập Studio tạo màn chơi, tải lên hình ảnh và âm thanh.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-700/80 rounded-lg p-2.5 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Tài Khoản Quản Trị
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản (vd: admin)..."
              className="w-full bg-[#140e0a] text-stone-100 text-sm px-3.5 py-2.5 rounded-lg border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Mật Khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full bg-[#140e0a] text-stone-100 text-sm px-3.5 py-2.5 rounded-lg border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium transition-colors"
            />
          </div>

          {/* Demo Credentials Quick Hint */}
          <div className="bg-[#120d09] rounded-lg p-3 border border-[#3d2a1c] text-[11px] text-stone-400 flex items-center justify-between">
            <div>
              <span className="text-stone-300 font-bold block mb-0.5">Tài khoản mặc định:</span>
              <span>User: <strong className="text-amber-300">admin</strong> | Pass: <strong className="text-amber-300">admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
            >
              Điền nhanh
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-material-bronze w-full py-3 rounded-xl text-amber-100 font-bold text-sm uppercase tracking-wider cursor-pointer shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-200" />
            <span>Đăng Nhập Quản Trị</span>
          </button>
        </form>

        {/* Note for regular players */}
        <div className="mt-5 pt-3 border-t border-[#3d2a1c] text-center">
          <p className="text-[11px] text-stone-500">
            Người chơi thông thường chỉ cần chọn màn và trải nghiệm game mà không cần đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
};
