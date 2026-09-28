import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-9 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-9' && a.code !== 'CD6-B9');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b9');

// 2. Add asg-b9
const asgB9 = {
  id: 'asg-b9',
  lessonId: 'lesson-9',
  code: 'CD6-B9',
  title: '🇻🇳✨ Phiếu học tập thông minh: Công dân nước Cộng hòa xã hội chủ nghĩa Việt Nam',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 9,
};

db.assignments.push(asgB9);

// 3. Add 8 tasks for Bai 9
const questionsB9 = [
  {
    id: 'q-b9-1',
    assignmentId: 'asg-b9',
    order: 1,
    taskName: '🔎 NHIỆM VỤ 1 — SĂN TÌM “CHÌA KHÓA”',
    points: 10,
    content: 'Chọn 3 nhận định đúng:\n\n(1) Công dân là người dân của một nước.\n(2) Cứ sống ở Việt Nam thì chắc chắn là công dân Việt Nam.\n(3) Công dân có các quyền và nghĩa vụ do pháp luật quy định.\n(4) Quốc tịch là căn cứ xác định công dân của một nước.\n(5) Người nói tiếng Việt đều là công dân Việt Nam.\n(6) Người sinh ra ở Việt Nam luôn luôn là công dân Việt Nam.',
    options: {
      A: '(1), (3), (4) — Công dân là người dân một nước · Công dân có quyền và nghĩa vụ do pháp luật quy định · Quốc tịch là căn cứ xác định công dân',
      B: '(1), (2), (3) — Công dân là người dân một nước · Cứ sống ở VN là công dân VN · Có quyền và nghĩa vụ',
      C: '(2), (4), (5) — Cứ sống ở VN là công dân VN · Quốc tịch là căn cứ · Nói tiếng Việt là công dân VN',
      D: '(1), (4), (6) — Công dân là người dân một nước · Quốc tịch là căn cứ · Sinh ra ở VN luôn là công dân VN',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (4). Đây là các định nghĩa và nguyên tắc căn bản của Luật Quốc tịch và Hiến pháp. Các nhận định (2), (5), (6) sai vì người nước ngoài đang ở Việt Nam hoặc người biết tiếng Việt không mặc nhiên mang quốc tịch Việt Nam.',
  },
  {
    id: 'q-b9-2',
    assignmentId: 'asg-b9',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ “ĐÚNG NHÀ”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng nhóm:\n\n🪪 CĂN CỨ XÁC ĐỊNH CÔNG DÂN  |  ❌ KHÔNG PHẢI CĂN CỨ\n\nCác thẻ:\n(1) 🌏 Quốc tịch\n(2) 🏠 Nơi đang sinh sống\n(3) 🗣️ Ngôn ngữ sử dụng\n(4) 🎨 Màu da\n(5) 👨👩👧 Quan hệ giữa cá nhân với Nhà nước thông qua quốc tịch\n(6) ❤️ Yêu thích một đất nước',
    options: {
      A: '🪪 Căn cứ xác định công dân: (1, 5) · ❌ Không phải căn cứ: (2, 3, 4, 6)',
      B: '🪪 Căn cứ xác định công dân: (1, 2) · ❌ Không phải căn cứ: (3, 4, 5, 6)',
      C: '🪪 Căn cứ xác định công dân: (1, 3, 5) · ❌ Không phải căn cứ: (2, 4, 6)',
      D: '🪪 Căn cứ xác định công dân: (2, 4, 6) · ❌ Không phải căn cứ: (1, 3, 5)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- 🪪 Căn cứ xác định công dân (1, 5): Quốc tịch; Mối quan hệ pháp lý giữa cá nhân với Nhà nước thông qua quốc tịch.\n- ❌ Không phải căn cứ (2, 3, 4, 6): Nơi đang sinh sống; Ngôn ngữ sử dụng; Màu da; Tình cảm yêu thích một đất nước.',
  },
  {
    id: 'q-b9-3',
    assignmentId: 'asg-b9',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI “MẢNH GHÉP CÔNG DÂN”',
    points: 10,
    content: 'Nối mỗi nội dung ở bên trái với ý phù hợp nhất:\n\nA. Công dân\nB. Quốc tịch\nC. Công dân Việt Nam\nD. Pháp luật\n\n↔️\n① Người có quốc tịch Việt Nam\n② Căn cứ xác định công dân của một nước\n③ Quy định quyền và nghĩa vụ của công dân\n④ Người dân của một nước\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ④ (Người dân một nước) · B → ② (Căn cứ xác định công dân) · C → ① (Người có quốc tịch VN) · D → ③ (Quy định quyền và nghĩa vụ)',
      B: 'A → ② (Căn cứ xác định công dân) · B → ④ (Người dân một nước) · C → ③ (Quy định quyền và nghĩa vụ) · D → ① (Người có quốc tịch VN)',
      C: 'A → ① (Người có quốc tịch VN) · B → ② (Căn cứ xác định công dân) · C → ④ (Người dân một nước) · D → ③ (Quy định quyền và nghĩa vụ)',
      D: 'A → ④ (Người dân một nước) · B → ① (Người có quốc tịch VN) · C → ② (Căn cứ xác định công dân) · D → ③ (Quy định quyền và nghĩa vụ)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chuẩn xác: A–4, B–2, C–1, D–3:\n- A → ④: Công dân = Người dân của một nước.\n- B → ②: Quốc tịch = Căn cứ xác định công dân của một nước.\n- C → ①: Công dân Việt Nam = Người có quốc tịch Việt Nam.\n- D → ③: Pháp luật = Quy định quyền và nghĩa vụ của công dân.',
  },
  {
    id: 'q-b9-4',
    assignmentId: 'asg-b9',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ “CÔNG THỨC CÔNG DÂN”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng chỗ:\n(QUỐC TỊCH • CÔNG DÂN • VIỆT NAM • PHÁP LUẬT)\n\n"🧑 __________ (1) là người dân của một nước, có các quyền và nghĩa vụ do __________ (2) quy định.\n🇻🇳 Người có __________ (3) Việt Nam là công dân __________ (4)."',
    options: {
      A: '(1) CÔNG DÂN → (2) PHÁP LUẬT → (3) QUỐC TỊCH → (4) VIỆT NAM',
      B: '(1) QUỐC TỊCH → (2) PHÁP LUẬT → (3) CÔNG DÂN → (4) VIỆT NAM',
      C: '(1) CÔNG DÂN → (2) QUỐC TỊCH → (3) PHÁP LUẬT → (4) VIỆT NAM',
      D: '(1) VIỆT NAM → (2) PHÁP LUẬT → (3) QUỐC TỊCH → (4) CÔNG DÂN',
    },
    correctOption: 'A',
    explanation: '✅ Câu hoàn chỉnh theo SGK GDCD 6:\n"🧑 CÔNG DÂN là người dân của một nước, có các quyền và nghĩa vụ do PHÁP LUẬT quy định.\n🇻🇳 Người có QUỐC TỊCH Việt Nam là công dân VIỆT NAM."',
  },
  {
    id: 'q-b9-5',
    assignmentId: 'asg-b9',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI? 🧨 CẨN THẬN “BẪY”!',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Một người sống lâu năm ở Việt Nam thì tự động trở thành công dân Việt Nam.\n② Quốc tịch là căn cứ để xác định công dân của một nước.\n③ Công dân Việt Nam là người có quốc tịch Việt Nam.\n④ Muốn xác định một người là công dân nước nào, chỉ cần xem người đó đang sống ở đâu.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Đúng – Sai:\n- ① Sai: Sống lâu năm không tự động có quốc tịch; việc nhập quốc tịch phải theo thủ tục luật định.\n- ② Đúng: Quốc tịch là căn cứ pháp lý để xác định công dân.\n- ③ Đúng: Căn cứ Điều 17 Hiến pháp năm 2013.\n- ④ Sai: Nơi cư trú khác với quốc tịch.',
  },
  {
    id: 'q-b9-6',
    assignmentId: 'asg-b9',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — AI ĐANG NHẦM?',
    points: 10,
    content: 'Bốn bạn cùng nói:\n\n🌱 An: “Muốn xác định công dân của một nước cần căn cứ vào quốc tịch.”\n📚 Mai: “Người có quốc tịch Việt Nam là công dân Việt Nam.”\n🌏 Minh: “Công dân có quyền và nghĩa vụ được pháp luật quy định.”\n😎 Nam: “Chỉ cần đang sống ở Việt Nam thì chắc chắn là công dân Việt Nam.”\n\n🔍 Ai có suy nghĩ CHƯA ĐÚNG?',
    options: {
      A: 'An: “Muốn xác định công dân của một nước cần căn cứ vào quốc tịch.”',
      B: 'Mai: “Người có quốc tịch Việt Nam là công dân Việt Nam.”',
      C: 'Minh: “Công dân có quyền và nghĩa vụ được pháp luật quy định.”',
      D: 'Nam: “Chỉ cần đang sống ở Việt Nam thì chắc chắn là công dân Việt Nam.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Nam đã đồng nhất sai lầm giữa "nơi đang sinh sống" với "quốc tịch". Người nước ngoài du lịch, học tập, công tác tại Việt Nam vẫn mang quốc tịch nước của họ.',
  },
  {
    id: 'q-b9-7',
    assignmentId: 'asg-b9',
    order: 7,
    taskName: '🧒 NHIỆM VỤ 7 — THÁM TỬ QUỐC TỊCH: PHÂN LOẠI NHANH',
    points: 10,
    content: 'Dựa vào kiến thức Luật Quốc tịch Việt Nam trong SGK, hãy phân loại từng trường hợp:\n\n🇻🇳 XÁC ĐỊNH CÓ QUỐC TỊCH VIỆT NAM  |  ❓ CHƯA ĐỦ THÔNG TIN ĐỂ KẾT LUẬN\n\nCác trường hợp:\n(1) Bé An sinh ra có cả cha và mẹ đều là công dân Việt Nam.\n(2) Tom là khách du lịch nước ngoài đang ở Việt Nam trong 2 tuần.\n(3) Một em bé bị bỏ rơi, được tìm thấy trên lãnh thổ Việt Nam và không rõ cha mẹ là ai.\n(4) Một người nước ngoài đang học tập tại Việt Nam.\n(5) Một em bé sinh ra trên lãnh thổ Việt Nam, cha mẹ đều là người không quốc tịch nhưng có nơi thường trú tại Việt Nam.',
    options: {
      A: '🇻🇳 Xác định có quốc tịch VN: (1, 3, 5) · ❓ Chưa đủ thông tin/Không phải công dân VN: (2, 4)',
      B: '🇻🇳 Xác định có quốc tịch VN: (1, 2, 5) · ❓ Chưa đủ thông tin/Không phải công dân VN: (3, 4)',
      C: '🇻🇳 Xác định có quốc tịch VN: (1, 4) · ❓ Chưa đủ thông tin/Không phải công dân VN: (2, 3, 5)',
      D: '🇻🇳 Xác định có quốc tịch VN: (3, 5) · ❓ Chưa đủ thông tin/Không phải công dân VN: (1, 2, 4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác theo Luật Quốc tịch Việt Nam:\n- 🇻🇳 Có quốc tịch Việt Nam: (1) Cha mẹ đều là công dân Việt Nam (Điều 15); (3) Trẻ sơ sinh bị bỏ rơi được tìm thấy trên lãnh thổ VN không rõ cha mẹ (Điều 18); (5) Sinh ra tại VN, cha mẹ không quốc tịch nhưng thường trú tại VN (Điều 17).\n- ❓ (2, 4): Khách du lịch nước ngoài và du học sinh nước ngoài không phải là công dân Việt Nam.',
  },
  {
    id: 'q-b9-8',
    assignmentId: 'asg-b9',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 🎭 “SINH RA Ở ĐÂU = CÔNG DÂN NƯỚC ĐÓ?”',
    points: 15,
    content: 'Trong giờ thảo luận, Khôi nói: 💬 “Một bạn được sinh ra ở Việt Nam thì chắc chắn là công dân Việt Nam.” Ba bạn đưa ra ý kiến. Em đồng tình với ý kiến nào?\n\n🔐 CHỐT BÀI TRONG 20 GIÂY — “3 CHÌA KHÓA CÔNG DÂN”:\n🧑 CÔNG DÂN (Người dân của một nước) ➔ 🌏 QUỐC TỊCH (Căn cứ xác định công dân của một nước) ➔ 🇻🇳 QUỐC TỊCH VIỆT NAM (Công dân Việt Nam)\n\n🧠 MẬT MÃ CẦN NHỚ: Đang sống ở đâu ≠ Quốc tịch gì. Sinh ở đâu ≠ Luôn tự động xác định công dân. Muốn xác định công dân ➔ Nghĩ đến QUỐC TỊCH.',
    options: {
      A: 'Khôi đúng, chỉ cần sinh tại Việt Nam là đủ.',
      B: 'Khôi chưa đúng; cần căn cứ vào quốc tịch và các quy định liên quan chứ không thể chỉ dựa vào nơi sinh.',
      C: 'Muốn là công dân Việt Nam chỉ cần biết nói tiếng Việt.',
      D: 'Chỉ cần sống ở Việt Nam đủ lâu thì tự động trở thành công dân Việt Nam.',
    },
    correctOption: 'B',
    explanation: '✅ Lựa chọn tối ưu: B — Khôi chưa đúng; cần căn cứ vào quốc tịch và các quy định pháp luật liên quan chứ không thể chỉ dựa vào nơi sinh. Ví dụ: Con của hai công dân nước ngoài sinh ra tại Việt Nam thì quốc tịch của trẻ sẽ theo quốc tịch của cha mẹ, không đương nhiên là công dân Việt Nam.',
  },
];

db.questions.push(...questionsB9);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b9`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 9',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Công dân nước CHXHCN Việt Nam" (Mã: CD6-B9, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 9 (CD6-B9) with 8 tasks into database.json!');
