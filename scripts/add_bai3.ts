import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-3 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-3' && a.code !== 'CD6-B3');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b3');

// 2. Add asg-b3
const asgB3 = {
  id: 'asg-b3',
  lessonId: 'lesson-3',
  code: 'CD6-B3',
  title: '🚀✨ Phiếu học tập thông minh: Siêng năng, kiên trì',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 3,
};

db.assignments.push(asgB3);

// 3. Add 8 questions for Bai 3
const questionsB3 = [
  {
    id: 'q-b3-1',
    assignmentId: 'asg-b3',
    order: 1,
    taskName: '⚡ NHIỆM VỤ 1 — AI ĐANG THỰC SỰ CỐ GẮNG?',
    points: 10,
    content: 'Chọn 3 hành động thể hiện siêng năng, kiên trì:\n\n(1) 📚 Mỗi ngày Nam dành 20 phút ôn lại bài.\n(2) 🎸 Vy tập đàn hai hôm, thấy khó nên bỏ.\n(3) 🏃 Minh duy trì chạy bộ theo kế hoạch mỗi sáng.\n(4) 🧮 Hà làm mãi chưa ra bài toán nên xem ngay đáp án.\n(5) ✍️ Chữ chưa đẹp, An luyện thêm từng ngày.\n(6) 🎮 Tuấn chỉ học khi bố mẹ nhắc.',
    options: {
      A: '(1), (3), (5) — 📚 Nam (ôn bài 20p mỗi ngày) · 🏃 Minh (chạy bộ theo kế hoạch) · ✍️ An (luyện chữ thêm từng ngày)',
      B: '(1), (2), (4) — 📚 Nam · 🎸 Vy (thấy khó nên bỏ) · 🧮 Hà (xem ngay đáp án)',
      C: '(2), (4), (6) — 🎸 Vy · 🧮 Hà · 🎮 Tuấn (chỉ học khi bố mẹ nhắc)',
      D: '(3), (5), (6) — 🏃 Minh · ✍️ An · 🎮 Tuấn (chỉ học khi bố mẹ nhắc)',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (5) (Nam – Minh – An). Đây là những hành động thể hiện việc làm đều đặn, tự giác và không nản chí trước khó khăn. Các bạn Vy, Hà, Tuấn thể hiện sự lười biếng, ỷ lại hoặc nhanh nản lòng.',
  },
  {
    id: 'q-b3-2',
    assignmentId: 'asg-b3',
    order: 2,
    taskName: '🧩 NHIỆM VỤ 2 — KÉO THẢ “BẮT ĐÚNG TÍNH CÁCH”',
    points: 15,
    content: 'Kéo từng thẻ vào đúng vùng:\n\n🔵 SIÊNG NĂNG  |  🟠 KIÊN TRÌ\n\nCác thẻ:\n(1) Làm việc đều đặn\n(2) Không bỏ cuộc khi gặp khó\n(3) Tự giác hoàn thành nhiệm vụ\n(4) Thử lại sau khi thất bại\n(5) Chăm chỉ, cần cù\n(6) Quyết tâm làm đến cùng\n\n💡 Mẹo nhớ:\nSIÊNG NĂNG → Đều đặn\nKIÊN TRÌ → Đến cùng',
    options: {
      A: '🔵 Siêng năng: (1, 3, 5)  ·  🟠 Kiên trì: (2, 4, 6)',
      B: '🔵 Siêng năng: (2, 4, 6)  ·  🟠 Kiên trì: (1, 3, 5)',
      C: '🔵 Siêng năng: (1, 2, 3)  ·  🟠 Kiên trì: (4, 5, 6)',
      D: '🔵 Siêng năng: (3, 4, 5)  ·  🟠 Kiên trì: (1, 2, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chính xác:\n- 🔵 Siêng năng (1, 3, 5): Làm việc đều đặn; Tự giác hoàn thành nhiệm vụ; Chăm chỉ, cần cù.\n- 🟠 Kiên trì (2, 4, 6): Không bỏ cuộc khi gặp khó; Thử lại sau khi thất bại; Quyết tâm làm đến cùng.',
  },
  {
    id: 'q-b3-3',
    assignmentId: 'asg-b3',
    order: 3,
    taskName: '🔗 NHIỆM VỤ 3 — NỐI NHANH: TÌNH HUỐNG ↔ BIỂU HIỆN',
    points: 10,
    content: 'Nối mỗi tình huống với biểu hiện phù hợp nhất:\n\nTình huống:\nA. Ngày nào cũng dành thời gian đọc sách\nB. Làm sai vẫn sửa và thử lại\nC. Tự học mà không cần người lớn nhắc\nD. Gặp bài khó vẫn tìm cách giải tiếp\n\n↔️ Biểu hiện:\n① Không nản chí\n② Tự giác\n③ Thường xuyên\n④ Quyết tâm\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ③ (Thường xuyên) · B → ① (Không nản chí) · C → ② (Tự giác) · D → ④ (Quyết tâm)',
      B: 'A → ① (Không nản chí) · B → ③ (Thường xuyên) · C → ④ (Quyết tâm) · D → ② (Tự giác)',
      C: 'A → ② (Tự giác) · B → ④ (Quyết tâm) · C → ③ (Thường xuyên) · D → ① (Không nản chí)',
      D: 'A → ④ (Quyết tâm) · B → ② (Tự giác) · C → ① (Không nản chí) · D → ③ (Thường xuyên)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–3, B–1, C–2, D–4:\n- A → ③: Ngày nào cũng đọc sách = Thường xuyên.\n- B → ①: Làm sai vẫn sửa và thử lại = Không nản chí.\n- C → ②: Tự học không đợi nhắc = Tự giác.\n- D → ④: Gặp bài khó vẫn tìm cách giải = Quyết tâm.',
  },
  {
    id: 'q-b3-4',
    assignmentId: 'asg-b3',
    order: 4,
    taskName: '🧠 NHIỆM VỤ 4 — GIẢI MÃ CÔNG THỨC',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng chỗ:\n(ĐỀU ĐẶN • ĐẾN CÙNG • SIÊNG NĂNG • KIÊN TRÌ)\n\n🔵 __________ (1) = cần cù + tự giác + làm việc __________ (2)\n🟠 __________ (3) = quyết tâm thực hiện __________ (4) dù gặp khó khăn\n\n🔐 Phần ghi nhớ SGK GDCD 6: Siêng năng là cần cù, tự giác, làm việc đều đặn; Kiên trì là quyết tâm thực hiện đến cùng.',
    options: {
      A: '(1) SIÊNG NĂNG → (2) ĐỀU ĐẶN → (3) KIÊN TRÌ → (4) ĐẾN CÙNG',
      B: '(1) KIÊN TRÌ → (2) ĐẾN CÙNG → (3) SIÊNG NĂNG → (4) ĐỀU ĐẶN',
      C: '(1) SIÊNG NĂNG → (2) ĐẾN CÙNG → (3) KIÊN TRÌ → (4) ĐỀU ĐẶN',
      D: '(1) ĐỀU ĐẶN → (2) SIÊNG NĂNG → (3) ĐẾN CÙNG → (4) KIÊN TRÌ',
    },
    correctOption: 'A',
    explanation: '✅ Công thức hoàn chỉnh:\n- 🔵 SIÊNG NĂNG = cần cù + tự giác + làm việc ĐỀU ĐẶN\n- 🟠 KIÊN TRÌ = quyết tâm thực hiện ĐẾN CÙNG dù gặp khó khăn.',
  },
  {
    id: 'q-b3-5',
    assignmentId: 'asg-b3',
    order: 5,
    taskName: '⚡ NHIỆM VỤ 5 — ĐÚNG HAY SAI?',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① Chỉ cần học thật nhiều vào ngày trước khi kiểm tra cũng được coi là siêng năng.\n② Gặp bài khó, thử nhiều cách khác nhau để giải là biểu hiện của kiên trì.\n③ Siêng năng cần được thể hiện bằng sự thường xuyên, đều đặn.\n④ Kiên trì nghĩa là dù cách làm đang sai vẫn phải làm y hệt đến cùng.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Đúng – Sai.\n- ① Sai: Học dồn vào một ngày trước khi thi là học đối phó, không phải siêng năng.\n- ② Đúng: Thử nhiều cách để giải quyết khó khăn là kiên trì có trí tuệ.\n- ③ Đúng: Siêng năng luôn gắn với tính thường xuyên, đều đặn mỗi ngày.\n- ④ Sai: Kiên trì không có nghĩa là cố chấp làm theo cách sai; cần biết rút kinh nghiệm và điều chỉnh hợp lý.',
  },
  {
    id: 'q-b3-6',
    assignmentId: 'asg-b3',
    order: 6,
    taskName: '🕵️ NHIỆM VỤ 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn cùng chia sẻ bí quyết học tập:\n\n📚 An: “Mình chia bài thành từng phần nhỏ và học đều mỗi ngày.”\n🎯 Mai: “Chưa làm được, mình sẽ xem lại lỗi rồi thử cách khác.”\n🌱 Minh: “Mình đặt mục tiêu rồi cố gắng hoàn thành.”\n⚡ Nam: “Chỉ cần hôm nào có hứng thì học thật nhiều là đủ.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Mình chia bài thành từng phần nhỏ và học đều mỗi ngày.”',
      B: 'Mai: “Chưa làm được, mình sẽ xem lại lỗi rồi thử cách khác.”',
      C: 'Minh: “Mình đặt mục tiêu rồi cố gắng hoàn thành.”',
      D: 'Nam: “Chỉ cần hôm nào có hứng thì học thật nhiều là đủ.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). Việc học tùy hứng không mang lại hiệu quả bền vững; siêng năng đòi hỏi sự kiên trì và kỷ luật làm việc đều đặn mỗi ngày chứ không phụ thuộc vào cảm hứng nhất thời.',
  },
  {
    id: 'q-b3-7',
    assignmentId: 'asg-b3',
    order: 7,
    taskName: '🪜 NHIỆM VỤ 7 — XÂY “CẦU THANG THÀNH CÔNG”',
    points: 10,
    content: 'Sắp xếp 4 thẻ theo một quá trình rèn luyện hợp lí:\n(🏆 ĐẠT KẾT QUẢ · 💪 KIÊN TRÌ THỰC HIỆN · 🎯 XÁC ĐỊNH MỤC TIÊU · 📅 LÀM VIỆC ĐỀU ĐẶN)\n\n① __________ ⬇️ ② __________ ⬇️ ③ __________ ⬇️ ④ __________ 🏆',
    options: {
      A: '① XÁC ĐỊNH MỤC TIÊU → ② LÀM VIỆC ĐỀU ĐẶN → ③ KIÊN TRÌ THỰC HIỆN → ④ ĐẠT KẾT QUẢ 🏆',
      B: '① LÀM VIỆC ĐỀU ĐẶN → ② XÁC ĐỊNH MỤC TIÊU → ③ KIÊN TRÌ THỰC HIỆN → ④ ĐẠT KẾT QUẢ 🏆',
      C: '① KIÊN TRÌ THỰC HIỆN → ② XÁC ĐỊNH MỤC TIÊU → ③ LÀM VIỆC ĐỀU ĐẶN → ④ ĐẠT KẾT QUẢ 🏆',
      D: '① XÁC ĐỊNH MỤC TIÊU → ② KIÊN TRÌ THỰC HIỆN → ③ ĐẠT KẾT QUẢ → ④ LÀM VIỆC ĐỀU ĐẶN 🏆',
    },
    correctOption: 'A',
    explanation: '✅ Thứ tự quá trình chuẩn: Xác định mục tiêu rõ ràng → Lên kế hoạch và làm việc đều đặn (siêng năng) → Kiên trì thực hiện, vượt qua khó khăn → Đạt được kết quả và thành công tốt đẹp.',
  },
  {
    id: 'q-b3-8',
    assignmentId: 'asg-b3',
    order: 8,
    taskName: '🏆 NHIỆM VỤ 8 — BOSS LEVEL 🎭 “7 NGÀY LÀ BỎ?”',
    points: 15,
    content: 'Linh muốn học bơi. Ngày đầu, Linh rất hào hứng. Sau một tuần, Linh vẫn chưa bơi được và nói:\n😩 “Mình không có năng khiếu. Nghỉ thôi!”\n\nBạn thân đưa ra 4 lời khuyên. Theo em, lời khuyên nào TỐT NHẤT?\n\n🔐 THỬ THÁCH TRÍ NHỚ — 20 GIÂY KHÓA CHẶT BÀI HỌC:\n🔵 SIÊNG NĂNG ⬇ 📅 THƯỜNG XUYÊN – ĐỀU ĐẶN\n+ 🟠 KIÊN TRÌ ⬇ 💪 KHÔNG BỎ CUỘC – LÀM ĐẾN CÙNG\n= 🏆 TIẾN BỘ – KẾT QUẢ TỐT – THÀNH CÔNG',
    options: {
      A: '“Ừ, khó quá thì bỏ đi!”',
      B: '“Ngày mai tập thật nhiều 4 tiếng để bù lại.”',
      C: '“Cứ làm đúng y như cũ mãi rồi sẽ được.”',
      D: '“Xem mình đang sai ở đâu, nhờ hướng dẫn, điều chỉnh cách tập và tiếp tục luyện đều đặn.”',
    },
    correctOption: 'D',
    explanation: '✅ Lời khuyên tốt nhất: D — Xem mình đang sai ở đâu, nhờ hướng dẫn, điều chỉnh cách tập và tiếp tục luyện đều đặn. Lời khuyên này kết hợp toàn diện giữa sự siêng năng (luyện đều đặn), kiên trì (không bỏ cuộc) và phương pháp học tập khoa học, đúng đắn.',
  },
];

db.questions.push(...questionsB3);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b3`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 3',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Siêng năng, kiên trì" (Mã: CD6-B3, 8 nhiệm vụ, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 3 (CD6-B3) with 8 missions into database.json!');
