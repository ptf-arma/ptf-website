import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // These are concatenated into one <script> context in a headless browser
    // rather than imported, so each file's helpers look unused from here even
    // though the next one calls them. render.mjs itself stays fully linted.
    files: ["scripts/op-assets/map.js", "scripts/op-assets/draw.js"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
]);

export default eslintConfig;
