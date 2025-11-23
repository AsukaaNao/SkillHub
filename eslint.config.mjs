import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ⬇️ --- START: ADD THIS NEW BLOCK HERE --- ⬇️
  {
    // Only apply these rules to test files
    files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"], 
    languageOptions: {
      globals: {
        // Manually define Jest globals as "readonly"
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
  // ⬆️ --- END: ADD THIS NEW BLOCK HERE --- ⬆️

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;