module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "airbnb-typescript"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/quotes": "off",
    "no-console": "off",
    // TypeScript handles default props via default parameter values
    "react/require-default-props": "off",
    // Allow both arrow functions and function declarations for components
    "react/function-component-definition": [
      "error",
      {
        namedComponents: ["function-declaration", "arrow-function"],
        unnamedComponents: "arrow-function",
      },
    ],
    // Allow prop spreading where explicitly disabled inline
    "react/jsx-props-no-spreading": "off",
    "max-len": [
      "error",
      {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
  },
};
