import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: [
            "**/*.d.ts",
            "**/*.js", // ignore generated JS files
            "lib/**/*", // ignore generated JS map files
        ],
        languageOptions: {
            parser: typescriptEslintParser,
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier: prettier,
            "react-hooks": reactHooks,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            ...prettierConfig.rules,
            "prettier/prettier": "error",
            "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
            "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
        },
    },
];
