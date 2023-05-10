import { chakra, forwardRef, StyleProps } from '@chakra-ui/react';

export type ICardProps = StyleProps;

export const Card = forwardRef<ICardProps, 'div'>((props, ref) => {
	return (
		<chakra.div
			bg="chakra-body-bg"
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
