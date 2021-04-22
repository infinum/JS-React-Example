import * as crypto from 'crypto';

export function hash(plainTextPassword, hashKey, algorithm = 'sha512') {
	const hash = crypto.createHmac(algorithm, hashKey);

	hash.update(plainTextPassword);

	return hash.digest('hex');
}
