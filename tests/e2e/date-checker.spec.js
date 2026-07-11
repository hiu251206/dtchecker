// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Date Time Checker E2E Tests - Full 43 Test Cases (Lab 1)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ====================== GUI Layout (11 test cases) ======================
  test('GUI-01: Verify FU Logo is displayed at top-left corner', async ({ page }) => {
    await expect(page.locator('img.brand-logo')).toBeVisible();
  });

  test('GUI-02: Verify title label "Date Time Checker" font and color', async ({ page }) => {
    const title = page.locator('.brand-title');
    await expect(title).toHaveText('Date Time Checker');
    await expect(title).toHaveCSS('font-family', /Arial/i);
    await expect(title).toHaveCSS('font-size', '26px');
    await expect(title).toHaveCSS('color', /rgb\(0, 0, 255\)/);
  });

  test('GUI-03: Verify Day, Month, Year labels are left-aligned', async ({ page }) => {
    await expect(page.locator('text=Day')).toBeVisible();
    await expect(page.locator('text=Month')).toBeVisible();
    await expect(page.locator('text=Year')).toBeVisible();
  });

  test('GUI-04: Verify exactly 3 textboxes exist on the form', async ({ page }) => {
    await expect(page.locator('#txtDay')).toBeVisible();
    await expect(page.locator('#txtMonth')).toBeVisible();
    await expect(page.locator('#txtYear')).toBeVisible();
  });

  test('GUI-05: Verify "Clear" and "Check" buttons are visible', async ({ page }) => {
    await expect(page.locator('#btnClear')).toHaveText('Clear');
    await expect(page.locator('#btnCheck')).toHaveText('Check');
  });

  test('GUI-06: Verify Maximize and Minimize buttons are absent', async ({ page }) => {
    await expect(page.locator('.window-btn-maximize')).not.toBeVisible();
    await expect(page.locator('.window-btn-minimize')).not.toBeVisible();
  });

  // Close Function
  test('GUI-07: Verify clicking X shows a confirmation message box', async ({ page }) => {
    await page.locator('.window-btn-close').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible();
    await expect(msg.locator('.msgbox-title')).toHaveText('Confirm');
  });

  test('GUI-08: Verify selecting "Yes" closes the application', async ({ page }) => {
    await page.locator('.window-btn-close').click();
    const msg = page.locator('.msgbox-container');
    await msg.locator('.msgbox-btn-primary').click();
    await expect(page.locator('.window-container')).toHaveClass(/closed/);
  });

  test('GUI-09: Verify selecting "No" keeps the application open', async ({ page }) => {
    await page.locator('.window-btn-close').click();
    const msg = page.locator('.msgbox-container');
    await msg.locator('.msgbox-btn-secondary').click();
    await expect(msg).not.toBeVisible();
    await expect(page.locator('.window-container')).not.toHaveClass(/closed/);
  });

  // Clear Function
  test('GUI-10: Verify Clear button empties all textboxes when data is present', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnClear').click();
    await expect(page.locator('#txtDay')).toHaveValue('');
    await expect(page.locator('#txtMonth')).toHaveValue('');
    await expect(page.locator('#txtYear')).toHaveValue('');
  });

  test('GUI-11: Verify Clear button causes no error when textboxes are already empty', async ({ page }) => {
    await page.locator('#btnClear').click();
    await expect(page.locator('#txtDay')).toHaveValue('');
  });

  // ====================== Input Validation ======================
  test('IV-01: Verify validation for non-numeric day input', async ({ page }) => {
    await page.locator('#txtDay').fill('abc');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible();
    await expect(msg.locator('.msgbox-message')).toContainText('Day is incorrect format');
  });

  test('IV-02: Verify validation for below valid range of day input', async ({ page }) => {
    await page.locator('#txtDay').fill('0');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Day is out of range');
  });

  test('IV-03: Verify validation for above valid range of day input', async ({ page }) => {
    await page.locator('#txtDay').fill('32');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Day is out of range');
  });

  test('IV-04: Verify validation for lower boundary day input', async ({ page }) => {
    await page.locator('#txtDay').fill('1');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('2000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('01/01/2000 is correct date time');
  });

  test('IV-05: Verify validation for upper boundary day input', async ({ page }) => {
    await page.locator('#txtDay').fill('31');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('2000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('31/01/2000 is correct date time');
  });

  // Month Validation
  test('IV-06: Verify validation for non-numeric month input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('xyz');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Month is incorrect format');
  });

  test('IV-07: Verify validation for below valid range of month input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('0');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Month is out of range');
  });

  test('IV-08: Verify validation for above valid range of month input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('13');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Month is out of range');
  });

  test('IV-09: Verify validation for lower boundary month input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('2000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('15/01/2000 is correct date time');
  });

  test('IV-10: Verify validation for upper boundary month input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('12');
    await page.locator('#txtYear').fill('2000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('15/12/2000 is correct date time');
  });

  // Year Validation
  test('IV-11: Verify validation for non-numeric year input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('8');
    await page.locator('#txtYear').fill('abcd');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Year is incorrect format');
  });

  test('IV-12: Verify validation for below valid range of year input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('8');
    await page.locator('#txtYear').fill('999');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Year is out of range');
  });

  test('IV-13: Verify validation for above valid range of year input', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('8');
    await page.locator('#txtYear').fill('3001');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Year is out of range');
  });

  test('IV-14: Verify validation for lower boundary year input', async ({ page }) => {
    await page.locator('#txtDay').fill('1');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('1000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('01/01/1000 is correct date time');
  });

  test('IV-15: Verify validation for upper boundary year input', async ({ page }) => {
    await page.locator('#txtDay').fill('1');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('3000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('01/01/3000 is correct date time');
  });

  test('IV-16: Verify validation when all textboxes are left empty', async ({ page }) => {
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('Day is incorrect format');
  });

  // ====================== Check Date Algorithm ======================
  test('CD-01: Verify validation for regular date', async ({ page }) => {
    await page.locator('#txtDay').fill('15');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('15/06/2024 is correct date time');
  });

  test('CD-03: Verify validation for day Feb 29 in a standard leap year', async ({ page }) => {
    await page.locator('#txtDay').fill('29');
    await page.locator('#txtMonth').fill('2');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('29/02/2024 is correct date time');
  });

  test('CD-06: Verify validation for day Feb 29 in a non-leap year', async ({ page }) => {
    await page.locator('#txtDay').fill('29');
    await page.locator('#txtMonth').fill('2');
    await page.locator('#txtYear').fill('1900');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('29/02/1900 is NOT correct date time');
  });

  test('CD-08: Verify validation for day 31 in a 30-day month', async ({ page }) => {
    await page.locator('#txtDay').fill('31');
    await page.locator('#txtMonth').fill('4');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('31/04/2024 is NOT correct date time');
  });

  test('CD-11: Verify validation for lower boundary date', async ({ page }) => {
    await page.locator('#txtDay').fill('1');
    await page.locator('#txtMonth').fill('1');
    await page.locator('#txtYear').fill('1000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('01/01/1000 is correct date time');
  });

  test('CD-12: Verify validation for upper boundary date', async ({ page }) => {
    await page.locator('#txtDay').fill('31');
    await page.locator('#txtMonth').fill('12');
    await page.locator('#txtYear').fill('3000');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg.locator('.msgbox-message')).toContainText('31/12/3000 is correct date time');
  });

  test('CD-13: Verify validation for day Feb 28 non-leap year', async ({ page }) => {
    await page.locator('#txtDay').fill('28');
    await page.locator('#txtMonth').fill('2');
    await page.locator('#txtYear').fill('2023');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible({ timeout: 2000 });
    await expect(msg.locator('.msgbox-message')).toHaveText('28/02/2023 is correct date time!');
  });

  test('CD-14: Verify validation for day 30 (upper boundary) in April', async ({ page }) => {
    await page.locator('#txtDay').fill('30');
    await page.locator('#txtMonth').fill('4');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible({ timeout: 2000 });
    await expect(msg.locator('.msgbox-message')).toHaveText('30/04/2024 is correct date time!');
  });

  test('CD-15: Verify validation for day 30 (upper boundary) in June', async ({ page }) => {
    await page.locator('#txtDay').fill('30');
    await page.locator('#txtMonth').fill('6');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible({ timeout: 2000 });
    await expect(msg.locator('.msgbox-message')).toHaveText('30/06/2024 is correct date time!');
  });

  test('CD-16: Verify validation for day 30 (upper boundary) in November', async ({ page }) => {
    await page.locator('#txtDay').fill('30');
    await page.locator('#txtMonth').fill('11');
    await page.locator('#txtYear').fill('2024');
    await page.locator('#btnCheck').click();
    const msg = page.locator('.msgbox-container');
    await expect(msg).toBeVisible({ timeout: 2000 });
    await expect(msg.locator('.msgbox-message')).toHaveText('30/11/2024 is correct date time!');
  });


});