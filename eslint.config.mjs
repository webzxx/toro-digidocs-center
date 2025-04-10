import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";

export default [
  {
    name: "ESLint Config - nextjs",
    ignores: [
      ".next/**",
      "node_modules/**",
      ".api/**",
      "dist/**",
      "build/**",
    ],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
    plugins: {
      "@next/next": pluginNext,
      "react-hooks": reactHooksPlugin,
      "react": reactPlugin,
      "tailwindcss": tailwindcssPlugin,
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "warn",
      "comma-dangle": ["error", "always-multiline"],
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/no-contradicting-classname": "error",
    },
  },
];
