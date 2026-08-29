import React, { useRef, useState } from 'react';
import { Upload, X, Play, Pause, Image as ImageIcon, Music, Check } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface AssetUploaderProps {
  label: string;
  acceptType: 'image' | 'audio';
  value: string; // URL hoặc Base64 data
  onChange: (val: string) => void;
  presetOptions?: { label: string; value: string }[];
  placeholder?: string;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  label,
  acceptType,
  value,
  onChange,
  presetOptions,
  placeholder = 'Nhập đường dẫn URL hoặc tải file từ máy...',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: image max 5MB, audio max 10MB
    const maxSize = acceptType === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File quá lớn. Vui lòng chọn file dưới ${acceptType === 'image' ? '5MB' : '10MB'}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTogglePlay = () => {
    if (!value) return;

    if (isPlaying) {
      if (stopAudioRef.current) stopAudioRef.current();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      stopAudioRef.current = soundEngine.previewAudio(value, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleClear = () => {
    if (isPlaying && stopAudioRef.current) {
      stopAudioRef.current();
      setIsPlaying(false);
    }
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isBase64 = value && value.startsWith('data:');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider font-bold text-amber-300/90 flex items-center gap-1.5">
          {acceptType === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> : <Music className="w-3.5 h-3.5 text-amber-400" />}
          {label}
        </label>
        {value && (
          <span className="text-[10px] text-stone-400 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            {isBase64 ? 'File đã tải lên' : 'Đã gắn URL'}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#120f0c] text-stone-200 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-mono transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-400 p-1 transition-colors"
              title="Xóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-material-wood text-xs px-3 py-2 text-stone-200 hover:text-amber-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded border border-[#5c4028]"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>Tải file</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptType === 'image' ? 'image/png, image/jpeg, image/webp, image/gif' : 'audio/mp3, audio/wav, audio/ogg, audio/mpeg'}
          onChange={handleFileChange}
          className="hidden"
        />

        {acceptType === 'audio' && value && (
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-3 py-2 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              isPlaying
                ? 'bg-amber-600 text-white font-bold animate-pulse'
                : 'bg-[#2a1d13] text-amber-300 border border-[#5c4028] hover:bg-[#3d2a1b]'
            }`}
            title={isPlaying ? 'Dừng nghe thử' : 'Nghe thử âm thanh'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Dừng' : 'Nghe thử'}</span>
          </button>
        )}
      </div>

      {/* Preset options */}
      {presetOptions && presetOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-stone-400 self-center mr-1">Mẫu có sẵn:</span>
          {presetOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                value === opt.value
                  ? 'bg-amber-800/80 text-amber-100 border-amber-500 font-medium'
                  : 'bg-[#1e150f] text-stone-400 border-[#3d2a1c] hover:border-amber-600 hover:text-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview */}
      {acceptType === 'image' && value && (
        <div className="relative mt-2 w-full max-w-[200px] h-24 rounded border border-[#5c4028] overflow-hidden bg-black/40 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-stone-200">Bản xem trước</span>
          </div>
        </div>
      )}
    </div>
  );
};
