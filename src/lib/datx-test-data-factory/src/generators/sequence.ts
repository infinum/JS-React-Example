export const sequenceType = 'sequence' as const;

export interface SequenceGenerator<T> {
	type: typeof sequenceType;
	call: (counter: number) => T;
}

export const sequence = <T>(callback?: (counter: number) => T) => ({
	type: sequenceType,
	call: (counter: number) => {
		if (typeof callback === 'undefined') {
			return counter;
		}

		return callback(counter);
	},
});
