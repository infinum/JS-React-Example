import { Operation, ResourceAttributes } from 'kurier';
import { hash } from './utils/hash';

// Assume `hash` is a function that takes care of hashing a plain-text
// password with a given salt.
export async function userLoginCallback(op: Operation, user: ResourceAttributes) {
	return (
		op.data?.attributes.email === user.email &&
		hash(op.data.attributes.password, process.env.SESSION_KEY) === user.password
	);
}

// Assume `hash` is a function that takes care of hashing a plain-text
// password with a given salt.
export async function userEncryptPasswordCallback(op: Operation) {
	return {
		password: hash(op.data?.attributes.password, process.env.SESSION_KEY),
	};
}

// This is not production-ready.
export async function userGenerateIdCallback() {
	return Date.now().toString();
}
