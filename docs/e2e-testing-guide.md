# Hướng dẫn Kiểm thử Giao diện & Luồng Nghiệp vụ (E2E Testing Guide) với Playwright

Tài liệu này hướng dẫn chi tiết quy trình từ đầu đến cuối của việc lập kế hoạch, chuẩn bị công cụ, viết kịch bản, thực thi kiểm thử và xuất báo cáo kiểm thử giao diện đầu cuối (E2E) cho ứng dụng Web bằng **Playwright**.

---

## 1. Chuẩn bị & Cài đặt Công cụ

**Playwright** là framework E2E testing thế hệ mới hỗ trợ chạy test đa trình duyệt (Chromium, Firefox, WebKit) cực kỳ ổn định, tốc độ nhanh và có khả năng tự động chờ (Auto-wait) giúp hạn chế lỗi "flaky test" (lỗi kiểm thử chập chờn lúc pass lúc fail).

### Bước 1: Khởi tạo và cài đặt Browser Cores
Khi cấu hình Playwright lần đầu trong dự án Node.js, bạn cần tải về các phiên bản trình duyệt lõi do Playwright quản lý:
1. Mở terminal tại thư mục dự án `datetime-checker-web`.
2. Chạy lệnh cài đặt các trình duyệt:
   ```bash
   npx playwright install
   ```
   *Lệnh này sẽ tự động tải các nhân trình duyệt Chromium, Firefox, WebKit tương thích chính xác với phiên bản Playwright hiện tại.*

### Bước 2: Cài đặt Extension Playwright trên VS Code
Để nâng cao năng suất viết và gỡ lỗi kịch bản:
1. Mở mục **Extensions** (phím tắt `Ctrl + Shift + X`).
2. Tìm kiếm từ khóa **`Playwright Test`** (tác giả: *Microsoft*).
3. Nhấn **Install** để cài đặt.
4. Extension này cho phép bạn:
   - Chạy test trực tiếp bằng cách bấm biểu tượng Play ở lề trái code.
   - Ghi lại thao tác trên màn hình tự động xuất ra code test (Record new test).
   - Chọn nhanh selector trực tiếp trên trang Web (Pick locator).

---

## 2. Xây dựng Kế hoạch Kiểm thử E2E (E2E Test Plan)

Kiểm thử E2E giả lập chính xác hành động của người dùng trên trình duyệt thực tế.

### 2.1. Xác định luồng nghiệp vụ kiểm thử (User Flows)
Đối với ứng dụng **Date Time Checker**, các kịch bản cần phủ bao gồm:
1. **Luồng kiểm tra thành công (Happy Path):** Người dùng nhập đúng ngày hợp lệ (ví dụ: `29`, `2`, `2024` - năm nhuận), nhấn nút **Check**, ứng dụng hiển thị thông báo ngày tháng năm hợp lệ.
2. **Luồng kiểm tra thất bại (Unhappy Path):**
   - Nhập ngày không hợp lệ (ví dụ: ngày `29/02/2023` - năm thường).
   - Nhập ngày/tháng/năm ngoài phạm vi cho phép (ví dụ: ngày `32`, tháng `13`, năm `999` hoặc `3001`).
   - Nhập sai định dạng (ví dụ: chữ cái thay vì số nguyên).
   - Bỏ trống các ô nhập liệu và bấm Check.
3. **Luồng xóa dữ liệu (Clear Flow):** Người dùng nhập dữ liệu, nhấn nút **Clear** (Xóa) -> Xác nhận các ô nhập liệu được đưa về trạng thái trống ban đầu.
4. **Hành vi tương tác MessageBox:** Khi ứng dụng hiển thị thông báo (ví dụ MessageBox báo ngày hợp lệ/lỗi), người dùng phải nhấn nút **OK** hoặc nút đóng để tiếp tục tương tác với form.

### 2.2. Thiết lập quy tắc kiểm thử độc lập
* **Không phụ thuộc:** Mỗi ca kiểm thử E2E phải hoàn toàn độc lập. Trước mỗi ca test (`beforeEach`), Playwright sẽ khởi tạo một **Browser Context** hoàn toàn mới (sạch như chế độ ẩn danh), đảm bảo cookies, cache hay trạng thái của test case trước không ảnh hưởng đến test case sau.
* **Bộ chọn ổn định (Robust Selectors):** Ưu tiên sử dụng thuộc tính ID hoặc bộ chọn người dùng có thể nhìn thấy (User-facing locators) để viết test, tránh dùng đường dẫn HTML dài (XPath tuyệt đối) vì dễ bị hỏng khi thay đổi giao diện.
  - Tốt nhất: `#txtDay`, `#txtMonth`, `#txtYear`, `#btnCheck`, `#btnClear`
  - Hoặc: `page.getByRole('button', { name: 'Check' })`

---

## 3. Viết Kịch Bản & Thực Thi E2E Test

