// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Date Time Checker API Tests', () => {

  // ====================== 1. Input Format Validation ======================
  test('API-01: Verify validation for non-numeric day input', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: 'abc', month: '6', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Day is incorrect format');
  });

  test('API-02: Verify validation for non-numeric month input', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: 'xyz', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Month is incorrect format');
  });

  test('API-03: Verify validation for non-numeric year input', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '6', year: 'abcd' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Year is incorrect format');
  });

  test('API-04: Verify validation when fields are left empty', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '', month: '6', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Day is incorrect format');
  });

  test('API-05: Verify validation when fields contain decimals', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15.5', month: '6', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Day is incorrect format');
  });

  // ====================== 2. Input Range Validation ======================
  test('API-06: Verify validation for day below valid range (0)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '0', month: '6', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Day is out of range');
  });

  test('API-07: Verify validation for day above valid range (32)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '32', month: '6', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Day is out of range');
  });

  test('API-08: Verify validation for month below valid range (0)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '0', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Month is out of range');
  });

  test('API-09: Verify validation for month above valid range (13)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '13', year: '2024' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Month is out of range');
  });

  test('API-10: Verify validation for year below valid range (999)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '6', year: '999' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Year is out of range');
  });

  test('API-11: Verify validation for year above valid range (3001)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '6', year: '3001' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('Year is out of range');
  });

  // ====================== 3. Boundary Value Analysis ======================
  test('API-12: Verify validation for lower boundary date (01/01/1000)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '1', month: '1', year: '1000' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('01/01/1000 is correct date time');
  });

  test('API-13: Verify validation for upper boundary date (31/12/3000)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '31', month: '12', year: '3000' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('31/12/3000 is correct date time');
  });

  // ====================== 4. Date Checking Logic ======================
  test('API-14: Verify validation for standard valid date (15/06/2024)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '15', month: '6', year: '2024' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('15/06/2024 is correct date time');
  });

  test('API-15: Verify validation for day Feb 29 in a standard leap year (2024)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '29', month: '2', year: '2024' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('29/02/2024 is correct date time');
  });

  test('API-16: Verify validation for day Feb 29 in a leap year divisible by 400 (2000)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '29', month: '2', year: '2000' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('29/02/2000 is correct date time');
  });

  test('API-17: Verify validation for day Feb 29 in a non-leap year divisible by 100 but not 400 (1900)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '29', month: '2', year: '1900' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('29/02/1900 is NOT correct date time');
  });

  test('API-18: Verify validation for day Feb 29 in a common year (2023)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '29', month: '2', year: '2023' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('29/02/2023 is NOT correct date time');
  });

  test('API-19: Verify validation for day Feb 28 in a common year (2023)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '28', month: '2', year: '2023' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('28/02/2023 is correct date time');
  });

  test('API-20: Verify validation for day 31 in a 30-day month (31/04/2024)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '31', month: '4', year: '2024' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(false);
    expect(body.message).toBe('31/04/2024 is NOT correct date time');
  });

  test('API-21: Verify validation for day 30 in a 30-day month (30/04/2024)', async ({ request }) => {
    const response = await request.post('/api/check-date', {
      data: { day: '30', month: '4', year: '2024' }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.isValid).toBe(true);
    expect(body.message).toBe('30/04/2024 is correct date time');
  });

});
