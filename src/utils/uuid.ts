import crypto from 'node:crypto';

const generateUUID = (): string => {
	return crypto.randomUUID();
};

export { generateUUID };
