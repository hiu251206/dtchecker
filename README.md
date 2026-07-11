# Date Time Checker

Ứng dụng web kiểm tra tính hợp lệ của ngày/tháng/năm theo lịch Gregorian.  
Bài tập môn **SWT301** — FPT University.

## Tính năng

- Nhập **Day**, **Month**, **Year** và kiểm tra xem ngày đó có tồn tại hay không.
- Validate định dạng và phạm vi đầu vào (Day: 1–31, Month: 1–12, Year: 1000–3000).
- Xử lý năm nhuận chính xác theo quy tắc Gregorian (chia hết 400 → nhuận, chia hết 100 → không nhuận, chia hết 4 → nhuận).
- Giao diện mô phỏng Windows Form với MessageBox tùy chỉnh.

## Công nghệ

- **React** (Vite)
- **Vanilla CSS** (Glassmorphism design)
- **Vitest** (Unit testing)
- **Playwright** (E2E testing)

## Cấu trúc thư mục

```text
.
├── src/                # Mã nguồn chính của ứng dụng
│   ├── app/            # App component chính
│   ├── components/     # Các UI component tái sử dụng
│   ├── features/       # Logic nghiệp vụ (DateChecker.js)
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Các file CSS
└── tests/              # Thư mục chứa các tệp tin kiểm thử
    ├── e2e/            # Các kịch bản kiểm thử E2E (Playwright)
    └── unit/           # Các unit test cho logic nghiệp vụ (Vitest)
```

## Cài đặt & Chạy Thử Nghiệm

### 1. Cài đặt ban đầu

```bash
# Cài đặt các thư viện phụ thuộc
npm install

# Cài đặt các trình duyệt cần thiết cho Playwright (chỉ cần chạy lần đầu)
npx playwright install
```

### 2. Khởi chạy ứng dụng

```bash
# Chạy máy chủ phát triển (Vite Dev Server)
npm run dev
```

---

## 🧪 Hướng Dẫn Chi Tiết Kiểm Thử (Testing Guide)

> [!NOTE]
> Bộ tài liệu hướng dẫn kiểm thử chi tiết từ lập kế hoạch (Plan), thực thi (Execution) đến thu thập báo cáo (Report) đã được biên soạn đầy đủ tại thư mục [docs/](./docs):
> - 🚀 **[Performance Testing Guide](./docs/performance-testing-guide.md)**: Quy trình lập kế hoạch test tải, cấu hình Apache JMeter và xuất báo cáo HTML.
> - 🧩 **[Unit Testing Guide](./docs/unit-testing-guide.md)**: Hướng dẫn viết test logic, chạy test với Vitest (GUI/Watch mode) và phân tích báo cáo độ bao phủ (Coverage report).
> - 🎭 **[E2E Testing Guide](./docs/e2e-testing-guide.md)**: Hướng dẫn viết test giao diện, giả lập luồng người dùng bằng Playwright và phân tích báo cáo HTML lỗi kèm video/ảnh chụp.

Dự án này tích hợp đầy đủ hai cấp độ kiểm thử: **Unit Testing** (Kiểm thử đơn vị) và **End-to-End (E2E) Testing** (Kiểm thử giao diện & luồng nghiệp vụ).

### 1. Kiểm Thử Đơn Vị (Unit Testing) với Vitest

Unit Test tập trung kiểm tra tính đúng đắn của logic nghiệp vụ xử lý ngày tháng nằm ở tệp [DateChecker.js](./src/features/DateChecker.js) (bao gồm hàm `daysInMonth` và `isValidDate`).

* **Vị trí file test:** [DateChecker.test.js](./tests/unit/DateChecker.test.js)
* **Các lệnh thực thi (Định nghĩa tại [package.json](./package.json)):**
  * **Chạy kiểm thử ở chế độ theo dõi (Watch Mode):**
    ```bash
    npm run test
    ```
    *Vitest sẽ chạy ngầm và tự động chạy lại các ca kiểm thử mỗi khi phát hiện thay đổi mã nguồn.*
  * **Chạy kiểm thử một lần duy nhất:**
    ```bash
    npm run test:run
    ```
  * **Chạy kiểm thử với giao diện Web trực quan (Vitest UI):**
    ```bash
    npm run test:ui
    ```
    *Khởi chạy máy chủ cục bộ và mở giao diện Web UI hiển thị danh sách các test case, thời gian thực hiện, trạng thái pass/fail trực quan.*
  * **Chạy kiểm thử và xuất báo cáo HTML:**
    ```bash
    npm run test:report
    ```



---

### 2. Kiểm Thử Giao Diện & Quy Trình (E2E Testing) với Playwright

E2E Test giả lập hành vi người dùng trên trình duyệt thực tế, bao gồm: điền form, nhấp nút, hiển thị MessageBox, xác nhận đóng ứng dụng...

