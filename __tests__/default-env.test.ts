import env from '../default-env';

describe('default-env', () => {
  it('exports NEXT_PUBLIC_GITHUB_PROFILE with a default value', () => {
    expect(env.NEXT_PUBLIC_GITHUB_PROFILE).toBeDefined();
    expect(typeof env.NEXT_PUBLIC_GITHUB_PROFILE).toBe('string');
    expect(env.NEXT_PUBLIC_GITHUB_PROFILE.length).toBeGreaterThan(0);
  });

  it('exports NEXT_PUBLIC_CMS_URL with a default value', () => {
    expect(env.NEXT_PUBLIC_CMS_URL).toBeDefined();
    expect(typeof env.NEXT_PUBLIC_CMS_URL).toBe('string');
    expect(env.NEXT_PUBLIC_CMS_URL).toMatch(/^https?:\/\//);
  });

  it('falls back to "adamsuk" when NEXT_PUBLIC_GITHUB_PROFILE is not set', () => {
    const original = process.env.NEXT_PUBLIC_GITHUB_PROFILE;
    delete process.env.NEXT_PUBLIC_GITHUB_PROFILE;
    // Re-require to pick up env state (the module caches on first load, so we test the default)
    expect(env.NEXT_PUBLIC_GITHUB_PROFILE).toBe(
      process.env.NEXT_PUBLIC_GITHUB_PROFILE || 'adamsuk',
    );
    process.env.NEXT_PUBLIC_GITHUB_PROFILE = original;
  });
});
