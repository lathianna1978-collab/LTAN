import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-8 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-8' && a.code !== 'CD6-B8');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b8');

// 2. Add asg-b8
const asgB8 = {
  id: 'asg-b8',
  lessonId: 'lesson-8',
  code: 'CD6-B8',
  title: '💰🌱 Phiếu học tập thông minh: Tiết kiệm',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 8,
};

db.assignments.push(asgB8);

// 3. Add 8 questions for Bai 8
const questionsB8 = [
  {
    id: 'q-b8-1',
    assignmentId: 'asg-b8',
    order: 1,
    taskName: '⚡ THỬ THÁCH 1 — “TIẾT KIỆM HAY LÃNG PHÍ?”',
    points: 10,
    content: 'Chọn 4 hành động thể hiện tiết kiệm:\n\n(1) 💡 Ra khỏi phòng, tắt thiết bị điện không cần sử dụng.\n(2) 📒 Vở còn nhiều trang trắng nhưng đổi vở mới vì thích mẫu bìa khác.\n(3) 💧 Khóa vòi nước ngay sau khi sử dụng.\n(4) ⏰ Lập kế hoạch để hoàn thành bài đúng thời gian.\n(5) 🛍️ Thấy món đồ đang giảm giá nên mua dù không cần.\n(6) ✏️ Giữ gìn và sử dụng đồ dùng học tập còn tốt.',
    options: {
      A: '(1), (3), (4), (6) — 💡 Tắt điện khi ra khỏi phòng · 💧 Khóa vòi nước sau khi dùng · ⏰ Lập kế hoạch học tập · ✏️ Giữ gìn đồ dùng học tập',
      B: '(1), (2), (3), (4) — 💡 Tắt điện · 📒 Đổi vở mới khi còn trang trắng · 💧 Khóa vòi nước · ⏰ Lập kế hoạch',
      C: '(2), (4), (5), (6) — 📒 Đổi vở vì thích bìa · ⏰ Lập kế hoạch · 🛍️ Mua đồ giảm giá dù không cần · ✏️ Giữ gìn đồ dùng',
      D: '(1), (3), (5), (6) — 💡 Tắt điện · 💧 Khóa vòi nước · 🛍️ Mua đồ giảm giá dù không cần · ✏️ Giữ gìn đồ dùng',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (4), (6). Đây là các hành động tiết kiệm điện năng, nguồn nước, thời gian học tập và giữ gìn đồ dùng học tập. Các hành vi (2) và (5) là lãng phí tiền bạc và của cải vật chất khi mua sắm theo sở thích mà không thực sự cần thiết.',
  },
  {
    id: 'q-b8-2',
    assignmentId: 'asg-b8',
    order: 2,
    taskName: '🧩 THỬ THÁCH 2 — KÉO THẢ “4 CHIẾC VÍ TIẾT KIỆM”',
    points: 15,
    content: 'Kéo mỗi hành động vào đúng chiếc ví:\n\n💰 TIỀN BẠC  |  ⏰ THỜI GIAN  |  💧 ĐIỆN – NƯỚC  |  🎒 ĐỒ DÙNG\n\nCác thẻ:\n(1) 🛒 Chỉ mua món đồ thực sự cần.\n(2) 📅 Làm việc theo kế hoạch.\n(3) 🚰 Khóa vòi nước khi không dùng.\n(4) 📚 Giữ sách để có thể sử dụng lâu dài.\n(5) 💡 Tắt đèn khi ra khỏi phòng.\n(6) 🎮 Không để trò chơi chiếm hết thời gian học.',
    options: {
      A: '💰 Tiền bạc: (1) · ⏰ Thời gian: (2, 6) · 💧 Điện – Nước: (3, 5) · 🎒 Đồ dùng: (4)',
      B: '💰 Tiền bạc: (1, 4) · ⏰ Thời gian: (2) · 💧 Điện – Nước: (3, 5) · 🎒 Đồ dùng: (6)',
      C: '💰 Tiền bạc: (3, 5) · ⏰ Thời gian: (2, 6) · 💧 Điện – Nước: (1) · 🎒 Đồ dùng: (4)',
      D: '💰 Tiền bạc: (1) · ⏰ Thời gian: (3, 5) · 💧 Điện – Nước: (2, 6) · 🎒 Đồ dùng: (4)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác theo SGK GDCD 6:\n- 💰 Tiền bạc: (1) Chỉ mua món đồ thực sự cần.\n- ⏰ Thời gian: (2) Làm việc theo kế hoạch; (6) Không để trò chơi chiếm hết thời gian học.\n- 💧 Điện – Nước: (3) Khóa vòi nước khi không dùng; (5) Tắt đèn khi ra khỏi phòng.\n- 🎒 Đồ dùng: (4) Giữ sách để có thể sử dụng lâu dài.',
  },
  {
    id: 'q-b8-3',
    assignmentId: 'asg-b8',
    order: 3,
    taskName: '🔗 THỬ THÁCH 3 — NỐI “VIỆC NHỎ → GIÁ TRỊ LỚN”',
    points: 10,
    content: 'Nối hành động với giá trị phù hợp nhất:\n\nHành động:\nA. Bảo quản đồ dùng cẩn thận\nB. Không mua đồ chỉ vì chạy theo bạn bè\nC. Hoàn thành việc đúng kế hoạch\nD. Không để nước chảy vô ích\n\n↔️ Giá trị phù hợp nhất:\n① Sử dụng thời gian hợp lí\n② Tránh hao phí tài nguyên\n③ Kéo dài thời gian sử dụng\n④ Chi tiêu hợp lí\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ③ (Kéo dài thời gian sử dụng) · B → ④ (Chi tiêu hợp lí) · C → ① (Sử dụng thời gian hợp lí) · D → ② (Tránh hao phí tài nguyên)',
      B: 'A → ① (Sử dụng thời gian hợp lí) · B → ② (Tránh hao phí tài nguyên) · C → ③ (Kéo dài thời gian sử dụng) · D → ④ (Chi tiêu hợp lí)',
      C: 'A → ④ (Chi tiêu hợp lí) · B → ③ (Kéo dài thời gian sử dụng) · C → ① (Sử dụng thời gian hợp lí) · D → ② (Tránh hao phí tài nguyên)',
      D: 'A → ③ (Kéo dài thời gian sử dụng) · B → ① (Sử dụng thời gian hợp lí) · C → ④ (Chi tiêu hợp lí) · D → ② (Tránh hao phí tài nguyên)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–3, B–4, C–1, D–2:\n- A → ③: Bảo quản đồ dùng cẩn thận = Kéo dài thời gian sử dụng.\n- B → ④: Không mua đồ chạy theo bạn bè = Chi tiêu hợp lí.\n- C → ①: Hoàn thành việc đúng kế hoạch = Sử dụng thời gian hợp lí.\n- D → ②: Không để nước chảy vô ích = Tránh hao phí tài nguyên.',
  },
  {
    id: 'q-b8-4',
    assignmentId: 'asg-b8',
    order: 4,
    taskName: '🧠 THỬ THÁCH 4 — GIẢI MÃ “DNA TIẾT KIỆM”',
    points: 15,
    content: 'Kéo 4 từ khóa vào đúng vị trí:\n(HỢP LÍ • ĐÚNG MỨC • THỜI GIAN • SỨC LỰC)\n\n"💡 Tiết kiệm là biết sử dụng một cách __________ (1), __________ (2) của cải vật chất, __________ (3) và __________ (4) của mình cũng như của người khác."\n\n🔐 Mẹo nhớ: TIẾT KIỆM không phải “DÙNG ÍT NHẤT” mà là 🎯 DÙNG ĐÚNG – DÙNG ĐỦ – DÙNG HỢP LÍ.',
    options: {
      A: '(1) HỢP LÍ → (2) ĐÚNG MỨC → (3) THỜI GIAN → (4) SỨC LỰC',
      B: '(1) ĐÚNG MỨC → (2) HỢP LÍ → (3) SỨC LỰC → (4) THỜI GIAN',
      C: '(1) HỢP LÍ → (2) THỜI GIAN → (3) ĐÚNG MỨC → (4) SỨC LỰC',
      D: '(1) THỜI GIAN → (2) SỨC LỰC → (3) HỢP LÍ → (4) ĐÚNG MỨC',
    },
    correctOption: 'A',
    explanation: '✅ Khái niệm chuẩn mực SGK GDCD 6:\n"💡 Tiết kiệm là biết sử dụng một cách HỢP LÍ, ĐÚNG MỨC của cải vật chất, THỜI GIAN và SỨC LỰC của mình cũng như của người khác."',
  },
  {
    id: 'q-b8-5',
    assignmentId: 'asg-b8',
    order: 5,
    taskName: '⚡ THỬ THÁCH 5 — ĐÚNG HAY SAI? 🧨 “BẪY TƯ DUY”',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① 💰 Tiết kiệm nghĩa là càng ít tiêu tiền càng tốt.\n② ⏰ Không sử dụng thời gian hợp lí cũng là một dạng lãng phí.\n③ 🎒 Giữ gìn đồ dùng để sử dụng được lâu hơn là biểu hiện của tiết kiệm.\n④ 💧 Điện, nước và các tài nguyên khác cũng cần được sử dụng hợp lí.',
    options: {
      A: '① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      B: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      C: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Sai – Đúng – Đúng – Đúng:\n- ① Sai: Tiết kiệm không phải keo kiệt bủn xỉn; những việc cần thiết chính đáng thì vẫn cần chi tiêu hợp lí.\n- ② Đúng: Thời gian trôi qua không lấy lại được, lãng phí thời gian cũng là lãng phí tài sản quý giá.\n- ③ Đúng: Bảo quản đồ dùng giúp tăng tuổi thọ và giảm chi phí mua sắm.\n- ④ Đúng: Nguồn điện, nước là tài nguyên hữu hạn cần sử dụng có ý thức và đúng mức.',
  },
  {
    id: 'q-b8-6',
    assignmentId: 'asg-b8',
    order: 6,
    taskName: '🕵️ THỬ THÁCH 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Bốn bạn chia sẻ bí quyết tiết kiệm:\n\n🟢 An: “Mình suy nghĩ xem có thực sự cần trước khi mua.”\n🔵 Mai: “Đồ còn dùng tốt thì mình tiếp tục sử dụng.”\n🟣 Minh: “Mình cố gắng sử dụng thời gian theo kế hoạch.”\n🔴 Nam: “Muốn tiết kiệm thì tốt nhất không nên chi tiền cho bất cứ việc gì.”\n\n🔍 Ai có suy nghĩ CHƯA HỢP LÍ?',
    options: {
      A: 'An: “Mình suy nghĩ xem có thực sự cần trước khi mua.”',
      B: 'Mai: “Đồ còn dùng tốt thì mình tiếp tục sử dụng.”',
      C: 'Minh: “Mình cố gắng sử dụng thời gian theo kế hoạch.”',
      D: 'Nam: “Muốn tiết kiệm thì tốt nhất không nên chi tiền cho bất cứ việc gì.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). 🧠 Bẫy nằm ở chỗ: TIẾT KIỆM ≠ KHÔNG CHI TIÊU. Tiết kiệm không phải là bủn xỉn, keo kiệt nhịn ăn nhịn mặc hay từ chối chi tiêu các khoản cần thiết cho học tập, sức khỏe; mấu chốt là: CẦN THIẾT ➔ HỢP LÍ ➔ ĐÚNG MỨC.',
  },
  {
    id: 'q-b8-7',
    assignmentId: 'asg-b8',
    order: 7,
    taskName: '🚦 THỬ THÁCH 7 — “ĐÈN XANH, ĐÈN VÀNG, ĐÈN ĐỎ”',
    points: 10,
    content: 'Phân loại 6 hành động:\n\n🟢 TIẾT KIỆM  |  🔴 LÃNG PHÍ / SAI LỆCH\n\nCác thẻ:\n① Dùng lại mặt giấy còn trắng để nháp.\n② Không mua thuốc khi bị bệnh vì muốn giữ tiền.\n③ Mua thêm một hộp bút dù ở nhà đã có nhiều hộp còn tốt.\n④ Dùng tiền để mua cuốn sách thực sự cần cho học tập.\n⑤ Tắt thiết bị điện khi không sử dụng.\n⑥ Nhịn ăn sáng để dành tiền mua món đồ mình thích.\n\n💡 Điểm phân hóa: Có chi tiền chưa chắc là lãng phí; không chi tiền chưa chắc là tiết kiệm.',
    options: {
      A: '🟢 Tiết kiệm: (1, 4, 5) · 🔴 Lãng phí / Sai lệch: (2, 3, 6)',
      B: '🟢 Tiết kiệm: (1, 2, 4) · 🔴 Lãng phí / Sai lệch: (3, 5, 6)',
      C: '🟢 Tiết kiệm: (4, 5, 6) · 🔴 Lãng phí / Sai lệch: (1, 2, 3)',
      D: '🟢 Tiết kiệm: (1, 5) · 🔴 Lãng phí / Sai lệch: (2, 3, 4, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chuẩn xác: 🟢 (1, 4, 5) | 🔴 (2, 3, 6):\n- 🟢 Tiết kiệm (1, 4, 5): Tái sử dụng giấy nháp; Mua sách cần thiết cho học tập; Tắt điện khi không dùng.\n- 🔴 Lãng phí / Sai lệch (2, 3, 6): Không mua thuốc khi bệnh (keo kiệt hại sức khỏe); Mua thừa hộp bút (lãng phí của cải); Nhịn ăn sáng để mua đồ (sai lầm gây hại cơ thể).',
  },
  {
    id: 'q-b8-8',
    assignmentId: 'asg-b8',
    order: 8,
    taskName: '🏆 THỬ THÁCH 8 — BOSS LEVEL 🎮 “GIẢM 50% — MUA HAY KHÔNG?”',
    points: 15,
    content: 'Hà đã có một chiếc bình nước còn rất tốt. Khi đi siêu thị, Hà thấy một chiếc bình mới rất đẹp với bảng: 🔥 SALE 50% – CHỈ HÔM NAY! Bạn Hà nói: 😍 “Giảm một nửa giá rồi! Mua ngay mới là tiết kiệm!”\n\nHà nên làm gì?\n\n🎁 BONUS “5 GIÂY QUYẾT ĐỊNH”:\n💰 Đồ rất rẻ nhưng không cần ➔ KHÔNG MUA\n💧 Đang đánh răng ➔ KHÓA VÒI\n⏰ 30 phút trước giờ học ➔ CHỌN VIỆC CẦN LÀM\n🎒 Bút vẫn dùng tốt ➔ DÙNG TIẾP\n\n🔐 4 CHÌA KHÓA TIẾT KIỆM:\n💰 Tiền (chi tiêu hợp lí) ➔ 🎒 Đồ dùng (giữ gìn hiệu quả) ➔ ⏰ Thời gian (có kế hoạch) ➔ 💧⚡ Tài nguyên (dùng đủ, không thất thoát) ➔ 🌱 KẾT QUẢ: Trân trọng thành quả lao động, Cuộc sống ổn định, Sử dụng nguồn lực hợp lí.',
    options: {
      A: 'Mua ngay vì món đồ giảm giá luôn là món hời.',
      B: 'Mua hai chiếc vì đang giảm 50%.',
      C: 'Xem mình có thực sự cần không; nếu bình hiện tại vẫn đáp ứng tốt thì chưa cần mua.',
      D: 'Không bao giờ mua bình mới nữa dù bình cũ sau này bị hỏng.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Xem mình có thực sự cần không; nếu bình hiện tại vẫn đáp ứng tốt thì chưa cần mua. 💡 GIÁ RẺ ≠ TIẾT KIỆM. Mua một món đồ không cần thiết (dù được giảm giá sâu) vẫn là lãng phí tiền bạc.',
  },
];

db.questions.push(...questionsB8);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b8`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 8',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Tiết kiệm" (Mã: CD6-B8, 8 thử thách, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 8 (CD6-B8) with 8 challenges into database.json!');
