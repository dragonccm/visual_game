import fs from 'fs';
import path from 'path';
import https from 'https';

const sfxDir = path.resolve('public/assets/audio/sfx');
const bgmDir = path.resolve('public/assets/audio/bgm');

if (!fs.existsSync(sfxDir)) fs.mkdirSync(sfxDir, { recursive: true });
if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'HistoryGameAudioDownloader/1.0 (contact@example.com)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = https;
    client.get(url, { headers: { 'User-Agent': 'HistoryGameAudioDownloader/1.0 (contact@example.com)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Status ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', reject);
  });
}

async function searchWikimedia(keyword) {
  const queryUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&srnamespace=6&format=json`;
  const result = await fetchJson(queryUrl);
  if (result.query && result.query.search && result.query.search.length > 0) {
    const audioFiles = result.query.search.filter(s => s.title.endsWith('.ogg') || s.title.endsWith('.mp3') || s.title.endsWith('.wav'));
    return audioFiles.length > 0 ? audioFiles[0].title.replace(/^File:/, '') : null;
  }
  return null;
}

const soundMap = [
  { name: 'horn.ogg', search: 'shofar blast sound OR bugle' },
  { name: 'drum.ogg', search: 'Taiko drum OR drum cadence' },
  { name: 'waves.ogg', search: 'lake waves compilation sound' },
  { name: 'wind.ogg', search: 'wind storm howling sound' },
  { name: 'horse.ogg', search: 'horse gallop sound' },
  { name: 'fire.ogg', search: 'campfire crackle sound' },
  { name: 'clash.ogg', search: 'sword clash sound' },
  { name: 'gong.ogg', search: 'singing bowl OR gong sound' },
  { name: 'victory.ogg', search: 'fanfare trumpet victory' },
];

async function main() {
  console.log('Searching and downloading authentic audio assets from Wikimedia Commons...');
  for (const item of soundMap) {
    try {
      const fileName = await searchWikimedia(item.search);
      if (fileName) {
        console.log(`Found: ${fileName} for ${item.name}`);
        const downloadUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
        const targetPath = path.join(sfxDir, item.name);
        await downloadFile(downloadUrl, targetPath);
        const stat = fs.statSync(targetPath);
        console.log(`✓ Downloaded ${item.name} (${stat.size} bytes)`);
      } else {
        console.warn(`Could not find audio for ${item.name}`);
      }
    } catch (e) {
      console.error(`Error for ${item.name}:`, e.message);
    }
  }
}

main();
