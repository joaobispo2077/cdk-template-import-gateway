import { EnvironmentConfig } from '../config';

export const dev: EnvironmentConfig = {
	restApiId: 'r04nlykls1',
	rootResourceId: 'mx062l29zj',
	ENV_NAME: 'dev',
	REGION: 'us-east-1',
	STAGE_REGION: 'dev-us-east-1',
	SERVICE_NAME: 'cdk-import-gateway-template',
	DEPLOYMENT_BUCKET_PREFIX: 'cdk-import-gateway-template/prefix',
	CDK_BOOTSTRAP_CONFIG_SSM: '/apps/dev-use1/cdk-bootstrap/config',
};
