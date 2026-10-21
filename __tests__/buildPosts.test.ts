import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';

import {
  blogSlugsForBuild, findBuildPost, loadBlogPostsForBuild, resetBuildPostsCache,
} from '../helpers/buildPosts';
import { getStaticPaths, getStaticProps } from '../pages/blog/[slug]';

jest.mock('axios');
jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }));
const mockedAxios = axios as jest.Mocked<typeof axios>;

const posts = [
  {
    name: 'blog.md', slug: 'blog', content: '', meta: { title: 'Blog' },
  },
  {
    name: 'a.md', slug: 'blog.first', content: 'Hello', meta: { title: 'First', public: true },
  },
  {
    name: 'b.md', slug: 'blog.hidden', content: 'Shh', meta: { title: 'Hidden', public: false },
  },
];

const writeSnapshot = (data: unknown) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-'));
  const file = path.join(dir, 'blog.json');
  fs.writeFileSync(file, JSON.stringify(data));
  return file;
};

describe('build-time blog posts', () => {
  const originalSnapshot = process.env.CMS_SNAPSHOT;

  afterEach(() => {
    if (originalSnapshot === undefined) delete process.env.CMS_SNAPSHOT;
    else process.env.CMS_SNAPSHOT = originalSnapshot;
    resetBuildPostsCache();
    jest.resetAllMocks();
  });

  it('reads the snapshot once and never calls the CMS when CMS_SNAPSHOT is set', async () => {
    process.env.CMS_SNAPSHOT = writeSnapshot(posts);
    const readSpy = jest.spyOn(fs, 'readFileSync');
    await loadBlogPostsForBuild();
    await loadBlogPostsForBuild();
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).not.toHaveBeenCalled();
    readSpy.mockRestore();
  });

  it('pre-renders public posts only', async () => {
    process.env.CMS_SNAPSHOT = writeSnapshot(posts);
    expect(await blogSlugsForBuild()).toEqual(['first']);
    const result = await getStaticPaths({});
    expect(result).toEqual({ paths: [{ params: { slug: 'first' } }], fallback: false });
  });

  it('fails the build when the CMS has no public posts', async () => {
    process.env.CMS_SNAPSHOT = writeSnapshot([posts[0], posts[2]]);
    await expect(getStaticPaths({})).rejects.toThrow(/refusing to build a blog-less site/);
  });

  it('fails the build when the CMS request fails', async () => {
    delete process.env.CMS_SNAPSHOT;
    mockedAxios.get.mockRejectedValue(new Error('HTTP 500'));
    await expect(getStaticPaths({})).rejects.toThrow('HTTP 500');
  });

  it('fetches from the CMS when there is no snapshot', async () => {
    delete process.env.CMS_SNAPSHOT;
    mockedAxios.get.mockResolvedValue({ data: posts });
    expect((await findBuildPost('first'))?.meta.title).toBe('First');
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringMatching(/\/blog$/));
  });

  it('getStaticProps returns the post, or notFound for private/unknown slugs', async () => {
    process.env.CMS_SNAPSHOT = writeSnapshot(posts);
    const found = await getStaticProps({ params: { slug: 'first' } });
    expect(found).toEqual({ props: { post: expect.objectContaining({ slug: 'blog.first' }) } });
    expect(await getStaticProps({ params: { slug: 'hidden' } })).toEqual({ notFound: true });
    expect(await getStaticProps({ params: { slug: 'nope' } })).toEqual({ notFound: true });
  });
});
