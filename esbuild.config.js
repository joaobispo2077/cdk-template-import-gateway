// esbuild.config.js
const esbuild = require("esbuild");
esbuild.build({
	entryPoints: ["src/handlers/templateLambda.js"],
	bundle: true,
	platform: "node",
	target: "node18",
	sourcemap: "external",
	minify: true, // ← turn on minification - This typically cuts bundle size by 30–50%, which can speed cold starts in Lambdas.
	external: ["aws-sdk"],
	outdir: "dist",
	entryNames: "[name]/index",
	define: { "process.env.NODE_CUSTOM_ENV": '"live"' },
	logLevel: "info",
}).catch(() => process.exit(1));

