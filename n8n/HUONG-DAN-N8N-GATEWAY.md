# NR10 Gateway (n8n)

Workflow `nr10-gateway.json` là **workflow riêng**, tách hoàn toàn với POP-AI: webhook path riêng (`nr10-gw-*`), khóa ký token riêng, bộ đếm/log riêng, credential riêng. Có thể chạy cùng một máy chủ n8n với POP-AI mà không ảnh hưởng nhau (kill switch, hạn mức, thống kê đều độc lập).

## Luồng hoạt động
```
Trình duyệt (assets/js/gateway.js)
  1. Firebase Anonymous Auth -> ID token
  2. POST /webhook/nr10-gw-token  {id_token, page_url}  -> token nội bộ (JWT, ~5 phút)
  3. POST /webhook/nr10-gw-chat   {token, message, history, context, page_url} -> {reply}
  (quản trị) POST /webhook/nr10-gw-admin  header x-admin-key  {action: stats|logs|enable|disable}
```
Token chat được n8n tự kiểm tra: Origin cho phép, hạn mức theo IP / học sinh (phút, ngày), trần ngày toàn hệ thống (request và token), độ dài nội dung. Model gọi theo thứ tự `gpt-4.1-mini` -> `gpt-4o-mini` -> `gpt-5-mini`, chuyển tiếp khi lỗi 5xx.

## Cài đặt (làm một lần)
1. **Firebase NR10** (`nr10-34b6a`): Authentication > Sign-in method > bật **Anonymous**. Nếu API key Web của Firebase đang bị giới hạn "HTTP referrers", n8n gọi từ máy chủ sẽ bị từ chối khi xác minh; hãy dùng key không giới hạn theo referrer (hạn chế theo API: Identity Toolkit) hoặc tắt giới hạn referrer.
2. **n8n > Credentials > New > Header Auth**, đặt tên đúng `NR10 LLM API Key`: Name `Authorization`, Value `Bearer <API key LLM mới>`.
3. **Import** `nr10-gateway.json` (Workflows > Import from file). Mở 3 node `LLM 1`, `LLM 2`, `LLM 3`, chọn lại credential `NR10 LLM API Key` nếu n8n chưa tự gán.
4. Mở node **Config** và kiểm tra:
   - `allowedOrigins`: domain chạy web NR10 (mặc định `https://tiepbuoc.github.io`; thêm `http://localhost:5500` khi thử ở máy). Chỉ ghi domain, không có đường dẫn.
   - `adminKey`: để rỗng thì endpoint admin tắt hoàn toàn. Muốn dùng, đặt chuỗi dài ngẫu nhiên.
   - Hạn mức: `perUserPerMin`, `perUserPerDay`, `dailyRequestCap`, `dailyTokenCap`, `maxTokens`.
5. **Active/Publish** workflow.
6. Mở `assets/js/gateway-config.js`, kiểm tra `GATEWAY_BASE_URL` là URL gốc webhook của n8n (kết thúc bằng `/webhook`).
7. Đưa web lên, mở trang, bấm nút chatbot và hỏi thử.

## Thu hồi API key cũ
Bản NR10 trước đây để API key LLM trong `assets/js/app.js` (ai cũng đọc được, và nằm trong lịch sử Git). **Hãy thu hồi (revoke) key đó** ở nhà cung cấp và dùng key mới chỉ cho n8n.

## Quản trị
Gọi bằng POST, header `x-admin-key: <adminKey>`:
- `{"action":"stats"}`: thống kê theo ngày, theo web.
- `{"action":"logs"}`: log gần nhất (tối đa `logKeep` dòng).
- `{"action":"disable"}` / `{"action":"enable"}`: tắt/bật khẩn cấp toàn bộ gateway NR10.

## Lưu ý
- Học sinh dùng chung mạng trường nên chung IP: `ipMaxPerMinToken/Chat` đã đặt 120/phút (cao hơn POP-AI). Hạ xuống nếu bị lạm dụng.
- Học sinh có thể xóa dữ liệu trình duyệt để có phiên ẩn danh mới và lách hạn mức theo người; các lớp chặn theo IP và trần toàn hệ thống vẫn áp dụng. Muốn chặt hơn, giảm `dailyRequestCap` / `dailyTokenCap`.
- Log, bộ đếm, khóa ký token nằm trong static data của workflow, chỉ ghi khi workflow chạy ở chế độ production; import đè workflow sẽ làm mất chúng (học sinh chỉ cần chờ xin token mới).
- Lỗi thường gặp: `forbidden` = origin chưa có trong `allowedOrigins`; `auth_failed` trong console = chưa bật Anonymous; `invalid_id_token` = API key Firebase sai hoặc bị giới hạn referrer.
