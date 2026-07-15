# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-checker.spec.js >> Date Time Checker - Visual Regression Tests >> V-01: Verify default landing page visual layout
- Location: tests\e2e\visual-checker.spec.js:10:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  10747 pixels (ratio 0.02 of all image pixels) are different.

  Snapshot: landing-page-default.png

Call log:
  - Expect "toHaveScreenshot(landing-page-default.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 10747 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 10747 pixels (ratio 0.02 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - img [ref=e7]
      - generic [ref=e10]: Form
    - button "Close" [ref=e12] [cursor=pointer]:
      - img [ref=e13]
  - generic [ref=e16]:
    - generic [ref=e17]:
      - img "FPT Logo" [ref=e19]
      - heading "Date Time Checker" [level=1] [ref=e20]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]: Day
        - textbox "Day" [ref=e24]:
          - /placeholder: 1-31
      - generic [ref=e25]:
        - generic [ref=e26]: Month
        - textbox "Month" [ref=e27]:
          - /placeholder: 1-12
      - generic [ref=e28]:
        - generic [ref=e29]: Year
        - textbox "Year" [ref=e30]:
          - /placeholder: 1000-3000
      - generic [ref=e31]:
        - button "Clear" [ref=e32] [cursor=pointer]
        - button "Check" [ref=e33] [cursor=pointer]
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Date Time Checker - Visual Regression Tests', () => {
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/');
  8  |   });
  9  | 
  10 |   test('V-01: Verify default landing page visual layout', async ({ page }) => {
  11 |     // Chụp và so sánh toàn bộ trang hiển thị
> 12 |     await expect(page).toHaveScreenshot('landing-page-default.png');
     |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  13 |   });
  14 | 
  15 |   test('V-02: Verify main window container visual details', async ({ page }) => {
  16 |     // Chỉ so sánh khu vực form giao diện chính để bỏ qua khoảng trắng xung quanh
  17 |     const form = page.locator('.window-container');
  18 |     await expect(form).toHaveScreenshot('window-container-default.png');
  19 |   });
  20 | 
  21 |   test('V-03: Verify form visual state when inputting data', async ({ page }) => {
  22 |     // Điền dữ liệu vào các ô nhập liệu
  23 |     await page.locator('#txtDay').fill('15');
  24 |     await page.locator('#txtMonth').fill('06');
  25 |     await page.locator('#txtYear').fill('2024');
  26 | 
  27 |     // Chụp lại form khi đang chứa dữ liệu nhập vào
  28 |     const form = page.locator('.window-container');
  29 |     await expect(form).toHaveScreenshot('window-container-with-inputs.png');
  30 |   });
  31 | 
  32 |   test('V-04: Verify close confirmation message box visual', async ({ page }) => {
  33 |     // Bấm nút đóng (X) để hiển thị MsgBox xác nhận đóng
  34 |     await page.locator('.window-btn-close').click();
  35 |     
  36 |     // Đợi hộp thoại xác nhận hiển thị
  37 |     const msgBox = page.locator('.msgbox-container');
  38 |     await expect(msgBox).toBeVisible();
  39 | 
  40 |     // Chụp ảnh riêng khu vực hộp thoại xác nhận đóng
  41 |     await expect(msgBox).toHaveScreenshot('close-confirm-msgbox.png');
  42 |   });
  43 | 
  44 |   test('V-05: Verify date result message box visual', async ({ page }) => {
  45 |     // Điền một ngày nhuận hợp lệ và nhấn Check
  46 |     await page.locator('#txtDay').fill('29');
  47 |     await page.locator('#txtMonth').fill('02');
  48 |     await page.locator('#txtYear').fill('2024');
  49 |     await page.locator('#btnCheck').click();
  50 | 
  51 |     // Đợi hộp thoại hiển thị kết quả kiểm tra
  52 |     const resultBox = page.locator('.msgbox-container');
  53 |     await expect(resultBox).toBeVisible();
  54 | 
  55 |     // Chụp ảnh riêng hộp thoại hiển thị kết quả kiểm tra ngày đúng
  56 |     await expect(resultBox).toHaveScreenshot('date-result-correct-msgbox.png');
  57 |   });
  58 | 
  59 | });
  60 | 
```