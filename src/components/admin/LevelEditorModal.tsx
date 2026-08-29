import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Users,
  Film,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  ArrowUp,
  ArrowDown,
  Volume2,
} from 'lucide-react';
import { CampaignLevel, CharacterInfo, SceneData, DialogueItem, ChoiceOption } from '../../types/game';
import { AssetUploader } from './AssetUploader';

interface LevelEditorModalProps {
  level: CampaignLevel;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLevel: CampaignLevel) => void;
  onPlaytest: (level: CampaignLevel) => void;
}

type TabType = 'general' | 'characters' | 'scenes' | 'choices' | 'endings';

const BACKGROUND_PRESETS = [
  { label: 'Trướng Nghị Kế', value: '/assets/images/scenes/war_tent.jpg' },
  { label: 'Bãi Cọc Sông', value: '/assets/images/scenes/planting_stakes.jpg' },
  { label: 'Dụ Địch Cửa Biển', value: '/assets/images/scenes/luring_enemy.jpg' },
  { label: 'Phản Công Quyết Chiến', value: '/assets/images/scenes/counter_attack.jpg' },
  { label: 'Bình Minh Khải Hoàn', value: '/assets/images/scenes/victory_dawn.jpg' },
];

const SFX_PRESETS = [
  { label: 'Trống trận (Drum)', value: 'drum' },
  { label: 'Tù và (Horn)', value: 'horn' },
  { label: 'Gươm đao (Clash)', value: 'clash' },
  { label: 'Hỏa công (Fire)', value: 'fire' },
  { label: 'Cung tên (Arrow)', value: 'arrow' },
  { label: 'Sóng biển (Waves)', value: 'waves' },
  { label: 'Gió bão (Wind)', value: 'wind' },
  { label: 'Cọc đâm tàu (Crack)', value: 'wooden_crack' },
  { label: 'Cồng lệnh (Gong)', value: 'gong' },
  { label: 'Tướng sĩ xuất kích (Cry)', value: 'battle_cry' },
  { label: 'Khải hoàn ca (Victory)', value: 'victory' },
];

const BGM_PRESETS = [
  { label: 'Đại chiến sử thi (Epic War)', value: 'epic_war' },
  { label: 'Căng thẳng phục kích (Suspense)', value: 'suspense' },
  { label: 'Trầm tư nghị kế (Calm)', value: 'calm' },
];

