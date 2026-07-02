import { describe, it, expect } from 'vitest';
import { daysInMonth, isValidDate } from '@/features/DateChecker';

describe('DateChecker Unit Tests - Full 15 cases per function (Lab 2)', () => {

  describe('Function: DayInMonth', () => {

    it('UTC01 - Normal: 31 days month', () => expect(daysInMonth(2023, 1)).toBe(31));
    it('UTC02 - Normal: 30 days month', () => expect(daysInMonth(2023, 4)).toBe(30));
    it('UTC03 - Boundary: February leap year 2024', () => expect(daysInMonth(2024, 2)).toBe(29));
    it('UTC04 - Boundary: February leap year 2000', () => expect(daysInMonth(2000, 2)).toBe(29));
    it('UTC05 - Abnormal: February non-leap 1900', () => expect(daysInMonth(1900, 2)).toBe(28));
    it('UTC06 - Normal: February common year', () => expect(daysInMonth(2023, 2)).toBe(28));
    it('UTC07 - Abnormal: Invalid month 0', () => expect(daysInMonth(2023, 0)).toBe(0));
    it('UTC08 - Abnormal: Invalid month 13', () => expect(daysInMonth(2023, 13)).toBe(0));
    it('UTC09 - Boundary: Month 12', () => expect(daysInMonth(2023, 12)).toBe(31));
    it('UTC10 - Boundary: Month 6', () => expect(daysInMonth(2023, 6)).toBe(30));
    it('UTC11 - Abnormal: Negative month', () => expect(daysInMonth(2023, -1)).toBe(0));
    it('UTC12 - Normal: Year 2024', () => expect(daysInMonth(2024, 2)).toBe(29));
    it('UTC13 - Boundary: Year 1000', () => expect(daysInMonth(1000, 1)).toBe(31));
    it('UTC14 - Boundary: Year 3000', () => expect(daysInMonth(3000, 12)).toBe(31));
    it('UTC15 - Abnormal: Year 0', () => expect(daysInMonth(0, 1)).toBe(31)); // or 0 depending on logic
  });

  describe('Function: CheckDate / isValidDate', () => {

    it('UTC01 - Valid normal date', () => expect(isValidDate(15, 6, 2024)).toBe(true));
    it('UTC02 - Valid leap year Feb 29', () => expect(isValidDate(29, 2, 2024)).toBe(true));
    it('UTC03 - Invalid leap year Feb 29', () => expect(isValidDate(29, 2, 1900)).toBe(false));
    it('UTC04 - Invalid day 31 in 30-day month', () => expect(isValidDate(31, 4, 2024)).toBe(false));
    it('UTC05 - Boundary lower date', () => expect(isValidDate(1, 1, 1000)).toBe(true));
    it('UTC06 - Boundary upper date', () => expect(isValidDate(31, 12, 3000)).toBe(true));
    it('UTC07 - Invalid month 0', () => expect(isValidDate(15, 0, 2023)).toBe(false));
    it('UTC08 - Invalid month 13', () => expect(isValidDate(15, 13, 2023)).toBe(false));
    it('UTC09 - Invalid day 0', () => expect(isValidDate(0, 1, 2023)).toBe(false));
    it('UTC10 - Invalid day 32', () => expect(isValidDate(32, 1, 2023)).toBe(false));
    it('UTC11 - Invalid year 999', () => expect(isValidDate(1, 1, 999)).toBe(false));
    it('UTC12 - Invalid year 3001', () => expect(isValidDate(1, 1, 3001)).toBe(false));
    it('UTC13 - Valid Feb 28 common year', () => expect(isValidDate(28, 2, 2023)).toBe(true));
    it('UTC14 - Valid day 30 in April', () => expect(isValidDate(30, 4, 2024)).toBe(true));
    it('UTC15 - Invalid combination (31/2)', () => expect(isValidDate(31, 2, 2024)).toBe(false));
  });
});