import fs from 'fs';
import path from 'path';

// The custom Tailwind spacing scale doesn't map numbers to the default rem values, so the
// homepage's left column width uses arbitrary values. Guard the wide-layout cap of 22rem.
const source = fs.readFileSync(path.join(__dirname, '../pages/index.tsx'), 'utf8');

describe('homepage wide layout', () => {
  it('lets the left column grow to 22rem', () => {
    expect(source).toContain('lg:landscape:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]');
    expect(source).toContain('lg:landscape:max-w-[22rem] lg:landscape:flex-col');
  });

  it('lets the profile photo fill the wider column', () => {
    expect(source).toMatch(/max-w-\[16rem\][^"]*lg:landscape:w-full lg:landscape:max-w-\[22rem\]/);
  });
});
