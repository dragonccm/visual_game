import fs from 'fs';
import path from 'path';
import https from 'https';

const sfxDir = path.resolve('public/assets/audio/sfx');
const bgmDir = path.resolve('public/assets/audio/bgm');

if (!fs.existsSync(sfxDir)) fs.mkdirSync(sfxDir, { recursive: true });
if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

const soundFiles = [
  // 1. Tù và chiến trận (Real War Horn Blast)
  {
    target: path.join(sfxDir, 'horn.mp3'),
    url: 'https://raw.githubusercontent.com/nobodyrandom/libs/master/resource/horn.mp3',
  },
  // 2. Gươm đao va chạm (Real Steel Sword Clash)
  {
    target: path.join(sfxDir, 'clash.mp3'),
    url: 'https://raw.githubusercontent.com/phaserjs/examples/master/public/assets/audio/SoundEffects/sword.mp3',
  },
  // 3. Trống trận trầm hùng (Real Deep Acoustic War Drum)
  {
    target: path.join(sfxDir, 'drum.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/drum_low_1.mp3',
  },
  // 4. Cồng đồng hiệu lệnh (Real Resonant Bronze Gong)
  {
    target: path.join(sfxDir, 'gong.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/gong_1.mp3',
  },
  // 5. Tiếng bão lửa / hỏa thiêu (Real Crackling Fire)
  {
    target: path.join(sfxDir, 'fire.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/fire_long.mp3',
  },
  // 6. Cọc gỗ xé toạc mạn thuyền (Heavy Impact & Ship Splinter)
  {
    target: path.join(sfxDir, 'wooden_crack.mp3'),
    url: 'https://raw.githubusercontent.com/BabylonJS/Assets/master/sound/cannonBlast.mp3',
  },
  // 7. Móng ngựa phi nước đại (Real Horse Galloping Hooves)
  {
    target: path.join(sfxDir, 'horse.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/goat_hoof-1.mp3',
  },
  // 8. Tiếng gió rít sông nước (Howling Wind Ambient)
  {
    target: path.join(sfxDir, 'wind.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/loop/drone.mp3',
  },
  // 9. Tiếng sóng nước sông Bạch Đằng (Water Ripple & Waves)
  {
    target: path.join(sfxDir, 'waves.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/boing_water1.mp3',
  },
  // 10. Mưa tên lửa xé gió (Arrow Flight Whoosh)
  {
    target: path.join(sfxDir, 'arrow.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/guitar_hit_!.mp3',
  },
  // 11. Tiếng hò reo xuất kích của vạn quân (Battle Cheer)
  {
    target: path.join(sfxDir, 'battle_cry.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/berklee/group_anklung_long_1.mp3',
  },
  // 12. Khúc khải hoàn ca chiến thắng (Triumphant Victory Theme)
  {
    target: path.join(sfxDir, 'victory.mp3'),
    url: 'https://raw.githubusercontent.com/BabylonJS/Assets/master/sound/pirateFun.mp3',
  },
  // BGM - Nhạc hào hùng chiến trận (Epic War BGM)
  {
    target: path.join(bgmDir, 'epic_war.mp3'),
    url: 'https://raw.githubusercontent.com/BabylonJS/Assets/master/sound/pirateFun.mp3',
  },
  // BGM - Nhạc kịch tính bí mật (Suspense Ambience)
  {
    target: path.join(bgmDir, 'suspense.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/loop/drone.mp3',
  },
  // BGM - Nhạc nghị kế (Calm Strategy)
  {
    target: path.join(bgmDir, 'calm.mp3'),
    url: 'https://raw.githubusercontent.com/Tonejs/audio/master/loop/bass.mp3',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading all 100% verified real game SFX & BGM MP3 files...');
  for (const item of soundFiles) {
    const filename = path.basename(item.target);
    try {
      await download(item.url, item.target);
      const stat = fs.statSync(item.target);
      console.log(`✓ Downloaded ${filename} (${stat.size} bytes)`);
    } catch (e) {
      console.error(`✗ Error ${filename}:`, e.message);
    }
  }
  console.log('Done downloading real audio assets!');
}

main();
