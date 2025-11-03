import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.jest.json',
				diagnostics: false,
			},
		],
	},
	testMatch: ['**/tests/**/*.test.ts'],
};

export default config;
