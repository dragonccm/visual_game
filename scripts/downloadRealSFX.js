import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const sfxDir = path.resolve('public/assets/audio/sfx');
const bgmDir = path.resolve('public/assets/audio/bgm');

if (!fs.existsSync(sfxDir)) fs.mkdirSync(sfxDir, { recursive: true });
if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

// High quality authentic royalty-free audio sources (CC0 / Public Domain / Open Game Audio)
const audioSources = [
  // SFX
  {
    target: path.join(sfxDir, 'horn.mp3'),
    url: 'https://raw.githubusercontent.com/nobodyrandom/libs/master/resource/horn.mp3',
  },
  {
    target: path.join(sfxDir, 'clash.mp3'),
    url: 'https://raw.githubusercontent.com/nguoianphu/phaser-sound-complete-phonegap/master/www/assets/audio/SoundEffects/sword.mp3',
  },
  {
    target: path.join(sfxDir, 'drum.mp3'),
    url: 'https://cdn.freesound.org/previews/209/209992_321967-lq.mp3', // War drum cadence
  },
  {
    target: path.join(sfxDir, 'fire.mp3'),
    url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3', // Roaring fire
  },
  {
    target: path.join(sfxDir, 'wind.mp3'),
    url: 'https://cdn.freesound.org/previews/442/442900_9159316-lq.mp3', // Howling stormy wind
  },
  {
    target: path.join(sfxDir, 'waves.mp3'),
    url: 'https://cdn.freesound.org/previews/512/512130_6142149-lq.mp3', // Ocean and river waves
  },
  {
    target: path.join(sfxDir, 'horse.mp3'),
    url: 'https://cdn.freesound.org/previews/386/386036_7255534-lq.mp3', // Horse gallop
  },
  {
    target: path.join(sfxDir, 'arrow.mp3'),
    url: 'https://cdn.freesound.org/previews/218/218088_3905081-lq.mp3', // Arrow whoosh
  },
  {
    target: path.join(sfxDir, 'wooden_crack.mp3'),
    url: 'https://cdn.freesound.org/previews/140/140773_2538032-lq.mp3', // Wood cracking & breaking
  },
  {
    target: path.join(sfxDir, 'gong.mp3'),
    url: 'https://cdn.freesound.org/previews/163/163456_2704381-lq.mp3', // Resonant bronze gong
  },
  {
    target: path.join(sfxDir, 'battle_cry.mp3'),
    url: 'https://cdn.freesound.org/previews/458/458867_9497060-lq.mp3', // Soldiers war cheer
  },
  {
    target: path.join(sfxDir, 'victory.mp3'),
    url: 'https://cdn.freesound.org/previews/274/274178_5121236-lq.mp3', // Victory fanfare
  },

  // BGM
  {
    target: path.join(bgmDir, 'epic_war.mp3'),
    url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3', // Epic battle music
  },
  {
    target: path.join(bgmDir, 'suspense.mp3'),
    url: 'https://cdn.freesound.org/previews/530/530664_11504938-lq.mp3', // Suspense tension music
  },
  {
    target: path.join(bgmDir, 'calm.mp3'),
    url: 'https://cdn.freesound.org/previews/563/563820_11861866-lq.mp3', // Calm ancient music
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, (response) => {
      // Handle redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  console.log('Downloading real authentic game SFX and BGM assets...');
  for (const item of audioSources) {
    const filename = path.basename(item.target);
    try {
      await downloadFile(item.url, item.target);
      const stat = fs.statSync(item.target);
      console.log(`✓ Downloaded ${filename} (${stat.size} bytes)`);
    } catch (err) {
      console.error(`✗ Error downloading ${filename}:`, err.message);
    }
  }
  console.log('All real sound effect assets downloaded successfully!');
}

start();
