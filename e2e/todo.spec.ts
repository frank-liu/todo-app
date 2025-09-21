import { test, expect } from '@playwright/test';

test.describe('Todo App E2E', () => {
    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL || 'http://localhost:3000');
    });

    test('adds a todo via button', async ({ page }) => {
        const input = page.getByPlaceholder('Add a new to-do...');
        await input.fill('Write E2E tests');
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByRole('listitem').filter({ hasText: 'Write E2E tests' })).toBeVisible();
    });

    test('adds a todo via Enter key', async ({ page }) => {
        const input = page.getByPlaceholder('Add a new to-do...');
        await input.fill('Add with Enter');
        await input.press('Enter');
        await expect(page.getByRole('listitem').filter({ hasText: 'Add with Enter' })).toBeVisible();
    });

    test('ignores whitespace-only input', async ({ page }) => {
        const input = page.getByPlaceholder('Add a new to-do...');
        await input.fill('   ');
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByRole('listitem')).toHaveCount(0);
    });

    test('toggle complete and delete', async ({ page }) => {
        const input = page.getByPlaceholder('Add a new to-do...');
        await input.fill('Toggle me');
        await page.getByRole('button', { name: 'Add' }).click();

        const item = page.getByRole('listitem').filter({ hasText: 'Toggle me' });
        await expect(item).toBeVisible();

        const toggleButton = page.getByRole('button', { name: /Mark "Toggle me" as (complete|incomplete)/i });
        await expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
        await toggleButton.click();
        await expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

        await page.getByRole('button', { name: 'Delete "Toggle me"' }).click();
        await expect(item).toHaveCount(0);
    });

    test('input is accessible by label text', async ({ page }) => {
        await expect(page.getByLabel('Enter a new to-do item')).toBeVisible();
    });
});
