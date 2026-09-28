import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-6 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-6' && a.code !== 'CD6-B6');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b6');

// 2. Add asg-b6
const asgB6 = {
  id: 'asg-b6',
  lessonId: 'lesson-6',
  code: 'CD6-B6',
  title: '🪞✨ Phiếu học tập thông minh: Tự nhận thức bản thân',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 6,
};

db.assignments.push(asgB6);

// 3. Add 8 questions for Bai 6
const questionsB6 = [
  {
    id: 'q-b6-1',
    assignmentId: 'asg-b6',
    order: 1,
    taskName: '🎮 THỬ THÁCH 1 — “GƯƠNG SOI BẢN THÂN”',
    points: 10,
    content: 'Chọn 4 điều giúp em hiểu đúng về bản thân:\n\n(1) 💪 Biết mình làm tốt việc gì.\n(2) 😟 Chỉ chú ý đến khuyết điểm của mình.\n(3) ❤️ Biết mình thích và không thích điều gì.\n(4) 🎯 Nhận ra điều mình cần cải thiện.\n(5) 👥 Cố biến mình thành một người khác.\n(6) 🧠 Hiểu đặc điểm tính cách của mình.',
    options: {
      A: '(1), (3), (4), (6) — 💪 Biết mình làm tốt việc gì · ❤️ Biết sở thích bản thân · 🎯 Nhận ra điều cần cải thiện · 🧠 Hiểu đặc điểm tính cách',
      B: '(1), (2), (3), (5) — Biết việc làm tốt · Chỉ chú ý khuyết điểm · Biết sở thích · Cố biến thành người khác',
      C: '(2), (4), (5), (6) — Chỉ chú ý khuyết điểm · Cần cải thiện · Biến thành người khác · Hiểu tính cách',
      D: '(1), (2), (4), (6) — Biết việc làm tốt · Chỉ chú ý khuyết điểm · Cần cải thiện · Hiểu tính cách',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (4), (6). Tự nhận thức bản thân là nhìn nhận toàn diện cả ưu điểm, sở thích, tính cách và những điểm cần cải thiện. Không nên chỉ tự ti tập trung vào khuyết điểm (2) hay đánh mất bản sắc của chính mình để cố trở thành người khác (5).',
  },
  {
    id: 'q-b6-2',
    assignmentId: 'asg-b6',
    order: 2,
    taskName: '🧩 THỬ THÁCH 2 — KÉO THẢ “TÔI LÀ AI?”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng chiếc hộp:\n\n💎 ĐIỂM MẠNH  |  🌱 ĐIỂM CẦN CẢI THIỆN  |  ❤️ SỞ THÍCH\n\nCác thẻ:\n(1) 🎨 Thích vẽ tranh\n(2) 🤝 Dễ hợp tác với bạn\n(3) ⏰ Hay đi học sát giờ\n(4) ⚽ Thích chơi bóng đá\n(5) 🎤 Tự tin khi thuyết trình\n(6) 📱 Dễ mất tập trung khi có điện thoại\n\n💡 Lưu ý tích cực: Không có hộp “điểm xấu”. Điểm chưa tốt được gọi là “điểm cần cải thiện” vì chúng ta hoàn toàn có thể rèn luyện để thay đổi.',
    options: {
      A: '💎 Điểm mạnh: (2, 5) · 🌱 Điểm cần cải thiện: (3, 6) · ❤️ Sở thích: (1, 4)',
      B: '💎 Điểm mạnh: (1, 4) · 🌱 Điểm cần cải thiện: (2, 5) · ❤️ Sở thích: (3, 6)',
      C: '💎 Điểm mạnh: (2, 5) · 🌱 Điểm cần cải thiện: (1, 4) · ❤️ Sở thích: (3, 6)',
      D: '💎 Điểm mạnh: (3, 6) · 🌱 Điểm cần cải thiện: (2, 5) · ❤️ Sở thích: (1, 4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- 💎 Điểm mạnh: (2) Dễ hợp tác với bạn; (5) Tự tin khi thuyết trình.\n- 🌱 Cần cải thiện: (3) Hay đi học sát giờ; (6) Dễ mất tập trung khi có điện thoại.\n- ❤️ Sở thích: (1) Thích vẽ tranh; (4) Thích chơi bóng đá.',
  },
  {
    id: 'q-b6-3',
    assignmentId: 'asg-b6',
    order: 3,
    taskName: '🔗 THỬ THÁCH 3 — NỐI “CHIẾC GƯƠNG”: TÌNH HUỐNG ↔ CÁCH NHẬN THỨC',
    points: 10,
    content: 'Muốn hiểu mình rõ hơn, em nên làm gì? Nối tình huống với cách tự nhận thức phù hợp nhất:\n\nTình huống:\nA. Muốn biết khả năng chạy của mình\nB. Muốn biết mình có hay ngắt lời người khác\nC. Muốn biết mình hợp hoạt động nào\nD. Bạn góp ý em nói hơi nhanh\n\n↔️ Cách tự nhận thức:\n① Lắng nghe phản hồi\n② Quan sát kết quả\n③ Tự quan sát hành vi\n④ Thử sức, trải nghiệm\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ② (Quan sát kết quả) · B → ③ (Tự quan sát hành vi) · C → ④ (Thử sức, trải nghiệm) · D → ① (Lắng nghe phản hồi)',
      B: 'A → ① (Lắng nghe phản hồi) · B → ② (Quan sát kết quả) · C → ③ (Tự quan sát hành vi) · D → ④ (Thử sức, trải nghiệm)',
      C: 'A → ④ (Thử sức, trải nghiệm) · B → ① (Lắng nghe phản hồi) · C → ② (Quan sát kết quả) · D → ③ (Tự quan sát hành vi)',
      D: 'A → ② (Quan sát kết quả) · B → ④ (Thử sức, trải nghiệm) · C → ① (Lắng nghe phản hồi) · D → ③ (Tự quan sát hành vi)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–2; B–3; C–4; D–1:\n- A → ②: Muốn biết khả năng chạy = Quan sát kết quả (thời gian, quãng đường).\n- B → ③: Muốn biết có hay ngắt lời = Tự quan sát hành vi trong giao tiếp.\n- C → ④: Muốn biết hợp hoạt động nào = Thử sức, trải nghiệm thực tế.\n- D → ①: Bạn góp ý nói hơi nhanh = Lắng nghe phản hồi từ xung quanh.',
  },
  {
    id: 'q-b6-4',
    assignmentId: 'asg-b6',
    order: 4,
    taskName: '🧠 THỬ THÁCH 4 — GIẢI MÃ “TÔI HIỂU TÔI”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng vị trí:\n(ĐIỂM MẠNH • ĐÚNG • ĐIỂM YẾU • BẢN THÂN)\n\n"🪞 Tự nhận thức bản thân là biết nhìn nhận, đánh giá _________ (1) về _________ (2); nhận ra _________ (3) để phát huy và _________ (4) để khắc phục."\n\n💡 Trọng tâm SGK GDCD 6: Hiểu đúng bản thân giúp tự tin phát huy thế mạnh và kiên trì rèn luyện khắc phục hạn chế.',
    options: {
      A: '(1) ĐÚNG → (2) BẢN THÂN → (3) ĐIỂM MẠNH → (4) ĐIỂM YẾU',
      B: '(1) BẢN THÂN → (2) ĐÚNG → (3) ĐIỂM YẾU → (4) ĐIỂM MẠNH',
      C: '(1) ĐÚNG → (2) ĐIỂM MẠNH → (3) BẢN THÂN → (4) ĐIỂM YẾU',
      D: '(1) ĐIỂM MẠNH → (2) BẢN THÂN → (3) ĐÚNG → (4) ĐIỂM YẾU',
    },
    correctOption: 'A',
    explanation: '✅ Câu hoàn chỉnh theo SGK:\n"🪞 Tự nhận thức bản thân là biết nhìn nhận, đánh giá ĐÚNG về BẢN THÂN; nhận ra ĐIỂM MẠNH để phát huy và ĐIỂM YẾU để khắc phục."',
  },
  {
    id: 'q-b6-5',
    assignmentId: 'asg-b6',
    order: 5,
    taskName: '⚡ THỬ THÁCH 5 — ĐÚNG HAY SAI?',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Biết mình có điểm yếu nghĩa là mình kém cỏi.\n② Nhận xét của người khác có thể giúp mình hiểu thêm về bản thân.\n③ Tự nhận thức tốt là chỉ cần biết những điểm mình giỏi.\n④ Trải nghiệm những hoạt động mới có thể giúp mình khám phá khả năng của bản thân.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Sai – Đúng.\n- ① Sai: Ai cũng có điểm yếu; nhận ra điểm yếu là bước đầu để rèn luyện tiến bộ, không đồng nghĩa với kém cỏi.\n- ② Đúng: Góc nhìn từ người khác là tấm gương phản chiếu khách quan.\n- ③ Sai: Tự nhận thức cần toàn diện, không chỉ nhìn mỗi ưu điểm.\n- ④ Đúng: Tích cực trải nghiệm giúp đánh thức những tiềm năng tiềm ẩn.',
  },
  {
    id: 'q-b6-6',
    assignmentId: 'asg-b6',
    order: 6,
    taskName: '🕵️ THỬ THÁCH 6 — AI ĐANG “SOI GƯƠNG SAI”?',
    points: 10,
    content: 'Bốn bạn cùng chia sẻ về cách tự nhận thức:\n\n🟢 An: “Mình học Toán tốt nhưng cần cải thiện khả năng trình bày.”\n🔵 Mai: “Bạn góp ý thì mình lắng nghe rồi xem điều đó có đúng không.”\n🟣 Minh: “Mình thử tham gia câu lạc bộ để khám phá khả năng mới.”\n🔴 Nam: “Bạn bè nói mình thế nào thì chắc chắn mình đúng là như thế, không cần tự xem xét nữa.”\n\n🔍 Ai có cách tự nhận thức CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Mình học Toán tốt nhưng cần cải thiện khả năng trình bày.”',
      B: 'Mai: “Bạn góp ý thì mình lắng nghe rồi xem điều đó có đúng không.”',
      C: 'Minh: “Mình thử tham gia câu lạc bộ để khám phá khả năng mới.”',
      D: 'Nam: “Bạn bè nói mình thế nào thì chắc chắn mình đúng là như thế, không cần tự xem xét nữa.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Bẫy tư duy ở đây: LẮNG NGHE ≠ TIN MỌI NHẬN XÉT. SGK yêu cầu học sinh lắng nghe ý kiến người khác, nhưng sau đó phải đối chiếu, so sánh với tự nhận thức và thực tế của chính mình chứ không mù quáng tin theo mọi lời nói.',
  },
  {
    id: 'q-b6-7',
    assignmentId: 'asg-b6',
    order: 7,
    taskName: '🗂️ THỬ THÁCH 7 — XẾP ĐÚNG “HÀNH TRÌNH NÂNG CẤP BẢN THÂN”',
    points: 10,
    content: 'Sắp xếp 4 thẻ theo hành trình nâng cấp bản thân hợp lí:\n(🚀 HÀNH ĐỘNG CẢI THIỆN · 🔎 NHẬN RA ĐIỂM MẠNH – ĐIỂM YẾU · 🌱 TIẾN BỘ · 🎯 CHỌN ĐIỀU CẦN PHÁT HUY/KHẮC PHỤC)\n\nHành trình của em:\n① __________ ⬇️ ② __________ ⬇️ ③ __________ ⬇️ ④ __________ 🏆',
    options: {
      A: '① NHẬN RA ĐIỂM MẠNH – ĐIỂM YẾU → ② CHỌN ĐIỀU CẦN PHÁT HUY/KHẮC PHỤC → ③ HÀNH ĐỘNG CẢI THIỆN → ④ TIẾN BỘ 🏆',
      B: '① CHỌN ĐIỀU CẦN PHÁT HUY/KHẮC PHỤC → ② NHẬN RA ĐIỂM MẠNH – ĐIỂM YẾU → ③ HÀNH ĐỘNG CẢI THIỆN → ④ TIẾN BỘ 🏆',
      C: '① NHẬN RA ĐIỂM MẠNH – ĐIỂM YẾU → ② HÀNH ĐỘNG CẢI THIỆN → ③ CHỌN ĐIỀU CẦN PHÁT HUY/KHẮC PHỤC → ④ TIẾN BỘ 🏆',
      D: '① HÀNH ĐỘNG CẢI THIỆN → ② NHẬN RA ĐIỂM MẠNH – ĐIỂM YẾU → ③ CHỌN ĐIỀU CẦN PHÁT HUY/KHẮC PHỤC → ④ TIẾN BỘ 🏆',
    },
    correctOption: 'A',
    explanation: '✅ Thứ tự hành trình chuẩn: Nhận ra điểm mạnh – điểm yếu ➔ Chọn điều cần phát huy / khắc phục ➔ Lên kế hoạch và hành động cải thiện ➔ Đạt được sự tiến bộ và trưởng thành 🏆',
  },
  {
    id: 'q-b6-8',
    assignmentId: 'asg-b6',
    order: 8,
    taskName: '🏆 THỬ THÁCH 8 — BOSS LEVEL 🎭 “MÌNH KHÔNG CÓ NĂNG KHIẾU!”',
    points: 15,
    content: 'Vy tham gia thuyết trình lần đầu nhưng nói nhỏ và quên một vài ý. Sau giờ học, Vy nghĩ: 😔 “Mình không có năng khiếu thuyết trình. Từ nay mình sẽ không bao giờ thuyết trình nữa.”\n\nVy nên làm gì?\n\n🔐 THỬ THÁCH TRÍ NHỚ 20 GIÂY — “4 CHIẾC GƯƠNG HIỂU MÌNH”:\n👀 1. TỰ QUAN SÁT (Mình đang nghĩ – cảm thấy – hành động thế nào?)\n📊 2. NHÌN VÀO KẾT QUẢ (Mình làm tốt/chưa tốt điều gì?)\n👂 3. LẮNG NGHE (Người khác nhìn thấy điều gì ở mình?)\n🚀 4. TRẢI NGHIỆM (Thử sức để khám phá thêm chính mình)\n→ 🌱 HIỂU MÌNH ➔ PHÁT TRIỂN MÌNH.\n\n❤️ TẤM VÉ RỜI KHỎI BÀI HỌC: “Hiểu mình không phải để tự phán xét — mà để biết mình có thể tiến về đâu.”',
    options: {
      A: 'Không tham gia nữa vì thất bại một lần đã chứng minh mình không có khả năng.',
      B: 'So sánh mình với bạn giỏi nhất lớp rồi cố bắt chước hoàn toàn bạn ấy.',
      C: 'Xem lại điều mình làm được và chưa được, hỏi thêm góp ý, luyện tập rồi thử lại.',
      D: 'Chỉ hỏi những người chắc chắn sẽ khen mình.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Xem lại điều mình làm được và chưa được, hỏi thêm góp ý, luyện tập rồi thử lại. Một kết quả chưa tốt trong lần đầu tiên không phải là kết luận cố định về năng lực của bản thân; quan trọng là thái độ dám đối diện, rút kinh nghiệm và kiên trì luyện tập.',
  },
];

db.questions.push(...questionsB6);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b6`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 6',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Tự nhận thức bản thân" (Mã: CD6-B6, 8 thử thách, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 6 (CD6-B6) with 8 challenges into database.json!');
