import fs from 'fs';
import path from 'path';

const tomMusicBase = path.resolve('Free Fantasy SFX Pack By TomMusic/OGG Files');
const sfxDest = path.resolve('public/assets/audio/sfx');
const bgmDest = path.resolve('public/assets/audio/bgm');

if (!fs.existsSync(sfxDest)) fs.mkdirSync(sfxDest, { recursive: true });
if (!fs.existsSync(bgmDest)) fs.mkdirSync(bgmDest, { recursive: true });

// Mapping from TomMusic pack to Game SFX & BGM
const sfxMapping = [
  // Gươm đao cận chiến
  {
    src: 'SFX/Attacks/Sword Attacks Hits and Blocks/Sword Impact Hit 1.ogg',
    destNames: ['clash.ogg', 'clash.mp3'],
  },
  // Bắn cung / Tên lửa xé gió
  {
    src: 'SFX/Attacks/Bow Attacks Hits and Blocks/Bow Attack 1.ogg',
    destNames: ['arrow.ogg', 'arrow.mp3'],
  },
  // Hỏa công / Lửa bùng cháy
  {
    src: 'SFX/Torch/Torch Loop.ogg',
    destNames: ['fire.ogg', 'fire.mp3'],
  },
  // Sóng nước sông Bạch Đằng / Thủy triều
  {
    src: 'BGS Loops/Sea/Sea.ogg',
    destNames: ['waves.ogg', 'waves.mp3'],
  },
  // Gió bão sông nước
  {
    src: 'BGS Loops/Sea/Sea Storm.ogg',
    destNames: ['wind.ogg', 'wind.mp3'],
  },
  // Đóng cọc lim / Cọc đâm toạc mạn thuyền
  {
    src: 'SFX/Spells/Rock Wall 1.ogg',
    destNames: ['wooden_crack.ogg', 'wooden_crack.mp3'],
  },
  // Cồng lệnh hiệu triệu
  {
    src: 'SFX/Spells/Wave Attack 1.ogg',
    destNames: ['gong.ogg', 'gong.mp3'],
  },
  // Tù và xuất trận
  {
    src: 'SFX/Spells/Wave Attack 2.ogg',
    destNames: ['horn.ogg', 'horn.mp3'],
  },
  // Trống trận thúc giục
  {
    src: 'SFX/Spells/Rock Meteor Throw 1.ogg',
    destNames: ['drum.ogg', 'drum.mp3'],
  },
  // Tướng sĩ hò reo / Lội sông xuất kích
  {
    src: 'SFX/Footsteps/Water/Water Run 1.ogg',
    destNames: ['battle_cry.ogg', 'battle_cry.mp3'],
  },
  // Khúc khải hoàn / Hào khí ngút trời
  {
    src: 'SFX/Spells/Firebuff 1.ogg',
    destNames: ['victory.ogg', 'victory.mp3'],
  },
];

const bgmMapping = [
  // Nhạc nền đại chiến Bạch Đằng
  {
    src: 'BGS Loops/Sea/Sea Storm.ogg',
    destNames: ['epic_war.ogg', 'epic_war.mp3'],
  },
  // Nhạc nền căng thẳng phục kích đêm
  {
    src: 'BGS Loops/Forest Night/Forest Night.ogg',
    destNames: ['suspense.ogg', 'suspense.mp3'],
  },
  // Nhạc nền trầm tư nghị kế trong lều
  {
    src: 'BGS Loops/Sea/Sea.ogg',
    destNames: ['calm.ogg', 'calm.mp3'],
  },
];

console.log('Copying high quality authentic SFX from Free Fantasy SFX Pack By TomMusic...');

for (const item of sfxMapping) {
  const srcPath = path.join(tomMusicBase, item.src);
  if (fs.existsSync(srcPath)) {
    for (const dName of item.destNames) {
      const destPath = path.join(sfxDest, dName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${item.src} -> sfx/${dName}`);
    }
  } else {
    console.error(`✗ Missing source file: ${srcPath}`);
  }
}

for (const item of bgmMapping) {
  const srcPath = path.join(tomMusicBase, item.src);
  if (fs.existsSync(srcPath)) {
    for (const dName of item.destNames) {
      const destPath = path.join(bgmDest, dName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${item.src} -> bgm/${dName}`);
    }
  } else {
    console.error(`✗ Missing source file: ${srcPath}`);
  }
}

console.log('Done copying all audio assets from TomMusic SFX Pack!');
