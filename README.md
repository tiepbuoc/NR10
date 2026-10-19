# Ngã Rẽ 10
Website tĩnh (HTML/CSS/JS, không cần build) giúp học sinh lớp 9 chọn môn lớp 10.

Trang: index, khao-sat, nghe-nghiep, mon-hoc, so-sanh, ke-hoach. Dữ liệu nghề và câu hỏi nằm trong `assets/js/data.js`; dữ liệu cá nhân lưu trong localStorage của học sinh.

## Đưa lên GitHub Pages
Đẩy toàn bộ thư mục lên repo, vào Settings > Pages, chọn nhánh main, thư mục root.

## Trợ lý AI
Đặt `AI.ENDPOINT` trong `assets/js/app.js` là địa chỉ proxy (ví dụ Firebase Cloud Function) nhận `{model, messages}` và trả về dạng chat/completions. Không đặt khóa API trực tiếp trong file JS vì ai cũng đọc được.

## Chỉnh nội dung
Sửa mảng `C` (nghề, tổ hợp, ngành, khối) và `Q` (câu hỏi) trong `data.js`. Kiểm tra lại thông tin tuyển sinh theo năm.
