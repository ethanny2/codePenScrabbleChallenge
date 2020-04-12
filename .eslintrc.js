module.exports = {
  plugins: ["prettier"],
  rules: {
    "no-unused-vars": 1,
    "eslint linebreak-style": [0, "error", "windows"]
  },
  env: {
    browser: true,
    node: true
  },
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaVersion: 11
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"]
};
