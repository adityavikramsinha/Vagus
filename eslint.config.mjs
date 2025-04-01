import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";

export default [
    js.configs.recommended, // Base JS rules
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
        },
        plugins: { "@typescript-eslint": ts },
        rules: ts.configs.recommended.rules,
    },
    next.configs.recommended, // Next.js recommended rules
    {
        rules: {
            "react/react-in-jsx-scope": "off", // Next.js has automatic React import
            "import/no-anonymous-default-export": "off",
        },
    },
];

