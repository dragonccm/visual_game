import { CharacterId, CharacterInfo } from '../types/game';

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  ngo_quyen: {
    id: 'ngo_quyen',
    name: 'Ngô Quyền',
    title: 'Tiết Độ Sứ • Tiền Ngô Vương',
    faction: 'viet',
    avatar: '/assets/images/characters/ngo_quyen.jpg',
    fullImage: '/assets/images/characters/ngo_quyen.jpg',
    themeColor: '#e11d48', // red-600
  },
  nguyen_tat_to: {
    id: 'nguyen_tat_to',
    name: 'Nguyễn Tất Tố',
    title: 'Tướng Tiên Phong Thủy Quân',
    faction: 'viet',
    avatar: '/assets/images/characters/nguyen_tat_to.jpg',
    fullImage: '/assets/images/characters/nguyen_tat_to.jpg',
    themeColor: '#0284c7', // sky-600
  },
  hoang_thao: {
    id: 'hoang_thao',
    name: 'Lưu Hoằng Tháo',
    title: 'Vạn Vương Nam Hán • Thống Soái Xâm Lược',
    faction: 'han',
    avatar: '/assets/images/characters/hoang_thao.jpg',
    fullImage: '/assets/images/characters/hoang_thao.jpg',
    themeColor: '#ca8a04', // yellow-600
  },
  soldier: {
    id: 'soldier',
    name: 'Tướng Sĩ Đại Việt',
    title: 'Quân Dân Sát Cánh',
    faction: 'viet',
    avatar: '/assets/images/characters/nguyen_tat_to.jpg',
    fullImage: '/assets/images/characters/nguyen_tat_to.jpg',
    themeColor: '#16a34a', // green-600
  },
  narrator: {
    id: 'narrator',
    name: 'Sử Ký',
    title: 'Người Dẫn Chuyện Lịch Sử',
    faction: 'neutral',
    avatar: '/assets/images/scenes/war_tent.jpg',
    fullImage: '/assets/images/scenes/war_tent.jpg',
    themeColor: '#d97706', // amber-600
  },
};
