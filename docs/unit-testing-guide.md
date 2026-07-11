# Hướng dẫn Kiểm thử Đơn vị (Unit Testing Guide) với Vitest

Tài liệu này hướng dẫn chi tiết quy trình từ đầu đến cuối của việc lập kế hoạch, chuẩn bị công cụ, viết kịch bản, thực thi kiểm thử và xuất báo cáo kiểm thử đơn vị cho ứng dụng Web React bằng **Vitest**.

---

## 1. Chuẩn bị & Cài đặt Công cụ

Dự án `datetime-checker-web` sử dụng **Vitest** làm framework unit test chính thay thế cho Jest nhờ tốc độ khởi động nhanh và khả năng tương thích trực tiếp với cấu hình của Vite.

### Bước 1: Các thư viện cần thiết trong dự án
Nếu bạn thiết lập từ dự án mới, các thư viện cần cài đặt thông qua `npm` bao gồm:
* `vitest`: Thư viện kiểm thử cốt lõi.
* `@testing-library/react`: Hỗ trợ render component và tương tác với DOM ảo của React.
* `@vitest/coverage-v8` hoặc `@vitest/coverage-istanbul`: Công cụ đo và xuất báo cáo độ bao phủ mã nguồn (Code Coverage).

*Lưu ý: Trong dự án này, các thư viện này đã được cấu hình sẵn trong file [package.json](../package.json).*

### Bước 2: Cài đặt Extension hỗ trợ trên VS Code
Để chạy và debug test case một cách trực quan trên VS Code mà không cần gõ dòng lệnh:
1. Mở mục **Extensions** (phím tắt `Ctrl + Shift + X`).
2. Tìm kiếm từ khóa **`Vitest`** (tác giả: *Zixuan Chen* / *Vitest*).
3. Nhấn **Install** để cài đặt.
4. Sau khi cài đặt, bạn sẽ thấy một biểu tượng ống nghiệm (Testing) xuất hiện ở thanh công cụ bên trái VS Code. Bạn có thể nhấn trực tiếp biểu tượng Play cạnh mỗi test case để chạy thử.

---

## 2. Xây dựng Kế hoạch Kiểm thử Đơn vị (Unit Test Plan)

Unit Test tập trung kiểm thử các hàm logic độc lập, không phụ thuộc vào giao diện (UI) hay các dịch vụ bên ngoài (External APIs/Database).

### 2.1. Xác định phạm vi kiểm thử (Scope)
Mục tiêu chính trong dự án này là logic xử lý ngày tháng nằm ở tệp tin **[DateChecker.js](../src/features/DateChecker.js)**, cụ thể là các hàm:
* `daysInMonth(month, year)`: Trả về số ngày của một tháng trong năm tương ứng.
* `isValidDate(day, month, year)`: Kiểm tra tính hợp lệ của bộ ba giá trị Ngày, Tháng, Năm.

### 2.2. Thiết kế Test Case (Kỹ thuật Thiết kế Hộp Đen)
Để đảm bảo kiểm thử bao phủ toàn bộ các trường hợp, chúng ta sử dụng hai kỹ thuật chính:
1. **Phân vùng tương đương (Equivalence Partitioning):**
   - Phân chia các giá trị đầu vào thành các phân vùng hợp lệ và không hợp lệ.
   - *Ví dụ:* Month hợp lệ [1 - 12], không hợp lệ: nhỏ hơn 1 hoặc lớn hơn 12.
2. **Phân tích giá trị biên (Boundary Value Analysis):**
   - Tập trung kiểm thử tại các điểm biên của phân vùng.
   - *Ví dụ:* Với Month, kiểm thử các giá trị biên như `0`, `1`, `12`, `13`.
   - Đối với Year, kiểm thử biên quy định của đề bài `1000` và `3000` (ví dụ: `999`, `1000`, `3000`, `3001`).
   - Đối với năm nhuận (Leap Year): Kiểm thử các giá trị biên của điều kiện nhuận (ví dụ: năm chia hết cho 400 như `2000` - Nhuận; chia hết cho 100 nhưng không chia hết cho 400 như `1900` - Không nhuận; chia hết cho 4 nhưng không chia hết cho 100 như `2024` - Nhuận; không chia hết cho 4 như `2023` - Không nhuận).

### 2.3. Đặt chỉ tiêu độ bao phủ mã nguồn (Code Coverage KPIs)
Độ bao phủ mã nguồn đo lường tỷ lệ dòng code được thực thi khi chạy bộ test. Các mục tiêu cần đạt:
* **Statement Coverage (Độ bao phủ câu lệnh):** `> 90%`
* **Branch/Decision Coverage (Độ bao phủ nhánh rẽ):** `> 85%` (rất quan trọng cho các hàm chứa nhiều điều kiện `if-else` phức tạp như hàm kiểm tra năm nhuận).

---

## 3. Thực thi Kiểm thử Đơn vị với Vitest

### 3.1. Cấu trúc một file kiểm thử mẫu
Các file test thường có đuôi mở rộng `.test.js` hoặc `.spec.js`. Dưới đây là cách tổ chức test case cho hàm logic kiểm tra ngày tháng:

