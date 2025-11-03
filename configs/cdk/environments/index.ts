import { dev } from './dev';
import { uat } from './uat';
import { prod } from './prod';

export const environments = { dev, uat, prod } as const;
