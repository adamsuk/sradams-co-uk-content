module.exports = {
  reactStrictMode: true,
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
  },
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    domains: ['github.com'],
  },
  env: {
    NEXT_PUBLIC_ENV: process.env.NODE_ENV,
  },
};
