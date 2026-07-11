import { useState } from 'react';
import { isValidDate } from '@/features/DateChecker';

/**
 * Custom hook to manage the Date Checker form logic:
 * form state, input validation, checking process, clear, and close.
 *
 * @param {Function} openMessageBox - Function to show a message box dialog.
 * @returns {{ dayText, setDayText, monthText, setMonthText, yearText, setYearText, isAppOpen, setIsAppOpen, isChecking, handleClear, handleCloseClick, handleCheck }}
 */
export function useDateCheckerForm(openMessageBox) {
  // Form states
  const [dayText, setDayText] = useState('');
  const [monthText, setMonthText] = useState('');
  const [yearText, setYearText] = useState('');

  // App Window visibility state
  const [isAppOpen, setIsAppOpen] = useState(true);

  // Loading state (for the 1 second performance requirement)
  const [isChecking, setIsChecking] = useState(false);

  // Clear function
  const handleClear = () => {
    setDayText('');
    setMonthText('');
    setYearText('');
  };

  // Close function (clicking X button)
  const handleCloseClick = () => {
    openMessageBox(
      'Confirm',
      'Are you sure to exit?',
      'question',
      true, // isConfirm
      () => {
        // On Yes: close the app
        setIsAppOpen(false);
      },
      () => {
        // On No: do nothing
      }
    );
  };

  // Check Date Time function
  const handleCheck = () => {
    // 1. Validate Day Format
    const trimmedDay = dayText.trim();
    const day = parseInt(trimmedDay, 10);
    // Note: C# is using int.TryParse which fails for decimal strings like "12.3" or empty strings, or non-digits.
    // In JS, check if the string contains only digits (after trim) or conforms to integer parsing.
    const isDayInteger = /^\d+$/.test(trimmedDay);
    if (!isDayInteger || isNaN(day)) {
      openMessageBox('Error', 'Input data for Day is incorrect format!', 'error');
      return;
    }
    // Validate Day Range
    if (day < 1 || day > 31) {
      openMessageBox('Error', 'Input data for Day is out of range!', 'error');
      return;
    }

    // 2. Validate Month Format
    const trimmedMonth = monthText.trim();
    const month = parseInt(trimmedMonth, 10);
    const isMonthInteger = /^\d+$/.test(trimmedMonth);
    if (!isMonthInteger || isNaN(month)) {
      openMessageBox('Error', 'Input data for Month is incorrect format!', 'error');
      return;
    }
    // Validate Month Range
    if (month < 1 || month > 12) {
      openMessageBox('Error', 'Input data for Month is out of range!', 'error');
      return;
    }

    // 3. Validate Year Format
    const trimmedYear = yearText.trim();
    const year = parseInt(trimmedYear, 10);
    const isYearInteger = /^\d+$/.test(trimmedYear);
    if (!isYearInteger || isNaN(year)) {
      openMessageBox('Error', 'Input data for Year is incorrect format!', 'error');
      return;
    }
    // Validate Year Range
    if (year < 1000 || year > 3000) {
      openMessageBox('Error', 'Input data for Year is out of range!', 'error');
      return;
    }

    // All validation passed. Start checking process with 1s delay
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const isValid = isValidDate(day, month, year);
      if (isValid) {
        openMessageBox('Message', `${day}/${month}/${year} is correct date time!`, 'info');
      } else {
        openMessageBox('Message', `${day}/${month}/${year} is NOT correct date time!`, 'info');
      }
    }, 1000);
  };

  return {
    dayText, setDayText,
    monthText, setMonthText,
    yearText, setYearText,
    isAppOpen, setIsAppOpen,
    isChecking,
    handleClear,
    handleCloseClick,
    handleCheck
  };
}
