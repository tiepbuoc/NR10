# Ngã Rẽ 10
Website tĩnh (HTML/CSS/JS, không cần build) giúp học sinh lớp 9 chọn môn lớp 10.

Trang: index, khao-sat, nghe-nghiep, mon-hoc, so-sanh, ke-hoach, và **admin** (quản trị nội dung).
Nội dung (nghề, nhóm nghề, câu hỏi, môn học, việc cần làm) lưu trong **Firestore**, tài liệu `site/content`. Dữ liệu cá nhân của học sinh (kết quả khảo sát, so sánh, kế hoạch) vẫn chỉ lưu trong localStorage trên máy các em.

## Thiết lập Firebase (làm một lần)
Dự án Firebase: `nr10-34b6a` (cấu hình nằm trong `assets/js/firebase-config.js`).

1. **Firestore Database**: vào Build > Firestore Database > Create database (chế độ production).
2. **Authentication**: Build > Authentication > Sign-in method > bật **Email/Password**. Sang tab Users > Add user, tạo tài khoản quản trị (email + mật khẩu mạnh).
3. **Rules**: mở `firestore.rules`, thay `THAY_BANG_EMAIL_QUAN_TRI@gmail.com` bằng email vừa tạo, rồi dán vào Firestore > Rules > Publish.
4. **Tên miền**: Authentication > Settings > Authorized domains, thêm tên miền đang chạy site (ví dụ `tenban.github.io`). `localhost` có sẵn.
5. Mở `admin.html`, đăng nhập, bấm **Lưu lên Firestore** để nạp dữ liệu mẫu lần đầu.

Khi Firestore chưa có dữ liệu, mất mạng hoặc lỗi, site tự dùng bản lưu gần nhất trên máy hoặc dữ liệu mẫu trong `assets/js/data.js`, nên học sinh không bị trắng trang.

## Trang admin (`admin.html`)
- **Nghề nghiệp**: thêm, sửa, xóa, đổi thứ tự; chọn đúng 4 môn lựa chọn, ngành học, khối thi.
- **Nhóm nghề**: tên, màu, biểu tượng Font Awesome.
- **Câu hỏi khảo sát**: nội dung, nhóm, thứ tự.
- **Môn học**: môn lựa chọn lớp 10, môn ở câu hỏi cuối khảo sát, và nhóm nghề được cộng điểm theo môn mạnh. Đổi tên môn sẽ tự cập nhật ở các nghề.
- **Việc cần làm**: danh sách ở trang Kế hoạch.
- **Sao lưu**: tải/nhập JSON, khôi phục dữ liệu mẫu.

Thay đổi chỉ lên Firestore khi bấm **Lưu lên Firestore**. Trang không có liên kết từ menu, hãy mở trực tiếp `/admin.html`. Việc ai được ghi dữ liệu do `firestore.rules` quyết định, không phải do việc giấu trang.

Lưu ý: nếu thay đổi số câu hỏi khảo sát, học sinh đã làm khảo sát trước đó sẽ phải làm lại.

## Đưa lên GitHub Pages
Đẩy toàn bộ thư mục lên repo, vào Settings > Pages, chọn nhánh main, thư mục root.

## Trợ lý AI
Đặt `AI.ENDPOINT` trong `assets/js/app.js` là địa chỉ proxy (ví dụ Firebase Cloud Function) nhận `{model, messages}` và trả về dạng chat/completions. Không đặt khóa API trực tiếp trong file JS vì ai cũng đọc được.
