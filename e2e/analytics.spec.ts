import { test, expect } from '@playwright/test';

test('posts Web Vitals to /api/annotations in dev when env is set', async ({ page }) => {
  const requests: Array<{ url: string; body: any }> = [];

  await page.route('**/api/annotations', async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();
    requests.push({ url: request.url(), body: postData });
    // Simulate Grafana OK
    await route.fulfill({ status: 204, body: '' });
  });

  await page.goto('/');

  // Wait a bit for web-vitals collection to trigger on load
  await page.waitForTimeout(500);

  // Assert at least one annotation was posted
  expect(requests.length).toBeGreaterThan(0);
  const first = requests[0];
  // It should include tags and a text field when using annotations
  expect(Array.isArray(first.body?.tags)).toBeTruthy();
  expect(typeof first.body?.text).toBe('string');
});
