import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended" // Explicitly include TypeScript recommended rules
  ),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type
      "@typescript-eslint/no-unused-vars": "off", // Allow unused variables/imports
      "@next/next/no-img-element": "off", // Allow <img> elements
      "react-hooks/exhaustive-deps": "off", // Disable missing dependency warnings
      "@typescript-eslint/prefer-as-const": "off", // Disable prefer-as-const error
    },
  },
];

export default eslintConfig;
