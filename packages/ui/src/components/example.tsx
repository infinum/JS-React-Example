import { cva, type VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';
import { cn } from '../utils/cn';

export interface ExampleComponentProps extends VariantProps<typeof exampleComponentVariants> {
	text: string;
	className?: ClassValue;
	ref?: React.Ref<HTMLDivElement>;
}

const exampleComponentVariants = cva('text-2xl', {
	// Variants
	variants: {
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		},
		weight: {
			light: 'font-light',
			normal: 'font-normal',
			bold: 'font-bold',
		},
	},
	// Default variants
	defaultVariants: {
		size: 'md',
		weight: 'normal',
	},
	// Compound variants
	compoundVariants: [
		{
			weight: 'bold',
			size: 'lg',
			className: 'text-red-500',
		},
		{
			weight: 'light',
			size: 'sm',
			className: 'text-blue-500',
		},
	],
});

export const ExampleComponent = ({ ref, className, text, size, weight, ...props }: ExampleComponentProps) => (
	<div
		ref={ref}
		className={cn(
			exampleComponentVariants({
				className,
				size,
				weight,
			}),
			className
		)}
		{...props}
	>
		{text}
	</div>
);
