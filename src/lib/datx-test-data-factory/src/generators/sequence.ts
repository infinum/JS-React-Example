export const sequenceType = 'sequence' as const;

export interface SequenceGenerator<T> {
	type: typeof sequenceType;
	call: (counter: number) => T;
}

export const sequence = <T>(userProvidedFunction: (counter: number) => T) => ({
	type: sequenceType,
	call: (counter: number) => {
		if (typeof userProvidedFunction === 'undefined') {
			return counter;
		}

		return userProvidedFunction(counter);
	},
});
