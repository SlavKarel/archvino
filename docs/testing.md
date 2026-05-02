# Testing

This document describes the testing setup for the project, including the testing stack, running tests, and best practices.

## Testing Stack

The project uses two testing frameworks for different purposes:

- **Unit Tests**: [Vitest](https://vitest.dev/) - Fast unit testing framework for React components and utility functions
- **E2E Tests**: [Playwright](https://playwright.dev/) - End-to-end testing for browser interactions and user flows

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run e2e tests with Playwright |
| `npm run test:e2e -- --ui` | Run e2e tests with UI mode |

## Configuration Files

### Vitest Configuration

Location: `vitest.config.ts`

Vitest is configured for unit testing with the following features:
- Fast HMR (Hot Module Replacement)
- Snapshot testing support
- Coverage reporting (when run with coverage flag)
- TypeScript support

### Playwright Configuration

The project has two Playwright configuration files:

- `playwright.config.ts` - Base configuration for e2e tests
- `playwright.preview.config.ts` - Configuration for testing against the preview server

Playwright is configured to:
- Test against the preview server (`npm run preview`)
- Store test results in `test-results/` directory
- Generate screenshots on test failure
- Support parallel test execution

## Running Tests

### Unit Tests

Run all unit tests:

```bash
npm run test:unit
```

Vitest will run all test files matching the pattern `**/*.test.{ts,tsx}` or `**/*.spec.{ts,tsx}` in the project.

### E2E Tests

Run e2e tests against the preview server:

```bash
npm run test:e2e
```

This command:
1. Starts the preview server
2. Runs Playwright tests
3. Shuts down the preview server when complete

For interactive testing with the Playwright UI:

```bash
npm run test:e2e -- --ui
```

## Test Structure

```
archvino/
├── tests/                    # Test fixtures and utilities
│   └── ...
├── *.test.{ts,tsx}          # Unit test files
├── *.spec.{ts,tsx}          # Additional test files
├── e2e/                     # E2E test files
│   └── ...
├── test-results/            # Playwright test results (generated)
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright base configuration
└── playwright.preview.config.ts  # Playwright preview configuration
```

## Best Practices

### Unit Tests

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Use descriptive test names** - Test names should describe the scenario being tested
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Keep tests independent** - Tests should not depend on each other or execution order
5. **Mock external dependencies** - Use Vitest's `vi.fn()` and `vi.mock()` for mocking

Example unit test structure:

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('ComponentName', () => {
  it('should do something specific when condition is met', () => {
    // Arrange
    const props = { ... }

    // Act
    const result = functionUnderTest(props)

    // Assert
    expect(result).toBe(expectedValue)
  })
})
```

### E2E Tests

1. **Test user workflows** - Focus on critical user paths and happy paths
2. **Use realistic data** - Tests should reflect real user scenarios
3. **Handle async operations** - Wait for elements to be visible before interacting
4. **Clean up after tests** - Ensure tests don't leave residual state
5. **Use page objects** - Abstract page interactions into reusable objects

Example e2e test structure:

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Flow', () => {
  test('should complete primary user action', async ({ page }) => {
    // Navigate
    await page.goto('/')

    // Interact
    await page.click('[data-testid="action-button"]')

    // Assert
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })
})
```

### Test Data Attributes

Use `data-testid` attributes for element selection in tests:

```jsx
<button data-testid="submit-button">Submit</button>
```

This ensures tests are resilient to UI changes that don't affect functionality.

## CI/CD Considerations

### Running Tests in CI

For CI environments, run tests in the correct order:

```bash
# Build the project first
npm run build

# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e
```

### Test CI Configuration

Example GitHub Actions workflow:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test:unit
      - run: npm run test:e2e
```

### Test Reports

- **Vitest**: Test results are printed to console. Add `--coverage` flag for coverage reports
- **Playwright**: HTML reports are generated in `test-results/` directory. Use `playwright show-report` to view

### Parallel Execution

Vitest runs tests in parallel by default. Playwright can be configured to run tests in parallel by setting `workers` in the config:

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
})
```

## Troubleshooting

### Tests timeout

If tests timeout, check:
- Server is running (for e2e tests)
- Network connectivity
- Increase timeout in config if needed

### Flaky tests

To address flaky tests:
- Add explicit waits for dynamic content
- Use `expect.poll()` for async assertions
- Increase test timeout if needed
- Check for race conditions in test setup

### Playwright not found

If Playwright browsers are not installed:

```bash
npx playwright install
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/) - For React component testing utilities