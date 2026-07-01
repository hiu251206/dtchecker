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

```
src/
├── app/            # App component chính
├── components/     # Các UI component tái sử dụng
├── features/       # Logic nghiệp vụ (DateChecker)
├── hooks/          # Custom React hooks
├── styles/         # Các file CSS
├── test/           # Unit tests
└── main.jsx        # Entry point
```

## Cài đặt & Chạy

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Chạy unit tests
npx vitest run

# Chạy E2E tests
npx playwright test
```

