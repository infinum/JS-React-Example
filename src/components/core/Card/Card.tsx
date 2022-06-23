import { chakra, forwardRef, StyleProps } from '@chakra-ui/react';

export interface ICardProps extends StyleProps {}

export const Card = forwardRef<ICardProps, 'div'>((props, ref) => {
	return (
		<chakra.div
			bg="bg-surface"
			borderRadius={{ base: 'md', sm: 'xl' }}
			_dark={{
				shadow: { base: 'md', sm: 'md-dark' },
			}}
			_light={{ shadow: 'md' }}
			ref={ref}
			{...props}
		/>
	);
});
