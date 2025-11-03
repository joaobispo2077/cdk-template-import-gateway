import * as cdk from 'aws-cdk-lib';
import { getSsmValue } from '../utils/ssm-utils';

/**
 * Interface to define the required SSM parameter names for synthesizer config.
 */
export interface SynthesizerSSMConfig {
	cdkBootstrapConfigSSM: string;
	bucketPrefix: string;
	region: string;
}

/**
 * Creates a DefaultStackSynthesizer using values from SSM parameters.
 */
export async function createSynthesizer(
	config: SynthesizerSSMConfig,
): Promise<cdk.DefaultStackSynthesizer> {
	console.debug(`Fetching ssm config from region: ${config.region}`);
	const cdkBootstrapConfig = await getSsmValue(
		config.cdkBootstrapConfigSSM,
		config.region,
	);

	const parsedConfig = JSON.parse(cdkBootstrapConfig);
	console.debug('Parsed bootstrap SSM config:', parsedConfig);

	return new cdk.DefaultStackSynthesizer({
		qualifier: parsedConfig.qualifier,
		fileAssetsBucketName: parsedConfig.fileAssetsBucketName,
		cloudFormationExecutionRole: parsedConfig.cloudFormationExecutionRole,
		deployRoleArn: parsedConfig.deployRoleArn,
		fileAssetPublishingRoleArn: parsedConfig.fileAssetPublishingRoleArn,
		imageAssetPublishingRoleArn: parsedConfig.imageAssetPublishingRoleArn,
		lookupRoleArn: parsedConfig.lookupRoleArn,
		bucketPrefix: config.bucketPrefix,
	});
}
