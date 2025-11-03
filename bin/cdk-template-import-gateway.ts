#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { CdkTemplateImportGatewayStack } from '../lib/cdk-template-import-gateway-stack';
import {
	BaseConfig,
	ExtraTags,
	getEnvironmentConfig,
} from '../configs/cdk/config';
import {
	createSynthesizer,
	SynthesizerSSMConfig,
} from './synthesizer/create-synthesizer';

async function main() {
	const app = new cdk.App();

	const stage = app.node.tryGetContext('stage') ?? 'dev';
	const envName =
		(app.node.tryGetContext('env') as 'dev' | 'uat' | 'prod') ?? 'dev';
	const region = app.node.tryGetContext('region') ?? 'us-east-1';
	console.log(
		`▶️  Deploying stage: ${stage}, env: ${envName}, region: ${region}`,
	);

	const configs = getEnvironmentConfig(stage);
	console.log('Config:', {
		...configs,
	});

	const defaultExtraTags: ExtraTags = {
		ServiceName: configs.SERVICE_NAME,
		EnvironmentName: configs.ENV_NAME,
		DeployedBy: 'CDK',
		Region: configs.REGION,
		Stage: stage,
	};

	const synthesizerSSMConfig: SynthesizerSSMConfig = {
		cdkBootstrapConfigSSM: configs.CDK_BOOTSTRAP_CONFIG_SSM,
		bucketPrefix: configs.SERVICE_NAME,
		region: configs.REGION,
	};
	console.debug(
		'SynthesizerSSMConfig:',
		JSON.stringify(synthesizerSSMConfig, null, 2),
	);

	const synthesizer = await createSynthesizer(synthesizerSSMConfig);
	console.debug('Synthesizer instance:', synthesizer);

	const baseStackProps: BaseConfig = {
		serviceName: configs.SERVICE_NAME,
		params: configs,
		env: { region: configs.REGION, stage: stage },
	};

	new CdkTemplateImportGatewayStack(app, 'CdkTemplateImportGatewayStack', {
		stackName: `CdkTemplateImportGatewayStack-${stage}`,
		description: `CDK Template Import Gateway Stack - ${stage} environment`,
		env: { region: configs.REGION },
		base: baseStackProps,
		extraTags: defaultExtraTags,
		synthesizer,
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
