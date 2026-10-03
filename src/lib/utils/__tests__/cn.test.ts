import { cn } from '../cn';

describe('cn utility', () => {
	it('merges class names', () => {
		const result = cn('foo', 'bar');
		expect(result).toContain('foo');
		expect(result).toContain('bar');
	});

	it('handles conditional classes', () => {
		const result = cn('base', true && 'conditional', false && 'not-included');
		expect(result).toContain('base');
		expect(result).toContain('conditional');
		expect(result).not.toContain('not-included');
	});

	it('merges conflicting Tailwind classes', () => {
		const result = cn('p-4', 'p-6');
		// tailwind-merge should keep only the last one
		expect(result).toBe('p-6');
	});

	it('handles undefined and null', () => {
		const result = cn('base', undefined, null, 'end');
		expect(result).toContain('base');
		expect(result).toContain('end');
	});

	it('handles arrays', () => {
		const result = cn(['foo', 'bar'], 'baz');
		expect(result).toContain('foo');
		expect(result).toContain('bar');
		expect(result).toContain('baz');
	});

	it('handles objects', () => {
		const result = cn({
			foo: true,
			bar: false,
			baz: true,
		});
		expect(result).toContain('foo');
		expect(result).not.toContain('bar');
		expect(result).toContain('baz');
	});

	it('handles empty input', () => {
		const result = cn();
		expect(result).toBe('');
	});

	it('merges complex class combinations', () => {
		const result = cn('base-class', 'p-4', 'p-6', { 'conditional-class': true }, ['array-class']);
		expect(result).toContain('base-class');
		expect(result).toContain('conditional-class');
		expect(result).toContain('array-class');
		// p-6 should override p-4
		expect(result).toBe('base-class p-6 conditional-class array-class');
	});
});
