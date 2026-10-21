/* eslint-disable @typescript-eslint/no-var-requires, global-require */
const {
  publicPosts, validateBlogList, fetchBlogList, sha256,
} = require('../scripts/cms-snapshot');

const body = JSON.stringify([
  { name: 'blog.md', slug: 'blog', meta: { title: 'Blog' } },
  { name: 'a.md', slug: 'blog.a', meta: { title: 'A' } },
]);

const response = (status: number, text: string) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => text,
});

describe('scripts/cms-snapshot', () => {
  it('counts public posts, excluding the blog index', () => {
    expect(publicPosts(JSON.parse(body))).toHaveLength(1);
    expect(publicPosts({ error: 'x' })).toEqual([]);
  });

  it('rejects non-JSON and post-less lists', () => {
    expect(() => validateBlogList('<html>')).toThrow(/did not return JSON/);
    expect(() => validateBlogList('[]')).toThrow(/no public posts/);
    expect(() => validateBlogList('{"error":"API rate limit exceeded"}')).toThrow(/no public posts/);
    expect(validateBlogList(body).count).toBe(1);
  });

  it('retries a failing CMS, then returns the raw body', async () => {
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce(response(500, '{"error":"rate limit"}'))
      .mockResolvedValueOnce(response(200, body));
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(fetchBlogList(fetchImpl, [0, 0])).resolves.toBe(body);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('gives up after the retries', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(500, 'down'));
    await expect(fetchBlogList(fetchImpl, [0, 0])).rejects.toThrow(/HTTP 500/);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('hashes the raw body', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});
