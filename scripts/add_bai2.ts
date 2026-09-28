import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-2 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-2' && a.code !== 'CD6-B2');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b2');

// 2. Add asg-b2
const asgB2 = {
  id: 'asg-b2',
  lessonId: 'lesson-2',
  code: 'CD6-B2',
  title: '❤️✨ Phiếu học tập thông minh: Yêu thương con người',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 2,
};

db.assignments.push(asgB2);

// 3. Add 8 questions for Bai 2
const questionsB2 = [
  {
    id: 'q-b2-1',
    assignmentId: 'asg-b2',
    order: 1,
    taskName: '🎮 NHIỆM VỤ 1 — AI ĐANG “TRAO YÊU THƯƠNG”?',
    points: 10,
    content: 'Chọn tất cả hành động thể hiện tình yêu thương con người:\n\n(1) Thấy bạn nghỉ học vì ốm, nhắn hỏi thăm và gửi bài cho bạn.\n(2) Thấy bạn bị ngã nhưng bỏ đi vì “không liên quan đến mình”.\n(3) Chủ động giúp một bạn mới chuyển trường làm quen với lớp.\n(4) Cười khi thấy bạn trả lời sai.\n(5) Nhường chỗ cho người lớn tuổi khi cần.\n(6) Chỉ giúp người khác khi chắc chắn mình sẽ được trả ơn.',
    options: {
      A: '(1), (3), (5) — Nhắn hỏi thăm bạn ốm; Giúp bạn mới chuyển trường; Nhường chỗ cho người lớn tuổi',
      B: '(1), (2), (4) — Nhắn hỏi bạn ốm; Bỏ đi khi bạn ngã; Cười khi bạn trả lời sai',
      C: '(2), (4), (6) — Bỏ đi khi bạn ngã; Cười khi bạn trả lời sai; Chỉ giúp khi được trả ơn',
      D: '(3), (5), (6) — Giúp bạn mới; Nhường chỗ; Chỉ giúp khi được trả ơn',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (5). Tình yêu thương con người xuất phát từ tấm lòng chân thành, không vụ lợi; biết quan tâm, giúp đỡ người gặp khó khăn và tôn trọng người xung quanh. Các hành động (2), (4), (6) là vô cảm, chế giễu hoặc tính toán ích kỉ.',
  },
  {
    id: 'q-b2-2',
    assignmentId: 'asg-b2',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ “3 MẢNH GHÉP YÊU THƯƠNG”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng nhóm biểu hiện của tình yêu thương:\n\n💬 LỜI NÓI  |  🤝 VIỆC LÀM  |  ❤️ THÁI ĐỘ\n\nCác thẻ:\n(1) “Mình có thể giúp bạn nhé!”\n(2) Chia sẻ đồ dùng học tập với bạn đang cần\n(3) Biết cảm thông khi người khác gặp chuyện buồn\n(4) “Cố lên, mình tin bạn làm được!”\n(5) Giúp bố mẹ việc nhà khi bố mẹ bận\n(6) Không chế giễu khuyết điểm của người khác\n\n💡 Kiến thức SGK: Biểu hiện của tình yêu thương qua sự đồng cảm, chia sẻ, sẵn sàng giúp đỡ và hành động phù hợp.',
    options: {
      A: '💬 Lời nói: (1, 4) · 🤝 Việc làm: (2, 5) · ❤️ Thái độ: (3, 6)',
      B: '💬 Lời nói: (2, 5) · 🤝 Việc làm: (1, 4) · ❤️ Thái độ: (3, 6)',
      C: '💬 Lời nói: (1, 4) · 🤝 Việc làm: (3, 6) · ❤️ Thái độ: (2, 5)',
      D: '💬 Lời nói: (3, 6) · 🤝 Việc làm: (2, 5) · ❤️ Thái độ: (1, 4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chính xác theo SGK:\n- 💬 Lời nói: “Mình có thể giúp bạn nhé!”; “Cố lên, mình tin bạn làm được!”\n- 🤝 Việc làm: Chia sẻ đồ dùng học tập với bạn đang cần; Giúp bố mẹ việc nhà khi bố mẹ bận.\n- ❤️ Thái độ: Biết cảm thông khi người khác gặp chuyện buồn; Không chế giễu khuyết điểm của người khác.',
  },
  {
    id: 'q-b2-3',
    assignmentId: 'asg-b2',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI TRÁI TIM',
    points: 15,
    content: 'Nối mỗi tình huống với phẩm chất/mảnh ghép phù hợp nhất:\n\nTình huống:\nA. Lắng nghe khi bạn đang buồn\nB. Góp sách cho học sinh khó khăn\nC. Cho bạn cơ hội sửa lỗi\nD. Giúp người bị ngã đứng dậy\n\n↔️ Mảnh ghép:\n① Sẵn sàng giúp đỡ\n② Tha thứ\n③ Đồng cảm\n④ Chia sẻ\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ③ (Đồng cảm) · B → ④ (Chia sẻ) · C → ② (Tha thứ) · D → ① (Sẵn sàng giúp đỡ)',
      B: 'A → ① (Sẵn sàng giúp đỡ) · B → ③ (Đồng cảm) · C → ④ (Chia sẻ) · D → ② (Tha thứ)',
      C: 'A → ④ (Chia sẻ) · B → ② (Tha thứ) · C → ① (Sẵn sàng giúp đỡ) · D → ③ (Đồng cảm)',
      D: 'A → ② (Tha thứ) · B → ① (Sẵn sàng giúp đỡ) · C → ③ (Đồng cảm) · D → ④ (Chia sẻ)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–3, B–4, C–2, D–1:\n- A → ③: Lắng nghe khi bạn buồn = Đồng cảm.\n- B → ④: Góp sách cho bạn khó khăn = Chia sẻ.\n- C → ②: Cho bạn cơ hội sửa lỗi = Tha thứ.\n- D → ①: Giúp người bị ngã đứng dậy = Sẵn sàng giúp đỡ.',
  },
  {
    id: 'q-b2-4',
    assignmentId: 'asg-b2',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ TRÁI TIM',
    points: 15,
    content: 'Điền 4 từ khóa vào đúng vị trí:\n(QUAN TÂM • GIÚP ĐỠ • TỐT ĐẸP • KHÓ KHĂN)\n\n"Yêu thương con người là sự __________ (1), __________ (2) và làm những điều __________ (3) cho người khác, nhất là khi họ gặp __________ (4), hoạn nạn."\n\n🔐 Trọng tâm ghi nhớ: Yêu thương con người là quan tâm, giúp đỡ, làm điều tốt đẹp cho người khác, nhất là khi hoạn nạn.',
    options: {
      A: 'QUAN TÂM → GIÚP ĐỠ → TỐT ĐẸP → KHÓ KHĂN',
      B: 'GIÚP ĐỠ → QUAN TÂM → KHÓ KHĂN → TỐT ĐẸP',
      C: 'TỐT ĐẸP → KHÓ KHĂN → QUAN TÂM → GIÚP ĐỠ',
      D: 'QUAN TÂM → TỐT ĐẸP → GIÚP ĐỠ → KHÓ KHĂN',
    },
    correctOption: 'A',
    explanation: '✅ Câu hoàn chỉnh: "Yêu thương con người là sự QUAN TÂM, GIÚP ĐỠ và làm những điều TỐT ĐẸP cho người khác, nhất là khi họ gặp KHÓ KHĂN, hoạn nạn."',
  },
  {
    id: 'q-b2-5',
    assignmentId: 'asg-b2',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI?',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Yêu thương con người chỉ thể hiện bằng việc cho tiền hoặc quà.\n② Một lời hỏi thăm chân thành cũng có thể thể hiện sự yêu thương.\n③ Chúng ta chỉ cần quan tâm đến những người quen biết.\n④ Biết cảm thông, chia sẻ và giúp đỡ người khác là biểu hiện của yêu thương con người.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Sai – Đúng.\n- ① Sai: Yêu thương con người không giới hạn ở tiền hay quà vật chất.\n- ② Đúng: Một lời hỏi thăm, động viên chân thành rất quý giá.\n- ③ Sai: Cần mở rộng lòng yêu thương tới mọi người trong cộng đồng.\n- ④ Đúng: Cảm thông, chia sẻ, giúp đỡ là cốt lõi của yêu thương con người.',
  },
  {
    id: 'q-b2-6',
    assignmentId: 'asg-b2',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — THÁM TỬ TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn đang cùng chia sẻ quan điểm về yêu thương con người:\n\n❤️ An: “Bạn buồn thì mình có thể lắng nghe.”\n🤝 Mai: “Giúp người khác nên phù hợp với khả năng của mình.”\n🌱 Minh: “Một việc nhỏ nhưng đúng lúc cũng có thể rất ý nghĩa.”\n🎁 Nam: “Phải tặng món quà có giá trị thì mới gọi là yêu thương.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Bạn buồn thì mình có thể lắng nghe.”',
      B: 'Mai: “Giúp người khác nên phù hợp với khả năng của mình.”',
      C: 'Minh: “Một việc nhỏ nhưng đúng lúc cũng có thể rất ý nghĩa.”',
      D: 'Nam: “Phải tặng món quà có giá trị thì mới gọi là yêu thương.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Suy nghĩ của Nam chưa hợp lí vì tình yêu thương bắt nguồn từ tấm lòng chân thành và sự quan tâm, không phụ thuộc vào giá trị vật chất hay tiền bạc của món quà.',
  },
  {
    id: 'q-b2-7',
    assignmentId: 'asg-b2',
    order: 7,
    taskName: '🌈 NHIỆM VỤ 7 — YÊU THƯƠNG TẠO RA ĐIỀU GÌ?',
    points: 10,
    content: 'Kéo các thẻ vào đúng vùng:\n\n❤️ GIÁ TRỊ CỦA YÊU THƯƠNG  |  ⚫ KHÔNG PHẢI GIÁ TRỊ CỦA YÊU THƯƠNG\n\nCác thẻ:\n(1) Gắn kết mọi người\n(2) Mang lại niềm vui\n(3) Tiếp thêm sức mạnh\n(4) Lan tỏa điều tốt đẹp\n(5) Giúp mình hơn người khác\n(6) Luôn nhận được lợi ích vật chất\n\n💡 SGK: Tình yêu thương giúp con người có thêm sức mạnh, cuộc sống tràn ngập niềm vui và gắn kết xã hội.',
    options: {
      A: '❤️ Giá trị của yêu thương: (1, 2, 3, 4)  ·  ⚫ Không phải: (5, 6)',
      B: '❤️ Giá trị của yêu thương: (1, 3, 5)  ·  ⚫ Không phải: (2, 4, 6)',
      C: '❤️ Giá trị của yêu thương: (2, 4, 6)  ·  ⚫ Không phải: (1, 3, 5)',
      D: '❤️ Giá trị của yêu thương: (3, 4, 5, 6)  ·  ⚫ Không phải: (1, 2)',
    },
    correctOption: 'A',
    explanation: '✅ Phân vùng chính xác:\n- ❤️ Giá trị của yêu thương (1, 2, 3, 4): Gắn kết mọi người, mang lại niềm vui, tiếp thêm sức mạnh, lan tỏa điều tốt đẹp.\n- ⚫ Không phải (5, 6): Giúp mình hơn người khác, luôn nhận được lợi ích vật chất (đây là thái độ kiêu ngạo và tính toán cá nhân).',
  },
  {
    id: 'q-b2-8',
    assignmentId: 'asg-b2',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 🎭 NẾU LÀ EM...',
    points: 10,
    content: 'Một bạn trong lớp thường ngồi một mình vì mới chuyển trường. Trong giờ ra chơi, vài bạn nói: “Bạn ấy ít nói lắm, thôi kệ đi!”\n\n💡 Nếu là em, em sẽ chọn cách ứng xử nào?\n\n🔐 THỬ THÁCH TRÍ NHỚ 20 GIÂY:\n❤️ YÊU THƯƠNG CON NGƯỜI\nQUAN TÂM ⬇️ ĐỒNG CẢM – CHIA SẺ ⬇️ GIÚP ĐỠ – LÀM ĐIỀU TỐT ĐẸP ⬇️ 🌱 LAN TỎA YÊU THƯƠNG\nYêu thương không nhất thiết bắt đầu từ việc lớn. Một lời nói tử tế, một sự quan tâm và một hành động đúng lúc cũng có thể mang lại điều tốt đẹp.',
    options: {
      A: 'Không quan tâm vì mình chưa quen bạn.',
      B: 'Đứng nhìn xem có bạn nào khác đến nói chuyện không.',
      C: 'Chủ động chào hỏi, rủ bạn cùng tham gia hoạt động và giúp bạn làm quen với lớp.',
      D: 'Chụp ảnh bạn rồi đăng lên nhóm lớp để mọi người chú ý.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn đúng: C — Chủ động chào hỏi, rủ bạn cùng tham gia hoạt động và giúp bạn làm quen với lớp. Đây là hành vi yêu thương, quan tâm chủ động, giúp bạn vượt qua sự bỡ ngỡ để hòa nhập vào tập thể lớp.',
  },
];

db.questions.push(...questionsB2);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b2`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 2',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Yêu thương con người" (Mã: CD6-B2, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 2 (CD6-B2) with 8 missions into database.json!');
