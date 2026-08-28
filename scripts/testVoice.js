import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';

const outDir = path.resolve('public/assets/audio/voices');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Sample test
async function downloadVoice(text, filename) {
  try {
    const base64 = await googleTTS.getAudioBase64(text, {
      lang: 'vi',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buffer);
    console.log(`Successfully generated ${filename}`);
  } catch (err) {
    console.error(`Error generating ${filename}:`, err);
  }
}

downloadVoice('Năm 938. Vạn quân Nam Hán rẽ sóng tràn vào cửa biển Bạch Đằng!', 'test.mp3');
