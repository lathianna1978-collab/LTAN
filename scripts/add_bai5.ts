import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-5 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-5' && a.code !== 'CD6-B5');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b5');

// 2. Add asg-b5
const asgB5 = {
  id: 'asg-b5',
  lessonId: 'lesson-5',
  code: 'CD6-B5',
  title: '🚀✨ Phiếu học tập thông minh: Tự lập',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 5,
};

db.assignments.push(asgB5);

// 3. Add 8 questions for Bai 5
const questionsB5 = [
  {
    id: 'q-b5-1',
    assignmentId: 'asg-b5',
    order: 1,
    taskName: '⚡ THỬ THÁCH 1 — “TỰ LÀM” HAY “CHỜ NGƯỜI LÀM”?',
    points: 10,
    content: 'Chọn 3 hành động thể hiện tính tự lập:\n\n(1) ⏰ Tự đặt báo thức và chuẩn bị đi học đúng giờ.\n(2) 🎒 Quên sách thì yêu cầu bố mẹ mang đến trường ngay.\n(3) 📚 Chủ động hoàn thành bài tập trước khi chơi.\n(4) 🧹 Việc của mình nhưng chờ người khác nhắc mới làm.\n(5) 🍚 Tự làm những việc nhà vừa sức.\n(6) 📝 Gặp bài hơi khó là chép ngay bài của bạn.',
    options: {
      A: '(1), (3), (5) — ⏰ Tự đặt báo thức đúng giờ · 📚 Chủ động hoàn thành bài tập · 🍚 Tự làm việc nhà vừa sức',
      B: '(1), (2), (4) — ⏰ Tự đặt báo thức · 🎒 Quên sách đòi bố mẹ mang đến · 🧹 Chờ nhắc mới làm',
      C: '(2), (4), (6) — 🎒 Đòi bố mẹ mang sách · 🧹 Chờ nhắc mới làm · 📝 Chép bài bạn',
      D: '(3), (5), (6) — 📚 Chủ động làm bài · 🍚 Tự làm việc nhà · 📝 Chép bài bạn',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (5). Đây là những việc làm chủ động, tự giác hoàn thành bổn phận học tập và sinh hoạt của bản thân. Các hành vi (2), (4), (6) thể hiện sự ỷ lại, dựa dẫm hoặc gian lận.',
  },
  {
    id: 'q-b5-2',
    assignmentId: 'asg-b5',
    order: 2,
    taskName: '🧩 THỬ THÁCH 2 — KÉO THẢ “AI LÀM CHỦ?”',
    points: 15,
    content: 'Kéo từng thẻ vào đúng chiếc hộp:\n\n🚀 TỰ LẬP  |  💤 DỰA DẪM – Ỷ LẠI\n\nCác thẻ:\n(1) Tự sắp xếp góc học tập.\n(2) Luôn chờ bố mẹ chuẩn bị đồ dùng học tập.\n(3) Chủ động làm nhiệm vụ được giao.\n(4) Nhờ bạn làm hộ phần việc của mình.\n(5) Tự tìm cách giải quyết việc vừa sức.\n(6) Có thể tự làm nhưng vẫn đẩy cho người khác.',
    options: {
      A: '🚀 Tự lập: (1, 3, 5)  ·  💤 Dựa dẫm, ỷ lại: (2, 4, 6)',
      B: '🚀 Tự lập: (2, 4, 6)  ·  💤 Dựa dẫm, ỷ lại: (1, 3, 5)',
      C: '🚀 Tự lập: (1, 2, 5)  ·  💤 Dựa dẫm, ỷ lại: (3, 4, 6)',
      D: '🚀 Tự lập: (3, 5, 6)  ·  💤 Dựa dẫm, ỷ lại: (1, 2, 4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác:\n- 🚀 Tự lập (1, 3, 5): Tự sắp xếp góc học tập; Chủ động làm nhiệm vụ được giao; Tự tìm cách giải quyết việc vừa sức.\n- 💤 Dựa dẫm, ỷ lại (2, 4, 6): Chờ bố mẹ chuẩn bị đồ; Nhờ bạn làm hộ việc mình; Đẩy việc cho người khác.',
  },
  {
    id: 'q-b5-3',
    assignmentId: 'asg-b5',
    order: 3,
    taskName: '🔗 THỬ THÁCH 3 — NỐI ĐÚNG “NĂNG LỰC TỰ LẬP”',
    points: 10,
    content: 'Nối tình huống với biểu hiện phù hợp nhất:\n\nTình huống:\nA. Tự kiểm tra sách vở trước khi đến lớp\nB. Hoàn thành việc nhà mà không chờ nhắc\nC. Làm sai, chủ động sửa lỗi của mình\nD. Gặp việc vừa sức, thử tìm cách xử lí\n\n↔️ Biểu hiện:\n① Tự giải quyết\n② Tự chịu trách nhiệm\n③ Tự chuẩn bị\n④ Tự giác\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ③ (Tự chuẩn bị) · B → ④ (Tự giác) · C → ② (Tự chịu trách nhiệm) · D → ① (Tự giải quyết)',
      B: 'A → ① (Tự giải quyết) · B → ② (Tự chịu trách nhiệm) · C → ④ (Tự giác) · D → ③ (Tự chuẩn bị)',
      C: 'A → ④ (Tự giác) · B → ③ (Tự chuẩn bị) · C → ① (Tự giải quyết) · D → ② (Tự chịu trách nhiệm)',
      D: 'A → ② (Tự chịu trách nhiệm) · B → ① (Tự giải quyết) · C → ③ (Tự chuẩn bị) · D → ④ (Tự giác)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–3; B–4; C–2; D–1:\n- A → ③: Tự kiểm tra sách vở trước khi đến lớp = Tự chuẩn bị.\n- B → ④: Hoàn thành việc nhà không cần nhắc = Tự giác.\n- C → ②: Làm sai chủ động sửa lỗi = Tự chịu trách nhiệm.\n- D → ①: Gặp việc vừa sức, thử tìm cách xử lí = Tự giải quyết.',
  },
  {
    id: 'q-b5-4',
    assignmentId: 'asg-b5',
    order: 4,
    taskName: '🧠 THỬ THÁCH 4 — GIẢI MÃ “CÔNG THỨC TỰ LẬP”',
    points: 15,
    content: 'Kéo 4 từ khóa: (TỰ GIÁC • DỰA DẪM • TỰ LẬP • KHẢ NĂNG)\n\n"🚀 __________ (1) là chủ động, __________ (2) làm những công việc bằng __________ (3) của mình, không __________ (4), ỷ lại vào người khác."\n\n💡 SGK GDCD 6: Tự làm nhiệm vụ, không chép bài, chủ động làm việc nhà và tự giác trong học tập.',
    options: {
      A: '(1) TỰ LẬP → (2) TỰ GIÁC → (3) KHẢ NĂNG → (4) DỰA DẪM',
      B: '(1) TỰ GIÁC → (2) TỰ LẬP → (3) DỰA DẪM → (4) KHẢ NĂNG',
      C: '(1) TỰ LẬP → (2) KHẢ NĂNG → (3) TỰ GIÁC → (4) DỰA DẪM',
      D: '(1) KHẢ NĂNG → (2) TỰ LẬP → (3) TỰ GIÁC → (4) DỰA DẪM',
    },
    correctOption: 'A',
    explanation: '✅ Định nghĩa cốt lõi trong SGK:\n"🚀 TỰ LẬP là chủ động, TỰ GIÁC làm những công việc bằng KHẢ NĂNG của mình, không DỰA DẪM, ỷ lại vào người khác."',
  },
  {
    id: 'q-b5-5',
    assignmentId: 'asg-b5',
    order: 5,
    taskName: '⚡ THỬ THÁCH 5 — ĐÚNG HAY SAI?',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Tự lập nghĩa là việc gì cũng phải tự làm, tuyệt đối không được nhờ ai giúp.\n② Việc nằm trong khả năng của mình thì nên chủ động thực hiện.\n③ Tự lập chỉ cần thiết khi đã trưởng thành.\n④ Biết chịu trách nhiệm với nhiệm vụ của mình là biểu hiện của tự lập.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Sai – Đúng.\n- ① Sai: Tự lập không có nghĩa là cô lập; khi gặp việc quá khả năng vẫn có thể học hỏi, xin hướng dẫn.\n- ② Đúng: Việc trong khả năng phải chủ động tự làm.\n- ③ Sai: Tự lập cần rèn luyện ngay từ nhỏ, từ những việc đơn giản hàng ngày.\n- ④ Đúng: Dám chịu trách nhiệm là cốt lõi của tính tự lập.',
  },
  {
    id: 'q-b5-6',
    assignmentId: 'asg-b5',
    order: 6,
    taskName: '🕵️ THỬ THÁCH 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn chia sẻ về tự lập:\n\n🚀 An: “Việc của mình, mình cố gắng chủ động hoàn thành.”\n🎯 Mai: “Chưa biết làm, mình có thể hỏi cách rồi tự thực hiện.”\n🌱 Minh: “Mình tập làm những việc phù hợp với khả năng.”\n😎 Nam: “Có bố mẹ làm giúp thì mình chẳng cần học cách tự làm.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Việc của mình, mình cố gắng chủ động hoàn thành.”',
      B: 'Mai: “Chưa biết làm, mình có thể hỏi cách rồi tự thực hiện.”',
      C: 'Minh: “Mình tập làm những việc phù hợp với khả năng.”',
      D: 'Nam: “Có bố mẹ làm giúp thì mình chẳng cần học cách tự làm.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Suy nghĩ của Nam là biểu hiện của sự ỷ lại, lười biếng và dựa dẫm vào bố mẹ. Thái độ này khiến bản thân không phát triển được kỹ năng sống và thiếu bản lĩnh khi trưởng thành.',
  },
  {
    id: 'q-b5-7',
    assignmentId: 'asg-b5',
    order: 7,
    taskName: '🪜 THỬ THÁCH 7 — XÂY “CẦU THANG TỰ LẬP”',
    points: 10,
    content: 'Sắp xếp 4 thẻ thành một quá trình rèn luyện hợp lí:\n(💪 TỰ TIN HƠN · 🎯 NHẬN NHIỆM VỤ · 🚀 CHỦ ĐỘNG THỰC HIỆN · 🌱 NĂNG LỰC TIẾN BỘ)\n\nCầu thang của em:\n① __________ ⬇️ ② __________ ⬇️ ③ __________ ⬇️ ④ __________ 🏆',
    options: {
      A: '① NHẬN NHIỆM VỤ → ② CHỦ ĐỘNG THỰC HIỆN → ③ NĂNG LỰC TIẾN BỘ → ④ TỰ TIN HƠN 🏆',
      B: '① CHỦ ĐỘNG THỰC HIỆN → ② NHẬN NHIỆM VỤ → ③ TỰ TIN HƠN → ④ NĂNG LỰC TIẾN BỘ 🏆',
      C: '① NHẬN NHIỆM VỤ → ② TỰ TIN HƠN → ③ CHỦ ĐỘNG THỰC HIỆN → ④ NĂNG LỰC TIẾN BỘ 🏆',
      D: '① NĂNG LỰC TIẾN BỘ → ② NHẬN NHIỆM VỤ → ③ CHỦ ĐỘNG THỰC HIỆN → ④ TỰ TIN HƠN 🏆',
    },
    correctOption: 'A',
    explanation: '✅ Thứ tự tiến trình đúng: Nhận nhiệm vụ được giao → Chủ động thực hiện bằng khả năng của mình → Rèn luyện giúp năng lực ngày càng tiến bộ → Bản thân trở nên vững vàng và tự tin hơn trong cuộc sống.',
  },
  {
    id: 'q-b5-8',
    assignmentId: 'asg-b5',
    order: 8,
    taskName: '🏆 THỬ THÁCH 8 — BOSS LEVEL 🎭 “TỰ LẬP CÓ PHẢI TỰ LÀM TẤT CẢ?”',
    points: 15,
    content: 'Cô giáo giao cho Khánh làm một bài thuyết trình. Khánh chưa biết cách tạo biểu đồ trên máy tính. Bạn nghĩ: 😟 “Nếu hỏi người khác thì mình không còn là người tự lập nữa!”\n\nKhánh nên làm gì?\n\n🔐 THỬ THÁCH TRÍ NHỚ 20 GIÂY — “DNA CỦA NGƯỜI TỰ LẬP”:\n🎯 VIỆC CỦA MÌNH ⬇ 🚀 CHỦ ĐỘNG ⬇ 💪 TỰ LÀM TRONG KHẢ NĂNG ⬇ 🧭 CHỊU TRÁCH NHIỆM ⬇ 🌱 TRƯỞNG THÀNH HƠN\n\n🔑 Công thức nhớ nhanh: TỰ LẬP = CHỦ ĐỘNG + TỰ GIÁC + TỰ THỰC HIỆN + KHÔNG Ỷ LẠI.\n(Lưu ý: Nhờ hướng dẫn cách làm ≠ Dựa dẫm)',
    options: {
      A: 'Không hỏi ai và bỏ luôn phần biểu đồ.',
      B: 'Nhờ bạn làm toàn bộ bài thuyết trình hộ.',
      C: 'Tìm hướng dẫn hoặc hỏi cách thực hiện, sau đó tự làm phần việc của mình.',
      D: 'Chép nguyên bài của một bạn khác.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Tìm hướng dẫn hoặc hỏi cách thực hiện, sau đó tự làm phần việc của mình. Nhờ người khác chỉ dẫn cách làm là hành vi học hỏi tích cực, không phải là dựa dẫm. Điểm quyết định của tự lập là bạn tự chịu trách nhiệm và trực tiếp hoàn thành nhiệm vụ của chính mình.',
  },
];

db.questions.push(...questionsB5);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b5`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 5',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Tự lập" (Mã: CD6-B5, 8 thử thách, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 5 (CD6-B5) with 8 challenges into database.json!');
