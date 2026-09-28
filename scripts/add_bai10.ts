import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-10 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-10' && a.code !== 'CD6-B10');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b10');

// 2. Add asg-b10
const asgB10 = {
  id: 'asg-b10',
  lessonId: 'lesson-10',
  code: 'CD6-B10',
  title: '⚖️✨ Phiếu học tập thông minh: Quyền và nghĩa vụ cơ bản của công dân',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 10,
};

db.assignments.push(asgB10);

// 3. Add 8 tasks for Bai 10
const questionsB10 = [
  {
    id: 'q-b10-1',
    assignmentId: 'asg-b10',
    order: 1,
    taskName: '🔎 NHIỆM VỤ 1 — QUYỀN HAY NGHĨA VỤ?',
    points: 10,
    content: 'Chọn 4 nội dung thuộc quyền cơ bản của công dân:\n\n(1) 📚 Được học tập\n(2) 🌳 Bảo vệ môi trường\n(3) 🏥 Được bảo vệ, chăm sóc sức khỏe\n(4) ⚖️ Tuân theo Hiến pháp và pháp luật\n(5) 🔐 Được bảo vệ đời sống riêng tư, bí mật cá nhân\n(6) 💼 Có việc làm\n(7) 💰 Nộp thuế theo quy định\n(8) 🎒 Thực hiện nghĩa vụ học tập',
    options: {
      A: '(1), (3), (5), (6) — 📚 Được học tập · 🏥 Được chăm sóc sức khỏe · 🔐 Được bảo vệ đời sống riêng tư · 💼 Có việc làm',
      B: '(1), (2), (4), (6) — 📚 Được học tập · 🌳 Bảo vệ môi trường · ⚖️ Tuân theo pháp luật · 💼 Có việc làm',
      C: '(2), (4), (7), (8) — 🌳 Bảo vệ môi trường · ⚖️ Tuân theo pháp luật · 💰 Nộp thuế · 🎒 Thực hiện nghĩa vụ học tập',
      D: '(1), (3), (7), (8) — 📚 Được học tập · 🏥 Được chăm sóc sức khỏe · 💰 Nộp thuế · 🎒 Nghĩa vụ học tập',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (5), (6). Đây là các quyền cơ bản (lợi ích công dân được hưởng). Các nội dung (2), (4), (7), (8) là nghĩa vụ cơ bản (việc công dân phải thực hiện theo quy định của pháp luật).',
  },
  {
    id: 'q-b10-2',
    assignmentId: 'asg-b10',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ “4 NGÔI NHÀ QUYỀN”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng nhóm quyền theo Hiến pháp:\n\n🗳️ CHÍNH TRỊ  |  🛡️ DÂN SỰ  |  💼 KINH TẾ  |  📚 VĂN HÓA – XÃ HỘI\n\nCác thẻ:\n(1) 🗳️ Bầu cử\n(2) 🔐 Được bảo vệ đời sống riêng tư\n(3) 💼 Có việc làm\n(4) 📚 Học tập\n(5) 💰 Sở hữu tài sản hợp pháp\n(6) 🏥 Được chăm sóc sức khỏe',
    options: {
      A: '🗳️ Chính trị: (1) · 🛡️ Dân sự: (2) · 💼 Kinh tế: (3, 5) · 📚 Văn hóa – Xã hội: (4, 6)',
      B: '🗳️ Chính trị: (1, 2) · 🛡️ Dân sự: (3) · 💼 Kinh tế: (5) · 📚 Văn hóa – Xã hội: (4, 6)',
      C: '🗳️ Chính trị: (1) · 🛡️ Dân sự: (2, 5) · 💼 Kinh tế: (3) · 📚 Văn hóa – Xã hội: (4, 6)',
      D: '🗳️ Chính trị: (4) · 🛡️ Dân sự: (2) · 💼 Kinh tế: (1, 5) · 📚 Văn hóa – Xã hội: (3, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác theo Hiến pháp và SGK GDCD 6:\n- 🗳️ Quyền chính trị: (1) Bầu cử.\n- 🛡️ Quyền dân sự: (2) Được bảo vệ đời sống riêng tư, bí mật cá nhân.\n- 💼 Quyền kinh tế: (3) Có việc làm; (5) Sở hữu tài sản hợp pháp.\n- 📚 Quyền văn hóa – xã hội: (4) Học tập; (6) Được chăm sóc sức khỏe.',
  },
  {
    id: 'q-b10-3',
    assignmentId: 'asg-b10',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI “QUYỀN ↔ TÌNH HUỐNG”',
    points: 10,
    content: 'Nối mỗi tình huống với quyền phù hợp nhất:\n\nTình huống:\nA. Mai đến trường học mỗi ngày\nB. Bác An làm việc tại một công ty\nC. Lan đi khám khi bị bệnh\nD. Bạn không được tự ý đọc nhật kí của Minh\n\n↔️ Quyền:\n① Quyền được bảo vệ đời sống riêng tư\n② Quyền học tập\n③ Quyền có việc làm\n④ Quyền được chăm sóc sức khỏe\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ② (Quyền học tập) · B → ③ (Quyền có việc làm) · C → ④ (Quyền chăm sóc sức khỏe) · D → ① (Quyền bảo vệ đời sống riêng tư)',
      B: 'A → ① (Quyền bảo vệ đời sống riêng tư) · B → ② (Quyền học tập) · C → ③ (Quyền có việc làm) · D → ④ (Quyền chăm sóc sức khỏe)',
      C: 'A → ② (Quyền học tập) · B → ④ (Quyền chăm sóc sức khỏe) · C → ③ (Quyền có việc làm) · D → ① (Quyền bảo vệ đời sống riêng tư)',
      D: 'A → ③ (Quyền có việc làm) · B → ② (Quyền học tập) · C → ④ (Quyền chăm sóc sức khỏe) · D → ① (Quyền bảo vệ đời sống riêng tư)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–2, B–3, C–4, D–1:\n- A → ②: Mai đến trường học = Quyền học tập.\n- B → ③: Bác An làm việc tại công ty = Quyền có việc làm.\n- C → ④: Lan đi khám khi bị bệnh = Quyền được chăm sóc sức khỏe.\n- D → ①: Không được tự ý đọc nhật kí = Quyền được bảo vệ đời sống riêng tư.',
  },
  {
    id: 'q-b10-4',
    assignmentId: 'asg-b10',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ “CẶP ĐÔI CÔNG DÂN”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng vị trí:\n(HƯỞNG • THỰC HIỆN • QUYỀN • NGHĨA VỤ)\n\n"⚖️ __________ (1) cơ bản là những lợi ích cơ bản mà công dân được __________ (2).\n🤝 __________ (3) cơ bản là những việc mà công dân phải __________ (4) theo quy định."\n\n🔐 Mẹo nhớ: QUYỀN ➔ ĐƯỢC HƯỞNG | NGHĨA VỤ ➔ PHẢI THỰC HIỆN.',
    options: {
      A: '(1) QUYỀN → (2) HƯỞNG → (3) NGHĨA VỤ → (4) THỰC HIỆN',
      B: '(1) NGHĨA VỤ → (2) THỰC HIỆN → (3) QUYỀN → (4) HƯỞNG',
      C: '(1) QUYỀN → (2) THỰC HIỆN → (3) NGHĨA VỤ → (4) HƯỞNG',
      D: '(1) NGHĨA VỤ → (2) HƯỞNG → (3) QUYỀN → (4) THỰC HIỆN',
    },
    correctOption: 'A',
    explanation: '✅ Khái niệm cốt lõi SGK GDCD 6:\n- ⚖️ QUYỀN cơ bản là những lợi ích cơ bản mà công dân được HƯỞNG.\n- 🤝 NGHĨA VỤ cơ bản là những việc mà công dân phải THỰC HIỆN theo quy định.',
  },
  {
    id: 'q-b10-5',
    assignmentId: 'asg-b10',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI? 🧨 CẨN THẬN “BẪY QUYỀN”',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Có quyền tự do ngôn luận nghĩa là có thể nói bất cứ điều gì về người khác.\n② Công dân được hưởng quyền nhưng đồng thời phải thực hiện các nghĩa vụ theo quy định.\n③ Khi thực hiện quyền của mình, cần tôn trọng quyền và lợi ích hợp pháp của người khác.\n④ Quyền cơ bản và nghĩa vụ cơ bản của công dân hoàn toàn không liên quan đến nhau.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Đúng – Sai:\n- ① Sai: Quyền tự do ngôn luận phải trong khuôn khổ pháp luật, không được xúc phạm danh dự, nhân phẩm người khác.\n- ② Đúng: Quyền công dân không tách rời nghĩa vụ công dân.\n- ③ Đúng: Mọi người có nghĩa vụ tôn trọng quyền của người khác.\n- ④ Sai: Quyền và nghĩa vụ có mối quan hệ gắn bó hữu cơ với nhau.',
  },
  {
    id: 'q-b10-6',
    assignmentId: 'asg-b10',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn nói về quyền của mình:\n\n🟢 An: “Mình có quyền học tập và cần thực hiện tốt việc học.”\n🔵 Mai: “Mình có quyền riêng tư nên người khác không được tùy tiện đọc tin nhắn của mình.”\n🟣 Minh: “Khi sử dụng quyền của mình, mình vẫn phải tôn trọng người khác.”\n🔴 Nam: “Đã là quyền của mình thì mình thích sử dụng thế nào cũng được.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Mình có quyền học tập và cần thực hiện tốt việc học.”',
      B: 'Mai: “Mình có quyền riêng tư nên người khác không được tùy tiện đọc tin nhắn của mình.”',
      C: 'Minh: “Khi sử dụng quyền của mình, mình vẫn phải tôn trọng người khác.”',
      D: 'Nam: “Đã là quyền của mình thì mình thích sử dụng thế nào cũng được.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Nam sai lầm khi nghĩ quyền là tự do vô hạn. Pháp luật quy định: Việc thực hiện quyền công dân không được xâm phạm lợi ích quốc gia, dân tộc và quyền, lợi ích hợp pháp của người khác.',
  },
  {
    id: 'q-b10-7',
    assignmentId: 'asg-b10',
    order: 7,
    taskName: '🚦 NHIỆM VỤ 7 — “3 VÙNG CÔNG DÂN”',
    points: 10,
    content: 'Kéo 6 hành động vào đúng vùng:\n\n🟢 THỰC HIỆN QUYỀN PHÙ HỢP  |  🔵 THỰC HIỆN NGHĨA VỤ  |  🔴 XÂM PHẠM QUYỀN CỦA NGƯỜI KHÁC\n\nCác hành động:\n(1) 📚 Tham gia học tập đầy đủ.\n(2) 📱 Tự ý mở điện thoại của bạn để đọc tin nhắn.\n(3) 🌱 Bỏ rác đúng nơi và cùng giữ gìn môi trường.\n(4) 🏥 Đi khám khi cần chăm sóc sức khỏe.\n(5) ✉️ Lén đọc thư của người khác vì tò mò.\n(6) ⚖️ Chấp hành các quy định của pháp luật phù hợp với mình.',
    options: {
      A: '🟢 Thực hiện quyền: (4) · 🔵 Thực hiện nghĩa vụ: (1, 3, 6) · 🔴 Xâm phạm quyền người khác: (2, 5)',
      B: '🟢 Thực hiện quyền: (1, 4) · 🔵 Thực hiện nghĩa vụ: (3, 6) · 🔴 Xâm phạm quyền người khác: (2, 5)',
      C: '🟢 Thực hiện quyền: (4, 6) · 🔵 Thực hiện nghĩa vụ: (1, 3) · 🔴 Xâm phạm quyền người khác: (2, 5)',
      D: '🟢 Thực hiện quyền: (2, 4) · 🔵 Thực hiện nghĩa vụ: (1, 3, 6) · 🔴 Xâm phạm quyền người khác: (5)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- 🟢 Thực hiện quyền phù hợp: (4) Đi khám khi cần chăm sóc sức khỏe.\n- 🔵 Thực hiện nghĩa vụ: (1) Tham gia học tập đầy đủ; (3) Giữ gìn môi trường; (6) Chấp hành pháp luật.\n- 🔴 Xâm phạm quyền người khác: (2) Tự ý đọc tin nhắn bạn; (5) Lén đọc thư người khác (vi phạm quyền bất khả xâm phạm về thư tín, điện thoại, điện tín).',
  },
  {
    id: 'q-b10-8',
    assignmentId: 'asg-b10',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 📱 “QUYỀN CỦA TỚ MÀ!”',
    points: 15,
    content: 'Nhóm lớp đang thảo luận trên mạng. Khánh đăng một bức ảnh khiến một bạn trong lớp xấu hổ. Khi được đề nghị gỡ ảnh, Khánh nói: 😎 “Trang cá nhân của mình. Mình có quyền đăng gì thì đăng!”\nTheo em, cách xử lí nào phù hợp nhất?\n\n🔐 CHỐT BÀI TRONG 20 GIÂY — “CÁN CÂN CÔNG DÂN”:\n🟢 QUYỀN: Những lợi ích cơ bản công dân được hưởng ⚖️ 🔵 NGHĨA VỤ: Những việc công dân phải thực hiện.\n🫱 QUYỀN CỦA MÌNH không tách rời 🫲 QUYỀN CỦA NGƯỜI KHÁC.\n➡️ ĐƯỢC HƯỞNG QUYỀN ➔ THỰC HIỆN NGHĨA VỤ ➔ TÔN TRỌNG QUYỀN NGƯỜI KHÁC.',
    options: {
      A: 'Khánh đúng vì đó là tài khoản của Khánh.',
      B: 'Cứ để ảnh vì chỉ bạn bè trong lớp nhìn thấy.',
      C: 'Khánh cần xem việc đăng ảnh có ảnh hưởng đến quyền, lợi ích hợp pháp của bạn hay không và xử lí phù hợp.',
      D: 'Đăng thêm ảnh để chứng minh mình có quyền tự do.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Khánh cần xem việc đăng ảnh có ảnh hưởng đến quyền, lợi ích hợp pháp của bạn hay không và xử lí phù hợp (gỡ ảnh, xin lỗi bạn). Ranh giới pháp lý: Không được lợi dụng mạng xã hội để xúc phạm danh dự, nhân phẩm và quyền riêng tư của người khác.',
  },
];

db.questions.push(...questionsB10);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b10`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 10',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Quyền và nghĩa vụ cơ bản của công dân" (Mã: CD6-B10, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 10 (CD6-B10) with 8 tasks into database.json!');
