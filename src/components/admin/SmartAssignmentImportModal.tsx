import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Key,
  Layers,
  ArrowRight,
  Eye,
  Trash2,
  Edit3,
  Copy,
  Smartphone,
  Laptop,
  HelpCircle,
  Star,
  FileText,
} from 'lucide-react';
import { Lesson, Question, AssignmentType } from '../../types';
import { parseAssignmentText, ParsedAssignmentResult } from '../../utils/assignmentParser';
import { apiAdmin } from '../../api';

interface SmartAssignmentImportModalProps {
  isOpen: boolean;
  lessons: Lesson[];
  initialLessonId?: string;
  onClose: () => void;
  onSuccess: () => void;
  onOpenInEditor?: (parsedData: {
    title: string;
    code: string;
    lessonId: string;
    durationMinutes: number;
    type: AssignmentType;
    questions: Question[];
  }) => void;
}

const SAMPLE_TEMPLATES = [
  {
    label: '🌳 Mẫu 8 Nhiệm vụ thông minh (Chuẩn Bài 1 - GDCD 6)',
    desc: 'Tự hào về truyền thống gia đình dòng họ: Săn từ khóa, Kéo thả, Nối nhanh, Điền từ, Đúng/Sai, Tìm hạt sạn, Xếp hành trình, Boss level',
    text: `PHIẾU HỌC TẬP: TỰ HÀO VỀ TRUYỀN THỐNG GIA ĐÌNH, DÒNG HỌ
Bài 1 - Giáo dục công dân 6
Thời gian: 15 phút

NHIỆM VỤ 1 — SĂN TÌM TỪ KHÓA
(10 điểm)
Chọn 5 giá trị có thể là truyền thống tốt đẹp của gia đình, dòng họ:
Hiếu học
Khoe của
Hiếu thảo
Cần cù
Đua đòi
Yêu thương
Giữ nghề truyền thống
Coi thường người khác
A. Hiếu học, Hiếu thảo, Cần cù, Yêu thương, Giữ nghề truyền thống
B. Khoe của, Đua đòi, Coi thường người khác, Hiếu học, Cần cù
C. Hiếu học, Khoe của, Hiếu thảo, Yêu thương, Đua đòi
D. Giữ nghề truyền thống, Coi thường người khác, Cần cù, Hiếu thảo, Đua đòi
Đáp án: A
Giải thích: 5 giá trị tốt đẹp là Hiếu học, Hiếu thảo, Cần cù, Yêu thương, Giữ nghề truyền thống. Các thói xấu như Khoe của, Đua đòi, Coi thường người khác không phải là truyền thống tốt đẹp.

NHIỆM VỤ 2 — KÉO THẢ ĐÚNG NHÀ
(15 điểm)
Kéo từng hành động vào đúng nhóm:
🌱 GIỮ GÌN – PHÁT HUY  |  ⚠️ CHƯA PHÙ HỢP
Các thẻ:
(1) 📚 Chủ động học tập, cố gắng tiến bộ
(2) 👵 Hỏi ông bà về những điều tốt đẹp của gia đình
(3) 🙄 Chê nghề của gia đình là lỗi thời
(4) ❤️ Quan tâm, kính trọng ông bà, cha mẹ
(5) 📣 Giới thiệu nét đẹp của gia đình một cách phù hợp
(6) 😎 Chỉ khoe thành tích của người thân
A. 🌱 Giữ gìn – phát huy: (1, 2, 4, 5) · ⚠️ Chưa phù hợp: (3, 6)
B. 🌱 Giữ gìn – phát huy: (1, 3, 5) · ⚠️ Chưa phù hợp: (2, 4, 6)
C. 🌱 Giữ gìn – phát huy: (2, 4, 6) · ⚠️ Chưa phù hợp: (1, 3, 5)
D. 🌱 Giữ gìn – phát huy: (3, 6) · ⚠️ Chưa phù hợp: (1, 2, 4, 5)
Đáp án: A
Giải thích: Giữ gìn/phát huy: (1, 2, 4, 5); Chưa phù hợp: (3, 6).

NHIỆM VỤ 3 — NỐI NHANH
(15 điểm)
Nối hành động với giá trị phù hợp nhất:
A. Chăm chỉ học tập
B. Quan tâm, chăm sóc ông bà
C. Chăm chỉ làm việc
D. Học nghề của gia đình
↔️
① Hiếu thảo
② Giữ nghề truyền thống
③ Hiếu học
④ Cần cù lao động
A. A → ③ (Hiếu học) · B → ① (Hiếu thảo) · C → ④ (Cần cù lao động) · D → ② (Giữ nghề truyền thống)
B. A → ① (Hiếu thảo) · B → ③ (Hiếu học) · C → ② (Giữ nghề truyền thống) · D → ④ (Cần cù lao động)
C. A → ④ (Cần cù lao động) · B → ① (Hiếu thảo) · C → ③ (Hiếu học) · D → ② (Giữ nghề truyền thống)
D. A → ② (Giữ nghề truyền thống) · B → ④ (Cần cù lao động) · C → ① (Hiếu thảo) · D → ③ (Hiếu học)
Đáp án: A
Giải thích: A–3 (Hiếu học); B–1 (Hiếu thảo); C–4 (Cần cù lao động); D–2 (Giữ nghề truyền thống).

NHIỆM VỤ 4 — GIẢI MÃ THÔNG ĐIỆP
(15 điểm)
Kéo 4 từ khóa vào đúng chỗ trống:
TRUYỀN THỐNG · SỨC MẠNH · TỰ HÀO · KINH NGHIỆM
Hiểu biết và __________ về __________ gia đình, dòng họ giúp chúng ta có thêm __________ và __________ trong cuộc sống.
A. TỰ HÀO → TRUYỀN THỐNG → KINH NGHIỆM → SỨC MẠNH
B. TRUYỀN THỐNG → TỰ HÀO → SỨC MẠNH → KINH NGHIỆM
C. SỨC MẠNH → KINH NGHIỆM → TRUYỀN THỐNG → TỰ HÀO
D. TỰ HÀO → SỨC MẠNH → TRUYỀN THỐNG → KINH NGHIỆM
Đáp án: A
Giải thích: Hiểu biết và tự hào về truyền thống gia đình, dòng họ giúp chúng ta có thêm kinh nghiệm và sức mạnh trong cuộc sống.

NHIỆM VỤ 5 — ĐÚNG HAY SAI?
(15 điểm)
Chọn 👍 ĐÚNG hoặc 👎 SAI cho các nhận định:
① Gia đình không giàu có thì không có truyền thống đáng tự hào.
② Tự hào về truyền thống phải được thể hiện bằng những việc làm phù hợp.
③ Học hỏi điều tốt đẹp từ ông bà, cha mẹ là một cách tiếp nối truyền thống.
④ Giữ gìn truyền thống nghĩa là mọi việc của thế hệ trước đều phải giữ nguyên, không được thay đổi.
A. ① SAI 👎 · ② ĐÚNG 👍 · ③ ĐÚNG 👍 · ④ SAI 👎
B. ① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎
C. ① SAI 👎 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ ĐÚNG 👍
D. ① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎
Đáp án: A
Giải thích: ① Sai; ② Đúng; ③ Đúng; ④ Sai.

NHIỆM VỤ 6 — TÌM “HẠT SẠN”
(10 điểm)
Bốn bạn cùng nói về cách thể hiện niềm tự hào về gia đình:
🌱 An: “Mình sẽ tìm hiểu những điều tốt đẹp của gia đình.”
📚 Mai: “Mình cố gắng học tập để tiếp nối truyền thống hiếu học.”
📣 Nam: “Mình có thể giới thiệu những nét đẹp của gia đình với bạn bè.”
😎 Minh: “Chỉ cần thường xuyên khoe thành tích của người thân là đủ.”
Ai có suy nghĩ CHƯA HỢP LÍ?
A. Minh (Sai ở chỗ chỉ khoe thành tích mà không có việc làm thiết thực giữ gìn, phát huy)
B. An
C. Mai
D. Nam
Đáp án: A
Giải thích: Minh có suy nghĩ chưa hợp lí: "Chỉ cần thường xuyên khoe thành tích của người thân là đủ." Tự hào cần gắn với sự trân trọng và hành động phù hợp.

NHIỆM VỤ 7 — XẾP ĐÚNG HÀNH TRÌNH
(10 điểm)
Sắp xếp 4 thẻ thành một hành trình hợp lí:
PHÁT HUY · TỰ HÀO · TÌM HIỂU · GIỮ GÌN
① __________ → ② __________ → ③ __________ → ④ __________
A. ① TÌM HIỂU → ② TỰ HÀO → ③ GIỮ GÌN → ④ PHÁT HUY
B. ① TỰ HÀO → ② TÌM HIỂU → ③ PHÁT HUY → ④ GIỮ GÌN
C. ① GIỮ GÌN → ② TÌM HIỂU → ③ TỰ HÀO → ④ PHÁT HUY
D. ① PHÁT HUY → ② GIỮ GÌN → ③ TỰ HÀO → ④ TÌM HIỂU
Đáp án: A
Giải thích: Thứ tự hành trình chuẩn: TÌM HIỂU → TỰ HÀO → GIỮ GÌN → PHÁT HUY.

NHIỆM VỤ 8 — THỬ THÁCH CUỐI 🎭 NẾU LÀ EM...
(10 điểm)
Gia đình Minh nhiều đời có truyền thống làm một nghề thủ công. Minh rất yêu quý truyền thống ấy nhưng một người bạn nói:
“Thời nay rồi, học những thứ đó làm gì!”
Minh nên làm gì?
A. Bỏ tìm hiểu nghề của gia đình để khỏi bị bạn trêu.
B. Tranh cãi và chê gia đình bạn không có truyền thống.
C. Tìm hiểu giá trị của nghề, học những điều phù hợp và tự tin giới thiệu nét đẹp ấy.
D. Chỉ nói rằng nghề của gia đình mình tốt nhất.
Đáp án: C
Giải thích: Tìm hiểu giá trị của nghề, học những điều phù hợp và tự tin giới thiệu nét đẹp ấy.`,
  },
  {
    label: '🛡️ Mẫu 8 Nhiệm vụ thông minh (Chuẩn Bài 12 - GDCD 6)',
    desc: 'Bao gồm trắc nghiệm, kéo thả, nối cặp, đúng/sai, tìm hạt sạn & boss level',
    text: `PHIẾU HỌC TẬP THÔNG MINH: THỰC HIỆN QUYỀN TRẺ EM
Bài 12 - Giáo dục công dân 6
Thời gian: 15 phút

NHIỆM VỤ 1 — AI CÙNG BẢO VỆ EM?
(10 điểm)
Chọn 4 lực lượng có trách nhiệm trong việc thực hiện quyền trẻ em:
Bản thân trẻ em
Gia đình
Nhà trường
Xã hội
Chỉ bạn thân
Chỉ mạng xã hội
A. Bản thân trẻ em, Gia đình, Nhà trường, Xã hội
B. Chỉ bạn thân, Gia đình, Nhà trường, Chỉ mạng xã hội
C. Bản thân trẻ em, Chỉ bạn thân, Chỉ mạng xã hội, Xã hội
D. Gia đình và Nhà trường (Bản thân và Xã hội không cần trách nhiệm)
Đáp án: A
Giải thích: Cả 4 lực lượng đều có trách nhiệm bảo vệ và thực hiện quyền trẻ em.

NHIỆM VỤ 2 — KÉO THẢ “AI LÀM VIỆC GÌ?”
(15 điểm)
Kéo mỗi thẻ vào nơi phù hợp nhất (Học sinh, Gia đình, Nhà trường, Xã hội):
(1) Chủ động học tập, rèn luyện
(2) Chăm sóc, nuôi dưỡng trẻ
(3) Xây dựng môi trường học tập an toàn
(4) Xử lí hành vi xâm phạm quyền trẻ em
(5) Biết lên tiếng, tìm sự giúp đỡ khi cần
(6) Tạo điều kiện để con học tập, vui chơi phù hợp
(7) Bảo vệ học sinh khỏi bạo lực học đường
(8) Tuyên truyền, thực hiện chính sách bảo vệ trẻ em
A. Học sinh: (1, 5) · Gia đình: (2, 6) · Nhà trường: (3, 7) · Xã hội: (4, 8)
B. Học sinh: (2, 6) · Gia đình: (1, 5) · Nhà trường: (4, 8) · Xã hội: (3, 7)
C. Học sinh: (3, 7) · Gia đình: (4, 8) · Nhà trường: (1, 5) · Xã hội: (2, 6)
D. Học sinh: (1, 8) · Gia đình: (2, 5) · Nhà trường: (3, 6) · Xã hội: (4, 7)
Đáp án: A
Giải thích: Phân định rõ trách nhiệm của từng chủ thể.

NHIỆM VỤ 3 — NỐI NHANH “TÌNH HUỐNG ↔ TRÁCH NHIỆM”
(10 điểm)
Nối nhanh tình huống với chủ thể chịu trách nhiệm:
A. Cha mẹ chăm sóc con khi ốm.
B. Học sinh chăm chỉ học tập và rèn luyện.
C. Trường xây dựng môi trường không có bạo lực học đường.
D. Cơ quan có thẩm quyền xử lí người xâm hại trẻ em.
Chủ thể: ① Học sinh · ② Gia đình · ③ Nhà trường · ④ Xã hội
A. A → ② (Gia đình) · B → ① (Học sinh) · C → ③ (Nhà trường) · D → ④ (Xã hội)
B. A → ① (Học sinh) · B → ② (Gia đình) · C → ④ (Xã hội) · D → ③ (Nhà trường)
C. A → ③ (Nhà trường) · B → ④ (Xã hội) · C → ① (Học sinh) · D → ② (Gia đình)
D. A → ④ (Xã hội) · B → ③ (Nhà trường) · C → ② (Gia đình) · D → ① (Học sinh)
Đáp án: A
Giải thích: A–2 (Gia đình); B–1 (Học sinh); C–3 (Nhà trường); D–4 (Xã hội).

NHIỆM VỤ 4 — GIẢI MÃ “CÔNG THỨC TRÁCH NHIỆM”
(15 điểm)
Điền 4 từ khóa (GIA ĐÌNH · HỌC SINH · XÃ HỘI · NHÀ TRƯỜNG) vào đúng chỗ:
- Học sinh chủ động thực hiện quyền và bổn phận của mình.
- Gia đình chăm sóc, nuôi dưỡng, giáo dục và bảo vệ trẻ.
- Nhà trường tạo môi trường học tập an toàn, lành mạnh.
- Xã hội bảo đảm quyền trẻ em và xử lí hành vi vi phạm.
A. HỌC SINH → GIA ĐÌNH → NHÀ TRƯỜNG → XÃ HỘI
B. GIA ĐÌNH → HỌC SINH → XÃ HỘI → NHÀ TRƯỜNG
C. NHÀ TRƯỜNG → XÃ HỘI → GIA ĐÌNH → HỌC SINH
D. XÃ HỘI → NHÀ TRƯỜNG → HỌC SINH → GIA ĐÌNH
Đáp án: A
Giải thích: Thứ tự đúng: Học sinh → Gia đình → Nhà trường → Xã hội.

NHIỆM VỤ 5 — ĐÚNG HAY SAI? 🧨 “BẪY QUYỀN TRẺ EM”
(15 điểm)
Xác định tính Đúng / Sai của 4 nhận định sau:
① Có quyền được bảo vệ nên khi gặp nguy hiểm, trẻ em nên tìm người đáng tin cậy để giúp đỡ.
② Bảo đảm quyền trẻ em hoàn toàn là việc của cha mẹ.
③ Trẻ em vừa có quyền, vừa cần thực hiện những bổn phận phù hợp với lứa tuổi.
④ Nếu thấy bạn bị xâm phạm quyền, tốt nhất im lặng vì đó không phải việc của mình.
A. ① ĐÚNG 👍 · ② SAI 👎 · ③ ĐÚNG 👍 · ④ SAI 👎
B. ① ĐÚNG 👍 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ SAI 👎
C. ① SAI 👎 · ② ĐÚNG 👍 · ③ SAI 👎 · ④ ĐÚNG 👍
D. ① ĐÚNG 👍 · ② SAI 👎 · ③ SAI 👎 · ④ ĐÚNG 👍
Đáp án: A
Giải thích: ① Đúng; ② Sai; ③ Đúng; ④ Sai.

NHIỆM VỤ 6 — TÌM “HẠT SẠN”
(10 điểm)
Bốn bạn đưa ra cách xử lí khi thấy một bạn trong lớp thường xuyên bị bắt nạt:
- An: "Mình sẽ báo với thầy cô hoặc người lớn đáng tin cậy."
- Mai: "Mình sẽ động viên bạn và tìm cách giúp bạn được hỗ trợ."
- Minh: "Nếu có nguy cơ mất an toàn, cần tìm sự trợ giúp."
- Nam: "Không liên quan đến mình nên cứ im lặng."
Ai có cách nghĩ CHƯA PHÙ HỢP?
A. Nam (Sai ở lựa chọn im lặng khi biết bạn đang bị bắt nạt)
B. An
C. Mai
D. Minh
Đáp án: A
Giải thích: Nam sai ở việc thờ ơ và im lặng trước bạo lực.

NHIỆM VỤ 7 — “ĐÈN XANH HAY ĐÈN ĐỎ?”
(10 điểm)
Phân loại 6 hành động vào 2 nhóm (🟢 Thực hiện/bảo vệ quyền HOẶC 🔴 Xâm phạm quyền):
① Tạo điều kiện để trẻ được học tập.
② Đánh trẻ để "dạy cho nhớ".
③ Lắng nghe ý kiến phù hợp của trẻ.
④ Bắt trẻ làm công việc nặng nhọc.
⑤ Giúp đỡ khi phát hiện trẻ có nguy cơ bị xâm hại.
⑥ Tự ý công khai chuyện riêng tư của trẻ.
A. 🟢 Bảo vệ quyền: ①, ③, ⑤ · 🔴 Xâm phạm quyền: ②, ④, ⑥
B. 🟢 Bảo vệ quyền: ②, ④, ⑥ · 🔴 Xâm phạm quyền: ①, ③, ⑤
C. 🟢 Bảo vệ quyền: ①, ②, ③ · 🔴 Xâm phạm quyền: ④, ⑤, ⑥
D. 🟢 Bảo vệ quyền: ③, ④, ⑤ · 🔴 Xâm phạm quyền: ①, ②, ⑥
Đáp án: A
Giải thích: ①, ③, ⑤ là bảo vệ; ②, ④, ⑥ là xâm phạm.

NHIỆM VỤ 8 — BOSS LEVEL 📱 “GIỮ BÍ MẬT HAY TÌM NGƯỜI GIÚP?”
(15 điểm)
Một người quen nhắn tin khiến Linh cảm thấy sợ hãi và yêu cầu: “Không được kể chuyện này với bố mẹ hay thầy cô!”. Linh rất lo nhưng sợ rằng nếu kể thì mình là người “không biết giữ bí mật”.
Linh nên làm gì để bảo vệ bản thân?
A. Giữ kín hoàn toàn vì đã được yêu cầu.
B. Tiếp tục nhắn tin để tự giải quyết.
C. Tìm người lớn đáng tin cậy để kể lại và nhờ hỗ trợ nhằm bảo vệ mình.
D. Đăng toàn bộ câu chuyện lên mạng xã hội để mọi người xử lí giúp.
Đáp án: C
Giải thích: Linh cần tìm người lớn đáng tin cậy hỗ trợ ngay để đảm bảo an toàn.`,
  },
  {
    label: '📚 Mẫu 4 Câu trắc nghiệm kiến thức cơ bản',
    desc: 'Định dạng câu hỏi A, B, C, D quen thuộc từ ngân hàng đề Word/PDF',
    text: `BÀI TẬP CỦNG CỐ: TỰ HÀO VỀ TRUYỀN THỐNG GIA ĐÌNH, DÒNG HỌ
Bài 1 - Giáo dục công dân 6
Thời gian: 15 phút

Câu 1: Biểu hiện nào dưới đây thể hiện sự tự hào về truyền thống gia đình, dòng họ?
A. Tích cực học tập, rèn luyện để tiếp nối nghề truyền thống
B. Che giấu nghề truyền thống của gia đình vì thấy lạc hậu
C. Chỉ quan tâm đến bản thân, không cần biết truyền thống dòng họ
D. Chê bai những nét đẹp văn hóa quê hương
Đáp án: A
Giải thích: Tiếp nối nghề truyền thống thể hiện niềm tự hào và phát huy giá trị tốt đẹp.

Câu 2: Hành vi nào dưới đây KHÔNG phù hợp với việc giữ gìn truyền thống tốt đẹp?
A. Tôn trọng người lớn tuổi trong gia đình
B. Làm việc trái pháp luật gây ảnh hưởng danh dự dòng họ
C. Cố gắng học tập đạt kết quả tốt
D. Giới thiệu làng nghề truyền thống cho bạn bè
Đáp án: B
Giải thích: Làm việc vi phạm pháp luật làm xấu đi truyền thống gia đình dòng họ.

Câu 3: Việc tự hào về truyền thống dòng họ mang lại ý nghĩa gì?
A. Tạo điểm tựa tinh thần, động lực phấn đấu vươn lên
B. Giúp bản thân có quyền tự cao, coi thường người khác
C. Không cần nỗ lực học tập vẫn có vị thế xã hội
D. Dựa dẫm hoàn toàn vào thành tích của ông bà
Đáp án: A
Giải thích: Truyền thống là điểm tựa tinh thần quý báu giúp ta hoàn thiện nhân cách.

Câu 4: Khi gặp người ngoài nói sai về truyền thống gia đình mình, em nên làm gì?
A. Xúc phạm, to tiếng tranh cãi dữ dội
B. Bình tĩnh giải thích một cách lịch sự, đúng mực
C. Mặc kệ và tự ti về gia đình mình
D. Rủ bạn bè đến đe dọa người đó
Đáp án: B
Giải thích: Hành vi văn minh, lịch sự vừa bảo vệ truyền thống vừa thể hiện sự giáo dục tốt.`,
  },
];

