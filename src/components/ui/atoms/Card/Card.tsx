import { chakra, forwardRef, omitThemingProps, ThemingProps, useStyleConfig, HTMLChakraProps } from '@chakra-ui/react';
import { cx, __DEV__ } from '@chakra-ui/utils';
import React from 'react';

export interface ICardProps extends HTMLChakraProps<'div'>, ThemingProps {}

export const Card = forwardRef<ICardProps, 'div'>(function Card(props, ref) {
	const styles = useStyleConfig('Card', props);

	const { className, ...rest } = omitThemingProps(props);

	const _className = cx('card', className);

	return <chakra.div ref={ref} className={_className} {...rest} __css={styles} />;
});

if (__DEV__) {
	Card.displayName = 'Card';
}
