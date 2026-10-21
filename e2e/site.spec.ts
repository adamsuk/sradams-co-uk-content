import { test, expect, settle } from './fixtures';

// A post that has existed for years; its page is pre-rendered from the CMS at build time.
const KNOWN_POST = { slug: 'mr-manager', title: 'Mr Manager' };

test('home: photo, featured card and the metrics toggle', async ({ page }) => {
  await page.goto('/');
  const photo = page.getByRole('button', { name: /Show the next source/ }).first();
  await expect(photo).toBeVisible();
  const card = page.getByTestId('source-card');
  await expect(card).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hi, I.m Scott/ })).toBeVisible();
  await expect(page.getByText('Latest post', { exact: false }).first()).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('home.png');

  await card.getByRole('button', { name: "This week's metrics" }).click();
  await expect(card.getByRole('button', { name: 'Back' })).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await settle(page);
  await expect(page).toHaveScreenshot('home-metrics.png');
  await card.getByRole('button', { name: 'Back' }).click();
  await expect(card.getByRole('button', { name: "This week's metrics" })).toBeVisible();

  await photo.click();
  await expect(card).toBeVisible();
});

test('blog: lists posts', async ({ page }) => {
  await page.goto('/blog');
  const posts = page.locator('main a[href^="/blog/"]');
  await expect(posts.first()).toBeVisible();
  expect(await posts.count()).toBeGreaterThan(0);
  await settle(page);
  await expect(page).toHaveScreenshot('blog.png');
});

test('blog post: a known post renders its title', async ({ page }) => {
  const response = await page.goto(`/blog/${KNOWN_POST.slug}`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: KNOWN_POST.title })).toBeVisible();
  await expect(page.locator('article .prose')).not.toBeEmpty();
});

test('cv: renders', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.getByText(/Neural Foundry/).first()).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('cv.png');
});

test('sandbox: the calculator works', async ({ page }) => {
  await page.goto('/sandbox/?component=calculator');
  await expect(page.getByRole('heading', { name: 'Sandbox' })).toBeVisible();
  await ['7', '+', '8', '='].reduce(
    (previous, key) => previous.then(() => page.locator(`button[value="${key}"]`).click()),
    Promise.resolve(),
  );
  await expect(page.locator('#calculator-screen')).toHaveValue('15');
  await settle(page);
  await expect(page).toHaveScreenshot('sandbox-calculator.png');
});

test.describe('404', () => {
  // The browser logs the document's own 404 response.
  test.use({ allowedConsoleErrors: [/status of 404/] });

  test('unknown pages show the 404 page', async ({ page }) => {
    const response = await page.goto('/definitely-not-a-page');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/Uh oh/)).toBeVisible();
  });
});
