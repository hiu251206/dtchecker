# Hướng dẫn Kiểm thử Hiệu năng (Performance Testing Guide) với Apache JMeter

Tài liệu này hướng dẫn chi tiết quy trình từ đầu đến cuối của việc lập kế hoạch, chuẩn bị công cụ, xây dựng kịch bản, thực thi kiểm thử và xuất báo cáo hiệu năng cho ứng dụng Web bằng **Apache JMeter**.

---

## 1. Chuẩn bị & Cài đặt Công cụ

Để chạy được Apache JMeter, máy tính của bạn cần được cài đặt môi trường Java (JRE hoặc JDK).

### Bước 1: Cài đặt Java (JRE/JDK)
1. Tải bản cài đặt **Java JDK 17** hoặc mới hơn từ trang chủ Oracle hoặc Adoptium:
   - [Adoptium Eclipse Temurin JDK (Khuyên dùng)](https://adoptium.net/) hoặc [Oracle JDK](https://www.oracle.com/java/technologies/downloads/).
2. Chạy file cài đặt và làm theo hướng dẫn.
3. Kiểm tra cài đặt thành công bằng cách mở terminal (`cmd` hoặc `PowerShell`) và gõ lệnh:
   ```bash
   java -version
   ```
   Nếu màn hình hiển thị thông tin phiên bản Java (ví dụ `openjdk version "17.0.x"`), bạn đã cài đặt thành công.

### Bước 2: Tải và giải nén Apache JMeter
1. Truy cập trang tải về chính thức của JMeter: [Apache JMeter Downloads](https://jmeter.apache.org/download_jmeter.cgi).
2. Tại phần **Binaries**, tải xuống file nén zip (ví dụ: `apache-jmeter-5.x.zip`).
3. Giải nén file `.zip` vừa tải vào một thư mục dễ nhớ trên ổ đĩa của bạn (ví dụ: `C:\apache-jmeter-5.6.3`).

### Bước 3: Khởi chạy JMeter GUI
1. Truy cập thư mục giải nén, vào tiếp thư mục `bin` (ví dụ: `C:\apache-jmeter-5.6.3\bin`).
2. Tìm và kích đúp chuột vào file **`jmeter.bat`** (trên Windows) để khởi chạy giao diện đồ họa (GUI) của JMeter.
3. Màn hình JMeter GUI sẽ xuất hiện cùng với một cửa sổ dòng lệnh màu đen (không tắt cửa sổ này vì nó là tiến trình nền của JMeter).

---

## 2. Xây dựng Kế hoạch Kiểm thử Hiệu năng (Performance Test Plan)

Trước khi cấu hình trên công cụ, bạn cần xác định rõ các yếu tố của một kế hoạch kiểm thử tải.

### 2.1. Xác định Mục tiêu Kiểm thử (Test Types)
* **Load Testing (Kiểm thử tải):** Đánh giá hành vi của hệ thống khi lượng người dùng tăng dần đến mức tải dự kiến (ví dụ: 100 người dùng đồng thời) để xem hệ thống có phản hồi ổn định trong giới hạn cho phép không.
* **Stress Testing (Kiểm thử áp lực):** Đẩy tải vượt quá khả năng chịu đựng dự kiến (ví dụ: 500, 1000 người dùng) để xác định điểm gãy (breaking point) của hệ thống và cách hệ thống phục hồi.
* **Endurance/Soak Testing (Kiểm thử độ bền):** Chạy tải liên tục ở mức tải trung bình trong thời gian dài (ví dụ: 2 - 8 tiếng) để kiểm tra các lỗi rò rỉ bộ nhớ (memory leaks) hoặc cạn kiệt tài nguyên.
* **Spike Testing (Kiểm thử đột biến):** Đột ngột tăng lượng người dùng lên cực lớn trong thời gian rất ngắn để xem hệ thống có xử lý kịp thời không.

### 2.2. Xác định các chỉ số KPIs / Metrics mục tiêu
Khi test hiệu năng cho ứng dụng Web, các chỉ số sau đây cần được thỏa mãn:
* **Response Time (Thời gian phản hồi):**
  - Trung bình (Average Response Time) nên `< 2 giây` cho các request thông thường.
  - Phân vị thứ 90/95 (90th/95th Percentile): 90% hoặc 95% số request có thời gian phản hồi thấp hơn ngưỡng này.
* **Throughput (TPS - Transactions Per Second):** Số lượng giao dịch/request xử lý thành công trong 1 giây. TPS càng cao càng tốt.
* **Error Rate (Tỷ lệ lỗi):** Tỷ lệ phần trăm các request bị lỗi (như lỗi HTTP 500, Gateway Timeout 504, Connection Timeout). Mục tiêu tối ưu là **`0%`** (hoặc `< 1%` dưới tải cực đại).

### 2.3. Thiết kế kịch bản tải (Workload Model)
Kịch bản tải định nghĩa cách phân bổ tải theo thời gian, bao gồm 3 tham số cốt lõi trong JMeter:
1. **Number of Threads (Users):** Số lượng người dùng ảo (VUs) giả lập đồng thời.
2. **Ramp-up period (seconds):** Thời gian cần thiết để khởi chạy toàn bộ số người dùng ảo trên.
   * *Ví dụ:* Nếu cấu hình 100 Threads và Ramp-up là 50 giây, JMeter sẽ mất 50 giây để khởi chạy hết 100 users (trung bình cứ mỗi 0.5 giây sẽ có 1 user mới được tạo ra và gửi request). Điều này giúp tải tăng dần đều, tránh làm sập server ngay lập tức.
3. **Loop Count / Duration:**
   * **Loop Count (Số vòng lặp):** Số lần mỗi thread chạy lại kịch bản (ví dụ: chạy 10 lần rồi dừng).
   - **Duration (Thời gian chạy - khuyến nghị):** Chọn cấu hình chạy theo thời gian (ví dụ: chạy liên tục trong 5 phút/300 giây) để đo tải ổn định hơn.

---

## 3. Tạo Kịch bản Kiểm thử trên JMeter GUI

Chúng ta sẽ tạo kịch bản kiểm thử tải trang chủ và tính năng của ứng dụng `Date Time Checker` (chạy tại cổng `http://localhost:5173` khi chạy dev hoặc URL deploy thực tế).

### Bước 1: Tạo Thread Group
1. Nhấp chuột phải vào **Test Plan** -> **Add** -> **Threads (Users)** -> **Thread Group**.
2. Đặt tên gợi nhớ (ví dụ: `Load Test - Date Time Checker Web`).
3. Cấu hình các thông số tải:
   - **Number of Threads (users):** `50` (Ví dụ test với 50 người dùng đồng thời).
   - **Ramp-up period (seconds):** `10` (Tải tăng dần đều trong 10 giây).
   - Chọn **Infinite** tại Loop Count và tick chọn **Specify Thread Lifetime**.
   - **Duration (seconds):** `120` (Chạy liên tục test tải trong 120 giây / 2 phút).

### Bước 2: Thêm HTTP Request Defaults (Cấu hình chung)
Để tránh phải nhập lại địa chỉ server cho từng request, ta cấu hình một bộ thông số mặc định:
1. Nhấp chuột phải vào **Thread Group** -> **Add** -> **Config Element** -> **HTTP Request Defaults**.
2. Nhập các thông tin sau:
   - **Protocol:** `http` (hoặc `https`)
   - **Server Name or IP:** `localhost` (hoặc domain ứng dụng của bạn)
   - **Port Number:** `5173` (hoặc port ứng dụng React dev server đang chạy)

### Bước 3: Thêm HTTP Request Samplers (Các trang/API cần test)
1. **Kiểm thử trang chủ (GET /):**
   - Nhấp chuột phải vào **Thread Group** -> **Add** -> **Sampler** -> **HTTP Request**.
   - Đặt tên: `01_Load_Home_Page`.
   - Để trống phần Protocol, Server Name, Port (vì đã tự kế thừa từ *HTTP Request Defaults*).
   - **Method:** `GET`
   - **Path:** `/`
2. **Kiểm thử hành động kiểm tra ngày tháng (Nếu là gọi API hoặc tải lại trang kèm query):**
   - *Ví dụ ứng dụng Web Date Time Checker thực hiện validate client-side thuần, bạn có thể kiểm thử tải tĩnh các asset hoặc nếu có API validation backend, bạn cấu hình request POST/GET tương ứng.*
   - Tạo một **HTTP Request** mới. Đặt tên: `02_Check_Date_API`.
   - **Method:** `POST` (hoặc `GET`)
   - **Path:** `/api/check-date` (nếu có API) hoặc truyền tham số.
   - Thêm tham số tại tab **Parameters**: `day=31`, `month=12`, `year=2026`.

### Bước 4: Thêm Assertions (Xác thực kết quả phản hồi)
Để đảm bảo server không chỉ phản hồi nhanh mà còn trả về nội dung đúng:
1. Nhấp chuột phải vào `01_Load_Home_Page` -> **Add** -> **Assertions** -> **Response Assertion**.
2. Tại phần *Fields to Test*, chọn **Response Code**.
3. Tại phần *Pattern Matching Rules*, chọn **Equals**.
4. Bấm nút **Add** ở bên dưới và nhập vào: `200` (Xác thực HTTP Status Code trả về phải là 200 OK).

### Bước 5: Thêm Listeners để kiểm tra kịch bản (Chỉ dùng để Debug)
1. Nhấp chuột phải vào **Thread Group** -> **Add** -> **Listener** -> **View Results Tree** (dùng để xem chi tiết request/response của vài user đầu tiên xem cấu hình đúng chưa).
2. Nhấp chuột phải vào **Thread Group** -> **Add** -> **Listener** -> **Aggregate Report** (hiển thị bảng thống kê thời gian phản hồi trung bình, tỷ lệ lỗi...).
3. **Chạy thử kịch bản:** Bấm vào nút **Start** (biểu tượng Play màu xanh lá trên thanh công cụ). Quan sát kết quả trong *View Results Tree* xem các request có màu xanh lá (thành công) hay màu đỏ (lỗi).
4. **Lưu kịch bản:** Bấm **File** -> **Save Test Plan As** -> đặt tên và lưu lại dưới dạng file **`.jmx`** (ví dụ: `DatetimeCheckerTestPlan.jmx`).

---

## 4. Thực thi Kiểm thử bằng JMeter CLI (Non-GUI Mode)

> [!IMPORTANT]
> **Quy tắc bắt buộc:** Tuyệt đối **KHÔNG** sử dụng chế độ đồ họa (GUI) của JMeter để chạy kiểm thử tải thật sự (Load Test). Chế độ GUI tiêu tốn rất nhiều tài nguyên hệ thống (CPU/RAM) của máy test, dẫn đến việc kết quả đo bị sai lệch hoặc JMeter bị treo giữa chừng (OutOfMemory). Giao diện GUI chỉ dùng để viết và gỡ lỗi (debug) kịch bản.

### Quy trình chạy test chuẩn bằng CLI:

1. Đóng ứng dụng JMeter GUI lại.
2. Mở terminal (`cmd` hoặc `PowerShell`) và di chuyển đến thư mục chứa file kịch bản `.jmx` của bạn.
3. Chạy lệnh thực thi kiểm thử theo cú pháp sau:
   ```bash
   <Đường_dẫn_đến_JMeter>/bin/jmeter.bat -n -t DatetimeCheckerTestPlan.jmx -l results.jtl -e -o ./report
   ```

**Giải thích các tham số trong câu lệnh:**
* `-n`: Chỉ định chạy ở chế độ **Non-GUI** (chạy dòng lệnh).
* `-t <file.jmx>`: Đường dẫn tới file kịch bản test plan đã lưu.
* `-l <file.jtl>`: Đường dẫn tới file log kết quả sẽ xuất ra (định dạng `.jtl` hoặc `.csv`).
* `-e`: Chỉ định tự động sinh báo cáo HTML sau khi chạy test xong.
* `-o <thư_mục_report>`: Thư mục chứa báo cáo HTML (thư mục này phải trống hoặc chưa tồn tại, JMeter sẽ tự động tạo).

*Ví dụ lệnh thực tế chạy trên Windows:*
```powershell
C:\apache-jmeter-5.6.3\bin\jmeter.bat -n -t DatetimeCheckerTestPlan.jmx -l results.jtl -e -o ./report
```

Trong quá trình chạy, terminal sẽ in ra các dòng log cập nhật tiến độ sau mỗi 15 giây hiển thị số lượng Threads hoạt động, TPS trung bình và Response Time hiện tại. Khi chạy xong, màn hình sẽ thông báo hoàn thành và báo cáo đã được lưu vào thư mục `./report`.

---

## 5. Xuất và Đọc hiểu Báo cáo hiệu năng (HTML Report Dashboard)

Sau khi hoàn thành bài test, hãy vào thư mục `report/` vừa được sinh ra và kích đúp chuột vào file **`index.html`** để mở báo cáo trên trình duyệt.

### 5.1. Các thông tin quan trọng nhất cần phân tích:

#### 1. Bảng Dashboard chính (Apdex Score)
* **Apdex (Application Performance Index):** Chỉ số đo lường mức độ hài lòng của người dùng dựa trên thời gian phản hồi, có giá trị từ `0` (rất kém) đến `1` (tuyệt vời).
  - Cột **Apdex T (Threshold):** Ngưỡng thời gian phản hồi chấp nhận được (mặc định là 0.5s).
  - Cột **Apdex F:** Ngưỡng thời gian phản hồi khiến người dùng khó chịu (mặc định là 1.5s).
  - Nếu điểm Apdex đạt từ `0.9` trở lên, hệ thống đáp ứng tốt trải nghiệm người dùng dưới tải.

#### 2. Bảng thống kê tổng hợp (Statistics Table)
Đây là bảng chứa các con số định lượng cốt lõi nhất của bài test:
* **Label:** Tên của từng HTTP Request sampler.
* **Samples:** Tổng số lượt request đã gửi đi trong toàn bộ bài test.
* **KO (Error %):** Tỷ lệ request bị lỗi. Ngưỡng chấp nhận được thường phải dưới **`1%`**.
* **Average (ms):** Thời gian phản hồi trung bình (1000ms = 1s).
* **90th Percentile (ms):** Thời gian phản hồi của 90% người dùng. Chỉ số này phản ánh thực tế tốt hơn trung bình (Average) vì nó loại bỏ được các giá trị đột biến quá cao.
* **Throughput (Transactions/s):** Số lượng request/giao dịch mà server xử lý được trên mỗi giây. Chỉ số này thể hiện năng lực chịu tải thực sự của server.

#### 3. Các biểu đồ trực quan (Charts)
Hãy di chuyển menu bên trái để xem các biểu đồ phân tích sâu:
* **Over Time -> Response Time Over Time:** Biểu đồ hiển thị thời gian phản hồi biến thiên theo thời gian chạy test. Nếu đồ thị đi lên dốc đứng khi số user tăng lên, server đang có dấu hiệu chậm đi rõ rệt.
* **Over Time -> Active Threads Over Time:** Số lượng user đồng thời hoạt động tại mỗi thời điểm.
* **Throughput -> Hits Per Second / Transactions Per Second:** Biểu đồ so sánh lượng tải gửi vào (Hits) và lượng tải xử lý được (TPS). Nếu TPS đi ngang (bị giới hạn) trong khi Hits vẫn tăng, server đã đạt ngưỡng giới hạn hiệu năng.

---

## 6. Các lỗi thường gặp và cách khắc phục khi Test tải

1. **Lỗi `java.lang.OutOfMemoryError` trên máy test:**
   - *Nguyên nhân:* Dung lượng bộ nhớ RAM gán cho JMeter JVM mặc định quá thấp (thường là 1GB).
   - *Cách sửa:* Mở file `jmeter.bat` bằng text editor, tìm dòng `set HEAP=-Xms1g -Xmx1g` đổi thành `set HEAP=-Xms2g -Xmx2g` (tăng lên 2GB hoặc cao hơn tùy thuộc vào RAM máy của bạn).
2. **Tỷ lệ lỗi Connection Timeout (Lỗi kết nối) cao:**
   - *Nguyên nhân:* Server quá tải không kịp tiếp nhận connection mới, hoặc firewall/hệ thống mạng chặn các request dồn dập từ 1 địa chỉ IP của máy test.
   - *Cách sửa:* Kiểm tra cấu hình log của server để xem server có bị quá tải CPU/RAM hay không. Nếu kiểm thử local, tăng giới hạn kết nối của server web.
3. **Màn hình báo lỗi "Report directory is not empty" khi chạy lệnh CLI:**
   - *Nguyên nhân:* Thư mục chỉ định xuất report đã tồn tại dữ liệu của lần chạy trước.
   - *Cách sửa:* Xóa thư mục `report` cũ đi hoặc đổi tên thư mục đầu ra trong lệnh CLI (ví dụ: `./report_run2`).
