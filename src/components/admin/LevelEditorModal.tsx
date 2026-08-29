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
  Waves,
  Clock,
  Play,
  Copy,
  GitBranch,
  Layers,
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

type TabType = 'general' | 'characters' | 'scenes' | 'choices' | 'endings' | 'map';

const BACKGROUND_PRESETS = [
  { label: 'Trướng Nghị Kế', value: '/assets/images/scenes/war_tent.jpg' },
  { label: 'Bãi Cọc Sông', value: '/assets/images/scenes/planting_stakes.jpg' },
  { label: 'Dụ Địch Cửa Biển', value: '/assets/images/scenes/luring_enemy.jpg' },
  { label: 'Phản Công Quyết Chiến', value: '/assets/images/scenes/counter_attack.jpg' },
  { label: 'Bình Minh Khải Hoàn', value: '/assets/images/scenes/victory_dawn.jpg' },
];

const SFX_PRESETS = [
  { label: 'Trống trận (Drum)', value: 'drum' },
  { label: 'Tù và xung trận (Horn)', value: 'horn' },
  { label: 'Gươm đao va chạm (Clash)', value: 'clash' },
  { label: 'Hỏa thiêu (Fire)', value: 'fire' },
  { label: 'Cung tên bắn (Arrow)', value: 'arrow' },
  { label: 'Sóng biển cuộn trào (Waves)', value: 'waves' },
  { label: 'Gió bão gầm rú (Wind)', value: 'wind' },
  { label: 'Cọc gỗ đâm vỡ tàu (Crack)', value: 'wooden_crack' },
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
  const [activeTab, setActiveTab] = useState<TabType>('scenes');
  const [formData, setFormData] = useState<CampaignLevel>(JSON.parse(JSON.stringify(level)));
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    level.initialSceneId || Object.keys(level.scenes)[0] || ''
  );
  const [selectedCharId, setSelectedCharId] = useState<string>(Object.keys(level.characters)[0] || '');

  if (!isOpen) return null;

  const currentScene: SceneData | undefined = formData.scenes[selectedSceneId];
  const currentCharacter: CharacterInfo | undefined = formData.characters[selectedCharId];

  const updateField = <K extends keyof CampaignLevel>(key: K, value: CampaignLevel[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // --- Character Handlers ---
  const handleAddCharacter = () => {
    const newId = `char_${Date.now()}`;
    const newChar: CharacterInfo = {
      id: newId,
      name: 'Tướng Lĩnh Mới',
      title: 'Thống Soái',
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
  const handleAddScene = (customId?: string, titleName?: string) => {
    const newId = customId || `scene_${Date.now()}`;
    const sceneIndex = Object.keys(formData.scenes).length + 1;
    const newScene: SceneData = {
      id: newId,
      title: titleName || `Hồi ${sceneIndex}: Diễn Biến Mới`,
      chapter: `Chương ${sceneIndex}`,
      branchTag: 'Chiến Lược',
      background: 'war_tent',
      timeOfDay: 'Đêm khuya',
      tideState: 'neutral',
      dialogues: [
        {
          id: `d_${Date.now()}`,
          speaker: Object.keys(formData.characters)[0] || 'narrator',
          text: 'Nhập nội dung câu thoại đầu tiên của phân cảnh này...',
          emotion: 'normal',
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

  const handleDuplicateScene = (sceneId: string) => {
    const src = formData.scenes[sceneId];
    if (!src) return;
    const newId = `scene_${Date.now()}`;
    const cloned: SceneData = {
      ...JSON.parse(JSON.stringify(src)),
      id: newId,
      title: `${src.title} (Bản sao)`,
    };
    setFormData((prev) => ({
      ...prev,
      scenes: { ...prev.scenes, [newId]: cloned },
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
      text: '',
      emotion: 'normal',
    };
    handleUpdateScene('dialogues', [...currentScene.dialogues, newDiag]);
  };

  const handleDuplicateDialogue = (index: number) => {
    if (!selectedSceneId || !currentScene) return;
    const target = currentScene.dialogues[index];
    const cloned: DialogueItem = {
      ...JSON.parse(JSON.stringify(target)),
      id: `d_${Date.now()}`,
    };
    const list = [...currentScene.dialogues];
    list.splice(index + 1, 0, cloned);
    handleUpdateScene('dialogues', list);
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
      text: 'Quyết sách chiến thuật mới',
      tag: 'QUYẾT SÁCH',
      description: 'Mô tả hành động của kế sách này...',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in select-none">
      <div className="wood-panel-solid w-full max-w-7xl h-[94vh] flex flex-col rounded-2xl overflow-hidden border-2 border-[#5c4028] shadow-2xl">
        {/* Top Header */}
        <div className="bg-[#1b140e] px-4 sm:px-6 py-3 border-b-2 border-[#4a3525] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg btn-material-bronze flex items-center justify-center text-amber-200 font-bold shadow-inner">
              🛠️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-200 tracking-wide flex items-center gap-2">
                Trình Soạn Thảo Màn Chơi Toàn Năng
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">
                  ☁️ Cloudinary Enabled
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Đang chỉnh sửa: <span className="text-amber-400 font-bold">{formData.title}</span> ({formData.id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlaytest(formData)}
              className="btn-material-iron text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-stone-200 hover:text-white cursor-pointer"
              title="Chạy thử nghiệm màn chơi ngay"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Chơi Thử</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-material-bronze text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Màn Chơi</span>
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

        {/* Navigation Tabs Bar */}
        <div className="bg-[#140e0a] px-4 py-2 border-b border-[#3d2a1c] flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('scenes')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'scenes'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Phân Cảnh & Lời Thoại ({Object.keys(formData.scenes).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('choices')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'choices'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Quyết Sách Rẽ Nhánh</span>
            </button>

            <button
              onClick={() => setActiveTab('endings')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'endings'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Kết Cục & Xếp Hạng</span>
            </button>

            <button
              onClick={() => setActiveTab('characters')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'characters'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Tướng Lĩnh ({Object.keys(formData.characters).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>5. Bối Cảnh Chung</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-500 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#241810]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>6. Sa Bàn Sơ Đồ</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400 hidden md:block">
            Mọi hình ảnh & audio được tải lên Cloudinary CDN tốc độ cao
          </span>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0805]">
          {/* TAB 1: PHÂN CẢNH & LỜI THOẠI (CORE WORKFLOW) */}
          {activeTab === 'scenes' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto">
              {/* Scene List Sidebar (4 cols) */}
              <div className="md:col-span-4 card-solid-dark p-3 rounded-xl border border-[#4a3525] space-y-3 flex flex-col max-h-[75vh]">
                <div className="flex items-center justify-between pb-2 border-b border-[#3d2a1c]">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Danh Sách Cảnh ({Object.keys(formData.scenes).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddScene()}
                    className="btn-material-bronze text-[11px] px-2.5 py-1 rounded flex items-center gap-1 text-amber-100 font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Thêm Cảnh</span>
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                  {Object.values(formData.scenes).map((s, idx) => {
                    const isSelected = selectedSceneId === s.id;
                    const isStart = s.id === formData.initialSceneId;

                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSceneId(s.id)}
                        className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2b1c12] border-amber-500 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-[#150f0a] border-[#3d2a1c] hover:border-amber-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-stone-100 truncate flex-1">
                            {idx + 1}. {s.title}
                          </span>
                          {isStart && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-950 text-amber-200 rounded border border-amber-600 font-bold">
                              START
                            </span>
                          )}
                          {s.isEnding && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-200 rounded border border-emerald-600 font-bold">
                              END
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span>{s.chapter}</span>
                          <span>{s.dialogues.length} thoại • {s.choices?.length || 0} nhánh</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scene Detail & Dialogues Editor (8 cols) */}
              {currentScene ? (
                <div className="md:col-span-8 card-solid-dark p-4 sm:p-5 rounded-xl border border-[#4a3525] space-y-5">
                  {/* Scene Settings Header */}
                  <div className="bg-[#160f0a] p-3.5 rounded-lg border border-[#3d2a1c] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-amber-400" />
                        Thiết Lập Phân Cảnh ({currentScene.id})
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicateScene(currentScene.id)}
                          className="text-[11px] px-2 py-1 bg-[#241810] text-stone-300 hover:text-sky-300 rounded border border-[#4a3525] flex items-center gap-1 cursor-pointer"
                          title="Nhân bản phân cảnh này"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Nhân bản</span>
                        </button>
                        {currentScene.id !== formData.initialSceneId && (
                          <button
                            type="button"
                            onClick={() => handleDeleteScene(currentScene.id)}
                            className="text-[11px] px-2 py-1 bg-red-950/80 text-red-300 hover:bg-red-900 rounded border border-red-800 flex items-center gap-1 cursor-pointer"
                            title="Xóa phân cảnh này"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa cảnh</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-stone-300 font-medium block mb-1">Tiêu Đề Cảnh</label>
                        <input
                          type="text"
                          value={currentScene.title}
                          onChange={(e) => handleUpdateScene('title', e.target.value)}
                          className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-300 font-medium block mb-1">Hồi / Chương</label>
                        <input
                          type="text"
                          value={currentScene.chapter}
                          onChange={(e) => handleUpdateScene('chapter', e.target.value)}
                          className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-stone-300 font-medium block mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Thời Điểm
                        </label>
                        <input
                          type="text"
                          value={currentScene.timeOfDay}
                          onChange={(e) => handleUpdateScene('timeOfDay', e.target.value)}
                          placeholder="Đêm khuya / Bình minh..."
                          className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-300 font-medium block mb-1 flex items-center gap-1">
                          <Waves className="w-3 h-3 text-amber-400" />
                          Mực Nước Thủy Triều
                        </label>
                        <select
                          value={currentScene.tideState || 'neutral'}
                          onChange={(e) => handleUpdateScene('tideState', e.target.value as any)}
                          className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525]"
                        >
                          <option value="neutral">Nước Đứng (Bình Hoà)</option>
                          <option value="high">Triều Cường (Nước Ngập Cọc)</option>
                          <option value="falling">Triều Rút Gấp (Cọc Nhô Lên)</option>
                          <option value="low">Triều Kiệt (Lộ Đáy Sông)</option>
                          <option value="rising">Triều Dâng</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-300 font-medium block mb-1">Cảnh Khởi Đầu Game?</label>
                        <button
                          type="button"
                          onClick={() => updateField('initialSceneId', currentScene.id)}
                          className={`w-full py-2 px-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                            formData.initialSceneId === currentScene.id
                              ? 'bg-amber-800 text-amber-100 border-amber-500'
                              : 'bg-[#100b07] text-stone-400 border-[#4a3525] hover:text-stone-200'
                          }`}
                        >
                          {formData.initialSceneId === currentScene.id ? '✓ Đang là cảnh mở đầu' : 'Đặt làm cảnh mở đầu'}
                        </button>
                      </div>
                    </div>

                    {/* Scene Background Uploader */}
                    <AssetUploader
                      label="Hình Nền Phân Cảnh (Background Scene)"
                      acceptType="image"
                      value={currentScene.customBackgroundUrl || currentScene.background}
                      onChange={(val) => {
                        handleUpdateScene('customBackgroundUrl', val);
                        handleUpdateScene('background', val);
                      }}
                      presetOptions={BACKGROUND_PRESETS}
                      placeholder="Tải ảnh lên Cloudinary hoặc chọn ảnh mẫu..."
                    />
                  </div>

                  {/* Storyboard Dialogue Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#3d2a1c]">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        Dòng Chảy Lời Thoại ({currentScene.dialogues.length} câu)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddDialogue}
                        className="btn-material-bronze text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Thêm Câu Thoại</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                      {currentScene.dialogues.map((diag, dIdx) => {
                        const speakerChar = formData.characters[diag.speaker] || formData.characters.narrator;

                        return (
                          <div
                            key={diag.id || dIdx}
                            className="bg-[#140e0a] p-3.5 rounded-xl border border-[#3d2a1c] space-y-3 transition-all hover:border-amber-700/80 group"
                          >
                            {/* Dialogue Header */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 text-xs font-bold flex items-center justify-center border border-amber-700">
                                  {dIdx + 1}
                                </span>

                                {/* Speaker Selector with Avatar */}
                                <div className="flex items-center gap-1.5 bg-[#1c130d] px-2 py-1 rounded border border-[#4a3525]">
                                  {speakerChar?.avatar && (
                                    <img
                                      src={speakerChar.avatar}
                                      alt={speakerChar.name}
                                      className="w-5 h-5 rounded object-cover border border-[#5c4028]"
                                    />
                                  )}
                                  <select
                                    value={diag.speaker}
                                    onChange={(e) => handleUpdateDialogue(dIdx, { speaker: e.target.value })}
                                    className="bg-transparent text-amber-200 text-xs font-bold focus:outline-none cursor-pointer"
                                  >
                                    {Object.values(formData.characters).map((c) => (
                                      <option key={c.id} value={c.id} className="bg-[#1c130d] text-stone-200">
                                        {c.name} ({c.title || c.faction})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Emotion Selector */}
                                <select
                                  value={diag.emotion || 'normal'}
                                  onChange={(e) => handleUpdateDialogue(dIdx, { emotion: e.target.value as any })}
                                  className="bg-[#1c130d] text-stone-300 text-xs px-2 py-1 rounded border border-[#4a3525]"
                                >
                                  <option value="normal">Nét mặt: Bình thường</option>
                                  <option value="confident">Nét mặt: Tự tin / Hào hùng</option>
                                  <option value="intense">Nét mặt: Kịch tính / Khẩn trương</option>
                                  <option value="angry">Nét mặt: Uy nghiêm / Phẫn nộ</option>
                                  <option value="triumphant">Nét mặt: Khải hoàn / Thắng lợi</option>
                                </select>
                              </div>

                              {/* Dialogue Action Toolbar */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={dIdx === 0}
                                  onClick={() => handleMoveDialogue(dIdx, 'up')}
                                  className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-20 cursor-pointer"
                                  title="Di chuyển lên trước"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={dIdx === currentScene.dialogues.length - 1}
                                  onClick={() => handleMoveDialogue(dIdx, 'down')}
                                  className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-20 cursor-pointer"
                                  title="Di chuyển xuống sau"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateDialogue(dIdx)}
                                  className="p-1 text-stone-400 hover:text-sky-300 cursor-pointer"
                                  title="Nhân bản câu thoại này"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDialogue(dIdx)}
                                  className="p-1 text-stone-400 hover:text-red-400 cursor-pointer"
                                  title="Xóa câu thoại này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Dialogue Textarea */}
                            <textarea
                              rows={2}
                              value={diag.text}
                              onChange={(e) => handleUpdateDialogue(dIdx, { text: e.target.value })}
                              placeholder="Nhập nội dung lời thoại nhân vật..."
                              className="w-full bg-[#0d0906] text-stone-100 text-xs px-3 py-2.5 rounded-lg border border-[#4a3525] focus:outline-none focus:border-amber-500 leading-relaxed"
                            />

                            {/* SFX, BGM & Cloudinary Voice Audio */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                              <div>
                                <label className="text-stone-400 block mb-1 text-[11px]">Hiệu ứng Âm thanh (SFX):</label>
                                <select
                                  value={diag.soundEffect || ''}
                                  onChange={(e) => handleUpdateDialogue(dIdx, { soundEffect: e.target.value || undefined })}
                                  className="w-full bg-[#1b140e] text-stone-300 text-xs px-2.5 py-1.5 rounded border border-[#3d2a1c]"
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
                                <label className="text-stone-400 block mb-1 text-[11px]">Nhạc nền (BGM):</label>
                                <select
                                  value={diag.bgm || ''}
                                  onChange={(e) => handleUpdateDialogue(dIdx, { bgm: e.target.value || undefined })}
                                  className="w-full bg-[#1b140e] text-stone-300 text-xs px-2.5 py-1.5 rounded border border-[#3d2a1c]"
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
                                  label="Audio Giọng Đọc (MP3/WAV)"
                                  acceptType="audio"
                                  value={diag.customVoiceUrl || ''}
                                  onChange={(val) => handleUpdateDialogue(dIdx, { customVoiceUrl: val || undefined })}
                                  placeholder="Tải MP3 lên Cloudinary..."
                                  compact
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-8 flex items-center justify-center p-12 text-stone-500">
                  Vui lòng chọn hoặc tạo phân cảnh mới từ cột danh sách bên trái.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUYẾT SÁCH RẼ NHÁNH (CHOICES) */}
          {activeTab === 'choices' && currentScene && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="card-solid-dark p-5 rounded-xl border border-[#4a3525] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      Quyết Sách Cho Cảnh: {currentScene.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Sau khi đọc hết lời thoại ở cảnh này, người chơi sẽ thấy các ngã rẽ chiến thuật dưới đây.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddChoice}
                    className="btn-material-bronze text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm Quyết Sách</span>
                  </button>
                </div>

                {(!currentScene.choices || currentScene.choices.length === 0) && (
                  <div className="text-center py-10 text-stone-400 space-y-2 bg-[#120c08] rounded-xl border border-[#3d2a1c]">
                    <p className="text-xs font-bold text-amber-400">Chưa có lựa chọn nào cho phân cảnh này.</p>
                    <p className="text-[11px] text-stone-500">
                      Nếu cảnh này là Kết Cục (Ending), hãy chuyển sang Tab 3 để thiết lập xếp hạng chiến thắng.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {currentScene.choices?.map((choice, cIdx) => (
                    <div
                      key={choice.id || cIdx}
                      className="bg-[#140e0a] p-4 rounded-xl border-2 border-[#4a3525] space-y-3 relative hover:border-amber-600 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#3d2a1c] pb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Quyết Sách #{cIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChoice(cIdx)}
                          className="text-stone-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Xóa lựa chọn này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-stone-300 font-medium block mb-1">Tiêu Đề Lựa Chọn</label>
                          <input
                            type="text"
                            value={choice.text}
                            onChange={(e) => handleUpdateChoice(cIdx, { text: e.target.value })}
                            placeholder="Ví dụ: Kế Sách Bãi Cọc Ngầm"
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c] font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-stone-300 font-medium block mb-1">Thẻ Gợi Ý (Tag)</label>
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
                        <label className="text-xs text-stone-300 font-medium block mb-1">Mô Tả Kế Sách</label>
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
                          <label className="text-xs text-stone-300 font-medium block mb-1">
                            Chuyển Tới Phân Cảnh (Next Scene)
                          </label>
                          <select
                            value={choice.nextSceneId}
                            onChange={(e) => handleUpdateChoice(cIdx, { nextSceneId: e.target.value })}
                            className="w-full bg-[#100b07] text-amber-300 text-xs px-2.5 py-2 rounded border border-[#3d2a1c] font-bold"
                          >
                            {Object.values(formData.scenes).map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title} ({s.id})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-stone-300 font-medium block mb-1">Thay Đổi Nhuệ Khí (+/-)</label>
                          <input
                            type="number"
                            value={choice.moraleChange ?? 10}
                            onChange={(e) => handleUpdateChoice(cIdx, { moraleChange: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#100b07] text-stone-100 text-xs px-3 py-2 rounded border border-[#3d2a1c]"
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
                          <label className="text-xs text-amber-300 font-medium block mb-1">
                            Lý Giải Binh Pháp Lịch Sử (Hiển thị cho học viên khi bật Chế Độ Học Tập)
                          </label>
                          <textarea
                            rows={2}
                            value={choice.historicalReason || ''}
                            onChange={(e) => handleUpdateChoice(cIdx, { historicalReason: e.target.value })}
                            placeholder="Giải thích vì sao kế sách này là tối ưu trong lịch sử..."
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

          {/* TAB 3: KẾT CỤC & XẾP HẠNG (ENDINGS) */}
          {activeTab === 'endings' && currentScene && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="card-solid-dark p-5 rounded-xl border border-[#4a3525] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Thiết Lập Kết Cục: {currentScene.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Đánh dấu cảnh này là kết thúc câu chuyện để vinh danh chiến công và xếp hạng binh pháp.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-amber-200 font-bold bg-[#1e150f] px-3.5 py-2 rounded-lg border border-amber-600 cursor-pointer shadow-md">
                    <input
                      type="checkbox"
                      checked={currentScene.isEnding || false}
                      onChange={(e) => handleUpdateScene('isEnding', e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Đây Là Cảnh Kết Cục</span>
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
                          className="w-full bg-[#150f0a] text-stone-100 text-xs px-3 py-2.5 rounded-lg border border-[#4a3525]"
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
                          className="w-full bg-[#150f0a] text-amber-300 font-bold text-xs px-3 py-2.5 rounded-lg border border-[#4a3525]"
                        >
                          <option value="S+">Hạng S+ (Thần Cơ Diệu Toán - Tối Thượng)</option>
                          <option value="S">Hạng S (Xuất Sắc)</option>
                          <option value="A+">Hạng A+ (Dũng Cảm Kiên Cường)</option>
                          <option value="A">Hạng A (Chiến Thắng)</option>
                          <option value="B+">Hạng B+ (Khá)</option>
                          <option value="B">Hạng B (Trung Bình)</option>
                          <option value="C">Hạng C (Tổn Thất Nặng)</option>
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
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3.5 py-2.5 rounded-lg border border-[#4a3525] font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tiêu Đề Kết Cục (Ending Title)</label>
                      <input
                        type="text"
                        value={currentScene.endingTitle || ''}
                        onChange={(e) => handleUpdateScene('endingTitle', e.target.value)}
                        placeholder="Ví dụ: THIÊN THU ĐẠI THẮNG BẠCH ĐẰNG GIANG"
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3.5 py-2.5 rounded-lg border border-[#4a3525] font-bold text-amber-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tổng Kết Chiến Tích Lịch Sử</label>
                      <textarea
                        rows={4}
                        value={currentScene.endingSummary || ''}
                        onChange={(e) => handleUpdateScene('endingSummary', e.target.value)}
                        placeholder="Đánh giá chiến công oanh liệt, bài học quân sự ghi danh ngàn đời..."
                        className="w-full bg-[#150f0a] text-stone-100 text-xs px-3.5 py-2.5 rounded-lg border border-[#4a3525] leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500 text-xs">
                    Phân cảnh này hiện đang là phân cảnh thông thường. Hãy tích chọn ô phía trên nếu đây là một trong các kết thúc của chiến dịch.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TƯỚNG LĨNH & NHÂN VẬT (CHARACTERS) */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="card-solid-dark p-3.5 rounded-xl border border-[#4a3525] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3d2a1c]">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Danh Sách Tướng ({Object.keys(formData.characters).length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    className="btn-material-bronze text-[11px] px-2.5 py-1 rounded flex items-center gap-1 text-amber-100 font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Tướng</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {Object.values(formData.characters).map((c) => {
                    const isSelected = selectedCharId === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCharId(c.id)}
                        className={`p-2 rounded-lg border-2 cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#2b1c12] border-amber-500 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-[#150f0a] border-[#3d2a1c] hover:border-amber-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img
                            src={c.avatar || '/assets/images/characters/ngo_quyen.jpg'}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#5c4028] shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold text-stone-100 truncate">{c.name}</p>
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
                    );
                  })}
                </div>
              </div>

              {/* Character Details Column */}
              {currentCharacter && (
                <div className="md:col-span-2 card-solid-dark p-5 rounded-xl border border-[#4a3525] space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider border-b border-[#3d2a1c] pb-2">
                    Chi Tiết Tướng Lĩnh: {currentCharacter.name} ({currentCharacter.id})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Tên Danh Xưng</label>
                      <input
                        type="text"
                        value={currentCharacter.name}
                        onChange={(e) => handleUpdateCharacter('name', e.target.value)}
                        placeholder="Ví dụ: Ngô Quyền"
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525] font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Chức Vụ / Danh Hiệu</label>
                      <input
                        type="text"
                        value={currentCharacter.title}
                        onChange={(e) => handleUpdateCharacter('title', e.target.value)}
                        placeholder="Ví dụ: Tiết Độ Sứ • Tiền Ngô Vương"
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Phe Phái (Faction)</label>
                      <select
                        value={currentCharacter.faction}
                        onChange={(e) => handleUpdateCharacter('faction', e.target.value as any)}
                        className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2 rounded border border-[#4a3525]"
                      >
                        <option value="viet">Đại Việt / Nghĩa Quân (Đỏ)</option>
                        <option value="han">Quân Nam Hán (Vàng/Cam)</option>
                        <option value="minh">Quân Nhà Minh (Vàng/Cam)</option>
                        <option value="enemy">Quân Địch Xâm Lược (Cam)</option>
                        <option value="neutral">Dẫn Chuyện / Sử Ký (Trung Lập)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-stone-300 font-medium block mb-1">Màu Sắc Đại Diện</label>
                      <input
                        type="color"
                        value={currentCharacter.themeColor || '#e11d48'}
                        onChange={(e) => handleUpdateCharacter('themeColor', e.target.value)}
                        className="w-full h-9 bg-[#1b140e] rounded border border-[#4a3525] cursor-pointer"
                      />
                    </div>
                  </div>

                  <AssetUploader
                    label="Ảnh Đại Diện Avatar (Tải lên Cloudinary)"
                    acceptType="image"
                    value={currentCharacter.avatar}
                    onChange={(val) => handleUpdateCharacter('avatar', val)}
                    placeholder="Tải ảnh chân dung lên Cloudinary..."
                  />

                  <AssetUploader
                    label="Ảnh Toàn Thân Sprite Đứng (Tải lên Cloudinary)"
                    acceptType="image"
                    value={currentCharacter.fullImage}
                    onChange={(val) => handleUpdateCharacter('fullImage', val)}
                    placeholder="Tải sprite đứng toàn thân lên Cloudinary..."
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BỐI CẢNH CHUNG (GENERAL) */}
          {activeTab === 'general' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="card-solid-dark p-5 rounded-xl border border-[#4a3525] space-y-4">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-[#3d2a1c] pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Tổng Quan Thông Tin Màn Chơi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Tên Màn Chơi</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Ví dụ: Đại Thắng Bạch Đằng 938"
                      className="w-full bg-[#1b140e] text-stone-100 text-sm px-3.5 py-2.5 rounded border border-[#4a3525] font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Niên Đại Lịch Sử</label>
                    <input
                      type="text"
                      value={formData.era}
                      onChange={(e) => updateField('era', e.target.value)}
                      placeholder="Ví dụ: Năm 938 SCN • Thời Tiền Ngô Vương"
                      className="w-full bg-[#1b140e] text-stone-100 text-sm px-3.5 py-2.5 rounded border border-[#4a3525] font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Khẩu Hiệu / Phụ Đề</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="Ví dụ: Trận Thủy Chiến Định Đoạt Vận Mệnh Nghìn Năm Độc Lập"
                    className="w-full bg-[#1b140e] text-stone-100 text-xs px-3.5 py-2.5 rounded border border-[#4a3525]"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">Tóm Tắt Bối Cảnh Lịch Sử</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Mô tả bối cảnh quân sự, ý nghĩa lịch sử của chiến dịch..."
                    className="w-full bg-[#1b140e] text-stone-100 text-xs px-3.5 py-2.5 rounded border border-[#4a3525] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Độ Khó</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => updateField('difficulty', e.target.value as any)}
                      className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2.5 rounded border border-[#4a3525]"
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
                      className="w-full bg-[#1b140e] text-stone-100 text-xs px-3 py-2.5 rounded border border-[#4a3525]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-1">Cảnh Mở Đầu Game</label>
                    <select
                      value={formData.initialSceneId}
                      onChange={(e) => updateField('initialSceneId', e.target.value)}
                      className="w-full bg-[#1b140e] text-amber-300 text-xs px-3 py-2.5 rounded border border-[#4a3525] font-bold"
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
                  placeholder="Tải ảnh bìa lên Cloudinary..."
                />
              </div>
            </div>
          )}

          {/* TAB 6: SA BÀN SƠ ĐỒ (VISUAL MAP) */}
          {activeTab === 'map' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="card-solid-dark p-5 rounded-xl border border-[#4a3525] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d2a1c] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-amber-400" />
                      Sa Bàn Mạch Truyện & Cây Phân Nhánh
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Bấm vào bất kỳ phân cảnh nào dưới đây để chuyển nhanh sang chỉnh sửa cảnh đó.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {Object.values(formData.scenes).map((sc, idx) => {
                    const isStart = sc.id === formData.initialSceneId;

                    return (
                      <div
                        key={sc.id}
                        onClick={() => {
                          setSelectedSceneId(sc.id);
                          setActiveTab('scenes');
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                          selectedSceneId === sc.id
                            ? 'bg-[#2b1c12] border-amber-500 shadow-xl'
                            : 'bg-[#150f0a] border-[#3d2a1c] hover:border-amber-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                              {sc.chapter || `Cảnh #${idx + 1}`}
                            </span>
                            {isStart && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-900 text-amber-200 font-bold border border-amber-600">
                                KHỞI ĐẦU
                              </span>
                            )}
                            {sc.isEnding && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600">
                                KẾT CỤC ({sc.endingRank || 'S'})
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-stone-100 line-clamp-1">
                            {sc.title}
                          </h4>

                          <p className="text-[11px] text-stone-400">
                            {sc.dialogues.length} câu thoại • {sc.timeOfDay}
                          </p>
                        </div>

                        {/* Choices preview */}
                        <div className="pt-3 mt-2 border-t border-[#3d2a1c] space-y-1">
                          <span className="text-[10px] font-bold text-stone-500 uppercase block">
                            Các ngã rẽ ({sc.choices?.length || 0}):
                          </span>
                          {sc.choices && sc.choices.length > 0 ? (
                            sc.choices.map((c) => (
                              <div key={c.id} className="text-[10px] text-amber-300/90 truncate flex items-center gap-1">
                                <span>↳</span>
                                <span className="truncate">{c.text}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-stone-600 italic">
                              {sc.isEnding ? '🏁 Điểm kết thúc chiến dịch' : '➡️ Tuyến tính'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
