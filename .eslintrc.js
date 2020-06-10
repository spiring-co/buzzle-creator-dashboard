module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    process: "readonly",
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
    modules: true,
  },
  parser: "babel-eslint",
  plugins: ["react", "jest"],
  rules: {
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "react/prop-types": "off",
    "no-unused-vars": "warn",
  },
};
