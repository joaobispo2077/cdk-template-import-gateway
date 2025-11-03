import { environments } from './environments';

export enum Stage {
	DEV = 'dev',
	UAT = 'uat',
	PROD = 'prod',
}

export type EnvironmentConfig = {
	ENV_NAME: string;
	REGION: string;
	STAGE_REGION: string;
	SERVICE_NAME: string;
	DEPLOYMENT_BUCKET_PREFIX: string;
	CDK_BOOTSTRAP_CONFIG_SSM: string;
	restApiId: string;
	rootResourceId: string;
};

export interface BaseConfig {
	serviceName: string;
	params: EnvironmentConfig;
	env: { region: string; stage: string };
}

export type ExtraTags = Record<string, string>;

export const ENV_CONFIG: Record<Stage, EnvironmentConfig> = {
	[Stage.DEV]: environments.dev,
	[Stage.UAT]: environments.uat,
	[Stage.PROD]: environments.prod,
};

export function getEnvironmentConfig(stage: Stage): EnvironmentConfig {
	return ENV_CONFIG[stage];
}
