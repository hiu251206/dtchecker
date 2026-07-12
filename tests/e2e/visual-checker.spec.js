// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Date Time Checker - Visual Regression Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('V-01: Verify default landing page visual layout', async ({ page }) => {
    // Chụp và so sánh toàn bộ trang hiển thị
    await expect(page).toHaveScreenshot('landing-page-default.png');
  });

  test('V-02: Verify main window container visual details', async ({ page }) => {
    // Chỉ so sánh khu vực form giao diện chính để bỏ qua khoảng trắng xung quanh
    const form = page.locator('.window-container');
    await expect(form).toHaveScreenshot('window-container-default.png');
  });

  test('V-03: Verify form visual state when inputting data', async ({ page }) => {
    // Điền dữ liệu vào các ô nhập liệu
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('06');
    await page.locator('#txtYear').fill('2024');

    // Chụp lại form khi đang chứa dữ liệu nhập vào
    const form = page.locator('.window-container');
    await expect(form).toHaveScreenshot('window-container-with-inputs.png');
  });

  test('V-04: Verify close confirmation message box visual', async ({ page }) => {
    // Bấm nút đóng (X) để hiển thị MsgBox xác nhận đóng
    await page.locator('.window-btn-close').click();
    
    // Đợi hộp thoại xác nhận hiển thị
    const msgBox = page.locator('.msgbox-container');
    await expect(msgBox).toBeVisible();

    // Chụp ảnh riêng khu vực hộp thoại xác nhận đóng
    await expect(msgBox).toHaveScreenshot('close-confirm-msgbox.png');
  });

  test('V-05: Verify date result message box visual', async ({ page }) => {
    // Điền một ngày nhuận hợp lệ và nhấn Check
    await page.locator('#txtDay').fill('29');
    await page.locator('#txtMonth').fill('02');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();

    // Đợi hộp thoại hiển thị kết quả kiểm tra
    const resultBox = page.locator('.msgbox-container');
    await expect(resultBox).toBeVisible();

    // Chụp ảnh riêng hộp thoại hiển thị kết quả kiểm tra ngày đúng
    await expect(resultBox).toHaveScreenshot('date-result-correct-msgbox.png');
  });

});
