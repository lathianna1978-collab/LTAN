import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-12 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-12' && a.code !== 'CD6-B12');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b12');

// 2. Add asg-b12
const asgB12 = {
  id: 'asg-b12',
  lessonId: 'lesson-12',
  code: 'CD6-B12',
  title: '🛡️🌈 Phiếu học tập thông minh: Thực hiện quyền trẻ em',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 12,
};

db.assignments.push(asgB12);

// 3. Add 8 tasks for Bai 12
const questionsB12 = [
  {
    id: 'q-b12-1',
    assignmentId: 'asg-b12',
    order: 1,
    taskName: '🔎 NHIỆM VỤ 1 — AI CÙNG BẢO VỆ EM?',
    points: 10,
    content: 'Chọn 4 lực lượng có trách nhiệm trong việc thực hiện quyền trẻ em:\n\n(1) 👧 Bản thân trẻ em\n(2) 👨👩👧 Gia đình\n(3) 🏫 Nhà trường\n(4) 🌍 Xã hội\n(5) 🎮 Chỉ bạn thân\n(6) 📱 Chỉ mạng xã hội',
    options: {
      A: '(1), (2), (3), (4) — 👧 Bản thân trẻ em · 👨👩👧 Gia đình · 🏫 Nhà trường · 🌍 Xã hội',
      B: '(1), (2), (5), (6) — 👧 Bản thân trẻ em · 👨👩👧 Gia đình · 🎮 Chỉ bạn thân · 📱 Chỉ mạng xã hội',
      C: '(2), (3), (4), (6) — 👨👩👧 Gia đình · 🏫 Nhà trường · 🌍 Xã hội · 📱 Chỉ mạng xã hội',
      D: '(1), (3), (4), (5) — 👧 Bản thân trẻ em · 🏫 Nhà trường · 🌍 Xã hội · 🎮 Chỉ bạn thân',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (2), (3), (4). Bốn lực lượng có trách nhiệm nòng cốt theo Luật Trẻ em gồm: Bản thân trẻ em, Gia đình, Nhà trường và Xã hội. Các phương án (5) và (6) là phiến diện, không đầy đủ.',
  },
  {
    id: 'q-b12-2',
    assignmentId: 'asg-b12',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ “AI LÀM VIỆC GÌ?”',
    points: 15,
    content: 'Kéo mỗi thẻ vào nơi phù hợp nhất:\n\n👧 HỌC SINH  |  👨👩👧 GIA ĐÌNH  |  🏫 NHÀ TRƯỜNG  |  🌍 XÃ HỘI\n\nCác thẻ:\n(1) 📚 Chủ động học tập, rèn luyện\n(2) ❤️ Chăm sóc, nuôi dưỡng trẻ\n(3) 🏫 Xây dựng môi trường học tập an toàn\n(4) ⚖️ Xử lí hành vi xâm phạm quyền trẻ em\n(5) 🗣️ Biết lên tiếng, tìm sự giúp đỡ khi cần\n(6) 🎨 Tạo điều kiện để con học tập, vui chơi phù hợp\n(7) 🛡️ Bảo vệ học sinh khỏi bạo lực học đường\n(8) 📢 Tuyên truyền, thực hiện chính sách bảo vệ trẻ em',
    options: {
      A: '👧 Học sinh: (1, 5) · 👨👩👧 Gia đình: (2, 6) · 🏫 Nhà trường: (3, 7) · 🌍 Xã hội: (4, 8)',
      B: '👧 Học sinh: (1, 2) · 👨👩👧 Gia đình: (5, 6) · 🏫 Nhà trường: (3, 7) · 🌍 Xã hội: (4, 8)',
      C: '👧 Học sinh: (1, 5) · 👨👩👧 Gia đình: (3, 7) · 🏫 Nhà trường: (2, 6) · 🌍 Xã hội: (4, 8)',
      D: '👧 Học sinh: (4, 8) · 👨👩👧 Gia đình: (2, 6) · 🏫 Nhà trường: (3, 7) · 🌍 Xã hội: (1, 5)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác theo SGK GDCD 6:\n- 👧 Học sinh: (1) Chủ động học tập; (5) Biết lên tiếng tìm giúp đỡ.\n- 👨👩👧 Gia đình: (2) Chăm sóc nuôi dưỡng; (6) Tạo điều kiện học tập, vui chơi.\n- 🏫 Nhà trường: (3) Xây dựng môi trường an toàn; (7) Bảo vệ khỏi bạo lực học đường.\n- 🌍 Xã hội: (4) Xử lí hành vi xâm phạm; (8) Tuyên truyền, thực hiện chính sách bảo vệ trẻ em.',
  },
  {
    id: 'q-b12-3',
    assignmentId: 'asg-b12',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI NHANH “TÌNH HUỐNG ↔ TRÁCH NHIỆM”',
    points: 10,
    content: 'Nối tình huống với lực lượng chịu trách nhiệm tương ứng:\n\nTình huống:\nA. Cha mẹ chăm sóc con khi ốm.\nB. Học sinh chăm chỉ học tập và rèn luyện.\nC. Trường xây dựng môi trường không có bạo lực học đường.\nD. Cơ quan có thẩm quyền xử lí người xâm hại trẻ em.\n\n↕️ Trách nhiệm:\n① Học sinh\n② Gia đình\n③ Nhà trường\n④ Xã hội\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ② (Gia đình) · B → ① (Học sinh) · C → ③ (Nhà trường) · D → ④ (Xã hội)',
      B: 'A → ① (Học sinh) · B → ② (Gia đình) · C → ③ (Nhà trường) · D → ④ (Xã hội)',
      C: 'A → ② (Gia đình) · B → ③ (Nhà trường) · C → ① (Học sinh) · D → ④ (Xã hội)',
      D: 'A → ④ (Xã hội) · B → ① (Học sinh) · C → ③ (Nhà trường) · D → ② (Gia đình)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–2, B–1, C–3, D–4:\n- A → ②: Cha mẹ chăm sóc con = Trách nhiệm của Gia đình.\n- B → ①: Chăm chỉ học tập, rèn luyện = Trách nhiệm của Học sinh.\n- C → ③: Trường học không bạo lực = Trách nhiệm của Nhà trường.\n- D → ④: Cơ quan thẩm quyền xử lí vi phạm = Trách nhiệm của Xã hội.',
  },
  {
    id: 'q-b12-4',
    assignmentId: 'asg-b12',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ “CÔNG THỨC TRÁCH NHIỆM”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng chỗ:\n(GIA ĐÌNH • HỌC SINH • XÃ HỘI • NHÀ TRƯỜNG)\n\n"👧 __________ (1) chủ động thực hiện quyền và bổn phận của mình.\n👨👩👧 __________ (2) chăm sóc, nuôi dưỡng, giáo dục và bảo vệ trẻ.\n🏫 __________ (3) tạo môi trường học tập an toàn, lành mạnh.\n🌍 __________ (4) bảo đảm quyền trẻ em và xử lí hành vi vi phạm."',
    options: {
      A: '(1) HỌC SINH → (2) GIA ĐÌNH → (3) NHÀ TRƯỜNG → (4) XÃ HỘI',
      B: '(1) GIA ĐÌNH → (2) HỌC SINH → (3) NHÀ TRƯỜNG → (4) XÃ HỘI',
      C: '(1) HỌC SINH → (2) NHÀ TRƯỜNG → (3) GIA ĐÌNH → (4) XÃ HỘI',
      D: '(1) XÃ HỘI → (2) GIA ĐÌNH → (3) NHÀ TRƯỜNG → (4) HỌC SINH',
    },
    correctOption: 'A',
    explanation: '✅ Hoàn chỉnh theo SGK GDCD 6:\n- 👧 HỌC SINH: Chủ động thực hiện quyền và bổn phận của mình.\n- 👨👩👧 GIA ĐÌNH: Chăm sóc, nuôi dưỡng, giáo dục và bảo vệ trẻ.\n- 🏫 NHÀ TRƯỜNG: Tạo môi trường học tập an toàn, lành mạnh.\n- 🌍 XÃ HỘI: Bảo đảm quyền trẻ em và xử lí hành vi vi phạm.',
  },
  {
    id: 'q-b12-5',
    assignmentId: 'asg-b12',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI? 🧨 “BẪY QUYỀN TRẺ EM”',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Có quyền được bảo vệ nên khi gặp nguy hiểm, trẻ em nên tìm người đáng tin cậy để giúp đỡ.\n② Bảo đảm quyền trẻ em hoàn toàn là việc của cha mẹ.\n③ Trẻ em vừa có quyền, vừa cần thực hiện những bổn phận phù hợp với lứa tuổi.\n④ Nếu thấy bạn bị xâm phạm quyền, tốt nhất im lặng vì đó không phải việc của mình.',
    options: {
      A: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Đúng – Sai – Đúng – Sai:\n- ① Đúng: Khi gặp nguy hiểm, chủ động tìm người đáng tin cậy để được hỗ trợ bảo vệ.\n- ② Sai: Bảo đảm quyền trẻ em là trách nhiệm chung của Gia đình, Nhà trường và Xã hội.\n- ③ Đúng: Quyền luôn đi đôi với bổn phận.\n- ④ Sai: Không nên thờ ơ, im lặng; cần báo cho người lớn đáng tin cậy để kịp thời can thiệp, bảo vệ bạn bè.',
  },
  {
    id: 'q-b12-6',
    assignmentId: 'asg-b12',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn đưa ra cách xử lí khi thấy một bạn trong lớp thường xuyên bị bắt nạt:\n\n🌱 An: “Mình sẽ báo với thầy cô hoặc người lớn đáng tin cậy.”\n🤝 Mai: “Mình sẽ động viên bạn và tìm cách giúp bạn được hỗ trợ.”\n🛡️ Minh: “Nếu có nguy cơ mất an toàn, cần tìm sự trợ giúp.”\n😎 Nam: “Không liên quan đến mình nên cứ im lặng.”\n\n🔍 Ai có cách nghĩ CHƯA PHÙ HỢP?',
    options: {
      A: 'An: “Mình sẽ báo với thầy cô hoặc người lớn đáng tin cậy.”',
      B: 'Mai: “Mình sẽ động viên bạn và tìm cách giúp bạn được hỗ trợ.”',
      C: 'Minh: “Nếu có nguy cơ mất an toàn, cần tìm sự trợ giúp.”',
      D: 'Nam: “Không liên quan đến mình nên cứ im lặng.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). ❌ Hạt sạn: Thờ ơ, im lặng trước bạo lực và hành vi xâm phạm quyền trẻ em. Im lặng có thể khiến bạn tiếp tục bị tổn thương nghiêm trọng hơn.',
  },
  {
    id: 'q-b12-7',
    assignmentId: 'asg-b12',
    order: 7,
    taskName: '🚦 NHIỆM VỤ 7 — “ĐÈN XANH HAY ĐÈN ĐỎ?”',
    points: 10,
    content: 'Kéo 6 hành động vào đúng vùng:\n\n🟢 THỰC HIỆN/BẢO VỆ QUYỀN TRẺ EM  |  🔴 XÂM PHẠM/CHƯA TÔN TRỌNG QUYỀN TRẺ EM\n\nCác hành động:\n(1) 📚 Tạo điều kiện để trẻ được học tập.\n(2) 👊 Đánh trẻ để “dạy cho nhớ”.\n(3) 🗣️ Lắng nghe ý kiến phù hợp của trẻ về việc liên quan đến trẻ.\n(4) 🚫 Bắt trẻ làm công việc nặng nhọc, quá sức.\n(5) 🛡️ Giúp đỡ khi phát hiện trẻ có nguy cơ bị xâm hại.\n(6) 🔐 Tự ý công khai chuyện riêng tư của trẻ để trêu chọc.',
    options: {
      A: '🟢 Thực hiện / Bảo vệ quyền: (1, 3, 5) · 🔴 Xâm phạm / Chưa tôn trọng: (2, 4, 6)',
      B: '🟢 Thực hiện / Bảo vệ quyền: (1, 2, 5) · 🔴 Xâm phạm / Chưa tôn trọng: (3, 4, 6)',
      C: '🟢 Thực hiện / Bảo vệ quyền: (1, 3) · 🔴 Xâm phạm / Chưa tôn trọng: (2, 4, 5, 6)',
      D: '🟢 Thực hiện / Bảo vệ quyền: (3, 5) · 🔴 Xâm phạm / Chưa tôn trọng: (1, 2, 4, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- 🟢 Thực hiện / Bảo vệ quyền (1, 3, 5): Tạo điều kiện học tập; Lắng nghe ý kiến của trẻ; Giúp đỡ khi trẻ có nguy cơ bị xâm hại.\n- 🔴 Xâm phạm quyền (2, 4, 6): Đánh trẻ (bạo lực); Bắt làm việc nặng nhọc (bóc lột sức lao động); Tự ý công khai chuyện riêng tư (xâm phạm quyền bảo vệ đời sống riêng tư).',
  },
  {
    id: 'q-b12-8',
    assignmentId: 'asg-b12',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 📱 “GIỮ BÍ MẬT HAY TÌM NGƯỜI GIÚP?”',
    points: 15,
    content: 'Một người quen nhắn tin khiến Linh cảm thấy sợ hãi và yêu cầu: “Không được kể chuyện này với bố mẹ hay thầy cô!” Linh rất lo nhưng sợ rằng nếu kể với người lớn thì mình là người “không biết giữ bí mật”. Linh nên làm gì?\n\n🔐 CHỐT BÀI TRONG 20 GIÂY — “4 LỚP LÁ CHẮN”:\n👧 BẢN THÂN (Biết quyền – thực hiện bổn phận – biết tìm trợ giúp)\n👨👩👧 GIA ĐÌNH (Chăm sóc – nuôi dưỡng – giáo dục – bảo vệ)\n🏫 NHÀ TRƯỜNG (Giáo dục – chăm sóc – môi trường an toàn)\n🌍 XÃ HỘI (Bảo đảm quyền – bảo vệ – xử lí vi phạm)\n\n🧠 MẬT MÃ AN TOÀN:\nNHẬN RA ➔ KHÔNG IM LẶNG ➔ TÌM NGƯỜI TIN CẬY ➔ NHẬN HỖ TRỢ',
    options: {
      A: 'Giữ kín hoàn toàn vì đã được yêu cầu.',
      B: 'Tiếp tục nhắn tin để tự giải quyết.',
      C: 'Tìm người lớn đáng tin cậy để kể lại và nhờ hỗ trợ nhằm bảo vệ mình.',
      D: 'Đăng toàn bộ câu chuyện lên mạng xã hội để mọi người xử lí giúp.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Tìm người lớn đáng tin cậy để kể lại và nhờ hỗ trợ nhằm bảo vệ mình. Ranh giới bí mật an toàn: Những "bí mật" khiến bản thân lo sợ, bất an hoặc bị đe dọa không bao giờ được giữ kín. Chia sẻ với người lớn tin cậy là hành động dũng cảm để tự bảo vệ bản thân.',
  },
];

db.questions.push(...questionsB12);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b12`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 12',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Thực hiện quyền trẻ em" (Mã: CD6-B12, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 12 (CD6-B12) with 8 tasks into database.json!');
