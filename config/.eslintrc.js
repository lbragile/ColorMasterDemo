module.exports = {
  env: {
    es6: true,
    commonjs: true,
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12
  },
  plugins: ["react", "@typescript-eslint", "jest"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "default-case": "warn"
  }
};