export const SmartAssignmentImportModal: React.FC<SmartAssignmentImportModalProps> = ({
  isOpen,
  lessons,
  initialLessonId,
  onClose,
  onSuccess,
  onOpenInEditor,
}) => {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedAssignmentResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');
  const [loading, setLoading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form editable state once parsed
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId || (lessons[0]?.id ?? 'lesson-1'));
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [type, setType] = useState<AssignmentType>('phiếu_củng_cố');
  const [questions, setQuestions] = useState<Question[]>([]);

  React.useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
      const matched = lessons.find((l) => l.id === initialLessonId);
      if (matched && !code) {
        setCode(`CD6-B${matched.order}`);
      }
    }
  }, [initialLessonId, isOpen]);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) {
      alert('Vui lòng dán nội dung bài tập vào ô văn bản trước khi phân tích!');
      return;
    }

    const result = parseAssignmentText(rawText, selectedLessonId, lessons);
    setParsed(result);
    setTitle(result.title);
    setCode(result.code);
    setSelectedLessonId(result.lessonId);
    setDurationMinutes(result.durationMinutes);
    setType(result.type);
    setQuestions(result.questions);
    setActiveTab('preview');
  };

  const handleApplyTemplate = (sampleText: string) => {
    setRawText(sampleText);
    const result = parseAssignmentText(sampleText, selectedLessonId, lessons);
    setParsed(result);
    setTitle(result.title);
    setCode(result.code);
    setSelectedLessonId(result.lessonId);
    setDurationMinutes(result.durationMinutes);
    setType(result.type);
    setQuestions(result.questions);
  };

  const handleQuestionChange = (idx: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optKey: 'A' | 'B' | 'C' | 'D', value: string) => {
    const updated = [...questions];
    updated[qIdx] = {
      ...updated[qIdx],
      options: {
        ...updated[qIdx].options,
        [optKey]: value,
      },
    };
    setQuestions(updated);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('Bài tập cần có ít nhất 1 câu hỏi!');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i + 1 }));
    setQuestions(updated);
  };

  const handleSaveAndPublish = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài tập');
      return;
    }
    if (!code.trim()) {
      alert('Vui lòng nhập mã bài tập');
      return;
    }
    if (questions.length === 0) {
      alert('Chưa có câu hỏi nào được tạo!');
      return;
    }

    const payload = {
      title: title.trim(),
      code: code.trim().toUpperCase(),
      lessonId: selectedLessonId,
      durationMinutes: Number(durationMinutes) || 15,
      type,
      isLocked: false,
      hideAnswersAfterSubmit: true,
      questions,
    };

    setLoading(true);
    try {
      await apiAdmin.createAssignment(payload);
      alert('🎉 Đã tạo và xuất bản bài tập thành công! Học sinh đã có thể nhập mã ' + payload.code + ' để làm bài.');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToEditor = () => {
    if (onOpenInEditor) {
      onOpenInEditor({
        title,
        code,
        lessonId: selectedLessonId,
        durationMinutes,
        type,
        questions,
      });
      onClose();
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-purple-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl shadow-inner">
              ✨
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-black tracking-wider uppercase mb-1">
                <span>Trí tuệ Sư phạm thông minh</span>
                <span>•</span>
                <span>Tự động tối ưu Phone & PC</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>DÁN & NHẬP BÀI TẬP TỰ ĐỘNG</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUBHEADER TABS */}
        <div className="px-6 py-3 bg-purple-50/80 border-b border-purple-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'input'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Dán văn bản đề bài</span>
              {rawText.trim().length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (questions.length === 0 && rawText.trim()) {
                  handleParse();
                } else {
                  setActiveTab('preview');
                }
              }}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-purple-100/60 border border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>2. Xem trước & Tối ưu bài làm</span>
              {questions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  {questions.length} câu
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-purple-900 bg-white px-3 py-1.5 rounded-xl border border-purple-200/80">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>Tự động chuyển đổi dạng câu hỏi thành thẻ tương tác chạm 100% thân thiện</span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'input' ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Instructions banner */}
              <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-blue-50 p-4 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-700 font-medium">
                  <span className="font-extrabold text-purple-800">💡 Cô chỉ cần copy & paste:</span> Có thể dán đề từ Word, PDF, Google Docs hay Zalo. Hệ thống tự động nhận dạng: 
                  <span className="font-bold text-slate-900"> Tiêu đề, Tên nhiệm vụ, Điểm số, Đúng/Sai, Kéo thả, Nối cột, Đáp án đúng & Giải thích</span>.
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          setRawText(text);
                          setCopiedNotification(true);
                          setTimeout(() => setCopiedNotification(false), 2000);
                        }
                      } catch (e) {
                        alert('Vui lòng bấm chuột phải hoặc nhấn Ctrl+V / Cmd+V vào ô bên dưới.');
                      }
                    }}
                    className="py-1.5 px-3 rounded-xl bg-white border border-purple-200 hover:bg-purple-100 font-bold text-xs text-purple-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Dán từ Clipboard</span>
                  </button>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Xóa trắng nội dung?')) setRawText('');
                      }}
                      className="py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Templates Quick-Load */}
              <div>
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hoặc tải mẫu nhanh có sẵn để trải nghiệm thử:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyTemplate(tmpl.text)}
                      className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-extrabold text-slate-800 group-hover:text-purple-700 flex items-center justify-between">
                          <span>{tmpl.label}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Bấm áp dụng
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {tmpl.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>NỘI DUNG ĐỀ BÀI (DÁN TẠI ĐÂY)</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {rawText.length} ký tự · {rawText.split('\n').filter((l) => l.trim()).length} dòng
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Dán nội dung đề bài vào đây... Ví dụ:

NHIỆM VỤ 1 — AI CÙNG BẢO VỆ EM? (10 điểm)
Chọn 4 lực lượng có trách nhiệm thực hiện quyền trẻ em:
A. Bản thân trẻ em, Gia đình, Nhà trường, Xã hội
B. Chỉ bạn thân, Mạng xã hội
Đáp án: A
Giải thích: Cả 4 lực lượng đều có trách nhiệm...

NHIỆM VỤ 2: ĐÚNG HAY SAI? (15 điểm)...`}
                  className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-slate-800 font-mono text-xs sm:text-sm leading-relaxed outline-hidden bg-slate-50/30"
                />
              </div>

              {/* Action Parse button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={!rawText.trim()}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>⚡ TỰ ĐỘNG PHÂN TÍCH & TỐI ƯU HÓA BÀI LÀM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* ASSIGNMENT CONFIG SUMMARY BAR */}
              <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Tên bài tập
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-purple-500 font-bold text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mã bài tập</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-purple-500 font-mono font-black text-sm uppercase outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>Bài học áp dụng</span>
                  </label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-purple-500 font-bold text-xs outline-hidden"
                  >
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        Bài {l.order || l.lessonNumber}: {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* OVERVIEW STATS */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đã nhận diện: {questions.length} câu hỏi</span>
                  </span>
                  <span className="font-extrabold text-amber-900 flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Tổng điểm: {totalPoints}/100 điểm</span>
                  </span>
                  <span className="font-extrabold text-blue-900 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Thời gian làm: {durationMinutes} phút</span>
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-600">
                  📱 Thẻ chạm nhạy trên di động · 💻 Phím bấm tiện lợi trên máy tính
                </div>
              </div>

              {/* QUESTIONS LIST CARDS */}
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 relative group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
                          CÂU HỎI {idx + 1}
                        </span>
                        {q.taskName && (
                          <span className="text-xs font-extrabold text-purple-900 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-xl border border-purple-200">
                            {q.taskName}
                          </span>
                        )}
                        <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200">
                          ⭐ {q.points || 10} điểm
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Nội dung câu hỏi / Tình huống:
                      </label>
                      <textarea
                        rows={2}
                        value={q.content}
                        onChange={(e) => handleQuestionChange(idx, 'content', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 font-semibold text-xs sm:text-sm outline-hidden"
                      />
                    </div>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isCorrect = q.correctOption === optKey;
                        return (
                          <div
                            key={optKey}
                            className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-50/60 shadow-2xs'
                                : 'border-slate-200 bg-slate-50/40'
                            }`}
                          >
                            <label className="flex items-center gap-1 cursor-pointer shrink-0">
                              <input
                                type="radio"
                                name={`opt-correct-${idx}`}
                                checked={isCorrect}
                                onChange={() => handleQuestionChange(idx, 'correctOption', optKey)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span
                                className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {optKey}
                              </span>
                            </label>
                            <input
                              type="text"
                              value={q.options[optKey]}
                              onChange={(e) => handleOptionChange(idx, optKey, e.target.value)}
                              className="flex-1 bg-transparent border-0 text-xs font-semibold text-slate-800 outline-hidden"
                              placeholder={`Nội dung lựa chọn ${optKey}...`}
                            />
                            {isCorrect && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                Đáp án đúng ✅
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if any */}
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-bold text-slate-600 shrink-0">Giải thích:</span>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                        placeholder="Thêm giải thích ngắn gọn khi học sinh xem lại bài..."
                        className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {activeTab === 'preview' && (
              <button
                type="button"
                onClick={() => setActiveTab('input')}
                className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-white transition-colors cursor-pointer"
              >
                ← Quay lại ô dán văn bản
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-white transition-colors cursor-pointer"
            >
              ĐÓNG
            </button>

            {activeTab === 'preview' && onOpenInEditor && (
              <button
                type="button"
                onClick={handleTransferToEditor}
                className="py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Mở trong bảng biên tập đầy đủ</span>
              </button>
            )}

            {activeTab === 'preview' ? (
              <button
                type="button"
                onClick={handleSaveAndPublish}
                disabled={loading || questions.length === 0}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span>ĐANG LƯU BÀI TẬP...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🚀 LƯU & XUẤT BẢN CHO HỌC SINH LÀM NGAY</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleParse}
                disabled={!rawText.trim()}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>TIẾP TỤC: XEM TRƯỚC BÀI LÀM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