export const LevelEditorModal: React.FC<LevelEditorModalProps> = ({
  level,
  isOpen,
  onClose,
  onSave,
  onPlaytest,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [formData, setFormData] = useState<CampaignLevel>(JSON.parse(JSON.stringify(level)));
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    level.initialSceneId || Object.keys(level.scenes)[0] || ''
  );
  const [selectedCharId, setSelectedCharId] = useState<string>(Object.keys(level.characters)[0] || '');

  if (!isOpen) return null;

  const currentScene: SceneData | undefined = formData.scenes[selectedSceneId];
  const currentCharacter: CharacterInfo | undefined = formData.characters[selectedCharId];

  // Helper to update top level field
  const updateField = <K extends keyof CampaignLevel>(key: K, value: CampaignLevel[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // --- Character Handlers ---
  const handleAddCharacter = () => {
    const newId = `char_${Date.now()}`;
    const newChar: CharacterInfo = {
      id: newId,
      name: 'Tướng Mới',
      title: 'Tướng Lĩnh',
      faction: 'viet',
      avatar: '/assets/images/characters/ngo_quyen.jpg',
      fullImage: '/assets/images/characters/ngo_quyen.jpg',
      themeColor: '#e11d48',
    };
    setFormData((prev) => ({
      ...prev,
      characters: { ...prev.characters, [newId]: newChar },
    }));
    setSelectedCharId(newId);
  };

  const handleUpdateCharacter = <K extends keyof CharacterInfo>(key: K, value: CharacterInfo[K]) => {
    if (!selectedCharId) return;
    setFormData((prev) => ({
      ...prev,
      characters: {
        ...prev.characters,
        [selectedCharId]: { ...prev.characters[selectedCharId], [key]: value },
      },
    }));
  };

  const handleDeleteCharacter = (charId: string) => {
    if (Object.keys(formData.characters).length <= 1) {
      alert('Màn chơi phải có ít nhất 1 nhân vật.');
      return;
    }
    const newChars = { ...formData.characters };
    delete newChars[charId];
    setFormData((prev) => ({ ...prev, characters: newChars }));
    setSelectedCharId(Object.keys(newChars)[0]);
  };

  // --- Scene Handlers ---
  const handleAddScene = () => {
    const newId = `scene_${Date.now()}`;
    const newScene: SceneData = {
      id: newId,
      title: `Hồi ${Object.keys(formData.scenes).length + 1}: Diễn Biến Mới`,
      chapter: 'Chương Mới',
      branchTag: 'Nhánh Mới',
      background: 'war_tent',
      timeOfDay: 'Đêm khuya',
      dialogues: [
        {
          id: `d_${Date.now()}`,
          speaker: Object.keys(formData.characters)[0] || 'narrator',
          text: 'Nhập nội dung lời thoại đầu tiên của phân cảnh này...',
        },
      ],
      choices: [],
    };
    setFormData((prev) => ({
      ...prev,
      scenes: { ...prev.scenes, [newId]: newScene },
    }));
    setSelectedSceneId(newId);
  };

  const handleUpdateScene = <K extends keyof SceneData>(key: K, value: SceneData[K]) => {
    if (!selectedSceneId || !formData.scenes[selectedSceneId]) return;
    setFormData((prev) => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [selectedSceneId]: { ...prev.scenes[selectedSceneId], [key]: value },
      },
    }));
  };

  const handleDeleteScene = (sceneId: string) => {
    if (Object.keys(formData.scenes).length <= 1) {
      alert('Màn chơi phải có ít nhất 1 phân cảnh.');
      return;
    }
    if (sceneId === formData.initialSceneId) {
      alert('Không thể xóa phân cảnh khởi đầu của màn chơi.');
      return;
    }
    const newScenes = { ...formData.scenes };
    delete newScenes[sceneId];
    setFormData((prev) => ({ ...prev, scenes: newScenes }));
    setSelectedSceneId(Object.keys(newScenes)[0]);
  };

  // --- Dialogue Handlers in Current Scene ---
  const handleAddDialogue = () => {
    if (!selectedSceneId || !currentScene) return;
    const newDiag: DialogueItem = {
      id: `d_${Date.now()}`,
      speaker: Object.keys(formData.characters)[0] || 'narrator',
      text: 'Nhập câu thoại...',
      emotion: 'normal',
    };
    handleUpdateScene('dialogues', [...currentScene.dialogues, newDiag]);
  };

  const handleUpdateDialogue = (index: number, updated: Partial<DialogueItem>) => {
    if (!selectedSceneId || !currentScene) return;
    const list = [...currentScene.dialogues];
    list[index] = { ...list[index], ...updated };
    handleUpdateScene('dialogues', list);
  };

  const handleDeleteDialogue = (index: number) => {
    if (!selectedSceneId || !currentScene) return;
    if (currentScene.dialogues.length <= 1) {
      alert('Mỗi phân cảnh cần ít nhất 1 câu thoại.');
      return;
    }
    const list = currentScene.dialogues.filter((_, i) => i !== index);
    handleUpdateScene('dialogues', list);
  };

  const handleMoveDialogue = (index: number, direction: 'up' | 'down') => {
    if (!selectedSceneId || !currentScene) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentScene.dialogues.length) return;

    const list = [...currentScene.dialogues];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    handleUpdateScene('dialogues', list);
  };

  // --- Choice Handlers in Current Scene ---
  const handleAddChoice = () => {
    if (!selectedSceneId || !currentScene) return;
    const nextIds = Object.keys(formData.scenes).filter((id) => id !== selectedSceneId);
    const newChoice: ChoiceOption = {
      id: `choice_${Date.now()}`,
      text: 'Lựa chọn chiến thuật mới',
      tag: 'QUYẾT SÁCH',
      description: 'Mô tả ngắn gọn về hành động này...',
      moraleChange: 10,
      nextSceneId: nextIds[0] || selectedSceneId,
      isOptimal: false,
    };
    const currentChoices = currentScene.choices || [];
    handleUpdateScene('choices', [...currentChoices, newChoice]);
  };

  const handleUpdateChoice = (index: number, updated: Partial<ChoiceOption>) => {
    if (!selectedSceneId || !currentScene || !currentScene.choices) return;
    const list = [...currentScene.choices];
    list[index] = { ...list[index], ...updated };
    handleUpdateScene('choices', list);
  };

  const handleDeleteChoice = (index: number) => {
    if (!selectedSceneId || !currentScene || !currentScene.choices) return;
    const list = currentScene.choices.filter((_, i) => i !== index);
    handleUpdateScene('choices', list);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên màn chơi.');
      return;
    }
    if (!formData.initialSceneId || !formData.scenes[formData.initialSceneId]) {
      alert('Vui lòng chọn phân cảnh khởi đầu hợp lệ.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
      <div className="wood-panel-solid w-full max-w-6xl h-[92vh] flex flex-col rounded-xl overflow-hidden border border-[#5c4028] shadow-2xl">
        {/* Header */}
        <div className="bg-[#1b140e] px-4 py-3 border-b border-[#4a3525] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-300 font-bold">
              🛠️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-200 font-serif tracking-wide">
                Quản Trị & Soạn Thảo Màn Chơi
              </h2>
              <p className="text-[11px] text-stone-400">
                Đang chỉnh sửa: <span className="text-amber-400 font-medium">{formData.title}</span> ({formData.id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlaytest(formData)}
              className="btn-material-iron text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-stone-200 hover:text-white cursor-pointer"
              title="Chạy thử nghiệm màn chơi ngay"
            >
              <span>🎮 Chơi Thử</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-material-bronze text-xs px-4 py-1.5 rounded flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Lại</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#140e0a] px-4 py-1.5 border-b border-[#3d2a1c] flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Thông Tin Chung</span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'characters'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Nhân Vật ({Object.keys(formData.characters).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'scenes'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>3. Phân Cảnh & Lời Thoại ({Object.keys(formData.scenes).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('choices')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'choices'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Quyết Sách Rẽ Nhánh</span>
          </button>
          <button
            onClick={() => setActiveTab('endings')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'endings'
                ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>5. Kết Cục & Sử Liệu</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0e0a07]">
          {/* TAB 1: THÔNG TIN CHUNG */}
          {activeTab === 'general' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="card-solid-dark p-4 rounded-lg border border-[#4a3525] space-y-4">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Tổng Quan Chiến Dịch
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Tên Màn Chơi / Chiến Dịch</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Ví dụ: Đại Thắng Bạch Đằng 938"
                      className="w-full bg-[#1b140e] text-stone-100 text-sm px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Niên Đại Lịch Sử</label>
                    <input
                      type="text"
                      value={formData.era}
                      onChange={(e) => updateField('era', e.target.value)}
                      placeholder="Ví dụ: Năm 938 • Thời Tiền Ngô Vương"
                      className="w-full bg-[#1b140e] text-stone-100 text-sm px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Tiêu Đề Phụ / Khẩu Hiệu</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="Ví dụ: Trận Thủy Chiến Định Đoạt Vận Mệnh Nghìn Năm Độc Lập"
                    className="w-full bg-[#1b140e] text-stone-100 text-sm px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Tóm Tắt Bối Cảnh Lịch Sử</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Mô tả bối cảnh quân sự, ý nghĩa lịch sử của màn chơi..."
                    className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Độ Khó</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => updateField('difficulty', e.target.value as any)}
                      className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500"
                    >
                      <option value="Dễ">Dễ</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Khó">Khó</option>
                      <option value="Sử thi">Sử thi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Nhuệ Khí Ban Đầu</label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={formData.initialMorale}
                      onChange={(e) => updateField('initialMorale', parseInt(e.target.value) || 80)}
                      className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Phân Cảnh Mở Đầu</label>
                    <select
                      value={formData.initialSceneId}
                      onChange={(e) => updateField('initialSceneId', e.target.value)}
                      className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500"
                    >
                      {Object.values(formData.scenes).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <AssetUploader
                  label="Ảnh Bìa Chiến Dịch (Cover Image)"
                  acceptType="image"
                  value={formData.coverImage}
                  onChange={(val) => updateField('coverImage', val)}
                  presetOptions={BACKGROUND_PRESETS}
                />
              </div>
            </div>
          )}

          {/* TAB 2: NHÂN VẬT */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Character List Column */}
              <div className="card-solid-dark p-3 rounded-lg border border-[#4a3525] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Danh Sách Tướng</span>
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    className="btn-material-bronze text-[11px] px-2 py-1 rounded flex items-center gap-1 text-amber-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Tướng</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                  {Object.values(formData.characters).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCharId(c.id)}
                      className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${
                        selectedCharId === c.id
                          ? 'bg-[#2b1c12] border-amber-500 shadow-md'
                          : 'bg-[#150f0a] border-[#3d2a1c] hover:border-amber-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={c.avatar || '/assets/images/characters/ngo_quyen.jpg'}
                          alt={c.name}
                          className="w-8 h-8 rounded object-cover border border-[#5c4028]"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-stone-200 truncate">{c.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{c.title || c.faction}</p>
                        </div>
                      </div>

                      {c.id !== 'narrator' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(c.id);
                          }}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                          title="Xóa nhân vật"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Character Details Column */}
              {currentCharacter && (
                <div className="md:col-span-2 card-solid-dark p-4 rounded-lg border border-[#4a3525] space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Chi Tiết: {currentCharacter.name} ({currentCharacter.id})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tên Danh Xưng</label>
                      <input
                        type="text"
                        value={currentCharacter.name}
                        onChange={(e) => handleUpdateCharacter('name', e.target.value)}
                        placeholder="Ví dụ: Ngô Quyền"
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Chức Vụ / Danh Hiệu</label>
                      <input
                        type="text"
                        value={currentCharacter.title}
                        onChange={(e) => handleUpdateCharacter('title', e.target.value)}
                        placeholder="Ví dụ: Tiết Độ Sứ • Tiền Ngô Vương"
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Phe Phái (Faction)</label>
                      <select
                        value={currentCharacter.faction}
                        onChange={(e) => handleUpdateCharacter('faction', e.target.value as any)}
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500"
                      >
                        <option value="viet">Đại Việt / Nghĩa Quân (Đỏ)</option>
                        <option value="han">Quân Nam Hán (Vàng)</option>
                        <option value="minh">Quân Nhà Minh (Vàng)</option>
                        <option value="enemy">Quân Địch Xâm Lược (Vàng/Cam)</option>
                        <option value="neutral">Dẫn Chuyện / Sử Ký (Trung Lập)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Màu Chủ Đạo</label>
                      <input
                        type="color"
                        value={currentCharacter.themeColor || '#e11d48'}
                        onChange={(e) => handleUpdateCharacter('themeColor', e.target.value)}
                        className="w-full h-9 bg-[#1b140e] rounded border border-[#4a3525] cursor-pointer"
                      />
                    </div>
                  </div>

                  <AssetUploader
                    label="Ảnh Đại Diện (Avatar)"
                    acceptType="image"
                    value={currentCharacter.avatar}
                    onChange={(val) => handleUpdateCharacter('avatar', val)}
                  />

                  <AssetUploader
                    label="Ảnh Chân Dung Đứng Toàn Thân (Sprite)"
                    acceptType="image"
                    value={currentCharacter.fullImage}
                    onChange={(val) => handleUpdateCharacter('fullImage', val)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PHÂN CẢNH & LỜI THOẠI */}
          {activeTab === 'scenes' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-6xl mx-auto">
              {/* Scene List Sidebar (4 cols) */}
              <div className="md:col-span-4 card-solid-dark p-3 rounded-lg border border-[#4a3525] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Danh Sách Cảnh</span>
                  <button
                    type="button"
                    onClick={handleAddScene}
                    className="btn-material-bronx text-[11px] px-2.5 py-1 rounded flex items-center gap-1 text-amber-100 font-medium bg-amber-900 border border-amber-600 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Cảnh</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                  {Object.values(formData.scenes).map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSceneId(s.id)}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        selectedSceneId === s.id
                          ? 'bg-[#2b1c12] border-amber-500 shadow-md'
                          : 'bg-[#150f0a] border-[#3d2a1c] hover:border-amber-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-stone-200 truncate flex-1">
                          {idx + 1}. {s.title}
                        </span>
                        {s.id === formData.initialSceneId && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-900/90 text-amber-200 rounded border border-amber-600 font-mono ml-1">
                            START
                          </span>
                        )}
                        {s.isEnding && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-900/90 text-emerald-200 rounded border border-emerald-600 font-mono ml-1">
                            END ({s.endingRank || 'S'})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span>{s.chapter}</span>
                        <span>{s.dialogues.length} câu thoại</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scene Dialogues & Background Editor (8 cols) */}
              {currentScene && (
                <div className="md:col-span-8 card-solid-dark p-4 rounded-lg border border-[#4a3525] space-y-4">
                  {/* Scene Header Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#17100b] p-3 rounded border border-[#3d2a1c]">
                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">Tiêu Đề Cảnh</label>
                      <input
                        type="text"
                        value={currentScene.title}
                        onChange={(e) => handleUpdateScene('title', e.target.value)}
                        className="w-full bg-[#120c08] text-stone-100 text-xs px-2.5 py-1.5 rounded border border-[#4a3525] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">Chương / Hồi</label>
                      <input
                        type="text"
                        value={currentScene.chapter}
                        onChange={(e) => handleUpdateScene('chapter', e.target.value)}
                        className="w-full bg-[#120c08] text-stone-100 text-xs px-2.5 py-1.5 rounded border border-[#4a3525]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">Thời Điểm Trong Ngày</label>
                      <input
                        type="text"
                        value={currentScene.timeOfDay}
                        onChange={(e) => handleUpdateScene('timeOfDay', e.target.value)}
                        placeholder="Đêm khuya / Trưa triều dâng / Bình minh..."
                        className="w-full bg-[#120c08] text-stone-100 text-xs px-2.5 py-1.5 rounded border border-[#4a3525]"
                      />
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="flex-1">
                        <label className="text-[11px] text-stone-300 font-medium block mb-1">Khởi Đầu Game?</label>
                        <button
                          type="button"
                          onClick={() => updateField('initialSceneId', currentScene.id)}
                          className={`w-full py-1.5 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                            formData.initialSceneId === currentScene.id
                              ? 'bg-amber-800 text-amber-100 border-amber-500'
                              : 'bg-[#1b140e] text-stone-400 border-[#4a3525] hover:text-stone-200'
                          }`}
                        >
                          {formData.initialSceneId === currentScene.id ? '✓ Đang là cảnh mở đầu' : 'Đặt làm cảnh mở đầu'}
                        </button>
                      </div>

                      {currentScene.id !== formData.initialSceneId && (
                        <button
                          type="button"
                          onClick={() => handleDeleteScene(currentScene.id)}
                          className="px-2.5 py-1.5 bg-red-950/80 text-red-300 border border-red-800 rounded text-xs hover:bg-red-900 transition-colors cursor-pointer"
                          title="Xóa cảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <AssetUploader
                    label="Hình Nền Phân Cảnh (Background)"
                    acceptType="image"
                    value={currentScene.background}
                    onChange={(val) => handleUpdateScene('background', val)}
                    presetOptions={BACKGROUND_PRESETS}
                  />

                  {/* Dialogues List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        Lời Thoại Trong Cảnh ({currentScene.dialogues.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddDialogue}
                        className="btn-material-bronze text-[11px] px-2.5 py-1 rounded flex items-center gap-1 text-amber-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm Câu Thoại</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                      {currentScene.dialogues.map((diag, dIdx) => (
                        <div
                          key={diag.id || dIdx}
                          className="bg-[#150f0a] p-3 rounded-lg border border-[#3d2a1c] space-y-2.5 relative group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold flex items-center justify-center border border-amber-700">
                                {dIdx + 1}
                              </span>
                              <select
                                value={diag.speaker}
                                onChange={(e) => handleUpdateDialogue(dIdx, { speaker: e.target.value })}
                                className="bg-[#1f160f] text-amber-200 text-xs px-2 py-1 rounded border border-[#4a3525] font-bold"
                              >
                                {Object.values(formData.characters).map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.title || c.faction})
                                  </option>
                                ))}
                              </select>

                              <select
                                value={diag.emotion || 'normal'}
                                onChange={(e) => handleUpdateDialogue(dIdx, { emotion: e.target.value as any })}
                                className="bg-[#1f160f] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#4a3525]"
                              >
                                <option value="normal">Bình thường</option>
                                <option value="intense">Kịch tính / Căng thẳng</option>
                                <option value="confident">Tự tin / Hào hùng</option>
                                <option value="angry">Phẫn nộ / Uy nghiêm</option>
                                <option value="triumphant">Khải hoàn / Hân hoan</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={dIdx === 0}
                                onClick={() => handleMoveDialogue(dIdx, 'up')}
                                className="p-1 text-stone-500 hover:text-stone-200 disabled:opacity-30 cursor-pointer"
                                title="Di chuyển lên"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={dIdx === currentScene.dialogues.length - 1}
                                onClick={() => handleMoveDialogue(dIdx, 'down')}
                                className="p-1 text-stone-500 hover:text-stone-200 disabled:opacity-30 cursor-pointer"
                                title="Di chuyển xuống"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDialogue(dIdx)}
                                className="p-1 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Xóa câu thoại này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            value={diag.text}
                            onChange={(e) => handleUpdateDialogue(dIdx, { text: e.target.value })}
                            placeholder="Nhập nội dung lời thoại..."
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                          />

                          {/* Sound Effect & BGM & Voice Audio Uploader */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div>
                              <label className="text-stone-400 block mb-0.5">Hiệu ứng Âm thanh (SFX):</label>
                              <select
                                value={diag.soundEffect || ''}
                                onChange={(e) => handleUpdateDialogue(dIdx, { soundEffect: e.target.value || undefined })}
                                className="w-full bg-[#1b140e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#3d2a1c]"
                              >
                                <option value="">(Không có SFX)</option>
                                {SFX_PRESETS.map((p) => (
                                  <option key={p.value} value={p.value}>
                                    {p.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-stone-400 block mb-0.5">Nhạc nền (BGM):</label>
                              <select
                                value={diag.bgm || ''}
                                onChange={(e) => handleUpdateDialogue(dIdx, { bgm: e.target.value || undefined })}
                                className="w-full bg-[#1b140e] text-stone-300 text-[11px] px-2 py-1 rounded border border-[#3d2a1c]"
                              >
                                <option value="">(Giữ nguyên BGM)</option>
                                {BGM_PRESETS.map((p) => (
                                  <option key={p.value} value={p.value}>
                                    {p.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <AssetUploader
                                label="Audio Giọng Đọc (Tùy chọn)"
                                acceptType="audio"
                                value={diag.customVoiceUrl || ''}
                                onChange={(val) => handleUpdateDialogue(dIdx, { customVoiceUrl: val || undefined })}
                                placeholder="Upload MP3/WAV giọng đọc..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUYẾT SÁCH RẼ NHÁNH (CHOICES) */}
          {activeTab === 'choices' && currentScene && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="card-solid-dark p-4 rounded-lg border border-[#4a3525] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Các Lựa Chọn Cho Cảnh: {currentScene.title}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Khi kết thúc lời thoại ở phân cảnh này, các quyết sách bên dưới sẽ hiện ra cho người chơi chọn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddChoice}
                    className="btn-material-bronze text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-amber-100 font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Lựa Chọn</span>
                  </button>
                </div>

                {(!currentScene.choices || currentScene.choices.length === 0) && (
                  <div className="text-center py-8 text-stone-400 space-y-2">
                    <p className="text-xs">Chưa có lựa chọn nào cho cảnh này.</p>
                    <p className="text-[11px] text-stone-500">
                      Nếu không có lựa chọn và không phải Kết Cục, game sẽ tự động kết thúc hoặc tiếp tục theo luồng.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {currentScene.choices?.map((choice, cIdx) => (
                    <div
                      key={choice.id || cIdx}
                      className="bg-[#150f0a] p-4 rounded-lg border border-[#4a3525] space-y-3 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-400">Quyết sách #{cIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChoice(cIdx)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Xóa lựa chọn này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-stone-300 font-medium block mb-1">Tiêu Đề Lựa Chọn</label>
                          <input
                            type="text"
                            value={choice.text}
                            onChange={(e) => handleUpdateChoice(cIdx, { text: e.target.value })}
                            placeholder="Ví dụ: Kế Sách Bãi Cọc Ngầm"
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c] font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-stone-300 font-medium block mb-1">Thẻ Gợi Ý (Tag)</label>
                          <input
                            type="text"
                            value={choice.tag || ''}
                            onChange={(e) => handleUpdateChoice(cIdx, { tag: e.target.value })}
                            placeholder="Ví dụ: 👑 CHÍNH SỬ (TỐI ƯU)"
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-300 font-medium block mb-1">Mô Tả Chiến Thuật</label>
                        <input
                          type="text"
                          value={choice.description || ''}
                          onChange={(e) => handleUpdateChoice(cIdx, { description: e.target.value })}
                          placeholder="Mô tả ngắn gọn về hành động chiến thuật..."
                          className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-stone-300 font-medium block mb-1">Chuyển Tới Phân Cảnh (Next Scene)</label>
                          <select
                            value={choice.nextSceneId}
                            onChange={(e) => handleUpdateChoice(cIdx, { nextSceneId: e.target.value })}
                            className="w-full bg-[#100b07] text-amber-200 text-xs px-2.5 py-2 rounded border border-[#3d2a1c] font-medium"
                          >
                            {Object.values(formData.scenes).map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title} ({s.id})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-stone-300 font-medium block mb-1">Thay Đổi Nhuệ Khí (+/-)</label>
                          <input
                            type="number"
                            value={choice.moraleChange ?? 10}
                            onChange={(e) => handleUpdateChoice(cIdx, { moraleChange: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c] font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={choice.isOptimal || false}
                              onChange={(e) => handleUpdateChoice(cIdx, { isOptimal: e.target.checked })}
                              className="accent-amber-500 w-4 h-4 rounded"
                            />
                            <span>Chuẩn Chính Sử Tối Ưu?</span>
                          </label>
                        </div>
                      </div>

                      {choice.isOptimal && (
                        <div>
                          <label className="text-[11px] text-amber-300 font-medium block mb-1">
                            Lý Giải Lịch Sử (Hiện cho học viên khi bật Chế Độ Nghiên Cứu)
                          </label>
                          <textarea
                            rows={2}
                            value={choice.historicalReason || ''}
                            onChange={(e) => handleUpdateChoice(cIdx, { historicalReason: e.target.value })}
                            placeholder="Giải thích vì sao kế sách này là tối ưu theo binh pháp lịch sử..."
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KẾT CỤC (ENDINGS) */}
          {activeTab === 'endings' && currentScene && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="card-solid-dark p-4 rounded-lg border border-[#4a3525] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Thiết Lập Kết Cục Cho Phân Cảnh: {currentScene.title}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Nếu bật Kết Cục, khi phân cảnh này kết thúc, game sẽ hiển thị màn hình vinh danh chiến công tương ứng.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-amber-200 font-bold bg-[#1e150f] px-3 py-1.5 rounded border border-amber-600/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentScene.isEnding || false}
                      onChange={(e) => handleUpdateScene('isEnding', e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Đây là Phân Cảnh Kết Cục</span>
                  </label>
                </div>

                {currentScene.isEnding ? (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-stone-300 font-medium block mb-1">Loại Kết Cục (Ending Type)</label>
                        <select
                          value={currentScene.endingType || 'triumphant'}
                          onChange={(e) => handleUpdateScene('endingType', e.target.value as any)}
                          className="w-full bg-[#150f0a] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525]"
                        >
                          <option value="triumphant">🏆 Đại Thắng Sử Thi (Triumphant Victory)</option>
                          <option value="good">🛡️ Thắng Lợi Chiến Thuật (Good Victory)</option>
                          <option value="retreat">🚩 Rút Quân Cầm Cự (Strategic Retreat)</option>
                          <option value="defeat">⚠️ Thất Bại / Bài Học Quân Sự (Defeat)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-stone-300 font-medium block mb-1">Xếp Hạng Binh Pháp (Rank)</label>
                        <select
                          value={currentScene.endingRank || 'S+'}
                          onChange={(e) => handleUpdateScene('endingRank', e.target.value as any)}
                          className="w-full bg-[#150f0a] text-amber-300 font-bold text-xs px-3 py-2 rounded border border-[#4a3525]"
                        >
                          <option value="S+">Hạng S+ (Thần Cơ Diệu Toán)</option>
                          <option value="S">Hạng S (Xuất Sắc)</option>
                          <option value="A+">Hạng A+ (Dũng Cảm Kiên Cường)</option>
                          <option value="A">Hạng A (Chiến Thắng)</option>
                          <option value="B+">Hạng B+ (Khá)</option>
                          <option value="B">Hạng B (Trung Bình)</option>
                          <option value="C">Hạng C (Tổn Thất Lớn)</option>
                          <option value="D">Hạng D (Thất Bại)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Huy Hiệu Kết Cục (Badge)</label>
                      <input
                        type="text"
                        value={currentScene.endingBadge || ''}
                        onChange={(e) => handleUpdateScene('endingBadge', e.target.value)}
                        placeholder="Ví dụ: 👑 ĐẠI THẮNG BẠCH ĐẰNG"
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tiêu Đề Kết Cục (Ending Title)</label>
                      <input
                        type="text"
                        value={currentScene.endingTitle || ''}
                        onChange={(e) => handleUpdateScene('endingTitle', e.target.value)}
                        placeholder="Ví dụ: THIÊN THU ĐẠI THẮNG BẠCH ĐẰNG GIANG"
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] font-serif font-bold text-amber-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tổng Kết Chiến Tích Sử Sách</label>
                      <textarea
                        rows={4}
                        value={currentScene.endingSummary || ''}
                        onChange={(e) => handleUpdateScene('endingSummary', e.target.value)}
                        placeholder="Đánh giá chiến công, ghi nhận bài học lịch sử..."
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500 text-xs">
                    Phân cảnh này hiện đang là phân cảnh thông thường. Hãy tích chọn ô phía trên nếu đây là một trong các kết thúc của cốt truyện.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
