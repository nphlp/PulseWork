import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            ".github/**",
            "prettier.config.mjs",
            "postcss.config.mjs",
            "vitest.config.mjs",
            "prisma/client/**",
            "next-env.d.ts",
        ],
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: { project: true, tsconfigRootDir: __dirname },
        },
        plugins: {
            "react-refresh": reactRefresh,
            "unused-imports": unusedImports,
        },
        rules: {
            "react-refresh/only-export-components": [
                "warn",
                {
                    allowConstantExport: true,
                    allowExportNames: [
                        // Page authorized exports
                        "metadata",
                        "generateMetadata",
                        "generateStaticParams",
                        "generateViewport",
                        "generateImageMetadata",
                        // OpenGraph image authorized exports
                        "alt",
                        "size",
                        "contentType",
                    ],
                },
            ],
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": "warn",
            "@typescript-eslint/no-deprecated": "error",
        },
    },
];

export default eslintConfig;
