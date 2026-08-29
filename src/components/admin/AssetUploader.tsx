import React, { useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Image as ImageIcon,
  Music,
  Check,
  Cloud,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { uploadToCloudinary } from '../../utils/cloudinary';

interface AssetUploaderProps {
  label: string;
  acceptType: 'image' | 'audio';
  value: string; // URL hoặc Cloudinary secure_url hoặc Base64 data
  onChange: (val: string) => void;
  presetOptions?: { label: string; value: string }[];
  placeholder?: string;
  compact?: boolean;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  label,
  acceptType,
  value,
  onChange,
  presetOptions,
  placeholder = 'Nhập URL hoặc bấm Tải file lên Cloudinary...',
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');
  const stopAudioRef = useRef<(() => void) | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: image max 10MB, audio max 25MB
    const maxSize = acceptType === 'image' ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File quá lớn. Vui lòng chọn file dưới ${acceptType === 'image' ? '10MB' : '25MB'}.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      // Upload directly to Cloudinary
      const resourceType = acceptType === 'image' ? 'image' : 'video';
      const result = await uploadToCloudinary(file, resourceType, (percent) => {
        setUploadProgress(percent);
      });

      // Save Cloudinary secure_url
      onChange(result.secureUrl);
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local reader:', err);
      setUploadError('Tải lên Cloudinary gián đoạn. Đang dùng bộ nhớ cục bộ...');

      // Fallback to local Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const localResult = event.target?.result as string;
        if (localResult) {
          onChange(localResult);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isCloudinary = value && (value.includes('cloudinary.com') || value.includes('res.cloudinary'));
  const isBase64 = value && value.startsWith('data:');

  return (
    <div className={`space-y-1.5 ${compact ? 'text-xs' : ''}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
          {acceptType === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> : <Music className="w-3.5 h-3.5 text-amber-400" />}
          {label}
        </label>
        {value && (
          <span className="text-[10px] text-stone-300 flex items-center gap-1">
            {isCloudinary ? (
              <span className="text-sky-300 flex items-center gap-1 bg-sky-950/70 px-1.5 py-0.5 rounded border border-sky-700/60">
                <Cloud className="w-3 h-3 text-sky-400" />
                Cloudinary CDN
              </span>
            ) : isBase64 ? (
              <span className="text-amber-300 flex items-center gap-1 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-700/60">
                <Check className="w-3 h-3 text-amber-400" />
                Bộ nhớ máy
              </span>
            ) : (
              <span className="text-emerald-300 flex items-center gap-1 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-700/60">
                <Check className="w-3 h-3 text-emerald-400" />
                Đã gán URL
              </span>
            )}
          </span>
        )}
      </div>

      {/* Input & Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            disabled={isUploading}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#120f0c] text-stone-200 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
          />
          {value && !isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
              title="Xóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-material-bronze text-xs px-3 py-2 text-amber-100 font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded shadow-md disabled:opacity-50"
          title="Tải tệp từ máy lên máy chủ Cloudinary CDN"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>{uploadProgress}%</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-amber-300" />
              <span>Tải Cloud</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptType === 'image' ? 'image/png, image/jpeg, image/webp, image/gif' : 'audio/mp3, audio/wav, audio/ogg, audio/mpeg, audio/m4a'}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Audio Test Play Button */}
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

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="w-full bg-[#1b140e] h-1.5 rounded-full overflow-hidden border border-[#3d2a1c]">
          <div
            className="bg-amber-500 h-full transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="text-[10px] text-amber-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset options */}
      {presetOptions && presetOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
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

      {/* Image Preview Thumbnail */}
      {acceptType === 'image' && value && (
        <div className="relative mt-1.5 w-full max-w-[240px] h-28 rounded-lg border border-[#5c4028] overflow-hidden bg-black/40 group shadow-md">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] text-amber-200 font-bold">Bản xem trước hình ảnh</span>
            <span className="text-[9px] text-stone-400 truncate max-w-full mt-0.5">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
};
