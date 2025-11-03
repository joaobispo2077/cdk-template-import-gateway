import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

/**
 * Fetches a parameter value from AWS SSM Parameter Store.
 * Throws an error if the parameter is missing or empty.
 */
export async function getSsmValue(
	name: string,
	region: string,
): Promise<string> {
	const ssm = new SSMClient({ region });
	const command = new GetParameterCommand({ Name: name });
	const response = await ssm.send(command);

	if (!response.Parameter?.Value) {
		throw new Error(`Missing SSM parameter: ${name}`);
	}

	return response.Parameter.Value;
}
