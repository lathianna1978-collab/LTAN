import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-11 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-11' && a.code !== 'CD6-B11');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b11');

// 2. Add asg-b11
const asgB11 = {
  id: 'asg-b11',
  lessonId: 'lesson-11',
  code: 'CD6-B11',
  title: '🧒🌈 Phiếu học tập thông minh: Quyền cơ bản của trẻ em',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 11,
};

db.assignments.push(asgB11);

// 3. Add 8 tasks for Bai 11
const questionsB11 = [
  {
    id: 'q-b11-1',
    assignmentId: 'asg-b11',
    order: 1,
    taskName: '🔎 NHIỆM VỤ 1 — SĂN TÌM QUYỀN',
    points: 10,
    content: 'Chọn 5 điều thuộc quyền cơ bản của trẻ em:\n\n(1) 📚 Được học tập\n(2) 🏥 Được chăm sóc sức khỏe\n(3) 👊 Được bắt nạt bạn yếu hơn\n(4) 🛡️ Được bảo vệ khỏi bạo lực, xâm hại\n(5) 🗣️ Được bày tỏ ý kiến về vấn đề liên quan đến mình\n(6) 🎨 Được vui chơi, giải trí\n(7) 📱 Muốn sử dụng điện thoại bao lâu cũng được\n(8) 😎 Muốn làm gì cũng không cần nghe người lớn',
    options: {
      A: '(1), (2), (4), (5), (6) — 📚 Được học tập · 🏥 Chăm sóc sức khỏe · 🛡️ Bảo vệ khỏi bạo lực · 🗣️ Bày tỏ ý kiến · 🎨 Vui chơi, giải trí',
      B: '(1), (2), (3), (4), (5) — 📚 Được học tập · 🏥 Chăm sóc sức khỏe · 👊 Bắt nạt bạn · 🛡️ Bảo vệ khỏi bạo lực · 🗣️ Bày tỏ ý kiến',
      C: '(1), (2), (5), (6), (7) — 📚 Học tập · 🏥 Sức khỏe · 🗣️ Bày tỏ ý kiến · 🎨 Vui chơi · 📱 Dùng điện thoại không giới hạn',
      D: '(2), (4), (5), (6), (8) — 🏥 Sức khỏe · 🛡️ Bảo vệ · 🗣️ Bày tỏ ý kiến · 🎨 Vui chơi · 😎 Không cần nghe người lớn',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (2), (4), (5), (6). Đây là các quyền cơ bản của trẻ em theo Luật Trẻ em và Công ước Liên Hợp Quốc về Quyền trẻ em. Các điều (3), (7), (8) là hành vi sai trái hoặc đòi hỏi tùy tiện, không phải quyền của trẻ em.',
  },
  {
    id: 'q-b11-2',
    assignmentId: 'asg-b11',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ 🏠 “4 NGÔI NHÀ QUYỀN TRẺ EM”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng ngôi nhà:\n\n❤️ SỐNG CÒN  |  🛡️ BẢO VỆ  |  🌱 PHÁT TRIỂN  |  🗣️ THAM GIA\n\nCác thẻ:\n(1) 🍚 Được đáp ứng nhu cầu ăn uống cần thiết\n(2) 🚫 Được bảo vệ khỏi bạo lực\n(3) 📚 Được học tập\n(4) 💬 Được bày tỏ ý kiến\n(5) 🏥 Được chăm sóc sức khỏe\n(6) 🔐 Được bảo vệ đời sống riêng tư\n(7) ⚽ Được vui chơi, giải trí\n(8) 🤝 Được tham gia hoạt động phù hợp liên quan đến mình',
    options: {
      A: '❤️ Sống còn: (1, 5) · 🛡️ Bảo vệ: (2, 6) · 🌱 Phát triển: (3, 7) · 🗣️ Tham gia: (4, 8)',
      B: '❤️ Sống còn: (1, 3) · 🛡️ Bảo vệ: (2, 5) · 🌱 Phát triển: (6, 7) · 🗣️ Tham gia: (4, 8)',
      C: '❤️ Sống còn: (1, 5) · 🛡️ Bảo vệ: (3, 7) · 🌱 Phát triển: (2, 6) · 🗣️ Tham gia: (4, 8)',
      D: '❤️ Sống còn: (2, 6) · 🛡️ Bảo vệ: (1, 5) · 🌱 Phát triển: (3, 7) · 🗣️ Tham gia: (4, 8)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác theo 4 nhóm quyền trẻ em của Luật Trẻ em 2016:\n- ❤️ Quyền sống còn: (1) Ăn uống cần thiết; (5) Chăm sóc sức khỏe.\n- 🛡️ Quyền bảo vệ: (2) Bảo vệ khỏi bạo lực; (6) Bảo vệ đời sống riêng tư.\n- 🌱 Quyền phát triển: (3) Được học tập; (7) Vui chơi, giải trí.\n- 🗣️ Quyền tham gia: (4) Bày tỏ ý kiến; (8) Tham gia hoạt động phù hợp liên quan đến mình.',
  },
  {
    id: 'q-b11-3',
    assignmentId: 'asg-b11',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI “TÌNH HUỐNG ↔ QUYỀN”',
    points: 10,
    content: 'Nối mỗi tình huống với nhóm quyền tương ứng:\n\nTình huống:\nA. Linh bị ốm và được đưa đi khám.\nB. Nam được đến trường học tập.\nC. Mai được phát biểu ý kiến khi lớp chọn hoạt động trải nghiệm.\nD. Một bạn được người lớn giúp đỡ khi có nguy cơ bị bạo lực.\n\n↔️ Quyền:\n① Quyền được bảo vệ\n② Quyền được phát triển\n③ Quyền được tham gia\n④ Quyền được sống còn\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ④ (Quyền sống còn) · B → ② (Quyền phát triển) · C → ③ (Quyền tham gia) · D → ① (Quyền bảo vệ)',
      B: 'A → ① (Quyền bảo vệ) · B → ② (Quyền phát triển) · C → ③ (Quyền tham gia) · D → ④ (Quyền sống còn)',
      C: 'A → ④ (Quyền sống còn) · B → ③ (Quyền tham gia) · C → ② (Quyền phát triển) · D → ① (Quyền bảo vệ)',
      D: 'A → ② (Quyền phát triển) · B → ④ (Quyền sống còn) · C → ③ (Quyền tham gia) · D → ① (Quyền bảo vệ)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–4, B–2, C–3, D–1:\n- A → ④: Khám chữa bệnh khi ốm = Quyền được sống còn.\n- B → ②: Đến trường học tập = Quyền được phát triển.\n- C → ③: Phát biểu ý kiến hoạt động lớp = Quyền được tham gia.\n- D → ①: Được giúp đỡ khi có nguy cơ bị bạo lực = Quyền được bảo vệ.',
  },
  {
    id: 'q-b11-4',
    assignmentId: 'asg-b11',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ “BỘ TỨ QUYỀN”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng vị trí:\n(BẢO VỆ • THAM GIA • SỐNG CÒN • PHÁT TRIỂN)\n\n"❤️ Được sống và đáp ứng những nhu cầu cơ bản → Quyền được __________ (1)\n🛡️ Không bị bạo lực, bóc lột, xâm hại → Quyền được __________ (2)\n🌱 Được học tập, vui chơi, phát triển năng lực → Quyền được __________ (3)\n🗣️ Được bày tỏ ý kiến về những vấn đề liên quan → Quyền được __________ (4)"',
    options: {
      A: '(1) SỐNG CÒN → (2) BẢO VỆ → (3) PHÁT TRIỂN → (4) THAM GIA',
      B: '(1) BẢO VỆ → (2) SỐNG CÒN → (3) THAM GIA → (4) PHÁT TRIỂN',
      C: '(1) SỐNG CÒN → (2) PHÁT TRIỂN → (3) BẢO VỆ → (4) THAM GIA',
      D: '(1) PHÁT TRIỂN → (2) BẢO VỆ → (3) SỐNG CÒN → (4) THAM GIA',
    },
    correctOption: 'A',
    explanation: '✅ "Bộ tứ quyền trẻ em" chuẩn mực SGK GDCD 6:\n- Quyền được SỐNG CÒN: Được sống và đáp ứng các nhu cầu sinh tồn cơ bản.\n- Quyền được BẢO VỆ: Tránh khỏi mọi hình thức bạo lực, bóc lột, xâm hại.\n- Quyền được PHÁT TRIỂN: Được học tập, vui chơi, phát triển năng lực toàn diện.\n- Quyền được THAM GIA: Được bày tỏ ý kiến về các vấn đề liên quan đến trẻ em.',
  },
  {
    id: 'q-b11-5',
    assignmentId: 'asg-b11',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI? 🧨 PHÁ “BẪY TƯ DUY”',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Quyền trẻ em chỉ cần thiết khi trẻ gặp nguy hiểm.\n② Được đi học và vui chơi phù hợp góp phần giúp trẻ phát triển.\n③ Trẻ em có quyền được bảo vệ khỏi bạo lực và xâm hại.\n④ Có quyền bày tỏ ý kiến nghĩa là người khác bắt buộc phải làm theo mọi ý kiến của trẻ.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Đúng – Sai:\n- ① Sai: Quyền trẻ em là điều kiện cần thiết hàng ngày để trẻ em phát triển toàn diện thể chất và tinh thần.\n- ② Đúng: Quyền phát triển bao gồm học tập, vui chơi, giải trí lành mạnh.\n- ③ Đúng: Trẻ em có quyền bất khả xâm phạm về thân thể, được pháp luật bảo vệ.\n- ④ Sai: Trẻ có quyền nói lên ý kiến, người lớn lắng nghe và cân nhắc phù hợp với sự phát triển tốt nhất của trẻ.',
  },
  {
    id: 'q-b11-6',
    assignmentId: 'asg-b11',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn nói về quyền trẻ em:\n\n🌱 An: “Mình được học tập để phát triển bản thân.”\n🛡️ Mai: “Nếu bị bạo lực, trẻ em cần được bảo vệ.”\n🗣️ Minh: “Trẻ em có thể bày tỏ ý kiến về những việc có liên quan đến mình.”\n😎 Nam: “Có quyền trẻ em nghĩa là trẻ em thích làm gì cũng được.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Mình được học tập để phát triển bản thân.”',
      B: 'Mai: “Nếu bị bạo lực, trẻ em cần được bảo vệ.”',
      C: 'Minh: “Trẻ em có thể bày tỏ ý kiến về những việc có liên quan đến mình.”',
      D: 'Nam: “Có quyền trẻ em nghĩa là trẻ em thích làm gì cũng được.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). ❌ Sai lầm ở suy nghĩ: "Có quyền trẻ em nghĩa là thích làm gì cũng được". Quyền trẻ em không đồng nghĩa với tự do vô kỷ luật; trẻ em vẫn cần có bổn phận vâng lời cha mẹ, tôn trọng thầy cô và chấp hành nội quy, pháp luật.',
  },
  {
    id: 'q-b11-7',
    assignmentId: 'asg-b11',
    order: 7,
    taskName: '🚦 NHIỆM VỤ 7 — “QUYỀN NÀO ĐANG CẦN ĐƯỢC BẢO ĐẢM?”',
    points: 10,
    content: 'Phân loại 4 tình huống vào nhóm quyền phù hợp nhất:\n\n(1) 🏥 Một bạn nhỏ bị sốt cao cần được chăm sóc y tế.\n(2) 🚨 Một bạn thường xuyên bị người khác đánh và đe dọa.\n(3) 🎨 Một bạn muốn được học, vui chơi và tham gia hoạt động nghệ thuật phù hợp.\n(4) 🗣️ Lớp đang bàn về chuyến trải nghiệm và học sinh được nói lên mong muốn của mình.',
    options: {
      A: '❤️ Sống còn: (1) · 🛡️ Bảo vệ: (2) · 🌱 Phát triển: (3) · 🗣️ Tham gia: (4)',
      B: '❤️ Sống còn: (2) · 🛡️ Bảo vệ: (1) · 🌱 Phát triển: (3) · 🗣️ Tham gia: (4)',
      C: '❤️ Sống còn: (1) · 🛡️ Bảo vệ: (3) · 🌱 Phát triển: (2) · 🗣️ Tham gia: (4)',
      D: '❤️ Sống còn: (4) · 🛡️ Bảo vệ: (2) · 🌱 Phát triển: (3) · 🗣️ Tham gia: (1)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- ❤️ Sống còn: (1) Trẻ bị sốt cao cần chăm sóc y tế.\n- 🛡️ Bảo vệ: (2) Bị người khác đánh và đe dọa (cần bảo vệ khỏi bạo lực).\n- 🌱 Phát triển: (3) Học, vui chơi, tham gia hoạt động nghệ thuật.\n- 🗣️ Tham gia: (4) Nói lên mong muốn về chuyến trải nghiệm lớp.',
  },
  {
    id: 'q-b11-8',
    assignmentId: 'asg-b11',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 🎭 “TRẺ EM CÓ QUYỀN NÓI KHÔNG?”',
    points: 15,
    content: 'Gia đình đang bàn về việc chọn một hoạt động ngoại khóa cho Hà. Hà muốn nói lên mong muốn của mình. Một người nói: “Trẻ con thì cứ nghe người lớn quyết định, không cần hỏi ý kiến!”\nCách hiểu nào phù hợp nhất?\n\n🎁 BONUS 5 GIÂY:\n🍚 Nhu cầu thiết yếu để sống ➔ ❤️ SỐNG CÒN\n🚫 Không bị bạo lực ➔ 🛡️ BẢO VỆ\n📚 Được học tập ➔ 🌱 PHÁT TRIỂN\n💬 Được nói lên mong muốn ➔ 🗣️ THAM GIA\n\n🔐 CHỐT BÀI TRONG 20 GIÂY — “BỘ TỨ QUYỀN TRẺ EM”:\n❤️ ĐƯỢC SỐNG · 🛡️ ĐƯỢC AN TOÀN · 🌱 ĐƯỢC LỚN LÊN VÀ PHÁT TRIỂN · 🗣️ ĐƯỢC LẮNG NGHE',
    options: {
      A: 'Người lớn quyết định mọi việc nên trẻ em không cần được nói ý kiến.',
      B: 'Hà có quyền quyết định tất cả và người lớn bắt buộc phải làm theo.',
      C: 'Hà có quyền bày tỏ ý kiến về vấn đề liên quan đến mình; ý kiến của Hà cần được lắng nghe phù hợp.',
      D: 'Hà chỉ được nói ý kiến khi đủ 18 tuổi.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Hà có quyền bày tỏ ý kiến về vấn đề liên quan đến mình; ý kiến của Hà cần được người lớn lắng nghe và tôn trọng phù hợp. Quyền tham gia khẳng định trẻ em là chủ thể có tiếng nói, không phải đối tượng thụ động.',
  },
];

db.questions.push(...questionsB11);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b11`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 11',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Quyền cơ bản của trẻ em" (Mã: CD6-B11, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 11 (CD6-B11) with 8 tasks into database.json!');
