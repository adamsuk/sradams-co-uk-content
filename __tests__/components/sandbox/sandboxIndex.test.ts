import sandboxes from '../../../components/sandbox';

describe('sandbox index', () => {
  it('exports an array of sandbox items', () => {
    expect(Array.isArray(sandboxes)).toBe(true);
    expect(sandboxes.length).toBeGreaterThan(0);
  });

  it('each sandbox item has a title, slug, and component', () => {
    sandboxes.forEach((item) => {
      expect(typeof item.title).toBe('string');
      expect(typeof item.slug).toBe('string');
      expect(typeof item.component).toBe('function');
    });
  });

  it('includes a Calculator sandbox', () => {
    expect(sandboxes.find((s) => s.slug === 'calculator')).toBeDefined();
  });

  it('includes a Pico8 Game sandbox', () => {
    expect(sandboxes.find((s) => s.slug === 'pico8')).toBeDefined();
  });

  it('includes a Dynamic Quiz sandbox', () => {
    expect(sandboxes.find((s) => s.slug === 'quiz')).toBeDefined();
  });
});
