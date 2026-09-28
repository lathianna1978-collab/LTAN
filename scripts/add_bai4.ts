import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-4 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-4' && a.code !== 'CD6-B4');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b4');

// 2. Add asg-b4
const asgB4 = {
  id: 'asg-b4',
  lessonId: 'lesson-4',
  code: 'CD6-B4',
  title: '🔎✨ Phiếu học tập thông minh: Tôn trọng sự thật',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 4,
};

db.assignments.push(asgB4);

// 3. Add 8 questions for Bai 4
const questionsB4 = [
  {
    id: 'q-b4-1',
    assignmentId: 'asg-b4',
    order: 1,
    taskName: '⚡ THỬ THÁCH 1 — “THẬT” HAY “GIẢ”?',
    points: 10,
    content: 'Chọn 3 hành động thể hiện tôn trọng sự thật:\n\n(1) 📝 Làm sai bài, Lan tự nhận lỗi và sửa lại.\n(2) 📱 Chưa đọc thông tin nhưng Minh vẫn chia sẻ vì thấy nhiều người đăng.\n(3) ⚽ Làm mất bóng của lớp, An chủ động báo với cô.\n(4) 😶 Thấy bạn bị đổ oan nhưng im lặng vì sợ phiền.\n(5) 🔎 Chưa chắc một thông tin đúng, Hà kiểm tra trước khi kể cho bạn.\n(6) 🎭 Kể sai một chút để câu chuyện hấp dẫn hơn.',
    options: {
      A: '(1), (3), (5) — 📝 Lan (tự nhận lỗi và sửa lại) · ⚽ An (chủ động báo cô) · 🔎 Hà (kiểm tra trước khi kể)',
      B: '(1), (2), (4) — 📝 Lan · 📱 Minh (chia sẻ tin chưa đọc) · 😶 Im lặng khi bạn bị oan',
      C: '(2), (4), (6) — 📱 Minh · 😶 Im lặng vì sợ phiền · 🎭 Kể sai cho hấp dẫn',
      D: '(3), (5), (6) — ⚽ An · 🔎 Hà · 🎭 Kể sai cho hấp dẫn',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (5) (Lan – An – Hà). Đây là những hành vi trung thực, dũng cảm nhận lỗi và cẩn trọng với thông tin. Các hành vi (2), (4), (6) là chia sẻ tin giả, thiếu trách nhiệm bảo vệ người bị oan hoặc cố tình bóp méo sự thật.',
  },
  {
    id: 'q-b4-2',
    assignmentId: 'asg-b4',
    order: 2,
    taskName: '🧩 THỬ THÁCH 2 — KÉO THẢ “3 CHÌA KHÓA SỰ THẬT”',
    points: 15,
    content: 'Kéo mỗi thẻ vào đúng vùng:\n\n🧠 SUY NGHĨ  |  💬 LỜI NÓI  |  🤝 VIỆC LÀM\n\nCác thẻ:\n(1) Không vội tin điều chưa được kiểm chứng\n(2) Nói đúng những gì mình biết\n(3) Nhận lỗi khi mình làm sai\n(4) Không cố tình bóp méo sự việc\n(5) Không vu oan cho người khác\n(6) Bảo vệ điều đúng bằng cách phù hợp\n\n💡 SGK: Biểu hiện của tôn trọng sự thật là suy nghĩ, nói và làm theo đúng sự thật.',
    options: {
      A: '🧠 Suy nghĩ: (1, 4) · 💬 Lời nói: (2, 5) · 🤝 Việc làm: (3, 6)',
      B: '🧠 Suy nghĩ: (2, 5) · 💬 Lời nói: (1, 4) · 🤝 Việc làm: (3, 6)',
      C: '🧠 Suy nghĩ: (1, 4) · 💬 Lời nói: (3, 6) · 🤝 Việc làm: (2, 5)',
      D: '🧠 Suy nghĩ: (3, 6) · 💬 Lời nói: (2, 5) · 🤝 Việc làm: (1, 4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chính xác theo SGK GDCD 6:\n- 🧠 Suy nghĩ (1, 4): Không vội tin điều chưa được kiểm chứng; Không cố tình bóp méo sự việc.\n- 💬 Lời nói (2, 5): Nói đúng những gì mình biết; Không vu oan cho người khác.\n- 🤝 Việc làm (3, 6): Nhận lỗi khi mình làm sai; Bảo vệ điều đúng bằng cách phù hợp.',
  },
  {
    id: 'q-b4-3',
    assignmentId: 'asg-b4',
    order: 3,
    taskName: '🔗 THỬ THÁCH 3 — NỐI “SỰ THẬT → GIÁ TRỊ”',
    points: 10,
    content: 'Nối mỗi hành động với kết quả phù hợp nhất:\n\nHành động:\nA. Thừa nhận lỗi của mình\nB. Không tung tin chưa kiểm chứng\nC. Nói đúng điều mình chứng kiến\nD. Sống trung thực lâu dài\n\n↔️ Kết quả:\n① Bảo vệ người bị oan\n② Có cơ hội sửa sai\n③ Tạo niềm tin\n④ Hạn chế thông tin sai\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ② (Có cơ hội sửa sai) · B → ④ (Hạn chế thông tin sai) · C → ① (Bảo vệ người bị oan) · D → ③ (Tạo niềm tin)',
      B: 'A → ① (Bảo vệ người bị oan) · B → ④ (Hạn chế thông tin sai) · C → ② (Có cơ hội sửa sai) · D → ③ (Tạo niềm tin)',
      C: 'A → ④ (Hạn chế thông tin sai) · B → ② (Có cơ hội sửa sai) · C → ① (Bảo vệ người bị oan) · D → ③ (Tạo niềm tin)',
      D: 'A → ③ (Tạo niềm tin) · B → ① (Bảo vệ người bị oan) · C → ④ (Hạn chế thông tin sai) · D → ② (Có cơ hội sửa sai)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–2; B–4; C–1; D–3:\n- A → ②: Thừa nhận lỗi của mình = Có cơ hội sửa sai.\n- B → ④: Không tung tin chưa kiểm chứng = Hạn chế thông tin sai.\n- C → ①: Nói đúng điều mình chứng kiến = Bảo vệ người bị oan.\n- D → ③: Sống trung thực lâu dài = Tạo dựng niềm tin vững bền.',
  },
  {
    id: 'q-b4-4',
    assignmentId: 'asg-b4',
    order: 4,
    taskName: '🧠 THỬ THÁCH 4 — GIẢI MÃ THÔNG ĐIỆP',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng chỗ:\n(SỰ THẬT • ĐÚNG • TÔN TRỌNG • HIỆN THỰC)\n\n"__________ (1) là những gì có thật và phản ánh đúng __________ (2) cuộc sống.\n__________ (3) sự thật là suy nghĩ, nói và làm theo __________ (4) sự thật."',
    options: {
      A: '(1) SỰ THẬT → (2) HIỆN THỰC → (3) TÔN TRỌNG → (4) ĐÚNG',
      B: '(1) TÔN TRỌNG → (2) SỰ THẬT → (3) HIỆN THỰC → (4) ĐÚNG',
      C: '(1) HIỆN THỰC → (2) ĐÚNG → (3) SỰ THẬT → (4) TÔN TRỌNG',
      D: '(1) SỰ THẬT → (2) ĐÚNG → (3) TÔN TRỌNG → (4) HIỆN THỰC',
    },
    correctOption: 'A',
    explanation: '✅ Thông điệp chuẩn xác SGK GDCD 6:\n"SỰ THẬT là những gì có thật và phản ánh đúng HIỆN THỰC cuộc sống.\nTÔN TRỌNG sự thật là suy nghĩ, nói và làm theo ĐÚNG sự thật."',
  },
  {
    id: 'q-b4-5',
    assignmentId: 'asg-b4',
    order: 5,
    taskName: '⚡ THỬ THÁCH 5 — ĐÚNG HAY SAI?',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Không biết chắc một việc nhưng kể lại như thể mình tận mắt chứng kiến là tôn trọng sự thật.\n② Khi làm sai, dám nhận lỗi là biểu hiện của tôn trọng sự thật.\n③ Vì sợ bạn buồn nên có thể nói dối bất cứ lúc nào.\n④ Tôn trọng sự thật không có nghĩa là muốn nói điều gì cũng được; cần có thái độ phù hợp.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Sai – Đúng.\n- ① Sai: Kể việc chưa biết rõ như thể tận mắt thấy là lan truyền thông tin sai lệch.\n- ② Đúng: Dám nhận lỗi là biểu hiện dũng cảm của người tôn trọng sự thật.\n- ③ Sai: Không thể tùy tiện nói dối; cần chân thành và có phương pháp chia sẻ tế nhị.\n- ④ Đúng: Nói thật cần kết hợp thái độ khéo léo, đúng lúc và mang tính xây dựng.',
  },
  {
    id: 'q-b4-6',
    assignmentId: 'asg-b4',
    order: 6,
    taskName: '🕵️ THỬ THÁCH 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn nói về sự trung thực:\n\n🟢 An: “Chưa biết rõ thì mình không nên khẳng định.”\n🔵 Mai: “Làm sai thì nên nhận lỗi.”\n🟣 Minh: “Nói thật cũng cần đúng lúc và có thái độ phù hợp.”\n🔴 Nam: “Miễn điều mình nói là thật thì nói thế nào cũng được, người khác buồn cũng không sao.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Chưa biết rõ thì mình không nên khẳng định.”',
      B: 'Mai: “Làm sai thì nên nhận lỗi.”',
      C: 'Minh: “Nói thật cũng cần đúng lúc và có thái độ phù hợp.”',
      D: 'Nam: “Miễn điều mình nói là thật thì nói thế nào cũng được, người khác buồn cũng không sao.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Đây là điểm phân hóa quan trọng: SGK yêu cầu tôn trọng sự thật không chỉ là nói đúng sự thật mà còn cần thái độ dũng cảm, khéo léo, tinh tế và nhân ái, không làm tổn thương người khác một cách thô lỗ.',
  },
  {
    id: 'q-b4-7',
    assignmentId: 'asg-b4',
    order: 7,
    taskName: '🚦 THỬ THÁCH 7 — “ĐÈN XANH HAY ĐÈN ĐỎ?”',
    points: 10,
    content: 'Phân loại 6 hành động:\n\n🟢 TÔN TRỌNG SỰ THẬT  |  🔴 CHƯA TÔN TRỌNG SỰ THẬT\n\nCác thẻ:\n① Nhận lỗi khi làm hỏng đồ của bạn.\n② Thêm chi tiết không có thật để câu chuyện thú vị hơn.\n③ Đính chính khi phát hiện mình đã nói sai.\n④ Che giấu lỗi của bạn thân để bạn không bị nhắc nhở.\n⑤ Kiểm tra thông tin trước khi chia sẻ.\n⑥ Im lặng khi biết một bạn đang bị đổ oan dù mình có thể báo cho người có trách nhiệm.',
    options: {
      A: '🟢 Tôn trọng sự thật: (1, 3, 5)  ·  🔴 Chưa tôn trọng sự thật: (2, 4, 6)',
      B: '🟢 Tôn trọng sự thật: (1, 2, 5)  ·  🔴 Chưa tôn trọng sự thật: (3, 4, 6)',
      C: '🟢 Tôn trọng sự thật: (2, 4, 6)  ·  🔴 Chưa tôn trọng sự thật: (1, 3, 5)',
      D: '🟢 Tôn trọng sự thật: (3, 4, 5)  ·  🔴 Chưa tôn trọng sự thật: (1, 2, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chính xác: 🟢 1, 3, 5 | 🔴 2, 4, 6.\n- 🟢 Tôn trọng sự thật (1, 3, 5): Nhận lỗi khi làm hỏng đồ; Đính chính khi phát hiện mình nói sai; Kiểm tra thông tin trước khi chia sẻ.\n- 🔴 Chưa tôn trọng sự thật (2, 4, 6): Bịa thêm chi tiết; Che giấu lỗi cho bạn thân; Im lặng khi bạn bị oan.',
  },
  {
    id: 'q-b4-8',
    assignmentId: 'asg-b4',
    order: 8,
    taskName: '🏆 THỬ THÁCH 8 — BOSS LEVEL 🎭 “BẠN THÂN HAY SỰ THẬT?”',
    points: 15,
    content: 'Trong giờ ra chơi, Khoa vô ý làm hỏng một món đồ dùng chung của lớp. Khoa nói nhỏ với em: 😟 “Đừng nói với ai nhé! Cậu là bạn thân của mình mà!”\nMột lúc sau, cô giáo hỏi cả lớp chuyện gì đã xảy ra. Em sẽ làm gì?\n\n🔐 THỬ THÁCH TRÍ NHỚ 20 GIÂY — 4 CHÌA KHÓA CỦA SỰ THẬT:\n🧠 NGHĨ ĐÚNG ⬇ 💬 NÓI THẬT ⬇ 🤝 LÀM ĐÚNG ⬇ ❤️ KHÉO LÉO – CÓ TRÁCH NHIỆM\n→ 🤝 NIỀM TIN → ⚖️ CÔNG BẰNG → 🌱 CUỘC SỐNG TỐT ĐẸP\n\n💡 SGK: Tôn trọng sự thật bảo vệ điều đúng đắn, tránh nhầm lẫn oan sai, tạo niềm tin gắn kết con người.',
    options: {
      A: 'Nói một bạn khác làm để bảo vệ Khoa.',
      B: 'Im lặng hoàn toàn vì đã là bạn thì phải che giấu cho nhau.',
      C: 'Khuyên Khoa chủ động nói thật và nhận trách nhiệm; nếu cần, cùng bạn trình bày sự việc với cô.',
      D: 'Kể ngay chuyện của Khoa cho tất cả các lớp khác biết.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Khuyên Khoa chủ động nói thật và nhận trách nhiệm; nếu cần, cùng bạn trình bày sự việc với cô. Lựa chọn này vừa tôn trọng sự thật, vừa thể hiện tình bạn chân thành và trách nhiệm, giúp bạn dũng cảm nhận lỗi để tiến bộ.',
  },
];

db.questions.push(...questionsB4);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b4`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 4',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Tôn trọng sự thật" (Mã: CD6-B4, 8 thử thách, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 4 (CD6-B4) with 8 challenges into database.json!');
