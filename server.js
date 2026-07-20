import express from 'express';
import cors from 'cors';
import { isValidDate } from './src/features/DateChecker.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API check date
app.post('/api/check-date', (req, res) => {
  const { day, month, year } = req.body;

  // 1. Kiểm tra format: Phải tồn tại và là số nguyên
  // Helper function kiểm tra xem một giá trị có phải là số nguyên hợp lệ hay không
  const isIntegerString = (val) => {
    if (val === undefined || val === null) return false;
    const str = String(val).trim();
    if (str === '') return false;
    // Regex kiểm tra số nguyên (chỉ chứa các ký số, không chứa ký tự đặc biệt, dấu chấm thập phân)
    // Cho phép dấu âm/dương ở đầu nếu cần, nhưng ở đây ngày tháng năm đều dương
    return /^\d+$/.test(str);
  };

  if (!isIntegerString(day)) {
    return res.status(400).json({
      isValid: false,
      message: 'Day is incorrect format'
    });
  }

  if (!isIntegerString(month)) {
    return res.status(400).json({
      isValid: false,
      message: 'Month is incorrect format'
    });
  }

  if (!isIntegerString(year)) {
    return res.status(400).json({
      isValid: false,
      message: 'Year is incorrect format'
    });
  }

  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  // 2. Kiểm tra range
  if (d < 1 || d > 31) {
    return res.status(400).json({
      isValid: false,
      message: 'Day is out of range'
    });
  }

  if (m < 1 || m > 12) {
    return res.status(400).json({
      isValid: false,
      message: 'Month is out of range'
    });
  }

  if (y < 1000 || y > 3000) {
    return res.status(400).json({
      isValid: false,
      message: 'Year is out of range'
    });
  }

  // 3. Kiểm tra logic ngày hợp lệ
  const valid = isValidDate(d, m, y);

  // Định dạng hiển thị ngày/tháng với 2 chữ số (ví dụ: 01/02/2024)
  const formattedDay = d < 10 ? `0${d}` : d;
  const formattedMonth = m < 10 ? `0${m}` : m;
  const dateStr = `${formattedDay}/${formattedMonth}/${y}`;

  if (valid) {
    return res.json({
      isValid: true,
      message: `${dateStr} is correct date time`
    });
  } else {
    return res.json({
      isValid: false,
      message: `${dateStr} is NOT correct date time`
    });
  }
});

app.listen(PORT, () => {
  console.log(`API Server is running on http://localhost:${PORT}`);
});
