// lib/cdk-template-import-gateway-stack.ts
import {
	Aws,
	CfnOutput,
	DefaultStackSynthesizer,
	Duration,
	RemovalPolicy,
	Stack,
	StackProps,
	Tags,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import { BaseConfig, ExtraTags } from '../configs/cdk/config';

export interface ImportGatewayStackProps extends StackProps {
	base: BaseConfig;
	extraTags: ExtraTags;
	synthesizer: DefaultStackSynthesizer;
}

export class CdkTemplateImportGatewayStack extends Stack {
	constructor(scope: Construct, id: string, props: ImportGatewayStackProps) {
		super(scope, id, props);

		const { stackName, base, extraTags } = props;
		const { params, env: baseEnv } = base;

		const stageName = baseEnv.stage;

		const accountId = Stack.of(this).account;

		Object.entries(extraTags ?? {}).forEach(([k, v]) =>
			Tags.of(this).add(k, v),
		);

		// 🔹 Import existing API
		const api: apigw.IRestApi = apigw.RestApi.fromRestApiAttributes(
			this,
			'ImportedApi',
			{
				restApiId: params.restApiId,
				rootResourceId: params.rootResourceId,
			},
		);

		if (!api) {
			throw new Error(
				'Provide restApiId and rootResourceId in params to import the API.',
			);
		}

		const logGroupStackName = `${stackName}-log-group`;
		const functionName = `${stackName}-lambda`;
		const logGroupName = `/aws/lambda/${functionName}`;

		const logGroup = new logs.LogGroup(this, logGroupStackName, {
			logGroupName,
			retention: logs.RetentionDays.ONE_YEAR,
			removalPolicy: RemovalPolicy.DESTROY,
		});

		// 🔹 Lambda (account id injected via env var)
		const fn = new nodejs.NodejsFunction(this, 'StatusFunction', {
			functionName,
			description: `Lambda Template (${stageName})`,
			runtime: lambda.Runtime.NODEJS_22_X,
			code: lambda.Code.fromAsset(
				path.join(__dirname, '../dist/templateLambda'),
			),
			handler: 'index.handler',
			memorySize: 256,
			timeout: Duration.seconds(25),
			environment: {
				AWS_ACCOUNT_ID: accountId,
				STAGE_NAME: stageName,
				REGION: params.REGION,
			},
			logGroup,
		});

		// 🔹 Attach to some resource under the imported API
		//    Adjust `params.pathPart` to whatever you use in your config
		const resource = api.root.addResource('dogs');
		resource.addMethod(
			'POST',
			new apigw.LambdaIntegration(fn, { proxy: true }),
		);

		new CfnOutput(this, 'LambdaFunctionArn', {
			value: fn.functionArn,
			exportName: `${Aws.STACK_NAME}:LambdaArn`,
		});
	}
}
