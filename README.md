# Playwright TypeScript Demo Project

A comprehensive Playwright test automation project with various UI testing scenarios.

## Project Structure

- `tests/UI_Tests/` - Main UI test files
- `tests/UI_Tests/Practice_tests/` - Practice and demo tests
- `tests/TestData/` - Test data files (JSON, CSV, Excel)
- `e2e/` - End-to-end test examples
- `playwright-report/` - Test execution reports
- `test-results/` - Test execution results

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

- Run all tests: `npx playwright test`
- Run specific test: `npx playwright test <test-file-name>`
- Run tests in headed mode: `npx playwright test --headed`
- Generate report: `npx playwright show-report`

## Test Categories

- **Web Order Tests** - E-commerce order management testing
- **OHRM Tests** - Orange HRM application testing
- **Visual Testing** - Screenshot comparison tests
- **Data-Driven Tests** - Tests using CSV, JSON, and Excel data
- **Interactive Tests** - Drag & drop, mouse hover, window handling
- **Database Tests** - Database integration testing

## Technologies Used

- Playwright
- TypeScript
- Node.js
