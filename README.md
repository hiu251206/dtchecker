# Date Time Checker

A web application that validates dates (day/month/year) according to the Gregorian calendar.  
Course project for **SWT301** — FPT University.

## Features

- Input **Day**, **Month**, and **Year** to check if the date exists.
- Validate input format and range (Day: 1–31, Month: 1–12, Year: 1000–3000).
- Accurately handle leap years based on Gregorian rules (divisible by 400 → leap, divisible by 100 → common, divisible by 4 → leap).
- Windows Form simulated interface with custom MessageBox dialogs.

## Technologies

- **React** (Vite)
- **Vanilla CSS** (Glassmorphism design)
- **Vitest** (Unit testing)
- **Playwright** (E2E testing)

## Directory Structure

```text
.
├── src/                # Main source code
│   ├── app/            # Main App component
│   ├── components/     # Reusable UI components
│   ├── features/       # Business logic (DateChecker.js)
│   ├── hooks/          # Custom React hooks
│   └── styles/         # CSS styles
└── tests/              # Test files
    ├── e2e/            # Playwright E2E tests
    └── unit/           # Vitest unit tests
```

## Installation & Setup

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Run the Application

```bash
# Start the development server (Vite Dev Server)
npm run dev
```

---

## 🧪 Testing Quick Start

### 1. Initial Setup
Run the following commands to install dependencies and Playwright browsers:
```bash
# Install project dependencies
npm install

# Install browser binaries required for Playwright E2E testing
npx playwright install
```

### 2. Unit Testing (Vitest)
Run the following commands to execute unit tests for date validation logic:
```bash
# 1. Run tests in watch mode
npm run test

# 2. Run tests once (useful for CI/CD)
npm run test:run

# 3. Open Vitest interactive Web UI
npm run test:ui

# 4. Run tests and generate coverage report
npm run test:report
```
*Note: After generating the coverage report, open `./coverage/index.html` in your browser to inspect details.*

### 3. End-to-End Testing (Playwright)
Playwright automatically runs the React development server before running tests:
```bash
# 1. Run all E2E tests in headless mode
npm run test:e2e

# 2. Open Playwright UI Mode for interactive debugging
npm run test:e2e:ui

# 3. View the HTML test report (includes video/screenshots on failure)
npm run test:e2e:report
```

### 4. Visual Regression Testing (Playwright)
Verify that the UI layout and look-and-feel remain intact and match the baseline screenshots:
```bash
# 1. Run visual regression tests (compares screenshots against baselines)
npx playwright test tests/e2e/visual-checker.spec.js

# 2. Update visual baseline screenshots (use this if you intentionally changed the UI design)
npx playwright test tests/e2e/visual-checker.spec.js --update-snapshots

# 3. View comparison UI if a visual test fails (uses visual diff side-by-side or slider)
npm run test:e2e:report
```
*Note: Snapshot baseline images are stored under `tests/e2e/visual-checker.spec.js-snapshots/`.*

### 5. AI-Assisted Testing (Gemini API)
Run interactive AI-assisted test generation and execution directly from your terminal:
```bash
# Run the interactive AI tester
npm run test:ai
```
Follow the terminal prompts:
1. **Choose test type**: Playwright E2E Test (Option 1) or Vitest Unit Test (Option 2).
2. **Enter the scenario**: Tell the AI what you want to verify (e.g., `"Kiểm tra ngày 29/02/2024 hợp lệ và 29/02/2023 không hợp lệ"`).
3. **Execution & Self-Healing**: The script requests Gemini API to generate the code, writes it to a file, and executes it. If the test fails, the script will ask if you want the AI to analyze the error log and fix/heal the test code automatically!

> [!NOTE]
> This requires a **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/). You can input the key when prompted, or save it beforehand in a `.env` file at the root:
> ```env
> GEMINI_API_KEY=your_actual_api_key_here
> ```
