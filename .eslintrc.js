module.exports = {
  root: true,
  extends: ["@cablanchard", "plugin:compat/recommended"],
  env: { browser: true },
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
};
