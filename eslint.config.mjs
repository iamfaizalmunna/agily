import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/appearance/icon-registry.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message:
                "Import icons only in icon-registry.tsx; use <AppIcon name=\"…\" /> elsewhere.",
            },
            {
              name: "@tabler/icons-react",
              message: "Use icon-registry.tsx and AppIcon.",
            },
            {
              name: "@phosphor-icons/react",
              message: "Use icon-registry.tsx and AppIcon.",
            },
            {
              name: "@heroicons/react/24/outline",
              message: "Use icon-registry.tsx and AppIcon.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "apps/**",
    "packages/**",
    "e2e/**",
    "playwright.config.ts",
  ]),
]);

export default eslintConfig;
