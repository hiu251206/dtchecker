# Hướng Dẫn Nhanh Các Lệnh Chạy Kiểm Thử (Quick Start Testing Commands)

Tài liệu này tóm tắt ngắn gọn toàn bộ các câu lệnh terminal cần thiết để thực hiện cài đặt và chạy thử nghiệm **Unit Test** và **E2E Test** cho dự án `datetime-checker-web`.

---

## 1. Chuẩn Bị Ban Đầu (Chỉ chạy lần đầu)

Mở terminal tại thư mục dự án và chạy các lệnh sau:
```bash
# Cài đặt toàn bộ thư viện dependencies của dự án
npm install

# Tải các trình duyệt lõi phục vụ E2E Test (Playwright)
npx playwright install
```

---

## 2. Kiểm Thử Đơn Vị - Unit Testing (Vitest)

Các lệnh thực thi kiểm thử logic xử lý ngày tháng:

```bash
# 1. Chạy ở chế độ theo dõi liên tục (Watch Mode)
npm run test

# 2. Chạy kiểm thử một lần duy nhất (Dùng cho CI/CD)
npm run test:run

# 3. Mở giao diện Web UI tương tác của Vitest
npm run test:ui

# 4. Chạy kiểm thử và xuất báo cáo độ bao phủ mã nguồn (Coverage Report)
npm run test:report
```
*Sau khi chạy xuất báo cáo, bạn có thể mở file `./coverage/index.html` bằng trình duyệt để xem độ bao phủ chi tiết.*

---

## 3. Kiểm Thử Giao Diện & Nghiệp Vụ - E2E Testing (Playwright)

Playwright sẽ tự khởi chạy server web React ngầm trước khi chạy test, bạn chỉ cần gõ:

```bash
# 1. Chạy toàn bộ E2E Test ở chế độ ẩn danh (Headless Mode)
npm run test:e2e

# 2. Mở giao diện Playwright UI Mode để debug trực quan từng bước
npm run test:e2e:ui

# 3. Xem báo cáo kết quả kiểm thử HTML (Kèm video/ảnh chụp màn hình khi lỗi)
npm run test:e2e:report
```

