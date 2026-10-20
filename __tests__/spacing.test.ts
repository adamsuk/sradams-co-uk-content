import fs from 'fs';
import path from 'path';

/**
 * In this theme spacing-8 is 5rem. Page and card margins used it to clear the old
 * in-flow footer; with the fixed footer (#211) it is dead space, so 1.5rem (4) is used.
 */
function sources(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

describe('spacing', () => {
  it('uses no 5rem (spacing-8) margins or padding in pages and components', () => {
    const root = path.join(__dirname, '..');
    const offenders = ['pages', 'components', 'styles']
      .flatMap((dir) => sources(path.join(root, dir)))
      .flatMap((file) => {
        const text = fs.readFileSync(file, 'utf8');
        const pattern = /(?:^|[\s"'`:])-?(?:m|p)[trblxy]?-8(?![\w-])|(?<![\d.])5rem/g;
        const found = text.match(pattern) || [];
        return found.map((match) => `${path.relative(root, file)}: ${match.trim()}`);
      });
    expect(offenders).toEqual([]);
  });
});
