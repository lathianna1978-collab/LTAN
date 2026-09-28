import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const db = JSON.parse(raw);

// 1. Remove existing assignment for lesson-7 if any
db.assignments = db.assignments.filter((a: any) => a.lessonId !== 'lesson-7' && a.code !== 'CD6-B7');
db.questions = db.questions.filter((q: any) => q.assignmentId !== 'asg-b7');

// 2. Add asg-b7
const asgB7 = {
  id: 'asg-b7',
  lessonId: 'lesson-7',
  code: 'CD6-B7',
  title: '🛡️✨ Phiếu học tập thông minh: Ứng phó với tình huống nguy hiểm',
  type: 'phiếu_củng_cố',
  durationMinutes: 15,
  dueDate: '2026-12-31',
  isLocked: false,
  isDeleted: false,
  order: 7,
};

db.assignments.push(asgB7);

// 3. Add 8 questions for Bai 7
const questionsB7 = [
  {
    id: 'q-b7-1',
    assignmentId: 'asg-b7',
    order: 1,
    taskName: '🚨 THỬ THÁCH 1 — RADAR NGUY HIỂM',
    points: 10,
    content: 'Chọn 4 tình huống có dấu hiệu nguy hiểm:\n\n(1) 🌧️ Mưa rất lớn, nước trên đường đang dâng nhanh.\n(2) 📚 Bạn rủ em cùng đọc sách ở thư viện.\n(3) 🔥 Em ngửi thấy mùi khét và thấy khói phát ra từ ổ điện.\n(4) 🚗 Một người lạ rủ em lên xe để “đưa về gặp bố mẹ”.\n(5) ⚡ Trời có sấm sét, nhóm bạn vẫn đứng dưới cây lớn.\n(6) 🏸 Các bạn chơi cầu lông trong sân trường.',
    options: {
      A: '(1), (3), (4), (5) — 🌧️ Nước dâng nhanh · 🔥 Khói khét từ ổ điện · 🚗 Người lạ rủ lên xe · ⚡ Trú dưới cây lớn khi sấm sét',
      B: '(1), (2), (3), (4) — 🌧️ Nước dâng · 📚 Đọc sách thư viện · 🔥 Khói ổ điện · 🚗 Người lạ rủ lên xe',
      C: '(2), (4), (5), (6) — 📚 Đọc sách thư viện · 🚗 Người lạ · ⚡ Trú dưới cây lớn · 🏸 Cầu lông sân trường',
      D: '(1), (2), (5), (6) — 🌧️ Nước dâng · 📚 Đọc sách thư viện · ⚡ Trú dưới cây lớn · 🏸 Cầu lông sân trường',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án đúng: (1), (3), (4), (5). Đây là những tình huống tiềm ẩn nguy hiểm nghiêm trọng từ thiên tai (mưa ngập, sấm sét) và con người (chập cháy điện, nguy cơ bắt cóc từ người lạ). Các tình huống (2) và (6) là hoạt động học tập, thể thao an toàn và lành mạnh.',
  },
  {
    id: 'q-b7-2',
    assignmentId: 'asg-b7',
    order: 2,
    taskName: '🧩 THỬ THÁCH 2 — KÉO THẢ “NGUY HIỂM ĐẾN TỪ ĐÂU?”',
    points: 15,
    content: 'Kéo từng thẻ vào đúng vùng:\n\n🌪️ NGUY HIỂM TỪ TỰ NHIÊN  |  👤 NGUY HIỂM TỪ CON NGƯỜI\n\nCác thẻ:\n(1) 🌊 Lũ quét\n(2) 🚨 Người lạ cố kéo em đi\n(3) ⛰️ Sạt lở đất\n(4) 🔥 Một người bất cẩn gây cháy\n(5) ⚡ Sét\n(6) 👊 Người khác đe dọa, tấn công\n\n💡 SGK GDCD 6 phân biệt: Nguy hiểm từ hiện tượng tự nhiên và nguy hiểm phát sinh từ hành vi cố ý hoặc vô tình của con người.',
    options: {
      A: '🌪️ Nguy hiểm từ tự nhiên: (1, 3, 5) · 👤 Nguy hiểm từ con người: (2, 4, 6)',
      B: '🌪️ Nguy hiểm từ tự nhiên: (2, 4, 6) · 👤 Nguy hiểm từ con người: (1, 3, 5)',
      C: '🌪️ Nguy hiểm từ tự nhiên: (1, 2, 5) · 👤 Nguy hiểm từ con người: (3, 4, 6)',
      D: '🌪️ Nguy hiểm từ tự nhiên: (3, 4, 5) · 👤 Nguy hiểm từ con người: (1, 2, 6)',
    },
    correctOption: 'A',
    explanation: '✅ Phân loại chính xác:\n- 🌪️ Nguy hiểm từ tự nhiên: (1) Lũ quét; (3) Sạt lở đất; (5) Sét.\n- 👤 Nguy hiểm từ con người: (2) Người lạ cố kéo em đi; (4) Một người bất cẩn gây cháy; (6) Người khác đe dọa, tấn công.',
  },
  {
    id: 'q-b7-3',
    assignmentId: 'asg-b7',
    order: 3,
    taskName: '🔗 THỬ THÁCH 3 — NỐI NHANH ĐỂ AN TOÀN',
    points: 10,
    content: 'Nối mỗi dấu hiệu nguy hiểm với hành động phản ứng phù hợp nhất:\n\n🚨 Dấu hiệu:\nA. Phát hiện cháy\nB. Người lạ cố lôi kéo\nC. Mưa dông, sét\nD. Có cảnh báo lũ, sạt lở\n\n↔️ 🛡️ Phản ứng:\n① Tìm nơi trú an toàn\n② Báo động, thoát ra nơi an toàn\n③ Kêu cứu, tìm người hỗ trợ\n④ Theo dõi cảnh báo và tránh khu vực nguy hiểm\n\n(A → ?  B → ?  C → ?  D → ?)',
    options: {
      A: 'A → ② (Báo động, thoát ra an toàn) · B → ③ (Kêu cứu, tìm hỗ trợ) · C → ① (Tìm nơi trú an toàn) · D → ④ (Theo dõi cảnh báo & tránh xa)',
      B: 'A → ① (Tìm nơi trú an toàn) · B → ② (Báo động, thoát ra an toàn) · C → ③ (Kêu cứu, tìm hỗ trợ) · D → ④ (Theo dõi cảnh báo & tránh xa)',
      C: 'A → ③ (Kêu cứu, tìm hỗ trợ) · B → ④ (Theo dõi cảnh báo) · C → ② (Báo động, thoát ra an toàn) · D → ① (Tìm nơi trú an toàn)',
      D: 'A → ② (Báo động, thoát ra an toàn) · B → ① (Tìm nơi trú an toàn) · C → ③ (Kêu cứu, tìm hỗ trợ) · D → ④ (Theo dõi cảnh báo & tránh xa)',
    },
    correctOption: 'A',
    explanation: '✅ Nối chính xác: A–2, B–3, C–1, D–4:\n- A → ②: Phát hiện cháy = Báo động, thoát ra nơi an toàn.\n- B → ③: Người lạ cố lôi kéo = Kêu cứu, tìm người hỗ trợ.\n- C → ①: Mưa dông, sét = Tìm nơi trú an toàn (nhà kiên cố, tránh cây to/cột điện).\n- D → ④: Có cảnh báo lũ, sạt lở = Theo dõi cảnh báo và tránh khu vực nguy hiểm.',
  },
  {
    id: 'q-b7-4',
    assignmentId: 'asg-b7',
    order: 4,
    taskName: '🧠 THỬ THÁCH 4 — MỞ KHÓA “CÔNG THỨC AN TOÀN”',
    points: 15,
    content: 'Kéo 4 từ vào đúng vị trí:\n(BÌNH TĨNH • NHẬN DIỆN • TRỢ GIÚP • AN TOÀN)\n\n🚨 __________ (1) NGUY HIỂM\n⬇️\n🧠 GIỮ __________ (2)\n⬇️\n🏃 DI CHUYỂN/THOÁT ĐẾN NƠI __________ (3)\n⬇️\n📞 TÌM SỰ __________ (4)\n\n🔐 Mật mã cần nhớ: NHẬN RA ➔ BÌNH TĨNH ➔ AN TOÀN ➔ TRỢ GIÚP.',
    options: {
      A: '(1) NHẬN DIỆN → (2) BÌNH TĨNH → (3) AN TOÀN → (4) TRỢ GIÚP',
      B: '(1) BÌNH TĨNH → (2) NHẬN DIỆN → (3) TRỢ GIÚP → (4) AN TOÀN',
      C: '(1) NHẬN DIỆN → (2) AN TOÀN → (3) BÌNH TĨNH → (4) TRỢ GIÚP',
      D: '(1) AN TOÀN → (2) BÌNH TĨNH → (3) NHẬN DIỆN → (4) TRỢ GIÚP',
    },
    correctOption: 'A',
    explanation: '✅ Công thức an toàn sinh tồn:\n🚨 NHẬN DIỆN NGUY HIỂM ➔ 🧠 GIỮ BÌNH TĨNH ➔ 🏃 DI CHUYỂN/THOÁT ĐẾN NƠI AN TOÀN ➔ 📞 TÌM SỰ TRỢ GIÚP.',
  },
  {
    id: 'q-b7-5',
    assignmentId: 'asg-b7',
    order: 5,
    taskName: '⚡ THỬ THÁCH 5 — ĐÚNG HAY SAI? “BẪY AN TOÀN”',
    points: 15,
    content: 'Xác định tính Đúng 👍 hoặc Sai 👎 cho 4 nhận định sau:\n\n① 🔥 Khi có cháy, ưu tiên nhanh chóng tìm đường thoát an toàn thay vì quay lại lấy đồ.\n② ⚡ Khi có sấm sét, đứng trú dưới cây cao là lựa chọn an toàn.\n③ 🌊 Khi thấy người khác đuối nước, học sinh không biết cứu hộ nên tìm người có khả năng hỗ trợ thay vì tự lao xuống nước.\n④ 🚨 Khi gặp nguy hiểm từ người lạ, có thể hét lớn để thu hút sự chú ý và tìm người đáng tin cậy giúp đỡ.',
    options: {
      A: '① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      B: '① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍',
      C: '① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍',
      D: '① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ SAI 👎',
    },
    correctOption: 'A',
    explanation: '✅ Đáp án: Đúng – Sai – Đúng – Đúng:\n- ① Đúng: Thoát nạn bảo vệ tính mạng là ưu tiên số 1, tuyệt đối không tiếc của quay lại.\n- ② Sai: Cây cao hút sét rất mạnh, đứng dưới cây cao là sai lầm chết người.\n- ③ Đúng: Cứu đuối nước đòi hỏi chuyên môn cao; cần hô hoán, ném vật nổi và tìm người lớn cứu giúp.\n- ④ Đúng: Hét lớn và chạy về phía người đáng tin cậy giúp thoát khỏi kẻ xấu.',
  },
  {
    id: 'q-b7-6',
    assignmentId: 'asg-b7',
    order: 6,
    taskName: '🕵️ THỬ THÁCH 6 — TÌM “HẠT SẠN”',
    points: 10,
    content: 'Một nhóm bạn nói về cách ứng phó khi gặp nguy hiểm:\n\n🟢 An: “Việc đầu tiên là cố giữ bình tĩnh.”\n🔵 Mai: “Mình cần nhanh chóng tìm cách đưa bản thân đến nơi an toàn.”\n🟣 Minh: “Nếu vượt quá khả năng, mình phải tìm người có thể giúp.”\n🔴 Nam: “Gặp nguy hiểm thì cứ tự mình xử lí để chứng tỏ mình dũng cảm.”\n\n🔍 Ai có suy nghĩ NGUY HIỂM NHẤT?',
    options: {
      A: 'An: “Việc đầu tiên là cố giữ bình tĩnh.”',
      B: 'Mai: “Mình cần nhanh chóng tìm cách đưa bản thân đến nơi an toàn.”',
      C: 'Minh: “Nếu vượt quá khả năng, mình phải tìm người có thể giúp.”',
      D: 'Nam: “Gặp nguy hiểm thì cứ tự mình xử lí để chứng tỏ mình dũng cảm.”',
    },
    correctOption: 'D',
    explanation: '✅ Đáp án: Nam (Phương án D). 💡 Bẫy tư duy: DŨNG CẢM ≠ LIỀU LĨNH. Mục tiêu cốt lõi là bảo vệ an toàn tính mạng, không phải liều mạng để chứng tỏ bản thân gan dạ.',
  },
  {
    id: 'q-b7-7',
    assignmentId: 'asg-b7',
    order: 7,
    taskName: '🪜 THỬ THÁCH 7 — 5 GIÂY QUYẾT ĐỊNH',
    points: 10,
    content: 'Sắp xếp các hành động theo thứ tự hợp lí khi đối mặt tình huống nguy hiểm:\n(📞 TÌM NGƯỜI TRỢ GIÚP · 👀 NHẬN RA NGUY HIỂM · 🧠 GIỮ BÌNH TĨNH · 🏃 TRÁNH XA/THOÁT KHỎI NGUY HIỂM)\n\n🚨 Quy trình của em:\n① __________ ⬇️ ② __________ ⬇️ ③ __________ ⬇️ ④ __________ 🛡️',
    options: {
      A: '① NHẬN RA NGUY HIỂM → ② GIỮ BÌNH TĨNH → ③ TRÁNH XA/THOÁT KHỎI NGUY HIỂM → ④ TÌM NGƯỜI TRỢ GIÚP 🛡️',
      B: '① GIỮ BÌNH TĨNH → ② NHẬN RA NGUY HIỂM → ③ TRÁNH XA/THOÁT KHỎI NGUY HIỂM → ④ TÌM NGƯỜI TRỢ GIÚP 🛡️',
      C: '① NHẬN RA NGUY HIỂM → ② TRÁNH XA/THOÁT KHỎI NGUY HIỂM → ③ GIỮ BÌNH TĨNH → ④ TÌM NGƯỜI TRỢ GIÚP 🛡️',
      D: '① TÌM NGƯỜI TRỢ GIÚP → ② NHẬN RA NGUY HIỂM → ③ GIỮ BÌNH TĨNH → ④ TRÁNH XA/THOÁT KHỎI NGUY HIỂM 🛡️',
    },
    correctOption: 'A',
    explanation: '✅ Quy trình phản xạ an toàn: Nhận ra nguy hiểm ➔ Giữ bình tĩnh ➔ Tránh xa/thoát khỏi nguy hiểm ➔ Tìm người trợ giúp.',
  },
  {
    id: 'q-b7-8',
    assignmentId: 'asg-b7',
    order: 8,
    taskName: '🏆 THỬ THÁCH 8 — BOSS LEVEL 🎮 “30 GIÂY SINH TỒN”',
    points: 15,
    content: 'Tan học, Minh đang đi cùng một người bạn thì trời đột nhiên mưa rất lớn. Nước trên đoạn đường phía trước dâng nhanh. Bạn nói: 😎 “Đi qua luôn đi! Đường này ngày nào mình chẳng đi.”\n\nMinh nên chọn cách nào?\n\n🎁 PHẢN XẠ AN TOÀN (3 GIÂY):\n🔥 Có cháy: AN TOÀN (thay vì đồ đạc)\n⚡ Có sét: NƠI TRÚ AN TOÀN (thay vì cây cao)\n🚨 Nguy hiểm vượt khả năng: TÌM TRỢ GIÚP (thay vì tự xử lí)\n\n🔐 4 CHÌA KHÓA SINH TỒN:\n👀 1. Nhận diện ➔ 🧠 2. Bình tĩnh ➔ 🏃 3. An toàn ➔ 📣 4. Trợ giúp ➔ 🛡️ BẢO VỆ AN TOÀN',
    options: {
      A: 'Đi qua thật nhanh trước khi nước dâng cao hơn.',
      B: 'Thử bước xuống nước xem có sâu không.',
      C: 'Không đi vào vùng nước nguy hiểm; tìm vị trí an toàn và nhờ người lớn/hỗ trợ phù hợp.',
      D: 'Đứng gần dòng nước để quay video.',
    },
    correctOption: 'C',
    explanation: '✅ Lựa chọn tối ưu: C — Không đi vào vùng nước nguy hiểm; tìm vị trí an toàn và nhờ người lớn/hỗ trợ phù hợp. Điểm khó: “Quen thuộc” không đồng nghĩa với “an toàn”. Dòng nước lũ ngập sâu chảy xiết có thể cuốn trôi người hoặc sụp hố ga, nắp cống bị trôi mất rất nguy hiểm.',
  },
];

db.questions.push(...questionsB7);

// Add audit log
db.auditLogs.unshift({
  id: `log-${Date.now()}-b7`,
  timestamp: new Date().toISOString(),
  actor: 'Cô An Na',
  action: 'Tải lên bài tập Bài 7',
  details: 'Tạo bài tập "Phiếu học tập thông minh: Ứng phó với tình huống nguy hiểm" (Mã: CD6-B7, 8 thử thách, 100 điểm)',
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully saved Bài 7 (CD6-B7) with 8 challenges into database.json!');