```javascript
import { describe, it, expect } from 'vitest';
import { isValidDate, daysInMonth } from './DateChecker';

describe('Kiểm thử hàm daysInMonth()', () => {
  it('Nên trả về 31 ngày cho Tháng 1', () => {
    expect(daysInMonth(1, 2023)).toBe(31);
  });

  it('Nên trả về 29 ngày cho Tháng 2 của năm nhuận (2000)', () => {
    expect(daysInMonth(2, 2000)).toBe(29);
  });

  it('Nên trả về 28 ngày cho Tháng 2 của năm thường (1900)', () => {
    expect(daysInMonth(2, 1900)).toBe(28);
  });
});

describe('Kiểm thử hàm isValidDate() - Các trường hợp biên', () => {
  // Biên dưới hợp lệ và không hợp lệ của Month
  it('Không hợp lệ nếu tháng nhỏ hơn 1 (month = 0)', () => {
    expect(isValidDate(15, 0, 2023)).toBe(false);
  });

  it('Hợp lệ nếu tháng ở biên dưới (month = 1)', () => {
    expect(isValidDate(15, 1, 2023)).toBe(true);
  });

  // Biên trên hợp lệ và không hợp lệ của Year
  it('Hợp lệ nếu năm ở biên trên (year = 3000)', () => {
    expect(isValidDate(1, 1, 3000)).toBe(true);
  });

  it('Không hợp lệ nếu năm vượt quá biên trên (year = 3001)', () => {
    expect(isValidDate(1, 1, 3001)).toBe(false);
  });

  // Trường hợp ngày không tồn tại
  it('Không hợp lệ cho ngày 29/02 của năm không nhuận (2023)', () => {
    expect(isValidDate(29, 2, 2023)).toBe(false);
  });
});
```

### 3.2. Các câu lệnh thực thi kiểm thử (CLI Commands)

Trong thư mục dự án Web, bạn có thể thực thi các lệnh sau (đã định nghĩa sẵn ở `package.json`):

#### 1. Chạy ở chế độ Watch Mode (Mặc định)
Lệnh này khởi chạy Vitest và liên tục lắng nghe thay đổi của file mã nguồn. Mỗi khi bạn lưu file, Vitest sẽ tự động chạy lại các test tương ứng rất nhanh chóng.
```bash
npm run test
```

#### 2. Chạy kiểm thử một lần duy nhất (Run Mode)
Thường được dùng khi tích hợp CI/CD hoặc trước khi thực hiện commit/push code lên Git.
```bash
npm run test:run
```

#### 3. Chạy kiểm thử với Giao diện Vitest UI
Khởi chạy một web server hiển thị kết quả kiểm thử trên trình duyệt cực kỳ trực quan và đẹp mắt.
```bash
npm run test:ui
```
*Giao diện Vitest UI giúp bạn xem được danh sách tất cả các test file, trạng thái từng ca test, thời gian chạy, log lỗi cụ thể và cấu trúc cây thư mục.*

---

## 4. Phân tích Báo cáo Độ bao phủ Mã nguồn (Coverage Report)

Độ bao phủ mã nguồn giúp chỉ ra các đoạn code (hoặc các nhánh `if-else`) mà bộ test case của bạn chưa chạm tới, từ đó bổ sung thêm test case thích hợp.

### Bước 1: Chạy lệnh xuất báo cáo Coverage
Chạy lệnh sau để Vitest thực thi các ca test và tính toán độ bao phủ:
```bash
npm run test:report
```
*(Nếu chưa cài đặt engine coverage, Vitest sẽ hỏi bạn có muốn cài đặt `@vitest/coverage-v8` hay không, hãy chọn **Y** để tự động cài đặt).*

### Bước 2: Xem kết quả thống kê dạng Bảng
Kết quả sơ bộ sẽ được hiển thị ngay trên màn hình terminal:
* **% Stmts (Statements):** Phần trăm các câu lệnh đơn lẻ được chạy qua.
* **% Branch (Branches):** Phần trăm các nhánh rẽ điều kiện (đúng/sai) được chạy qua.
* **% Funcs (Functions):** Phần trăm các hàm được gọi.
* **% Lines (Lines):** Phần trăm các dòng code được thực thi.

```text
Active coverage on: d:\...\datetime-checker-web\src
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   95.23 |    92.85 |     100 |   95.23 |                   
 DateChecker.js  |     100 |      100 |     100 |     100 |                   
 App.jsx         |   88.23 |    75.00 |     100 |   88.23 | 25-27             
-----------------|---------|----------|---------|---------|-------------------
```

### Bước 3: Đọc hiểu Báo cáo HTML chi tiết
Sau khi chạy lệnh xuất báo cáo, thư mục **`coverage/`** sẽ được tạo ra tại thư mục gốc của dự án.
1. Tìm và mở file **`coverage/index.html`** trên trình duyệt Web.
2. Bạn sẽ thấy danh sách các thư mục và file mã nguồn kèm tỷ lệ phần trăm trực quan.
3. Kích chuột vào file **`DateChecker.js`** hoặc **`App.jsx`**:
   - Các dòng code có **màu xanh lá** kèm chỉ số số lần chạy (ví dụ `12x`) nghĩa là đã được test phủ qua.
   - Các dòng code có **màu đỏ** (ví dụ dòng rẽ nhánh `else` hiển thị MessageBox lỗi) nghĩa là **chưa được test case nào chạm đến** (Uncovered Lines).
4. Dựa vào các dòng màu đỏ này, hãy viết bổ sung thêm test case (ví dụ viết test case nhập sai dữ liệu để kích hoạt khối code xử lý lỗi) nhằm nâng độ bao phủ lên **`100%`**.
