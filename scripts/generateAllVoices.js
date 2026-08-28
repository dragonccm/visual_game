import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';

const outDir = path.resolve('public/assets/audio/voices');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// All dialogue lines from storyData.ts
const dialogues = [
  // Scene Intro
  { id: 'd1_1', text: 'Năm 938. Vạn quân Nam Hán rẽ sóng tràn vào cửa biển Bạch Đằng!' },
  { id: 'd1_2', text: 'Báo cáo Chủ tướng! Soái hạm giặc cao như tòa thành, trang bị nỏ lớn!' },
  { id: 'd1_3', text: 'Địch cậy thuyền to! Ta dùng địa lợi Bạch Đằng và con nước triều để chôn vùi chúng!' },

  // Scene Planting Stakes
  { id: 'da_1', text: 'Triều rút cạn! Quân dân dầm mình dưới bùn, đóng vạn cọc lim bịt sắt!' },
  { id: 'da_2', text: 'Cắm nghiêng xuôi dòng! Nước lên thuyền ta lướt qua, nước rút cọc xé toạc tàu giặc!' },
  { id: 'da_3', text: 'Nước triều bắt đầu dâng ngập bãi cọc. Thuyền giặc đã tới cửa sông!' },

  // Scene Lure Deep
  { id: 'dla_1', text: 'Lũ man di tháo chạy rồi! Toàn quân giương buồm nghiền nát chúng!' },
  { id: 'dla_2', text: 'Giờ Thân! Nước triều rút cạn như thác đổ! Rừng cọc nhô lên đâm toạc mạn thuyền giặc!' },
  { id: 'dla_3', text: 'Thuyền bị mắc kẹt rồi! Nước tràn vào khoang! Cứu ta với!' },
  { id: 'dla_4', text: 'Thủy triều đã rút! Toàn quân tổng phản công!' },

  // Scene Early Clash Danger
  { id: 'dea_1', text: 'Khoan đã! Dưới nước có cọc nhọn! Lũ man di muốn bẫy ta! Quay đầu rút ra biển mau!' },
  { id: 'dea_2', text: 'Nguy cấp rồi! Địch đang quay đầu tháo chạy ra vịnh!' },

  // Scene Canyon Ambush
  { id: 'db_1', text: 'Hạm đội giặc đang hạ neo ngủ say ở Tràng Kênh. Chuẩn bị vạn mũi tên lửa và bè dầu tràm!' },

  // Scene Night Fire Ambush
  { id: 'dnb_1', text: 'Mưa tên lửa xé toạc màn đêm! Chiến hạm Nam Hán bốc cháy ngùn ngụt!' },
  { id: 'dnb_2', text: 'Cháy rồi! Thuyền ta cháy rồi! Quân Nam từ đâu tới vậy?!' },

  // Scene Decoy Ship Trap
  { id: 'ddb_1', text: 'Thuyền rơm trá hàng phát hỏa! Soái hạm Hoằng Tháo nổ tung trong đêm!' },
  { id: 'ddb_2', text: 'Giặc đã tan hoang! Toàn quân xung phong quét sạch quân thù!' },

  // Scene Direct Clash Battle
  { id: 'dc_1', text: 'Bẩm Chủ tướng! Thuyền giặc quá cao, nỏ lớn của chúng bắn thủng thuyền ta!' },
  { id: 'dc_2', text: 'Lũ man di dám lấy trứng chọi đá! Bắn nát thuyền chúng cho ta!' },

  // Scene Boarding Bloodbath
  { id: 'dbc_1', text: 'Mạt tướng đã chém đứt bánh lái soái hạm địch! Thuyền giặc đang mất lái!' },

  // Scene Emergency Pivot
  { id: 'dep_1', text: 'Nước triều đang rút! Thuyền cồng kềnh của giặc đã mắc cạn trên bãi cát lún!' },

  // Endings
  { id: 'de1_1', text: 'Non sông từ nay sạch bóng quân thù! Ta cùng muôn dân chung tay dựng xây nền thái bình!' },
  { id: 'de2_1', text: 'Lấy mưu lạ thắng thuyền to! Toàn quân đại thắng vang dội!' },
  { id: 'de3_1', text: 'Công lao của các dũng sĩ cảm tử sẽ được ghi tạc muôn đời trong sử sách!' },
  { id: 'de4_1', text: 'Lùi một bước để tiến mười bước. Củng cố thành Cổ Loa chờ giặc mỏi mệt sẽ xuất kích!' },
  { id: 'de5_1', text: 'Lấy mưu lạ thắng thế mạnh! Đêm nay sông Bạch Đằng sáng rực lửa chiến thắng!' },
  { id: 'de6_1', text: 'Chủ tướng nghịch tặc đã đền tội! Bờ cõi nước Nam từ nay có chủ!' },
  { id: 'de7_1', text: 'Kế sách xuất quỷ nhập thần! Giặc tan xác không còn một mống!' },
  { id: 'de8_1', text: 'Giang sơn đã sạch bóng giặc! Mau cứu chữa thương binh!' },
  { id: 'de9_1', text: 'Khinh suất không tận dụng con nước triều! Rút lui bảo toàn lực lượng, quyết làm lại!' },
  { id: 'de10_1', text: 'Binh pháp linh hoạt biến hóa! Chuyển bại thành thắng!' },
];

async function generateAll() {
  console.log(`Generating ${dialogues.length} high-definition Vietnamese voice audio files...`);

  for (const item of dialogues) {
    const filename = `${item.id}.mp3`;
    const targetPath = path.join(outDir, filename);

    try {
      const cleanText = item.text.replace(/[*_#—–•⚡👑🔥⚔️🏆!]/g, '').trim();
      const base64 = await googleTTS.getAudioBase64(cleanText, {
        lang: 'vi',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });

      const buffer = Buffer.from(base64, 'base64');
      fs.writeFileSync(targetPath, buffer);
      console.log(`✓ Generated ${filename}`);
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.error(`✗ Error generating ${filename}:`, err);
    }
  }

  console.log('All voice audio files successfully generated!');
}

generateAll();