### 3.1. Cấu trúc kịch bản test Playwright mẫu
Tệp tin test được đặt tên có đuôi `.spec.js`. Ví dụ kịch bản test tại **[date-checker.spec.js](../tests/e2e/date-checker.spec.js)**:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Ứng dụng Date Time Checker Web E2E', () => {

  // Trước mỗi test case, truy cập vào trang chủ của ứng dụng
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Cấu hình baseURL là http://localhost:5173
  });

  test('TC01: Kiểm tra ngày hợp lệ thành công (Ngày thường)', async ({ page }) => {
    // Điền thông tin vào form
    await page.fill('#txtDay', '15');
    await page.fill('#txtMonth', '8');
    await page.fill('#txtYear', '2023');

    // Click nút Check
    await page.click('#btnCheck');

    // Xác nhận MessageBox xuất hiện và chứa thông điệp thành công
    const messageBox = page.locator('#message-box');
    await expect(messageBox).toBeVisible();
    await expect(messageBox).toContainText('15/8/2023 is a valid date');

    // Click OK đóng MessageBox
    await page.click('#btn-mb-ok');
    await expect(messageBox).toBeHidden();
  });

  test('TC02: Kiểm tra báo lỗi khi nhập ngày không hợp lệ', async ({ page }) => {
    await page.fill('#txtDay', '31');
    await page.fill('#txtMonth', '4'); // Tháng 4 chỉ có 30 ngày
    await page.fill('#txtYear', '2023');

    await page.click('#btnCheck');

    // Xác nhận MessageBox thông báo lỗi nhập sai
    const messageBox = page.locator('#message-box');
    await expect(messageBox).toBeVisible();
    await expect(messageBox).toContainText('Input data is out of range');

    await page.click('#btn-mb-ok');
  });

  test('TC03: Kiểm tra tính năng Clear (Xóa dữ liệu)', async ({ page }) => {
    await page.fill('#txtDay', '10');
    await page.fill('#txtMonth', '10');
    await page.fill('#txtYear', '2020');

    // Nhấn nút Clear
    await page.click('#btnClear');

    // Xác nhận các ô nhập liệu đã trống
    await expect(page.locator('#txtDay')).toHaveValue('');
    await expect(page.locator('#txtMonth')).toHaveValue('');
    await expect(page.locator('#txtYear')).toHaveValue('');
  });
});
```

### 3.2. Các câu lệnh chạy E2E Test

Dưới đây là các lệnh chạy được định nghĩa trong [package.json](../package.json):

#### 1. Chạy E2E Test ở chế độ ẩn danh (Headless Mode)
Lệnh này sẽ chạy toàn bộ các ca test ngầm trên 3 lõi trình duyệt (Chromium, Firefox, WebKit) song song để đạt tốc độ tối đa.
```bash
npm run test:e2e
```

#### 2. Chạy E2E Test ở chế độ UI tương tác (UI Mode - Khuyên dùng khi code test)
Khởi chạy giao diện tương tác của Playwright. Tại đây bạn có thể chọn chạy từng test case, xem trực quan timeline các bước click/fill, xem screenshot của từng bước và kiểm tra lại trạng thái ở DOM.
```bash
npm run test:e2e:ui
```

---

## 4. Xem và Phân Tích Báo Cáo E2E (HTML Report)

Playwright tự động tạo ra một báo cáo HTML cực kỳ trực quan và chi tiết, đặc biệt hữu ích khi phát hiện các test case bị lỗi.

### Bước 1: Khởi chạy báo cáo HTML
Sau khi chạy kiểm thử xong (đặc biệt khi có test case bị lỗi), chạy lệnh sau để mở báo cáo:
```bash
npm run test:e2e:report
```
*Trình duyệt sẽ tự động mở trang web báo cáo kết quả kiểm thử.*

### Bước 2: Phân tích báo cáo
* **Giao diện tổng quát:** Hiển thị tổng số test case đã chạy, số lượng PASS, FAIL, FLAKY (chập chờn) và SKIPPED. Bạn có thể lọc kết quả theo trình duyệt hoặc trạng thái.
* **Báo cáo của từng ca test (Test Case Detail):** Nhấp chuột vào một test case bị lỗi (màu đỏ) để xem chi tiết:
  - **Errors:** Log chi tiết dòng code nào bị lỗi và nguyên nhân tại sao lỗi (ví dụ: mong đợi text là "is a valid date" nhưng thực tế là trống).
  - **Test Steps:** Hiển thị chi tiết thời gian chạy từng bước (click, fill, wait). Bước bị lỗi sẽ có đánh dấu đỏ giúp định vị nhanh lỗi xảy ra ở bước nào.
  - **Attachments (Ảnh & Video):** Nếu cấu hình trong `playwright.config.js` có ghi hình hoặc chụp màn hình khi lỗi:
    - **Screenshot:** Ảnh chụp màn hình trình duyệt tại đúng thời điểm test case bị lỗi rẽ nhánh.
    - **Video:** Đoạn video ngắn ghi lại toàn bộ thao tác tự động của Playwright, giúp bạn xem lại luồng đi và phát hiện lỗi giao diện trực quan.
    - **Trace Viewer:** File trace ghi lại toàn bộ sự kiện mạng, console log và hoạt động của trình duyệt tại mỗi mili-giây chạy test. Nhấp chuột vào liên kết Trace để mở trình phân tích sâu.
