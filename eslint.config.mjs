import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "url";
import { dirname } from "path";
import globals from "globals";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(
	js.configs.recommended,
	prettierPlugin,
	eslintConfigPrettier,
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
			globals: {
				...globals.node,
				...globals.jest,
			},
		},
	},
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"lambda-dist/**",
			"cdk.out/**",
			"*.config.mjs",
			"*.mjs",
			"esbuild.config.js"
		],
	}
);
