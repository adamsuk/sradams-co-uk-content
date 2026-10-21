/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { test as base, expect, Page } from '@playwright/test';

// Every request that leaves the local static server is answered from e2e/fixtures, so
// the tests are deterministic and never touch the CMS, GitHub or the activity feed.
const FIXTURES = path.join(__dirname, 'fixtures');
const fixture = (name: string) => fs.readFileSync(path.join(FIXTURES, name));
const PLACEHOLDER = fixture('placeholder.png');

const JSON_ROUTES: Array<[RegExp, string]> = [
  [/^https:\/\/blog\.sradams\.co\.uk\/api\/blog\/?$/, 'blog.json'],
  [/^https:\/\/blog\.sradams\.co\.uk\/api\/cv\/?$/, 'cv.json'],
  [/^https:\/\/activities\.sradams\.co\.uk\/feed\.json$/, 'feed.json'],
];

// Fixed "now" matching when the fixtures were captured, so relative dates are stable.
export const FIXED_NOW = new Date('2026-10-21T11:00:00+01:00');

async function mockNetwork(page: Page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => {
    const request = route.request();
    const url = request.url().split('?')[0];
    const json = JSON_ROUTES.find(([pattern]) => pattern.test(url));
    const cors = { 'access-control-allow-origin': '*' };
    if (json) {
      await route.fulfill({
        status: 200, contentType: 'application/json', headers: cors, body: fixture(json[1]),
      });
    } else if (/^https:\/\/raw\.githubusercontent\.com\/.+\/README\.md$/.test(url)) {
      await route.fulfill({
        status: 200, contentType: 'text/plain', headers: cors, body: fixture('readme.md'),
      });
    } else if (request.resourceType() === 'image' || /\.(png|jpe?g|gif|webp|svg)$/i.test(url)) {
      await route.fulfill({
        status: 200, contentType: 'image/png', headers: cors, body: PLACEHOLDER,
      });
    } else if (request.resourceType() === 'document') {
      // Embedded iframes (YouTube, pico8): an empty page.
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    } else {
      await route.fulfill({ status: 204, headers: cors, body: '' });
    }
  });
}

type Fixtures = { consoleErrors: string[]; allowedConsoleErrors: RegExp[] };

export const test = base.extend<Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  consoleErrors: [async ({ page, allowedConsoleErrors }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !allowedConsoleErrors.some((re) => re.test(text))) {
        errors.push(text);
      }
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    await page.clock.setFixedTime(FIXED_NOW);
    await mockNetwork(page);
    await use(errors);
    expect(errors, 'console errors').toEqual([]);
  }, { auto: true }],
});

export { expect };

/** The page scrolls inside <main id="main">; wait for images and fonts before a snapshot. */
export async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((img) => (img.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }))));
  });
}
