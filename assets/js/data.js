const G={K:"Kỹ thuật – Công nghệ",T:"Khoa học – Sức khỏe",N:"Sáng tạo – Truyền thông",X:"Con người – Giáo dục",D:"Kinh doanh – Dịch vụ",Q:"Tài chính – Pháp lý"};
// [tên, nhóm, mô tả, 4 môn lựa chọn, ngành học sau THPT, khối thi tham khảo]
const C=[
["Lập trình, AI và dữ liệu","K","Viết phần mềm, ứng dụng, xây hệ thống thông minh.","Vật lí|Hóa học|Tin học|Công nghệ","Công nghệ thông tin, Khoa học dữ liệu, Trí tuệ nhân tạo","A00, A01"],
["Kỹ sư cơ khí, điện, tự động hóa","K","Thiết kế và vận hành máy móc, robot, hệ thống điện.","Vật lí|Hóa học|Công nghệ|Tin học","Cơ khí, Điện – điện tử, Tự động hóa","A00, A01"],
["Kiến trúc và xây dựng","K","Thiết kế công trình, nhà ở, không gian đô thị.","Vật lí|Mỹ thuật|Công nghệ|Tin học","Kiến trúc, Kỹ thuật xây dựng","A00, V00"],
["Bác sĩ, dược sĩ, điều dưỡng","T","Chẩn đoán, điều trị và chăm sóc sức khỏe cho mọi người.","Hóa học|Sinh học|Vật lí|Tin học","Y đa khoa, Dược học, Điều dưỡng","B00"],
["Nghiên cứu khoa học và công nghệ sinh học","T","Làm thí nghiệm, tìm ra vật liệu, giống, thuốc hoặc quy trình mới.","Hóa học|Sinh học|Vật lí|Công nghệ","Công nghệ sinh học, Hóa học, Khoa học vật liệu","A00, B00"],
["Nông nghiệp và môi trường","T","Bảo vệ cây trồng, vật nuôi, đất, nước và hệ sinh thái.","Sinh học|Hóa học|Địa lí|Công nghệ","Nông nghiệp công nghệ cao, Khoa học môi trường","B00, A00"],
["Thiết kế đồ họa và truyền thông số","N","Làm hình ảnh, video, giao diện, nhận diện thương hiệu.","Mỹ thuật|Tin học|Công nghệ|Giáo dục kinh tế và pháp luật","Thiết kế đồ họa, Truyền thông đa phương tiện","H00, D01"],
["Âm nhạc, biểu diễn và nội dung sáng tạo","N","Sáng tác, biểu diễn, sản xuất âm nhạc và nội dung giải trí.","Âm nhạc|Mỹ thuật|Tin học|Giáo dục kinh tế và pháp luật","Sư phạm Âm nhạc, Thanh nhạc, Công nghiệp âm nhạc","N00 (khối năng khiếu)"],
["Báo chí và truyền thông","N","Viết bài, dẫn chương trình, làm báo và nội dung số.","Địa lí|Giáo dục kinh tế và pháp luật|Tin học|Mỹ thuật","Báo chí, Quan hệ công chúng","C00, D01"],
["Giáo viên và sư phạm","X","Dạy học, đồng hành cùng học sinh. Chọn môn theo bộ môn muốn dạy.","Địa lí|Giáo dục kinh tế và pháp luật|Sinh học|Tin học","Các ngành Sư phạm","Tùy ngành"],
["Tâm lí và công tác xã hội","X","Lắng nghe, hỗ trợ cá nhân và cộng đồng vượt qua khó khăn.","Địa lí|Giáo dục kinh tế và pháp luật|Sinh học|Tin học","Tâm lí học, Công tác xã hội","C00, D01"],
["Ngôn ngữ, du lịch và khách sạn","X","Làm việc với người nước ngoài, tổ chức tour, quản lí dịch vụ lưu trú.","Địa lí|Giáo dục kinh tế và pháp luật|Tin học|Âm nhạc","Ngôn ngữ Anh, Quản trị du lịch – khách sạn","D01, C00"],
["Kinh doanh và marketing","D","Tìm hiểu khách hàng, xây thương hiệu, bán hàng và mở dự án riêng.","Giáo dục kinh tế và pháp luật|Địa lí|Tin học|Vật lí","Quản trị kinh doanh, Marketing","A00, A01, D01"],
["Thương mại điện tử và logistics","D","Vận hành cửa hàng online, kho vận, chuỗi cung ứng.","Giáo dục kinh tế và pháp luật|Địa lí|Tin học|Công nghệ","Thương mại điện tử, Logistics","A01, D01"],
["Tài chính, ngân hàng, kế toán","Q","Quản lí tiền, đầu tư, số liệu và báo cáo cho cá nhân, doanh nghiệp.","Giáo dục kinh tế và pháp luật|Vật lí|Tin học|Địa lí","Tài chính – Ngân hàng, Kế toán, Kiểm toán","A00, A01, D01"],
["Luật và hành chính công","Q","Giải thích quy định, bảo vệ quyền lợi, làm việc trong cơ quan nhà nước.","Giáo dục kinh tế và pháp luật|Địa lí|Tin học|Sinh học","Luật, Quản lí nhà nước","C00, D01"]
];
const Q=[
["K","Mình thích tháo lắp, sửa đồ hoặc tìm hiểu máy móc hoạt động ra sao."],
["T","Mình tò mò về cơ thể người, cây cối hoặc các thí nghiệm khoa học."],
["N","Mình thích vẽ, thiết kế, quay dựng hoặc chơi nhạc."],
["X","Mình vui khi giúp bạn hiểu bài hoặc lắng nghe người khác tâm sự."],
["D","Mình thích thuyết phục người khác hoặc đứng ra tổ chức hoạt động cho cả nhóm."],
["Q","Mình cẩn thận với số liệu, thích lập bảng chi tiêu và tính toán chính xác."],
["K","Mình hứng thú với lập trình, làm game hoặc ứng dụng."],
["T","Mình thích tìm câu trả lời cho “vì sao” bằng quan sát và đo đạc."],
["N","Mình hay nghĩ ra ý tưởng mới, kể chuyện hoặc viết nội dung hấp dẫn."],
["X","Mình thích làm tình nguyện, dạy kèm hoặc chăm sóc người khác."],
["D","Mình thích tưởng tượng việc tự mở một cửa hàng hay dự án riêng."],
["Q","Mình thích tranh luận có lý lẽ và tìm hiểu quy định, luật lệ."]
];
const LV=["Chưa thích","Cũng được","Rất thích"];
const SUB=["Toán","Ngữ văn","Tiếng Anh","Vật lí","Hóa học","Sinh học","Tin học","Công nghệ","Địa lí","Giáo dục kinh tế và pháp luật","Mỹ thuật","Âm nhạc"];
const BOOST={"Toán":"KTQ","Ngữ văn":"XN","Tiếng Anh":"DX"};
const TODO=["Trò chuyện với bố mẹ về điều mình mong muốn","Xem lại điểm các môn lớp 6–9: môn nào mình tiến bộ?","Tìm hiểu 2–3 trường THPT và các tổ hợp môn trường mở","Hỏi thầy cô về điểm mạnh của mình","Tham dự buổi tư vấn chọn tổ hợp của trường","Chốt phương án chính và một phương án dự phòng"];
const SUBL=["Địa lí","Giáo dục kinh tế và pháp luật","Vật lí","Hóa học","Sinh học","Tin học","Công nghệ","Âm nhạc","Mỹ thuật"];