* **Vị trí file test:** [date-checker.spec.js](./tests/e2e/date-checker.spec.js)
* **Cấu hình kiểm thử:** [playwright.config.js](./playwright.config.js)
* **Các lệnh thực thi:**
  > [!IMPORTANT]
  > Playwright được thiết lập tự động khởi động máy chủ cục bộ (`npm run dev`) trước khi chạy test, do đó bạn không cần khởi chạy thủ công.
  
  * **Chạy toàn bộ E2E Test ở chế độ ẩn danh (Headless):**
    ```bash
    npm run test:e2e
    ```
    *Chạy song song trên cả 3 trình duyệt Chromium, Firefox, WebKit.*
  * **Chạy kiểm thử qua giao diện Playwright UI Mode (Rất hữu ích khi debug):**
    ```bash
    npm run test:e2e:ui
    ```
    *Giao diện UI tương tác cho phép chạy từng ca lẻ, xem timeline các bước click/fill, chụp màn hình và kiểm tra lại trạng thái ở từng bước.*
  * **Xem báo cáo HTML:**
    ```bash
    npm run test:e2e:report
    ```
    *Báo cáo kết quả kiểm thử chi tiết kèm theo video ghi hình và ảnh chụp màn hình ghi nhận tại thời điểm xảy ra lỗi.*



---

## 🔄 Tích Hợp Kiểm Thử Tự Động CI/CD (GitHub Actions)

Dự án đã cấu hình sẵn quy trình tích hợp liên tục (CI) tự động chạy kiểm thử thông qua **GitHub Actions**.

### 1. Cách hoạt động
Mỗi khi bạn thực hiện `push` hoặc tạo một `pull_request` lên các nhánh `main`, `master`, hoặc `dev` của kho lưu trữ trên GitHub:
- GitHub sẽ tự động khởi tạo máy ảo Ubuntu đám mây.
- Tải về và cài đặt Node.js cùng toàn bộ thư viện dependencies của dự án.
- Tự động chạy **Unit Tests** (với Vitest) và **E2E Tests** (với Playwright).
- Đảm bảo code mới không làm hỏng các chức năng hiện có trước khi cho phép merge.

### 2. Các bước thực hiện
Để kích hoạt luồng CI này cho kho lưu trữ của bạn trên GitHub:
1. Đảm bảo bạn đã lưu tệp cấu hình tại đường dẫn [.github/workflows/ci.yml](./.github/workflows/ci.yml) ở máy local.
2. Thực hiện commit và push tệp tin này lên GitHub:
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "chore: configure github actions workflow for testing"
   git push origin <tên-nhánh-của-bạn>
   ```
3. Truy cập vào kho lưu trữ của bạn trên trang web GitHub, chọn tab **Actions** để xem danh sách các lần chạy test (workflow runs) đang được xử lý.

### 3. Tải và xem báo cáo lỗi (Test Artifacts)
Nếu kịch bản kiểm thử E2E bị lỗi trên môi trường GitHub Actions:
1. Nhấp vào tên của run bị thất bại trong tab **Actions**.
2. Cuộn xuống phần **Artifacts** ở dưới cùng của trang.
3. Tải xuống tệp tin nén **`playwright-report`**.
4. Giải nén trên máy tính của bạn và mở file `index.html` trong đó bằng trình duyệt để xem các video ghi hình thao tác, screenshot thời điểm lỗi tương tự như khi chạy ở local.

---

### 💡 Các Lưu Ý Quan Trọng Khi Thực Hiện Kiểm Thử

1. **Tính Độc Lập**: Mỗi ca kiểm thử (cả Unit lẫn E2E) phải hoạt động độc lập và không phụ thuộc vào trạng thái được thiết lập bởi các ca kiểm thử trước đó. Tránh việc chia sẻ dữ liệu hoặc trạng thái toàn cục giữa các test.
2. **Sử Dụng Bộ Chọn (Selectors) Ổn Định**: Khi viết E2E test, hãy ưu tiên tìm phần tử qua ID duy nhất của phần tử đó (ví dụ: `#txtDay`, `#btnCheck`, `#btnClear`) thay vì dựa vào thứ tự thẻ HTML hoặc class CSS động để đảm bảo test không bị hỏng khi thay đổi giao diện.
3. **Phân Tích Lỗi Khi Test Thất Bại**:
   - Nếu Unit Test thất bại: Sử dụng `npm run test:ui` để kiểm tra trực quan các giá trị trả về thực tế so với mong muốn.
   - Nếu E2E Test thất bại: Dùng `npm run test:e2e:report` để xem video và ảnh chụp màn hình ghi nhận tại đúng thời điểm bị lỗi.
4. **Tích Hợp Kiểm Thử Thường Xuyên**: Nên chạy Unit Test liên tục trong lúc lập trình và chạy toàn bộ suite E2E trước khi đẩy mã nguồn lên Git.


