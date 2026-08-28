import fs from 'fs';
import path from 'path';
import https from 'https';

const sfxDir = path.resolve('public/assets/audio/sfx');
const bgmDir = path.resolve('public/assets/audio/bgm');

if (!fs.existsSync(sfxDir)) fs.mkdirSync(sfxDir, { recursive: true });
if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
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
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP Status ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', reject);
  });
}

async function getDirectUrl(filename) {
  const queryUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;
  const data = await fetchJson(queryUrl);
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pages[pageId] && pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
    return pages[pageId].imageinfo[0].url;
  }
  return null;
}

// Curated high quality authentic audio files on Wikimedia Commons
const fileList = [
  { target: 'drum.ogg', file: 'Drum - Cadence B.ogg' },
  { target: 'waves.ogg', file: 'Waves.ogg' },
  { target: 'horn.ogg', file: 'Reveille on bugle.ogg' },
  { target: 'clash.ogg', file: 'Sword Clash (Gravity Sound).mp3' },
  { target: 'gong.ogg', file: 'Tibetan singing bowl.ogg' },
  { target: 'victory.ogg', file: 'Fanfare for the Common Man - brass.ogg' },
];

async function main() {
  console.log('Fetching direct file URLs and downloading...');
  for (const item of fileList) {
    try {
      const directUrl = await getDirectUrl(item.file);
      if (directUrl) {
        console.log(`Downloading ${item.target} from ${directUrl}`);
        const dest = path.join(sfxDir, item.target);
        await downloadFile(directUrl, dest);
        const stat = fs.statSync(dest);
        console.log(`✓ Saved ${item.target} (${stat.size} bytes)`);
      } else {
        console.warn(`No URL for ${item.file}`);
      }
    } catch (err) {
      console.error(`Error downloading ${item.target}:`, err.message);
    }
  }
}

main();
