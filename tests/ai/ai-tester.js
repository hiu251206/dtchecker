import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

// Load environment variables manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.slice(0, index).trim();
        const val = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\x1b[35m%s\x1b[0m', '==================================================');
  console.log('\x1b[35m%s\x1b[0m', '      🤖 DATETIME CHECKER - AI ASSISTED TESTER    ');
  console.log('\x1b[35m%s\x1b[0m', '==================================================');

  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ Không tìm thấy GEMINI_API_KEY trong file .env hoặc biến môi trường.');
    console.log('Bạn có thể lấy API Key miễn phí tại: https://aistudio.google.com/');
    const inputKey = await ask('Vui lòng nhập GEMINI_API_KEY của bạn: ');
    if (!inputKey.trim()) {
      console.error('\x1b[31m%s\x1b[0m', '❌ API Key không được để trống.');
      rl.close();
      process.exit(1);
    }
    apiKey = inputKey.trim();

    const saveEnv = await ask('Bạn có muốn lưu API Key này vào file .env không? (y/n): ');
    if (saveEnv.toLowerCase().startsWith('y')) {
      fs.writeFileSync(path.resolve(process.cwd(), '.env'), `GEMINI_API_KEY=${apiKey}\n`, { flag: 'a' });
      console.log('\x1b[32m%s\x1b[0m', '✅ Đã lưu GEMINI_API_KEY vào file .env');
    }
  }

  console.log('\n--- CHỌN LOẠI KIỂM THỬ ---');
  console.log('1. Playwright E2E Test (Kiểm thử giao diện toàn diện - KHUYÊN DÙNG)');
  console.log('2. Vitest Unit Test (Kiểm thử các hàm logic của DateChecker.js)');
  const choice = await ask('Chọn (1 hoặc 2, mặc định là 1): ');
  const isE2E = choice.trim() !== '2';

  const userPrompt = await ask('\nNhập kịch bản kiểm thử muốn chạy (Ví dụ: "Kiểm tra xem nhập ngày 29/02/2024 có báo là ngày hợp lệ không"): ');
  if (!userPrompt.trim()) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Kịch bản kiểm thử không được để trống.');
    rl.close();
    process.exit(1);
  }

  // Load context
  let context = '';
  if (isE2E) {
    try {
      const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/app/App.jsx'), 'utf8');
      context += `\n--- APP UI CODE (App.jsx) ---\n${appContent}\n`;
    } catch (e) {}

    try {
      const specContent = fs.readFileSync(path.resolve(process.cwd(), 'tests/e2e/date-checker.spec.js'), 'utf8');
      const specLines = specContent.split('\n').slice(0, 100).join('\n');
      context += `\n--- EXAMPLE PLAYWRIGHT TESTS ---\n${specLines}\n`;
    } catch (e) {}
  } else {
    try {
      const logicContent = fs.readFileSync(path.resolve(process.cwd(), 'src/features/DateChecker.js'), 'utf8');
      context += `\n--- DATE CHECKER LOGIC (DateChecker.js) ---\n${logicContent}\n`;
    } catch (e) {}

    try {
      const unitContent = fs.readFileSync(path.resolve(process.cwd(), 'tests/unit/DateChecker.test.js'), 'utf8');
      context += `\n--- EXAMPLE UNIT TESTS ---\n${unitContent}\n`;
    } catch (e) {}
  }

  const systemPrompt = `Bạn là một kỹ sư kiểm thử tự động (QA Automation Engineer) xuất sắc.
Nhiệm vụ của bạn là sinh mã nguồn kiểm thử (test code) bằng ngôn ngữ JavaScript dựa trên yêu cầu của người dùng.

Dưới đây là ngữ cảnh của mã nguồn hiện tại của dự án để bạn tham khảo cấu trúc các phần tử, tên ID, class CSS, hoặc hàm cần test:
${context}

Yêu cầu kiểm thử cụ thể của người dùng: "${userPrompt}"

${isE2E ? 
`HƯỚNG DẪN SINH PLAYWRIGHT E2E TEST:
- Sử dụng cấu trúc: import { test, expect } from '@playwright/test';
- Viết một ca kiểm thử hoặc nhóm ca kiểm thử (test.describe) để thực hiện đúng yêu cầu trên.
- Sử dụng baseURL '/' hoặc page.goto('/') để mở trang.
- Các ô nhập dữ liệu có ID: '#txtDay', '#txtMonth', '#txtYear'.
- Nút kiểm tra: '#btnCheck'.
- Nút xoá: '#btnClear'.
- Đóng form: '.window-btn-close'.
- Hộp thoại hiển thị kết quả có class: '.msgbox-container'.
- Nội dung thông điệp kết quả nằm trong class: '.msgbox-message'.
- Hãy viết mã sạch, hiện đại và kiểm tra kết quả một cách chính xác. Chú ý các điều kiện chờ như toBeVisible(), toHaveText() hoặc toContainText() của Playwright.` 
: 
`HƯỚNG DẪN SINH VITEST UNIT TEST:
- Sử dụng cấu trúc: import { describe, it, expect } from 'vitest';
- Sử dụng import { daysInMonth, isValidDate } from '@/features/DateChecker'; (Sử dụng alias @/features/DateChecker để import đúng file)
- Viết các test case thích hợp bằng hàm describe và it để kiểm thử các hàm trên.`
}

QUY TẮC QUAN TRỌNG:
- Trả về DUY NHẤT mã nguồn Javascript kiểm thử nằm trong khối mã Markdown (fenced code block) \`\`\`javascript ... \`\`\`.
- KHÔNG giải thích dông dài, KHÔNG thêm bất kỳ văn bản nào bên ngoài khối mã đó.`
;

  console.log('\n🤖 Đang gửi yêu cầu tới Gemini AI để sinh mã kiểm thử...');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Request thất bại với mã ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Không nhận được nội dung trả về từ Gemini API.');
    }

    const codeMatch = text.match(/```javascript([\s\S]*?)```/) || text.match(/```js([\s\S]*?)```/) || [null, text];
    let testCode = codeMatch[1].trim();

    const targetFile = isE2E 
      ? path.resolve(process.cwd(), 'tests/e2e/ai-generated.spec.js')
      : path.resolve(process.cwd(), 'tests/unit/ai-generated.test.js');

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, testCode, 'utf8');

    console.log(`\n💾 Đã tạo file kiểm thử thành công tại: \x1b[36m${targetFile}\x1b[0m`);
    console.log('\n--- MÃ KIỂM THỬ ĐÃ SINH ---');
    console.log(testCode);
    console.log('---------------------------\n');

    console.log('🚀 Đang tiến hành chạy kiểm thử tự động...');
    const command = isE2E 
      ? 'npx playwright test tests/e2e/ai-generated.spec.js'
      : 'npx vitest run tests/unit/ai-generated.test.js';

    console.log(`\x1b[32m$ ${command}\x1b[0m\n`);

    try {
      execSync(command, { stdio: 'inherit' });
      console.log('\n\x1b[32m%s\x1b[0m', '🎉 TẤT CẢ CÁC CA KIỂM THỬ ĐÃ THÔNG QUA (PASSED) THÀNH CÔNG!');
    } catch (runError) {
      console.log('\n\x1b[31m%s\x1b[0m', '❌ CÓ LỖI XẢY RA KHI CHẠY KIỂM THỬ (FAILED).');
      
      // Attempt self-healing
      let errorLog = '';
      try {
        errorLog = execSync(command, { stdio: 'pipe', encoding: 'utf8' });
      } catch (err) {
        errorLog = (err.stdout || '') + '\n' + (err.stderr || '');
      }

      console.log('\n--- CHI TIẾT LỖI TÓM TẮT ---');
      const lines = errorLog.split(/\r?\n/);
      console.log(lines.slice(-15).join('\n'));

      const debugChoice = await ask('\nBạn có muốn gửi lỗi này lên Gemini để tự động sửa mã test không? (y/n): ');
      if (debugChoice.toLowerCase().startsWith('y')) {
        console.log('\n🤖 Đang gửi lỗi và mã test hiện tại tới Gemini để tự phục hồi (Self-Healing)...');

        const healingPrompt = `Dưới đây là mã nguồn test đã sinh bị lỗi:
\`\`\`javascript
${testCode}
\`\`\`

Khi chạy test này bằng lệnh \`${command}\`, log lỗi chi tiết hiển thị bên dưới:
\`\`\`
${errorLog}
\`\`\`

Hãy phân tích lỗi kỹ càng và sinh lại toàn bộ mã test đã được sửa đổi và khắc phục triệt để lỗi trên.
Yêu cầu quan trọng: Trả về DUY NHẤT mã nguồn Javascript kiểm thử hoàn chỉnh nằm trong khối mã Markdown \`\`\`javascript ... \`\`\`. Không giải thích thêm.`;

        const healResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: healingPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.1
            }
          })
        });

        if (healResponse.ok) {
          const healData = await healResponse.json();
          const healText = healData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (healText) {
            const healCodeMatch = healText.match(/```javascript([\s\S]*?)```/) || healText.match(/```js([\s\S]*?)```/) || [null, healText];
            const healedCode = healCodeMatch[1].trim();
            fs.writeFileSync(targetFile, healedCode, 'utf8');

            console.log(`\n💾 Đã cập nhật mã test sửa lỗi tại: \x1b[36m${targetFile}\x1b[0m`);
            console.log('\n--- MÃ KIỂM THỬ MỚI ĐÃ SỬA ---');
            console.log(healedCode);
            console.log('------------------------------\n');
            console.log('🚀 Đang chạy lại kiểm thử...');
            
            try {
              execSync(command, { stdio: 'inherit' });
              console.log('\n\x1b[32m%s\x1b[0m', '🎉 SỬA LỖI THÀNH CÔNG! TẤT CẢ CÁC CA KIỂM THỬ ĐÃ THÔNG QUA (PASSED) VÀ KHÔNG CÒN LỖI!');
            } catch (retryError) {
              console.log('\n\x1b[31m%s\x1b[0m', '❌ Chạy lại vẫn thất bại. Vui lòng tự chỉnh sửa hoặc điều chỉnh kịch bản nhập vào.');
            }
          }
        } else {
          console.error('❌ Yêu cầu sửa lỗi thất bại từ phía Gemini API.');
        }
      }
    }

  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Đã xảy ra lỗi hệ thống: ${err.message}`);
  } finally {
    rl.close();
  }
}

main();
